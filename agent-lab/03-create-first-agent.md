# 🤖 03 - Create First Agent

<div class="duration">⏱ ~15 minutes</div>

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

## Experiment with instructions

Try changing the agent's instruction to something fun:

```python {codejar}
root_agent = Agent(
    model='gemini-3-flash-preview',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction='Talk like a pirate',
)
```

TODO(demir): Add instructions to add simple tools like get current date and time.

> 🤔 **Do you see any errors in the console?**
>
> For model issues, visit: 🔗 [ADK Agent Models](https://google.github.io/adk-docs/agents/models/)

---

**Next:** [04 - Deploy to Vertex AI Engine →](agent-lab/04-deploy-to-vertexai-engine.md)
