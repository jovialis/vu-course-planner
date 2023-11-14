#!/bin/bash

#python -m coverage run --source=src -m pytest -v tests && coverage report -m
#python -m coverage run --source=src

# # Replace the line above with one similar to this if you only want to run your tests
 python -m pytest --cov=src tests/test_schema_ingestion.py