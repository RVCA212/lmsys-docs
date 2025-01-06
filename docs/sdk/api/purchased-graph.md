---
sidebar_position: 2
---

# PurchasedGraph API

The `PurchasedGraph` class provides a way to integrate purchased marketplace graphs into your own LangGraph applications. It implements the `PregelProtocol`, making it compatible with LangGraph's `StateGraph` system.

## Basic Usage

```python
from lmsystems import PurchasedGraph
from langgraph.graph import StateGraph, START, MessagesState
import os

# Initialize the purchased graph
graph = PurchasedGraph(
    graph_name="your-graph",
    api_key="your-api-key",
    default_state_values={
        "required_param": "default_value"
    }
)

# Use in a StateGraph
builder = StateGraph(MessagesState)
builder.add_node("purchased_node", graph)
builder.add_edge(START, "purchased_node")
composed_graph = builder.compile()
```

## Constructor Parameters

- `graph_name` (str): Name of the purchased graph
- `api_key` (str): Your LMSystems API key
- `config` (Optional[RunnableConfig]): Additional configuration
- `default_state_values` (Optional[dict]): Default values for required state parameters
- `base_url` (str): Base URL for the marketplace backend
- `development_mode` (bool): Whether to run in development mode

## Core Methods

### invoke

Invoke the graph with input and optional configuration.

```python
result = graph.invoke(
    input={
        "messages": [{"role": "user", "content": "Your message"}],
        "other_param": "value"
    },
    config={
        "configurable": {
            "temperature": 0.7
        }
    }
)
```

### stream

Stream the graph execution results.

```python
for chunk in graph.stream(
    input={
        "messages": [{"role": "user", "content": "Your message"}]
    },
    config=None
):
    print(chunk)
```

### Async Methods

The class also provides async versions of core methods:

```python
# Async invoke
result = await graph.ainvoke(input_data, config=None)

# Async stream
async for chunk in graph.astream(input_data, config=None):
    print(chunk)
```

## State Management

### get_state

Get the current state of the graph execution.

```python
state = graph.get_state(config, subgraphs=False)
```

### update_state

Update the state during graph execution.

```python
new_config = graph.update_state(
    config=config,
    values={"key": "value"},
    as_node="node_name"
)
```

### get_state_history

Retrieve the history of state changes.

```python
history = graph.get_state_history(
    config=config,
    filter={"node": "specific_node"},
    limit=10
)
```

## Error Handling

The PurchasedGraph class provides comprehensive error handling:

```python
from lmsystems import (
    AuthenticationError,  # Invalid API key
    GraphError,          # Graph execution issues
    InputError,          # Invalid input parameters
    APIError            # Backend communication issues
)

try:
    result = graph.invoke(input_data)
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

1. **State Management**
   - Use `default_state_values` for commonly required parameters
   - Keep state updates atomic and focused
   - Use appropriate node names when updating state

2. **Configuration**
   - Store sensitive values in environment variables
   - Use configuration for runtime adjustments
   - Keep development_mode off in production

3. **Error Handling**
   - Implement comprehensive error handling
   - Log errors appropriately
   - Provide meaningful error messages to users

4. **Performance**
   - Use streaming for real-time updates
   - Implement appropriate timeouts
   - Monitor resource usage

## Advanced Usage

### Custom Configuration

```python
graph = PurchasedGraph(
    graph_name="your-graph",
    api_key="your-api-key",
    config={
        "configurable": {
            "temperature": 0.7,
            "max_tokens": 1000
        }
    },
    development_mode=True
)
```

### State History Management

```python
# Get full state history
history = graph.get_state_history(
    config=config,
    filter=None,
    before=None,
    limit=None
)

# Filter state history
filtered_history = graph.get_state_history(
    config=config,
    filter={"node": "specific_node"},
    before=some_config,
    limit=10
)
```

### Async State Management

```python
# Async state retrieval
state = await graph.aget_state(config, subgraphs=True)

# Async state history
history = await graph.aget_state_history(
    config=config,
    filter={"node": "specific_node"}
)

# Async state update
new_config = await graph.aupdate_state(
    config=config,
    values=new_values,
    as_node="node_name"
)
```