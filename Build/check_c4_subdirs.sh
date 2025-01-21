#!/bin/bash
ts_directories=("CommonTs" "Api" "Cascade" "WaterfallBrowser" "Boxer" "Teams")

py_directories=("CommonPy" "ApiTest" "Waterfall" "BoxerEval")

for dir in "${ts_directories[@]}"; do
    echo "Checking $dir for C4 diagrams..."
    cd "$dir"
    if ls C4*.Salon.md 1> /dev/null 2>&1; then
        echo "Found C4 diagram in $dir"
    else 
        echo "No C4 diagram found in $dir"
    fi
    cd ..
done

for dir in "${py_directories[@]}"; do
    echo "Checking $dir for C4 diagrams..."
    cd "$dir"
    if ls C4*.Salon.md 1> /dev/null 2>&1; then
        echo "Found C4 diagram in $dir"
    else 
        echo "No C4 diagram found in $dir"
    fi
    cd ..
done


