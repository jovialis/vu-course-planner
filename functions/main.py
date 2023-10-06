from firebase_admin import credentials, firestore
from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from firebase_functions import identity_fn

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




    #req.authentication.currentUser;


# Block account creation with any non-acme email address.
@identity_fn.before_user_created()
def validatenewuser(
    event: identity_fn.AuthBlockingEvent,
) -> identity_fn.BeforeCreateResponse | None:
    # User data passed in from the CloudEvent.
    user = event.data

    # Only users of a specific domain can sign up.
    if user.email is None or "@vanderbilt.edu" not in user.email:
        # Return None so that Firebase Auth rejects the account creation.
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message="Unauthorized email",
        )

