# 🚀 Step 3: Deploy to Cloud Run

<div class="duration">⏱ ~15 minutes</div>

<div class="track-indicator" data-track="2">
  <span class="track-dot"></span>
  ⚡ This step can be done <strong>in parallel</strong> — split it with your team!
</div>

In this step, you'll containerize a simple Python web application and deploy it to Cloud Run.

## Create the application

First, create a simple Flask application:

```python {codejar}
# app.py
from flask import Flask, jsonify
import os

app = Flask(__name__)

PROJECT_ID = os.environ.get("PROJECT_ID", "{{PROJECT_ID}}")
REGION = os.environ.get("REGION", "{{REGION}}")

@app.route("/")
def home():
    return jsonify({
        "message": "Hello from the Hackathon! 🚀",
        "project": PROJECT_ID,
        "region": REGION,
        "owner": "{{USERNAME}}"
    })

@app.route("/health")
def health():
    return jsonify({"status": "healthy"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
```

## Create the Dockerfile

```docker {codejar}
FROM python:3.11-slim

WORKDIR /app

RUN pip install flask gunicorn

COPY app.py .

ENV PROJECT_ID={{PROJECT_ID}}
ENV REGION={{REGION}}

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
```

## Create requirements file

```bash {codejar}
cat > requirements.txt << 'EOF'
flask==3.0.0
gunicorn==21.2.0
EOF
```

## Build and deploy

Use Cloud Build to build the container and deploy to Cloud Run:

```bash {codejar}
# Build the container using Cloud Build
gcloud builds submit \
  --tag gcr.io/{{PROJECT_ID}}/hackathon-app \
  --project={{PROJECT_ID}}

# Deploy to Cloud Run
gcloud run deploy hackathon-app \
  --image gcr.io/{{PROJECT_ID}}/hackathon-app \
  --platform managed \
  --region {{REGION}} \
  --allow-unauthenticated \
  --service-account hackathon-sa@{{PROJECT_ID}}.iam.gserviceaccount.com \
  --set-env-vars "PROJECT_ID={{PROJECT_ID}},REGION={{REGION}}" \
  --project={{PROJECT_ID}}
```

## Verify the deployment

Once deployed, Cloud Run will output the service URL. Test it with:

```bash {codejar}
# Get the service URL
SERVICE_URL=$(gcloud run services describe hackathon-app \
  --region={{REGION}} \
  --project={{PROJECT_ID}} \
  --format="value(status.url)")

# Test the endpoint
curl $SERVICE_URL

# Check health endpoint
curl $SERVICE_URL/health
```

> 🎉 **Congratulations!** Your application is now live on Cloud Run. The service URL should return a JSON response with your project details.

## Challenge: Add a `/info` endpoint

Try adding a new endpoint that returns the current timestamp and the service account email. If you get stuck, expand the sections below!

<!-- collapse "💡 Show Hint" -->

Think about using Python's `datetime` module and the metadata server to get the service account identity. Cloud Run instances can access instance metadata at `http://metadata.google.internal`.

<!-- /collapse -->

<!-- collapse "🔑 Show Solution" -->

Add this to your `app.py` file:

```python {codejar}
from datetime import datetime
import requests

@app.route("/info")
def info():
    # Get service account from metadata server
    sa_email = requests.get(
        "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/email",
        headers={"Metadata-Flavor": "Google"}
    ).text

    return jsonify({
        "timestamp": datetime.utcnow().isoformat(),
        "service_account": sa_email,
        "project": PROJECT_ID
    })
```

Don't forget to add `requests` to your `requirements.txt`:

```bash {codejar-readonly}
echo "requests==2.31.0" >> requirements.txt
```

Then rebuild and redeploy using the commands from the previous section.

<!-- /collapse -->

## View logs

Check the Cloud Run logs to verify everything is working:

```bash {codejar-readonly}
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=hackathon-app" \
  --project={{PROJECT_ID}} \
  --limit=10 \
  --format="table(timestamp, textPayload)"
```

---

**Next:** [Step 4: Cleanup →](cleanup.md)
