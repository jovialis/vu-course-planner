from src.utils.init_firestore import init_firestore


def find_optimal_class_list(courses_required: list[str], courses_taken: list[str], all_course_docs=None) -> list[str]:
    """
    Given a list of courses that a user MUST take for their major, and the courses they've already taken,
    determine the pre-requisites for each course and compute every possible path that the user could take
    to complete their degree. Subtract the courses they've already taken and pick the option with the fewest
    number of courses to complete.
    """

    db = init_firestore()
    all_course_docs = all_course_docs if all_course_docs is not None else [course.to_dict() for course in db.collection("courses").get()]

    # Build a map of course ID
    required_course_docs = [course["id"] for course in all_course_docs if course["id"].upper() in courses_required]
    taken_course_docs = [course["id"] for course in all_course_docs if course["id"].upper() in courses_taken]

    return __pick_shortest_course_list_fulfillment_path(all_course_docs, required_course_docs, taken_course_docs)


def __pick_shortest_course_list_fulfillment_path(all_course_docs, courses_required: list[str], courses_taken: list[str]):
    """
    Of all the possible pre-requisite paths to take in fulfilling "courses_required," which possible combinations
    will satisfy the required courses AND minimize the number of courses required when taking into account
    their overall length and the courses the user has already taken?
    """

    course_requisite_path_map = __build_course_prerequisite_path_map(all_course_docs)

    possible_paths = []  # [ [["CS 2201"], ["CS 1103"]], [["HIST 2201"], ["HIST 1103"]] ]

    # Add all of the possible paths for the courses
    for course in courses_required:
        course_paths = __dfs_course_prerequisite_paths(course, course_requisite_path_map)

        print("\nCourse", course, "course paths", course_paths)

        if len(course_paths) == 0:
            continue

        possible_paths.append(course_paths)

    if len(possible_paths) == 0:
        return []

    # Cartesian products of all the paths
    import itertools

    # print("\nBefore", possible_paths)

    # Generate the cartesian products
    possible_paths = list(itertools.product(*possible_paths))
    possible_paths = [list(comb) for comb in possible_paths]

    # print("\nMiddle", possible_paths)

    # Flatten all paths
    from more_itertools import collapse
    possible_paths = [list(set(collapse(path))) for path in possible_paths]

    # print("\nAfter", possible_paths)

    # Pick the shortest class after considering the classes the user has taken
    shortest_path = None
    shortest_path_length = -1

    for i, path in enumerate(possible_paths):
        adjusted_path = __adjust_real_course_prerequisite_paths(path, courses_taken)

        if shortest_path is None or len(adjusted_path) < shortest_path_length:
            shortest_path = adjusted_path
            shortest_path_length = len(adjusted_path)

    return shortest_path if shortest_path is not None else []



def __pick_shortest_course_fulfillment_path(course_doc, courses_taken: list[str], course_requisite_path_map) -> list[str]:
    """
    Builds out prerequisite paths for the given course. Searches for any paths that are already
    completed by the courses taken. If so, return an empty 2d array. Otherwise iterate through the possible paths.
    """

    possible_paths = __dfs_course_prerequisite_paths(course_doc["id"], course_requisite_path_map)

    shortest_path = None
    shortest_path_length = -1

    for i, path in enumerate(possible_paths):
        adjusted_path = __adjust_real_course_prerequisite_paths(path, courses_taken)

        if shortest_path is None or len(adjusted_path) < shortest_path_length:
            shortest_path = adjusted_path
            shortest_path_length = len(adjusted_path)

    return shortest_path


def __build_course_prerequisite_path_map(course_docs):
    """
    Constructs a map of Course ID -> List of potential paths that can be taken
    """

    requisite_path_map = {}

    course_ids = [doc["id"].upper() for doc in course_docs]

    for course_doc in course_docs:
        if "prerequisites" in course_doc and isinstance(course_doc["prerequisites"], list):
            if course_doc["id"].lower() == "math 3120":
                print("Prerequisites valid")

            requisite_path_map[course_doc["id"]] = __build_course_prerequisite_paths(
                course_doc["prerequisites"],
                lambda course_id: __check_course_exists(course_ids, course_id)
            )
        else:
            if course_doc["id"].lower() == "math 3120":
                print("Prerequisites not valid")

            requisite_path_map[course_doc["id"]] = []

    return requisite_path_map


def __check_course_exists(course_docs, course_id):
    """
    Validates that a Course ID exists given a list of all available Courses
    """

    return course_id.upper() in course_docs


def __adjust_real_course_prerequisite_paths(course_path: list[str], courses_taken: list[str]) -> list[str]:
    """
    Takes the Set difference between the Course Path and the Courses Taken.
    """

    return [course for course in course_path if course not in courses_taken]


def __dfs_course_prerequisite_paths(parent_course_id, course_requisite_path_map) -> list[list[str]]:
    """
    Grabs all of the potential paths that can be taken to satisfy this course.
    """

    # Skip this if the parent course cannot be found in the dataset
    if parent_course_id not in course_requisite_path_map:
        # print("Parent course not in requisite path map")
        return []

    parent_course_paths = course_requisite_path_map[parent_course_id]

    # print("Parent course paths for", parent_course_id, parent_course_paths)

    all_paths = []

    # Iterate over each of the paths that can be used to satisfy the parent course
    for path in parent_course_paths:  # [ paths [ courses ] ]
        subpaths_to_pick_from = []  #

        for course in path:
            # Grab all of the potential paths that can be taken to satisfy this course.
            course_requisite_paths = __dfs_course_prerequisite_paths(course, course_requisite_path_map)

            if len(course_requisite_paths) > 0:
                subpaths_to_pick_from.append(course_requisite_paths)

            # print("\n", "Course", course, "has subpaths", course_requisite_paths)

        import itertools

        # print("\nBefore: Subpaths to pick from", subpaths_to_pick_from)

        # Generate the cartesian products
        subpaths_to_pick_from = list(itertools.product(*subpaths_to_pick_from))

        # print("Middle: Subpaths to pick from", subpaths_to_pick_from)

        subpaths_to_pick_from = [list(comb) for comb in subpaths_to_pick_from]

        # print("After: Subpaths to pick from", subpaths_to_pick_from, "\n\n")

        # Extend each subpath with "path" contents
        for subpath in subpaths_to_pick_from:
            all_paths.append([ *path, *subpath ])

    # Flatten all paths
    from more_itertools import collapse
    all_paths = [list(set(collapse(path))) for path in all_paths]

    # print("All Paths", all_paths)

    return list(all_paths)


def __build_course_prerequisite_paths(course_prereqs, check_course_exists, merge_paths=True) -> list[list[str]]:
    """
    Recursively constructs a 2D array where inner arrays are a complete list of courses needed
    to fulfill the requirements of the provided requirements array

    merge_paths is a boolean indicating whether or not the options in course_prereqs should be
    taken as an AND logic, or an OR logic.
    """

    courses_required = [[]]

    def add_course_to_all_paths(course: str):
        """
        Pushes a course to all pathways
        """
        for path in courses_required:
            path.append(course)

    # Iterate over the requirements
    for req in course_prereqs:
        if "type" not in req:
            continue

        # Course is required, so add it to all of the pathways
        if req["type"] == "course" and merge_paths:
            if "course" in req and check_course_exists(req["course"]):
                add_course_to_all_paths(req["course"])

        elif req["type"] == "course" and not merge_paths:
            if "course" in req and check_course_exists(req["course"]):
                courses_required.append([req["course"]])

        elif req["type"] == "path" and "options" in req:
            nested_pathways = __build_course_prerequisite_paths(req["options"], check_course_exists, False)

            new_courses_required = []

            # Merge the existing pathways with the nested pathways; this should result in X*Y pathways
            # where X is the number of existing pathways and Y is the number of nested pathways.
            for existing_path in courses_required:
                for nested_path in nested_pathways:
                    new_path = []

                    new_path.extend(existing_path)
                    new_path.extend(nested_path)

                    new_courses_required.append(new_path)

            courses_required = new_courses_required

    # Delete empty arrays
    courses_required = [val for val in courses_required if len(val) > 0]

    # print("Courses required", courses_required)

    return courses_required
