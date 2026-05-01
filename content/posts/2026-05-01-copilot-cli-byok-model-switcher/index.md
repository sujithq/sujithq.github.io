+++
title = '🔑 Easier BYOK for GitHub Copilot CLI'
slug = 'copilot-cli-byok-model-switcher'
date = '2026-05-01 09:00:00Z'
lastmod = '2026-05-01 09:00:00Z'
draft = true
tags = [
  "GitHub",
  "GitHub Copilot",
  "GitHub CLI",
  "AI",
  "DotNET",
  "Developer Productivity",
  "BYOK",
  "Azure OpenAI"
]
categories = [
  "GitHub",
  "DevOps",
  "Developer Tools",
  "AI"
]
series = [
  "GitHub Copilot"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Create a clean, modern technical illustration for a blog post about switching AI model providers in GitHub Copilot CLI using a .NET tool.
    Show a terminal window in the foreground with a profile switcher menu listing entries like "default", "azure-gpt", and "ollama-local".
    In the background, depict three cloud nodes representing OpenAI, Azure OpenAI, and Anthropic connected by routing arrows to a central Copilot CLI hub.
    Use a dark background with electric blue, teal, and green accents. Add subtle circuit-line patterns and a small .NET icon in one corner.
    Include a keyring icon to represent bring-your-own-key. Keep the composition uncluttered, enterprise-ready, and appealing to cloud engineers and .NET developers.
    '''

description = "Use the copilot-byok-model-switcher .NET tool to switch between BYOK model profiles in GitHub Copilot CLI without juggling environment variables."
+++

GitHub Copilot CLI supports **Bring Your Own Key** (BYOK), letting you point the
CLI at any OpenAI-compatible endpoint, Azure OpenAI, or Anthropic instead of the
default Copilot service. The capability is powerful, but the raw workflow requires
you to export several environment variables every time you switch providers. This
post walks through the manual approach first, shows why it becomes cumbersome, and
then introduces
[`copilot-byok-model-switcher`](https://github.com/sujithq/gh-copilot-cli-model-switcher),
a .NET global tool that wraps the whole flow with a polished interactive interface.

## Prerequisites

- GitHub Copilot CLI installed (`gh extension install github/gh-copilot` or the
  standalone `copilot` binary).
- A Copilot subscription (Free, Pro, Business, or Enterprise).
- .NET 10 SDK or later (for the tool install).
- An API key from Azure OpenAI, OpenAI, or Anthropic, or a local Ollama instance.

## The manual BYOK approach

GitHub Copilot CLI exposes four environment variables for BYOK configuration:

| Variable | Required | Description |
|---|---|---|
| `COPILOT_PROVIDER_BASE_URL` | Yes | Base URL of the model provider API |
| `COPILOT_PROVIDER_TYPE` | No | `openai` (default), `azure`, or `anthropic` |
| `COPILOT_PROVIDER_API_KEY` | No | API key (omit for unauthenticated local endpoints) |
| `COPILOT_MODEL` | Yes | Model identifier or deployment name |

To use a model, export the variables and then start the CLI:

```bash
# Azure OpenAI
export COPILOT_PROVIDER_BASE_URL=https://my-resource.openai.azure.com/openai/deployments/gpt-4o
export COPILOT_PROVIDER_TYPE=azure
export COPILOT_PROVIDER_API_KEY=YOUR-AZURE-API-KEY
export COPILOT_MODEL=gpt-4o
copilot
```

```bash
# Anthropic
export COPILOT_PROVIDER_TYPE=anthropic
export COPILOT_PROVIDER_BASE_URL=https://api.anthropic.com
export COPILOT_PROVIDER_API_KEY=YOUR-ANTHROPIC-API-KEY
export COPILOT_MODEL=claude-opus-4-5
copilot
```

```bash
# Local Ollama (no API key needed)
export COPILOT_PROVIDER_BASE_URL=http://localhost:11434
export COPILOT_MODEL=llama3.2
copilot
```

To switch back to the default Copilot service, unset all four variables:

```bash
unset COPILOT_PROVIDER_BASE_URL COPILOT_PROVIDER_TYPE COPILOT_PROVIDER_API_KEY COPILOT_MODEL
copilot
```

### Where the friction builds

This approach works for a single provider. Once you start switching between
multiple endpoints - say, Azure OpenAI for code review, Ollama for offline work,
and default Copilot for general tasks - the workflow gets tedious:

- You must remember (or look up) the correct base URL and model name for each
  provider.
- API keys cannot live in shell history for security reasons, so you end up
  sourcing separate env files or using a password manager to paste them in.
- Switching mid-session requires unsetting every variable before setting the new
  ones. Miss one and the CLI either errors or silently uses a stale value.
- There is no profile concept, so nothing persists between terminal sessions.
- Multi-machine or team setups have no portable config story.

## Introducing `copilot-byok-model-switcher`

[`copilot-byok-model-switcher`](https://github.com/sujithq/gh-copilot-cli-model-switcher)
is a .NET global tool that adds a persistent profile layer on top of the raw
environment variables. Profiles are stored in
`~/.copilot-byok-model-switcher/config.json` and the tool sets the correct
variables automatically when you activate one. It uses
[Spectre.Console](https://spectreconsole.net/) for a clean terminal UI with
coloured tables and interactive selection menus.

### Installation

Install directly from GitHub Packages:

```bash
dotnet tool install --global copilot-byok-model-switcher \
  --add-source "https://nuget.pkg.github.com/sujithq/index.json"
```

Or build from source:

```bash
git clone https://github.com/sujithq/gh-copilot-cli-model-switcher.git
cd gh-copilot-cli-model-switcher/dotnet/CopilotX
dotnet pack
dotnet tool install --global --add-source ./nupkg copilot-byok-model-switcher
```

Verify the install:

```bash
copilot-byok-model-switcher help
```

To update later:

```bash
dotnet tool update --global copilot-byok-model-switcher \
  --add-source "https://nuget.pkg.github.com/sujithq/index.json"
```

### Adding profiles

Run the interactive wizard to add your first profile:

```bash
copilot-byok-model-switcher add
```

The wizard prompts for provider type, base URL, model name, and API key. Keys
are entered through a secure password prompt and stored in the config file. If
you add a profile with identical settings to an existing one, the tool updates
the existing profile rather than creating a duplicate.

### Listing profiles

```bash
copilot-byok-model-switcher list
```

Renders a formatted table of all profiles. The last-used profile is marked with
`*` so you always know your current context.

### Switching models

To activate a profile interactively:

```bash
copilot-byok-model-switcher use azure-gpt
```

This sets the environment variables, then hands off to `gh copilot`. You can
also pass a prompt directly:

```bash
copilot-byok-model-switcher use azure-gpt -p "refactor this function for clarity"
```

Any flag that `gh copilot` accepts can be forwarded after the profile name:

| Flag | Description |
|---|---|
| `-p` / `--prompt <text>` | Run non-interactively with a prompt |
| `--allow-all-tools` | Allow all tools |
| `--allow-tool <name>` | Allow a specific tool |
| `--deny-tool <name>` | Deny a specific tool |
| `--disable-mcp-server <name>` | Disable a named MCP server |
| `--disable-builtin-mcps` | Disable all built-in MCP servers |

To jump back to the default Copilot service:

```bash
copilot-byok-model-switcher default
```

To reuse the last activated profile without typing its name:

```bash
copilot-byok-model-switcher last -p "explain this error"
```

### Interactive management

The `manage` command provides a single interactive flow for all profile operations:

```bash
copilot-byok-model-switcher manage
```

From here you can use, remove, add, import, configure MCP compatibility servers,
or exit, all from a single menu without remembering sub-command names.

### Importing from Azure Foundry

If you have Azure OpenAI deployments, the tool can discover and import them
automatically using the Azure CLI:

```bash
# Discover all accounts and prompt per deployment
copilot-byok-model-switcher import-foundry

# Import all deployments without prompts
copilot-byok-model-switcher import-foundry --all

# Scope to one account and resource group
copilot-byok-model-switcher import-foundry \
  --account myfoundry \
  --resource-group my-rg \
  --all
```

Only chat-capable deployments are imported (embeddings are skipped). Re-running
the command deduplicates profiles automatically, so it is safe to run after new
deployments are created.

### MCP server compatibility

Some BYOK or proxy profiles may conflict with certain MCP servers that expect
the default Copilot service. The `mcp-compat` command lets you specify which
MCP servers the tool should disable automatically when a given profile is
activated:

```bash
# Interactively select servers to disable for a profile
copilot-byok-model-switcher mcp-compat my-azure-profile

# Disable none
copilot-byok-model-switcher mcp-compat my-azure-profile --action none

# Reset to prompt again on next interactive use
copilot-byok-model-switcher mcp-compat my-azure-profile --action reset
```

## Configuration

Profiles are stored in `~/.copilot-byok-model-switcher/`. The active config
file depends on the `COPILOT_BYOK_MODEL_SWITCHER_CONFIG_SCOPE` environment
variable:

| Value | Behaviour |
|---|---|
| `auto` (default) | Azure user-scoped config if `az account show` is available, otherwise global |
| `azure-user` | Always use Azure user-scoped config |
| `global` | Always use `~/.copilot-byok-model-switcher/config.json` |

In Azure user-scoped mode the filename includes the tenant ID and username:
`config.<tenantId>__<userName>.json`. This means each Azure identity gets an
isolated profile set on the same machine.

An example config file:

```json
{
  "profiles": [
    {
      "name": "default",
      "type": "copilot",
      "model": "auto"
    },
    {
      "name": "azure-gpt",
      "type": "byok",
      "baseUrl": "https://my-resource.openai.azure.com/openai/deployments/gpt-4o",
      "apiKeyEnv": "AZURE_OPENAI_KEY",
      "model": "gpt-4o"
    },
    {
      "name": "ollama-local",
      "type": "byok",
      "baseUrl": "http://localhost:11434",
      "model": "llama3.2"
    }
  ]
}
```

Note that `apiKeyEnv` points to an environment variable name rather than storing
the key in plain text, which is the safer approach for keys you already manage
through other means.

## Removing profiles

```bash
# Interactive multi-select removal
copilot-byok-model-switcher remove

# Remove two profiles by name
copilot-byok-model-switcher remove azure-gpt ollama-local
```

The `default` profile is protected and cannot be removed.

## Why this matters now

The GitHub Changelog
[announced on 22 April 2026](https://github.blog/changelog/2026-04-22-bring-your-own-language-model-key-in-vs-code-now-available/)
that BYOK for Copilot is now available in VS Code. The CLI BYOK feature follows
the same model: bring your own provider key, point the CLI at any
OpenAI-compatible endpoint, and keep the Copilot interface you already know.
`copilot-byok-model-switcher` makes the CLI side of that story practical for
developers who work with more than one provider.

## Troubleshooting

**Profile not found**: run `copilot-byok-model-switcher list` to see available
profiles, or `copilot-byok-model-switcher add` to create one.

**Error executing gh copilot**: ensure Copilot CLI is installed:

```bash
gh extension install github/gh-copilot
```

**API key not found for `apiKeyEnv`**: export the environment variable before
running the tool:

```bash
export AZURE_OPENAI_KEY="your-key-here"
```

**Model does not support tool calling**: Copilot CLI requires a model that
supports tool/function calling and streaming. Check your provider's documentation
to confirm the model supports both. A context window of at least 128k tokens is
recommended for best results.

## References

- [Using your own LLM models in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-byok-models)
- [copilot-byok-model-switcher on GitHub](https://github.com/sujithq/gh-copilot-cli-model-switcher)
- [GitHub Changelog: Bring Your Own Language Model Key in VS Code now available](https://github.blog/changelog/2026-04-22-bring-your-own-language-model-key-in-vs-code-now-available/)
- [Getting started with GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-getting-started)
- [Spectre.Console](https://spectreconsole.net/)
