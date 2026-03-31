# ☁️ 04 - Deploy to Vertex AI Agent Engine

<div class="duration">⏱ ~10 minutes</div>

In this step, you'll prepare and deploy your agent to the **Vertex AI Agent Engine**.

## Set environment variables

Run the following commands in Cloud Shell under the **`agent_hton`** directory:

```bash {codejar}
export LOCATION_ID=europe-west1
export PROJECT_ID={{PROJECT_ID}}
```

## Export requirements and deploy

### Enable telemetry

For traces and logs in the Agent Engine you'll need to send telemetry data to Cloud Logging and Cloud Trace. To do this, you need to enable the telemetry and logging APIs and update your `.env` and `agent.py` files:

Enable the telemetry and logging APIs:

- 🔗 [Enable Telemetry API](https://console.cloud.google.com/apis/enableflow;apiid=telemetry.googleapis.com)
- 🔗 [Enable Logging API](https://console.cloud.google.com/flows/enableapi?apiid=logging.googleapis.com)

Add the following lines to the **top** of your `agent.py`:

```python {codejar}
from dotenv import load_dotenv
load_dotenv()
```

Modify your `.env` file to include the following lines:

```ini {codejar}
GOOGLE_CLOUD_LOCATION=global
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_AGENT_ENGINE_ENABLE_TELEMETRY=TRUE
OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=TRUE
```

```bash {codejar}
cd ~/agent_hton

# Add the required libraries:
uv add opentelemetry-instrumentation-google-genai
uv export --no-hashes --format requirements-txt > first_agent/requirements.txt
```

Deploy the agent:

```bash {codejar}
uv run adk deploy agent_engine \
    --project=$PROJECT_ID \
    --region=$LOCATION_ID \
    --otel_to_cloud \
    --trace_to_cloud \
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
2. If prompted, **enable the Telemetry API**.
3. Use the **playground** to test your agent.


## Explore

Explore the **dashboard**, **traces**, **sessions**, and **playground**.

## Redeploy

You can re-deploy your agent after making changes to it.
Replace the agent engine ID with your agent's ID (from the previous deploy output):

```bash {codejar}
uv run adk deploy agent_engine \
    --project=$PROJECT_ID \
    --region=$LOCATION_ID \
    --display_name="My First Agent" \
    --otel_to_cloud \
    --trace_to_cloud \
    --agent_engine_id {{AGENT_RESOURCE_ID}} \
    first_agent
```


---

**Next:** [05 - Create Gemini Enterprise →](agent-lab/05-create-gemini-enterprise.md)
