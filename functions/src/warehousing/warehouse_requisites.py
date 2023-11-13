def __structure_course_requisites(requisites: str):
    import openai
    openai.api_key = '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'

    import os

    print(os.listdir())

    with open("../src/prompts/extract_requisites", "r") as prompt_file:
        requisites_prompt = prompt_file.read()

    # Prompt the model
    response = openai.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "system", "content": requisites_prompt},
            {"role": "user", "content": requisites}
        ]
    )

    # Assuming the response is in text form and is valid YAML
    yaml_response = response.choices[0].message.content
    print(yaml_response)

    import yaml
    try:
        # Parse the YAML response
        parsed_struct = yaml.safe_load(yaml_response.replace("```", "").replace("```yaml", ""))
        print("\n\nParsed Struct:", parsed_struct)
        return parsed_struct
    except yaml.YAMLError as exc:
        print(exc)
        return {}
