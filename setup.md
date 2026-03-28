# ⚡ Step 1: Environment Setup

<div class="duration">⏱ ~10 minutes</div>

In this step, you'll configure your local environment to work with your GCP project.

## Set your project and region

First, let's configure the `gcloud` CLI with your project and preferred region. The code block below is **editable** — feel free to modify it before running in your terminal.

```bash {codejar}
# Set the active project
gcloud config set project {{PROJECT_ID}}

# Set the default region
gcloud config set compute/region {{REGION}}

# Verify your configuration
gcloud config list
```

## Authenticate

Make sure you're logged in with the correct account ({{EMAIL}}):

```bash {codejar}
# Login to your Google account
gcloud auth login {{EMAIL}}

# Set the application default credentials
gcloud auth application-default login
```

## Enable required APIs

Enable the Cloud Run, Cloud Build, and Cloud Storage APIs:

```bash {codejar}
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  storage.googleapis.com \
  artifactregistry.googleapis.com \
  --project={{PROJECT_ID}}
```

<div class="tip-box success">
  <span class="icon">✅</span>
  <div>
    <strong>Checkpoint:</strong> Run <code>gcloud services list --enabled --project={{PROJECT_ID}}</code> to verify all APIs are enabled.
  </div>
</div>

## Create a service account

Create a dedicated service account for your Cloud Run service:

```bash {codejar}
# Create the service account
gcloud iam service-accounts create hackathon-sa \
  --display-name="Hackathon Service Account" \
  --project={{PROJECT_ID}}

# Grant necessary roles
gcloud projects add-iam-policy-binding {{PROJECT_ID}} \
  --member="serviceAccount:hackathon-sa@{{PROJECT_ID}}.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"
```

## Verify setup

Run the following to confirm everything is configured correctly:

```bash {codejar-readonly}
echo "✅ Project:  {{PROJECT_ID}}"
echo "✅ Region:   {{REGION}}"
echo "✅ Account:  {{EMAIL}}"
echo "✅ Username: {{USERNAME}}"
echo ""
echo "Environment setup complete!"
```

<div class="tip-box info">
  <span class="icon">📌</span>
  <div>
    The readonly block above will automatically update when you change your variables. Editable blocks retain your customizations.
  </div>
</div>

---

**Next:** [Step 2: Cloud Storage →](storage.md)
