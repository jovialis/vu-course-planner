from src.utils.init_firestore import init_firestore

all_term_ids = ["fall", "spring", "summer", "year"]

def predict_class_availability(class_id: str, num_sem = 3, pre_fetched_terms = None):
    db = init_firestore()

    ref_terms = db.collection("yes_terms") # Collection for the terms information

    if pre_fetched_terms is not None:
        terms = pre_fetched_terms
    else:
        terms = ref_terms.get()

    results = {}

    for term_id in all_term_ids:
        availability = predict_class_term_availability(class_id, term_id, num_sem, terms)
        results[term_id] = availability

    return results


def predict_class_term_availability(class_id: str, term_type: str, num_sem = 3, pre_fetched_terms = None) -> int:
    """
    Takes in a class ID e.g. "CS 2201" and a term_type ("fall", "spring", "summer", "year") and returns
    0, -1, or 1 for whether we expect the class to be available in that term.
    0 --> We don't know
    -1 --> Definitely no
    1 --> Definitely yes

    This should query the Firestore database and look at, for example, the past 2 "spring" semesters.
    if the class was available in both of them, we can reasonably expect that it'll be available, and thus we
    can return 1.
    num_sem is the number of past semester we want to track back
    """
    db = init_firestore()

    ref_courses = db.collection("courses") # Collrection for the courses
    ref_terms = db.collection("yes_terms") # Collection for the terms information
    course = ref_courses.document(class_id).get()
    if course.exists:
        # print("Course")
        # print(course)
        content = course.to_dict()
        # print(content)
        avail = content["availability"]
        # print("terms")
        # print(ref_terms)
        if pre_fetched_terms is not None:
            terms = pre_fetched_terms
        else:
            terms = ref_terms.stream()

        terms_list = []
        
        for term in terms:
            # print("lower")
            # print(term_type, "in", term.get("name").lower())
            if term_type in term.get("name").lower():
                terms_list.append((term.get("id"), int(term.get("id")))) #All terms that fit the term type
        
        # print("terms_list")
        # print(terms_list)
        terms_list = sorted(terms_list, reverse=True, key=lambda term: term[1])


        top = terms_list[:num_sem]      
        # After finding the top num_sem semseter with the term type, I need to check the frequency of that 
        # course is offered in the past num_sem semesters
        # print("top", term_type)
        # print(top)

        count = 0
        for i in range(num_sem):
            if avail[top[i][0]] == True:
                count += 1
        
        frequency = count / num_sem
        
        if frequency > 0.75:
            return 1
        elif frequency < 0.25:
            return -1
        else :
            return 0

    else:
        raise Exception("The course you try to look for doesn't exist")
