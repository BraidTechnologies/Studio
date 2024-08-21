'''
The following file should include the code that runs the test framework for Boxer's Data test pipeline

'''

buisnessAnalystPersonaPrompt = "You are a business analyst interested in how people can apply LLM technology to solve business problems\n"
programmerPersonaPrompt = "You are a programmer interested in the details of writing applications that use an LLM in Python\n"
testerPersonaPrompt = "You are a tester who wants to know how to assess and ensure quality in an application that uses LLM technology\n"

class PersonaSelector:
    def __init__(self):
        self.persona_prompts = {
            "1": "Static questions",
            "2": programmerPersonaPrompt,
            "3": testerPersonaPrompt,
            "4": buisnessAnalystPersonaPrompt
        }

    def get_user_choice(self):
        while True:
            print("Select a persona:")
            for key, value in self.persona_prompts.items():
                print(f"{key}. {value}")
            choice = input("Enter your choice (1/2/3/4): ")
            if choice in self.persona_prompts:
                return choice
            else:
                print("Invalid choice. Please try again.")

    def get_persona_prompt(self, choice):
        return self.persona_prompts.get(choice, "Invalid choice")
    
def run_choice(choice):
    choice_functions = {
        "1": run_static_questions,
        "2": run_programmer_persona,
        "3": run_tester_persona,
        "4": run_business_analyst_persona
    }

    choice_function = choice_functions.get(choice)
    if choice_function:
        choice_function()
    else:
        print("Invalid choice")

def run_static_questions():
    # code to run static questions
    pass

def run_programmer_persona():
    # code to run programmer persona
    pass

def run_tester_persona():
    # code to run tester persona
    pass

def run_business_analyst_persona():
    # code to run business analyst persona
    pass

def main():
    selector = PersonaSelector()
    choice = selector.get_user_choice()
    run_choice(choice)

if __name__ == "__main__":
    main()

def main():
    selector = PersonaSelector()
    choice = selector.get_user_choice()
    persona_prompt = selector.get_persona_prompt(choice)
    print(f"You selected: {persona_prompt}")

if __name__ == "__main__":
    main()


#take as input choice: "Static questions", "Developer", "Tester", "Buisness Analyst"



def generate_questions():
    pass

def ask_questions():
    pass

