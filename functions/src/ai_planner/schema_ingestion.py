

"""

"""

def ingest_schema(path: str):
    """
    Should read in a schema from the "src/schemas" folder. Should generate a recursive class structure with
    the "Degree Schema" class as its root and a series of "DegreeSchemaRequirement" classes as the recursive part.
    """

    pass


class DegreeSchema:
    """
    Base class
    """
    pass


class DegreeSchemaRequirement:
    """
    Recursive requirement object
    """

    def find_satisfying_courses(self):
        """
        Should query the Firestore database for any/all classes that would satisfy this Requirement.
        :return:
        """
        pass