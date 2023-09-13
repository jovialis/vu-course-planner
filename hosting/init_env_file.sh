#!/bin/bash

env_file=".env.local"

# Check if the .env.local file already exists
if [ ! -f "$env_file" ]; then
  # Define the content to be added to .env.local
  env_content=$(cat <<END
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_EMULATOR=true
END
  )

  # Write the content to .env.local
  echo "$env_content" > "$env_file"

  # Display a message to confirm the file creation
  echo "Created $env_file with the specified content."
else
  # Display a message indicating that the file already exists
  echo "$env_file already exists. No changes were made."
fi
