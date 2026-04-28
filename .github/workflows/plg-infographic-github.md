---
name: PLG Infographic Generator
description: Multi-agent workflow to generate and validate a PLG-style infographic from GitHub profile README
on:
  workflow_dispatch:
  push:
    paths:
      - README.md

permissions: read-all

tools:
  github:
    toolsets: [default]

metadata:
  inputs:
    - README.md
  outputs:
    - docs/infographic.html

  agents:
    planner:
      role: Analyse README and extract structured content
    generator:
      role: Generate infographic HTML
    reviewer:
      role: Validate output

  orchestration:
    strategy: sequential
    flow:
      - planner -> generator -> reviewer

  quality_gates:
    - no_fabrication
    - deterministic_output
    - professional_tone

  tags:
    - agentic-workflow
    - plg
    - infographic
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
