from src.utils.init_firestore import init_firestore
from firebase_admin import credentials, firestore
from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from firebase_functions import identity_fn


@https_fn.on_call()
def rating(req: https_fn.CallableRequest) -> https_fn.Response:
    uid = req.auth.uid
    # Call function that initializes firestore
    db = firestore.client()
    course = req.data["course"]
    cur_rate = req.data["rate"]
    user_ref = db.collection('users').document(uid)
    user_doc = user_ref.get()
    user_dict = None
    if user_doc.exists:
        user_dict = user_doc.to_dict()
    else:
        return "User don't exist"
    
    # Make sure the user haven't vote the same thing already
    user_rating = 0
    print(user_dict)
    if "rating" in user_dict:
        print(1122)
        if course in user_dict["rating"]:
            print(2211)
            user_rating = user_dict["rating"][course]
            print(user_rating)
    
    if cur_rate == user_rating:
        print("Already rated")
        return "Already rated"

    doc_ref = db.collection('rating').document(course)
    course_doc = doc_ref.get()
    if not course_doc.exists:
        doc_ref.set({"like": 0, "dislike": 0})
    if cur_rate is 1:
        if user_rating is not 0:
            doc_ref.update({"dislike": firestore.Increment(-1)})
        doc_ref.update({"like": firestore.Increment(1)})
    elif cur_rate is -1:
        if user_rating is not 0:
            doc_ref.update({"like": firestore.Increment(-1)})
        doc_ref.update({"dislike": firestore.Increment(1)})
    
    user_dict["rating"][course] = cur_rate
    ret = user_ref.set(user_dict)
    return doc_ref.get().to_dict()



# Get the rating of a course
@https_fn.on_call()
def get_rating(req: https_fn.CallableRequest) -> https_fn.Response:
    db = firestore.client()
    ref = db.collection("rating").document(req.data["course_id"])
    doc = ref.get()
    if doc.exists:
        return doc.to_dict()
    else:
        return "none"