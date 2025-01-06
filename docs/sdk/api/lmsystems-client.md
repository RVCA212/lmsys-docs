---
sidebar_position: 1
---

# LmsystemsClient API

The LMSystems SDK provides two client implementations: `LmsystemsClient` (async) and `SyncLmsystemsClient` (sync). Both offer the same functionality with different execution models.

## Client Types

### Async Client (LmsystemsClient)

```python
from lmsystems import LmsystemsClient

# Initialize client
client = await LmsystemsClient.create(
    graph_name="your-graph",
    api_key="your-api-key"
)
```

### Sync Client (SyncLmsystemsClient)

```python
from lmsystems import SyncLmsystemsClient

# Initialize client
client = SyncLmsystemsClient(
    graph_name="your-graph",
    api_key="your-api-key"
)
```

## Core Concepts

### Thread Management

Threads are the primary way to manage conversation state and execution context. Each thread maintains its own:
- Message history
- Execution state
- Configuration settings

### Stream Modes

The SDK supports different streaming modes for real-time updates:
- `messages`: Stream message updates from the graph
- `values`: Stream value updates from graph nodes
- `updates`: Stream general state updates
- `custom`: Stream custom-defined updates

### Multitask Strategies

Control how concurrent tasks are handled:
- `REJECT`: Reject new tasks if thread is busy
- `ROLLBACK`: Roll back current task and start new one
- `INTERRUPT`: Pause current task for human interaction
- `ENQUEUE`: Queue new tasks to run after current one

## Key Methods

### Thread Operations

```python
# Create a new thread
thread = await client.create_thread()  # async
thread = client.threads.create()       # sync

# Get thread status
status = await client.get_thread_status(thread)  # async
status = client.get_thread_status(thread)        # sync

# Get thread state
state = await client.get_thread_state(thread)    # async
state = client.get_thread_state(thread)          # sync
```

### Running Graphs

```python
# Stream run (recommended approach)
async for chunk in client.stream_run(  # async
    thread=thread,
    input={
        "messages": [{"role": "user", "content": "Your message"}],
        "other_params": "value"
    },
    stream_mode=["messages", "updates"],
    multitask_strategy="reject"
):
    print(chunk)

# Sync version
for chunk in client.stream_run(  # sync
    thread=thread,
    input={...},
    stream_mode=["messages", "updates"]
):
    print(chunk)
```

### Handling Interruptions

```python
# Update state for interrupted thread
updated_state = await client.update_thread_state(  # async
    thread=thread,
    state_update={
        "messages": [{"role": "user", "content": "continue"}],
        "accepted": True
    },
    as_node="human_interaction"
)

# Resume from checkpoint
async for chunk in client.stream_run(
    thread=thread,
    input=None,
    checkpoint_id=updated_state["checkpoint_id"]
):
    print(chunk)
```

## Error Handling

The SDK provides custom exceptions for different error scenarios:

```python
from lmsystems import (
    LmsystemsError,      # Base exception
    AuthenticationError, # Authentication issues
    GraphError,         # Graph-related issues
    InputError,         # Invalid input
    APIError           # API communication issues
)

try:
    async for chunk in client.stream_run(...):
        print(chunk)
except AuthenticationError:
    print("Authentication failed")
except GraphError as e:
    print(f"Graph error: {e}")
except InputError as e:
    print(f"Invalid input: {e}")
except APIError as e:
    print(f"API error: {e}")
```

## Best Practices

1. **Use Environment Variables**: Store API keys securely in environment variables
2. **Prefer Streaming**: Use `stream_run` over separate create/run operations
3. **Handle Interruptions**: Implement proper handling for interrupted graphs
4. **Error Handling**: Always implement comprehensive error handling
5. **Thread Management**: Reuse threads for related conversations
6. **State Management**: Use `update_thread_state` for complex state updates

## Advanced Usage

### Custom Configuration

```python
client = await LmsystemsClient.create(
    graph_name="your-graph",
    api_key="your-api-key",
    base_url="custom-url",  # Custom API endpoint
)
```

### Background Tasks

```python
# Run in background with is_background=True
async for chunk in client.stream_run(
    thread=thread,
    input={...},
    is_background=True
):
    print(chunk)
```

### State History

```python
# Get state history
history = await client.get_state_history(
    thread=thread,
    filter={"node": "specific_node"},
    limit=10
)
```