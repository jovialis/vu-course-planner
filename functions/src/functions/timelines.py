from firebase_functions import https_fn, options
from src.utils.init_firestore import init_firestore
import json

"""
Potential Firestore timelines structure:

Collection: "timelines"
Document: { user: <user ID>, name: <timeline name>, }   // Other fields to be added later
"""


@https_fn.on_call()
def get_user_timelines(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Queries firestore for all Timeline documents with a "user" field equal to the authenticated user's ID
    """

    user_id = req.data["user_id"]
    # uid = req.auth.uid

    db = init_firestore()

    doc_ref = db.collection('timelines').where('user_id', '==', user_id).stream()
    # doc_ref = db.collection('timelines').where(filter=FieldFilter('user_id', "==", 'JPjFjauMlLF12oOwXcJI')).stream()

    doc_list = []

    for doc in doc_ref:
        document_data = doc.to_dict()
        doc_list.append(document_data)

    return doc_list


@https_fn.on_call()
def get_user_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Queries firestore for a specific Timeline document with a given ID. Should throw an error if the user doesn't
    have access.
    """
    db = init_firestore()

    # doc_ref = db.collection("timelines").document("9SRMpNVx8N5DClZsgKO7").get()
    timeline_id = req.data["timeline_id"]
    doc_ref = db.collection("timelines").document(timeline_id).get()
    doc = doc_ref.to_dict()

    return doc

# Consider Korean students who are going to military -> semester should have a label to see whether or not the
# student attended that semester
@https_fn.on_call()
def create_user_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Creates a new Timeline document with the provided name and a "user" field equal to the currently logged
    in user.
    """
    db = init_firestore()

    # Get the semester in which the person is graduating -> go from person graduating semester and work backwards
    # Write a function that said if they are graduating in Spring 2023, let me go back 8 semester -> for now assume they graduate in Spring 2024
    # Functionality needed: create timeline document
    # user_id = userID
    grad_date = 'Spring 2024'
    name = 'CS Timeline'
    sem = []

    cur_sem = grad_date[0]
    cur_year = int(grad_date[-4:])

    for x in range (0, 8):
        tmp = ''
        if (cur_sem == 'S'):
            tmp += 'Spring' + ' ' + str(cur_year)
            cur_sem = 'F'
            cur_year = cur_year - 1
            sem.append({'name': tmp, 'course': []})
        else:
            tmp += 'Fall' + ' ' + str(cur_year)
            cur_sem = 'S'
            sem.append({'name': tmp, 'course': []})

    new_user = {
        'name': name,
        'user_id': 'JPjFjauMlLF12oOwXcJI',
        'grad_date': grad_date,
        'semester': sem
    }

    doc_red = db.collection('timelines').add(new_user)

    return True

@https_fn.on_call()
def rename_user_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Renames a specific timeline document with a given ID. Should throw an error if the user doesn't have access.
    """
    db = init_firestore()

    timeline_id = req.data["timeline_id"]
    new_name = req.data["new_name"]
    doc_ref = db.collection("timelines").document(timeline_id)
    doc_ref.update({
        'name': new_name
    })

    return True


@https_fn.on_call()
def add_course_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Add a new course to the timeline course list
    """

    db = init_firestore()

    timeline_id = req.data["timeline_id"]
    course_name = req.data["c_name"]
    cid = req.data["c_id"]

    doc_ref = db.collection("timelines").document(timeline_id).get()
    course_arr = doc_ref.get('course')

    new_course = {
        "c_name": course_name,
        "cid": cid
    }



