from google.cloud.firestore_v1.base_query import FieldFilter

from src.utils.consensus_decider import ConsensusDecider
from src.utils.init_firestore import init_firestore

# TODO: This file is a bit messy and there's some duplicate code which is bad.
# TODO: Needs to be cleaned up/abstracted, but it'll do as a proof of concept.

def warehouse_course(course_id: str):
    """
    Reads through all available Sections for a given Course and generates a usable Course based on
    its historical availability and a few recency-weighted consensus mechanisms
    """

    # Schema for the object we're going to be creating here
    course_listing = {
        "id": course_id,
        "name": ConsensusDecider(),
        "description": ConsensusDecider(),
        "course_type": "single",
        "subject": course_id.split(" ")[0],
        "number": int(course_id.split(" ")[1]),
        "school": ConsensusDecider(),
        "hours": ConsensusDecider(),
        "attributes": [],  # TODO: Make this work
        "prerequisites": [],  # TODO: Make this work
        # What semesters are sections available in
        "listings": {},
        # In which semesters the course is available in
        "availability": {},
        "active": False
    }

    db = init_firestore()

    # Grab all terms when the course could be available
    term_docs = db.collection("yes_terms").stream()
    term_ids = []
    for term in term_docs:
        course_listing["listings"][term.get("id")] = []
        course_listing["availability"][term.get("id")] = False
        term_ids.append(int(term.id))

    most_recent_term_id = max(term_ids)
    earliest_active_term_id = most_recent_term_id - (5 * 8)  # Earliest active = 2 full years ago

    # Grab all of the Sections for that course ID
    section_docs = db.collection_group("sections").where(
        filter=FieldFilter("course.abbreviation", "==", course_id)
    ).order_by("term", "ASCENDING").stream()

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

        # Decide by consensus on name and hours
        course_listing["name"].put(course_name, section_term_number_value)
        course_listing["hours"].put(course_hours, section_term_number_value)

        if doc_data["details"] is not None:
            section_desc = doc_data["details"]["description"]
            section_notes = doc_data["details"]["notes"]
            section_school = doc_data["details"]["school"]

            # Decide by consensus on school and description
            course_listing["school"].put(section_school, section_term_number_value)
            course_listing["description"].put(section_desc, section_term_number_value)

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

    # Set the course listing
    db.collection("courses").document(course_id).set(course_listing)
    return course_listing


def warehouse_umbrella_course(course_id: str):
    """
    Reads through all available Sections for a given Course and generates a usable Course based on
    its historical availability and a few recency-weighted consensus mechanisms.
    This particular method assumes that the course is an "umbrella" course, i.e. it has a bunch of
    unrelated courses listed under the same ID, for example First Year Writing seminars,
    special topics courses, major seminars, etc.
    """

    # Schema for the object we're going to be creating here
    course_listing = {
        "id": course_id,
        "name": None,
        "course_type": "umbrella",
        "subject": course_id.split(" ")[0],
        "number": int(course_id.split(" ")[1]),
        "contained_courses": []
    }

    course_name_common_substring_fragments = set()

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
    earliest_active_term_id = most_recent_term_id - (5 * 8)  # Earliest active = 2 full years ago

    # Grab all of the Sections for that course ID
    section_docs = db.collection_group("sections").where(
        filter=FieldFilter("course.abbreviation", "==", course_id)
    ).order_by("term", "ASCENDING").stream()

    # Map for us to keep the sub-courses
    contained_courses = {}

    # Iterate through sections that we've found and update the course listing
    for section in section_docs:
        doc_data = section.to_dict()

        course_name: str = doc_data["course"]["name"]

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

        # Use the name of the sub-listing as its unique ID
        if course_name not in contained_courses:
            contained_courses[course_name] = {
                "id": f"{course_id}_{course_name}",
                "name": course_name,
                "description": ConsensusDecider(),
                "school": ConsensusDecider(),
                "hours": ConsensusDecider(),
                "attributes": [],  # TODO: Make this work
                "prerequisites": [],  # TODO: Make this work
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

        # Decide by consensus on name and hours
        contained_courses[course_name]["hours"].put(course_hours, section_term_number_value)

        if doc_data["details"] is not None:
            section_desc = doc_data["details"]["description"]
            section_notes = doc_data["details"]["notes"]
            section_school = doc_data["details"]["school"]

            # Decide by consensus on school and description
            contained_courses[course_name]["school"].put(section_school, section_term_number_value)
            contained_courses[course_name]["description"].put(section_desc, section_term_number_value)

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

    course_listing["contained_courses"] = contained_courses

    # Re-assemble the name from common fragments
    import re
    course_listing["name"] = re.sub(
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

    # Set the course listing
    db.collection("courses").document(course_id).set(course_listing)
    return course_listing
