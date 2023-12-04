

def get_available_schemas():
    import json

    __schema_urls = [
        # "src/schemas/computer_science.json",
        "src/schemas/economics.json",
        "src/schemas/history.json",
        # "src/schemas/math.json",
        "src/schemas/psychology.json"
    ]

    schema_list = []

    for url in __schema_urls:
        with open(url, "r") as schema_file:
            schema_data = json.load(schema_file)
            schema_list.append(schema_data)

    schema_map = {}

    for schema_data in schema_list:
        schema_name: str = schema_data["Name"]
        schema_map[schema_name.lower().replace(" ", "_")] = schema_data

    return schema_map


AVAILABLE_SCHEMAS = get_available_schemas()
