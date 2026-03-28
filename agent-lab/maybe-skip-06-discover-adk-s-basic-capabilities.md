# 🔍 06 - Discover ADK's Basic Capabilities

<div class="duration">⏱ ~10 minutes (optional)</div>

<div class="tip-box info">
  <span class="icon">⏭️</span>
  <div>
    This step is <strong>optional</strong> — you may skip it if you're short on time.
  </div>
</div>

So far, we only had a saved prompt as an agent. In this section, we'll develop our agent's abilities to **use tools** and **coordinate with other agents**.

## Add a search tool

Let's start with a search tool:

🔗 [ADK Search Integration](https://google.github.io/adk-docs/integrations/?topic=search)

**Google Search** can be used out of the box without authentication.

## Run the web UI

Open the Cloud Shell Editor, then start the web dev UI if it's not already running:

```bash {codejar}
uv run adk web --port 8080 --reload_agents --allow_origins 'regex:https://.*\.cloudshell\.dev'
```

---

**Next:** [07.1 - Create a Data Agent →](agent-lab/07.1-create-a-data-agent.md)
