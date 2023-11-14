from src.ai_planner.schema_ingestion import DegreeSchema
from src.ai_planner.schema_ingestion import DegreeSchemaRequirement
from src.ai_planner.schema_ingestion import ingest_schema
# from firebase_functions import https_fn
# from src.utils.init_firestore import init_firestore

def lookups(obj):
    ret = {
        "hours": 3
    }
    return ret

# psychology = ingest_schema("../schemas/" + "psychology" + ".json")
# print(psychology)
# print(1)

def determine_graduation(course_list: set(), major : DegreeSchema):
    clone_list = course_list.copy()
    for requirement in major.requirements:
        result = determine_requirement_schema(clone_list, requirement)
        print(result)
        if not result:
            print(clone_list)
            return False
    print(clone_list)
    return True

def determine_requirement_schema(course_list: set(), schema_requirement : DegreeSchemaRequirement):
    
    required = satisfy_requirement_schema_required(course_list, schema_requirement)
    # print(required)
    if required < 0:
        return False
    
    path = satisfy_requirment_schema_path(course_list, schema_requirement)
    # print(path)
    if path < 0:
        return False
    
    remain = schema_requirement.hours - required - path
    print(course_list)
    return check_remainder(remain, schema_requirement.remainder, course_list)

# Check the requirement fo a DegreeSchemaRequirement
def satisfy_requirement_schema_required(course_list: set(), schema_requirement : DegreeSchemaRequirement):
    ret = 0
    for req in schema_requirement.required:
        if isinstance(req,DegreeSchemaRequirement):
            satisfy = determine_requirement_schema(course_list, req)
            if satisfy is False:
                return -1
            else :
                ret += req.hours
        else:
            if req not in course_list:
                return -1
            course_list.discard(req)
            course_info = lookups({"id": req})
            ret += course_info["hours"]
    return ret

def satisfy_requirment_schema_path(course_list: set(), schema_requirement: DegreeSchemaRequirement):
    if not schema_requirement.paths:
        return 0
    for path in schema_requirement.paths:
        if isinstance(path, DegreeSchemaRequirement):
            # print(-11)
            ret = determine_requirement_schema(course_list, path)
            if ret is True:
                return path.hours
        else :
            if path in course_list:
                course_info = lookups({"id": path})
                course_list.discard(path)
                return course_info["hours"]
    return -1

def check_remainder(hours, remainders, course_list):
    sum = 0
    for remain in remainders:
        # print(remain)
        # if sum >= hours:
        #     return True
        if isinstance(remain, dict):
            subject = remain["subject"]
            # if remain["cond"]:
            #     print(1)
            # else :
            for_discard = []
            for course in course_list:
                satisfy = check_list_cond(course, remain["cond"])
                if subject in course and satisfy:
                    # satisfy = check_list_cond(course, remain["cond"])
                    course_info = lookups({"id": course})
                    sum += course_info["hours"]
                    for_discard.append(course)
                    print(course)
                    if sum >= hours:
                        break    
            for item in for_discard:
                course_list.discard(item)
            if sum >= hours:
                # for item in for_discard:
                #     course_list.discard(item)
                return True        
        else :
            if remain in course_list:
                course_info = lookups({"id": remain})
                course_list.discard(remain)
                sum += course_info["hours"]

    if sum >= hours:
        return True
    else : 
        return False
    
def check_condition(course : str, cond: str):
    split_course = course.split(maxsplit=1)
    split_cond = cond.split(maxsplit=1)
    if split_cond[0] == "!=":
        return split_course[1] != split_cond[1]
    elif split_cond[0] == ">=":
        return split_course[1] >= split_cond[1]
    elif split_cond[0] == "<=":
        return split_course[1] <= split_cond[1]

def check_list_cond(course: str, conds : [str]):
    for cond in conds :
        if not check_condition(course, cond):
            return False
    return True

# test_psychology = ingest_schema("../schemas/" + "psychology" + ".json")
# test_psychology_list = {
#     "PSY 1200",
#     "PSY 2150",
#     "PSY 2100",
#     "PSY 3100", 
#     "PSY 3110", 
#     "PSY 3120", 
#     "PSY 3750",
#     "HOD 1111",
#     "PSY 9999",
#     "PSY 9998",
#     "HOD 1112",
#     "PSY 2201", #shouldn't qualify
#     "CS 1101", #useless course
# }
# result_psychology = determine_graduation(test_psychology_list, test_psychology)
# print(result_psychology)



# test_history = ingest_schema("../schemas/" + "history" + ".json")
# test_history_list = {
#     "HIST 1038",
# 	"HIST 1039",
# 	"HIST 1050",
# 	"HIST 1060",
# 	"HIST 1061W",
#     "HIST 3000W",
#     "HIST 3883",
# 	"HIST 3880",
#     "HIST 3883",
# 	"HIST 3890",
# 	"HIST 3980",
# 	"HIST 4960",
#     "HIST 9999"
# }

# result_history = determine_graduation(test_history_list, test_history)
# print(result_history)


# test_list = {"PSY 1200", "PSY 2150", "PSY 2100", "PSY 3100", "PSY 3110", 
#              "PSY 3120", "PSY 3750", "NSC 2201", "PSYC 1111",
#                 "PSYC 1112",
#                 "PSYC 1113",
#                 "PSYC 1114",
#                 "PSYC 1115"}
# print("PSYC 1115" in test_list)
# test_psychology = ingest_schema("../schemas/" + "test_psychology" + ".json")

# result = determine_graduation(test_list, test_psychology)
# print(result)

# test_list_fail = {"PSY 1200", "PSY 2150", "PSY 2100", "PSY 3100", "PSY 3110", 
#              "PSY 3120", "PSY 3750", "NSC 2201", "PSYC 1111",
#                 "PSYC 1112",
#                 "PSYC 1113",}

# result_fail = determine_graduation(test_list_fail, test_psychology)

# print(result_fail)