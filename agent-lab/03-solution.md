# ✅ 03 - Solution

Here are the correct files for Step 03.

## agent.py

```python {codejar-readonly}
root_agent = Agent(
    model='gemini-3-flash-preview',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction='Answer user questions to the best of your knowledge',
)
```

## .env

```ini {codejar-readonly}
GOOGLE_CLOUD_LOCATION=global
GOOGLE_GENAI_USE_VERTEXAI=TRUE
```

---

**Next:** [04 - Deploy to Vertex AI Engine →](agent-lab/04-deploy-to-vertexai-engine.md)
