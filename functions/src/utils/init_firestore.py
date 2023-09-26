from firebase_admin import firestore
from google.cloud.firestore_v1.client import Client


def init_firestore():
    db: Client = firestore.client()
    return db
