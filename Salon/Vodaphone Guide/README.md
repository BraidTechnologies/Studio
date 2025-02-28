# Vodafone Guide: Repository Architecture Visualization 

This guide helps you generate C4 architecture diagrams for your repositories using Salon's automated documentation tools.

## Prerequisites

- Python 3.8+
- Git
- Google Developer API key (Gemini Pro 1.5)
- Required Python packages:
  ```bash
  pip install google-generativeai pyyaml nltk requests
  ```

## Initial Setup

1. **Clone Salon Tool**
   ```bash
   git clone https://github.com/BraidTechnologies/Studio.git
   cd Studio
   ```

2. **Configure Environment Variables**

   For Vodafone's Corporate Network:
   ```bash
   # Gemini API Configuration
   export GOOGLE_DEVELOPER_API_KEY="your_gemini_api_key"
   
   # Vodafone Proxy Settings
   export HTTP_PROXY="http://vodafone-proxy.internal:8080"
   export HTTPS_PROXY="http://vodafone-proxy.internal:8080"
   export NO_PROXY="localhost,127.0.0.1"

   Update the proxy settings in the `Salon/src/models/gemini.py` file to ensure proper configuration for Vodafone's corporate network. The relevant section should look like this:
   
   ```python
   # Get proxy from environment variable
   proxy = os.environ.get('HTTPS_PROXY', None)  # Use HTTPS_PROXY for secure connections
   ```
   ```

3. **Create Configuration File**
   
   Create `vodafone_config.yaml`:
   ```yaml
   model_type: "local_gemini"  # Use Gemini instead of OpenAI
   
   skip_dirs:
     - "node_modules"
     - ".git"
     - "venv"
     - "__pycache__"
     - "dist"
   
   skip_patterns:
     - "*.pyc"
     - "*.git*"
     - "*.env"
     - "*.log"
   
   source_patterns:
     - "*.py"
     - "*.java"
     - "*.ts"
     - "*.cs"
     - "*.go"
   ```

## Processing Your Repository

1. **Clone Target Repository**
   ```bash
   git clone https://github.com/vodafone/your-target-repo.git
   cd your-target-repo
   ```

2. **Generate Text Summaries**
   ```bash
   python -m Salon.src.repo_to_text \
     --cfg "C:\\Repo\\Studio\\Salon\\vodafone_config.yaml" \
     --repo_path "C:\\Repo\\Studio\\" \
     --output_dir "C:\\Repo\\Studio\\output\\" \
     --model_type local_gemini
   ```

3. **Generate C4 Diagrams**
   ```bash
   python -m Salon.src.repo_to_c4 \
     --repo_path "C:\\Repo\\Studio\\" \
     --model_type local_gemini
   ```

## Output Files

The tool generates several Markdown files containing Mermaid C4 diagrams:
- `C4Context.Salon.md`: System context diagram
- `C4Container.Salon.md`: Container diagram
- `C4Component.Salon.md`: Component diagram

## Gemini Model Configuration

The tool uses Gemini Pro 1.5 for code analysis. Key features:
- Proxy-aware API calls
- Automatic retries on failure
- Configurable response length
- Corporate network compatibility



## Example C4 Diagrams

1. **Context Diagram**
```mermaid
C4Context
title HelloV2XWorld Android App Context

Person(user, "Road User", "Uses the HelloV2XWorld app to view nearby vehicles")

System(hv2x_app, "HelloV2XWorld Android App", "Displays nearby road users on a map, showing their location and ITS information")

System_Ext(step_platform, "Vodafone STEP Platform", "Provides V2X services and data")

System_Ext(android_studio, "Android Studio", "Development environment")

System_Ext(github, "GitHub", "Hosts the HelloV2XWorld project")

System_Ext(step_web_portal, "STEP Web Portal", "Provides access to SDK and documentation")


Rel(user, hv2x_app, "Views road user data", "Mobile App")

Rel(hv2x_app, step_platform, "Receives V2X data", "V2X SDK")

Rel(user, step_web_portal, "Downloads SDK, documentation, and retrieves App ID/Token", "Web Browser")

Rel(user, github, "Clones the HelloV2XWorld repository", "Git client")

Rel(user, android_studio, "Builds and runs the app", "IDE")
```

2. **Container Diagram**
```mermaid
C4Container

System_Boundary(c1, "HelloV2XWorld") {
  Container(hello_v2x_world_app, "HelloV2XWorld App", "Android", "Displays V2X messages on a map", "Java")
  Container(v2x_sdk, "V2X-SDK", "Android Library", "Provides V2X communication", "Java")
  Rel(hello_v2x_world_app, v2x_sdk, "Uses", "")
}

System_Ext(step_platform, "STEP Platform", "Vodafone Platform", "Provides V2X services")
Rel(hello_v2x_world_app, step_platform, "Communicates with", "MQTT over Internet")

System_Ext(android_os, "Android OS", "Operating System", "Provides system services")
Rel(hello_v2x_world_app, android_os, "Runs on", "")

System_Ext(osmdroid_lib, "OSM Droid Library", "External Library", "Provides map functionalities")
Rel(hello_v2x_world_app, osmdroid_lib, "Uses", "")

Person(user, "User", "Interacts with the app")
Rel(user, hello_v2x_world_app, "Interacts with", "")
```
3. **Component Diagram**
```mermaid
C4Component
title HelloV2XWorld Android Component Diagram

System_Boundary(c1, "HelloV2XWorld App") {
  Component(app, "HelloV2XWorld", "Displays V2X data on a map", "Android App")
  Component(map, "Map Management", "Handles map display and interaction", "Osmdroid Library")
  Component(v2xsdk, "V2X-SDK", "Provides V2X communication", "Vodafone V2X SDK")
  Component(mqtt, "MQTT Client", "Handles MQTT communication", "HiveMQ MQTT Client")
  Component(settings, "Settings", "Manages user settings", "Android Preferences")

  Rel(app, map, "Uses", "")
  Rel(app, v2xsdk, "Uses", "")
  Rel(v2xsdk, mqtt, "Uses", "For V2X Data Exchange")
  Rel(app, settings, "Uses", "")

}

System_Ext(step, "STEP Platform", "Vodafone's V2X platform", "Web Service")

Rel(v2xsdk, step, "Communicates with", "API Calls")

System_Ext(location, "Location Services", "Provides location data", "Android Service")

Rel(app, location, "Uses", "For current location")
```