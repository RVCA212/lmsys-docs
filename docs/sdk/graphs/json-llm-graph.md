---
sidebar_position: 3
---

# JSON Structure Extraction Example

This guide demonstrates usage of the `json-llm-50` graph for structured data extraction from text.

## Basic Usage

```python
from lmsystems import SyncLmsystemsClient, APIError, MultitaskStrategy
import os

def extract_structured_data(text: str, schema: list):
    client = SyncLmsystemsClient(
        graph_name="json-llm-50",
        api_key=os.environ.get("LMSYSTEMS_API_KEY")
    )

    try:
        thread = client.threads.create()

        for chunk in client.stream_run(
            thread=thread,
            input={
                "text": text,  # Required
                "schema_definition": schema,  # Required
                "error": "",  # Optional error from previous attempts
                "result": ""  # Optional previous result
            },
            stream_mode=["messages", "updates"],
            multitask_strategy=MultitaskStrategy.REJECT
        ):
            if "message" in chunk:
                print(f"Processing: {chunk['message']['content']}")
            elif "update" in chunk:
                print(f"Status: {chunk['update']}")

    except APIError as e:
        if "Thread is busy" in str(e):
            print("Resource conflict - try again later")
        else:
            raise

# Example schema for person data
PERSON_SCHEMA = [
    {
        "properties": {
            "name": {"type": "string", "description": "Full name"},
            "age": {"type": "integer", "description": "Current age"},
            "skills": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Technical skills"
            },
            "experience_years": {
                "type": "integer",
                "description": "Years of professional experience"
            }
        },
        "required": ["name", "age", "skills"],
        "additionalProperties": False
    }
]

if __name__ == "__main__":
    sample_text = """Alex is a 28-year-old software engineer with 5 years of experience.
                   Primary skills include Python, JavaScript, and cloud infrastructure."""
    extract_structured_data(sample_text, PERSON_SCHEMA)
```

## Input Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `text` | Yes | string | Input text to analyze |
| `schema_definition` | Yes | array | JSON schema definition |
| `error` | No | string | Previous processing error |
| `result` | No | string | Previous processing result |

## Advanced Usage

```python
from lmsystems import ThreadBusyError

def batch_process(texts: list, schema: list):
    client = SyncLmsystemsClient(
        graph_name="json-llm-50",
        api_key=os.environ.get("LMSYSTEMS_API_KEY")
    )

    results = []
    threads = []

    for text in texts:
        try:
            thread = client.threads.create()
            threads.append(thread)

            for chunk in client.stream_run(
                thread=thread,
                input={
                    "text": text,
                    "schema_definition": schema
                },
                stream_mode=["messages"],
                multitask_strategy=MultitaskStrategy.REJECT
            ):
                if "message" in chunk:
                    results.append(chunk['message']['content'])

        except ThreadBusyError:
            print(f"Skipping busy thread for text: {text[:50]}...")
        except APIError as e:
            print(f"Processing failed: {str(e)}")

    return results
```

## Error Handling

```python
from lmsystems import (
    InputError,
    SchemaValidationError,
    ThreadBusyError
)

try:
    # Extraction code
except InputError as e:
    print(f"Missing required field: {e}")
except SchemaValidationError as e:
    print(f"Invalid schema: {e.details}")
except ThreadBusyError:
    print("Thread is currently processing another request")
except APIError as e:
    print(f"API communication error: {str(e)}")
```

## Best Practices

1. **Schema Design**
   ```python
   # Good schema example
   PRODUCT_SCHEMA = [
       {
           "properties": {
               "name": {"type": "string"},
               "price": {"type": "number"},
               "features": {
                   "type": "array",
                   "items": {"type": "string"}
               }
           },
           "required": ["name", "price"],
           "additionalProperties": False
       }
   ]
   ```

2. **Stream Processing**
   ```python
   # Efficient stream handling
   for chunk in client.stream_run(...):
       if "message" in chunk:
           handle_message(chunk['message'])
       elif "value" in chunk:
           update_state(chunk['value'])
       elif "update" in chunk:
           log_progress(chunk['update'])
   ```

3. **Multitask Strategies**
   - `REJECT`: Immediately reject concurrent requests (default)
   - `QUEUE`: Process requests sequentially
   - `PARALLEL`: Allow limited parallel execution

4. **Result Validation**
   ```python
   import json

   def validate_result(result: str, schema: dict):
       try:
           data = json.loads(result)
           # Add validation logic here
           return True
       except json.JSONDecodeError:
           return False
   ```

## Performance Tips

1. **Schema Optimization**
   - Use clear property descriptions
   - Order properties by importance
   - Limit array sizes where possible

2. **Error Recovery**
   ```python
   def retry_processing(text, schema, retries=3):
       attempt = 0
       while attempt < retries:
           try:
               return process_text(text, schema)
           except SchemaValidationError as e:
               print(f"Attempt {attempt+1} failed: {e}")
               attempt += 1
       return None
   ```

3. **Batch Processing**
   ```python
   from concurrent.futures import ThreadPoolExecutor

   with ThreadPoolExecutor(max_workers=4) as executor:
       futures = [
           executor.submit(process_text, text, schema)
           for text in text_batch
       ]
       results = [f.result() for f in futures]
   ```