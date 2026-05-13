+++
title = '🎨 Generate with GPT-image-2'
slug = 'create-image-skill-azure-openai'
date = '2026-05-13 09:00:00Z'
lastmod = '2026-05-13 09:00:00Z'
draft = false
tags = [
  "Azure OpenAI",
  "GitHub Copilot",
  "GitHub CLI",
  "Agent Skills",
  "AI",
  "Azure RBAC",
  "Developer Productivity"
]
categories = [
  "AI",
  "Azure",
  "Developer Tools",
  "GitHub"
]
series = [
  "GitHub Copilot"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''A clean, modern technical illustration for a blog post about generating AI images from a developer terminal using the create-image skill with Azure OpenAI GPT-image-2.
    Show a terminal window sending a prompt through a secure Azure RBAC gateway into a GPT-image-2 deployment, then returning a landscape blog cover image artifact.
    Include visual motifs for prompt text, Azure cloud infrastructure, an abstract model deployment card with a small number 2 badge, base64 image output, and a saved cover.jpg file in a repository folder.
    Use deep blue, teal, graphite, and white tones with subtle gradients, circuit traces, and tidy workflow arrows.
    Keep the composition enterprise-friendly, uncluttered, and suited for developers, platform engineers, and technical content creators.
    No people, no logos, no text overlays.'''

description = "Use create-image with Azure OpenAI GPT-image-2, RBAC, prompt settings, and base64 output for development visuals."
+++

The new `create-image` skill brings GPT-image-2 generation into the developer
workflow. Instead of opening a browser, copying a prompt into a design tool, and
manually moving files around, you can generate visuals from your terminal or
agent workflow using Azure OpenAI.

It is a custom skill I created in the `sujithq/skills` repository, so the goal is
practical automation rather than a generic image-generation tutorial.

That makes it useful for blog covers, documentation diagrams, UI placeholders,
presentation visuals, and quick concept exploration. The important bit is that
the skill is designed for developer environments: it uses Azure OpenAI, supports
keyless Azure RBAC authentication, and saves the generated output into your
project.

If you already read the earlier post on {{< relref "/posts/2026-04-17-manage-agent-skills-github-cli" >}}, this is the next practical layer: installing a reusable skill and using it to create a real artifact.

## What the skill does

`create-image` wraps Azure OpenAI GPT-image-2 generation behind a small,
repeatable workflow. You provide a prompt, call the `gpt-image-2` deployment,
set output options, and save the generated image.

The core capabilities are straightforward:

- Generate images from text prompts.
- Use the `gpt-image-2` deployment configured in your Azure OpenAI resource.
- Authenticate with Azure RBAC through `DefaultAzureCredential`.
- Pick square, portrait, or landscape dimensions.
- Choose `low`, `medium`, or `high` quality for the `gpt-image-2` request.
- Save the returned image data into a durable file in your project.

For content workflows, the most practical pattern is: generate one landscape
image, save it immediately, and commit it beside the post or documentation page
that uses it.

## When it is useful

The skill is a good fit when the output is a supporting development asset rather
than a production design system replacement.

Use it for:

- Blog post covers and social preview images.
- Placeholder product images during prototyping.
- Documentation visuals for architecture or workflow concepts.
- Presentation images for internal demos.
- Prompt iteration when you want to compare visual directions quickly.

Avoid using it as an unchecked production pipeline. Generated images still need
human review for quality, accessibility fit, brand suitability, and responsible
AI considerations.

## Prerequisites

You need three things before using the skill.

1. An Azure subscription with an Azure OpenAI resource.
2. A `gpt-image-2` deployment in that resource.
3. Azure authentication configured for the identity running the skill.

For local development, sign in with Azure CLI:

```bash
az login
az account show
```

Then assign the identity the `Azure AI User` role on the Foundry resource. This
is the least-privilege role Microsoft recommends for users who need to build with
pre-deployed Foundry models:

```bash
az role assignment create \
  --assignee $(az ad signed-in-user show --query id -o tsv) \
  --role "Azure AI User" \
  --scope /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.CognitiveServices/accounts/{resource-name}
```

For hosted workloads, use a managed identity and assign the same role to that
identity. This avoids storing API keys in environment variables or pipeline
secrets.

## Install the skill

Install just this skill from the skills repository:

```bash
gh skill install sujithq/skills create-image
```

You can verify it from Copilot CLI:

```bash
copilot
/skills list
/skills info create-image
```

If you are standardising skills for a team, pinning the version is worth doing
once your rollout process is settled. That keeps image-generation behaviour more
predictable across developer machines and build agents.

## Generate an image with Azure RBAC

The skill uses the Azure OpenAI Python SDK pattern with
`DefaultAzureCredential`. This is the recommended path when API keys are disabled
or discouraged by policy. For `gpt-image-2`, use the newer `/openai/v1` image API
shape and the `gpt-image-2` deployment name configured in your resource.

Install the dependencies:

```bash
pip install openai azure-identity
```

Then call your Azure OpenAI endpoint:

```python
import base64

from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import OpenAI

endpoint = "https://your-resource.openai.azure.com/"
deployment = "gpt-image-2"

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://ai.azure.com/.default"
)

client = OpenAI(
    base_url=f"{endpoint.rstrip('/')}/openai/v1/",
    api_key=token_provider
)

result = client.images.generate(
    model=deployment,
    prompt=(
        "A clean technical blog cover showing a secure developer terminal "
        "generating an Azure cloud architecture illustration, modern digital "
        "art, deep blue and teal palette, uncluttered composition"
    ),
    size="1792x1024",
    quality="medium",
    n=1
)

with open("cover.jpg", "wb") as image_file:
    image_file.write(base64.b64decode(result.data[0].b64_json))
```

`gpt-image-2` returns base64 image data, so write the decoded bytes to a file
during the same workflow.

## Pick the right parameters

For the `gpt-image-2` path, start with these parameters:

| Parameter | Typical value | Notes |
|---|---:|---|
| `prompt` | Detailed text description | Required. Be specific about subject, style, composition, and constraints. |
| `model` | `gpt-image-2` | Use the GPT-image-2 deployment name configured in your Azure OpenAI resource. |
| `size` | `1792x1024` | Use landscape for blog covers. GPT-image 2 supports arbitrary sizes within documented limits. |
| `quality` | `medium` | Use `low` for faster retries or `high` when the extra detail is worth the cost and latency. |
| `n` | `1` | Generate one image for deterministic content workflows. |

For blog covers, I normally start with:

```python
result = client.images.generate(
    model="gpt-image-2",
    prompt=cover_prompt,
    size="1792x1024",
    quality="medium",
    n=1
)
```

Because this workflow targets `gpt-image-2`, check the deployment name, API
shape, size values, output format, and quality options in your own Azure OpenAI
resource before automating it for a team.

## Write better prompts

Image prompts work best when they read like a miniature creative brief.

Include:

- **Subject**: what the image is about.
- **Composition**: wide angle, centred, diagram-like, close-up, or layered.
- **Visual motifs**: terminal, cloud nodes, architecture blocks, dashboards, or
  repository folders.
- **Style**: technical illustration, product render, editorial graphic, or
  professional photography.
- **Palette**: colours that fit the subject and do not fight the site design.
- **Constraints**: no people, no logos, no text overlays, or minimal clutter.

For example:

```text
A clean, modern technical illustration showing a developer terminal sending a
prompt into Azure OpenAI and receiving a generated blog cover image. Include
cloud infrastructure nodes, secure RBAC identity flow, model deployment cards,
and a saved cover.jpg artifact in a repository folder. Use deep blue, teal,
graphite, and white tones with subtle circuit traces. No people, no logos, no
text overlays.
```

That gives the model more useful direction than "make a cover image about AI".

## Handle failures cleanly

There are four failure modes worth planning for.

| Symptom | Likely cause | Fix |
|---|---|---|
| `401` or `403` | Missing role assignment or wrong tenant | Run `az account show`, confirm the subscription, and assign `Azure AI User`. |
| API key disabled | Resource is configured for keyless access | Use `DefaultAzureCredential` and an Entra ID token provider. |
| `429` | Deployment rate limit exceeded | Retry with exponential backoff or request quota. |
| Content filter error | Prompt or generated output was blocked | Rewrite the prompt in neutral, professional language. |

For automation, wrap generation in retry logic for transient errors and fail
fast on content-filter errors so a human can revise the prompt.

```python
from openai import OpenAIError


def generate_with_retry(client, prompt, attempts=3):
    for attempt in range(1, attempts + 1):
        try:
            return client.images.generate(
                model="gpt-image-2",
                prompt=prompt,
                size="1792x1024",
                quality="medium",
                n=1
            )
        except OpenAIError as error:
            message = str(error).lower()
            if "content" in message and "filter" in message:
                raise ValueError("Revise the image prompt before retrying.") from error
            if attempt == attempts:
                raise
```

## Team setup pattern

For a team, keep configuration outside the script:

```bash
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_IMAGE_DEPLOYMENT=gpt-image-2
```

Then read the values at runtime:

```python
import os

endpoint = os.environ["AZURE_OPENAI_ENDPOINT"]
deployment = os.environ.get("AZURE_OPENAI_IMAGE_DEPLOYMENT", "gpt-image-2")
```

This lets developers use the same script across local machines, GitHub Actions,
and Azure-hosted runners while platform teams control the endpoint and identity
permissions.

## Practical safety checklist

Before you make generated images part of a repeatable workflow, check the
following:

- Use Azure RBAC or managed identity rather than long-lived API keys where
  possible.
- Store generated files in the repository or artifact store; do not rely on
  temporary URLs or transient response data.
- Review images before publishing, especially when they represent a product,
  brand, architecture, or security concept.
- Keep prompts free of secrets, customer data, and unnecessary personal data.
- Monitor cost and quota usage if generation runs in CI.
- Pin the skill version when reproducibility matters.

## References

- [create-image skill source](https://raw.githubusercontent.com/sujithq/skills/refs/heads/main/skills/create-image/BLOG_POST_SOURCE.md)
- [Azure OpenAI image generation API reference](https://learn.microsoft.com/azure/ai-foundry/openai/reference-preview#image-generation)
- [Role-based access control for Microsoft Foundry](https://learn.microsoft.com/azure/ai-foundry/concepts/rbac-azure-ai-foundry)
- [OpenAI Python SDK](https://github.com/openai/openai-python)
- [Skills repository](https://github.com/sujithq/skills)

## Recap

`create-image` is a small but useful skill for developer-centred image
generation. The best workflow is simple: authenticate with Azure RBAC, use a
clear prompt, generate one correctly sized image, save it immediately, and review
the result before publishing.

For blog and documentation workflows, that turns cover-image creation from a
manual publishing task into a repeatable engineering step.