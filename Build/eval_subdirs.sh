#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Start npm run local-fluid in Api directory
cd Api
npm run local-fluid> /dev/null 2>&1 &
FLUID_PID=$!

# Start func start in Api directory
npm run start> /dev/null 2>&1 &
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

# Activate virtual environment if it exists
if [ -d "$PROJECT_ROOT/venv" ]; then
    source "$PROJECT_ROOT/venv/bin/activate"
fi

# Run the evaluation script
python "$PROJECT_ROOT/ApiEval/run_evals/run_evals.py" "$@"

# Generate a simple report of the results
echo "Evaluation completed. Check the results directory for detailed reports."
