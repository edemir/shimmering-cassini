# ✅ 10 - Solution

Here are the correct files for Step 10 — integrating the MCP server with your agent.

## .env

Replace the project IDs and URLs with your values:

```ini {codejar-readonly}
GOOGLE_CLOUD_LOCATION=global
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_AGENT_ENGINE_ENABLE_TELEMETRY=TRUE
OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=TRUE
MCP_SERVER_URL=https://hton-mcp-server-{{PROJECT_NUMBER}}.europe-west1.run.app/mcp
```

## agent.py

```python {codejar-readonly}
import os
import google.auth
import google.auth.transport.requests
import google.oauth2.id_token
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent
from google.adk.tools import google_search
from google.adk.tools.data_agent.config import DataAgentToolConfig
from google.adk.tools.data_agent.credentials import DataAgentCredentialsConfig
from google.adk.tools.data_agent.data_agent_toolset import DataAgentToolset
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StreamableHTTPConnectionParams
from google.genai import types

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

def get_id_token():
    """Get an ID token to authenticate with the MCP server."""
    target_url = os.getenv("MCP_SERVER_URL")
    audience = target_url.split('/mcp/')[0]
    request = google.auth.transport.requests.Request()
    id_token = google.oauth2.id_token.fetch_id_token(request, audience)
    return id_token

mcp_server_url = os.getenv("MCP_SERVER_URL")

mcp_tools = MCPToolset(
    connection_params=StreamableHTTPConnectionParams(
        url=mcp_server_url,
        headers={
            "Authorization": f"Bearer {get_id_token()}",
        },
    ),
)

root_agent = Agent(
    model='gemini-3-flash-preview',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction="""
    You are a helpful assistant that uses Data Agents
        to answer user questions about their data using the agent named "My The Look Ecommerce"
    """,
    tools=[da_toolset, mcp_tools]
)
```

---

**Next:** [11 - Orchestration →](agent-lab/11-orchestration.md)
