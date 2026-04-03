# ✅ 07 - Solution

Here are the correct files for Step 07.

## .env

```ini {codejar-readonly}
GOOGLE_CLOUD_LOCATION=global
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_AGENT_ENGINE_ENABLE_TELEMETRY=TRUE
OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=TRUE
```

## agent.py

Replace the contents of `agent.py` with the following:

```python {codejar-readonly}
from google.adk.agents.llm_agent import Agent
from google.adk.tools.data_agent.config import DataAgentToolConfig
from google.adk.tools.data_agent.credentials import DataAgentCredentialsConfig
from google.adk.tools.data_agent.data_agent_toolset import DataAgentToolset
import google.auth
from dotenv import load_dotenv

load_dotenv()

# Define tool configuration
tool_config = DataAgentToolConfig(
    max_query_result_rows=100,
)

# Use Application Default Credentials (ADC)
# https://cloud.google.com/docs/authentication/provide-credentials-adc
application_default_credentials, _ = google.auth.default()
application_default_credentials.refresh(google.auth.transport.requests.Request())

credentials_config = DataAgentCredentialsConfig(
    credentials=application_default_credentials
)

# Debug: verify credentials loaded correctly
print(">>>")
print(application_default_credentials.token_state)
print(credentials_config)
print("<<<")

# Instantiate a Data Agent toolset
da_toolset = DataAgentToolset(
    credentials_config=credentials_config,
    data_agent_tool_config=tool_config,
    tool_filter=[
        "list_accessible_data_agents",
        "get_data_agent_info",
        "ask_data_agent",
    ],
)

root_agent = Agent(
    model='gemini-3-flash-preview',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction="""
    You are a helpful assistant that uses Data Agents.
    * To answer user questions about their data using the agent named "My The Look Ecommerce".
    * Use the project ID `{{PROJECT_ID}}` for data operations.
    """,
    tools=[da_toolset]
)
```

---

