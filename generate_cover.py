#!/usr/bin/env python3
"""Generate cover image for Copilot Token Efficiency post."""

import os
import sys
from pathlib import Path
import urllib.request
import json

# Only import Azure SDK if needed
try:
    from openai import AzureOpenAI
    from azure.identity import DefaultAzureCredential, get_bearer_token_provider
except ImportError:
    print("Installing required packages...")
    os.system("pip install openai azure-identity")
    from openai import AzureOpenAI
    from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Configuration
AZURE_ENDPOINT = "https://squintelier-5556-resource.services.ai.azure.com/"
API_VERSION = "2024-02-01"
MODEL = "dall-e-3"
OUTPUT_PATH = Path("content/posts/2026-06-19-maximising-copilot-token-efficiency/cover.jpg")

COVER_PROMPT = """Create a clean, modern technical illustration showing token flow optimisation in GitHub Copilot.
Feature a vertical or horizontal data pipeline diagram with cache blocks, token paths, and model routing nodes.
Use deep blue, purple, and emerald green tones with subtle circuit line patterns and geometric shapes.
Include visual indicators for prompt caching (stacked blocks), tool search (branching paths), and model selection (routing nodes).
Maintain a futuristic, enterprise-ready aesthetic with minimal text. Appeal to developers and cloud engineers.
No people, no logos, no text overlays."""

def generate_cover():
    """Generate cover image using Azure OpenAI."""
    print("🖼️  Generating cover image for Copilot Token Efficiency post...")
    print(f"Endpoint: {AZURE_ENDPOINT}")
    
    # Create Azure OpenAI client with RBAC authentication
    token_provider = get_bearer_token_provider(
        DefaultAzureCredential(),
        "https://cognitiveservices.azure.com/.default"
    )
    
    client = AzureOpenAI(
        api_version=API_VERSION,
        azure_endpoint=AZURE_ENDPOINT,
        azure_ad_token_provider=token_provider
    )
    
    print(f"Generating image with {MODEL}...")
    response = client.images.generate(
        model=MODEL,
        prompt=COVER_PROMPT,
        size="1792x1024",
        quality="standard",
        style="vivid",
        n=1
    )
    
    image_url = response.data[0].url
    print(f"✓ Image generated: {image_url[:80]}...")
    
    # Create output directory if needed
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    # Download image and save as JPEG
    print(f"💾 Saving to {OUTPUT_PATH}...")
    urllib.request.urlretrieve(image_url, OUTPUT_PATH)
    print(f"✓ Cover image saved successfully!")
    
    return OUTPUT_PATH

if __name__ == "__main__":
    try:
        cover_path = generate_cover()
        print(f"\n✅ Success! Cover image ready at: {cover_path}")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nFallback: Use the cover prompt at designer.microsoft.com")
        sys.exit(1)
