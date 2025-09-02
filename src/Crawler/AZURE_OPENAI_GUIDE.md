# Azure OpenAI Configuration Guide

This document explains how to configure the OpenAiClient to work with Azure OpenAI services.

## Overview

The OpenAiClient now supports both standard OpenAI and Azure OpenAI endpoints with automatic detection and appropriate authentication.

## Configuration Options

### Standard OpenAI (existing behavior)

```json
{
  "llm": {
    "provider": "openai",
    "model": "gpt-5-mini"
  }
}
```

Uses:
- Endpoint: `https://api.openai.com/v1/`
- Authentication: `Authorization: Bearer {apiKey}`
- API Path: `chat/completions`

### Azure OpenAI (new feature)

```json
{
  "llm": {
    "provider": "openai",
    "model": "gpt-5-mini",
    "endpoint": "https://your-resource-name.cognitiveservices.azure.com",
    "deploymentName": "gpt-5-mini"
  }
}
```

Uses:
- Endpoint: Your Azure OpenAI resource endpoint
- Authentication: `api-key: {apiKey}`
- API Path: `openai/deployments/{deploymentName}/chat/completions?api-version=2024-02-15-preview`

## Authentication Setup

### For Standard OpenAI
Set the API key via environment variable or configuration:
```bash
export OPENAI_API_KEY="your-openai-api-key"
```

### For Azure OpenAI
Set the API key via environment variable or configuration:
```bash
export OPENAI_API_KEY="your-azure-openai-api-key"
```

## Example Configurations

### Complete Azure OpenAI Configuration
See `appsettings.azure-openai.json` for a complete example:

```json
{
  "timeframe": "monthly",
  "output": {
    "dataFile": "data/items.jsonl",
    "contentDir": "content/updates2"
  },
  "state": {
    "processedFile": "state/processed.json"
  },
  "fetch": {
    "timeoutSeconds": 20,
    "userAgent": "rss-crawler/1.0",
    "maxAgeDays": 7
  },
  "llm": {
    "provider": "openai",
    "model": "gpt-5-mini",
    "maxCallsPerRun": 80,
    "minCharsToSummarize": 500,
    "requestsPerWindow": 3,
    "windowSeconds": 60,
    "initialDelaySeconds": 2,
    "endpoint": "https://your-resource-name.cognitiveservices.azure.com",
    "deploymentName": "gpt-5-mini"
  },
  "feeds": {
    "dataFile": "feed-config/feeds.json"
  }
}
```

## How It Works

1. **Auto-Detection**: The client automatically detects Azure OpenAI when the endpoint contains `cognitiveservices.azure.com`
2. **Authentication**: Uses the appropriate authentication method based on the endpoint type
3. **API Paths**: Constructs the correct API path for the service type
4. **Backward Compatibility**: Existing configurations continue to work without changes

## Azure OpenAI Resource Setup

To use Azure OpenAI, you need:

1. An Azure OpenAI resource deployed in Azure
2. A model deployment (e.g., "gpt-5-mini")
3. The endpoint URL from your resource
4. An API key from your resource

The endpoint URL format is typically:
`https://{resource-name}.cognitiveservices.azure.com`

## Troubleshooting

- Ensure your endpoint URL includes the full Azure domain
- Verify your deployment name matches exactly what's configured in Azure
- Check that your API key has the necessary permissions
- Make sure the API version is supported by your Azure OpenAI service