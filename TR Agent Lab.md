# 01 \- Introduction

## What you'll do

* 

# 02 \- Before you begin

## Start the Lab

1. Table lead starts the lab and shares the credentials and project ID with the participants.  
2. Log into Google Cloud Console in an **incognito window** using your lab credentials.  
3. Select the lab project.  
   

## Start Cloud Shell

Click Activate Cloud Shell at the top of the Google Cloud console.

Once connected to Cloud Shell, run this command to verify your authentication in Cloud Shell.

gcloud auth list

If during the lab you get errors, you may need to run this command \- replace \<account\> with your student account.

*gcloud config set account \<account\>*

Run the following command to confirm that your project is configured for use with gcloud:

gcloud config list project

Each lab will have its unique Project ID \- copy it from the lab resources

Use the following command to set your project:

export PROJECT\_ID=\<YOUR\_PROJECT\_ID\>

gcloud config set project $PROJECT\_ID

Cloud shell prompt should show something like:

student\_01\_f5ce61ad6fac@cloudshell:\~ (qwiklabs-gcp-00-1b7b11aedf8e)$

Run this command to enable all the required APIs and services:

gcloud services enable \\

    run.googleapis.com \\

    artifactregistry.googleapis.com \\

    cloudbuild.googleapis.com \\

    aiplatform.googleapis.com

**Optional:** 

https://google.github.io/adk-docs/tutorials/coding-with-ai/\#gemini-cli

# 03 \- Create First Agent

## Create a project structure and run the first agent

Enable cloud assist at [https://console.cloud.google.com/gemini-admin/products](https://console.cloud.google.com/gemini-admin/products)

	Click on "Get Gemini Cloud Assist"

[Ahmet Öztürk](mailto:ahmetozturk@google.com) Code assist trial

**Optional (we'll not these for the initial lab but you may find it useful later)**

* https://google.github.io/adk-docs/tutorials/coding-with-ai/\#adk-dev-skills


Install uv  ( https://docs.astral.sh/uv/ )

pip install uv

In the working directory initialize a project directory.

 uv init agent\_hton

cd agent\_hton

Install the ADK libraries 

 uv add google-adk

**Let's create our first agent:**

we'll use uv run \- feel free to create a virtual environment ( https://docs.astral.sh/uv/pip/environments/ ) and switch into it to use adk directly.

Create the Agent's skeleton.

Select other models (option 2).

uv run adk create first\_agent \--region global

Explore the agent in a web interface:

uv run adk web \--port 8080 \--reload\_agents \--allow\_origins  'regex:https://.\*\\.cloudshell\\.dev'

You may see an error.  Open the cloudshell editor.

Open the agent\_hton folder in the shell editor.

Fix the problem in the agent.py file.

Change the model to Gemini 3 Flash (this will fix the model ID issue)

[https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-flash](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-flash)

Open the .env file and enable Vertex AI mode. (this will fix the no API key issue). 

https://google.github.io/adk-docs/get-started/quickstart/\#gemini---google-cloud-vertex-ai

.env should be minimally like this:

GOOGLE\_CLOUD\_LOCATION\=global

GOOGLE\_GENAI\_USE\_VERTEXAI\=TRUE

Ctrl-C and restart the web interface

uv run adk web \--port 8080 \--reload\_agents \--allow\_origins  'regex:https://.\*\\.cloudshell\\.dev'

**Try your agent again.**

**Check the traces.**

**![][image1]**

**Change the instruction to do something different, for instance change the instruction to:**

**root\_agent \= Agent(**

   model\='gemini-3-flash-preview',

   name\='root\_agent',

   description\='A helpful assistant for user questions.',

   **instruction\='Talk like a pirate',**

**)**

***Do you see any errors in the console?*** 

*For model issues visit: https://google.github.io/adk-docs/agents/models/*

 

# 03 \- Solution

agent.py file:

root\_agent \= Agent(

   model\='gemini-3-flash-preview',

   name\='root\_agent',

   description\='A helpful assistant for user questions.',

   instruction\='Answer user questions to the best of your knowledge',

)

.env file:

GOOGLE\_CLOUD\_LOCATION\=global

GOOGLE\_GENAI\_USE\_VERTEXAI\=TRUE

# 04 \- Deploy to VertexAI Engine

## Prepare and deploy to the agent for VertexAI Agent Engine 

Run the following commands in cloud shell under the **agent\_hton** directory.

1. export LOCATION\_ID=europe-west1   
2. export PROJECT\_ID=\<your\_project\_id\>  
3. uv export \--no-hashes \--format requirements-txt \> first\_agent/requirements.txt  
4. uv run adk deploy agent\_engine  \--project=$PROJECT\_ID  \--region=$LOCATION\_ID   \--display\_name="My First Agent" first\_agent

(to learn more check out  [https://google.github.io/adk-docs/deploy/agent-engine/deploy/\#deploy-agent](https://google.github.io/adk-docs/deploy/agent-engine/deploy/#deploy-agent) )

This will take a couple of minutes. 

See your agents at https://console.cloud.google.com/vertex-ai/agents/agent-engines (change location to europe-west1)

Use the playground to test your agent.


You'll likely see the traces missing.  Follow the instructions in the console to add the environment variables to your agent. in the .env file.

Your file minimally should look like this:

GOOGLE\_CLOUD\_LOCATION\=global

GOOGLE\_GENAI\_USE\_VERTEXAI\=TRUE

GOOGLE\_CLOUD\_AGENT\_ENGINE\_ENABLE\_TELEMETRY\=TRUE

OTEL\_INSTRUMENTATION\_GENAI\_CAPTURE\_MESSAGE\_CONTENT\=TRUE

Enable the telemetry and logging APIs:

* https://console.cloud.google.com/apis/enableflow;apiid=telemetry.googleapis.com  
* https://console.cloud.google.com/flows/enableapi?apiid=logging.googleapis.com

Add the following lines to your agent.py to the top.

from dotenv import load\_dotenv

load\_dotenv()

Add the required libraries:

* uv add opentelemetry-instrumentation-google-genai  
* uv export \--no-hashes \--format requirements-txt \> first\_agent/requirements.txt

Update your agent after the changes. Replace the agent engine id below with your agent's id, you can see the agent id output from your previous deploy.

uv run adk deploy agent\_engine         \--project=$PROJECT\_ID         \--region=$LOCATION\_ID         \--display\_name="My First Agent" first\_agent \--otel\_to\_cloud \--trace\_to\_cloud \--agent\_engine\_id \\

*projects/000000/locations/*europe-west1*/reasoningEngines/000*000

Go to your agent instance and reload.

You may see: "Enable the Telemetry API for telemetry data from the agent to be collected" Enable it.

Initially Traces will take 10 minutes to populate, and will appear near instantly after that.

Explore the dashboard, traces, sessions, and playground.

# 05 \- Create Gemini Enterprise

## Connect your agent to the Gemini Enterprise 

In the cloud console open a tab and go to  [https://console.cloud.google.com/gemini-enterprise/products](https://console.cloud.google.com/gemini-enterprise/products)

* Click “ Start 30-day free trial”  
* Select “continue and acctivate the API” for G  
* Choose a location : ()Global  
* Click "create"


  

* "Set up identity" to "Use Google identity"

* Go to Configuration \>  "Feature management" and enable all disabled features.  
* Go to Configuration \> "Knowledge Graph"  Enable Google Knowledge graph  
* Enable Observability logs.  (OpenTelemetry & Enable logging of prompts)  
  [https://docs.cloud.google.com/gemini/enterprise/docs/manage-observability-settings](https://docs.cloud.google.com/gemini/enterprise/docs/manage-observability-settings)

In the **Gemini Enterprise homepage** find your instance URL and share it with your team.

# 05.2 \- Connect Agent to Gemini Enterprise

Go to https://console.cloud.google.com/gemini-enterprise/apps

Select your gemini enterprise instance.

Go to "Agents" from the left side menu.

Click on "+ Add agent"

Select "Custom agent via Agent Engine"

Skip the authorization

Add a name, description, and your agent's agent id.

	Your agent id: projects/0000000/locations/europe-west1/reasoningEngines/000000

You should be able to see the traces on the Vertex Agent Engine.

# Maybe skip 06 \- Discover ADK's basic capabilities

## Discover ADK's capabilities

So far, we only had a saved prompt as an agent.

In this section we'll develop our agent's abilities to use tools and coordinate with other agents.

Let's start with a search tool: https://google.github.io/adk-docs/integrations/?topic=search

Google Search can be used out of the box without authentication.

Open the cloudshell editor

In cloudshell start the web dev ui if not running:

uv run adk web \--port 8080 \--reload\_agents \--allow\_origins  'regex:https://.\*\\.cloudshell\\.dev'

# 07.1 \- Create a data agent

## Connect to a remote tool

Visit https://console.cloud.google.com/bigquery/agents\_hub

Enable the APIs if needed.

Go to "Agent Catalog" from the top of the screen.

Duplicate the "The Look Ecommerce" agent.

Save and publish the agent.


**Important:**

Share the data agent with Vertex Agent Engine's service account \- copy the "identity" and add it as viewer.

![][image2]

In the chat ask the agent what it can do.

# 07.2 \- Connect to a data agent tool

## Connect to a remote tool

Use the attached code to connect the data agent to your custom agent as a tool.

Run your agent in the cloud shell.

uv run adk web \--port 8080 \--reload\_agents \--allow\_origins  'regex:https://.\*\\.cloudshell\\.dev'

For now we'll use the Agent Engine's service account to provide access to the dataset.  

Add the following roles to Agent Engine's IAM account:

 

* Cloud Run Invoker  
* Gemini Data Analytics Data Agent User (Beta)  
* Gemini Data Analytics Data Agent Viewer (Beta)  
* Gemini Data Analytics Stateless Chat User (Beta)  
* Vertex AI Reasoning Engine Service Agent  
* BigQuery Job User

You can copy the resource name and identity from the Agent Engine console.

![][image2]

Copy the service account ID from the Agent Engine console to the SA param below.

PROJECT\_ID=$(gcloud config get-value project)

SA="serviceAccount:service-XXXXXXXXXXXXX@gcp-sa-aiplatform-re.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT\_ID" \\

  \--member="$SA" \\

  \--role="roles/run.invoker"

gcloud projects add-iam-policy-binding "$PROJECT\_ID" \\

  \--member="$SA" \\

  \--role="roles/geminidataanalytics.dataAgentUser"

gcloud projects add-iam-policy-binding "$PROJECT\_ID" \\

  \--member="$SA" \\

  \--role="roles/geminidataanalytics.dataAgentViewer"

gcloud projects add-iam-policy-binding "$PROJECT\_ID" \\

  \--member="$SA" \\

  \--role="roles/geminidataanalytics.dataAgentStatelessUser"

gcloud projects add-iam-policy-binding "$PROJECT\_ID" \\

  \--member="$SA" \\

  \--role="roles/aiplatform.reasoningEngineServiceAgent"

gcloud projects add-iam-policy-binding "$PROJECT\_ID" \\

  \--member="$SA" \\

  \--role="roles/bigquery.jobUser"

Share the "The Look Ecommerce (Copy)" under  https://console.cloud.google.com/bigquery/agents\_hub;agentsHubTab=Agents with this service account.

Re-Deploy your agent to the Agent Engine, make sure it works in the playground. Then try it in Gemini Enterprise.

Go into the agent\_hton folder in the cloud shell and deploy your new agent.

1. LOCATION\_ID=europe-west1   
2. PROJECT\_ID=$(gcloud config get-value project)

   

uv run adk deploy agent\_engine         \--project=$PROJECT\_ID         \--region=$LOCATION\_ID         \--display\_name="My First Agent" first\_agent \--otel\_to\_cloud \--trace\_to\_cloud \--agent\_engine\_id \\

*projects/000000/locations/*europe-west1*/reasoningEngines/000*000 

\*\*\*\*\*\*\*Agent Engine UI \- Resource name\*\*\*\*\*\*

# 07 \- Solution

–

.env file  

GOOGLE\_CLOUD\_LOCATION\=global

GOOGLE\_GENAI\_USE\_VERTEXAI\=TRUE

GOOGLE\_CLOUD\_AGENT\_ENGINE\_ENABLE\_TELEMETRY\=TRUE

OTEL\_INSTRUMENTATION\_GENAI\_CAPTURE\_MESSAGE\_CONTENT\=TRUE

— Replace the agent.py

from google.adk.agents.llm\_agent import Agent

from google.adk.tools import google\_search

from google.adk.tools.data\_agent.config import DataAgentToolConfig

from google.adk.tools.data\_agent.credentials import DataAgentCredentialsConfig

from google.adk.tools.data\_agent.data\_agent\_toolset import DataAgentToolset

from google.genai import types

import google.auth

from dotenv import load\_dotenv

load\_dotenv()

\# Define tool configuration

tool\_config \= DataAgentToolConfig(

   max\_query\_result\_rows\=100,

)

\# Use Application Default Credentials (ADC)

\# https://cloud.google.com/docs/authentication/provide-credentials-adc

application\_default\_credentials, \_ \= google.auth.default()

application\_default\_credentials.refresh(google.auth.transport.requests.Request())

credentials\_config \= DataAgentCredentialsConfig(

   credentials\=application\_default\_credentials

)

print ("\>\>\>")

print(application\_default\_credentials.token\_state)

print(credentials\_config)

print ("\<\<\<")

\# Instantiate a Data Agent toolset

da\_toolset \= DataAgentToolset(

   credentials\_config\=credentials\_config,

   data\_agent\_tool\_config\=tool\_config,

   tool\_filter\=\[

       "list\_accessible\_data\_agents",

       "get\_data\_agent\_info",

       "ask\_data\_agent",

   \],

)

root\_agent \= Agent(

   model\='gemini-3-flash-preview',

   name\='root\_agent',

   description\='A helpful assistant for user questions.',

   instruction\= 

   """You are a helpful assistant that uses Data Agents

        to answer user questions about their data.

       """,

   tools\=\[da\_toolset\]

)

# 08 \- Create an MCP Server

## Create, Run and connect to a remote MCP server

Create a folder named mcp-on-cloudrun under your home directory to store the source code for deployment.

mkdir \~/mcp-on-cloudrun && cd \~/mcp-on-cloudrun

uv init \--description "Example of deploying an MCP server on Cloud Run" 

Copy the source into server.py

cloudshell edit \~/mcp-on-cloudrun/server.py

uv add fastmcp

cloudshell edit \~/mcp-on-cloudrun/Dockerfile and copy in the source.

Create a service account for the MCP server.

gcloud iam service-accounts create mcp-server-sa \--display-name="MCP Server Service Account"

gcloud iam service-accounts list \--filter=mcp-server-sa

cd \~/mcp-on-cloudrun

gcloud run deploy hton-mcp-server     \--service-account=mcp-server-sa@qwiklabs-gcp-XX-XXXXXXXXXXXX.iam.gserviceaccount.com     \--no-allow-unauthenticated     \--region=europe-west1     \--source=.

—

Give your user account permission to call the remote MCP server

gcloud projects add-iam-policy-binding $GOOGLE\_CLOUD\_PROJECT \\

    \--member=user:$(gcloud config get-value account) \\

    \--role='roles/run.invoker'

Generate an ID\_TOKEN for testing.

export PROJECT\_NUMBER=$(gcloud projects describe $GOOGLE\_CLOUD\_PROJECT \--format="value(projectNumber)")

export ID\_TOKEN=$(gcloud auth print-identity-token)

Add the MCP server https://hton-mcp-server-XXXXXXXXXXXX.europe-west1.run.app with "Authorization": "Bearer $ID\_TOKEN" to \~/.gemini/settings.json file.

gemini mcp add \--scope user \--transport http \--header 'Authorization: Bearer $ID\_TOKEN'  hton-mcp-server https://hton-mcp-server-XXXXXXXXXXXXXX.europe-west1.run.app/mcp

Start gemini and ask it to show the product inventory.

# MCP server source

\# /// script

\# requires-python \= "\>=3.13"

\# dependencies \= \[

\#     "fastmcp",

\# \]

\# ///

import asyncio

import logging

import os

from typing import List, Dict, Any

from fastmcp import FastMCP

logger \= logging.getLogger(\_\_name\_\_)

logging.basicConfig(format="\[%(levelname)s\]: %(message)s", level=logging.INFO)

mcp \= FastMCP("Product Inventory MCP Server 📦🏷️📊")

\# Mock transactional product datastore

PRODUCTS \= \[

    {

        "sku": "D0761D981BCE5C8706808BB62E20F3B9",

        "name": "Woolrich Men's Quehanna Cardigan Sweater",

        "price": 219.0,

        "category": "Sweaters",

        "brand": "Woolrich",

        "department": "Men",

        "quantity\_on\_hand": 14,

        "reorder\_point": 5

    },

    {

        "sku": "8B48E30332FC417534491CE3FDA913B9",

        "name": "Columbia Men's Fast Trek Fleece Vest",

        "price": 43.19,

        "category": "Outerwear & Coats",

        "brand": "Columbia",

        "department": "Men",

        "quantity\_on\_hand": 27,

        "reorder\_point": 10

    },

    {

        "sku": "0AA2946C67F639237F396261B8A894AB",

        "name": "Carhartt Mens Work Wear Cushioned Crew Sock",

        "price": 16.0,

        "category": "Socks",

        "brand": "Carhartt",

        "department": "Men",

        "quantity\_on\_hand": 3,

        "reorder\_point": 12

    },

    {

        "sku": "F27A4F23A9840CBEE6CCAA3194E86EA0",

        "name": "Carhartt Men's Big-Tall Tradesman Long Sleeve Shirt",

        "price": 56.78,

        "category": "Tops & Tees",

        "brand": "Carhartt",

        "department": "Men",

        "quantity\_on\_hand": 22,

        "reorder\_point": 8

    },

    {

        "sku": "E242FD43536246C7D2D58EC0590C912E",

        "name": "True Religion Men's Ricky Titan Straight Jeans-Rough River",

        "price": 184.49,

        "category": "Jeans",

        "brand": "True Religion",

        "department": "Men",

        "quantity\_on\_hand": 7,

        "reorder\_point": 3

    },

    {

        "sku": "1C95EE9C76A4FB9258CB07573752BEF7",

        "name": "Lrg Split Tek Zip Up Hoodie",

        "price": 69.0,

        "category": "Fashion Hoodies & Sweatshirts",

        "brand": "LRG",

        "department": "Men",

        "quantity\_on\_hand": 19,

        "reorder\_point": 6

    },

    {

        "sku": "99897197639505C33A5007BC38D456C3",

        "name": "Columbia Sportswear Men's Perfect Cast Polo Shirt",

        "price": 41.80,

        "category": "Active",

        "brand": "Columbia",

        "department": "Men",

        "quantity\_on\_hand": 0,

        "reorder\_point": 15

    },

    {

        "sku": "E7CD22624D2439F832CBD30D91600DA6",

        "name": "Paul Fredrick Wool / Cashmere Flannel Flat Front Pant",

        "price": 109.50,

        "category": "Pants",

        "brand": "Paul Fredrick",

        "department": "Men",

        "quantity\_on\_hand": 11,

        "reorder\_point": 4

    },

    {

        "sku": "3B95A878E7E99D5933F0ABD36CA835FA",

        "name": "RIGGS WORKWEAR by Wrangler Men's Short Sleeve Henley",

        "price": 27.25,

        "category": "Tops & Tees",

        "brand": "Wrangler",

        "department": "Men",

        "quantity\_on\_hand": 29,

        "reorder\_point": 10

    },

    {

        "sku": "B2CEA2CE8A7B8EE1AD5A97F9170CF234",

        "name": "Fruit Of The Loom Men's 4 Pack Boxer Briefs",

        "price": 33.0,

        "category": "Underwear",

        "brand": "Fruit of the Loom",

        "department": "Men",

        "quantity\_on\_hand": 16,

        "reorder\_point": 7

    },

    {

        "sku": "93F19DBC4426F203A274642A804F36E8",

        "name": "Diesel Men's Michael Tee",

        "price": 39.0,

        "category": "Underwear",

        "brand": "Diesel",

        "department": "Men",

        "quantity\_on\_hand": 2,

        "reorder\_point": 9

    },

    {

        "sku": "9EF7F0360A59458D3FC8146AC7DF4C71",

        "name": "American Apparel Poly-Cotton Short Sleeve Crew Neck",

        "price": 20.0,

        "category": "Tops & Tees",

        "brand": "American Apparel",

        "department": "Men",

        "quantity\_on\_hand": 25,

        "reorder\_point": 11

    },

    {

        "sku": "87EFE7B5FA21D969F4CA491ED04B0149",

        "name": "Classics Womens Stretch Sport Bikini Assorted",

        "price": 10.53,

        "category": "Intimates",

        "brand": "Hanes",

        "department": "Women",

        "quantity\_on\_hand": 8,

        "reorder\_point": 20

    },

    {

        "sku": "2A822AFD087F6001D3A645686FF08389",

        "name": "Ed Hardy Men's Premium Love Kills Slowly Trunk",

        "price": 14.99,

        "category": "Underwear",

        "brand": "Ed Hardy",

        "department": "Men",

        "quantity\_on\_hand": 30,

        "reorder\_point": 13

    },

    {

        "sku": "9EBD41E6CBC1E14780805F6FC0D65867",

        "name": "ExOfficio Men's Give-N-Go Sport Brief",

        "price": 20.0,

        "category": "Active",

        "brand": "ExOfficio",

        "department": "Men",

        "quantity\_on\_hand": 5,

        "reorder\_point": 18

    },

    {

        "sku": "E9CB54CBC877FE2CF2BC1293D2EC1254",

        "name": "Allegra K Mens Zipper Closure Dinosaur Designed Hoody Coat Light Gray S",

        "price": 20.37,

        "category": "Fashion Hoodies & Sweatshirts",

        "brand": "Allegra K",

        "department": "Men",

        "quantity\_on\_hand": 21,

        "reorder\_point": 7

    },

    {

        "sku": "C77409B2F7DABC444A533B98D9381690",

        "name": "Barely There Women's Customflex Fit Lighly Lined Wirefree",

        "price": 29.0,

        "category": "Intimates",

        "brand": "Barely There",

        "department": "Women",

        "quantity\_on\_hand": 13,

        "reorder\_point": 4

    },

    {

        "sku": "A3B2E0D095B2D7155D1B7739488F9FF1",

        "name": "Aeropostale Mens Crewneck Sweater \- Style 2128",

        "price": 29.99,

        "category": "Sweaters",

        "brand": "Aeropostale",

        "department": "Men",

        "quantity\_on\_hand": 1,

        "reorder\_point": 15

    },

    {

        "sku": "CE81F8E75A87B17708D10A0684FBE1EC",

        "name": "Roxy Women's Sun Blossom Smocked Boy Brief",

        "price": 41.04,

        "category": "Swim",

        "brand": "Roxy",

        "department": "Women",

        "quantity\_on\_hand": 17,

        "reorder\_point": 6

    },

    {

        "sku": "1138D90EF0A0848A542E57D1595F58EA",

        "name": "Woman Within Plus Size Jean relaxed fit with 5-pocket styling",

        "price": 24.99,

        "category": "Jeans",

        "brand": "Woman Within",

        "department": "Women",

        "quantity\_on\_hand": 9,

        "reorder\_point": 22

    }

\]

@mcp.tool()

def get\_product\_details(skus: List\[str\]) \-\> List\[Dict\[str, Any\]\]:

    """

    Retrieves the full details for a list of products by their SKUs.

    Args:

        skus: A list of unique SKU identifiers

              (e.g., \['D0761D981BCE5C8706808BB62E20F3B9',

                      '0AA2946C67F639237F396261B8A894AB'\]).

    Returns:

        A list of dictionaries, where each dictionary contains a product's

        details (product\_id, sku, name, price, category, brand, department,

        quantity\_on\_hand, reorder\_point).

        Products not found are omitted from the results.

    """

    logger.info(f"\>\>\> 🛠️ Tool: 'get\_product\_details' called for '{skus}'")

    sku\_set \= set(skus)

    return \[product for product in PRODUCTS if product\["sku"\] in sku\_set\]

if \_\_name\_\_ \== "\_\_main\_\_":

    port \= int(os.getenv("PORT", 8080))

    logger.info(f"🚀 MCP server started on port {port}")

    asyncio.run(

        mcp.run\_async(

            transport="http",

            host="0.0.0.0",

            port=port,

        )

    )

# Dockerfile

\# Use the official Python image

FROM python:3.13-slim

\# Install uv

COPY \--from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

\# Install the project into /app

COPY . /app

WORKDIR /app

\# Allow statements and log messages to immediately appear in the logs

ENV PYTHONUNBUFFERED=1

\# Install dependencies

RUN uv sync

EXPOSE $PORT

\# Run the FastMCP server

CMD \["uv", "run", "server.py"\]

# MCP Server Source \- 2

import asyncio

import logging

import os

from typing import List, Dict, Any

from fastmcp import FastMCP

logger \= logging.getLogger(\_\_name\_\_)

logging.basicConfig(format="\[%(levelname)s\]: %(message)s", level=logging.INFO)

mcp \= FastMCP("Product Inventory MCP Server 📦🏷️📊")

\# Mock transactional product datastore

PRODUCTS \= \[

    {

        "category": "electronics",

        "product\_id": "ELEC-1001",

        "name": "Wireless Bluetooth Headphones",

        "price": 79.99,

        "warehouse": "West Coast Fulfillment Center",

        "quantity\_on\_hand": 342,

        "reorder\_point": 50,

        "supplier": "AudioTech Inc."

    },

    {

        "category": "electronics",

        "product\_id": "ELEC-1002",

        "name": "USB-C Fast Charger",

        "price": 24.99,

        "warehouse": "West Coast Fulfillment Center",

        "quantity\_on\_hand": 1200,

        "reorder\_point": 200,

        "supplier": "PowerUp Supply Co."

    },

    {

        "category": "electronics",

        "product\_id": "ELEC-1003",

        "name": "4K Webcam",

        "price": 129.99,

        "warehouse": "East Coast Distribution Hub",

        "quantity\_on\_hand": 87,

        "reorder\_point": 30,

        "supplier": "VisionClear Technologies"

    },

    {

        "category": "electronics",

        "product\_id": "ELEC-1004",

        "name": "Portable SSD 1TB",

        "price": 89.99,

        "warehouse": "East Coast Distribution Hub",

        "quantity\_on\_hand": 455,

        "reorder\_point": 100,

        "supplier": "DataVault Storage"

    },

    {

        "category": "clothing",

        "product\_id": "CLTH-2001",

        "name": "Classic Fit Cotton T-Shirt",

        "price": 19.99,

        "warehouse": "Central Warehouse",

        "quantity\_on\_hand": 2500,

        "reorder\_point": 500,

        "supplier": "ThreadWorks Apparel"

    },

    {

        "category": "clothing",

        "product\_id": "CLTH-2002",

        "name": "Slim Fit Denim Jeans",

        "price": 49.99,

        "warehouse": "Central Warehouse",

        "quantity\_on\_hand": 780,

        "reorder\_point": 150,

        "supplier": "ThreadWorks Apparel"

    },

    {

        "category": "clothing",

        "product\_id": "CLTH-2003",

        "name": "Waterproof Hiking Jacket",

        "price": 134.99,

        "warehouse": "West Coast Fulfillment Center",

        "quantity\_on\_hand": 210,

        "reorder\_point": 40,

        "supplier": "Summit Gear Co."

    },

    {

        "category": "clothing",

        "product\_id": "CLTH-2004",

        "name": "Merino Wool Sweater",

        "price": 69.99,

        "warehouse": "East Coast Distribution Hub",

        "quantity\_on\_hand": 390,

        "reorder\_point": 75,

        "supplier": "Alpine Textiles"

    },

    {

        "category": "home\_goods",

        "product\_id": "HOME-3001",

        "name": "Stainless Steel Water Bottle",

        "price": 29.99,

        "warehouse": "Central Warehouse",

        "quantity\_on\_hand": 1800,

        "reorder\_point": 300,

        "supplier": "EcoLiving Supplies"

    },

    {

        "category": "home\_goods",

        "product\_id": "HOME-3002",

        "name": "Ceramic Coffee Mug Set",

        "price": 34.99,

        "warehouse": "Central Warehouse",

        "quantity\_on\_hand": 650,

        "reorder\_point": 100,

        "supplier": "Artisan Home Co."

    },

    {

        "category": "home\_goods",

        "product\_id": "HOME-3003",

        "name": "Bamboo Cutting Board",

        "price": 22.99,

        "warehouse": "West Coast Fulfillment Center",

        "quantity\_on\_hand": 920,

        "reorder\_point": 150,

        "supplier": "EcoLiving Supplies"

    },

    {

        "category": "home\_goods",

        "product\_id": "HOME-3004",

        "name": "LED Desk Lamp",

        "price": 44.99,

        "warehouse": "East Coast Distribution Hub",

        "quantity\_on\_hand": 315,

        "reorder\_point": 60,

        "supplier": "BrightSpace Lighting"

    },

    {

        "category": "home\_goods",

        "product\_id": "HOME-3005",

        "name": "Non-Stick Cookware Set",

        "price": 149.99,

        "warehouse": "Central Warehouse",

        "quantity\_on\_hand": 125,

        "reorder\_point": 25,

        "supplier": "ChefPro Kitchenware"

    },

    {

        "category": "sporting\_goods",

        "product\_id": "SPRT-4001",

        "name": "Yoga Mat Premium",

        "price": 39.99,

        "warehouse": "West Coast Fulfillment Center",

        "quantity\_on\_hand": 560,

        "reorder\_point": 100,

        "supplier": "FlexFit Athletics"

    },

    {

        "category": "sporting\_goods",

        "product\_id": "SPRT-4002",

        "name": "Adjustable Dumbbell Set",

        "price": 199.99,

        "warehouse": "Central Warehouse",

        "quantity\_on\_hand": 74,

        "reorder\_point": 15,

        "supplier": "IronCore Fitness"

    },

    {

        "category": "sporting\_goods",

        "product\_id": "SPRT-4003",

        "name": "Running Shoes \- Trail Edition",

        "price": 119.99,

        "warehouse": "East Coast Distribution Hub",

        "quantity\_on\_hand": 430,

        "reorder\_point": 80,

        "supplier": "Summit Gear Co."

    },

    {

        "category": "sporting\_goods",

        "product\_id": "SPRT-4004",

        "name": "Insulated Sports Water Bottle",

        "price": 27.99,

        "warehouse": "West Coast Fulfillment Center",

        "quantity\_on\_hand": 1100,

        "reorder\_point": 200,

        "supplier": "FlexFit Athletics"

    },

    {

        "category": "books",

        "product\_id": "BOOK-5001",

        "name": "Python Programming Masterclass",

        "price": 44.99,

        "warehouse": "Central Warehouse",

        "quantity\_on\_hand": 290,

        "reorder\_point": 50,

        "supplier": "PageTurner Publishing"

    },

    {

        "category": "books",

        "product\_id": "BOOK-5002",

        "name": "Cloud Architecture Patterns",

        "price": 54.99,

        "warehouse": "Central Warehouse",

        "quantity\_on\_hand": 185,

        "reorder\_point": 30,

        "supplier": "PageTurner Publishing"

    },

    {

        "category": "books",

        "product\_id": "BOOK-5003",

        "name": "Data Engineering Fundamentals",

        "price": 49.99,

        "warehouse": "East Coast Distribution Hub",

        "quantity\_on\_hand": 220,

        "reorder\_point": 40,

        "supplier": "TechPress Media"

    },

    {

        "category": "books",

        "product\_id": "BOOK-5004",

        "name": "Machine Learning in Practice",

        "price": 59.99,

        "warehouse": "West Coast Fulfillment Center",

        "quantity\_on\_hand": 160,

        "reorder\_point": 25,

        "supplier": "TechPress Media"

    }

\]

@mcp.tool()

def get\_product\_details(product\_ids: List\[str\]) \-\> List\[Dict\[str, Any\]\]:

    """

    Retrieves the full details for a list of products by their product IDs.

    Args:

        product\_ids: A list of unique product identifiers

                     (e.g., \['ELEC-1001', 'CLTH-2002'\]).

    Returns:

        A list of dictionaries, where each dictionary contains a product's

        details (category, product\_id, name, price, warehouse,

        quantity\_on\_hand, reorder\_point, supplier). Products not found

        are omitted from the results.

    """

    logger.info(f"\>\>\> 🛠️ Tool: 'get\_product\_details' called for '{product\_ids}'")

    ids\_upper \= {pid.upper() for pid in product\_ids}

    return \[product for product in PRODUCTS if product\["product\_id"\].upper() in ids\_upper\]

@mcp.tool()

def get\_product\_inventory(categories: List\[str\]) \-\> List\[Dict\[str, Any\]\]:

    """

    Retrieves inventory information for all products in the given categories.

    Can also be used to collect the base data for aggregate queries

    across product categories — like counting total items in stock,

    finding the most expensive product, or identifying items below

    their reorder point.

    Args:

        categories: A list of product categories (e.g., \['electronics',

                    'clothing', 'home\_goods', 'sporting\_goods', 'books'\]).

    Returns:

        A list of dictionaries, where each dictionary represents a product

        and contains details like name, price, quantity\_on\_hand, and warehouse.

    """

    logger.info(f"\>\>\> 🛠️ Tool: 'get\_product\_inventory' called for '{categories}'")

    cats\_lower \= {cat.lower() for cat in categories}

    return \[product for product in PRODUCTS if product\["category"\].lower() in cats\_lower\]

if \_\_name\_\_ \== "\_\_main\_\_":

    port \= int(os.getenv("PORT", 8080))

    logger.info(f"🚀 MCP server started on port {port}")

    asyncio.run(

        mcp.run\_async(

            transport="http",

            host="0.0.0.0",

            port=port,

        )

    )

# 09 \- Integrate MCP Server with the agent

# 09 \- Solution

.env file  \- replace the project ids and urls with your values.

GOOGLE\_CLOUD\_LOCATION=global

GOOGLE\_GENAI\_USE\_VERTEXAI=TRUE

GOOGLE\_CLOUD\_AGENT\_ENGINE\_ENABLE\_TELEMETRY=TRUE

OTEL\_INSTRUMENTATION\_GENAI\_CAPTURE\_MESSAGE\_CONTENT=TRUE

MCP\_SERVER\_URL=https://hton-mcp-server-XXXXXXXXXXXXX.europe-west1.run.app/mcp

–

import os

import google.auth

import google.auth.transport.requests

import google.oauth2.id\_token

from dotenv import load\_dotenv

from google.adk.agents.llm\_agent import Agent

from google.adk.tools import google\_search

from google.adk.tools.data\_agent.config import DataAgentToolConfig

from google.adk.tools.data\_agent.credentials import DataAgentCredentialsConfig

from google.adk.tools.data\_agent.data\_agent\_toolset import DataAgentToolset

from google.adk.tools.mcp\_tool.mcp\_toolset import MCPToolset, StreamableHTTPConnectionParams

from google.genai import types

load\_dotenv()

\# Define tool configuration

tool\_config \= DataAgentToolConfig(

  max\_query\_result\_rows\=100,

)

\# Use Application Default Credentials (ADC)

\# https://cloud.google.com/docs/authentication/provide-credentials-adc

application\_default\_credentials, \_ \= google.auth.default()

application\_default\_credentials.refresh(google.auth.transport.requests.Request())

credentials\_config \= DataAgentCredentialsConfig(

  credentials\=application\_default\_credentials

)

print ("\>\>\>")

print(application\_default\_credentials.token\_state)

print(credentials\_config)

print ("\<\<\<")

\# Instantiate a Data Agent toolset

da\_toolset \= DataAgentToolset(

  credentials\_config\=credentials\_config,

  data\_agent\_tool\_config\=tool\_config,

  tool\_filter\=\[

      "list\_accessible\_data\_agents",

      "get\_data\_agent\_info",

      "ask\_data\_agent",

  \],

)

def get\_id\_token():

   """Get an ID token to authenticate with the MCP server."""

   target\_url \= os.getenv("MCP\_SERVER\_URL")

   audience \= target\_url.split('/mcp/')\[0\]

   request \= google.auth.transport.requests.Request()

   id\_token \= google.oauth2.id\_token.fetch\_id\_token(request, audience)

   return id\_token

mcp\_server\_url \= os.getenv("MCP\_SERVER\_URL")

mcp\_tools \= MCPToolset(

           connection\_params\=StreamableHTTPConnectionParams(

               url\=mcp\_server\_url,

               headers\={

                   "Authorization": f"Bearer {get\_id\_token()}",

               },

           ),

       )

root\_agent \= Agent(

  model\='gemini-3-flash-preview',

  name\='root\_agent',

  description\='A helpful assistant for user questions.',

  instruction\=

  """You are a helpful assistant that uses Data Agents

       to answer user questions about their data.

      """,

  tools\=\[da\_toolset, mcp\_tools\]

)

# 10 \- Orchestration

You can now use LLM or ADK orchestration to build complex use cases.

For instance, you may want to ask about best selling items that are out of stock.

Checkout https://google.github.io/adk-docs/agents/multi-agents/\#hierarchical-task-decomposition 

# 😵‍💫 Troubleshooting

**Issues with authentication? (for instance email missing from service etc).**

Run the commands below

* gcloud auth login  
* gcloud auth application-default login

# Attic

Parking area

# Agent identity

gcloud projects add-iam-policy-binding qwiklabs-gcp-04-60b25ef6bc01  \--member="principal://agents.global.org-616463121992.system.id.goog/resources/aiplatform/projects/754548749652/locations/us-central1/reasoningEngines/2102724178900680704" \--role=roles/serviceusage.serviceUsageConsumer

gcloud projects add-iam-policy-binding qwiklabs-gcp-04-60b25ef6bc01  \--member="principal://agents.global.org-616463121992.system.id.goog/resources/aiplatform/projects/754548749652/locations/us-central1/reasoningEngines/2102724178900680704" \--role=roles/browser

gcloud projects add-iam-policy-binding qwiklabs-gcp-04-60b25ef6bc01  \--member="principal://agents.global.org-616463121992.system.id.goog/resources/aiplatform/projects/754548749652/locations/us-central1/reasoningEngines/2102724178900680704" \--role=roles/aiplatform.expressUser

gcloud projects add-iam-policy-binding qwiklabs-gcp-04-60b25ef6bc01  \--member="principal://agents.global.org-616463121992.system.id.goog/resources/aiplatform/projects/754548749652/locations/us-central1/reasoningEngines/2102724178900680704" \--role=roles/logging.logWriter

gcloud projects add-iam-policy-binding qwiklabs-gcp-04-60b25ef6bc01  \--member="principal://agents.global.org-616463121992.system.id.goog/resources/aiplatform/projects/754548749652/locations/us-central1/reasoningEngines/2102724178900680704" \--role=roles/monitoring.metricWriter

gcloud projects add-iam-policy-binding qwiklabs-gcp-04-60b25ef6bc01  \--member="principal://agents.global.org-616463121992.system.id.goog/resources/aiplatform/projects/754548749652/locations/us-central1/reasoningEngines/2102724178900680704" \--role=roles/telemetry.writer

`roles/telemetry.writer`

# Notes

08, 05 and 07.1 are independent and can start any time.

# \-- Rename \-- dependencies

[image1]: <data:image/png;base64,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+wUAKAlKRAJAxdqtTbuVf7JJADXSJoWWX47kyuVMg8O9bQJArZy2oeVX6ujRozb4+f3333tB8cOHD4f6iQKyM2fONO+995557bXXzIQJE+xFrIyMDDNx4kQ78trfX/f3799vPv30U1uOXyXYFaD199EIfK3ftGlT07hxY3PzzTebL774wpw8edImJ7h+Q4cOtW3utmrVKrue5ngP7qfjEgDmzZsXWjZlyhRvW5s2bYpZlpycbEeLa6T4119/bV566SX7+GrXco0e12NLjRo1QtsePXq0XebKdWo0j47lnnvusUH+N954w0yfPj0U4M4vAUDnbMGCBXakuqYw0HZ0gS04j+j48ePtc6L++lvP0SeffGK3Fzzv7du3t/vYr18/U6tWLfPII4/acvqZmZl2v0Rl9fWYL7/8ih1FH3w8qVatmjl79qx9zt54402bpFGunK/6RcSwYcNsgF770LlzZ/Pwww/bx9J5d331rxJPtEw3JaVMmzbNHkfwMf2CCQDZ2dne83rs2LGYvjpO97zp8XQO9bd7nbz44ov2vp6/4OMAAAAAV0K/pVevzQ0F/v3O3ncu8vs67/9AV9vlJgDot/WdZzVHanidYN+iQAIAAAAAAACJoUQkAEjD9GPRKgBLvzMVarUILb9UNdMb2+C/lK0aG8S9UrpQowCxbo8++qg3+voPf/hDqG9KSor54IMPvOCqu3300Uf2XyUPKGju+isQqzLuwdvvfvc7M2LECK+fm35AJds16tt/+81vfmMaNWpk+8V7bN06dOgQ2lenoAQAXYA7d+6cXa5+/mUKsKsygP+m0eRKfFDQWNUH3C0nJydmXQXKXX+3b3v27AltTzcFzf37Hy8BoEePHua7774LrBk937t37455bD2GvPvuu/bx/Tdto0+fPl5fVULQ7a9//av58ccfY/q+/PLLNknBf9PjHTx4MObxbrnlllD1CN10XO55k1//+te2/fz586HzoOQQJVYokSLe60X9/Y8Z5E8AUBKK259XX301psyqDB8+3Ntux44dzbhx47z7/puONfg4AAAAwJUYOiw9FPCPZ8+Bw3ETb6+Gy0kAqF27trnr7rtCwX4SAAAAAAAAwJUqMQkAlVI72wQAaZX9pknpnB3qUxgVm1UzdZd18IL/NUY3CfW5Ugpmu4DpmDFjbELA3/72N3tfI/39fe+++24vQKp5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EgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJCIAAAAAgLoEAAAAAJCIAAAAAADqEgAAAABAIgIAAAAAqEsAAAAAAIkIAAAAAKAuAQAAAAAkIgAAAACAugQAAAAAkIgAAAAAAOoSAAAAAEAiAgAAAACoSwAAAAAAiQgAAAAAoC4BAAAAACQiAAAAAIC6BAAAAACQiAAAAAAA6hIAAAAAQCICAAAAAKhLAAAAAACJCAAAAACgLgEAAAAAJHLhRZdMGvxfsGixAAAAAACKEAAAAABAMt+88OJmxRVXNhdfMr+54IILBAAAAABQhAAAAAAAkhMAAAAAQA0CAAAAAEhOAAAAAAA1CAAAAAAgOQEAAAAA1CAAAAAAgOQEAAAAAFCDAAAAAACSEwAAAABADQIAAAAASE4AAAAAADUIAAAAACA5AQAAAADUIAAAAACA5AQAAAAAUIMAAAAAAJITAAAAAEANAgAAAABITgAAAAAANQgAAAAAIDkBAAAAANQgAAAAAIDkBAAAAABQgwAAAAAAkhMAAAAAQA0CAAAAAEhOAAAAAAA1CAAAAAAgOQEAAAAA1CAAAAAAgOQEAAAAAFCDAAAAAACSEwAAAABADQIAAAAASE4AAAAAADUIAAAAACA5AQAAAADUIAAAAACA5AQAAAAAUIMAAAAAAJITAAAAAEANAgAAAABITgAAAAAANQgAAAAAIDkBAAAAANQgAAAAAIDkBAAAAABQgwAAAAAAkhMAAAAAQA0CAAAAAEhOAAAAAAA1CAAAAAAgOQEAAAAA1CAAAAAAgOQEAAAAAFCDAAAAAACSEwAAAABADQIAAAAASE4AAAAAADUIAAAAACA5AQAAAADUIAAAAACA5AQAAAAAUIMAAAAAAJITAAAAAEANAgAAAABITgAAAAAANQgAAAAAIDkBAAAAANQgAAAAAIDkBAAAAABQgwAAAAAAkhMAAAAAQA0CAAAAAEhOAAAAAAA1CAAAAAAgOQEAAAAA1CAAAAAAgOQEAAAAAFCDAAAAAACSEwAAAABADQIAAAAASE4AAAAAADUIAAAAACA5AQAAAADUIAAAAACA5AQAAAAAUIMAAAAAAJITAAAAAEANEQC8DgAAAOS1avXq17/yla8AAAAAyf1fjvhSjVpr1lwAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,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>