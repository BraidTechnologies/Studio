import json
from pathlib import Path

PARENT_DIR = Path(__file__).parent.parent
PROMPT_DIR = PARENT_DIR / "prompts"
INTERFACE_DIR = PARENT_DIR / "interfaces"

def load_json(file_path: Path):
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

# Dynamically import all prompts as variables
PROMPTS = {}
for file in PROMPT_DIR.glob("*.json"):
    var_name = file.stem  # Get the filename without .json
    PROMPTS[var_name] = load_json(file)
    globals()[var_name] = PROMPTS[var_name]  # Create a global variable dynamically

# Dynamically import all interfaces as variables
INTERFACES = {}
for file in INTERFACE_DIR.glob("*.json"):
    var_name = file.stem
    INTERFACES[var_name] = load_json(file)
    globals()[var_name] = INTERFACES[var_name]

# Define __all__ so that imports work cleanly
EPromptPersona = INTERFACES["EPromptPersona"]["EPromptPersona"]

__all__ = list(PROMPTS.keys()) + list(INTERFACES.keys())

#export EPromptPersona


