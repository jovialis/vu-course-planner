import json
from src.lookups import courses


def ingest_schema(path: str):
    """
    Should read in a schema from the "src/schemas" folder. Should generate a recursive class structure with
    the "Degree Schema" class as its root and a series of "DegreeSchemaRequirement" classes as the recursive part.
    """

    # open the file as json 
    with open(path) as json_file:
        json_data = json.load(json_file)
    
    # pass in the json data to be deserialized as a DegreeSchema object
    return DegreeSchema(json_data, {}, [])


class DegreeSchema:
    """
    Base class
    This is the object representation of our degree requirements schema
    It encapsulates all the data in our major schema
    """

    def __init__(self, data, with_paths: dict[str, int], taken_courses: list[str]) -> None:
        self.type = data['Type']
        self.name = data['Name']
        self.track = data['Track']
        # this contains all the unique courses that may be required for the major
        self.courses = set()
        self.requirements = self.generate_requirements(data['Requirements'], with_paths, taken_courses)

    # Function that iterates through the requirements and creates a 
    # nested DegreeSchemaRequirement object
    def generate_requirements(self, requirement, with_paths: dict[str, int], taken_courses: list[str]):
        requirements = []
        for req in requirement:
            requirements.append(DegreeSchemaRequirement(req, with_paths, taken_courses))
            self.courses.update(requirements[-1].find_satisfying_courses())
        return requirements
    
    # Prints out the degree schema in a readable format
    def print_beautifully(self):
        print('Type: {}'.format(self.type)) 
        print('Name: {}'.format(self.name)) 
        print('Track: {}'.format(self.track)) 
        for r in self.requirements:
            if isinstance(r, DegreeSchemaRequirement):
                print(r.print_beautifully(0))
            else:
                print(r)

    # returns all courses that may contribute to the degree requirement
    def find_satisfying_courses(self):
        return self.courses

class DegreeSchemaRequirement:
    """
    Recursive requirement object
    This is a nested sub requirement for the DegreeSchema 
    It is the individual requirement components that combine to create the 
    overall degree requirement 
    """

    def __init__(self, req, with_paths: dict[str, int], taken_courses: list[str], all_existing_courses: list[dict]) -> None:
        self.courses = set()
        self.name = req['Name']
        self.id = req['id']
        self.hours = req['Hours']
        self.required = self.create_required(req['Required'], with_paths, taken_courses, all_existing_courses)
        self.paths = self.create_paths(req['Paths'], req["id"], with_paths, taken_courses, all_existing_courses)
        self.remainder = self.create_remainder(req['Remainder'], with_paths, taken_courses, all_existing_courses)

    # Deserializes the required field in our json data 
    def create_required(self, required, with_paths: dict[str, int], taken_courses: list[str], all_existing_courses: list[dict]):
        reqs = []
        for r in required:
            # Create a nested DegreeSchemaRequirement
            if isinstance(r,dict):
                reqs.append(DegreeSchemaRequirement(r, with_paths, taken_courses, all_existing_courses))
                self.courses.update(reqs[-1].find_satisfying_courses())
            # Requirement is simply a class
            else:
                print("Not nested requirement for", r)

                # Only return if the course hasn't been taken
                if r.lower() not in taken_courses:
                    reqs.append(r)
                    self.courses.update(courses.find_dependencies(r, all_existing_courses))

        print("Create required", reqs, "courses", self.courses)
        return reqs

    # Deserializes the path field in our json data 
    def create_paths(self, paths, my_id: str, with_paths: dict[str, int], taken_courses: list[str], all_existing_courses: list[dict]):
        ps = []

        selected_paths = paths

        # If there is a path selected for this requirement, only process that one
        if len(paths) > 0 and my_id in with_paths and with_paths[my_id] < len(selected_paths):
            selected_paths = [paths[with_paths[my_id]]]

        for p in selected_paths:
            # Create a nested DegreeSchemaRequirement
            if isinstance(p,dict):
                ps.append(DegreeSchemaRequirement(p, with_paths, taken_courses, all_existing_courses))
                self.courses.update(ps[-1].find_satisfying_courses())
            # Requirement is simply a class
            else:
                if p.lower() not in taken_courses:
                    ps.append(p)
                    self.courses.update(courses.find_dependencies(p, all_existing_courses))
        return ps
    
    def create_remainder(self, remainder, with_paths: dict[str, int], taken_courses: list[str], all_existing_courses: list[dict]):
        rem = set()
        for r in remainder:
            if isinstance(r, dict):
                if "cond" in r:
                    ret = courses.fetch_cond_courses(r["subject"], r["cond"], all_existing_courses)
                    rem.update(ret)
                    self.courses.update(ret)
            else:
                if r.lower() not in taken_courses:
                    rem.add(r)
                    self.courses.update(courses.find_dependencies(r, all_existing_courses))
        return list(rem)

    def find_satisfying_courses(self):
        """
        Return all the unique course ids that may contribute to the DegreeSchemaRequirement
        """
        return self.courses
        
    # Prints out the degree schema requirement in a readable format
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
