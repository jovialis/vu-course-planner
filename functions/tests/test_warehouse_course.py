from tests.utils import initialize_app_for_testing

initialize_app_for_testing()


def test__san():
    from src.warehousing.warehouse_course import __san

    assert __san("hello") == "hello"
    assert __san("HellO") == "HellO"
    assert __san("*123!") == "123"


def test__find_umbrella_course_name():
    from src.warehousing.warehouse_course import __find_umbrella_course_name

    assert __find_umbrella_course_name([
        "Special Topics: 123",
        "Special Topics: ABC"
    ]) == "Special Topics"

    assert __find_umbrella_course_name([
        "Special Topics: 123",
        "Specil Topics: ABC"
    ]) == "Topics"

    assert __find_umbrella_course_name([
        "123 ABC",
        "123 XYZ"
    ]) == "123"

    assert __find_umbrella_course_name([
        "Topics Special **123",
        "123** Special Topics"
    ]) == "Special"


def test__strip_umbrella_course_name():
    from src.warehousing.warehouse_course import __strip_umbrella_course_name

    umbrella_course_name = "Special Topics"

    assert __strip_umbrella_course_name(
        umbrella_course_name + " Remainder of the Title",
        umbrella_course_name
    ) == "Remainder of the Title"

    assert not __strip_umbrella_course_name(
        umbrella_course_name + " Remainder of the Title",
        umbrella_course_name
    ) == "Not the Remainder of the Title"


def test__generate_warehoused_term_templates():
    from src.warehousing.warehouse_course import __generate_warehoused_term_templates

    listing_template, availability_template, earliest_active_term_id, earliest_recording_term_id = __generate_warehoused_term_templates()

    assert listing_template["0915"] == []
    assert "0005" not in listing_template

    assert not availability_template["0915"]
    assert availability_template["1010"] == False
    assert sum(dict.values(availability_template)) == 0

    assert earliest_active_term_id == 975
    assert earliest_recording_term_id == earliest_active_term_id - 20 * 2


def test__warehouse_single_course():
    from src.warehousing.warehouse_course import __warehouse_single_course

    class MockDocument():
        doc = None
        def __init__(self, doc):
            self.doc = doc

        def to_dict(self):
            return self.doc


    single_course_demo = [
        MockDocument({
            "course": {
                "abbreviation": "CS 1100",
                "name": "Intro to Programming",
                "number": 1423,
                "subject": "CS"
            },
            "hours": 3,
            "id": "0001",
            "instructors": [],
            "number": "01",
            "schedule": "TBA;TBA",
            "term": "1015",
            "type": "Seminar"
        }),
        MockDocument({
            "course": {
                "abbreviation": "CS 1100",
                "name": "Intro to Programming",
                "number": 1423,
                "subject": "CS"
            },
            "hours": 3,
            "id": "0001",
            "instructors": [],
            "number": "01",
            "schedule": "TBA;TBA",
            "term": "1015",
            "type": "Seminar"
        })
    ]

    res = __warehouse_single_course("CS 1100", single_course_demo, False)

    assert res["id"] == "CS 1100"

    # TODO: This


def test__warehouse_umbrella_course():
    pass


def test__is_umbrella_course():
    from src.warehousing.warehouse_course import __is_umbrella_course

    assert __is_umbrella_course([
        "Special Topics ABC",
        "Special Topics 123"
    ])

    assert not __is_umbrella_course([
        "Special Topics ABC",
        "Special Topics 123",
        "Special Topics 123"
    ])

    assert not __is_umbrella_course([
        "My Course 123",
        "Another Epic Course 321"
    ])


def test__warehouse_course():
    pass