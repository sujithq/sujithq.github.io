# Post Mode Setup Instructions

## What I've Created

I've created a comprehensive "Post Mode" chat mode specifically designed for your sujithq.github.io blog. This mode combines the autonomous capabilities of Beast Mode with specialized knowledge about your blog's structure, writing style, and technical focus areas.

## Location

The Post Mode file has been created at:

```text
.github/chatmodes/Post.chatmode.md
```

## Installation for VS Code

To use this mode in VS Code, copy the file to your VS Code prompts directory:

### Windows (your setup)

```bash
cp ".github/chatmodes/Post.chatmode.md" "$env:APPDATA/Code/User/prompts/Post.chatmode.md"
```

### Alternative manual method

1. Navigate to: `C:\Users\SujithQuintelier\AppData\Roaming\Code\User\prompts\`
2. Copy the file `Post.chatmode.md` from your `.github/chatmodes/` folder
3. Restart VS Code to see the new chat mode

## Key Features

### 🎯 Intelligent Content Creation

- **Topic Research**: Automatically researches current trends and official documentation
- **Content Planning**: Creates structured outlines with learning progressions
- **Technical Writing**: Generates posts with proper code examples and troubleshooting
- **Hugo Integration**: Handles front matter, folder structure, and taxonomy

### 🔍 Content Intelligence

- **Gap Analysis**: Identifies missing topics in your existing content
- **Series Planning**: Designs multi-part tutorial series
- **Cross-referencing**: Links to related existing posts
- **SEO Optimization**: Optimizes titles, descriptions, and internal linking

### 🛠️ Technical Accuracy

- **Code Validation**: Tests all code examples before inclusion
- **Documentation Links**: Always references official Microsoft/GitHub docs
- **Best Practices**: Incorporates security, performance, and scalability guidance
- **Troubleshooting**: Includes common issues and solutions

### 📝 Writing Standards

- **Educational Focus**: Every post teaches something valuable
- **British English**: Maintains your preferred spelling conventions
- **Clear Structure**: Uses logical progression and formatting
- **Professional Tone**: Friendly but authoritative technical voice

## Usage Modes

### 1. Topic Suggestions

```text
Suggest post topics
```

Analyzes current trends and content gaps to suggest 5-10 relevant topics.

### 2. Full Post Creation

```text
Create post about [topic]
```

Researches and writes complete blog posts with proper structure and code examples.

### 3. Post Enhancement

```text
Enhance existing post [title/slug]
```

Reviews and improves existing content with updates and additional examples.

### 4. Series Planning

```text
Plan series on [topic]
```

Designs multi-part tutorial series with logical progression.

### 5. Research Mode

```text
Research [specific technology/update]
```

Investigates latest features and suggests practical implementation posts.

## Example Commands

- `"Create a post about Azure Container Apps security best practices"`
- `"Suggest posts for January 2025"`
- `"Plan a series on GitHub Advanced Security"`
- `"Research the latest Azure AI updates"`
- `"Enhance existing post about federated credentials"`

## Quality Assurance

The mode includes built-in quality checks:

- ✅ All code examples tested and functional
- ✅ Links verified and current
- ✅ Grammar and spelling (British English)
- ✅ SEO metadata optimized
- ✅ Technical accuracy validated
- ✅ Cross-references added

## Integration with Your Blog

Post Mode understands your blog's specific requirements:

- **Hugo Structure**: Proper TOML front matter and folder organization
- **Your Writing Style**: Matches your educational and practical approach
- **Technical Focus**: Specialized in Azure, DevOps, GitHub, and cloud architecture
- **Audience Awareness**: Adapts content for different skill levels
- **Series Continuity**: Maintains consistency across multi-part tutorials

## Beast Mode DNA

This mode inherits the best aspects of Beast Mode 3.1:

- **Autonomous Execution**: Completes tasks without constant guidance
- **Extensive Research**: Uses web search and official documentation
- **Quality Iteration**: Refines content until standards are met
- **Clear Communication**: Provides updates during lengthy operations

## Next Steps

1. Copy the file to your VS Code prompts directory
2. Restart VS Code
3. Select "Post Mode" from the chat mode dropdown
4. Start creating amazing content!

The mode is ready to help you create high-quality, technically accurate blog posts that serve your readers and enhance your blog's reputation as a valuable resource for Azure, DevOps, and GitHub practitioners.
