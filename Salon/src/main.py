import argparse

from cli_interface import DataAssistantCLI
# Example command line: python src\main.py apis/EmbedApi.Types.json

class Main:
    """
    Main execution class to run either CLI or API interface.
    """

    def __init__(self):
        self.parser = argparse.ArgumentParser(description="Test Assistant Interface")
        self.parser.add_argument('filename', help="File name of JSON schema to use to generate test code")        
        

    def run(self):
        args = self.parser.parse_args()
        filename = args.filename

        cli = DataAssistantCLI(filename)
        cli.run()

if __name__ == "__main__":
    main = Main()
    main.run()
