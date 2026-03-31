# 🔧 09 - Create an MCP Server

<div class="duration">⏱ ~15 minutes</div>

In this step, you'll create, deploy, and connect to a remote **MCP (Model Context Protocol) server** on Cloud Run.

## Create the project

Create a folder under your home directory for the MCP server source code:

```bash {codejar}
mkdir ~/mcp-on-cloudrun && cd ~/mcp-on-cloudrun
uv init --description "Example of deploying an MCP server on Cloud Run"
```

## Add the source code

Copy the source code into `server.py` (see the [MCP Server Source](agent-lab/09-mcp-server-source.md) page):

```bash {codejar}
cloudshell edit ~/mcp-on-cloudrun/server.py
```

Install the FastMCP dependency:

```bash {codejar}
uv add fastmcp
```

Copy the Dockerfile (see the [Dockerfile](agent-lab/09-dockerfile.md) page):

```bash {codejar}
cloudshell edit ~/mcp-on-cloudrun/Dockerfile
```

## Create a service account and deploy

```bash {codejar}
gcloud iam service-accounts create mcp-server-sa \
    --display-name="MCP Server Service Account"

gcloud iam service-accounts list --filter=mcp-server-sa
```

Deploy to Cloud Run:

```bash {codejar}
cd ~/mcp-on-cloudrun

gcloud run deploy hton-mcp-server \
    --service-account=mcp-server-sa@{{PROJECT_ID}}.iam.gserviceaccount.com \
    --no-allow-unauthenticated \
    --region=europe-west1 \
    --source=.
```

## Grant permissions

Give your user account permission to call the remote MCP server:

```bash {codejar}
gcloud projects add-iam-policy-binding {{PROJECT_ID}} \
    --member=user:$(gcloud config get-value account) \
    --role='roles/run.invoker'
```

## Test with Gemini CLI

Generate an ID token for testing:

```bash {codejar}
export PROJECT_NUMBER=$(gcloud projects describe {{PROJECT_ID}} --format="value(projectNumber)")
export ID_TOKEN=$(gcloud auth print-identity-token)
```

Add the MCP server to Gemini:

```bash {codejar}
gemini mcp add \
    --scope user \
    --transport http \
    --header 'Authorization: Bearer $ID_TOKEN' \
    hton-mcp-server \
    https://hton-mcp-server-${PROJECT_NUMBER}.europe-west1.run.app/mcp
```

> ✅ **Checkpoint:** Start Gemini CLI in cloud shell with the `gemini` commandand ask it to show the product inventory.

---

**Next:** [09 - MCP Server Source →](agent-lab/09-mcp-server-source.md)
