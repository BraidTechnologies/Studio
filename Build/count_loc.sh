#!/bin/bash
ts_directories=("CommonTs/src" "Api/src" "Cascade/src" "WaterfallBrowser/src" "Boxer/core" "Boxer/ui" "Teams/src")

py_directories=("CommonPy/src" "ApiTest/src" "Waterfall/src" "BoxerEval/src")

ts_test_directories=("CommonTs/test" "Api/test" "Cascade/test" "WaterfallBrowser/test" "Boxer/test" "Teams/test")

py_test_directories=("CommonPy/test" "ApiTest/test" "Waterfall/test" "BoxerEval/test")


# Function to count non-whitespace lines in files
count_lines() {
    local dir=$1
    local file_type=$2
    local lines=0
    
    while IFS= read -r file; do
        lines=$((lines + $(grep -cve '^\s*$' "$file")))
    done < <(find "$dir" -type f -name "*.$file_type")
    
    #echo "$file_type files: $lines lines"
    echo "$lines"
}

# Main script
if [[ $# -eq 0 ]]; then
    echo "Usage: $0 <base_directory>"
    exit 1
fi

base_dir=$1

if [[ ! -d $base_dir ]]; then
    echo "Error: $base_dir is not a valid directory."
    exit 1
fi

total_py_lines=0
total_ts_lines=0
total_py_test_lines=0
total_ts_test_lines=0

# Process Python directories
echo "Processing Python directories..."
for dir in "${py_directories[@]}"; do
    full_path="$base_dir/$dir"
    if [[ -d $full_path ]]; then
        echo "Checking directory: $full_path"
        line_count=$(count_lines "$full_path" "py")        
        total_py_lines=$((total_py_lines + line_count))     
    fi
done

# Process TypeScript directories
#
echo -e "\nProcessing TypeScript directories..."
for dir in "${ts_directories[@]}"; do
    full_path="$base_dir/$dir"
    if [[ -d $full_path ]]; then
        echo "Checking directory: $full_path"
        line_count=$(count_lines "$full_path" "ts")        
        total_ts_lines=$((total_ts_lines + line_count))   
        line_count=$(count_lines "$full_path" "tsx")        
        total_ts_lines=$((total_ts_lines + line_count))         
    fi
done

# Process Python test directories
echo "Processing Python test directories..."
for dir in "${py_test_directories[@]}"; do
    full_path="$base_dir/$dir"
    if [[ -d $full_path ]]; then
        echo "Checking directory: $full_path"
        line_count=$(count_lines "$full_path" "py")        
        total_py_test_lines=$((total_py_test_lines + line_count))     
    fi
done

# Process TypeScript test directories
#
echo -e "\nProcessing TypeScript test directories..."
for dir in "${ts_test_directories[@]}"; do
    full_path="$base_dir/$dir"
    if [[ -d $full_path ]]; then
        echo "Checking directory: $full_path"
        line_count=$(count_lines "$full_path" "ts")        
        total_ts_test_lines=$((total_ts_test_lines + line_count))   
        line_count=$(count_lines "$full_path" "tsx")        
        total_ts_test_lines=$((total_ts_test_lines + line_count))         
    fi
done

echo -e "\nFinal Totals:"
echo "Total Python (.py) lines: $total_py_lines"
echo "Total TypeScript (.ts .tsx) lines: $total_ts_lines"
echo "Total Python test (.py) lines: $total_py_test_lines"
echo "Total TypeScript test (.ts .tsx) lines: $total_ts_test_lines"

