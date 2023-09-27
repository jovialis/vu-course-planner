from firebase_admin import credentials, firestore
from firebase_functions import https_fn, options

@https_fn.on_call()
def addUser(req: https_fn.CallableRequest) -> https_fn.Response:
    print("Here1")
    db = firestore.client()
    print("Here2")
    data =  {  
        "Name" : "Billy Smith",
        "Major" : "Computer Science",
        "Minor" : "N/A",
        "Second Major" : "N/A",
        "Expected Graduation Term" : "Spring 2026",
        "Completed Courses" : ["CS 2201"],
    }
    db.collection("Users").document("New User").set(data)
    return https_fn.Response("Hello world!")



    #req.authentication.currentUser;


