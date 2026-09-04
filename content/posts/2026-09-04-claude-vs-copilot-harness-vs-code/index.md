+++
title = '🧰 Claude vs Copilot in VS Code: Meet the Harness'
slug = 'claude-vs-copilot-harness-vs-code'
date = '2026-09-04 08:00:00Z'
lastmod = '2026-09-04 08:00:00Z'
draft = false
tags = [
  "GitHub Copilot",
  "VS Code",
  "Claude",
  "Codex",
  "AI Agents",
  "Agent Host",
  "Development Tools"
]
categories = [
  "Development Tools",
  "AI-Powered Development"
]
series = [
  "GitHub Copilot Mastery"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''A clean, modern technical illustration of an AI coding agent architecture inside a code editor.
    Show a central Agent Host process as a hub with three pluggable harness modules docked into it, each connected by a distinct cable to a shared language model node.
    Include a layered diagram motif: model layer at the top, harness layer in the middle with tool call, permission, and planning icons, and a workspace layer at the bottom with a Git worktree branch.
    Use deep blue, violet, and teal tones on a dark navy background with subtle circuit line patterns and soft glow.
    Enterprise-friendly, minimal, geometric style for a developer audience.
    No people, no logos, no text overlays.'''

description = "Why the same Claude model behaves differently in VS Code: agent harnesses, the Agent Host, and when to pick Copilot, Claude, or Codex."
+++

Open a new chat in VS Code today and the Session Target control offers you Local, Copilot, Claude, Codex, and Cloud. Many developers read that list as a model picker: "Copilot" must mean GPT, "Claude" must mean Sonnet or Opus, and so on.

That reading is wrong, and it leads to bad comparisons. The list is not about models. It is about **agent harnesses**. Once you separate the two, a lot of confusing behaviour starts to make sense, including why the same Claude model can feel like a different tool depending on where you run it.

## Models vs harnesses

A **language model** does the reasoning and generates responses: Claude Sonnet, Claude Opus, GPT-5, Gemini, and so on.

An **agent harness** is the runtime that coordinates the agent loop. According to the [VS Code documentation](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses), it passes prompts and context to the model, executes the tool calls the model requests, feeds the results back, and maintains the session as the work progresses.

In practice the harness owns:

- System prompts and how custom instructions are loaded
- The tool catalogue, tool descriptions, and MCP server wiring
- Planning behaviour and how sub-tasks are delegated
- Permission modes and approval flows
- Context management: what gets compacted, cached, or dropped
- Session lifecycle: resume, fork, and handoff

The model is one input to that loop. Everything else is the harness. For agentic coding work, the harness frequently has a bigger impact on outcomes than switching between two frontier models.

## The four session choices in VS Code

The VS Code docs break a session into four independent choices:

| Choice | What it controls | Examples |
| --- | --- | --- |
| Agent harness | Coordinates the agent loop and provides provider-specific tools | Local, Copilot, Claude, Codex |
| Execution environment | Where tools run and code changes land | Your machine, a remote host, cloud infrastructure |
| Agent role | Instructions, tools, and behaviour for a task | Agent, Plan, Ask, custom agents |
| Language model | Reasoning and response generation | Claude, GPT, Gemini models |

These are not interchangeable. The docs give the exact example that trips people up: the Local harness can use a Claude model configured in VS Code. Local is still the harness and Claude is the model. Choosing the **Claude harness** instead uses only Claude models and unlocks Anthropic's provider-specific capabilities.

The Session Target control combines the harness and execution environment into one selector, which is why it looks deceptively like a model picker.

## The harnesses available today

From the [Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses) guide:

| Harness | Where tools run | Code access | Choose it for |
| --- | --- | --- | --- |
| Local | VS Code extension host on your machine | Current workspace | Interactive work that needs editor context, extension tools, or any model configured in VS Code |
| Copilot | Agent Host on your machine | Folder or isolated Git worktree | General coding tasks, background sessions, Copilot-specific capabilities |
| Claude | Your machine | Folder or isolated Git worktree | Claude-specific agent capabilities, slash commands, and permission modes |
| Codex | Your machine | Folder or isolated Git worktree | Codex-specific capabilities for interactive or background work |
| Cloud | Provider's remote infrastructure | GitHub repository and pull request | Well-scoped tasks that can run independently and benefit from team review |

Note that "Local" is the name of one specific harness. Copilot, Claude, and Codex also run locally. "Cloud" is an execution target that groups the cloud agents available to you.

### Copilot harness

The Copilot harness is powered by the [Copilot SDK](https://www.npmjs.com/package/@github/copilot-sdk) and runs in the Agent Host on your machine. It uses your existing GitHub authentication context. Provider-specific features include:

- Slash commands such as `/compact`, `/yolo`, and `/autoApprove`
- Rubber Duck, a built-in read-only critic that gives a second opinion on plans, code, and tests
- Remote control (`/remote on`) to steer a running session from GitHub.com or GitHub Mobile
- `/delegate` to hand a task to a cloud agent
- Terminal integration with Copilot CLI, with sessions shared across surfaces

### Claude harness

Claude sessions use Anthropic's Claude Agent SDK. VS Code integrates the harness through that SDK while keeping session management, chat, and code review inside the editor. It is enabled by default and controlled with `github.copilot.chat.claudeAgent.enabled`.

Two authentication and billing options exist:

- **GitHub Copilot subscription**: sign in to GitHub and use Copilot-routed models. Usage is billed through Copilot.
- **Anthropic credentials**: use an Anthropic API key or a Claude Code OAuth token. Usage is billed by Anthropic.

When both are available, the model picker groups models by **Anthropic** and **Copilot**, and you can switch between them inside an existing session.

Claude brings its own permission modes (Edit automatically, Request approval, Plan) and its own slash commands for managing Claude-native agents, hooks, memory files, and code review. If your repository already has `.claude/` conventions, this is the harness that understands them natively.

### Codex harness

Codex runs through the OpenAI Codex extension or, experimentally, on the Agent Host via `chat.agentHost.codexAgent.enabled`. It can authenticate with a Copilot subscription (Copilot Pro+ required) or a ChatGPT account, and offers approval presets such as Default Permissions, Auto-Review, and Full Access.

## Why the same model behaves differently

This is the part most model comparisons miss. Run Claude Sonnet three ways:

1. In the **Local** harness with Sonnet selected as the model
2. In the **Copilot** harness with Sonnet selected as the model
3. In the **Claude** harness

You will get three different experiences. The model weights are identical, but everything around them changes:

- **System prompts** differ per harness, and each loads custom instructions from different places
- **Tool definitions and descriptions** differ, which changes what the model decides to call
- **MCP configuration** is read from harness-specific locations. The Agent Host reads `.mcp.json` and `~/.copilot/mcp-config.json`; it does not read `.vscode/mcp.json` directly, although VS Code forwards servers to it
- **Customisation folders** differ: the Agent Host reads harness-agnostic folders such as `~/.copilot` and `~/.claude`, not your VS Code profile user data
- **Permission models** differ: Claude's Plan mode, Copilot's Autopilot agent mode, Codex's Auto-Review
- **Context handling** differs in how history is compacted and what gets cached

When someone says "Claude in Copilot is worse than Claude Code", they are usually comparing harness A plus model X against harness B plus model X. That is a legitimate comparison, but it is a harness comparison, not a model comparison.

## The Agent Host: why this became possible

The architecture that enables multiple harnesses is the [Agent Host](https://code.visualstudio.com/docs/agents/concepts/agent-host). Earlier versions of VS Code ran agent logic inside the extension host alongside the Copilot Chat extension. Long-running autonomous work has different needs, so agents now run in a dedicated process.

The Agent Host communicates with VS Code through the [Agent Host Protocol (AHP)](https://microsoft.github.io/agent-host-protocol/), an open, agent-agnostic JSON-RPC protocol. The host is the source of truth. Clients subscribe to URI-addressed channels for sessions, chats, terminals, and changesets, receive a snapshot, then a stream of ordered actions.

This design gives you:

- **Shared sessions**: several windows can observe and control the same session
- **Independent execution**: a turn continues even when no editor is connected
- **Remote hosts**: run `code agent host --tunnel` and drive it from another machine over SSH or a dev tunnel
- **Pluggable adapters**: first-party adapters for Copilot, Claude, and Codex translate each runtime into the common AHP session model

The Agents window, remote sessions, and the ability to pick up a session in another window all fall out of this one architectural decision.

## Handoff: switching harness mid-task

Because sessions live in the Agent Host rather than in a single harness, you can hand a session off. Open the Session Target dropdown on an ongoing session and pick a different target. VS Code carries the conversation history and context across; tools, permissions, and models may change because the new harness provides different capabilities.

Typical patterns:

- Start in **Plan** with Copilot, then hand off to **Claude** for implementation because your repo has Claude hooks
- Finish local exploration, then hand off to **Cloud** so the result arrives as a pull request
- Use `/delegate` from Copilot CLI to push the remaining work to a cloud agent

Handoff is distinct from forking (a new independent session from a point in history) and from switching surfaces (opening the same session in the Chat view or Agents window without changing anything).

## Code isolation and permissions

Harness choice also interacts with where changes land. In the Agents window you can pick:

- **Folder**: the agent edits your current workspace directly, including uncommitted changes
- **New Worktree**: VS Code creates a Git worktree from a committed base branch, keeping changes out of your active workspace until you integrate them

Worktree sessions use Bypass Approvals because the changes are already separated. Folder sessions expose whichever permission levels the selected harness supports. A worktree is a Git boundary, not a security boundary: it does not restrict commands or network access. For that, configure [agent sandboxing](https://code.visualstudio.com/docs/agents/concepts/trust-and-safety#_agent-sandboxing).

## Practical guidance

Use **Local** when the task depends on editor context: diagnostics, test results, the current selection, or a tool contributed by an extension. Local is also the only harness that can use any model you have configured in VS Code, including bring-your-own-key models.

Use **Copilot** for general coding work, background sessions in worktrees, Rubber Duck reviews, and anything you want to steer from GitHub Mobile or continue in Copilot CLI.

Use **Claude** when your team already has Claude Code conventions (hooks, subagents, memory files), when you want Claude's Plan permission mode, or when you need to bill some work to Anthropic credentials instead of Copilot.

Use **Codex** when you want OpenAI's Codex workflow and approval presets.

Use **Cloud** for well-scoped tasks that do not need your local environment and should arrive as a reviewable pull request.

Whatever you choose, evaluate harnesses the way you would evaluate models: same task, same repo, same model where possible, different harness. Keep notes on tool call quality, how often you had to intervene, and how well the agent respected your repository conventions.

## Recap

- The Session Target list in VS Code is a harness picker, not a model picker
- A harness owns prompts, tools, MCP wiring, permissions, and context management; the model is only one input
- Local, Copilot, Claude, and Codex are distinct harnesses; Cloud is an execution target
- The same Claude model behaves differently across harnesses because everything around it changes
- The Agent Host and AHP make multiple harnesses, shared sessions, remote execution, and handoff possible
- Compare harnesses deliberately, not just models

## References

- [Agent harnesses (concepts)](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses)
- [Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses)
- [VS Code Agent Host architecture](https://code.visualstudio.com/docs/agents/concepts/agent-host)
- [Agent Host Protocol](https://microsoft.github.io/agent-host-protocol/)
- [Approvals and permissions](https://code.visualstudio.com/docs/agents/run/approvals)
- [Sessions and handoff](https://code.visualstudio.com/docs/agents/concepts/sessions)
