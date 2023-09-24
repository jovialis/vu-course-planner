from google.cloud.firestore_v1.base_query import FieldFilter

from src.utils.consensus_decider import ConsensusDecider
from src.utils.init_firestore import init_firestore


def warehouse_course(id: str):
    """
    Reads through all available Sections for a given Course and generates a usable Course based on
    its historical availability and a few recency-weighted consensus mechanisms
    """

    # Schema for the object we're going to be creating here
    course_listing = {
        "id": id,
        "name": ConsensusDecider(),
        "description": ConsensusDecider(),
        "subject": id.split(" ")[0],
        "number": int(id.split(" ")[1]),
        "school": ConsensusDecider(),
        "hours": ConsensusDecider(),
        "attributes": [],  # TODO: Make this work
        "prerequisites": [],  # TODO: Make this work
        # What semesters are sections available in
        "listings": {},
        # In which semesters the course is available in
        "availability": {}
    }

    # TODO: Need a way to handle "Special Topics" classes (listed under same ID but different content)

    db = init_firestore()

    # Grab all terms when the course could be available
    term_docs = db.collection("yes_terms").stream()
    for term in term_docs:
        course_listing["listings"][term.get("id")] = []
        course_listing["availability"][term.get("id")] = False

    # Grab all of the Sections for that course ID
    section_docs = db.collection_group("sections").where(
        filter=FieldFilter("course.abbreviation", "==", id)
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

        section_number_val = int(section_term)

        # Decide by consensus on name and hours
        course_listing["name"].put(course_name, section_number_val)
        course_listing["hours"].put(course_hours, section_number_val)

        if doc_data["details"] is not None:
            section_desc = doc_data["details"]["description"]
            section_notes = doc_data["details"]["notes"]
            section_school = doc_data["details"]["school"]

            # Decide by consensus on school and description
            course_listing["school"].put(section_school, section_number_val)
            course_listing["description"].put(section_desc, section_number_val)

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
    db.collection("courses").document(id).set(course_listing)
    return course_listing
