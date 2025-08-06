
---
applyTo: "content/posts/*/index.md"
---

# Blog Post Writing Guidelines

## Content Standards

- Write in clear, technical, and actionable language.
- Use British English spelling.
- Structure posts with headings, bullet lists, and code blocks for clarity.
- Use proper language identifiers for code blocks.
- Avoid long dashes (—); use colons or periods for explanations.
- Keep file and folder names lowercase and hyphenated.
- Reference official documentation when possible.
- End with a short recap or next steps section if relevant.

## Frontmatter Requirements

### Critical Format Standards
- **Date Format**: Use `'YYYY-MM-DD HH:MM:SSZ'` format with 'Z' suffix (not timezone offsets like `+00:00`)
- **Current Dates Only**: Folder dates must be current or future - never use past dates for new posts
- **Quote Consistency**: Use double quotes for `layout = "single"` and `author = "sujith"`
- **Folder Naming**: Must match date in frontmatter exactly: `YYYY-MM-DD-descriptive-slug`

### Required Fields
Use TOML front matter with at least: `title`, `slug`, `date`, `lastmod`, `draft`, `tags`, `categories`, `series`, `layout`, `cover`, `author`, `description`.

### Format Example
```toml
+++
title = 'Engaging Title with Emoji (≤50 chars)'
slug = 'descriptive-slug-matching-folder'
date = '2025-MM-DD HH:MM:SSZ'
lastmod = '2025-MM-DD HH:MM:SSZ'
draft = false
tags = ["Technology", "Specific-Topic"]
categories = ["Category"]
series = ["Series Name"]

layout = "single"
[params]
    cover = true
    author = "sujith"
    
description = "Concise summary, ≤150 characters"
+++
```

## Content Quality Standards

### Title & Description
- Title: Short, clear, and ≤50 characters.
- Description: Concise summary, ≤150 characters.

### Technical Accuracy Requirements
- **Code Examples**: All code must be production-ready and follow current best practices
- **Documentation Links**: Always reference latest official documentation
- **Version Specificity**: Specify exact versions for Docker images, NuGet packages, dependencies
- **Error Handling**: Include proper exception handling and troubleshooting guidance

### Docker Best Practices
- When `dotnet restore` is done in previous layer, use `--no-restore` in publish step:
```dockerfile
# Copy and restore dependencies first (better layer caching)
COPY *.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app \
    --runtime linux-x64 \
    --self-contained false \
    --no-restore \
    /p:PublishTrimmed=true \
    /p:TrimMode=partial
```

### Markdown Compliance
- **MD032**: Always add blank lines before and after lists
- **MD031**: Always add blank lines before and after fenced code blocks
- Example:
```markdown
Text before list

- List item 1
- List item 2

Text after list

```code
Block content
```

Text after code block
```

## Image Handling

- Add a cover image using the `cover` parameter and set `cover = true` in params
- Store all other images in an `img` directory inside the post folder (e.g., `content/posts/<slug>/img/`)
- When using images in the post, use the Hugo shortcode: `{{< image src="img/name.png" caption="<caption>" alt="<alt>" >}}`
- Ensure all images have appropriate alt text for accessibility
- Ensure all images have appropriate caption text for context

## Version Currency Standards

Always verify and use latest stable versions:
- .NET: `mcr.microsoft.com/dotnet/sdk:9.0` (or current latest)
- Azure CLI: Check latest version in documentation
- Terraform providers: Use latest stable versions
- NuGet packages: Specify exact version numbers

## Troubleshooting Common Issues

### Blog Creation Workflow Problems

**Folder Renaming in Windows/WSL**
- **Issue**: Windows path issues when renaming folders
- **Solution**: Use WSL paths: `/mnt/c/Users/...` instead of `c:\Users\...`
- **Command**: `cd "/mnt/c/path/to/posts" && mv "old-folder" "new-folder"`

**Frontmatter Validation Errors**
- **Issue**: Inconsistent quote styles or date formats
- **Solution**: Follow the frontmatter standards above
  - Use `"double quotes"` for layout and author
  - Use `'2025-MM-DD HH:MM:SSZ'` for dates
  - Ensure blank line before description in params

**Markdown Linting Failures**
- **Issue**: MD032 (lists) and MD031 (code blocks) errors
- **Solution**: Follow the markdown compliance examples above
