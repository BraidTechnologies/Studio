#!/bin/bash

# Find all directories in the current path
for dir in */; do
    if [ -d "$dir" ]; then
        echo "Entering directory: $dir"
        
        # Change to the directory
        cd "$dir"
        
        # Check if package.json exists
        if [ -f "package.json" ]; then
            echo "Running npm update..."
            npm update --save
        else
            echo "No package.json found, skipping..."
        fi
        
        # Go back to the root directory
        cd ..

    fi

    echo "To update Python packages, run: pip freeze | %{$_.split('==')[0]} | %{pip install --upgrade $_} in PowerShell as Administrator"    
done
