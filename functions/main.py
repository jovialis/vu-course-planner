from firebase_admin import credentials, firestore
from firebase_functions import https_fn, options
from firebase_admin import initialize_app

initialize_app()
@https_fn.on_call()
def addUser(req: https_fn.CallableRequest) -> https_fn.Response:
    print("add1")
    print(req)
    print("Here1")
    db = firestore.client()
    print("Here2")
    # data =  { "Name" : "Billy", "Major" : "Computer Science", "Minor" : "N/A", "Second Major" : "N/A", "Expected Graduation Term" : "Spring 2026" }
    data = {"name": "Los Angeles", "state": "CA", "country": "US"}
    ref = db.collection("Users").document("JPjFjauMlLF12oOwXcJI")

    ret = ref.set(data)
    return ret

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



