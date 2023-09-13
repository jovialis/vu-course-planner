#!/bin/bash

# Check if venv directory exists, if not, create one
if [ ! -d venv ]; then
  python3 -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate

# Install dependencies using pip from requirements.txt
pip3 install -r requirements.txt

# Deactivate the virtual environment
deactivate
