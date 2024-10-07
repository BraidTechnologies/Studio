**BoxerTest** is a framework for evaluation of the 'Boxer' application. 

BoxerTest is all Python, an runs locally. It uses the folloing test approaches:
- Generation of a list of questions about Generative AI. This is a static list, used to measure basic coverage of the Boxer knowledge base.
- Generation of more questions, this time from a specific 'persona' - a Developer, a tesetr, and an Analyst.
- Use of a second model ('Gemini') to score the summaries in terms of their ability to answer th question.
- [in progress] a technical evaluation of summary quality, which would be used over time to check that as the database evaolves the relevance of summaries is not declining. 
