from firebase_functions import https_fn
from src.utils.init_firestore import init_firestore


@https_fn.on_call()
def lookup_course(req: https_fn.CallableRequest):
    """
    Looks up a course by its ID
    """
    db = init_firestore()

    course_id = (req.data["id"] if "id" in req.data else "").lower()
    course_ref = db.collection("courses").document(course_id).get()

    if not course_ref.exists:
        raise KeyError(f"Course does not exist by ID: {course_id}")

    return {
        "id": course_ref.get("id"),
        "name": course_ref.get("name"),
        "description": course_ref.get("description"),
        "hours": course_ref.get("hours"),
        "format": course_ref.get("format"),
        "school": course_ref.get("school"),
        "active": course_ref.get("active"),
        "availability": course_ref.get("availability_pred"),
        "subject": course_ref.get("subject"),
        "prerequisites": course_ref.get("prerequisites_raw")
    }


@https_fn.on_call()
def lookup_courses(req: https_fn.CallableRequest):
    """
    Looks up a course by its ID
    """
    db = init_firestore()

    if "ids" not in req.data:
        raise KeyError("ID not provided")

    ids: list[str] = req.data["ids"]
    ids = list(map(lambda x: x.lower(), ids))

    course_docs = []

    # print(ids)

    for id in ids:
        course_ref = db.collection("courses").document(id).get()
        if not course_ref.exists:
            continue
            # raise KeyError(f"Course does not exist by ID: {id}")

        course_docs.append(course_ref.to_dict())

    return list(map(lambda course_ref: {
        "id": course_ref["id"],
        "name": course_ref["name"],
        "description": course_ref["description"] if "description" in course_ref else None,
        "hours": course_ref["hours"] if "hours" in course_ref else None,
        "format": course_ref["format"] if "format" in course_ref else None,
        "school": course_ref["school"] if "school" in course_ref else None,
        "active": course_ref["active"] if "active" in course_ref else None,
        "availability": course_ref["availability_pred"] if "availability_pred" in course_ref else None,
        "subject": course_ref["subject"] if "subject" in course_ref else None,
        "prerequisites": course_ref["prerequisites_raw"] if "prerequisites_raw" in course_ref else None
    }, course_docs))


@https_fn.on_call()
def list_majors(req: https_fn.CallableRequest):
    from src.lookups.schemas import AVAILABLE_SCHEMAS

    return list(AVAILABLE_SCHEMAS.keys())


@https_fn.on_call()
def get_major_schema(req: https_fn.CallableRequest):
    from src.lookups.schemas import AVAILABLE_SCHEMAS

    if "major" not in req.data:
        raise ValueError("Major must be provided")

    if req.data["major"] not in AVAILABLE_SCHEMAS:
        raise ValueError("Major is not available")

    return AVAILABLE_SCHEMAS[req.data["major"]]