# 🚀 01 - Introduction

<div class="duration">⏱ Full lab: ~90 minutes</div>

Welcome to the **TR Agent Lab**! In this hands-on lab, you'll learn how to build, deploy, and integrate AI agents using the Google Agent Development Kit (ADK).

## What you'll do

- Create your first AI agent with the ADK
- Deploy it to **Vertex AI Agent Engine**
- Connect it to **Gemini Enterprise**
- Build a **Data Agent** using BigQuery
- Create and deploy a remote **MCP Server** on Cloud Run
- Integrate the MCP Server with your agent
- Explore multi-agent **orchestration**

## Prerequisites

- A Google Cloud account with billing enabled (provided by your lab lead)
- Basic familiarity with Python and the terminal
- Access to Cloud Shell

## Task Dependencies

Here is a graph showing the dependencies between the lab steps. Start working on **Create First Agent**, **Create Gemini Enterprise**, **Create Data Agent**, and **Create MCP Server** in parallel.

```mermaid
flowchart TD
    %% Define styles for different tracks
    classDef main fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    classDef enterprise fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px,color:#4a148c
    classDef data fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
    classDef mcp fill:#fff3e0,stroke:#ef6c00,stroke-width:2px,color:#e65100
    classDef final fill:#fce4ec,stroke:#c2185b,stroke-width:3px,color:#880e4f

    %% Nodes with shapes
    D([05 Create Gemini Enterprise]):::enterprise
    E([06 Connect Agent]):::enterprise
    
    B([03 Create First Agent]):::main
    C([04 Deploy to VertexAI Engine]):::main
    
    F([07 Create BigQuery Data Agent]):::data
    G([08 Connect Data Agent]):::data
    
    H([09 Create MCP Server]):::mcp
    I([10 Integrate MCP Server]):::mcp
    
    J{{11 Orchestration}}:::final

    %% Edges
    D --> E
    
    B --> C
    C -.-> E
    
    F --> G
    B -.-> G
    
    H --> I
    B -.-> I
    
    E ==> J
    G ==> I
    I ==> J
```

---

**Next:** [02 - Before you begin →](agent-lab/02-before-you-begin.md)
