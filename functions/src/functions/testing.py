from firebase_functions import https_fn
from src.utils.init_firestore import init_firestore
from src.warehousing.warehouse_all import warehouse_all


@https_fn.on_call(timeout_sec=60*60)
def test_warehouse_all_courses(req: https_fn.CallableRequest):
    """
    Looks up a course by its ID
    """
    warehouse_all()

    return True