# 🔌 08 - Connect to a Data Agent Tool


ADK comes with [pre-built tools](https://adk.dev/integrations) and integrations that you can use with your agents. 

Data Agents is a pre-built agent that can be used to query and analyze data in BigQuery. 

In this step, you'll connect the Data Agent to your custom agent as a tool and grant the necessary IAM permissions.

## Connect the Data Agent

Use the attached code in [08 - Solution](agent-lab/08-solution.md) to connect the data agent to your custom agent as a tool.

After copying the code, run your agent in Cloud Shell if it's not running:

```bash {codejar}
cd ~/agent_hton
uv run adk web --port 8080 --reload_agents --allow_origins 'regex:https://.*\.cloudshell\.dev'
```

Test your agent locally in the web dev UI interface.

Try asking these questions:
* What is the total revenue for the last 6 months?
* Which product category has the highest revenue?


## Deploy Data Agent

### Grant IAM roles

We'll use the Agent Engine's service account to provide access to the dataset. Add the following roles to Agent Engine's IAM account:


<div class="tip-box info">
  <span class="icon">💡</span>
  <div>
    You can copy the <strong>resource name</strong> and <strong>identity</strong> from the Agent Engine console.
  </div>
</div>

Copy the service account ID from the Agent Engine console and set it below:

```bash {codejar}
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
SA="serviceAccount:service-${PROJECT_NUMBER}@gcp-sa-aiplatform-re.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="$SA" \
  --role="roles/run.invoker"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="$SA" \
  --role="roles/geminidataanalytics.dataAgentUser"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="$SA" \
  --role="roles/geminidataanalytics.dataAgentViewer"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="$SA" \
  --role="roles/geminidataanalytics.dataAgentStatelessUser"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="$SA" \
  --role="roles/aiplatform.reasoningEngineServiceAgent"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="$SA" \
  --role="roles/bigquery.jobUser"
```

### Redeploy

Re-deploy your agent to the Agent Engine. Go into the `agent_hton` folder in Cloud Shell:

```bash {codejar}
cd ~/agent_hton

AGENT_RESOURCE_ID=$(curl -s -X GET      -H "Authorization: Bearer $(gcloud auth print-access-token)"      "https://europe-west1-aiplatform.googleapis.com/v1/projects/{{PROJECT_ID}}/locations/europe-west1/reasoningEngines" | jq -r '.reasoningEngines[] | select(.displayName == "{{USER_NAME_SHORT}} Agent") | .name')

if [[ ! "$AGENT_RESOURCE_ID" =~ ^projects/[0-9]+/locations/europe-west1/reasoningEngines/[0-9]+$ ]]; then
  echo "❌ Error: AGENT_RESOURCE_ID has an unexpected value: '$AGENT_RESOURCE_ID'"
  echo "   Expected format: projects/<number>/locations/europe-west1/reasoningEngines/<number>"
  echo "   Make sure your agent was deployed in step 04 and the display name matches."
else
  echo "✅ AGENT_RESOURCE_ID=$AGENT_RESOURCE_ID"
fi

uv run adk deploy agent_engine \
    --project={{PROJECT_ID}} \
    --region=europe-west1 \
    --display_name="{{USER_NAME_SHORT}} Agent" \
    --otel_to_cloud \
    --trace_to_cloud \
    --agent_engine_id $AGENT_RESOURCE_ID \
    first_agent
```

<div class="tip-box info">
  <span class="icon">💡</span>
  <div>
    Replace the <code>agent_engine_id</code> with your agent's <strong>Resource name</strong> from the Agent Engine UI.
  </div>
</div>

> ✅ **Checkpoint:** Make sure the agent works in the **playground**, then try it in **Gemini Enterprise**.

---

**Next:** [09 - Create an MCP Server →](agent-lab/09-create-an-mcp-server.md)