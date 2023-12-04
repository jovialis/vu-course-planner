

def pick_courses_and_assign_to_semesters(major: str, courses_taken: list[str], selected_paths: dict[str, int], semesters: list[list[str]]):
    import math
    import re

    courses_to_take = list(pick_courses_given_paths_and_courses_taken(major, courses_taken, selected_paths))

    # Sort the courses by NUMBER so that the earlier courses get picked first
    def extract_number(s):
        match = re.search(r'\d+', s["course_id"])  # Matches one or more digits
        return int(match.group()) if match else 0

    # Sorting the list using the extract_number function as the key
    courses_to_take = list(sorted(courses_to_take, key=extract_number))

    print("SORTED Selected Courses to take!!!!!", courses_to_take, "w len", len(courses_to_take))

    # Calculate average number of courses per semester
    courses_preselected_count = len([item for sublist in semesters for item in sublist])
    courses_per_semester = math.ceil((len(courses_to_take) + courses_preselected_count) / len(semesters))

    print("Courses per semester", courses_per_semester)

    for i in range(0, len(semesters)):
        semester_courses = semesters[i]
        semester_courses_count = len(semester_courses)

        courses_to_pick = max(0, courses_per_semester - semester_courses_count)
        picked_courses = courses_to_take[0:min(courses_to_pick, len(courses_to_take))]

        semester_courses.extend(picked_courses)

        # print("Need to pick", courses_to_pick, "courses")

        # Remove the picked courses from the courses to take
        courses_to_take = courses_to_take[courses_to_pick:]

    return semesters


def pick_courses_given_paths_and_courses_taken(major: str, courses_taken: list[str], selected_paths: dict[str, int]) -> set[str]:
    from src.lookups.schemas import AVAILABLE_SCHEMAS
    from src.ai_planner.schema_ingestion import DegreeSchema, DegreeSchemaRequirement
    from src.ai_planner.satisfy_graduation import determine_requirement_schema
    import random
    import math
    from src.utils.init_firestore import init_firestore

    db = init_firestore()
    if major not in AVAILABLE_SCHEMAS:
        raise ValueError(f"Could not find schema for major {major}")

    all_existing_courses = [x.to_dict() for x in db.collection("courses").get()]  # Grab all courses for usage downstream
    all_existing_courses_map = {}

    for course in all_existing_courses:
        all_existing_courses_map[course["id"].lower()] = course

    schema = AVAILABLE_SCHEMAS[major]

    # Load the schema into our ingestor
    # reader = DegreeSchema(schema, selected_paths, list(map(lambda x: x.lower(), courses_taken)))

    courses_needed = set()

    # Iterate over the requirements in the schema, check whether the requirements have been satisfied
    # if not, randomly pick from the qualifying courses until we have enough to meet the hours requirement
    for requirement in schema["Requirements"]:
        schema_requirement = DegreeSchemaRequirement(requirement, selected_paths, courses_taken, all_existing_courses)

        # Check whether requirement is complete
        satisfied = determine_requirement_schema(set(courses_taken), schema_requirement)
        if not satisfied:
            qualifying_courses = schema_requirement.find_satisfying_courses()
            hours_needed = schema_requirement.hours

            print("---")

            print(requirement["id"], "Qualifying courses", qualifying_courses, "w needed hours", hours_needed)

            # Assume each course has three hours
            courses_needed_count = math.ceil(hours_needed / 3)
            picked_courses = random.sample(sorted(qualifying_courses), min(courses_needed_count, len(qualifying_courses)))

            print("Picked", picked_courses)

            courses_needed.update(picked_courses)
        else:
            print("SATISFIED!!!!!!!!", schema_requirement.id)

    # Map the picked courses to their id and name
    courses_needed = [{
        "course_id": x.lower(),
        "course_name": all_existing_courses_map[
            x.lower()]["name"] if x.lower() in all_existing_courses_map else "Unknown"
    } for x in courses_needed]

    return courses_needed

