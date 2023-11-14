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
    uid = req.auth.uid

    # Call function that initializes firestore
    db = init_firestore()

    #  code to get all the timelines of currently log-in user
    doc_ref = db.collection('timelines').where('user_id', '==', uid).stream()
    doc_list = []

    # Iterate through the returned streams and converting the referenced doc into a dictonary
    # Inject the converted dictionary with the timeline_is before appending it to the doc_list array
    for doc in doc_ref:
        document_data = doc.to_dict()
        document_data['timeline_id'] = doc.id
        doc_list.append(document_data)

    return doc_list


@https_fn.on_call()
def get_user_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Queries firestore for a specific Timeline document with a given ID. Should throw an error if the user doesn't
    have access.
    """
    db = init_firestore()

    timeline_id = req.data["timeline_id"]
    # Retrieve the timeline with the given id from the collection
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

    user_id = req.auth.uid

    # Get the semester in which the person is graduating -> go from person graduating semester and work backwards
    # Write a function that said if they are graduating in Spring 2023, let me go back 8 semester -> for now assume they graduate in Spring 2024
    # Functionality needed: create timeline document

    grad_date = 'Spring 2026'
    name = 'New Timeline'
    sem = []
    hours = []

    cur_sem = grad_date[0]
    cur_year = int(grad_date[-4:])

    # Create a dictonary of semester based on the student's graduation date, for now it is hard code for Spring 2024
    for x in range(0, 8):
        tmp = ''
        # Alternate between adding fall and spring semester into the dictionary
        if (cur_sem == 'S'):
            tmp += 'Spring' + ' ' + str(cur_year)
            cur_sem = 'F'
            cur_year = cur_year - 1
            sem.append({'semester_name': tmp, 'semester_id': tmp, 'semester_courses': []})
        else:
            tmp += 'Fall' + ' ' + str(cur_year)
            cur_sem = 'S'
            sem.append({'semester_name': tmp, 'semester_id': tmp, 'semester_courses': []})

    # Reverse the Timeline semesters so they're ascending
    sem.reverse()

    # New timeline object to add to the firestore collection of the new timeline
    new_timeline = {
        'timeline_name': name,
        'user_id': user_id,
        'grad_date': grad_date,
        'timeline_semesters': sem,
        'timeline_hours': hours
    }

    doc_red = db.collection('timelines').add(new_timeline)

    return True


@https_fn.on_call()
def rename_user_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Renames a specific timeline document with a given ID. Should throw an error if the user doesn't have access.
    """
    db = init_firestore()

    # Data requested from the frontend
    timeline_id = req.data["timeline_id"]
    new_name = req.data["new_name"]

    # Retrieve reference of the timeline that needs to be renamed
    doc_ref = db.collection("timelines").document(timeline_id)
    doc_ref.update({
        'timeline_name': new_name
    })

    return True


@https_fn.on_call()
def del_user_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Deletes a specific timeline document with a given ID. Should throw an error if the user doesn't have access.
    """
    db = init_firestore()

    # Data requested from the frontend
    timeline_id = req.data["timeline_id"]

    # Retrieve reference of the timeline that needs to be renamed
    doc_ref = db.collection("timelines").document(timeline_id)
    doc_ref.delete()

    return True


@https_fn.on_call()
def add_course_to_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Add a new course to the timeline course list
    """

    db = init_firestore()

    timeline_id = req.data["timeline_id"] # -> will use later

    # Data requested from the frontend
    course_name = req.data["c_name"]
    cid = req.data["c_id"]
    s_name = req.data['sem_name']

    # Use to traverse through the timeline_semester dictionary
    index = 0

    doc_ref = db.collection('timelines').document(timeline_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise ValueError("Timeline does not exist")

    sem_ref = doc.get('timeline_semesters')

    # For loop to find the semester to add the course to
    for x in range(0, len(sem_ref)):
        if (sem_ref[x]['semester_name'] == s_name):
            index = x
            break

    # Get the dictionary of course from the Timeline document in Firestore
    course = sem_ref[index]['semester_courses']
    # Append the new course to the list
    course.append({'course_name': course_name, 'course_id': cid})
    # Updating the semester dictionary with the new dictionary with the added course
    sem_ref[index]['semester_courses'] = course

    # Update the semester in the database
    doc_ref.update({
        'timeline_semesters': sem_ref
    })

    return True


@https_fn.on_call()
def del_course_from_timeline(req: https_fn.CallableRequest) -> https_fn.Response:

    db = init_firestore()

    # Data requested from the frontend
    cid = req.data["cid"]
    sem_name = req.data['sem_name']
    timeline_id = req.data["timeline_id"]

    # Retrieve the documet from the timeline collection with the given id
    doc_ref = db.collection('timelines').document(timeline_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise ValueError("Timeline does not exist")

    # Get the semester dictionary from the timeline document
    sem_ref = doc.get('timeline_semesters')

    # Iterate through the semester array to find which semester to delete course from
    for x in range(0, len(sem_ref)):
        if (sem_ref[x]['semester_name'] == sem_name):
            index = x
            break

    # Retrieve the course array from the correct semester
    course = sem_ref[index]['semester_courses']

    # Remove the target course from the course array based on the given course id
    for x in range(0, len(course)):
        if (course[x]['course_id'] == cid):
            course.pop(x)
            break

    # Update semester course array to be the new array with the class removed
    sem_ref[index]['semester_courses'] = course

    # Update the timeline_semester field in the document
    doc_ref.update({
        'timeline_semesters': sem_ref
    })

    return True
