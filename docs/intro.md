---
sidebar_position: 1
---

# Introduction

## Quick Start

### Use a Graph as a Subgraph in a new Langgraph app
- [Basic Usage with PurchasedGraph](/docs/sdk/examples/usage-examples#basic-usage-with-purchasedgraph)

### Use a Graph on its own
- [Sync Client Usage](/docs/sdk/examples/usage-examples#sync-client-usage)
- [Async Client Usage](/docs/sdk/examples/usage-examples#async-client-usage)

### Human-in-the-Loop
- [Handling Interrupted Graphs](/docs/sdk/examples/usage-examples#handling-interrupted-graphs-async)

---

## Overview

The LMSystems SDK provides two main ways to work with graphs from the LMSystems marketplace:

### PurchasedGraph

Use this when you want to integrate a purchased graph as a subgraph within a new Langgraph application. This is ideal for:
- Building larger, composite applications that incorporate marketplace graphs as components
- Direct integration with LangGraph's StateGraph system
- Full control over graph execution and state management
- Custom configuration and state value management

### LmsystemsClient

Use this for direct, standalone usage of purchased graphs. Available in both async (`LmsystemsClient`) and sync (`SyncLmsystemsClient`) versions, this provides:
- Simple, high-level interface for graph execution
- Built-in thread management and state handling
- Streaming support for real-time updates
- Automatic error handling and retries
- Support for interrupted graph resumption
- Background task management

## Key Features

- **Async/Sync Support**: Choose between async and sync clients based on your needs
- **Streaming**: Real-time streaming of graph execution results
- **State Management**: Sophisticated thread and state management capabilities
- **Error Handling**: Comprehensive error handling with custom exceptions
- **Configurability**: Flexible configuration options for graphs and execution
- **Interruption Handling**: Support for handling and resuming interrupted graph executions

## Quick Links

- [Getting Started](./sdk/getting-started/installation.md)
- [API Reference](./sdk/api/lmsystems-client.md)
- [Examples](./sdk/examples/usage-examples.md)
- [GitHub Repository](https://github.com/LMSystems-ai/lmsystems-sdk)
- [GitHub Agent](/docs/sdk/graphs/github-agent)

## Installation

```bash
pip install lmsystems
```

## Authentication

To use the SDK, you'll need an LMSystems API key. Get your API key by:

1. Creating an account at [LMSystems](https://www.lmsystems.ai)
2. Navigating to your account settings
3. Generating an API key

Store your API key securely using environment variables:

```bash
export LMSYSTEMS_API_KEY="your-api-key"
```

Or use a `.env` file with the `python-dotenv` package:

```bash
# .env
LMSYSTEMS_API_KEY="your-api-key"
```