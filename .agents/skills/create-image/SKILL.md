---
description: Generate images using Azure OpenAI GPT Image models. Use this skill when the user asks to create images, generate visuals, or produce artwork using AI.
license: MIT
metadata:
    github-path: skills/create-image
    github-ref: refs/tags/v1.9.0
    github-repo: https://github.com/sujithq/skills
    github-tree-sha: e127627414a7b0b5d250ff91e32a4af401a5f791
    github-commit-sha: de17fc6ae58a0c6f1ce428d7fa9edb0d3afa308e
    version: v1.9.0
name: create-image
---
# Image Generation with Azure OpenAI

This skill generates images using Azure OpenAI GPT Image models through direct API calls.

## When to use

- User asks to generate, create, or produce an image
- User wants to visualize a concept or idea
- User requests artwork, illustrations, or graphics
- User asks to create visual representations of descriptions

## Prerequisites

User must have:
1. Azure OpenAI resource with deployed GPT Image model (`gpt-image-2` or `gpt-image-1.5`)
2. Azure authentication configured:
   - **Recommended**: Azure CLI (`az login`) with "Cognitive Services OpenAI User" role
   - **Alternative**: API key (if enabled on the endpoint)

**Important**: Many Azure OpenAI endpoints disable API key authentication. Always use Azure RBAC when API keys are disabled.

## How to use

### Using Python

Install required packages:
```bash
pip install openai azure-identity
```

Generate image with Azure RBAC (recommended):
```python
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default"
)

client = AzureOpenAI(
    api_version="2024-02-01",
    azure_endpoint="https://YOUR-RESOURCE.openai.azure.com/",
    azure_ad_token_provider=token_provider
)

result = client.images.generate(
    model="gpt-image-2",
    prompt="A serene mountain landscape at sunset",
    size="1024x1024",
    quality="standard"
)

print(result.data[0].url)
```

### Parameters

- `prompt`: Description of the image (1-4000 chars, required)
- `model`: `gpt-image-2` or `gpt-image-1.5` (use deployment name)
- `size`: `1024x1024`, `1024x1792`, or `1792x1024` (default: `1024x1024`)
- `quality`: `standard` or `hd` (default: `standard`)
- `n`: Number of images (model-specific limits apply)
- `style`: Optional stylistic control if supported by the deployed model

### Prompt crafting tips

1. Be specific and descriptive
2. Include style, mood, and atmosphere details
3. Specify key visual elements and composition
4. Use portrait (`1024x1792`) for vertical, landscape (`1792x1024`) for horizontal images
5. Use `hd` quality only when user specifically requests high detail

## Output

- The API returns a temporary URL valid for 24 hours
- Download and save the image if persistence is needed
- The response includes a `revised_prompt` showing what the model actually used

## Error handling

- **401/403**: Check Azure authentication and RBAC role assignments
- **API Key Disabled**: Switch to Azure RBAC with DefaultAzureCredential
- **429**: Rate limit reached, implement retry with backoff
- **Content filtered**: Revise prompt to comply with content policies

## References

- [Azure OpenAI Image Generation Docs](https://learn.microsoft.com/azure/ai-services/openai/how-to/dall-e)
