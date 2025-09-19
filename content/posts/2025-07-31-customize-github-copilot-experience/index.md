+++
title = '🛠️ GitHub Copilot: Custom Instructions, Prompts & Chats'
slug = 'customize-github-copilot-experience'
date = '2025-07-31 06:00:00Z'
lastmod = '2025-09-19 06:00:00Z'
draft = false
tags = ["GitHub Copilot", "VS Code", "AI Programming", "Copilot Customization", "Productivity"]
categories = ["AI", "Development Tools", "GitHub"]
series = [ ]

layout = 'single'
audio = false
[params]
    cover = true
    author = 'sujith'

description = "A practical guide to customizing GitHub Copilot in VS Code: repository instructions, file-specific rules, reusable prompts, and custom chat modes."
+++

## 🛠️ Customizing Your GitHub Copilot Experience: Instructions, Prompts, and Chat Modes

GitHub Copilot is more than just an autocomplete tool—it's a powerful AI assistant you can tailor to your team's needs. With the latest features in VS Code, you can now define custom instructions, prompts, and chat modes to make Copilot work exactly the way you want.

This post walks you through customizing Copilot for your projects, with hands-on steps, theory, and examples. Let's dive in!

{{< notice-card info "Update (2025‑08‑29)" >}}
The Copilot Coding Agent now supports repository‑level custom instructions via `.github/agents.md`. See the new section below and the official changelog: <https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/>
{{< /notice-card >}}

### 📝 Step 1: Repository Custom Instructions

**Repository custom instructions** let you guide Copilot with project-specific context and standards. By adding a `.github/copilot-instructions.md` file, you ensure Copilot's suggestions match your conventions.

**Theory:**

- Instructions are automatically included in every Copilot Chat request in your repo.
- Keep them short and focused: project purpose, folder structure, coding standards, and key tools.
- [Docs: Adding repository custom instructions](https://docs.github.com/en/copilot/how-tos/custom-instructions/adding-repository-custom-instructions-for-github-copilot)

**Example:**

```markdown
# Project Description
This project is an educational website for sharing homework assignments and coding exercises with students.


## Project Structure
- `assignments/`: Contains a subfolder for each homework assignment.
- `templates/`: Stores reusable templates for new content.
- `assets/`: Holds CSS, JavaScript, images, and configuration files.
- `index.html`: The main website page, configurable via `config.json`.


## Project Guidelines
- Use consistent styling across all pages.
- Name files and folders descriptively and keep them organized.


## Educational Standards
- Focus on clear learning objectives and appropriate difficulty levels.
- Use language that is clear, encouraging, and student-friendly.
```

**How to:**

1. Create `.github/copilot-instructions.md` in your repository.
2. Add your project description, structure, guidelines, and standards.
3. Test by asking Copilot Chat: `Briefly explain this project to me`. Your instructions should be referenced in the response.

---

### 📂 Step 2: File-Specific Instructions

**File-specific instructions** (`.instructions.md`) let you target rules to certain files or folders using glob patterns. Place them in `.github/instructions/`.

**Theory:**

- Use `applyTo` in the frontmatter to specify which files the instructions apply to.
- Focus on *how* tasks should be done in that part of the codebase.
- [Docs: Custom Instructions](https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions)

**Example:**

```markdown
---
applyTo: "assignments/**/*.md"
---
# Assignment Markdown Structure Guidelines


## 1. Template Usage
- Use the structure from `templates/assignment-template.md` for all assignments.
- Each assignment should be a `README.md` file.
- Do not remove or skip any required sections from the template.


## 2. Section Guidance
- **Title**: Provide a short, descriptive name for the assignment.
- **Objective**: Write 1-2 sentences summarizing what the student will learn or accomplish.
- **Tasks**: Use action-oriented task names, clear requirements, and provide example input/output if helpful.
```

**How to:**

1. Create `.github/instructions/assignments.instructions.md`.
2. Add your assignment structure and section rules.
3. Open an assignment file and ask Copilot Chat to update it to match the template.
4. Commit your instructions and the updated assignment file.

---

### ⚡ Step 3: Reusable Prompts

**Prompt files** (`.prompt.md`) are reusable templates for common tasks, accessible via slash commands in Copilot Chat. Place them in `.github/prompts/`.

**Theory:**

- Use prompts for repeatable workflows (e.g., creating new assignments).
- Reference other files with relative links.
- [Docs: Prompt Files](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental)

**Example:**

```markdown
---
mode: agent
description: Create a new programming homework assignment
---
# Create New Programming Assignment

## Step 1: Gather Assignment Information
Ask for the assignment topic if not provided.


## Step 2: Create Assignment Structure
- Create a new directory in `assignments/` for the assignment.
- Add a `README.md` file using the template.
- Fill out the assignment details and add starter code if needed.


## Step 3: Update Website Configuration
- Update `config.json` to include the new assignment. Set the due date to the current date plus 7 days, unless specified otherwise.
```

**How to:**

1. Create `.github/prompts/new-assignment.prompt.md`.
2. Add your prompt steps and description.
3. Use `/new-assignment` in Copilot Chat to trigger the workflow.
4. Review and commit the generated files.

---

### 💬 Step 4: Custom Chat Modes

**Chat modes** (`.chatmode.md`) let you define specialized Copilot personalities and workflows. Place them in `.github/chatmodes/`.

**Theory:**

- Chat modes can restrict tools, set response formats, and maintain a unique personality.
- [Docs: Custom Chat Modes](https://code.visualstudio.com/docs/copilot/chat/chat-modes#_custom-chat-modes)

**Example:**

```markdown
---
description: 💡 Assignment brainstorming assistant for Mr. Johnson's CS class
tools: ["codebase", "search"]
---
# 💡 Assignment Brainstorming Assistant

## My Response Style

- QUICK SCAN: Provide a brief analysis of existing assignments.
- IDEA BURST: Suggest 3-5 new assignment ideas quickly.
- NEXT QUESTION: Ask what information is needed to help further.

## Rules

- Keep responses short.
- Always end with a question.
- Focus on concepts, not details.
- Never write full assignment specifications.
- Base ideas on gaps in the current curriculum.
```

**How to:**

1. Create `.github/chatmodes/assignment-brainstorming.chatmode.md`.
2. Add your description, tools, response style, and rules.
3. Select your chat mode in Copilot Chat and try brainstorming questions.

---

## 🧠 New (Aug 2025): agents.md for Copilot Coding Agent

The Copilot Coding Agent now reads repository‑level guidance from `.github/agents.md`. Use it to set policies, guardrails, and preferences the agent should follow when making changes across your codebase.

**Theory:**

- Place `.github/agents.md` at the root of your repository.
- Keep guidance actionable: preferred tools, change policies, testing and security rules.
- Use clear sections and bullet points; the agent consumes plain markdown.
- This augments per‑file instructions and chat modes; use `agents.md` for repo‑wide defaults.

For full reference documentation, schema examples, and community-maintained guidance, see the canonical agents.md site: [https://agents.md/](https://agents.md/). It includes detailed examples of agent policies, capability declarations, and structured guidance you can drop into `.github/agents.md`.

**Example (`.github/agents.md`):**

```markdown
# Copilot Coding Agent – Repository Instructions

## Goals
- Maintain code quality, tests, and security while implementing changes.

## Tools and Preferences
- Prefer: TypeScript, pnpm, ESLint, Prettier.
- Avoid: Global installs; use repo scripts and lockfiles.

## Change Management
- Make minimal, focused diffs.
- Update docs and tests with code changes.
- For multi-file refactors, open a PR with a concise summary and checklist.

## Testing & CI
- Run unit tests locally before proposing changes.
- Honour existing CI scripts: `pnpm test`, `pnpm lint`.

## Security
- Do not add credentials or plaintext secrets.
- Use environment variables and existing secret stores.

## Communication
- Explain the rationale for non-trivial changes in commit/PR descriptions.
```

**How to:**

1. Create `.github/agents.md` in your repository root.
2. Add repository‑wide rules (tools, change policies, test/security requirements).
3. Commit and push; then ask the Copilot Coding Agent to perform a task (e.g., “upgrade eslint and fix lint issues”). It will follow `agents.md`.
4. Iterate as needed; keep guidance short, specific, and enforceable.

---

## 🎉 Recap

By combining repository instructions, file-specific rules, reusable prompts, and custom chat modes, you can make GitHub Copilot a true teammate. It will understand your project, enforce your standards, and help accelerate your workflow.

**Next steps:**

- Try these features in your own projects.
- Explore more on [GitHub Docs](https://docs.github.com/en/copilot/how-tos/custom-instructions/adding-repository-custom-instructions-for-github-copilot) and [VS Code Docs](https://code.visualstudio.com/docs/copilot/copilot-customization)

Happy customizing! 🚀
