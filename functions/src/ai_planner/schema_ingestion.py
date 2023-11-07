import json
"""

"""

def ingest_schema(path: str):
    """
    Should read in a schema from the "src/schemas" folder. Should generate a recursive class structure with
    the "Degree Schema" class as its root and a series of "DegreeSchemaRequirement" classes as the recursive part.
    """
    with open(path) as json_file:
        json_data = json.load(json_file)
    return DegreeSchema(json_data)

class DegreeSchema:
    """
    Base class

    """

    def __init__(self, data) -> None:
        self.type = data['Type']
        self.name = data['Name']
        self.track = data['Track']
        self.courses = set()
        self.requirements = self.generate_requirements(data['Requirements'])

    def generate_requirements(self, requirement):
        requirements = []
        for req in requirement:
            requirements.append(DegreeSchemaRequirement(req))
            self.courses.update(requirements[-1].find_satisfying_courses())
        return requirements
    
    # for testing purposes
    def print_beautifully(self):
        print('Type: {}'.format(self.type)) 
        print('Name: {}'.format(self.name)) 
        print('Track: {}'.format(self.track)) 
        for r in self.requirements:
            if isinstance(r, DegreeSchemaRequirement):
                print(r.print_beautifully(0))
            else:
                print(r)

    def find_satisfying_courses(self):
        return self.courses

class DegreeSchemaRequirement:
    """
    Recursive requirement object
    """

    def __init__(self, req) -> None:  
        self.courses = set()
        self.name = req['Name']
        self.id = req['id']
        self.hours = req['Hours']
        self.required = self.create_required(req['Required'])
        self.paths = self.create_paths(req['Paths'])
        self.remainder = req['Remainder']

    def create_required(self, required):
        reqs = []
        for r in required:
            if isinstance(r,dict):
                reqs.append(DegreeSchemaRequirement(r))
                self.courses.update(reqs[-1].find_satisfying_courses())
            else:
                reqs.append(r)
                self.courses.add(r)
        return reqs

    def create_paths(self, paths):
        ps = []
        for p in paths:
            if isinstance(p,dict):
                ps.append(DegreeSchemaRequirement(p))
                self.courses.update(ps[-1].find_satisfying_courses())
            else:
                ps.append(p)
                self.courses.add(p)
        return ps
    
    def find_satisfying_courses(self):
        """
        Should query the Firestore database for any/all classes that would satisfy this Requirement.
        :return:
        """
        return self.courses
        
    # for testing purposes
    def print_beautifully(self, offset):
        res = ""
        res += (" " * offset + "Name : {}".format(self.name) + '\n')
        res += (" " * offset + "id: {}".format(self.id) + '\n')
        res += (" " * offset + "hours: {}".format(self.hours) + '\n')
        res += (" " * offset + "Requirements: [\n")
        for req in self.required:
            if isinstance(req, DegreeSchemaRequirement):
                res += (req.print_beautifully(offset+3) + '\n')
            else:
                res += (" " * (offset+3) + req + '\n')
        res += (" " * offset + "]\n")
        res += (" " * offset + "Paths: [\n")
        for path in self.paths:
            if isinstance(path, DegreeSchemaRequirement):
                res += (path.print_beautifully(offset+3) + '\n')
            else:
                res += (" " * (offset+3) + path + '\n')
        res += (" " * offset + "]\n")
        res += (" " * offset + "Remainder: [\n")
        for rem in self.remainder:
            if isinstance(rem, dict):
                res += (" " * (offset+3) + str(rem) + '\n')
            else:
                res += (" " * (offset+3) + rem + '\n')
        res += (" " * offset + "]\n")
        return res

subjects = ["economics", "history", "math", "psychology"]
schemas= []
for subject in subjects:
    schemas.append(ingest_schema("./functions/src/schemas/" + subject + ".json"))
    print("------------------------------------------------------")
    schemas[-1].print_beautifully()
    print(schemas[-1].find_satisfying_courses())