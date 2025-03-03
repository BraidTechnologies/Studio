# Get the directory where the script is located
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Activate virtual environment if it exists
if (Test-Path "$ProjectRoot\venv\Scripts\Activate.ps1") {
    & "$ProjectRoot\venv\Scripts\Activate.ps1"
}

# Run the evaluation script
python "$ScriptDir\run_evals.py" $args

# Generate a simple report of the results
Write-Host "Evaluation completed. Check the results directory for detailed reports." 