#!/bin/bash

# Find all directories in the current path
for dir in */; do
    if [ -d "$dir" ]; then
        echo "Entering directory: $dir"
        
        # Change to the directory
        cd "$dir"
        
        # Check if package.json exists
        if [ -f "package.json" ]; then
            echo "Running npm run clean..."
            npm run clean
        else
            echo "No package.json found, skipping..."
        fi
        
        # Go back to the root directory
        cd ..
    fi
done