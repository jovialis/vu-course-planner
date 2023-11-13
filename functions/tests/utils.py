

def initialize_app_for_testing():
    from firebase_admin import get_app, initialize_app

    try:
        get_app()
    except:
        initialize_app()


def compare_lists(list1: list, list2: list):
    def compare_elements(e1, e2):
        """Compares two elements, which could be lists or non-list elements."""
        if isinstance(e1, list) and isinstance(e2, list):
            return compare_lists(e1, e2)
        else:
            return e1 == e2

    def flatten_list(lst):
        """Recursively flattens a multi-dimensional list."""
        flat_list = []
        for item in lst:
            if isinstance(item, list):
                flat_list.extend(flatten_list(item))
            else:
                flat_list.append(item)
        return flat_list

    if list1 == list2:
        return True

    if len(list1) != len(list2):
        return False

    # Sort both lists. If items aren't lists, convert hem to string and compare them as-is. If they are lists,
    # make them comparable by flattening them, sorting their elements, and concatenating them into a string
    sorted_list1 = sorted(list1, key=lambda x: ",".join(map(lambda x: str(x), sorted(flatten_list(x)))) if isinstance(x, list) else str(x))
    sorted_list2 = sorted(list2, key=lambda x: ",".join(map(lambda x: str(x), sorted(flatten_list(x)))) if isinstance(x, list) else str(x))

    for elem1, elem2 in zip(sorted_list1, sorted_list2):
        if not compare_elements(elem1, elem2):
            return False

    return True

