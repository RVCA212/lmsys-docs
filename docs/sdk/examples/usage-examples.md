---
sidebar_position: 1
---

# Usage Examples

This page provides comprehensive examples of using the LMSystems SDK in different scenarios.

## Basic Usage with PurchasedGraph

The simplest way to use a purchased graph within a LangGraph application:

```python
from lmsystems.purchased_graph import PurchasedGraph
from langgraph.graph import StateGraph, START, MessagesState
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define required state values (these will vary based on the graph you're using)
state_values = {
    "temperature": 0.7,
    "model": "gpt-4o"
}

# Instantiate the purchased graph
purchased_graph = PurchasedGraph(
    graph_name="your-graph-name",
    api_key=os.environ.get("LMSYSTEMS_API_KEY"),
    default_state_values=state_values
)

# Define your parent graph with MessagesState schema
builder = StateGraph(MessagesState)
builder.add_node("purchased_node", purchased_graph)
builder.add_edge(START, "purchased_node")
graph = builder.compile()

# Invoke with just messages (other state values are automatically included)
result = graph.invoke({
    "messages": [{"role": "user", "content": "Hello, how can you help me today?"}]
})
print(result)

# Stream outputs
for chunk in graph.stream({
    "messages": [{"role": "user", "content": "Hello, how can you help me today?"}]
}, subgraphs=True):
    print(chunk)
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
                "messages": [{"role": "user", "content": "Hello!"}],
                "temperature": 0.7,
                "model": "gpt-4"
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
                    {"role": "user", "content": "Hello!"}
                ],
                "temperature": 0.7,
                "model": "gpt-4"
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
                "accepted": True
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
                "accepted": True
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