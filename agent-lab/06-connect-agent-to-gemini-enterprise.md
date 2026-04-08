# 🔗 06 - Connect Agent to Gemini Enterprise



In this step, you'll connect your deployed agent to your Gemini Enterprise instance.

## Add your agent

1. Go to the [Gemini Enterprise Apps page](https://console.cloud.google.com/gemini-enterprise/apps).
2. Select your **Gemini Enterprise instance**.
3. Go to **"Agents"** from the left side menu.
4. Click on **"+ Add agent"**.
5. Select **"Custom agent via Agent Engine"**.
6. **Skip** the authorization step.

## Configure the agent

Add the following details:

| Field | Value |
|---|---|
| **Name** | Your agent's name |
| **Description** | A short description |
| **Agent ID** | Your agent's resource name |

Run the following command to get your Agent ID.

**This should be run by the person who deployed the latest version of the agent.**

```bash {codejar}
curl -s -X GET      -H "Authorization: Bearer $(gcloud auth print-access-token)"      "https://europe-west1-aiplatform.googleapis.com/v1/projects/{{PROJECT_ID}}/locations/europe-west1/reasoningEngines" | jq -r '.reasoningEngines[] | select(.displayName == "{{USER_NAME_SHORT}} Agent") | .name'
```

It should be in this format: `projects/0000000/locations/europe-west1/reasoningEngines/000000`.

Paste it into the Agent ID field in the Gemini Enterprise form.

> ✅ **Checkpoint:** You should now be able to see the traces on the **Vertex Agent Engine**.

---

**Next:** [07 - Create a Data Agent →](agent-lab/07-create-a-data-agent.md)
