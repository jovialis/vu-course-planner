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
        "active": course_ref.get("active")
    }