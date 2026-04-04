# 💎 05 - Set up Gemini Enterprise



In this step, you'll set up a **Gemini Enterprise** instance and configure it for your project.

## Create a Gemini Enterprise instance

1. In the Cloud Console, open a new tab and go to the [Gemini Enterprise Products page](https://console.cloud.google.com/gemini-enterprise/products).

2. Click **"Start 30-day free trial"**
3. Select **"Continue and activate the API"**
4. Choose a location: **Global**
5. Click **"Create"**

## Configure identity

- Set up identity to **"Use Google identity"**

## Enable features

1. Go to **Configuration > Feature management** and enable all disabled features.
2. Go to **Configuration > Knowledge Graph** and enable **Google Knowledge Graph**.
3. Enable **Observability logs** (OpenTelemetry & Enable logging of prompts):
   - 🔗 [Manage Observability Settings](https://docs.cloud.google.com/gemini/enterprise/docs/manage-observability-settings)

## Share your instance

In the **Gemini Enterprise homepage**, find your instance URL and **share it with your team**.

<div class="tip-box info">
  <span class="icon">💡</span>
  <div>
    If you don't see the URL, you may have skipped the <strong>Identity</strong> setup.  Set up identity to <strong>Use Google identity</strong> and try again.
  </div>
</div>

---

**Next:** [06 - Connect Agent to Gemini Enterprise →](agent-lab/06-connect-agent-to-gemini-enterprise.md)
