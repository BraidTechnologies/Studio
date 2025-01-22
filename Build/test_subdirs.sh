#!/bin/bash

# List of directories to process
directories=("CommonTs" "CommonPy" "Api" "ApiTest" "Cascade" "Waterfall" "WaterfallBrowser" "Boxer" "Teams")

# Iterate through the specified directories
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "Entering directory: $dir"
        
        # Change to the directory
        cd "$dir"
        
        # Check if package.json exists
        if [ -f "package.json" ]; then
            echo "Running npm run test..."
            npm run test
            # Exit if npm run test fails
            if [ $? -ne 0 ]; then
                echo "npm run test failed in directory: $dir. Exiting script."
                exit 1
            fi
        else
            echo "No package.json found, running pytest..."
            python3 -m pytest
        fi
        
        # Go back to the original directory
        cd ..
    else
        echo "Directory $dir not found, skipping..."
    fi
done



