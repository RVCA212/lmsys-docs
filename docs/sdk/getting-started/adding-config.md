---
sidebar_position: 2
---

# Adding Configuration to Your Graph

When selling your graph on our marketplace, you'll need to modify your LangGraph app to accept configuration values that can override environment variables. This enables buyers to use their own API keys while you maintain yours for testing and development.

## Introduction

The configuration system we'll help you implement has two key benefits:

- **Optional Configuration:** When config values aren't provided, your graph will default to using the environment variables set in your LangGraph Cloud deployment. This means your existing applications will continue to work exactly as they do now.

- **Seamless Integration:** Our SDK automatically and securely passes buyers' config values to your graph, ensuring their API keys are used instead of yours when they run the graph through our lmsystems sdk.

:::note
This guide is specifically for graphs hosted on LangGraph Cloud. If your graph is hosted with LMSystems, you don't need to implement this configuration system.
:::

## Selecting Environment Variables

First, identify which environment variables you want the buyer to handle:

- **LLM API Keys:** OpenAI API key, Anthropic API key, etc.
- **External Service Keys:** Database credentials, third-party API keys

💡 **Tip:** Consider which parts of your application would benefit from user customization. While API keys are the most common configuration values, you might also want to allow users to configure other aspects of your graph's behavior.

## How Configuration Works

Once implemented, you'll be able to pass configuration values to your graph like this:

```python
config = {
    "configurable": {
        "OPENAI_API_KEY": "sk-xxx"
    }
}

graph.invoke({"messages": [HumanMessage(content="hi")]}, config=config)
```

## Implementation Guide

### Step 1: Create configuration.py

In your LangGraph app directory, create a `configuration.py` file:

```python
from dataclasses import dataclass, fields
from typing import Any, Optional
import os
from langchain_core.runnables import RunnableConfig

@dataclass(kw_only=True)
class Configuration:
    """Configuration fields for the LangGraph app."""
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    # Add other configurable fields as needed

    @classmethod
    def from_runnable_config(
        cls, config: Optional[RunnableConfig] = None
    ) -> "Configuration":
        """Create a Configuration instance from a RunnableConfig."""
        configurable = (
            config["configurable"] if config and "configurable" in config else {}
        )

        # First check config, then environment variables
        values: dict[str, Any] = {
            f.name: configurable.get(f.name, os.environ.get(f.name.upper()))
            for f in fields(cls)
            if f.init
        }

        return cls(**{k: v for k, v in values.items() if v is not None})
```

💡 **Note:** The `Configuration` class will first check for values in the config passed by the buyer, then fall back to your environment variables if none are provided.

### Step 2: Update Your App

Modify your app code to use the configuration system:

```python
from .configuration import Configuration

def some_function(config: Optional[RunnableConfig] = None):
    # Get configuration instance
    config_instance = Configuration.from_runnable_config(config)

    # Access configuration values
    openai_api_key = config_instance.openai_api_key
    anthropic_api_key = config_instance.anthropic_api_key

    # Use the keys as needed in your app
    if openai_api_key:
        # Initialize OpenAI client
        pass
    elif anthropic_api_key:
        # Initialize Anthropic client
        pass
    else:
        raise ValueError("No API key provided.")
```

### Step 3: Environment Variables

Ensure your environment variables match your configuration field names (in uppercase). For example:
- Field: `openai_api_key` → Environment Variable: `OPENAI_API_KEY`
- Field: `anthropic_api_key` → Environment Variable: `ANTHROPIC_API_KEY`

## How Buyers Will Use It

Once implemented, buyers can override your default configurations by passing their own config when running your graph:

```python
config = {
    "configurable": {
        "openai_api_key": "their-api-key-here",
        "anthropic_api_key": "their-anthropic-key-here"
    }
}

# The config will be automatically passed to your graph
graph.invoke({"messages": [HumanMessage(content="hi")]}, config=config)
```

🔒 **Security Note:** This implementation ensures that sensitive information like API keys can be safely managed by both you and your buyers. When no config is provided, your environment variables will be used as fallbacks, but our SDK ensures that buyers always pass config so that yours are never used.

## Additional Resources

- [LangGraph Configuration Documentation](https://langchain-ai.github.io/langgraph/how-tos/configuration/)
- [Example Configuration Implementation](https://github.com/langchain-ai/langchain-academy/blob/main/module-6/deployment/configuration.py) from [LangChain Academy](https://academy.langchain.com/)