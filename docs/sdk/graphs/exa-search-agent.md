---
sidebar_position: 3
---

# Exa Search Agent Example

This guide demonstrates how to use the `exa-search-react-agent-61` graph for performing targeted web searches with domain filtering.

## Basic Usage

```python
from lmsystems import SyncLmsystemsClient, APIError
import os

# Initialize client with graph name
client = SyncLmsystemsClient(
    graph_name="exa-search-react-agent-61",
    api_key=os.environ.get("LMSYSTEMS_API_KEY")
)

def search_with_domains(query: str, domains: list[str]):
    try:
        # Create a new thread
        thread = client.threads.create()

        # Stream search results
        for chunk in client.stream_run(
            thread=thread,
            input={
                "messages": [
                    {"role": "user", "content": query}
                ],
                "include_domains": domains
            },
            stream_mode=["updates"]
        ):
            print(f"Search update: {chunk}")

        # Get final status
        final_status = client.get_thread_status(thread)
        print(f"Search completed with status: {final_status}")

    except APIError as e:
        print(f"Search failed: {str(e)}")

if __name__ == "__main__":
    search_with_domains(
        "How can I turn langgraph into an mcp server?",
        ["langchain.com", "langchain-ai.github.io"]
    )
```

## Input Parameters Guide

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `messages` | Yes | array | Array of message objects with `role` and `content` |
| `include_domains` | No | array | List of domains to restrict search to |
| `exclude_domains` | No | array | List of domains to exclude from search |
| `max_results` | No | integer | Maximum number of search results (default: 5) |

## Message Format

```python
messages = [
    {
        "role": "user",
        "content": "Your search query here"
    }
    # Can include multiple messages for context
]
```

### Error Handling

```python
from lmsystems import (
    AuthenticationError,
    InputError,
    GraphExecutionError
)

try:
    # Search execution code
except InputError as e:
    print(f"Invalid input parameters: {e}")
except AuthenticationError as e:
    print(f"Authentication failed: {e}")
except GraphExecutionError as e:
    print(f"Search failed at step {e.node_id}: {e}")
```

## Best Practices

1. **Domain Filtering**
   - Use `include_domains` to focus search on specific websites
   - Use `exclude_domains` to filter out unwanted sources
   - Combine both for precise control over search scope

2. **Stream Handling**
   ```python
   for chunk in client.stream_run(...):
       if "update" in chunk:
           # Process search progress updates
       elif "message" in chunk:
           # Handle search results
   ```

3. **Thread Management**
   ```python
   # Create new thread for each search session
   thread = client.threads.create()

   # Check thread status
   status = client.get_thread_status(thread)
   ```

4. **API Key Security**
   - Store API key in environment variables
   - Never hardcode API keys in your code
   ```python
   api_key = os.environ.get("LMSYSTEMS_API_KEY")
   ```