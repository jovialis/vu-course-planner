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

    db = init_firestore()

    doc_ref = db.collection('timelines').where('user_id', '==', 1).stream()

    doc_list = []

    for doc in doc_ref:
        document_data = doc.to_dict()
        doc_list.append(document_data)
        # print("Document ID: {}".format(doc.id))
        # print("Document Data: {}".format(document_data))


    result = json.dumps(doc_list)

    return result


@https_fn.on_call()
def get_user_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Queries firestore for a specific Timeline document with a given ID. Should throw an error if the user doesn't
    have access.
    """
    db = init_firestore()

    doc_ref = db.collection("timelines").document("XoXfJMQmFGYHcN8ZqIME").get()
    doc = doc_ref.to_dict()

    return json.dumps(doc)

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
    user_id = 'JPjFjauMlLF12oOwXcJI'
    grad_date = 'Spring 2024'
    name = 'Math Timeline'
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
        'user_id': user_id,
        'grad_date': grad_date,
        'semester': sem
    }

    doc_red = db.collection('timelines').add(new_user)

@https_fn.on_call()
def rename_user_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Renames a specific timeline document with a given ID. Should throw an error if the user doesn't have access.
    """
    db = init_firestore()
    doc_ref = db.collection("timelines").document("eLRyIDS4G8sMiYQ2NvAr")
    doc_ref.update({
        'name': 'Math Major'
    })
