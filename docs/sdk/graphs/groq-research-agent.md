---
sidebar_position: 2
---

# Groq Deep Research Agent Example

This guide demonstrates how to use the `groq-deep-research-agent-51` graph for automated research tasks.

## Basic Usage

```python
from lmsystems import SyncLmsystemsClient, APIError
import os

# Initialize client with graph name
client = SyncLmsystemsClient(
    graph_name="groq-deep-research-agent-51",
    api_key=os.environ.get("LMSYSTEMS_API_KEY")
)

def basic_research(topic: str):
    try:
        # Create research thread
        thread = client.threads.create()

        # Stream research results
        for chunk in client.stream_run(
            thread=thread,
            input={
                "research_topic": topic
            },
            config={
                "configurable": {
                    "llm": "llama-3.1-8b-instant",
                    "groq_api_key": os.environ.get("GROQ_API_KEY"),
                    "tavily_api_key": os.environ.get("TAVILY_API_KEY"),
                    "max_web_research_loops": 3  # Optional
                }
            },
            stream_mode=["messages", "updates"]
        ):
            if "message" in chunk:
                print(f"New message: {chunk['message']['content']}")
            elif "update" in chunk:
                print(f"Research update: {chunk['update']}")

    except APIError as e:
        print(f"Research failed: {str(e)}")

if __name__ == "__main__":
    basic_research("AI safety alignment recent developments")
```

## Input Parameters Guide

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `research_topic` | Yes | string | Primary research subject |
| `search_query` | No | string | Custom search query (default: generated from topic) |
| `running_summary` | No | string | Initial summary for iterative research |
| `research_loop_count` | No | integer | Start from specific iteration count |
| `web_research_results` | No | array | Pre-existing research materials |

## Configuration Options

```python
config = {
    "configurable": {
        "llm": "",  # Required Groq model
        "groq_api_key": "your-groq-key",  # Required
        "tavily_api_key": "your-tavily-key",  # Required
        "max_web_research_loops": 5  # Optional (default: 3)
    }
}
```


### Error Handling

```python
from lmsystems import (
    AuthenticationError,
    InputError,
    GraphExecutionError
)

try:
    # Research execution code
except InputError as e:
    print(f"Missing required parameter: {e}")
except AuthenticationError as e:
    print(f"Check your API keys: {e}")
except GraphExecutionError as e:
    print(f"Research failed at step {e.node_id}: {e}")
```

## Best Practices

1. **API Keys**
   - Get Groq API key from [Groq Console](https://console.groq.com/keys)
   - Get Tavily key from [Tavily](https://app.tavily.com/home)
   - Never hardcode keys - use environment variables

2. **Stream Handling**
   ```python
   async for chunk in client.stream_run(...):
       if "message" in chunk:
           # Handle assistant messages
       elif "value" in chunk:
           # Track state changes like loop_count
       elif "update" in chunk:
           # Monitor research progress
   ```

3. **Model Selection**
   - Supported Groq models: I believe all models are supported (including deepseek-r1), although i've only tested llama and deepseek models.


4. **Result Processing**
   ```python
   final_state = client.get_thread_state(thread)
   print(f"Final summary: {final_state['running_summary']}")
   print(f"Sources used: {len(final_state['sources_gathered'])}")
   ```