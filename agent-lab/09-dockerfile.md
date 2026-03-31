# 🐳 09 - Dockerfile

This is the Dockerfile for your MCP server. Copy this into `~/mcp-on-cloudrun/Dockerfile`.

```docker {codejar}
# Use the official Python image
FROM python:3.13-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Install the project into /app
COPY . /app
WORKDIR /app

# Allow statements and log messages to immediately appear in the logs
ENV PYTHONUNBUFFERED=1

# Install dependencies
RUN uv sync

EXPOSE $PORT

# Run the FastMCP server
CMD ["uv", "run", "server.py"]
```

---

**Next:** [10 - Integrate MCP Server →](agent-lab/10-integrate-mcp-server-with-the-agent.md)
