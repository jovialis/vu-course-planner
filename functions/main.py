from firebase_admin import credentials, firestore
from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from firebase_functions import identity_fn
from src.functions.login import validate_new_user
from src.functions.timelines import get_user_timelines
from src.functions.timelines import get_user_timeline
from src.functions.timelines import rename_user_timeline
from src.functions.timelines import create_user_timeline
from src.functions.timelines import add_course_timeline
from src.functions.timelines import del_course_timeline
from src.functions.lookups import lookup_course

initialize_app()
@https_fn.on_call()
def addUser(req: https_fn.CallableRequest) -> https_fn.Response:
    print("add1")
    print(req.data)
    print(req.data["major"])
    # print("Here1")
    db = firestore.client()
    # print("Here2")
    # data =  { "Name" : "Billy", "Major" : "Computer Science", "Minor" : "N/A", "Second Major" : "N/A", "Expected Graduation Term" : "Spring 2026" }
    data = {"name": req.data["name"], 
            "major": req.data["major"],
            "minor": req.data["minor"],
            "sec_major": req.data["second_major"],
            "graduation_year": req.data["year"],
            "graduation_term": req.data["term"]}
    
    ref = db.collection("Users").document(req.data["username"])

    ret = ref.set(data)
    print("ret")
    print(ret)
    return True

@https_fn.on_call()
def readDoc(req : https_fn.CallableRequest, ) -> https_fn.Response:
    # print(req)
    doc_name = req.data["username"]
    db = firestore.client()
    ref = db.collection("Users").document(doc_name)

    doc = ref.get()
    # print("Doc: ")
    # print(doc)
    if doc.exists:
        return doc.to_dict()
    
    else:
        return doc.to_dict()
        # print("No such document!")
    

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
