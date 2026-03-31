# 🚀 01 - Introduction

## Task Dependencies

Here is a graph showing the dependencies between the lab steps. Start working on **Create First Agent**, **Create Gemini Enterprise**, **Create Data Agent**, and **Create MCP Server** in parallel.

```mermaid
flowchart LR
    classDef default font-size:32px,padding:10px

    SPLIT{{"🔀 SPLIT — work in parallel"}}
    
    SPLIT --> B["🤖 03 Create First Agent"]
    B --> C["🚀 04 Deploy to VertexAI Engine"]
    
    SPLIT --> D["💎 05 Create Gemini Enterprise"]
    D --> E["🔗 06 Connect Agent"]
    
    SPLIT --> F["📊 07 Create BigQuery Data Agent"]
    F --> G["🔌 08 Connect Data Agent"]
    
    SPLIT --> H["🔧 09 Create MCP Server"]
    H --> I["🔗 10 Integrate MCP Server"]
    
    C -.-> E
    B -.-> G
    B -.-> I
    
    E --> SYNC{{"🔗 SYNC — wait for all"}}
    G --> I
    I --> SYNC
    
    SYNC --> J["🧩 11 Orchestration"]
```

---

**Next:** [02 - Before you begin →](agent-lab/02-before-you-begin.md)
