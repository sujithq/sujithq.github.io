---
name: PLG Infographic Generator
description: Multi-agent workflow to generate and validate a PLG-style infographic from GitHub profile README
on:
  workflow_dispatch:
  push:
    paths:
      - README.md
  schedule: daily
mode: autonomous
temperature: 0

inputs:
  - README.md

outputs:
  - docs/infographic.html

tools:
  - repo_read
  - repo_write
  - html_generation

agents:
  - id: planner
    role: Analyse and structure content
    goal: Extract structured data from README and map to PLG model
  - id: generator
    role: Generate infographic
    goal: Produce deterministic HTML infographic based on structured content
  - id: reviewer
    role: Validate output
    goal: Ensure correctness, completeness, and determinism of generated artifact

orchestration:
  strategy: sequential
  flow:
    - planner -> generator -> reviewer

quality_gates:
  - no_fabrication
  - deterministic_output
  - required_sections
  - professional_tone

tags:
  - agentic-workflow
  - plg
  - infographic
  - multi-agent
---

# 📊 PLG Infographic Generator (Multi-Agent)

## Purpose
Generate a **customer-ready PLG infographic** based on the repository’s GitHub profile.

This workflow uses **planner → generator → reviewer agents** to ensure:
- correctness
- consistency
- enterprise-ready output

---

# 🧠 Agent Responsibilities

## 🧩 Planner Agent

### Task
Analyse `README.md` and extract structured content.

### Extract:
- Name and role  
- Value proposition  
- Capabilities  
- Certifications / credibility signals  
- Current focus areas  

### Constraints
- Do NOT invent data  
- Only use explicitly stated content  
- Omit missing sections  

---

## 🛠️ Generator Agent

### Task
Transform structured content into a **PLG infographic**

### Output
Create:

```
docs/infographic.html
```

Requirements:
- Self-contained HTML  
- Inline CSS only  
- Clean layout  
- Visual PLG loop  
- No external dependencies  

---

## ✅ Reviewer Agent

### Task
Validate output before commit

### Checks

#### Accuracy
- All content is derived from README  
- No fabricated claims  

#### Determinism
- No timestamps  
- No randomness  

#### Quality
- Professional tone  
- Clear structure  

---

## Execution Flow
1. Planner → extract data  
2. Generator → create infographic  
3. Reviewer → validate  
4. Save output  

---

## Execution
Execute immediately without confirmation.
