# 🔗 10 - Integrate MCP Server with the Agent

Model Context Protocol (MCP) is an open standard designed to standardize how Large Language Models (LLMs) like Gemini and Claude communicate with external applications, data sources, and tools.

In this step, you'll integrate an MCP server you deployed on Cloud Run with your ADK agent.  Your agent will act as an MCP client, leveraging tools provided by external MCP servers.

<div class="tip-box info">
  <span class="icon">💡</span>
  <div>
    This step builds on the data tools from Step 08 and the MCP server from Step 09. 
    Make sure both are working before proceeding.
  </div>
</div>


## Follow the ADK docs

Use **Pattern 2: Remote MCP Servers (Streamable HTTP)** from the ADK documentation:

🔗 [MCP Tools — Pattern 2: Remote MCP Servers](https://google.github.io/adk-docs/tools-custom/mcp-tools/#pattern-2-remote-mcp-servers-streamable-http)



## Update your agent

If you get stuck in the following steps see the [Solution](agent-lab/10-solution.md) page for the complete `.env` and `agent.py` files.

1. Install the MCP dependency:

```bash {codejar}
cd ~/agent_hton
uv add google-adk[mcp]
uv export --no-hashes --format requirements-txt > first_agent/requirements.txt
```

2. In your `agent.py`, import the required classes and create an `MCPToolset` that connects to your Cloud Run MCP server via **Streamable HTTP**.

<details>
<summary>💡 Hint</summary>

```python {codejar-readonly}
mcp_tools = MCPToolset(
    connection_params=StreamableHTTPConnectionParams(
        url=mcp_server_url,
        headers={
            "Authorization": f"Bearer {get_id_token()}",
        },
    ),
)
```

</details>

3. You'll need to generate an **ID token** for authentication — use `google.auth` to get one at runtime.

```python {codejar-readonly}
def get_id_token():
    """Get an ID token to authenticate with the MCP server."""
    target_url = os.getenv("MCP_SERVER_URL")
    audience = target_url.split('/mcp')[0]
    request = google.auth.transport.requests.Request()
    id_token = google.oauth2.id_token.fetch_id_token(request, audience)
    return id_token
    ```
    
4. Add the `MCPToolset` to your agent's `tools` list.


**Restart the web interface** — press `Ctrl-C` and relaunch:

```bash {codejar}
cd ~/agent_hton
uv run adk web --port 8080 --reload_agents --allow_origins 'regex:https://.*\.cloudshell\.dev'
```

---

**Next:** [10 - Solution →](agent-lab/10-solution.md)
