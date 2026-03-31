# 🔗 06 - Connect Agent to Gemini Enterprise

<div class="duration">⏱ ~5 minutes</div>

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

Your agent ID looks like this:

```text {codejar-readonly}
projects/0000000/locations/europe-west1/reasoningEngines/000000
```

> ✅ **Checkpoint:** You should now be able to see the traces on the **Vertex Agent Engine**.

---

**Next:** [07 - Create a Data Agent →](agent-lab/07-create-a-data-agent.md)
