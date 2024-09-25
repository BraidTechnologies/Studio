## file to have functions which evualate GPT-3.5 embeddings 


"""Evaluates if the given question is about LLMs using a scale of 1 to 5."""
prompt = f"""
        You will be given a user_question and system_answer couple.
        Your task is to provide a 'total rating' scoring how well the system_answer answers the user concerns expressed in the user_question.
        Give your answer on a scale of 1 to 5, where 1 means that the system_answer is not helpful at all, and 5 means that the system_answer completely and helpfully addresses the user_question.
        Here is the scale you should use to build your answer:
        1: The system_answer is terrible: completely irrelevant to the question asked, or very partial
        2: The system_answer is mostly not helpful: misses some key aspects of the question
        3: The system_answer is mostly helpful: provides support, but still could be improved
        4: The system_answer is excellent: relevant, direct, detailed, and addresses all the concerns raised in the question
        5: The system_answer is perfect: not only addresses all concerns, but adds significant value.
        Provide your feedback as follows:
        Feedback:::
        Evaluation: (your rationale for the rating, as a text)
        Total rating: (your rating, as a number between 1 and 5)
        Question: {question}
        Answer: {answer}
        Feedback:::
        Evaluation: 
        """




"""Evaluates if the summary is relevant for testers focused on LLM quality assurance, using a scale of 1 to 5."""

prompt = f"""
You will be given a summary.
Your task is to provide a 'total rating' scoring how well the summary is relevant to a tester interested in understanding how to ensure quality in applications written using LLM technology.
Give your answer on a scale of 1 to 5, where 1 means that the summary is not relevant at all, and 5 means that the summary is extremely relevant.
Here is the scale you should use to build your answer:
1: Not relevant at all: the summary does not provide any information useful for testers.
2: Mostly not relevant: only a few points may relate to testing quality in LLM-based applications.
3: Somewhat relevant: provides some insights but lacks depth.
4: Relevant: offers significant information that would help testers ensure quality.
5: Extremely relevant: provides a comprehensive understanding of how to ensure quality in LLM-based applications.
Provide your feedback as follows:
Feedback:::
Evaluation: (your rationale for the rating, as a text)
Total rating: (your rating, as a number between 1 and 5)
Summary: {summary}
Feedback:::
Evaluation: """
        