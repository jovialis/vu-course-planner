

def test__init_firestore():
    from src.utils.init_firestore import init_firestore

    assert init_firestore() is not None