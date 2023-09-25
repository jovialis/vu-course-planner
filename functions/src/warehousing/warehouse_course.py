from google.cloud.firestore_v1 import DocumentSnapshot
from google.cloud.firestore_v1.base_query import FieldFilter

from src.utils.consensus_decider import ConsensusDecider
from src.utils.init_firestore import init_firestore


ACTIVE_YEARS_THRESHOLD = 2  # The number of years a course can go hiatus before it's considered inactive
INDEX_YEARS_THRESHOLD = 4  # How many years to index for space purposes


def warehouse_course(course_id: str, force=False):
    """
    Reads through all available Sections for a given Course and generates a usable Course based on
    its historical availability and a few recency-weighted consensus mechanisms
    """

    db = init_firestore()

    # Skip if this has already been warehoused
    if not force:
        existing = db.collection("courses").document(course_id).get()
        if existing.exists:
            return existing.to_dict()

    # Grab all of the Sections for that course ID
    section_docs = db.collection_group("sections").where(
        filter=FieldFilter("course.abbreviation", "==", course_id)
    ).order_by("term", "ASCENDING").get()

    # Checks if this is an Umbrella course
    is_umbrella = __is_umbrella_course(
        list(map(lambda sec: sec.get("course.name"), section_docs))
    )

    if is_umbrella:
        return __warehouse_umbrella_course(course_id, section_docs)
    else:
        return __warehouse_single_course(course_id, section_docs)


def __warehouse_single_course(course_id: str, section_docs: list[DocumentSnapshot]):
    """
    Reads through all available Sections for a given Course and generates a usable Course based on
    its historical availability and a few recency-weighted consensus mechanisms.
    """

    import re

    db = init_firestore()

    course_number = int(re.search(r'\b\d{4}', course_id).group())

    # Schema for the object we're going to be creating here
    course_listing = {
        "id": course_id,
        "name": ConsensusDecider(),
        "description": ConsensusDecider(),
        "course_type": "single",
        "subject": course_id.split(" ")[0],
        "number": course_number,  # Regex extract the course number
        "school": ConsensusDecider(),
        "hours": ConsensusDecider(),
        "attributes": ConsensusDecider(),
        "prerequisites": ConsensusDecider(),
        # What semesters are sections available in
        "listings": {},
        # In which semesters the course is available in
        "availability": {},
        "active": False
    }

    listing_template, availability_template, earliest_active_term_id, earliest_recording_term_id = __generate_warehoused_term_templates()
    course_listing["listings"] = listing_template
    course_listing["availability"] = availability_template

    # Iterate through sections that we've found and update the course listing
    for section in section_docs:
        doc_data = section.to_dict()

        course_name = doc_data["course"]["name"]
        course_hours = doc_data["hours"]
        section_id = doc_data["id"]
        section_term = doc_data["term"]
        section_number = doc_data["number"]
        section_instructors = doc_data["instructors"]
        section_notes = None

        # If the course has occurred at some point in the last two years, mark it active
        section_term_number_value = int(section_term)
        if section_term_number_value >= earliest_active_term_id:
            course_listing["active"] = True

        # Skip sections that are too early for us to continue
        elif section_term_number_value < earliest_recording_term_id:
            continue

        # Decide by consensus on name and hours
        course_listing["name"].put(course_name, section_term_number_value)
        course_listing["hours"].put(course_hours, section_term_number_value)

        if doc_data["details"] is not None:
            section_desc = doc_data["details"]["description"]
            section_notes = doc_data["details"]["notes"]
            section_school = doc_data["details"]["school"]
            section_prereqs = doc_data["details"]["requirements"]
            section_attributes = doc_data["details"]["attributes"]

            # Decide by consensus on school, description, prereqs, attributes
            course_listing["school"].put(section_school, section_term_number_value)
            course_listing["description"].put(section_desc, section_term_number_value)
            course_listing["attributes"].put(section_attributes, section_term_number_value)
            course_listing["prerequisites"].put(section_prereqs, section_term_number_value)

        course_listing["listings"][section_term].append({
            "section_id": section_id,
            "section_number": section_number,
            "section_notes": section_notes,
            "section_instructors": section_instructors
        })

        course_listing["availability"][section_term] = True

    # Arbitrate all the consensus fields
    course_listing["name"] = course_listing["name"].arbitrate()
    course_listing["description"] = course_listing["description"].arbitrate()
    course_listing["school"] = course_listing["school"].arbitrate()
    course_listing["hours"] = course_listing["hours"].arbitrate()
    course_listing["attributes"] = course_listing["attributes"].arbitrate()
    course_listing["prerequisites"] = course_listing["prerequisites"].arbitrate()

    # Set the course listing
    db.collection("courses").document(course_id).set(course_listing)
    return course_listing


def __is_umbrella_course(course_titles: list[str]) -> bool:
    """
    Determines whether or not a Course is an Umbrella course based on all of the names used by the Course's listings.
    An umbrella course (e.g. Special Topics) will have a ton of different titles across their sections.
    We can exploit that and say that an Umbrella course will never have a single course title that occurs
    A majority of the time. A normal course almost definitely will. We're going to preprocess all the titles here
    For punctuation/capitalization/spacing to ensure that we don't arbitrarily count two course titles as different
    If they're only off by a space or an em-dash.
    :param course_titles: List of titles for all course sections
    :return: True IFF a course is an Umbrella course.
    """

    def pp_title(title: str) -> str:
        """
        Preprocesses a title for more reliable comparison
        :param title:
        :return:
        """

        import string
        import re

        title = title.lower()  # Lowercase
        title = title.strip()  # Strip whitespace
        title = title.translate(str.maketrans(string.punctuation, ' ' * len(string.punctuation)))  # Punctuation
        title = re.sub(r'\s+', ' ', title)  # Multiple spaces in a row

        return title

    # Preprocess all course titles
    pp_course_titles = list(map(pp_title, course_titles))

    arbitrator = ConsensusDecider()
    for title in pp_course_titles:
        arbitrator.put(title)

    # Return False if there is a majority
    if arbitrator.has_majority():
        return False

    # Then, check whether or not there's an Umbrella course name
    umbrella_course_name = __find_umbrella_course_name(pp_course_titles)
    if len(umbrella_course_name) > 0:
        return True
    return False


def __generate_warehoused_term_templates():
    """
    Returns a tuple of usable Term-related templates.
    :return: A tupled containing [0] Listing Template [1] Availability template [2] Earliest active term ID
    """

    db = init_firestore()

    listing_template = {}
    availability_template = {}

    # Grab all terms when the course could be available
    term_docs = db.collection("yes_terms").stream()
    term_ids = []
    for term in term_docs:
        listing_template[term.get("id")] = []
        availability_template[term.get("id")] = False
        term_ids.append(int(term.id))

    most_recent_term_id = max(term_ids)
    earliest_active_term_id = most_recent_term_id - (5 * 4 * ACTIVE_YEARS_THRESHOLD)  # Earliest active
    earliest_recording_term_id = most_recent_term_id - (5 * 4 * INDEX_YEARS_THRESHOLD)  # Earliest to store

    return listing_template, availability_template, earliest_active_term_id, earliest_recording_term_id


def __warehouse_umbrella_course(course_id: str, section_docs: list[DocumentSnapshot]):
    """
    Reads through all available Sections for a given Course and generates a usable Course based on
    its historical availability and a few recency-weighted consensus mechanisms.
    This particular method assumes that the course is an "umbrella" course, i.e. it has a bunch of
    unrelated courses listed under the same ID, for example First Year Writing seminars,
    special topics courses, major seminars, etc.
    """

    db = init_firestore()

    import re
    course_number = int(re.search(r'\b\d{4}', course_id).group())

    # Schema for the object we're going to be creating here
    course_listing = {
        "id": course_id,
        "name": None,
        "course_type": "umbrella",
        "subject": course_id.split(" ")[0],
        "number": course_number,
        "contained_courses": []
    }

    listing_template, availability_template, earliest_active_term_id, earliest_recording_term_id = __generate_warehoused_term_templates()

    # Determine the name of the Umbrella course
    course_listing["name"] = __find_umbrella_course_name(
        list(
            map(
                lambda doc: doc.get("course.name"),
                section_docs
            )
        )
    )

    def strip_umbrella_course_name(course_title: str) -> str:
        """
        Removes the Umbrella Course's title from a sub-course
        :param course_title:
        :return:
        """
        umbrella_course_name = course_listing["name"]
        course_title = course_title.replace(umbrella_course_name, "", 1)
        course_title = course_title.strip()

        import re
        course_title = re.sub(r'[^a-zA-Z0-9]+$', '', course_title)
        course_title = re.sub(r'^[^a-zA-Z0-9]+', '', course_title)
        course_title = course_title.strip()

        return course_title

    # Map for us to keep the sub-courses
    contained_courses = {}

    # Iterate through sections that we've found and update the course listing
    for section in section_docs:
        doc_data = section.to_dict()

        course_name: str = doc_data["course"]["name"]

        # Use the name of the sub-listing as its unique ID
        if course_name not in contained_courses:
            contained_courses[course_name] = {
                "id": f"{course_id}_{course_name}",
                "name": strip_umbrella_course_name(course_name),
                "description": ConsensusDecider(),
                "school": ConsensusDecider(),
                "hours": ConsensusDecider(),
                "attributes": ConsensusDecider(),
                "prerequisites": ConsensusDecider(),
                # What semesters are sections available in
                "listings": listing_template.copy(),
                # In which semesters the course is available in
                "availability": availability_template.copy(),
                "active": False
            }

        course_hours = doc_data["hours"]
        section_id = doc_data["id"]
        section_term = doc_data["term"]
        section_number = doc_data["number"]
        section_instructors = doc_data["instructors"]
        section_notes = None

        # If the course has occurred at some point in the last two years, mark it active
        section_term_number_value = int(section_term)
        if section_term_number_value >= earliest_active_term_id:
            contained_courses[course_name]["active"] = True

        # Skip sections that are too early for us to continue
        elif section_term_number_value < earliest_recording_term_id:
            continue

        # Decide by consensus on name and hours
        contained_courses[course_name]["hours"].put(course_hours, section_term_number_value)

        if doc_data["details"] is not None:
            section_desc = doc_data["details"]["description"]
            section_notes = doc_data["details"]["notes"]
            section_school = doc_data["details"]["school"]
            section_prereqs = doc_data["details"]["requirements"]
            section_attributes = doc_data["details"]["attributes"]

            # Decide by consensus on school and description
            contained_courses[course_name]["school"].put(section_school, section_term_number_value)
            contained_courses[course_name]["description"].put(section_desc, section_term_number_value)
            contained_courses[course_name]["prerequisites"].put(section_prereqs, section_term_number_value)
            contained_courses[course_name]["attributes"].put(section_attributes, section_term_number_value)

        contained_courses[course_name]["listings"][section_term].append({
            "section_id": section_id,
            "section_number": section_number,
            "section_notes": section_notes,
            "section_instructors": section_instructors
        })

        contained_courses[course_name]["availability"][section_term] = True

    # Now, insert the contained courses into the main document
    contained_courses = list(contained_courses.values())
    for contained_course in contained_courses:
        contained_course["description"] = contained_course["description"].arbitrate()
        contained_course["school"] = contained_course["school"].arbitrate()
        contained_course["hours"] = contained_course["hours"].arbitrate()
        contained_course["prerequisites"] = contained_course["prerequisites"].arbitrate()
        contained_course["attributes"] = contained_course["attributes"].arbitrate()

    course_listing["contained_courses"] = contained_courses

    # Set the course listing
    db.collection("courses").document(course_id).set(course_listing)
    return course_listing


def __find_umbrella_course_name(course_titles: list[str]):
    """
    Function for us to determine what the common fragments are across course titles.
    This lets us grab the Umbrella name (e.g. "Special Topics"). It does it by determining what the
    common "fragments" are from all of the different course titles.
    :param course_titles:
    :return:
    """

    course_name_common_substring_fragments = set()

    # Iterate over course names
    for course_name in course_titles:
        # Add fragments of the course name to the common set as tuples w their word/index.
        # that'll allow us to find words from the course titles that always appear at the same indices
        # i.e. the labeling fragment (e.g. "Special Topics:")
        course_name_fragments = course_name.split(" ")
        course_name_fragments_set = set()
        for i in range(0, len(course_name_fragments)):
            course_name_fragments_set.add((course_name_fragments[i], i))

        # Create the root set for name determination, otherwise intersect with the existing set
        if len(course_name_common_substring_fragments) == 0:
            course_name_common_substring_fragments = course_name_fragments_set
        else:
            course_name_common_substring_fragments.intersection_update(course_name_fragments_set)

    import re
    return re.sub(
        r'[^a-zA-Z0-9]+$', '',
        " ".join(
            map(
                lambda x: x[0],
                sorted(
                    course_name_common_substring_fragments,
                    key=lambda x: x[1]
                )
            )
        )
    ).strip()
