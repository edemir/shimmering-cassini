# 🔐 Agent Identity

Reference commands for granting IAM roles to the Agent Engine's identity principal.

<div class="tip-box info">
  <span class="icon">⚠️</span>
  <div>
    Replace the project ID, org ID, project number, and reasoning engine ID with your actual values before running these commands.
  </div>
</div>

```bash {codejar}
PROJECT_ID="qwiklabs-gcp-04-60b25ef6bc01"
AGENT_PRINCIPAL="principal://agents.global.org-616463121992.system.id.goog/resources/aiplatform/projects/754548749652/locations/us-central1/reasoningEngines/2102724178900680704"

# Service Usage Consumer
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="$AGENT_PRINCIPAL" \
  --role=roles/serviceusage.serviceUsageConsumer

# Browser
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="$AGENT_PRINCIPAL" \
  --role=roles/browser

# AI Platform Express User
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="$AGENT_PRINCIPAL" \
  --role=roles/aiplatform.expressUser

# Logging Log Writer
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="$AGENT_PRINCIPAL" \
  --role=roles/logging.logWriter

# Monitoring Metric Writer
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="$AGENT_PRINCIPAL" \
  --role=roles/monitoring.metricWriter

# Telemetry Writer
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="$AGENT_PRINCIPAL" \
  --role=roles/telemetry.writer
```

### Required Roles Summary

| Role | Purpose |
|---|---|
| `roles/serviceusage.serviceUsageConsumer` | Access Google Cloud services |
| `roles/browser` | Browse project resources |
| `roles/aiplatform.expressUser` | Use AI Platform Express |
| `roles/logging.logWriter` | Write logs |
| `roles/monitoring.metricWriter` | Write monitoring metrics |
| `roles/telemetry.writer` | Write telemetry data |
