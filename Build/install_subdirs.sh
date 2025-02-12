#!/bin/bash

# List of directories to process
directories=("CommonTs" "Api" "Cascade" "WaterfallBrowser" "Boxer" "Teams" "Waterfall" "ApiTest" "Salon")

# Iterate through the specified directories
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "Entering directory: $dir"
        
        # Change to the directory
        cd "$dir"
        
        # Check if package.json exists
        if [ -f "package.json" ]; then
            echo "Running npm install..."
            npm install || { echo "npm install failed in $dir. Exiting script."; exit 1; }
        elif [ -f "requirements.txt" ]; then
            echo "Running pip install..."
            pip install -r requirements.txt || { echo "pip install failed in $dir. Exiting script."; exit 1; }
        else
            echo "No package.json found, skipping..."
        fi
        
        # Go back to the original directory
        cd ..
    else
        echo "Directory $dir not found, skipping..."
    fi
done