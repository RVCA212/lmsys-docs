---
sidebar_position: 1
---

# Usage Examples

This page provides comprehensive examples of using the LMSystems SDK in different scenarios.

## Basic Usage with PurchasedGraph

The `PurchasedGraph` class allows you to integrate purchased marketplace graphs into your LangGraph applications. Here's a complete example:

```python
from lmsystems.purchased_graph import PurchasedGraph
from langgraph.graph import StateGraph, START, MessagesState
import os
from dotenv import load_dotenv
import logging

def main():

    # Load environment variables
    load_dotenv()

    # Initialize our Purchased Graph
    purchased_graph = PurchasedGraph(
        # Input Graph ID here
        graph_name="github-agent-48",
        api_key=os.getenv("LMSYSTEMS_API_KEY"),

        # Each graph has unique state values:
        default_state_values={
            "repo_url": "https://github.com/RVCA212/lmsys-docs",
            "github_token": os.getenv("GITHUB_TOKEN"),
            "repo_path": "users/152343",
            "branch_name": "stream-test",
            "model_name": "gpt-4o-mini"
        }
    )

    # Create parent graph and add our purchased graph as a node
    builder = StateGraph(MessagesState)
    builder.add_node("purchased_node", purchased_graph)
    builder.add_edge(START, "purchased_node")
    graph = builder.compile()

    # Use the parent graph - invoke
    # result = graph.invoke({
    #     "messages": [{"role": "user", "content": "analyze the code structure"}]
    # })
    # print("Parent graph result:", result)

    # Use the parent graph - stream
    for chunk in graph.stream({
        "messages": [{"role": "user", "content": "hello"}]
    }, subgraphs=True):  # Include outputs from our purchased graph
        print("Stream chunk:", chunk)

if __name__ == "__main__":
    main()


```

### Error Handling with PurchasedGraph

Here's how to properly handle errors when using PurchasedGraph:

```python
from lmsystems import (
    PurchasedGraph,
    AuthenticationError,
    GraphError,
    InputError,
    APIError
)

try:
    # Initialize graph
    graph = PurchasedGraph(
        graph_name="your-graph-name",
        api_key=os.environ.get("LMSYSTEMS_API_KEY")
    )

    # Use the graph
    result = graph.invoke({
        "messages": [{"role": "user", "content": "Hello"}]
    })

except AuthenticationError as e:
    print(f"Authentication failed: {e}")
    # Handle invalid API key
except GraphError as e:
    print(f"Graph execution error: {e}")
    # Handle graph-specific errors
except InputError as e:
    print(f"Invalid input: {e}")
    # Handle invalid parameters
except APIError as e:
    print(f"API error: {e}")
    # Handle communication issues
```

### State Management with PurchasedGraph

Example of managing state during graph execution:

```python
# Initialize graph with default state
graph = PurchasedGraph(
    graph_name="your-graph-name",
    api_key=os.environ.get("LMSYSTEMS_API_KEY"),
    default_state_values={
        "system_prompt": "You are a helpful assistant",
        "temperature": 0.7
    }
)

# Get current state
state = graph.get_state(config, subgraphs=True)
print("Current state:", state)

# Update state during execution
new_config = graph.update_state(
    config=config,
    values={
        "system_prompt": "You are a coding assistant",
        "temperature": 0.9
    },
    as_node="configuration_node"
)

# Get state history with filtering
history = graph.get_state_history(
    config=config,
    filter={"node": "specific_node"},
    before=some_config,
    limit=10
)
```

## Async Client Usage

Using the async client for real-time streaming:

```python
from lmsystems.client import LmsystemsClient
from dotenv import load_dotenv
import os
import asyncio

# Load environment variables
load_dotenv()

async def main():
    # Initialize client
    client = await LmsystemsClient.create(
        graph_name="your-graph-name",
        api_key=os.environ.get("LMSYSTEMS_API_KEY")
    )

    try:
        # Create thread and stream results
        thread = await client.create_thread()

        async for chunk in client.stream_run(
            thread=thread,
            input={
                "messages": [{"role": "user", "content": "What's the weather right now?"}],
                "city": "Seattle",
                "state": "WA",
            },
            stream_mode=["messages"]
        ):
            print(chunk)

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
```

## Sync Client Usage

Using the synchronous client for simpler applications:

```python
from lmsystems import (
    SyncLmsystemsClient,
    MultitaskStrategy,
    ThreadStatus,
    APIError
)
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def main():
    # Initialize client
    client = SyncLmsystemsClient(
        graph_name="your-graph-name",
        api_key=os.environ.get("LMSYSTEMS_API_KEY")
    )

    try:
        # Create thread
        thread = client.threads.create()
        print(f"Created thread with status: {client.get_thread_status(thread)}")

        # Stream the run
        for chunk in client.stream_run(
            thread=thread,
            input={
                "messages": [
                    {"role": "user", "content": "What's the weather right now?"}
                ],
                "city": "Seattle",
                "state": "WA",
            },
            stream_mode=["messages", "updates"],
            multitask_strategy=MultitaskStrategy.REJECT
        ):
            print(f"Received chunk: {chunk}")

        # Check final status
        final_status = client.get_thread_status(thread)
        print(f"Final thread status: {final_status}")

    except APIError as e:
        print(f"API Error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    main()
```

## Handling Interrupted Graphs (Async)

Example of handling and resuming interrupted graph execution:

```python
from lmsystems import (
    LmsystemsClient,
    MultitaskStrategy,
    ThreadStatus,
    APIError
)
from dotenv import load_dotenv
import os
import asyncio

async def main():
    # Initialize client
    client = await LmsystemsClient.create(
        graph_name="your-graph-name",
        api_key=os.environ.get("LMSYSTEMS_API_KEY")
    )

    try:
        # Use existing thread ID
        thread = {"thread_id": "your-thread-id"}

        # Verify interrupted state
        status = await client.get_thread_status(thread)
        print(f"Current thread status: {status}")

        if status != ThreadStatus.INTERRUPTED:
            raise APIError("Thread is not in interrupted state")

        # Get current state
        current_state = await client.get_thread_state(thread)
        print("Current thread state:", current_state)

        # Update state to resume
        updated_state = await client.update_thread_state(
            thread=thread,
            state_update={
                "messages": [
                    {"role": "user", "content": "continue"}
                ],
            },
            as_node="human_interaction"
        )

        # Resume from checkpoint
        async for chunk in client.stream_run(
            thread=thread,
            input=None,
            checkpoint_id=updated_state["checkpoint_id"],
            stream_mode=["messages", "updates"]
        ):
            print(f"Received chunk: {chunk}")

        # Check final status
        final_status = await client.get_thread_status(thread)
        print(f"Final thread status: {final_status}")

    except APIError as e:
        print(f"API Error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
```

## Handling Interrupted Graphs (Sync)

Synchronous version of handling interrupted graphs:

```python
from lmsystems import (
    SyncLmsystemsClient,
    MultitaskStrategy,
    ThreadStatus,
    APIError
)
from dotenv import load_dotenv
import os

def main():
    # Initialize client
    client = SyncLmsystemsClient(
        graph_name="your-graph-name",
        api_key=os.environ.get("LMSYSTEMS_API_KEY")
    )

    try:
        # Use existing thread
        thread = {"thread_id": "your-thread-id"}

        # Verify interrupted state
        status = client.get_thread_status(thread)
        print(f"Current thread status: {status}")

        if status != ThreadStatus.INTERRUPTED:
            raise APIError("Thread is not in interrupted state")

        # Get and update state
        current_state = client.get_thread_state(thread)
        print("Current thread state:", current_state)

        updated_state = client.update_thread_state(
            thread=thread,
            state_update={
                "messages": [
                    {"role": "user", "content": "continue"}
                ],
            },
            as_node="human_interaction"
        )

        # Resume execution
        for chunk in client.stream_run(
            thread=thread,
            input=None,
            checkpoint_id=updated_state["checkpoint_id"],
            stream_mode=["messages", "updates"]
        ):
            print(f"Received chunk: {chunk}")

        # Check final status
        final_status = client.get_thread_status(thread)
        print(f"Final thread status: {final_status}")

    except APIError as e:
        print(f"API Error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    main()
```

## Best Practices

1. **Environment Variables**
   - Always use environment variables for sensitive information
   - Use `python-dotenv` for local development
   - Keep API keys and tokens secure

2. **Error Handling**
   - Implement comprehensive try-except blocks
   - Handle specific exceptions appropriately
   - Provide meaningful error messages

3. **State Management**
   - Check thread status before operations
   - Handle interruptions gracefully
   - Use appropriate multitask strategies

4. **Streaming**
   - Use streaming for real-time updates
   - Choose appropriate stream modes
   - Handle streaming errors properly
