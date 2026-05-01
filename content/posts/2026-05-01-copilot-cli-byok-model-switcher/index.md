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
  For Azure Foundry deployments with API keys disabled by policy, Azure CLI
  (`az`) installed and logged in is sufficient.

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
- In enterprise environments, **API keys for Azure OpenAI / Foundry hosted models
  may be disabled by policy** (RBAC-only). In those cases `COPILOT_PROVIDER_API_KEY`
  simply does not work, and you need a short-lived bearer token instead - which
  adds yet another manual step to every session.

### The bearer token problem: API keys disabled by policy

Many enterprise Azure OpenAI and Azure AI Foundry deployments are configured
with RBAC-only access, meaning API keys are **disabled at the resource level**.
This is a deliberate security control enforced by platform teams, not a
configuration mistake. When it applies, setting `COPILOT_PROVIDER_API_KEY`
returns a 401 error and there is no way around it using standard key-based auth.

The alternative is a short-lived bearer token obtained from Azure CLI:

```bash
# Fetch a bearer token from Azure CLI
TOKEN=$(az account get-access-token \
  --scope https://cognitiveservices.azure.com/.default \
  --query accessToken -o tsv)

export COPILOT_PROVIDER_BASE_URL=https://my-resource.openai.azure.com/openai/deployments/gpt-4o
export COPILOT_PROVIDER_TYPE=azure
export COPILOT_PROVIDER_BEARER_TOKEN=$TOKEN
unset COPILOT_PROVIDER_API_KEY
export COPILOT_MODEL=gpt-4o
copilot
```

There are two problems with this manual approach:

- Azure bearer tokens expire (typically after one hour). Every new session
  requires a fresh `az account get-access-token` call.
- You must remember to **unset** `COPILOT_PROVIDER_API_KEY`. If a stale key
  value is present alongside a bearer token, the auth mode is ambiguous and the
  request may fail.

This is where `copilot-byok-model-switcher` adds the most value for Azure
Foundry users.

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

The wizard walks you through the following steps:

1. **Profile name** — a short slug you will use in `use` commands (e.g. `azure-gpt`).
2. **Profile type** — `byok` for API-key or bearer token endpoints, `copilot` for
   the default service.
3. **Provider type** — `openai`, `azure`, or `anthropic`.
4. **Base URL** — the full endpoint URL (e.g.
   `https://my-resource.openai.azure.com/openai/deployments/gpt-4o`).
5. **Model** — the deployment or model identifier (e.g. `gpt-4o`).
6. **Auth method** — API key entered via a secure password prompt, an environment
   variable name (`apiKeyEnv`), or Azure CLI bearer token (`azureCliToken`).

{{< image src="img/screenshot-add.png" alt="copilot-byok-model-switcher add wizard" caption="The interactive add wizard — replace this placeholder with a real screenshot." >}}

If you add a profile with identical settings to an existing one, the tool updates
the existing profile rather than creating a duplicate.

#### Adding an Azure OpenAI profile with an API key environment variable

When you choose the `apiKeyEnv` option during the wizard, the key is read from
the named environment variable at runtime instead of being stored in the config
file:

```bash
# Set the key in your shell profile (e.g. ~/.bashrc)
export AZURE_OPENAI_KEY="sk-..."

# Then add the profile — enter "apiKeyEnv" as auth method and "AZURE_OPENAI_KEY" as the variable name
copilot-byok-model-switcher add
```

#### Adding a Foundry profile with bearer token auth (API keys disabled by policy)

When prompted for the auth method choose `azureCliToken`. The tool will
automatically call `az account get-access-token` before each session:

```bash
# Ensure you are logged in first
az login

copilot-byok-model-switcher add
# provider type: azure
# base URL:      https://my-foundry.openai.azure.com/openai/deployments/gpt-4o
# model:         gpt-4o
# auth method:   azureCliToken
```

### Listing profiles

```bash
copilot-byok-model-switcher list
```

Renders a formatted table of all profiles. The last-used profile is marked with
`*` so you always know your current context. The active config file path is
shown below the table.

```
 Name             Type     Provider   Model      Auth
 ──────────────── ──────── ────────── ────────── ────────────────
 default *        copilot             auto
 azure-gpt        byok     azure      gpt-4o     apiKeyEnv
 foundry-rbac     byok     azure      gpt-4o     azureCliToken
 anthropic-opus   byok     anthropic  claude...  apiKey
 ollama-local     byok     openai     llama3.2
```

{{< image src="img/screenshot-list.png" alt="copilot-byok-model-switcher list output" caption="Formatted profile table — replace this placeholder with a real screenshot." >}}

### Switching models

To activate a profile interactively (launches `gh copilot` in interactive mode):

```bash
copilot-byok-model-switcher use azure-gpt
```

This sets the environment variables, then hands off to `gh copilot`. You can
also pass a prompt directly:

```bash
copilot-byok-model-switcher use azure-gpt -p "refactor this function for clarity"
```

#### Using a Foundry RBAC profile (bearer token)

For profiles with `azureCliToken: "auto"`, the tool fetches a fresh token before
each invocation — no manual `az account get-access-token` required:

```bash
# Interactive mode
copilot-byok-model-switcher use foundry-rbac

# Non-interactive with a prompt
copilot-byok-model-switcher use foundry-rbac -p "explain this Bicep template"
```

#### Allowing tools and controlling MCP servers

Any flag that `gh copilot` accepts can be forwarded after the profile name:

| Flag | Description |
|---|---|
| `-p` / `--prompt <text>` | Run non-interactively with a prompt |
| `--allow-all-tools` | Allow all tools |
| `--allow-all` / `--yolo` | Allow all tools and operations |
| `--allow-tool <name>` | Allow a specific tool |
| `--deny-tool <name>` | Deny a specific tool |
| `--disable-mcp-server <name>` | Disable a named MCP server |
| `--disable-builtin-mcps` | Disable all built-in MCP servers |

```bash
# Allow all tools (useful in scripted pipelines)
copilot-byok-model-switcher use azure-gpt --allow-all-tools

# YOLO mode — allow all tools and operations
copilot-byok-model-switcher use azure-gpt --yolo -p "rewrite all tests to use xUnit"

# Deny a specific tool
copilot-byok-model-switcher use azure-gpt --deny-tool shell_exec -p "review this PR diff"

# Disable one MCP server for this invocation only
copilot-byok-model-switcher use foundry-rbac \
  --disable-mcp-server foundry-mcp \
  -p "generate a Terraform module for AKS"

# Disable all built-in MCP servers
copilot-byok-model-switcher use ollama-local --disable-builtin-mcps
```

When `-p` is passed, `--allow-all-tools` is injected automatically unless
you already specified one of the permission flags above.

{{< image src="img/screenshot-use.png" alt="copilot-byok-model-switcher use command" caption="Activating a profile and launching Copilot CLI — replace this placeholder with a real screenshot." >}}

To jump back to the default Copilot service:

```bash
copilot-byok-model-switcher default

# Also works non-interactively
copilot-byok-model-switcher default -p "what does this script do?"
```

To reuse the last activated profile without typing its name:

```bash
# Interactive mode
copilot-byok-model-switcher last

# Non-interactive
copilot-byok-model-switcher last -p "explain this error"
```

### Interactive management

The `manage` command provides a single interactive flow for all profile operations:

```bash
copilot-byok-model-switcher manage
```

From here you can use, remove, add, import, configure MCP compatibility servers,
or exit, all from a single menu without remembering sub-command names.

```
? What do you want to do?
❯ Use a profile
  Add a profile
  Remove profiles
  Import from Foundry
  Set MCP compatibility servers
  Exit
```

{{< image src="img/screenshot-manage.png" alt="copilot-byok-model-switcher manage menu" caption="The manage interactive menu — replace this placeholder with a real screenshot." >}}

### Importing from Azure Foundry

If you have Azure OpenAI / Azure AI Foundry deployments, the tool can discover
and import them automatically using the Azure CLI:

```bash
# Discover all accounts, prompt per deployment (interactive)
copilot-byok-model-switcher import-foundry

# Explicit per-deployment prompt mode
copilot-byok-model-switcher import-foundry --mode each

# Import all deployments without prompts
copilot-byok-model-switcher import-foundry --all

# Scope to one account and resource group, add all without prompts
copilot-byok-model-switcher import-foundry \
  --account myfoundry \
  --resource-group my-rg \
  --all

# Limit discovery to a specific subscription
copilot-byok-model-switcher import-foundry \
  --subscription 00000000-0000-0000-0000-000000000000 \
  --all

# Combine subscription and account filters
copilot-byok-model-switcher import-foundry \
  --subscription my-sub-name \
  --account myfoundry \
  --resource-group my-rg \
  --all
```

Only chat-capable deployments are imported (embeddings are skipped). Re-running
the command deduplicates profiles automatically, so it is safe to run after new
deployments are created.

Crucially, every profile created by `import-foundry` uses **bearer token auth
by default** (`azureCliToken: "auto"`), not API keys. This is the correct
behaviour for Foundry-hosted models where API keys are disabled by policy. The
tool calls `az account get-access-token` automatically before each session and
sets `COPILOT_PROVIDER_BEARER_TOKEN`, so you never need to handle token
acquisition manually.

{{< image src="img/screenshot-import-foundry.png" alt="copilot-byok-model-switcher import-foundry" caption="Discovering and importing Foundry deployments — replace this placeholder with a real screenshot." >}}

### MCP server compatibility

Some BYOK or proxy profiles may conflict with certain MCP servers that expect
the default Copilot service. The `mcp-compat` command lets you specify which
MCP servers the tool should disable automatically when a given profile is
activated:

```bash
# Interactively select which servers to disable for a profile
copilot-byok-model-switcher mcp-compat my-azure-profile

# Same as above but explicitly invoke the selection prompt
copilot-byok-model-switcher mcp-compat my-azure-profile --action set

# Disable all candidate servers automatically (no prompt)
copilot-byok-model-switcher mcp-compat my-azure-profile --action all

# Disable none of the candidate servers
copilot-byok-model-switcher mcp-compat my-azure-profile --action none

# Reset the saved selection — you will be prompted again on the next interactive use
copilot-byok-model-switcher mcp-compat my-azure-profile --action reset
```

The default candidate server list is: `foundry-mcp`, `context7`, `msx-mcp`,
`azure`, `workiq`, `powerbi-remote`.

```
? Select MCP servers to disable for profile "foundry-rbac"
  (Use space to select, enter to confirm)
❯ ◉ foundry-mcp
  ◉ context7
  ◯ msx-mcp
  ◯ azure
  ◯ workiq
  ◯ powerbi-remote
```

{{< image src="img/screenshot-mcp-compat.png" alt="copilot-byok-model-switcher mcp-compat server selection" caption="Selecting which MCP servers to disable — replace this placeholder with a real screenshot." >}}

Your selection is saved to the profile under `mcpCompatServers` and reused on
every subsequent run. To disable the entire compat mode for a session, set
`CBMS_DISABLE_MCP_COMPAT=off` before running the tool.

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

An example config file showing all three authentication patterns:

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
      "name": "foundry-rbac",
      "type": "byok",
      "baseUrl": "https://my-resource.openai.azure.com/openai/deployments/gpt-4o",
      "model": "gpt-4o",
      "providerType": "azure",
      "azureCliToken": "auto",
      "tokenScope": "https://cognitiveservices.azure.com/.default"
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

The three authentication patterns in use above are:

- **`apiKeyEnv`**: points to an environment variable holding the key, keeping
  secrets out of the config file. Used when API keys are enabled on the resource.
- **`azureCliToken: "auto"`**: used when API keys are **disabled by policy**.
  The tool runs `az account get-access-token` before each session and sets
  `COPILOT_PROVIDER_BEARER_TOKEN` automatically. `COPILOT_PROVIDER_API_KEY` is
  cleared to avoid auth-mode ambiguity. Set `tokenScope` to the Cognitive
  Services default scope (`https://cognitiveservices.azure.com/.default`) for
  Azure OpenAI endpoints.
- **No auth fields**: for local endpoints like Ollama that do not require
  authentication.

## Removing profiles

```bash
# Interactive multi-select removal
copilot-byok-model-switcher remove

# Remove a single profile by name
copilot-byok-model-switcher remove azure-gpt

# Remove multiple profiles in one command
copilot-byok-model-switcher remove azure-gpt ollama-local
```

```
? Select profiles to remove (Space to select, Enter to confirm)
  ◯ azure-gpt
  ◉ foundry-rbac
  ◉ ollama-local
```

{{< image src="img/screenshot-remove.png" alt="copilot-byok-model-switcher remove multi-select" caption="Interactive profile removal — replace this placeholder with a real screenshot." >}}

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

**401 Unauthorized when using an API key against a Foundry endpoint**: the
Azure resource likely has API keys disabled by policy. Use a bearer token
profile instead (`azureCliToken: "auto"`). Ensure you are logged in with
`az login` and that your identity has the **Cognitive Services OpenAI User** or
**Contributor** role on the resource.

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
