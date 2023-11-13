from tests.utils import initialize_app_for_testing

initialize_app_for_testing()


def test__warehouse_course_requisites():
    from src.warehousing.warehouse_requisites import warehouse_course_requisites

    assert warehouse_course_requisites("cs 2201")
    assert not warehouse_course_requisites("cs 1101")


def test__structure_course_requisites():
    from src.warehousing.warehouse_requisites import __structure_course_requisites

    assert __structure_course_requisites(
        "CS 2201 or 2301"
    ) == [
        {
            "type": "path",
            "options": [
                {
                    "type": "course",
                    "course": "CS 2201"
                },
                {
                    "type": "course",
                    "course": "CS 2301"
                }
            ]
        }
    ]

    assert __structure_course_requisites(
        "CS 2201 and 2301"
    ) == [
       {
           "type": "course",
           "course": "CS 2201"
       },
       {
           "type": "course",
           "course": "CS 2301"
       }
   ]
