---
sidebar_position: 2
---

# PurchasedGraph

The `PurchasedGraph` class provides a way to integrate purchased marketplace graphs into your own LangGraph applications. It implements the `PregelProtocol`, making it compatible with LangGraph's `StateGraph` system.

## Overview

The `PurchasedGraph` class serves as a bridge between the LMSystems marketplace and your LangGraph applications. Key features include:

- **Seamless Integration**: Works as a node in any LangGraph `StateGraph`
- **State Management**: Built-in support for state persistence and history
- **Streaming Support**: Real-time streaming of graph execution results
- **Error Handling**: Comprehensive error handling with custom exceptions
- **Configuration**: Flexible runtime configuration options

## Constructor Parameters

```python
PurchasedGraph(
    graph_name: str,                                    # Name of the purchased graph
    api_key: str,                                       # Your LMSystems API key
    config: Optional[RunnableConfig] = None,            # Additional configuration
    default_state_values: Optional[dict] = None,        # Default values for required state parameters
    base_url: str = Config.DEFAULT_BASE_URL            # Base URL for the marketplace backend
)
```

### Parameter Details

- **graph_name**: The unique identifier of the graph from the marketplace
- **api_key**: Your LMSystems API key for authentication
- **config**: Optional runtime configuration (e.g., model parameters, temperature)
- **default_state_values**: Default values injected into every graph execution
- **base_url**: Custom marketplace API endpoint (rarely needed)

## Core Methods

### invoke

Synchronously execute the graph with input and optional configuration.

```python
def invoke(
    self,
    input: Union[dict[str, Any], Any],
    config: Optional[RunnableConfig] = None,
    *,
    interrupt_before: Optional[Union[All, Sequence[str]]] = None,
    interrupt_after: Optional[Union[All, Sequence[str]]] = None,
    **kwargs: Any
) -> Union[dict[str, Any], Any]
```

Example:
```python
result = graph.invoke(
    input={
        "messages": [{"role": "user", "content": "Your message"}],
        "temperature": 0.7
    },
    config={
        "configurable": {
            "max_tokens": 1000
        }
    }
)
```

### stream

Stream the graph execution results in real-time.

```python
def stream(
    self,
    input: Union[dict[str, Any], Any],
    config: Optional[RunnableConfig] = None,
    *,
    stream_mode: Optional[Union[str, list[str]]] = None,
    interrupt_before: Optional[Union[All, Sequence[str]]] = None,
    interrupt_after: Optional[Union[All, Sequence[str]]] = None,
    subgraphs: bool = False,
    **kwargs: Any
) -> Iterator[Any]
```

Example:
```python
for chunk in graph.stream(
    input={
        "messages": [{"role": "user", "content": "Your message"}]
    },
    stream_mode=["messages", "values", "updates"],
    subgraphs=True
):
    print(chunk)
```

### Async Methods

The class provides async versions of all core methods:

```python
# Async invoke
result = await graph.ainvoke(
    input={
        "messages": [{"role": "user", "content": "Your message"}]
    },
    config=None
)

# Async stream
async for chunk in graph.astream(
    input={
        "messages": [{"role": "user", "content": "Your message"}]
    },
    stream_mode=["messages"]
):
    print(chunk)
```

## State Management

### get_state

Retrieve the current state of the graph execution.

```python
state = graph.get_state(config, subgraphs=True)
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

Retrieve and filter the history of state changes.

```python
# Get full history
history = graph.get_state_history(
    config=config,
    filter=None,
    before=None,
    limit=None
)

# Get filtered history
filtered_history = graph.get_state_history(
    config=config,
    filter={"node": "specific_node"},
    limit=10
)
```

## Error Handling

The class provides comprehensive error handling through custom exceptions:

```python
from lmsystems import (
    AuthenticationError,  # Invalid API key
    GraphError,          # Graph execution issues
    InputError,          # Invalid input parameters
    APIError            # Backend communication issues
)

try:
    result = graph.invoke(input_data)
except AuthenticationError as e:
    print(f"Authentication failed: {e}")
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
   - Use descriptive node names when updating state
   - Monitor state history for debugging

2. **Configuration**
   - Store API keys in environment variables
   - Use configuration for runtime adjustments
   - Use appropriate configuration values for your use case

3. **Error Handling**
   - Implement comprehensive error handling
   - Log errors appropriately
   - Provide meaningful error messages
   - Handle all exception types

4. **Performance**
   - Use streaming for real-time updates
   - Implement appropriate timeouts
   - Monitor resource usage
   - Cache results when appropriate

5. **Security**
   - Never hardcode API keys
   - Use environment variables
   - Validate input data
   - Follow security best practices

## Advanced Usage

### Custom Configuration

```python
graph = PurchasedGraph(
    graph_name="your-graph",
    api_key="your-api-key",
    config={
        "configurable": {
            "temperature": 0.7,
            "max_tokens": 1000,
            "model": "gpt-4"
        }
    }
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