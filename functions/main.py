# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

# from firebase_functions import https_fn
# from firebase_admin import db, initialize_app

# initialize_app()

# @https_fn.on_request() # Change this to on_call 
# def on_request_example(req: https_fn.Request) -> https_fn.Response:
#     return https_fn.Response("Hello world!")
from firebase_admin import credentials, firestore

@https_fn.on_call()
def addUser(req: https_fn.CallableRequest) -> https_fn.Response:
    db = firestore.client()
    data =  {  
        "Name" : "Billy Smith",
        "Major" : "Computer Science",
        "Minor" : "N/A",
        "Second Major" : "N/A",
        "Expected Graduation Term" : "Spring 2026",
        "Completed Courses" : ["CS 2201"],
    }
    db.collection("Users").document("New User").set(data)



    #req.authentication.currentUser;


