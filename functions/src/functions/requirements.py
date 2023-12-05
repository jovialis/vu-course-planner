import string
from firebase_functions import https_fn, options
from firebase_admin import credentials, firestore
from src.utils.init_firestore import init_firestore
from firebase_functions import identity_fn
from src.ai_planner.schema_ingestion import ingest_schema
from src.ai_planner.satisfy_graduation import determine_graduation
import json


@https_fn.on_call()
def get_user_reqs(req: https_fn.CallableRequest) -> https_fn.Response:
    """
        Get formatted user requirements
    """
    list_reqs = ingest_schema("../functions/src/schemas/history.json")

    return json.load(list_reqs)

@https_fn.on_call()
def get_user_grad_status(req: https_fn.CallableRequest) -> https_fn.Response:
    """
            Get formatted user requirements
    """
    db = init_firestore()

    major_id = req.data["major_id"]
    timeline_id = req.data["timeline_id"]

    ref = db.collection("users").document(req.auth.uid)
    doc = ref.get()
    course_ref = doc.get('completed_courses')

    doc_ref = db.collection('timelines').document(timeline_id)
    doc1 = doc_ref.get()

    if not doc1.exists:
        raise ValueError("Timeline does not exist")

    sem_ref = doc1.get('timeline_semesters')
    course_ids = []
    for x in range(0, len(sem_ref)):
        tmp_ref = sem_ref[x]['semester_courses']
        for y in range(0, len(tmp_ref)):
            course_id = tmp_ref[y]['course_id']
            course_ref.append(course_id)

    course_schema = ingest_schema("src/schemas/" + major_id + ".json")

    return determine_graduation(course_ref, course_schema)
