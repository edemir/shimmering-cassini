# 🛠️ 02 - Before you begin

<div class="duration">⏱ ~10 minutes</div>

In this step, you'll set up your lab environment — authenticate with Google Cloud, configure your project, and enable the required APIs.

## Start the Lab

1. Your **table lead** starts the lab and shares the credentials and project ID with all participants.
2. Open an **incognito window** and log into the [Google Cloud Console](https://console.cloud.google.com) using your lab credentials.
3. Select the lab project from the project picker.

<div class="tip-box info">
  <span class="icon">💡</span>
  <div>
    Always use an <strong>incognito window</strong> to avoid conflicts with your personal Google account.
  </div>
</div>

## Start Cloud Shell

Click **Activate Cloud Shell** (the terminal icon) at the top of the Google Cloud Console.

Once connected, verify your authentication:

```bash {codejar-readonly}
gcloud auth list
```

<div class="tip-box info">
  <span class="icon">⚠️</span>
  <div>
    If you get authentication errors during the lab, set your <strong>User Name</strong> in the sidebar, then run:
  </div>
</div>

```bash {codejar}
gcloud config set account {{USER_NAME}}
```

## Configure your project

Confirm your project is set:

```bash {codejar-readonly}
gcloud config list project
```

Each lab has a unique **Project ID** — copy it from your lab resources, then set it:

```bash {codejar}
export PROJECT_ID={{PROJECT_ID}}
gcloud config set project $PROJECT_ID
```

> ✅ **Checkpoint:** Your Cloud Shell prompt should show something like:
> ```
> {{USER_NAME_SHORT}}@cloudshell:~ ({{PROJECT_ID}})$`
> ```

## Enable required APIs

Enable all the APIs and services needed for this lab:

```bash {codejar}
gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    aiplatform.googleapis.com
```

> ✅ **Checkpoint:** Run
> ```bash {codejar-readonly}
> gcloud services list --enabled
> ```
> to verify all four APIs are enabled.

## Optional: Gemini CLI

If you'd like to experiment with the Gemini CLI during the lab, check out the setup guide:

🔗 [Coding with AI — Gemini CLI](https://google.github.io/adk-docs/tutorials/coding-with-ai/#gemini-cli)

---

**Next:** [03 - Create First Agent →](agent-lab/03-create-first-agent.md)
