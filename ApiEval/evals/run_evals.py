import os
import sys
import pytest
import json
from datetime import datetime
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

from src.test_utils import PromptCoverageTracker, TestLogger

def run_evaluations(eval_dirs=None):
    """
    Run all evaluation files and generate coverage reports.
    
    Args:
        eval_dirs: Optional list of directories containing eval files.
                  If None, defaults to the test directory.
    """
    if eval_dirs is None:
        eval_dirs = [project_root / "test"]
    
    # Initialize coverage tracker
    prompts_dir = project_root.parent / "CommonTs" / "src"  # Path to CommonTs/src where Prompts.json is located
    coverage_tracker = PromptCoverageTracker(str(prompts_dir))
    
    # Make coverage tracker available to TestLogger instances
    TestLogger.set_coverage_tracker(coverage_tracker)
    
    # Create results directory
    results_dir = project_root / "results" / datetime.now().strftime("%Y%m%d_%H%M%S")
    results_dir.mkdir(parents=True, exist_ok=True)
    
    # Run all eval files
    for eval_dir in eval_dirs:
        eval_files = [f for f in Path(eval_dir).glob("**/*eval*.py")]
        
        for eval_file in eval_files:
            print(f"\nRunning evaluations in {eval_file}...")
            result = pytest.main([
                str(eval_file),
                "-v",
                "--capture=no",
                f"--junitxml={results_dir}/junit_{eval_file.stem}.xml"
            ])
            
            if result == pytest.ExitCode.OK:
                print(f"✓ {eval_file.name} completed successfully")
            else:
                print(f"✗ {eval_file.name} had failures")
    
    # Generate and save coverage report
    coverage_report = coverage_tracker.get_coverage_report()
    coverage_report_path = results_dir / "coverage_report.json"
    
    with open(coverage_report_path, 'w') as f:
        json.dump(coverage_report, f, indent=2)
    
    print(f"\nEvaluation Results Summary:")
    print(f"Total prompts: {coverage_report['summary']['total_prompts']}")
    print(f"Prompts with tests: {coverage_report['summary']['prompts_with_tests']}")
    print(f"Total tests run: {coverage_report['summary']['total_tests']}")
    print(f"\nDetailed results saved to: {results_dir}")

if __name__ == "__main__":
    # Allow specifying additional eval directories via command line
    additional_dirs = [Path(d) for d in sys.argv[1:]] if len(sys.argv) > 1 else None
    run_evaluations(additional_dirs) 