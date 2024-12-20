#!/bin/bash

# List of directories to process
#ts_directories=("CommonTs" "Api" "Cascade" "WaterfallBrowser" "Boxer" "Teams")
ts_directories=("CommonTs")

py_directories=("CommonPy" "ApiTest" "Waterfall" "BoxerEval")


# Iterate through the specified directories
for dir in "${ts_directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "Entering directory: $dir"
        
        # Change to the directory
        cd "$dir"
        
        # Check if package.json exists
        if [ -f "package.json" ]; then
            echo "Running typescript linter..."
            for file in $(find . -name "*.ts" -not -path "./node_modules/*" -not -path "./dist/*"); do      
                #echo "Linting file: $file"                  
                if !(grep -q "@module" $file); then
                    echo "No module comment found in file: $file"
                fi
            done         
        else
            echo "No package.json found, skipping..."
        fi
        
        # Go back to the original directory
        cd ..
    else
        echo "Directory $dir not found, skipping..."
    fi
done


for dir in "${py_directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "Entering directory: $dir"
        cd "$dir"
        echo "Running python linter..."
        for file in $(find . -name "*.py"); do
            #echo "Linting file: $file"
            if grep -q "missing-module-docstring" <(pylint "$file"); then
                echo "No module comment found in file: $file"
            fi
        done
        cd ..
    fi
done