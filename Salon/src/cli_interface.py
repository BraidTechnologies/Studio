from assistant import DataAssistant
from config_manager import ConfigManager

class DataAssistantCLI:
    """
    Command-line interface for interacting with the Data Assistant.
    """
    
    def __init__(self):
        self.default_name = "Test Helper"
        self.default_instruction = "You are a helpful assistant; you answer questions, generate test plans, and generate Python code based on the API definitions provided."
        self.config_manager = ConfigManager()
    
    def get_configuration(self):
            """
            Set assistant name and instruction, with defaults.
            """
            if self.config_manager.config_exists():
                use_existing = input("Configuration exists. Do you want to use the existing configuration? (y/n): ").strip().lower()
                if use_existing == 'y':
                    print("Using existing configuration.")
                    return None
                else:
                    self.config_manager.remove_config()
                    print("Creating new configuration.")

            assistant_name = self.default_name

            assistant_instruction = self.default_instruction

            return assistant_name, assistant_instruction

    def run(self):
        """
        Runs the main loop for user interaction.
        """
        assistant_name, assistant_instruction = self.get_configuration()
        assistant = DataAssistant("apis/SummariseApi.Types.json", assistant_name, assistant_instruction)

        while True:
            follow_up = input("Enter your follow-up question (or type 'exit' to stop): ").strip()
            if follow_up.lower() == 'exit':
                print("Exiting the follow-up session.")
                break
            assistant.follow_up_question(follow_up)
