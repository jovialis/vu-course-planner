def warehouse_all():
    """
    Function that iterates through Firestore sections and warehouses all found Courses. Does so without checking
    if a given course has already been warehoused.
    :return:
    """
    from src.utils.init_firestore import init_firestore
    from src.warehousing.warehouse_course import warehouse_course

    db = init_firestore()

    # Find all Undergraduate sections
    section_docs = db.collection_group("sections").where("course.number", "<", 5000).get()

    # Make sure courses don't get double-warehoused
    warehoused_course_ids = {}

    # Figure out which courses are already warehoused
    course_docs = db.collection("courses").get()
    for course in course_docs:
        warehoused_course_ids[course.id.upper()] = True

    for doc in section_docs:
        # Skip courses we've already warehoused
        course_id = doc.get("course.abbreviation")
        if course_id in warehoused_course_ids:
            continue

        # Call the Warehouse function on this course
        print("Attempting to warehouse", course_id)
        warehouse_course(course_id)
        print("Warehoused", course_id)

        warehoused_course_ids[course_id] = True

    return True


def warehouse_all_prerequisites():
    """
    Function that iterates through all Courses and generates a Prerequisites object
    """

    from src.utils.init_firestore import init_firestore
    from src.warehousing.warehouse_requisites import __structure_course_requisites

    db = init_firestore()

    course_docs = db.collection("courses").where("prerequisites", "==", None).get()

    for course in course_docs:
        course_prerequisites_raw = course.to_dict()["prerequisites_raw"]
        if not course_prerequisites_raw or len(course_prerequisites_raw) == 0:
            continue

        requisites = __structure_course_requisites(course_prerequisites_raw)
        if requisites is None:
            continue

        course.reference.set({
            "prerequisites": requisites
        }, merge=True)

        print("Warehoused", course.id)

    return True


warehouse_all_prerequisites()