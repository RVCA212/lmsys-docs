---
sidebar_position: 1
---

# Installation Guide

This guide will help you get started with the LMSystems SDK.

## Requirements

- Python 3.7 or higher
- pip package manager
- A LMSystems account and API key

## Installation Steps

### 1. Install the SDK

Install the LMSystems SDK using pip:

```bash
pip install lmsystems
```

### 2. Set Up Authentication

Get your API key from the LMSystems marketplace:

1. Create an account at [LMSystems](https://www.lmsystems.ai)
2. Navigate to your account settings
3. Generate a new API key

### 3. Configure Environment Variables

Store your API key securely using environment variables:

```bash
export LMSYSTEMS_API_KEY="your-api-key"
```

For local development, you can use a `.env` file with the `python-dotenv` package:

```bash
# Install python-dotenv
pip install python-dotenv

# Create .env file
echo "LMSYSTEMS_API_KEY=your-api-key" > .env
```

Then in your code:

```python
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env
api_key = os.getenv("LMSYSTEMS_API_KEY")
```

## Verify Installation

You can verify your installation by running this simple test (make sure you have access to the graph you're trying to connect to):

```python
from lmsystems.client import SyncLmsystemsClient

client = SyncLmsystemsClient(
    graph_name="github-agentz-6",  # Replace with a graph you have access to
    api_key=LMSystems_API_KEY
)
```

> **Note:** You must have access to the specified graph to successfully connect. If you receive a permission error, verify that:
> 1. You have purchased or been granted access to the graph
> 2. Your API key is valid
> 3. The graph name is correct

## Dependencies

The SDK has the following key dependencies:

- `httpx`: For HTTP requests
- `pyjwt`: For token handling
- `langgraph`: For graph execution
- `python-dotenv`: For environment variable management (recommended)

These will be installed automatically when you install the SDK.

## Next Steps

Now that you have installed the SDK, you can:

1. Learn about the [LmsystemsClient API](../api/lmsystems-client.md)
2. Explore the [PurchasedGraph API](../api/purchased-graph.md)
3. Check out our [usage examples](../examples/usage-examples.md)

## Troubleshooting

### Common Installation Issues

1. **Python Version**
   ```bash
   # Check your Python version
   python --version
   ```
   Make sure you're using Python 3.7 or higher.

2. **Pip Installation**
   ```bash
   # Upgrade pip
   python -m pip install --upgrade pip
   ```

3. **Virtual Environment**
   It's recommended to use a virtual environment:
   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate it (Unix/macOS)
   source venv/bin/activate

   # Activate it (Windows)
   .\venv\Scripts\activate

   # Install SDK in virtual environment
   pip install lmsystems
   ```

### Getting Help

If you encounter any issues:

1. Check our [GitHub repository](https://github.com/LMSystems-ai/Github-Agent)
2. Join our [Discord community](https://discord.gg/lmsystems)
3. Contact support at support@lmsystems.ai