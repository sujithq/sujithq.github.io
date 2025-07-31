
---
applyTo: "content/posts/*/index.md"
---

# Blog Post Writing Guidelines

- Use TOML front matter with at least: `title`, `slug`, `date`, `draft`, `tags`, `categories`, `description`, and `cover`.
- Title: Short, clear, and ≤50 characters.
- Description: Concise summary, ≤150 characters.
- Write in clear, technical, and actionable language.
- Use British English spelling.
- Structure posts with headings, bullet lists, and code blocks for clarity.
- Use proper language identifiers for code blocks.
- Avoid long dashes (—); use colons or periods for explanations.
- Keep file and folder names lowercase and hyphenated.
- Reference official documentation when possible.
- End with a short recap or next steps section if relevant.
- Add a cover image using the `cover` parameter (e.g., `cover = "cover.jpg"`), and place the image in the same folder as the post.
- Store all other images in an `img` directory inside the post folder (e.g., `content/posts/<slug>/img/`).
- When using images in the post, use the Hugo shortcode: `{{< image src="img/name.png" caption="<caption>" alt="<alt>" >}}`.
- Ensure all images have appropriate alt text for accessibility.
- Ensure all images have appropriate caption text for context.
