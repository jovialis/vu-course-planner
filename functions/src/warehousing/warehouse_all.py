def warehouse_all():
    """
    Function that iterates through Firestore sections and warehouses all found Courses. Does so without checking
    if a given course has already been warehoused.
    :return:
    """
    from src.utils.init_firestore import init_firestore
    from src.warehousing.warehouse_course import warehouse_course

    # Find all Undergraduate sections
    db = init_firestore()
    section_docs = db.collection_group("sections").where("course.number", "<", 5000).stream()

    # Make sure courses don't get double-warehoused
    warehoused_course_ids = {}

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
