---
sidebar_position: 1
---

# GitHub Agent Example

This example demonstrates how to use the LMSystems SDK with our GitHub Agent graph, which can analyze GitHub repositories.

## Using PurchasedGraph

This approach shows how to use the GitHub Agent as a subgraph in a larger Langgraph application.

```python
from lmsystems.purchased_graph import PurchasedGraph
from langgraph.graph import StateGraph, START, MessagesState
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set required state values for github-agent-6
state_values = {
    "repo_url": "https://github.com/yourusername/yourrepo",
    "github_token": os.getenv("GITHUB_TOKEN"),
    "repo_path": "/path/to/repo"
}

# Initialize the purchased graph
purchased_graph = PurchasedGraph(
    graph_name="github-agent-6",
    api_key=os.environ.get("LMSYSTEMS_API_KEY"),
    default_state_values=state_values
)

# Create a parent graph with MessagesState schema
builder = StateGraph(MessagesState)
builder.add_node("github_agent", purchased_graph)
builder.add_edge(START, "github_agent")
graph = builder.compile()

# Invoke the graph
result = graph.invoke({
    "messages": [{"role": "user", "content": "What's this repo about?"}]
})
print(result)

# Stream outputs
for chunk in graph.stream({
    "messages": [{"role": "user", "content": "What's this repo about?"}]
}, subgraphs=True):
    print(chunk)
```

## Using LmsystemsClient

This approach shows how to use the GitHub Agent directly through the LmsystemsClient.

```python
from lmsystems.client import LmsystemsClient
from dotenv import load_dotenv
import os
import asyncio

async def analyze_repo():
    # Load environment variables
    load_dotenv()

    # Initialize the client
    client = await LmsystemsClient.create(
        graph_name="github-agent-6",
        api_key=os.environ["LMSYSTEMS_API_KEY"]
    )

    try:
        # Create a new thread
        thread = await client.create_thread()

        # Create and stream a run
        async for chunk in client.stream_run(
            thread,
            input={
                "messages": [{"role": "user", "content": "What's this repo about?"}],
                "repo_url": "https://github.com/yourusername/yourrepo",
                "github_token": os.environ["GITHUB_TOKEN"],
                "repo_path": "/path/to/repo"
            },
            stream_mode=["messages", "updates"]
        ):
            if "message" in chunk:
                print(f"Assistant: {chunk['message']['content']}")
            elif "update" in chunk:
                print(f"Status: {chunk['update']}")

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(analyze_repo())
```

## Advanced Usage: Interactive Analysis

This example shows how to use the GitHub Agent for interactive repository analysis with human feedback.

```python
from lmsystems.client import LmsystemsClient, MultitaskStrategy
import asyncio
import os
from dotenv import load_dotenv

async def interactive_analysis():
    load_dotenv()

    client = await LmsystemsClient.create(
        graph_name="github-agent-6",
        api_key=os.environ["LMSYSTEMS_API_KEY"]
    )

    try:
        thread = await client.create_thread()

        # Initial analysis
        async for chunk in client.stream_run(
            thread,
            input={
                "messages": [{"role": "user", "content": "Analyze this repository's architecture"}],
                "repo_url": "https://github.com/yourusername/yourrepo",
                "github_token": os.environ["GITHUB_TOKEN"],
                "repo_path": "/path/to/repo"
            },
            multitask_strategy=MultitaskStrategy.INTERRUPT,
            interrupt_before=["human_feedback"]
        ):
            print(chunk)

            # If we hit a point requiring human feedback
            if chunk.get("requires_input"):
                user_input = input("Your response: ")

                # Update thread state with user input
                client.update_thread_state(
                    thread,
                    state_update={
                        "messages": [{"role": "user", "content": user_input}],
                        "accepted": True
                    },
                    as_node="human_feedback"
                )

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(interactive_analysis())
```

## Error Handling

Here's an example of robust error handling when using the GitHub Agent:

```python
from lmsystems.client import LmsystemsClient
from lmsystems.exceptions import AuthenticationError, GraphError, InputError, APIError
import asyncio
import os
from dotenv import load_dotenv

async def robust_analysis():
    load_dotenv()

    try:
        client = await LmsystemsClient.create(
            graph_name="github-agent-6",
            api_key=os.environ["LMSYSTEMS_API_KEY"]
        )
    except AuthenticationError as e:
        print(f"Failed to authenticate: {e}")
        return
    except APIError as e:
        print(f"API Error: {e}")
        return

    try:
        thread = await client.create_thread()

        async for chunk in client.stream_run(
            thread,
            input={
                "messages": [{"role": "user", "content": "Analyze this repository"}],
                "repo_url": "https://github.com/yourusername/yourrepo",
                "github_token": os.environ["GITHUB_TOKEN"],
                "repo_path": "/path/to/repo"
            }
        ):
            if isinstance(chunk, dict):
                if "error" in chunk:
                    print(f"Error in stream: {chunk['error']}")
                    break
                elif "message" in chunk:
                    print(f"Assistant: {chunk['message']['content']}")
                elif "update" in chunk:
                    print(f"Status: {chunk['update']}")

    except GraphError as e:
        print(f"Graph execution error: {e}")
    except InputError as e:
        print(f"Invalid input: {e}")
    except APIError as e:
        print(f"API communication error: {e}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(robust_analysis())
```