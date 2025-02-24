C4Component
    title Salon - Software Development Automation Tools

    Container_Boundary(core_tools, "Core Tools") {
        Component(api_test_tool, "API Test Tool", "Python", "Generates Python test code from API specifications")
        Component(repo_processor, "Repository Processor", "Python", "Processes and analyzes GitHub repositories")
        Component(c4_generator, "C4 Generator", "Python", "Generates C4 architecture diagrams")
    }

    Container_Boundary(visitors, "Directory Visitors") {
        Component(base_visitor, "Base Visitor", "Python", "Core visitor functionality")
        Component(c4_visitor, "C4 Visitor", "Python", "Generates C4 diagrams from repository content")
        Component(readme_visitor, "README Visitor", "Python", "Creates/updates ReadMe.Salon.md files")
        Component(notebook_visitor, "Notebook Visitor", "Python", "Processes content for ML notebooks")
    }

    Container_Boundary(services, "Services") {
        Component(model_drivers, "Model Drivers", "Python", "Manages AI model interactions")
        Component(directory_walker, "Directory Walker", "Python", "Traverses directory trees")
        Component(visitor_factory, "Visitor Factory", "Python", "Creates visitor instances")
    }

    System_Ext(github, "GitHub", "Source code repositories")
    System_Ext(ai_service, "AI Services", "OpenAI/Gemini APIs")
    System_Ext(braid_api, "Braid API", "External API service")

    %% Core Tools Relationships
    Rel(api_test_tool, model_drivers, "Uses for code generation")
    Rel(repo_processor, github, "Clones/reads repositories")
    Rel(c4_generator, github, "Analyzes repositories")

    %% Visitor Relationships
    Rel(c4_generator, c4_visitor, "Uses")
    Rel(repo_processor, visitors, "Uses")
    Rel(visitor_factory, base_visitor, "Creates")
    Rel(directory_walker, visitors, "Applies")

    %% Service Relationships
    Rel(model_drivers, ai_service, "Makes API calls")
    Rel(model_drivers, braid_api, "Makes API calls")
    Rel(visitors, model_drivers, "Uses for summarization")