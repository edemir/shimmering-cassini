# 🚀 01 - Start Here

## Start the Lab Environment
This step is **for the table lead only**.

## Table Lead: In this step, you'll set up your lab environment.

1. Your **table lead** starts the lab and shares the credentials and project ID with all participants.
2. Open an **incognito window** and log into the [Google Cloud Console](https://console.cloud.google.com) using your lab credentials.
3. Select the lab project from the project picker.

<div class="tip-box info">
  <span class="icon">💡</span>
  <div>
    Always use an <strong>incognito window</strong> to avoid conflicts with your personal Google account.
  </div>
</div>

## Task Dependencies

Here is a graph showing the dependencies between the lab steps. 

Each member of the team should complete **Before you begin** individually.

You should start working on the following tasks in parallel:

- **Create First Agent** 
  - All participants should do this, you'll not interfere with each other.
- **Set up Gemini Enterprise** One participant should do this.
- **Create Data Agent** One participant should do this.
- **Create MCP Server** One participant should do this.



```mermaid
flowchart LR
    classDef default font-size:32px,padding:10px

    SPLIT{{"🔀  Complete Setup - Work in Parallel"}}
    
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
