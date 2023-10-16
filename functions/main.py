from firebase_admin import credentials, firestore
from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from firebase_functions import identity_fn

# from src.functions.timelines import
from src.ai_planner.class_frequency_prediction import predict_class_availability
from src.functions.login import validate_new_user
from src.functions.lookups import lookup_course

initialize_app()

@https_fn.on_request()
def test(req: https_fn.CallableRequest):
    return {
        "result": predict_class_availability("amer 1001", "spring")
    }


@https_fn.on_call()
def addUser(req: https_fn.CallableRequest) -> https_fn.Response:
    print("add1")
    print(req.data)
    print(req.data["major"])
    # print("Here1")
    db = firestore.client()
    # print("Here2")
    # data =  { "Name" : "Billy", "Major" : "Computer Science", "Minor" : "N/A", "Second Major" : "N/A", "Expected Graduation Term" : "Spring 2026" }
    data = {"username": req.data["username"],
            "name": req.data["name"], 
            "major": req.data["major"],
            "minor": req.data["minor"],
            "sec_major": req.data["second_major"],
            "graduation_year": req.data["year"],
            "graduation_term": req.data["term"],
            "completed_courses": req.data["completeCourses"]}
    
    ref = db.collection("Users").document(req.auth.uid)

    ret = ref.set(data)
    print("ret")
    print(ret)
    return True

@https_fn.on_call()
def readDoc(req : https_fn.CallableRequest, ) -> https_fn.Response:
    # print(req)
    # doc_name = req.data["username"]
    db = firestore.client()
    ref = db.collection("Users").document(req.auth.uid)

    doc = ref.get()
    
    if doc.exists:
        return doc.to_dict()
    else:
        return doc.to_dict()
    

# @https_fn.on_call()
# def addUser(req: https_fn.CallableRequest, ) -> https_fn.Response:
#     print("Here1")
#     db = firestore.client()
#     print("Here2")
    
#     data =  {          
#         "Name" : req.username,
#         "Major" : req.major,
#         "Minor" : req.minor,
#     }

#     ref = db.collection("Users").document('JPjFjauMlLF12oOwXcJI')
#     print("Here3")
#     ref.set(data)
#     print("Here4")
