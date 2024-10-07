from assistant import DataAssistant
from config_manager import ConfigManager

class DataAssistantCLI:
    """
    Command-line interface for interacting with the Data Assistant.
    """
    
    def __init__(self, filename: str):
        self.default_name = "Test Helper"
        self.default_instruction = "You are a helpful assistant; you answer questions, generate test plans, and generate Python code based on the API definitions provided."
        self.config_manager = ConfigManager()
        self.filename = filename
    
    def get_configuration(self):
            """
            Set assistant name and instruction, with defaults.
            """
            if self.config_manager.config_exists():
               self.config_manager.remove_config()

            assistant_name = self.default_name
            assistant_instruction = self.default_instruction

            return assistant_name, assistant_instruction

    def run(self):
        """
        Runs the main loop for user interaction.
        """
        assistant_name, assistant_instruction = self.get_configuration()
        assistant = DataAssistant(self.filename, assistant_name, assistant_instruction)

        assistant.follow_up_question("Write a python program to fully test the provided API using the Pytest framework. Don't ask any more question back to me, do the best you can with the infirmation provided.")
