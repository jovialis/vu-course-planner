def test_determine_graduation__simple():
    from src.ai_planner.satisfy_graduation import determine_graduation
    from src.ai_planner.schema_ingestion import ingest_schema
    test_list_success = {"PSY 1200", "PSY 2150", "PSY 2100", "PSY 3100", "PSY 3110", 
                "PSY 3120", "PSY 3750", "NSC 2201", "PSYC 1111",
                    "PSYC 1112",
                    "PSYC 1113",
                    "PSYC 1114",
                    "PSYC 1115"}
    simple_psychology = ingest_schema("../schemas/" + "test_psychology" + ".json")
    result_success = determine_graduation(test_list_success, simple_psychology)

    test_list_fail = {"PSY 1200", "PSY 2150", "PSY 2100", "PSY 3100", "PSY 3110", 
             "PSY 3120", "PSY 3750", "NSC 2201", "PSYC 1111",
                "PSYC 1112",
                "PSYC 1113",}
    result_fail = determine_graduation(test_list_fail, simple_psychology)
    assert((result_success, result_fail)) == (True, False)

def test_determine_graduation_remainder_simple():
    from src.ai_planner.satisfy_graduation import determine_graduation

    from src.ai_planner.schema_ingestion import ingest_schema
    test_history = ingest_schema("../schemas/" + "history" + ".json")
    test_history_list = {
        "HIST 1038",
        "HIST 1039",
        "HIST 1050",
        "HIST 1060",
        "HIST 1061W",
        "HIST 3000W",
        "HIST 3883",
        "HIST 3880",
        "HIST 3883",
        "HIST 3890",
        "HIST 3980",
        "HIST 4960",
        "HIST 9999"
    }
    result_history_success = determine_graduation(test_history_list, test_history)
    test_history_list_fail = {
        "HIST 1038",
        "HIST 1039",
        "HIST 1050",
        "HIST 1060",
        "HIST 1061W",
        "HIST 3000W",
        "HIST 3883",
        "HIST 3880",
        "HIST 3883",
        "HIST 3890",
        "HIST 3980",
        "HIST 4960",
        "CS 1101",
        "CS 1104",
    }
    result_history_fail = determine_graduation(test_history_list_fail, test_history)
    assert((result_history_success, result_history_fail)) == (True, False)

def test_check_list_cond():
    from src.ai_planner.satisfy_graduation import determine_graduation

    from src.ai_planner.schema_ingestion import ingest_schema
    from src.ai_planner.satisfy_graduation import check_list_cond
    empty = check_list_cond("CS 1101", [])
    success = check_list_cond("CS 1101", ["!= 1100", ">= 1000"])
    fail = check_list_cond("CS 1101", ["!= 1101", ">= 1000"])
    assert(empty == True)
    assert(success == True)
    assert(fail == False)

def test_test_determine_graduation_remainder_complex():
    from src.ai_planner.satisfy_graduation import determine_graduation

    from src.ai_planner.schema_ingestion import ingest_schema
    from src.ai_planner.satisfy_graduation import check_list_cond
    test_psychology = ingest_schema("../schemas/" + "psychology" + ".json")
    test_psychology_list = {
        "PSY 1200",
        "PSY 2150",
        "PSY 2100",
        "PSY 3100", 
        "PSY 3110", 
        "PSY 3120", 
        "PSY 3750",
        "HOD 1111",
        "PSY 9999",
        "PSY 9998",
        "HOD 1112",
        "PSY 2201", #shouldn't qualify
        "CS 1101", #useless course
    }
    result_psychology = determine_graduation(test_psychology_list, test_psychology)
    assert(result_psychology == True)
    test_psychology_list_fail = {
        "PSY 1200",
        "PSY 2150",
        "PSY 2100",
        "PSY 3100", 
        "PSY 3110", 
        "PSY 3120", 
        "PSY 3750",
        "HOD 1111",
        "PSY 9999",
        "PSY 1250", #shouldn't qualify
        "HOD 1112",
        "PSY 2201", #shouldn't qualify
        "CS 1101", #useless course
    }
    result_psychology_fail = determine_graduation(test_psychology_list_fail, test_psychology)
    assert(result_psychology_fail == False)

# def test_determine_requirement_schema():
#     from src.ai_planner.satisfy_graduation import determine_requirement_schema
#     print(2)


# def test_satisfy_requirement_schema_required():
#     from src.ai_planner.satisfy_graduation import satisfy_requirement_schema_required
#     print(3)

# def test_satisfy_requirment_schema_path():
#     from src.ai_planner.satisfy_graduation import satisfy_requirment_schema_path

# def test_check_remainder():
#     from src.ai_planner.satisfy_graduation import check_remainder
    