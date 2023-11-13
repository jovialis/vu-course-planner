from src.ai_planner.class_frequency_prediction import predict_class_availability
from src.ai_planner.class_frequency_prediction import predict_class_term_availability

def test_class_term_avai_simple():
    test_class="CS 1101"
    all_term_ids = ["fall", "spring", "summer", "year"]
    assert(predict_class_term_availability(test_class, all_term_ids[0], 3, None) == 1)
    assert(predict_class_term_availability(test_class, all_term_ids[1], 3, None) == 1)
    assert(predict_class_term_availability(test_class, all_term_ids[2], 3, None) == 0)
    assert(predict_class_term_availability(test_class, all_term_ids[3], 3, None) == -1)

def test_class_term_avai_complex():
    test_class="CS 3262"
    all_term_ids = ["fall", "spring", "summer", "year"]
    assert(predict_class_term_availability(test_class, all_term_ids[0], 3, None) == 0)
    assert(predict_class_term_availability(test_class, all_term_ids[1], 3, None) == 0)
    assert(predict_class_term_availability(test_class, all_term_ids[2], 3, None) == -1)
    assert(predict_class_term_availability(test_class, all_term_ids[3], 3, None) == -1)

def test_class_avai():
    test_class="ENGL 3611"
    all_term_ids = ["fall", "spring", "summer", "year"]
    assert(predict_class_availability(test_class, 3, None) == [-1, 0, -1, -1])


