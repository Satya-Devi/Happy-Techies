#!/bin/bash

# Define the URL
URL="https://learn.microsoft.com/api/catalog/"

# Define the output file
OUTPUT_FILE="api_catalog.json"

# Use curl to fetch the data and save it to the output file
curl -o $OUTPUT_FILE $URL

# Check if the curl command was successful
if [ $? -eq 0 ]; then
    echo "Data successfully saved to $OUTPUT_FILE"
else
    echo "Failed to fetch data from $URL"
fi
