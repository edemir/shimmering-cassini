# 🤖 03 - Create First Agent



In this step, you'll set up your project structure and create your first AI agent using the Google Agent Development Kit (ADK).

## Enable Cloud Assist

Enable Cloud Assist at the [Gemini Admin Products page](https://console.cloud.google.com/gemini-admin/products).

1. Click on **"Get Gemini Cloud Assist"**

<div class="tip-box info">
  <span class="icon">💡</span>
  <div>
    <strong>Optional:</strong> You won't need these for the initial lab, but you may find them useful later:
    <br>🔗 <a href="https://google.github.io/adk-docs/tutorials/coding-with-ai/#adk-dev-skills">ADK Dev Skills</a>
  </div>
</div>

## Install uv and initialize your project

Install [uv](https://docs.astral.sh/uv/) — a fast Python package manager:

```bash {codejar}
pip install uv
```

Initialize a project directory in your working directory:

```bash {codejar}
uv init agent_hton
cd agent_hton
```

Install the ADK libraries:

```bash {codejar}
uv add google-adk
```

## Create your first agent

We'll use `uv run` — feel free to [create a virtual environment](https://docs.astral.sh/uv/pip/environments/) and switch into it to use `adk` directly.

Create the agent's skeleton: 

```bash {codejar}
cd ~/agent_hton
uv run adk create first_agent --region global
```

Select **other models** (option 2).  We'll change the model later.

## Run the agent in a web interface

Launch the ADK web UI:

```bash {codejar}
uv run adk web --port 8080 --reload_agents --allow_origins 'regex:https://.*\.cloudshell\.dev'
```

<div class="tip-box info">
  <span class="icon">⚠️</span>
  <div>
    You may see an error! Open the <strong>Cloud Shell Editor</strong> and the <code>agent_hton</code> folder to fix the issues below.
  </div>
</div>

## Fix the model and configuration

1. **Fix the model ID** — Open `agent.py` and change the model to **Gemini 3 Flash**:
   - 🔗 [Gemini 3 Flash docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-flash)

<details>
<summary>💡 Show solution</summary>

```python {codejar-readonly}
root_agent = Agent(
    model='gemini-3-flash-preview',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction='Answer user questions to the best of your knowledge',
)
```

</details>


2. **Enable Vertex AI mode** — Open the `.env` file and add the following:
   - 🔗 [ADK Quickstart — Vertex AI](https://google.github.io/adk-docs/get-started/quickstart/#gemini---google-cloud-vertex-ai)

Your `.env` file should look like this:

```ini {codejar}
GOOGLE_CLOUD_LOCATION=global
GOOGLE_GENAI_USE_VERTEXAI=TRUE
```

3. **Restart the web interface** — press `Ctrl-C` and relaunch:

```bash {codejar}
uv run adk web --port 8080 --reload_agents --allow_origins 'regex:https://.*\.cloudshell\.dev'
```

## Test your agent

1. **Try your agent again** in the web UI.
2. **Check the traces** — inspect the tracing output.

### Experiment with instructions

Try changing the agent's instruction to something fun:

```python {codejar}
root_agent = Agent(
    model='gemini-3-flash-preview',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction='Talk like a pirate',
)
```

### Experiment with tools

Try asking the current date and time. You'll notice that the agent will not be able to answer the question. This is because we haven't added any tools to the agent yet. Let's add a simple tool to the agent. 

Add a ```tools=[]``` to the agent's initialization and a function that returns the current date and time. 

Add instuctions to your agent to use the tool when needed. 

<details>
<summary>💡 Show solution</summary>

```python {codejar}
from google.adk.agents.llm_agent import Agent

def get_current_time(timezone_name):
    """Retrieves the current local time for a specified timezone.

    Args:
        timezone_name (str, optional): The IANA timezone database name.

    Returns:
        str: The current time formatted as 'YYYY-MM-DD HH:MM:SS'.
    """
    import datetime
    from zoneinfo import ZoneInfo
    return datetime.datetime.now(ZoneInfo(timezone_name)).strftime("%Y-%m-%d %H:%M:%S")


root_agent = Agent(
    model='gemini-3-flash-preview',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction="""
    Answer user questions to the best of your knowledge and with your available tools.
    """,
    tools = [get_current_time]
)
```

</details>

Now ask questions about the date, and the time, or time remaining until new year.

### State
Now let's add state to our agent, you can save anything you like in the state and use it later. For example, you can save the user's last timezone and use it later.

Check https://adk.dev/callbacks/types-of-callbacks/#after-tool-callback for an example.

<details>
<summary>💡 Show solution</summary>

```python {codejar}
from google.adk.agents.llm_agent import Agent
from google.adk.tools import ToolContext, FunctionTool


def get_current_time(timezone_name: str):
    """Retrieves the current local time for a specified timezone.

    Args:
        timezone_name (str, optional): The IANA timezone database name.

    Returns:
        str: The current time formatted as 'YYYY-MM-DD HH:MM:SS'.
    """
    import datetime
    from zoneinfo import ZoneInfo
    return datetime.datetime.now(ZoneInfo(timezone_name)).strftime("%Y-%m-%d %H:%M:%S")

def simple_after_tool_modifier(
    tool: BaseTool, args: Dict[str, Any], tool_context: ToolContext, tool_response: Dict
) -> Optional[Dict]:
    agent_name = tool_context.agent_name
    tool_name = tool.name
    print(f"[Callback] After tool call for tool '{tool_name}' in agent '{agent_name}'")
    print(f"[Callback] Args used: {args}")
    print(f"[Callback] Original tool_response: {tool_response}")
    if tool_name == 'get_current_time':
        tool_context.state["users_last_timezone"] = args["timezone_name"]
    

root_agent = Agent(
    model='gemini-3-flash-preview',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction="""
    Answer user questions to the best of your knowledge and with your available tools.

    When set use the last time zone user used: <LastTimeZone>{{users_last_timezone?}}</LastTimeZone>
    """,
    tools = [get_current_time],
    after_tool_callback=simple_after_tool_modifier
)
```

</details>

> 🤔 **Do you see any errors in the console?**
>
> For model issues, visit: 🔗 [ADK Agent Models](https://google.github.io/adk-docs/agents/models/)

---

**Next:** [04 - Deploy to Vertex AI Engine →](agent-lab/04-deploy-to-vertexai-engine.md)
