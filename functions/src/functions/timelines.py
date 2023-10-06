from firebase_functions import https_fn
from src.utils.init_firestore import init_firestore

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

    pass


@https_fn.on_call()
def get_user_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Queries firestore for a specific Timeline document with a given ID. Should throw an error if the user doesn't
    have access.
    """
    db = init_firestore()

    pass


@https_fn.on_call()
def create_user_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Creates a new Timeline document with the provided name and a "user" field equal to the currently logged
    in user.
    """
    db = init_firestore()

    pass


@https_fn.on_call()
def rename_user_timeline(req: https_fn.CallableRequest) -> https_fn.Response:
    """
    Renames a specific timeline document with a given ID. Should throw an error if the user doesn't have access.
    """
    db = init_firestore()

    pass