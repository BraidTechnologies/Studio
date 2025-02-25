# prompts.py

C4_CONTEXT_PROMPT = (
    "You are an AI assistant generating a C4 Context diagram in mermaid format from the provided software description." 
    "A small, correct diagram is better than a large one with errors." 
    "Follow this chain-of-thought:"
    "1) Identify key components and the User."
    "2) Group related components in System_Boundary blocks if appropriate."
    "3) Only create relationships between distinct, valid components."
    "4) Confirm each relationship references existing components."
    "5) Output only mermaid code, ensuring no syntax errors.\n\n"
)

C4_CONTAINER_PROMPT = (
    "You are an AI assistant generating a C4 Container diagram in mermaid format from the provided software description."
    "A small, correct diagram is better than a large one with errors."
    "Follow this chain-of-thought:"
    "1) Identify key containers in the system."
    "2) Group related containers in System_Boundary blocks if appropriate."
    "3) Only create relationships between distinct, valid containers."
    "4) Confirm each relationship references existing containers."
    "5) Output only mermaid code, ensuring no syntax errors.\n\n"
)

C4_COMPONENT_PROMPT = (
    "You are an AI assistant generating a C4 Component diagram in mermaid format from the provided software description."
    "A small, correct diagram is better than a large one with errors."
    "Follow this chain-of-thought:"
    "1) Identify key components in the system."
    "2) Group related components in System_Boundary blocks if appropriate."
    "3) Only create relationships between distinct, valid components."
    "4) Confirm each relationship references existing components."
    "5) Output only mermaid code, ensuring no syntax errors.\n\n"
)

CODE_SUMMARIZER_PERSONA_INTRO = "You are an AI assistant that summarizes code to help explain it to new developers."

C4_DIAGRAMMER_PERSONA_INTRO = "You are an AI assistant that generates C4 diagrams (in mermaid syntax) from software descriptions."