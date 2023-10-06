from src.utils.init_firestore import init_firestore

def predict_class_availability(class_id: str, term_type: str) -> int:
    """
    Takes in a class ID e.g. "CS 2201" and a term_type ("fall", "spring", "summer", "year") and returns
    0, -1, or 1 for whether we expect the class to be available in that term.
    0 --> We don't know
    -1 --> Definitely no
    1 --> Definitely yes

    This should query the Firestore database and look at, for example, the past 2 "spring" semesters.
    if the class was available in both of them, we can reasonably expect that it'll be available, and thus we
    can return 1.
    """
    db = init_firestore()

    pass