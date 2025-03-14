# Introduction

MCP (Model Control Protocol) Servers allow you to turn any API into a hosted server. With an LMSystems account and a curl command for the API you want to use, you can create and host your own MCP server in seconds, with no coding required.

## How It Works

Creating an MCP server is quick and straightforward:

1. **Paste your curl command** - Add your API curl command as a single line in the editor. Include your API key if the server will be private.
2. **Create variables** - Add `{variable_name}` placeholders in your curl command for dynamic values users will provide.
3. **Set up [input and output schemas](#input-schema)** - Define your input and output schemas, then save. Your MCP server is now ready to use!

## What You Get

- Instant hosting of your API as an SSE MCP Server
- Private or public sharing options
- Works with any API that accepts curl commands
- No coding or backend setup required
- Full access with unlimited calls for $10/month

## Example: Perplexity API Server
Here's how we created the [Perplexity API](https://docs.perplexity.ai/api-reference/chat-completions?playground=open) server that's already available in our marketplace:

### Curl Command (Single Line)

```bash
curl --request POST --url https://api.perplexity.ai/chat/completions --header 'Authorization: Bearer <api-key-here>' --header 'Content-Type: application/json' --data '{"model": "sonar-deep-research", "messages": [{"role": "user", "content": "{user_message}"}], "stream": false}'
```

We added `{user_message}` as a variable that users can customize.

### Input Schema

```json
{
  "name": "Perplexity Search",
  "description": "Search the web using Perplexity AI with focus on langchain.com domain",
  "inputSchema": {
    "type": "object",
    "required": [
      "user_message"
    ],
    "properties": {
      "user_message": {
        "type": "string",
        "description": "Your question or search query"
      }
    }
  }
}
```

This schema defines the 'user_message' variable that will be inserted into the curl command.

## Input Schema Guide

Input schemas define the structure and requirements for inputs your MCP server expects. Properly defined schemas ensure that your API receives correctly formatted data.

### Enhanced Example with Default Values

Input schemas can include default values to simplify user interaction. Here's a comprehensive example:

```json
{
  "name": "Langchain Docs Agent",
  "description": "Langchain docs agent. Searches, answers questions, and provides examples from the Langchain documentation.",
  "inputSchema": {
    "type": "object",
    "required": ["user_message"],
    "properties": {
      "user_message": {
        "type": "string",
        "description": "Your question or search query"
      },
      "sources": {
        "type": "array",
        "default": ["langchain.com", "docs.langchain.com"],
        "description": "Domains to search, formatted without 'https://' or subdomains."
      }
    }
  }
}
```

In this schema:
- `user_message` is required.
- `sources` includes default values, so users don't have to specify this parameter unless they want different domains.

### Schema Structure

Input schemas should follow these guidelines:
- Clearly specify required fields.
- Include descriptive text for clarity.
- Use default values when appropriate to simplify API usage.

### Further Reading

To learn more about input schemas, tool definitions, and best practices, visit the [Model Context Protocol Documentation on Tools](https://modelcontextprotocol.io/docs/concepts/tools).

## Output Schema Guide

This guide explains how to format output schemas for the MCP server to properly parse API responses.

### Recommended Format: Field-Path Mapping

The recommended format uses explicit field paths to extract values from responses:

```json
{
  "output_fields": [
    {
      "name": "answer",
      "path": "choices.0.message.content",
      "default": "",
      "primary": true
    },
    {
      "name": "sources",
      "path": "citations",
      "default": []
    }
  ]
}
```

### Field-Path Mapping Properties

| Property | Description | Required |
|----------|-------------|----------|
| `name` | The name of the output field in the result | Yes |
| `path` | Path to the value in the response (dot notation) | Yes |
| `default` | Default value if path not found | No |
| `primary` | Set to `true` for the main field (for display) | No |
| `transform` | Transformation to apply to the value | No |

### Path Notation

The `path` property uses dot notation to navigate nested objects:

- `field.subfield` - Access nested object properties
- `array.0` - Access array element by index
- `array[-1]` - Access last element of an array
- `array[].field` - Extract field from all items in array

### Example: NPM Package Version

```json
{
  "output_fields": [
    {
      "name": "version",
      "path": "dist-tags.latest",
      "default": "",
      "primary": true
    },
    {
      "name": "description",
      "path": "description",
      "default": ""
    }
  ]
}
```

### Example: LLM Response

```json
{
  "output_fields": [
    {
      "name": "answer",
      "path": "choices.0.message.content",
      "default": "",
      "primary": true
    },
    {
      "name": "model",
      "path": "model",
      "default": "unknown"
    }
  ]
}
```

### Transformations

You can apply transformations to extracted values:

```json
{
  "output_fields": [
    {
      "name": "version_list",
      "path": "versions",
      "transform": "keys"
    },
    {
      "name": "latest_version",
      "path": "versions",
      "transform": "keys_sort_last",
      "primary": true
    }
  ]
}
```

#### Available Transformations

- `toString` - Convert to string
- `toInt` - Convert to integer
- `toFloat` - Convert to float
- `trim` - Trim whitespace
- `first` - Get first element of array
- `last` - Get last element of array
- `length` - Get length of array/string
- `join:separator` - Join array with separator (e.g., `join:,`)
- `keys` - Get object keys as array
- `keys_sort_last` - Get sorted object keys and take last one
- `keys_sort_first` - Get sorted object keys and take first one

### Alternative Format: JSONSchema

The system also supports JSONSchema format, but it's less flexible:

```json
{
  "type": "object",
  "required": ["version"],
  "properties": {
    "version": {
      "type": "string",
      "description": "The latest version of the package"
    }
  }
}
```

### Best Practices

1. **Always use field-path mapping** when possible
2. **Mark one field as primary** for display purposes
3. **Provide default values** for all fields
4. **Use descriptive field names** that make sense to users
5. **Test your schema** with sample responses
6. **Keep it simple** - extract only what's needed

### Working with jq Filters

When using curl commands with jq filters, the output schema will be applied to the filtered result:

```bash
curl ... && jq ".versions.keys"
```

With schema:
```json
{
  "output_fields": [
    {
      "name": "versions",
      "path": "",
      "primary": true
    }
  ]
}
```

The empty path (`""`) means "use the entire response" which will be the result of the jq filter.

## Best Practices

### API Key Security

For servers with sensitive API keys:
- Include your API keys directly in the curl command
- Keep your server private (default setting)
- For public servers, remove any private API keys

### Command Formatting

For optimal command processing:
- Format curl commands as a single line without indentation
- Use variable placeholders with `{name}` syntax
- Always set `"stream": false` for API endpoints

## Output Schema Prompt

Need help with your output schema? Use this prompt with ChatGPT to automatically generate the correct output schema for any API response:

```
Please modify this output schema:

[YOUR_OUTPUT_SCHEMA]

I would like to only return the fields 'x' and 'y'.

For reference, here's an example of how a schema was modified to only return specific fields:

Original Response:
{
  "id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "model": "sonar",
  "object": "chat.completion",
  "created": 1724369245,
  "citations": [
    "https://www.astronomy.com/science/astro-for-kids-how-many-stars-are-there-in-space/",
    "https://www.space.com/25959-how-many-stars-are-in-the-milky-way.html"
  ],
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": "The number of stars in the Milky Way galaxy is estimated to be between 100 billion and 400 billion stars."
      },
      "delta": {
        "role": "assistant",
        "content": ""
      }
    }
  ],
  "usage": {
    "prompt_tokens": 14,
    "completion_tokens": 70,
    "total_tokens": 84
  }
}

Output Schema:
{
  "output_fields": [
    {
      "name": "answer",
      "path": "choices.0.message.content",
      "default": ""
    },
    {
      "name": "sources",
      "path": "citations",
      "default": []
    }
  ]
}
```

## Getting Started

Ready to create your own MCP server? Visit the [MCP Servers page](/account/mcp-servers) to get started. The Perplexity API server is already available in our marketplace, and we'd love to see what you'll add next!

For just $10/month, you'll get full access to create, use, and distribute MCP servers with unlimited calls.

## Using MCP Servers in Agents

MCP servers can be easily integrated with LangChain and LangGraph to create powerful AI agents. This section shows you how to use MCP servers in your agent workflows.

### Installation

First, install the required packages:

```bash
pip install langchain-mcp-adapters langgraph langchain-openai

export OPENAI_API_KEY=<your_api_key>
```

### Example Usage

Here's an example of how to use LMSystems' MCP servers in an agent:

```python
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
import asyncio

async def main():
    model = ChatOpenAI(model="gpt-4o")

    async with MultiServerMCPClient(
        {
            "npm and pypi": {
                # Connect to the npm and pypi tools
                "url": "https://server.lmsystems.ai/sse?<lmsys-api-key>&cmd_id=50&cmd_id=51",
                "transport": "sse",
            }
        }
    ) as client:
        # Create a ReAct agent with the MCP tools
        agent = create_react_agent(model, client.get_tools())

        # Invoke the agent with a query
        test_response = await agent.ainvoke({"messages": "what's the latest version for lmsystems package on npm and pypi?"})
        print(test_response)  # Print the response

if __name__ == "__main__":
    asyncio.run(main())
```

In this example:
1. We initialize a ChatOpenAI model
2. We create a MultiServerMCPClient that connects to the npm and pypi tools via SSE
3. We create a ReAct agent using LangGraph's prebuilt agent and the MCP tools
4. We invoke the agent with a query asking about package versions

The agent will use the MCP tools to check the latest versions of the requested packages and return the results.

### Key Features

- **Easy Integration**: MCP servers integrate seamlessly with LangChain's tools system
- **Async Support**: Full support for async operations in modern agent frameworks
- **Multiple Tools**: Connect to multiple MCP tools in a single client
- **SSE Transport**: Efficient streaming events from the server

For more information about LangChain mcp adapters, visit the [langchain-mcp-adapters](https://github.com/langchain-ai/langchain-mcp-adapters).
