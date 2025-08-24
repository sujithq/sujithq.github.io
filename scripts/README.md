# Dead Code Analyzer

A comprehensive tool for identifying unused code and dead files in this Hugo static site repository.

## Features

- **Hugo Layout Analysis**: Detects unused layouts, partials, and templates
- **JavaScript/TypeScript Import Tracking**: Identifies unused JS/TS modules
- **SCSS Import Analysis**: Finds unused stylesheets
- **PrismJS Language Component Detection**: Identifies unused syntax highlighting components
- **Duplicate File Detection**: Finds duplicate vendor files between assets/ and static/
- **Automatic Cleanup Script Generation**: Creates shell scripts for safe file removal
- **Comprehensive Reporting**: Detailed analysis with file sizes and potential savings

## Usage

### Basic Analysis
```bash
node scripts/dead-code-analyzer.js
```

### Generate Cleanup Scripts
```bash
node scripts/dead-code-analyzer.js --generate-cleanup
```

This will create a `cleanup-dead-code.sh` script that you can review and execute.

## What It Analyzes

### 1. Hugo Layouts and Partials
- Scans all HTML templates for `{{ partial "..." }}` and `{{ template "..." }}` references
- Identifies unused layout files
- Tracks `{{ resources.Get "..." }}` asset references

### 2. JavaScript/TypeScript Modules
- Analyzes ES6 imports (`import ... from "..."`)
- Tracks CommonJS requires (`require("...")`)
- Resolves relative and absolute import paths

### 3. SCSS Stylesheets
- Follows `@import` statements
- Handles SCSS partials (files starting with `_`)
- Resolves import paths with and without extensions

### 4. Markdown Content
- Scans for Hugo shortcode file references
- Identifies image references in markdown syntax
- Tracks asset usage in content files

### 5. PrismJS Components
- Analyzes code blocks in markdown for language usage
- Identifies unused syntax highlighting components
- Calculates potential space savings from removing unused languages

### 6. Vendor File Duplicates
- Detects files present in both `assets/vendor/` and `static/vendor/`
- Recommends keeping assets/ versions for Hugo processing

## Sample Output

```
📈 SUMMARY
   Total files analyzed: 756
   Referenced files: 115
   Potentially unused files: 692
   Duplicate files: 16
   Total size of unused files: 1.81 MB
   Potential space savings: 68.7%

🎨 UNUSED PRISMJS COMPONENTS (568)
   These language syntax highlighters appear to be unused:
   Potential savings: 1.18 MB

   abap            abnf            actionscript    ada            
   agda            al              antlr4          apacheconf     
   ...
```

## Safety Recommendations

Before running any cleanup scripts:

1. **Review the analysis results carefully** - Some files may be used by external themes or in ways the analyzer doesn't detect
2. **Test in a development environment first**
3. **Commit your changes before cleanup** - Easy to revert if needed
4. **Check Hugo build after cleanup** - Ensure the site still builds correctly
5. **Verify PrismJS language removal** - Make sure you won't need those languages in future posts

## Implementation Details

The analyzer works by:
1. Recursively scanning specified file patterns
2. Parsing file contents for import/reference patterns
3. Building a dependency graph of file references
4. Identifying files not referenced by any other files
5. Generating cleanup recommendations and scripts

## Limitations

- **Dynamic imports/requires**: May not detect dynamically constructed import paths
- **External theme dependencies**: Files used by external Hugo themes may appear unused
- **Runtime-only references**: Files loaded only at runtime (e.g., via AJAX) may not be detected
- **Comment-based references**: Files referenced only in comments are not tracked
- **Configuration-based loading**: Files loaded via Hugo configuration may not be detected

## Contributing

To improve the analyzer:
1. Add new file type patterns to `collectAllFiles()`
2. Implement additional reference detection patterns
3. Enhance the cleanup script generation
4. Add support for other static site generators

## License

This tool is part of the sujithq.github.io repository and follows the same license terms.