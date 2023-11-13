
def test__build_course_prerequisite_paths__simple():
    from src.ai_planner.class_dependency_construction import __build_course_prerequisite_paths

    empty_prereqs = []
    assert __build_course_prerequisite_paths(empty_prereqs) == []

    simple_prereqs = [
        {"type": "course", "course": "HIST 1101"},
        {"type": "course", "course": "HIST 1102"}
    ]
    assert __build_course_prerequisite_paths(simple_prereqs) == [["HIST 1101", "HIST 1102"]]


def test__build_course_prerequisite_paths__complex():
    from src.ai_planner.class_dependency_construction import __build_course_prerequisite_paths

    complex_path_prereqs = [
        {"type": "course", "course": "CS 2201"},
        {"type": "path", "options": [
            {"type": "course", "course": "HIST 1100"},
            {"type": "course", "course": "HIST 1101"},
        ]},
        {"type": "path", "options": [
            {"type": "course", "course": "HIST 1110"},
            {"type": "course", "course": "HIST 1111"},
        ]},
        {"type": "course", "course": "CS 2301"}
    ]

    assert list(sorted([set(x) for x in __build_course_prerequisite_paths(complex_path_prereqs)])) == list(sorted([
        {"CS 2201", "HIST 1100", "HIST 1110", "CS 2301"},
        {"CS 2201", "HIST 1100", "HIST 1111", "CS 2301"},

        {"CS 2201", "HIST 1101", "HIST 1110", "CS 2301"},
        {"CS 2201", "HIST 1101", "HIST 1111", "CS 2301"},
    ]))


courses_docs_sample = [
    { "id": "CS 1100", "prerequisites": [] },
    { "id": "CS 1101", "prerequisites": [] },
    { "id": "CS 1103", "prerequisites": [
        { "type": "course", "course": "CS 1100" }
    ] },
    { "id": "CS 2201", "prerequisites": [
        { "type": "course", "course": "CS 1103" },
        { "type": "path", "options": [
            { "type": "course", "course": "CS 1100" },
            { "type": "course", "course": "CS 1101" },
        ] }
    ] },
    { "id": "HIST 3000", "prerequisites": [] },
    { "id": "HIST 4000", "prerequisites": [
        { "type": "course", "course": "HIST 3000" }
    ] }
]


def test__build_course_prerequisite_path_map():
    from src.ai_planner.class_dependency_construction import __build_course_prerequisite_path_map, __build_course_prerequisite_paths

    map = __build_course_prerequisite_path_map(courses_docs_sample)

    assert map["CS 1100"] == []
    assert map["CS 1103"] == [["CS 1100"]]
    assert map["CS 2201"] == __build_course_prerequisite_paths(courses_docs_sample[3]["prerequisites"])


def test__dfs_course_prerequisite_paths():
    from src.ai_planner.class_dependency_construction import __dfs_course_prerequisite_paths, __build_course_prerequisite_path_map

    map = __build_course_prerequisite_path_map(courses_docs_sample)

    assert __dfs_course_prerequisite_paths("CS 1101", map) == []
    assert __dfs_course_prerequisite_paths("CS 1103", map) == [["CS 1100"]]
    assert __dfs_course_prerequisite_paths("CS 2201", map) == [["CS 1100", "CS 1103"], ["CS 1100", "CS 1103", "CS 1101"]]


def test__adjust_real_course_prerequisite_paths():
    from src.ai_planner.class_dependency_construction import __adjust_real_course_prerequisite_paths

    course_path = ["CS 1100", "CS 1103", "CS 1105", "CS 2201", "CS 2212"]

    assert __adjust_real_course_prerequisite_paths(course_path,[]) == course_path
    assert __adjust_real_course_prerequisite_paths([],["HIST 2139"]) == []
    assert __adjust_real_course_prerequisite_paths(course_path,["HIST 2139"]) == course_path
    assert __adjust_real_course_prerequisite_paths(course_path,["CS 1100", "CS 1103", "CS 1105"]) == ["CS 2201", "CS 2212"]


def test__pick_shortest_course_list_fulfillment_path__single_course():
    from src.ai_planner.class_dependency_construction import __pick_shortest_course_list_fulfillment_path

    assert [] == __pick_shortest_course_list_fulfillment_path(courses_docs_sample, [
        "CS 1100"
    ], [])

    assert ["CS 1100"] == __pick_shortest_course_list_fulfillment_path(courses_docs_sample, [
        "CS 1103"
    ], [])

    assert [] == __pick_shortest_course_list_fulfillment_path(courses_docs_sample, [
        "CS 1103"
    ], ["CS 1100"])

    assert ["CS 1100"] == __pick_shortest_course_list_fulfillment_path(courses_docs_sample, [
        "CS 1103"
    ], ["CS 2301", "HIST 1100"])


def test__pick_shortest_course_list_fulfillment_path__multiple_course():
    from src.ai_planner.class_dependency_construction import __pick_shortest_course_list_fulfillment_path

    assert __pick_shortest_course_list_fulfillment_path(courses_docs_sample, [
        "CS 1100", "HIST 3000"
    ], []) == []

    assert __pick_shortest_course_list_fulfillment_path(courses_docs_sample, [
        "CS 1103", "HIST 3000"
    ], []) == ["CS 1100"]

    assert __pick_shortest_course_list_fulfillment_path(courses_docs_sample, [
        "CS 1103", "HIST 3000"
    ], ["CS 1100"]) == []

    assert __pick_shortest_course_list_fulfillment_path(courses_docs_sample, [
        "CS 1103", "HIST 4000"
    ], []) == ["CS 1100", "HIST 3000"]

    assert __pick_shortest_course_list_fulfillment_path(courses_docs_sample, [
        "CS 2201", "HIST 4000"
    ], ["CS 1100"]) == ["CS 1103", "HIST 3000"]

    assert __pick_shortest_course_list_fulfillment_path(courses_docs_sample, [
        "CS 2201", "HIST 4000"
    ], ["CS 1101"]) == ["CS 1100", "CS 1103", "HIST 3000"]

