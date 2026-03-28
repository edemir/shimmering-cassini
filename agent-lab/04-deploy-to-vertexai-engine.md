# ☁️ 04 - Deploy to Vertex AI Agent Engine

<div class="duration">⏱ ~10 minutes</div>

In this step, you'll prepare and deploy your agent to the **Vertex AI Agent Engine**.

## Set environment variables

Run the following commands in Cloud Shell under the **`agent_hton`** directory:

```bash {codejar}
export LOCATION_ID=europe-west1
export PROJECT_ID=<your_project_id>
```

## Export requirements and deploy

```bash {codejar}
uv export --no-hashes --format requirements-txt > first_agent/requirements.txt

uv run adk deploy agent_engine \
    --project=$PROJECT_ID \
    --region=$LOCATION_ID \
    --display_name="My First Agent" \
    first_agent
```

🔗 [Learn more about deploying to Agent Engine](https://google.github.io/adk-docs/deploy/agent-engine/deploy/#deploy-agent)

<div class="tip-box info">
  <span class="icon">⏳</span>
  <div>
    This will take a couple of minutes.
  </div>
</div>

## Test in the playground

1. See your agents at the [Agent Engines console](https://console.cloud.google.com/vertex-ai/agents/agent-engines) (change location to **europe-west1**).
2. Use the **playground** to test your agent.

## Enable telemetry

You'll likely see the traces missing. Update your `.env` file:

```ini {codejar}
GOOGLE_CLOUD_LOCATION=global
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_AGENT_ENGINE_ENABLE_TELEMETRY=TRUE
OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=TRUE
```

Enable the telemetry and logging APIs:

- 🔗 [Enable Telemetry API](https://console.cloud.google.com/apis/enableflow;apiid=telemetry.googleapis.com)
- 🔗 [Enable Logging API](https://console.cloud.google.com/flows/enableapi?apiid=logging.googleapis.com)

## Update agent.py for telemetry

Add the following lines to the **top** of your `agent.py`:

```python {codejar}
from dotenv import load_dotenv
load_dotenv()
```

Add the required libraries:

```bash {codejar}
uv add opentelemetry-instrumentation-google-genai
uv export --no-hashes --format requirements-txt > first_agent/requirements.txt
```

## Redeploy

Update your agent with the changes. Replace the agent engine ID with your agent's ID (from the previous deploy output):

```bash {codejar}
uv run adk deploy agent_engine \
    --project=$PROJECT_ID \
    --region=$LOCATION_ID \
    --display_name="My First Agent" \
    first_agent \
    --otel_to_cloud \
    --trace_to_cloud \
    --agent_engine_id \
    projects/000000/locations/europe-west1/reasoningEngines/000000
```

## Explore

1. Go to your agent instance and **reload**.
2. If prompted, **enable the Telemetry API**.

<div class="tip-box info">
  <span class="icon">⏳</span>
  <div>
    Traces will take about <strong>10 minutes</strong> to initially populate, then appear near-instantly after that.
  </div>
</div>

Explore the **dashboard**, **traces**, **sessions**, and **playground**.

---

**Next:** [05 - Create Gemini Enterprise →](agent-lab/05-create-gemini-enterprise.md)
