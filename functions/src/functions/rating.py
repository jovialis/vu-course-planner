from src.utils.init_firestore import init_firestore
from firebase_admin import credentials, firestore
from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from firebase_functions import identity_fn

@https_fn.on_call()
def rating(req: https_fn.CallableRequest) -> https_fn.Response:
    return True
    # uid = req.auth.uid
    # # Call function that initializes firestore
    # db = init_firestore()

    # #  code to get all the timelines of currently log-in user
    # course = req.data["course"]
    # cur_rate = req.data["rate"]

    # user_ref = db.collection('user').document(uid)
    # user_doc = user_ref.get()
    # user_dict = None
    # if user_doc.exists:
    #     user_dict = user_doc.to_dict()
    # else:
    #     return "User don't exist"
    
    # user_rating = 0;
    # if "rating" in user_dict:
    #     if "course" in user_dict["rating"]:
    #         user_rating = user_dict["rating"]["course"]
    
    # if cur_rate == user_rating:
    #     return "Already rated"
    

    # doc_ref = db.collection('rating').document(course)
    # if cur_rate is 1:
    #     doc_ref.update({"like": firestore.Increment(1)})
       
    # elif cur_rate is -1:
    #     doc_ref.update({"dislike": firestore.Increment(-1)})
    
    # user_dict["rating"]["course"] = cur_rate
    # ret = user_doc.set(user_dict)
    # return True




@https_fn.on_call()
def get_rating(req: https_fn.CallableRequest) -> https_fn.Response:
    db = firestore.client()
    ref = db.collection("rating").document(req.data["course_id"])
    doc = ref.get()
    if doc.exists:
        return doc.to_dict()
    else:
        return doc.to_dict()