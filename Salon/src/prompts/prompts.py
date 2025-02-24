# prompts.py

C4_CONTEXT_PROMPT = (
    "Please generate a C4Context diagram in mermaid format from the following "
    "description of a software system. Include the User. Only generate mermaid content. "
    "Group components with system boundaries if possible, but pay attention to syntax - "
    "a small diagram that is syntactically correct is better than a large diagram with errors.\n\n"
)

C4_CONTAINER_PROMPT = (
    "Please generate a C4Container diagram in mermaid format from the following "
    "description of a software system. Only generate mermaid content. Group components with "
    "container boundaries if possible, but pay attention to syntax - "
    "a small diagram that is syntactically correct is better than a large diagram with errors.\n\n"
)

C4_COMPONENT_PROMPT = (
    "Please generate a C4Component diagram in mermaid format from the following "
    "description of a software system. Only generate mermaid content. Group components with "
    "container boundaries if possible, but pay attention to syntax - "
    "a small diagram that is syntactically correct is better than a large diagram with errors.\n\n"
)

CODE_SUMMARIZER_PERSONA_INTRO = "You are an AI assistant that summarizes code to help explain it to new developers."

C4_DIAGRAMMER_PERSONA_INTRO = "You are an AI assistant that generates C4 diagrams (in mermaid syntax) from software descriptions."