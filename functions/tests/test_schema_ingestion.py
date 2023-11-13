import sys
sys.path.insert(1, 'functions/src/ai_planner')

def test__schema_ingestion__function():
    import schema_ingestion as si
    path = "./functions/src/schemas/math.json"
    ds = si.ingest_schema(path)
    assert isinstance(ds, si.DegreeSchema)
    assert ds.type == "Major"
    assert ds.name == "Mathematics"
    assert len(ds.courses) == 11
    assert len(ds.requirements) == 5

def test__major_schema__object():
    import schema_ingestion as si
    path = "./functions/src/schemas/math.json"
    ds = si.ingest_schema(path)
    courses = {'MATH 1301', 'MATH 2420', 'MATH 2400', 'MATH 1300', 'MATH 2610', 'MATH 2300', 'MATH 2410', 'MATH 2310', 'MATH 2600', 'MATH 2501', 'MATH 2500'}   
    assert ds.courses == courses
    for req in ds.requirements:
        assert isinstance(req, si.DegreeSchemaRequirement) 

def test__major_schema_requirement__object():
    import schema_ingestion as si
    path = "./functions/src/schemas/math.json"
    ds = si.ingest_schema(path)
    calc_seq = ds.requirements[0]
    assert calc_seq.hours == 9
    assert calc_seq.required[0] == 'MATH 1300' and calc_seq.required[1] == 'MATH 1301'
    assert calc_seq.paths[0] == 'MATH 2300' and calc_seq.paths[1] == 'MATH 2310' and isinstance(calc_seq.paths[2], si.DegreeSchemaRequirement)
    lin_alg = ds.requirements[1]
    assert lin_alg.hours == 6
    assert len(lin_alg.required) == 0
    for p in lin_alg.paths:
        assert isinstance(p, si.DegreeSchemaRequirement)
    rec_req = lin_alg.paths[0]
    assert isinstance(rec_req.required[0], si.DegreeSchemaRequirement)
    assert rec_req.paths[0] == "MATH 2410" and rec_req.paths[1] == "MATH 2600" and isinstance(rec_req.paths[2], si.DegreeSchemaRequirement)
