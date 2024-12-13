#!/bin/bash

# List of directories to process
directories=("CommonTs" "Api" "Cascade" "WaterfallBrowser" "Boxer" "Teams")

# Iterate through the specified directories
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "Entering directory: $dir"
        
        # Change to the directory
        cd "$dir"
        
        # Check if package.json exists
        if [ -f "package.json" ]; then
            echo "Running npm run build..."
            npm run build
        else
            echo "No package.json found, skipping..."
        fi
        
        # Go back to the original directory
        cd ..
    else
        echo "Directory $dir not found, skipping..."
    fi
done