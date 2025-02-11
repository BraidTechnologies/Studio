#!/bin/bash

# List of directories to process
directories=("CommonTs" "CommonPy" "Api" "ApiTest" "Cascade" "Waterfall" "WaterfallBrowser" "Boxer" "Teams")

# Start npm run local-fluid in Api directory
cd Api
npm run local-fluid> /dev/null 2>&1 &
FLUID_PID=$!

# Start func start in Api directory
func start> /dev/null 2>&1 &
FUNC_PID=$!

# Wait for 10 seconds to allow services to start
sleep 10

# This starts the server to preload the repository from CosmosDB
npm run test-warm> /dev/null 2>&1 &
TEST_WARM_PID=$!
cd ..

# Wait for 200 seconds to allow database to warm up
echo "Waiting for database to warm up..."
sleep 200
echo "Database warmed up"

# Determine the OS
OS_TYPE=$(uname)

if [[ "$OS_TYPE" == "Darwin" ]]; then
    OS_NAME="Unix"
elif [[ "$OS_TYPE" == "Linux" ]]; then
    # Additional possibility is Windows Subsystem for Linux (WSL)
    OS_NAME="Unix"
else
    OS_NAME="Windows"
fi

echo "Testing for $OS_NAME"


# Function to cleanup fluid process on script exit
cleanup() {
      echo "Cleaning up local-fluid process..."
      kill $FLUID_PID
      wait $FLUID_PID 2>/dev/null
      echo "Cleaning up func process..."
      kill $FUNC_PID
      wait $FUNC_PID 2>/dev/null
      echo "Cleaning up test-warm process..."
      kill $TEST_WARM_PID
      wait $TEST_WARM_PID 2>/dev/null
}

# Register cleanup function to run on script exit
trap cleanup EXIT


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
            if [ "$OS_NAME" == "Unix" ]; then
                python3 -m pytest
            else
                python -m pytest 
            fi
            # Exit if pytest run test fails
            if [ $? -ne 0 ]; then
                echo "pytest run test failed in directory: $dir. Exiting script."
                exit 1
            fi            
        fi
        
        # Go back to the original directory
        cd ..
    else
        echo "Directory $dir not found, skipping..."
    fi
done



