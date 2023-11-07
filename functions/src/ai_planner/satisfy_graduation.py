import sys
from schema_ingestion import DegreeSchema
from schema_ingestion import DegreeSchemaRequirement
from schema_ingestion import ingest_schema
# from firebase_functions import https_fn
# from ..functions.lookups import lookup_course
sys.path.append('../functions')
import lookups

psychology =ingest_schema("../schemas/" + "psychology" + ".json")
print(psychology)
print(1)

def determine_graduation(course_list: set(), major : DegreeSchema):
    for requirement in major.requirements:
        if not determine_requirement_schema(course_list, requirement):
            return False
    return True

def determine_requirement_schema(course_list: set(), schema_requirement : DegreeSchemaRequirement):
    required = satisfy_requirement_schema_required(course_list, schema_requirement)
    if required < 0:
        return False
    
    path = satisfy_requirment_schema_path(course_list, schema_requirement)
    if path < 0:
        return False
    
    remain = schema_requirement["Hours"] - required - path

    return check_remainder(remain, schema_requirement.remainder, course_list)

# Check the requirement fo a DegreeSchemaRequirement
def satisfy_requirement_schema_required(course_list: set(), schema_requirement : DegreeSchemaRequirement):
    ret = 0
    for req in schema_requirement.required:
        if isinstance(req,dict):
            satisfy = determine_requirement_schema(course_list, req)
            if satisfy is False:
                return -1
            else :
                ret += req["Hours"]
        else:
            if req not in course_list:
                return -1
            course_info = lookups({"id": req})
            ret += course_info["hours"]
    return ret

def satisfy_requirment_schema_path(course_list: set(), schema_requirement: DegreeSchemaRequirement):
    for path in schema_requirement.paths:
        if isinstance(path, dict):
            ret = determine_requirement_schema(course_list, path)
            if ret is True:
                return path["Hours"]
        else :
            if path in course_list:
                course_info = lookups({"id": path})
                return course_info["hours"]
    return -1

def check_remainder(hours, remainders, course_list):
    sum = 0
    for remain in remainders:
        if sum >= hours:
            return True
        if isinstance(remain, dict):
            subject = remain["subject"]
            if 'cond' in remain:
                print(1)
            else :
                for course in course_list:
                    if subject.lower() in course:
                        course_info = lookups({"id": course})
                        sum += course_info["hours"]
                        if sum >= hours:
                            return True             
        else :
            if remain in course_list:
                course_info = lookups({"id": remain})
                sum += course_info["hours"]

    if sum >= hours:
        return True
    else : 
        return False
    
                