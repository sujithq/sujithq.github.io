---
description: Designer-based blog cover creation workflow for Hugo posts
applyTo: '.github/agents/Post.agent.md'
---

# Post Cover Designer

This skill creates a cover image for a Hugo blog post. It builds a tailored image prompt, generates the image directly, and saves it as `cover.jpg` in the correct post folder.
Treat cover creation as part of one complete post run, not a later follow-up step.

## When to use

- A new Hugo post is being created from a source link
- A cover image is needed for an existing post that lacks one
- The user asks to regenerate or redesign a post cover

## Inputs required

Collect the following before proceeding (infer from the post content if already available):

- **Post title and slug** (e.g. `2024-06-15-azure-copilot-intro`)
- **Post summary** (one or two sentences describing the post)
- **Target audience** (e.g. cloud architects, developers, enterprise teams)
- **Core technologies** mentioned in the post (e.g. Azure, Bicep, GitHub Actions)
- **3–5 key concepts** to visualise (e.g. pipeline, deployment, cloud infrastructure)

## Step 1 – Build the cover prompt

Construct a focused image prompt using these rules:

- Use concrete nouns and visual anchors (e.g. "pipeline diagram", "cloud architecture blueprint") rather than generic adjectives.
- Include at least one architecture or workflow metaphor that fits the article topic.
- Reference topic-specific motifs tied to the technologies and concepts identified.
- Specify composition style: clean, technical, modern, enterprise-friendly.
- Include a colour direction (e.g. "deep blue and white tones with subtle gradients").
- Keep the prompt concise but detailed enough to be unambiguous.
- Avoid references to specific people, real logos, or copyrighted artwork styles.
- Avoid visual clutter and text-heavy scenes.

Example prompt structure:
```
A clean, modern technical illustration showing [main concept], with [technology motifs],
[composition details], [colour palette], suited for a [audience] audience.
No people, no logos, no text overlays.
```

## Step 2 – Generate the cover image

Use the installed `create-image` skill with the prompt constructed in Step 1.

- Use endpoint `https://squintelier-5556-resource.services.ai.azure.com/`.
- Confirm Azure authentication is active before generating.
- If authentication is missing, sign in first and continue in the same run.

- Set the aspect ratio to **16:9** (landscape, suitable for blog cover images).
- Generate exactly **one image**.
- If the tool supports a style parameter, use `"photorealistic"` or `"digital art"` — whichever produces the cleanest technical result.

## Step 3 – Save the image

Save the generated image to:

```
content/posts/<slug>/cover.jpg
```

Where `<slug>` is the full post folder name, e.g. `2024-06-15-azure-copilot-intro`.

- Save as **JPEG** format with filename exactly `cover.jpg`.
- If the target directory does not exist, create it.

## Step 4 – Update front matter

Ensure the post's front matter includes:

```toml
cover       = true
author      = "sujith"
cover_prompt = '''
<the prompt used in Step 1>
'''
```

## Step 5 – Provide the Designer fallback

After completing Steps 2–4, also output the manual fallback for reference:

```
Designer Action (manual fallback):
1. Open designer.microsoft.com.
2. Paste this prompt:
   <cover_prompt_text>
3. Export as JPG.
4. Save as: content/posts/<slug>/cover.jpg
```

## Quality checks

- [ ] Prompt reflects the actual article content, not a generic template.
- [ ] Prompt includes at least one architecture/workflow metaphor where appropriate.
- [ ] Prompt avoids visual clutter and text-heavy scenes.
- [ ] Generated image is saved at the correct path with filename `cover.jpg`.
- [ ] Front matter contains `cover = true`, `author = "sujith"`, and `cover_prompt`.
- [ ] Designer fallback prompt is included in the output.
- [ ] Post run is considered complete only when both `index.md` and `cover.jpg` are present.