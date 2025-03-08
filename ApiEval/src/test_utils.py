import json
import os
from datetime import datetime
from enum import Enum
from typing import Optional, Dict, List
import functools

class TestType(Enum):
    SIMPLE = "simple"
    MUTATION = "mutation"
    VARIANT = "variant"

class TestLogger:
    coverage_tracker = None  # Class variable for coverage tracking
    
    def __init__(self, output_dir: str = "ApiEval/eval_results"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.current_test_info: Dict = {}
        
    @classmethod
    def set_coverage_tracker(cls, tracker):
        """Set the coverage tracker at the class level."""
        cls.coverage_tracker = tracker
        
    def start_test(self, test_id: str, test_name: str, test_type: TestType, description: str, prompt_id: Optional[str] = None):
        """Start a new test and log its basic information."""
        self.current_test_info = {
            "id": test_id,
            "name": test_name,
            "type": test_type.value,
            "description": description,
            "prompt_id": prompt_id,
            "start_time": datetime.now().isoformat(),
            "status": "running"
        }
        
        # Record the test in coverage tracker if prompt_id is provided
        if prompt_id and self.coverage_tracker:
            self.coverage_tracker.record_test(prompt_id, test_type)
        
    def end_test(self, success: bool, details: Optional[Dict] = None):
        """End the current test and save its results."""
        self.current_test_info.update({
            "end_time": datetime.now().isoformat(),
            "status": "passed" if success else "failed",
            "details": details or {}
        })
        
        # Save test results
        filename = f"{self.current_test_info['id']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(os.path.join(self.output_dir, filename), 'w') as f:
            json.dump(self.current_test_info, f, indent=2)

class PromptCoverageTracker:
    def __init__(self, prompts_dir: str):
        self.prompts_dir = prompts_dir
        self.coverage_data: Dict[str, Dict] = {}
        self.prompts_metadata: Dict[str, Dict] = {}
        self._load_prompts()
    
    def _load_prompts(self):
        """Load all Prompts.json files and initialize coverage tracking."""
        for root, _, files in os.walk(self.prompts_dir, topdown=False):
            for file in files:
                if file.endswith('.json') and 'Prompts' in file:
                    with open(os.path.join(root, file)) as f:
                        prompt_data = json.load(f)
                        for prompt in prompt_data:
                            prompt_id = prompt['id']
                            self.prompts_metadata[prompt_id] = {
                                'name': prompt['name'],
                                'version': prompt['version'],
                                'personaName': prompt['personaName']
                            }
                            self.coverage_data[prompt_id] = {
                                "simple_tests": 0,
                                "mutation_tests": 0,
                                "variant_tests": 0,
                                "total_tests": 0,
                                "last_tested": None,
                                "test_history": []
                            }
    
    def record_test(self, prompt_id: str, test_type: TestType):
        """Record that a test was run for a specific prompt."""
        if prompt_id in self.coverage_data:
            self.coverage_data[prompt_id][f"{test_type.value}_tests"] += 1
            self.coverage_data[prompt_id]["total_tests"] += 1
            self.coverage_data[prompt_id]["last_tested"] = datetime.now().isoformat()
            self.coverage_data[prompt_id]["test_history"].append({
                "type": test_type.value,
                "timestamp": datetime.now().isoformat()
            })
    
    def get_coverage_report(self) -> Dict:
        """Generate a detailed coverage report for all prompts."""
        untested_prompts = [
            {
                "id": pid,
                "name": self.prompts_metadata[pid]["name"],
                "persona": self.prompts_metadata[pid]["personaName"]
            }
            for pid in self.coverage_data
            if self.coverage_data[pid]["total_tests"] == 0
        ]
        
        return {
            "prompt_coverage": {
                pid: {
                    **self.coverage_data[pid],
                    "metadata": self.prompts_metadata[pid]
                }
                for pid in self.coverage_data
            },
            "summary": {
                "total_prompts": len(self.coverage_data),
                "prompts_with_tests": len([p for p in self.coverage_data.values() if p["total_tests"] > 0]),
                "total_tests": sum(p["total_tests"] for p in self.coverage_data.values()),
                "untested_prompts": untested_prompts,
                "test_type_distribution": {
                    "simple": sum(p["simple_tests"] for p in self.coverage_data.values()),
                    "mutation": sum(p["mutation_tests"] for p in self.coverage_data.values()),
                    "system": sum(p["variant_tests"] for p in self.coverage_data.values())
                }
            }
        }

def simple_test(test_id: str, name: str, description: str, prompt_id: Optional[str] = None):
    """Decorator for simple unit tests."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            logger = TestLogger()
            logger.start_test(test_id, name, TestType.SIMPLE, description, prompt_id)
            try:
                result = func(*args, **kwargs)
                logger.end_test(True, {"result": str(result)})
                return result
            except Exception as e:
                logger.end_test(False, {"error": str(e)})
                raise
        return wrapper
    return decorator

def mutation_test(test_id: str, name: str, description: str, prompt_id: Optional[str] = None):
    """Decorator for mutation tests."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            logger = TestLogger()
            logger.start_test(test_id, name, TestType.MUTATION, description, prompt_id)
            try:
                result = func(*args, **kwargs)
                logger.end_test(True, {"result": str(result)})
                return result
            except Exception as e:
                logger.end_test(False, {"error": str(e)})
                raise
        return wrapper
    return decorator

def variant_test(test_id: str, name: str, description: str, prompt_id: Optional[str] = None):
    """Decorator for system/integration tests."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            logger = TestLogger()
            logger.start_test(test_id, name, TestType.VARIANT, description, prompt_id)
            try:
                result = func(*args, **kwargs)
                logger.end_test(True, {"result": str(result)})
                return result
            except Exception as e:
                logger.end_test(False, {"error": str(e)})
                raise
        return wrapper
    return decorator 