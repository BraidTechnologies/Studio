#!/bin/bash

echo "To update Python packages, run: pip freeze | %{$_.split('==')[0]} | %{pip install --upgrade $_} in PowerShell as Administrator"

# Find all directories in the current path
for dir in */; do
    if [ -d "$dir" ]; then
        echo "Entering directory: $dir"
        
        # Change to the directory
        cd "$dir"
        
        # Check if package.json exists
        if [ -f "requirements.txt" ]; then
            echo "Running pip refresh..."
            pip freeze > requirements.txt
        else
            echo "No requirements.txt found, skipping..."
        fi
        
        # Go back to the root directory
        cd ..

    fi
done
