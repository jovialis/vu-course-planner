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

    # ref = db.collection("users").document(req.auth.uid)
    ref = db.collection("users").document('LwhoYWqUvYWiCwzk9FX2jbdu9593')
    doc = ref.get()
    course_ref = doc.get('completed_courses')

    # doc_ref = db.collection('timelines').document(timeline_id)
    # doc1 = doc_ref.get()
    #
    # if not doc1.exists:
    #     raise ValueError("Timeline does not exist")
    #
    # sem_ref = doc1.get('timeline_semesters')
    # for x in range(0, len(sem_ref)):
    #     course_ref += sem_ref[x]['semester_courses']


    test_list_success = {"PSY 1200", "PSY 2150", "PSY 2100", "PSY 3100", "PSY 3110",
                         "PSY 3120", "PSY 3750", "NSC 2201", "PSYC 1111",
                         "PSYC 1112",
                         "PSYC 1113",
                         "PSYC 1114",
                         "PSYC 1115"}
    simple_psychology = ingest_schema("src/schemas/" + major_id + ".json")

    return determine_graduation(course_ref, simple_psychology)
