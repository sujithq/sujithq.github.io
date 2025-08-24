#!/usr/bin/env node
/**
 * Dead Code Analyzer for Hugo Static Site
 * Identifies potentially unused files and code in the repository
 * 
 * Usage: node scripts/dead-code-analyzer.js [--generate-cleanup]
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

// Simple glob replacement using built-in modules
function simpleGlob(pattern, options = {}) {
  const cwd = options.cwd || process.cwd();
  const results = [];
  
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(cwd, fullPath);
      
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively walk directories
          walk(fullPath);
        } else {
          // Check if file matches pattern
          if (matchesPattern(relativePath, pattern)) {
            results.push(relativePath);
          }
        }
      } catch (error) {
        // Skip files we can't read
        continue;
      }
    }
  }
  
  function matchesPattern(filePath, pattern) {
    // Convert glob pattern to regex
    const globToRegex = (glob) => {
      let regex = glob
        .replace(/\./g, '\\.')  // Escape dots
        .replace(/\*\*/g, '###DOUBLESTAR###')  // Temporarily replace **
        .replace(/\*/g, '[^/]*')  // Single * matches anything except /
        .replace(/###DOUBLESTAR###/g, '.*');  // ** matches anything including /
      
      return new RegExp(`^${regex}$`);
    };
    
    return globToRegex(pattern).test(filePath);
  }
  
  walk(cwd);
  return results;
}

class DeadCodeAnalyzer {
  constructor() {
    this.unusedFiles = [];
    this.referencedFiles = new Set();
    this.allFiles = new Set();
    this.fileReferences = new Map();
    this.duplicateFiles = [];
    this.generateCleanup = process.argv.includes('--generate-cleanup');
  }

  async analyze() {
    console.log('🔍 Starting Dead Code Analysis...\n');
    
    // Step 1: Collect all files
    await this.collectAllFiles();
    
    // Step 2: Analyze Hugo layouts and templates
    await this.analyzeHugoLayouts();
    
    // Step 3: Analyze JavaScript/TypeScript imports
    await this.analyzeJSImports();
    
    // Step 4: Analyze SCSS imports
    await this.analyzeScssImports();
    
    // Step 5: Analyze Markdown content references
    await this.analyzeMarkdownReferences();
    
    // Step 6: Detect duplicates
    await this.detectDuplicates();
    
    // Step 7: Check PrismJS usage
    await this.analyzePrismJSUsage();
    
    // Step 8: Analyze package.json and copy script
    await this.analyzeCopyScript();
    
    // Step 9: Generate report
    const results = this.generateReport();
    
    // Step 10: Generate cleanup script if requested
    if (this.generateCleanup) {
      this.generateCleanupScript(results);
    }
    
    return results;
  }

  async collectAllFiles() {
    console.log('📂 Collecting all files...');
    
    const patterns = [
      'assets/**/*.js',
      'assets/**/*.ts', 
      'assets/**/*.css',
      'assets/**/*.scss',
      'static/**/*.js',
      'static/**/*.css',
      'layouts/**/*.html',
      'content/**/*.md',
      'scripts/**/*.js'
    ];

    for (const pattern of patterns) {
      const files = simpleGlob(pattern, { cwd: REPO_ROOT });
      files.forEach(file => this.allFiles.add(file));
    }
    
    console.log(`   Found ${this.allFiles.size} files to analyze\n`);
  }

  async analyzeHugoLayouts() {
    console.log('🏗️  Analyzing Hugo layouts and partials...');
    
    const layoutFiles = simpleGlob('layouts/**/*.html', { cwd: REPO_ROOT });
    const referencedLayouts = new Set();
    
    for (const layoutFile of layoutFiles) {
      try {
        const content = fs.readFileSync(path.join(REPO_ROOT, layoutFile), 'utf8');
        
        // Find partial references: {{ partial "filename" }}
        const partialMatches = content.match(/\{\{\s*partial\s+"([^"]+)"/g);
        if (partialMatches) {
          partialMatches.forEach(match => {
            const partialName = match.match(/partial\s+"([^"]+)"/)[1];
            const partialPath = `layouts/partials/${partialName}.html`;
            referencedLayouts.add(partialPath);
            this.addReference(layoutFile, partialPath);
          });
        }
        
        // Find template references: {{ template "filename" }}
        const templateMatches = content.match(/\{\{\s*template\s+"([^"]+)"/g);
        if (templateMatches) {
          templateMatches.forEach(match => {
            const templateName = match.match(/template\s+"([^"]+)"/)[1];
            // Hugo internal templates often don't map to files
            if (!templateName.startsWith('_internal/')) {
              referencedLayouts.add(templateName);
              this.addReference(layoutFile, templateName);
            }
          });
        }

        // Find asset references: {{ resources.Get "..." }}
        const resourceMatches = content.match(/resources\.Get\s+"([^"]+)"/g);
        if (resourceMatches) {
          resourceMatches.forEach(match => {
            const resourcePath = match.match(/resources\.Get\s+"([^"]+)"/)[1];
            const fullPath = `assets/${resourcePath}`;
            this.addReference(layoutFile, fullPath);
          });
        }

        // Find with references: {{ $resource := resources.Get "..." }}
        const withMatches = content.match(/resources\.Get\s+['"]([^'"]+)['"]/g);
        if (withMatches) {
          withMatches.forEach(match => {
            const resourcePath = match.match(/resources\.Get\s+['"]([^'"]+)['"]/)[1];
            const fullPath = `assets/${resourcePath}`;
            this.addReference(layoutFile, fullPath);
          });
        }
      } catch (error) {
        console.log(`   Warning: Could not read ${layoutFile}: ${error.message}`);
      }
    }
    
    referencedLayouts.forEach(layout => this.referencedFiles.add(layout));
    console.log(`   Found ${referencedLayouts.size} referenced layouts\n`);
  }

  async analyzeJSImports() {
    console.log('📜 Analyzing JavaScript/TypeScript imports...');
    
    const jsFiles = [
      ...simpleGlob('assets/**/*.js', { cwd: REPO_ROOT }),
      ...simpleGlob('assets/**/*.ts', { cwd: REPO_ROOT })
    ];
    
    for (const jsFile of jsFiles) {
      try {
        const content = fs.readFileSync(path.join(REPO_ROOT, jsFile), 'utf8');
        
        // Find ES6 imports: import ... from "..."
        const importMatches = content.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g);
        if (importMatches) {
          importMatches.forEach(match => {
            const importPath = match.match(/from\s+['"]([^'"]+)['"]/)[1];
            this.resolveAndAddReference(jsFile, importPath);
          });
        }
        
        // Find require() calls
        const requireMatches = content.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g);
        if (requireMatches) {
          requireMatches.forEach(match => {
            const requirePath = match.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/)[1];
            this.resolveAndAddReference(jsFile, requirePath);
          });
        }
      } catch (error) {
        console.log(`   Warning: Could not read ${jsFile}: ${error.message}`);
      }
    }
    
    console.log(`   Analyzed ${jsFiles.length} JavaScript/TypeScript files\n`);
  }

  async analyzeScssImports() {
    console.log('🎨 Analyzing SCSS imports...');
    
    const scssFiles = simpleGlob('assets/**/*.scss', { cwd: REPO_ROOT });
    
    for (const scssFile of scssFiles) {
      try {
        const content = fs.readFileSync(path.join(REPO_ROOT, scssFile), 'utf8');
        
        // Find @import statements
        const importMatches = content.match(/@import\s+['"]([^'"]+)['"]/g);
        if (importMatches) {
          importMatches.forEach(match => {
            const importPath = match.match(/@import\s+['"]([^'"]+)['"]/)[1];
            this.resolveScssImport(scssFile, importPath);
          });
        }
      } catch (error) {
        console.log(`   Warning: Could not read ${scssFile}: ${error.message}`);
      }
    }
    
    console.log(`   Analyzed ${scssFiles.length} SCSS files\n`);
  }

  async analyzeMarkdownReferences() {
    console.log('📝 Analyzing Markdown content references...');
    
    const mdFiles = simpleGlob('content/**/*.md', { cwd: REPO_ROOT });
    
    for (const mdFile of mdFiles) {
      try {
        const content = fs.readFileSync(path.join(REPO_ROOT, mdFile), 'utf8');
        
        // Find Hugo shortcodes that might reference files
        const shortcodeMatches = content.match(/\{\{<[^>]*>\}\}/g);
        if (shortcodeMatches) {
          shortcodeMatches.forEach(match => {
            // Look for src= or other file references
            const srcMatch = match.match(/src\s*=\s*['"]([^'"]+)['"]/);
            if (srcMatch) {
              this.addReference(mdFile, srcMatch[1]);
            }
          });
        }
        
        // Find image references
        const imageMatches = content.match(/!\[[^\]]*\]\(([^)]+)\)/g);
        if (imageMatches) {
          imageMatches.forEach(match => {
            const imagePath = match.match(/!\[[^\]]*\]\(([^)]+)\)/)[1];
            if (!imagePath.startsWith('http')) {
              this.addReference(mdFile, imagePath);
            }
          });
        }
      } catch (error) {
        console.log(`   Warning: Could not read ${mdFile}: ${error.message}`);
      }
    }
    
    console.log(`   Analyzed ${mdFiles.length} Markdown files\n`);
  }

  async detectDuplicates() {
    console.log('🔍 Detecting duplicate files...');
    
    // Check for duplicates in assets vs static
    const assetFiles = simpleGlob('assets/vendor/**/*', { cwd: REPO_ROOT });
    const staticFiles = simpleGlob('static/vendor/**/*', { cwd: REPO_ROOT });
    
    for (const assetFile of assetFiles) {
      const assetPath = path.join(REPO_ROOT, assetFile);
      if (fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
        const relativePath = assetFile.replace('assets/vendor/', '');
        const potentialStaticDupe = `static/vendor/${relativePath}`;
        
        if (staticFiles.includes(potentialStaticDupe)) {
          this.duplicateFiles.push({
            file1: assetFile,
            file2: potentialStaticDupe,
            reason: 'Duplicate vendor file in assets and static'
          });
        }
      }
    }
    
    console.log(`   Found ${this.duplicateFiles.length} potential duplicates\n`);
  }

  async analyzePrismJSUsage() {
    console.log('✨ Analyzing PrismJS component usage...');
    
    const prismComponents = simpleGlob('static/components/prism-*.js', { cwd: REPO_ROOT });
    const usedLanguages = new Set();
    
    // Check content for language usage
    const mdFiles = simpleGlob('content/**/*.md', { cwd: REPO_ROOT });
    for (const mdFile of mdFiles) {
      try {
        const content = fs.readFileSync(path.join(REPO_ROOT, mdFile), 'utf8');
        
        // Find code blocks with language specifiers
        const codeBlockMatches = content.match(/```(\w+)/g);
        if (codeBlockMatches) {
          codeBlockMatches.forEach(match => {
            const lang = match.replace('```', '');
            usedLanguages.add(lang);
          });
        }
      } catch (error) {
        console.log(`   Warning: Could not read ${mdFile}: ${error.message}`);
      }
    }
    
    // Mark used PrismJS components as referenced
    prismComponents.forEach(component => {
      const componentName = path.basename(component, '.js').replace('prism-', '');
      if (usedLanguages.has(componentName) || 
          ['core', 'autoloader'].includes(componentName)) {
        this.referencedFiles.add(component);
        this.referencedFiles.add(component.replace('.js', '.min.js'));
      }
    });
    
    console.log(`   Found ${usedLanguages.size} used languages: ${Array.from(usedLanguages).sort().join(', ')}\n`);
  }

  async analyzeCopyScript() {
    console.log('📋 Analyzing copy script references...');
    
    try {
      const copyScriptPath = path.join(REPO_ROOT, 'scripts/copy-files.js');
      if (fs.existsSync(copyScriptPath)) {
        const content = fs.readFileSync(copyScriptPath, 'utf8');
        
        // Parse the filesToCopy array to see what gets copied from node_modules
        const copyMatches = content.match(/destination:\s*["']([^"']+)["']/g);
        if (copyMatches) {
          copyMatches.forEach(match => {
            const destination = match.match(/destination:\s*["']([^"']+)["']/)[1];
            // Mark destination directories as having content
            this.addReference('scripts/copy-files.js', destination);
          });
        }
      }
    } catch (error) {
      console.log(`   Warning: Could not analyze copy script: ${error.message}`);
    }
    
    console.log(`   Analyzed copy script references\n`);
  }

  resolveAndAddReference(fromFile, importPath) {
    // Handle relative imports
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      const fromDir = path.dirname(path.join(REPO_ROOT, fromFile));
      const resolvedPath = path.resolve(fromDir, importPath);
      const relativePath = path.relative(REPO_ROOT, resolvedPath);
      
      // Try different extensions
      const extensions = ['', '.js', '.ts'];
      for (const ext of extensions) {
        const fullPath = relativePath + ext;
        if (this.allFiles.has(fullPath)) {
          this.addReference(fromFile, fullPath);
          return;
        }
      }
    }
    
    // Handle absolute paths from assets root
    if (!importPath.startsWith('.')) {
      const assetPath = `assets/${importPath}`;
      if (this.allFiles.has(assetPath)) {
        this.addReference(fromFile, assetPath);
      }
    }
  }

  resolveScssImport(fromFile, importPath) {
    // Handle SCSS imports (with or without extension, with or without underscore)
    const baseDir = path.dirname(fromFile);
    const extensions = ['', '.scss', '.css'];
    const prefixes = ['', '_'];
    
    for (const prefix of prefixes) {
      for (const ext of extensions) {
        const fileName = prefix + path.basename(importPath) + ext;
        const fullPath = path.join(baseDir, path.dirname(importPath), fileName);
        const relativePath = path.relative(REPO_ROOT, path.resolve(REPO_ROOT, fullPath));
        
        if (this.allFiles.has(relativePath)) {
          this.addReference(fromFile, relativePath);
          return;
        }
      }
    }
  }

  addReference(fromFile, toFile) {
    this.referencedFiles.add(toFile);
    
    if (!this.fileReferences.has(fromFile)) {
      this.fileReferences.set(fromFile, []);
    }
    this.fileReferences.get(fromFile).push(toFile);
  }

  generateReport() {
    console.log('📊 Generating Dead Code Analysis Report\n');
    console.log('=' .repeat(80));
    console.log('DEAD CODE ANALYSIS REPORT');
    console.log('=' .repeat(80));
    
    // Calculate unused files
    const unusedFiles = Array.from(this.allFiles).filter(file => !this.referencedFiles.has(file));
    
    // Calculate file sizes
    const getFileSize = (filePath) => {
      try {
        const stats = fs.statSync(path.join(REPO_ROOT, filePath));
        return stats.size;
      } catch {
        return 0;
      }
    };
    
    const totalUnusedSize = unusedFiles.reduce((total, file) => total + getFileSize(file), 0);
    const totalSize = Array.from(this.allFiles).reduce((total, file) => total + getFileSize(file), 0);
    
    console.log(`\n📈 SUMMARY`);
    console.log(`   Total files analyzed: ${this.allFiles.size}`);
    console.log(`   Referenced files: ${this.referencedFiles.size}`);
    console.log(`   Potentially unused files: ${unusedFiles.length}`);
    console.log(`   Duplicate files: ${this.duplicateFiles.length}`);
    console.log(`   Total size of unused files: ${(totalUnusedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Potential space savings: ${((totalUnusedSize / totalSize) * 100).toFixed(1)}%`);
    
    if (unusedFiles.length > 0) {
      console.log(`\n🗑️  POTENTIALLY UNUSED FILES (${unusedFiles.length})`);
      
      // Group by directory for better organization
      const byDirectory = {};
      unusedFiles.forEach(file => {
        const dir = path.dirname(file);
        if (!byDirectory[dir]) byDirectory[dir] = [];
        byDirectory[dir].push({
          file: path.basename(file),
          path: file,
          size: getFileSize(file)
        });
      });
      
      Object.keys(byDirectory).sort().forEach(dir => {
        const dirFiles = byDirectory[dir].sort((a, b) => b.size - a.size);
        const dirSize = dirFiles.reduce((total, f) => total + f.size, 0);
        console.log(`\n   📁 ${dir}/ (${(dirSize/1024).toFixed(1)}KB total)`);
        
        // Show top 10 files per directory to avoid overwhelming output
        dirFiles.slice(0, 10).forEach(({ file, path: filePath, size }) => {
          const sizeStr = size > 1024 ? `${(size/1024).toFixed(1)}KB` : `${size}B`;
          console.log(`      • ${file} (${sizeStr})`);
        });
        
        if (dirFiles.length > 10) {
          console.log(`      ... and ${dirFiles.length - 10} more files`);
        }
      });
    }
    
    if (this.duplicateFiles.length > 0) {
      console.log(`\n📋 DUPLICATE FILES (${this.duplicateFiles.length})`);
      this.duplicateFiles.forEach(({ file1, file2, reason }) => {
        const size1 = getFileSize(file1);
        const size2 = getFileSize(file2);
        console.log(`   • ${file1} ↔ ${file2}`);
        console.log(`     ${reason} (${(Math.max(size1, size2)/1024).toFixed(1)}KB each)`);
      });
    }
    
    // PrismJS specific analysis
    const prismComponents = Array.from(this.allFiles).filter(f => f.includes('static/components/prism-'));
    const unusedPrismComponents = prismComponents.filter(f => !this.referencedFiles.has(f));
    
    if (unusedPrismComponents.length > 0) {
      console.log(`\n🎨 UNUSED PRISMJS COMPONENTS (${unusedPrismComponents.length})`);
      console.log(`   These language syntax highlighters appear to be unused:`);
      
      const prismSize = unusedPrismComponents.reduce((total, file) => total + getFileSize(file), 0);
      console.log(`   Potential savings: ${(prismSize / 1024 / 1024).toFixed(2)} MB\n`);
      
      const languages = [...new Set(unusedPrismComponents.map(f => 
        path.basename(f, path.extname(f)).replace('prism-', '').replace('.min', '')
      ))].sort();
      
      // Show in columns
      for (let i = 0; i < languages.length; i += 4) {
        const row = languages.slice(i, i + 4);
        console.log(`   ${row.map(lang => lang.padEnd(15)).join(' ')}`);
      }
    }
    
    console.log(`\n💡 RECOMMENDATIONS`);
    console.log(`   1. Review unused files before deletion - some may be used by external themes`);
    console.log(`   2. Remove duplicate vendor files (keep assets/ version for Hugo processing)`);
    console.log(`   3. Consider removing unused PrismJS language components`);
    console.log(`   4. Check if any unused layouts can be safely removed`);
    console.log(`   5. Unused SCSS files might be theme overrides - verify before removal`);
    console.log(`   6. Use --generate-cleanup flag to create automated cleanup scripts`);
    
    console.log('\n' + '='.repeat(80));
    
    return {
      totalFiles: this.allFiles.size,
      referencedFiles: this.referencedFiles.size,
      unusedFiles: unusedFiles.length,
      duplicateFiles: this.duplicateFiles.length,
      potentialSavings: totalUnusedSize,
      unusedFilesList: unusedFiles,
      unusedPrismComponents,
      duplicateFilesList: this.duplicateFiles
    };
  }

  generateCleanupScript(results) {
    console.log('\n🧹 Generating cleanup scripts...\n');
    
    const cleanupScript = [];
    cleanupScript.push('#!/bin/bash');
    cleanupScript.push('# Auto-generated cleanup script for dead code removal');
    cleanupScript.push('# Review each command before running!');
    cleanupScript.push('');
    cleanupScript.push('set -e  # Exit on any error');
    cleanupScript.push('');
    
    // Remove duplicate static vendor files (keep assets versions)
    if (results.duplicateFilesList.length > 0) {
      cleanupScript.push('# Remove duplicate vendor files (keeping assets/ versions)');
      results.duplicateFilesList.forEach(({ file2 }) => {
        cleanupScript.push(`rm -f "${file2}"`);
      });
      cleanupScript.push('');
    }
    
    // Remove unused PrismJS components
    if (results.unusedPrismComponents.length > 0) {
      cleanupScript.push('# Remove unused PrismJS language components');
      results.unusedPrismComponents.forEach(component => {
        cleanupScript.push(`rm -f "${component}"`);
      });
      cleanupScript.push('');
    }
    
    const scriptPath = path.join(REPO_ROOT, 'cleanup-dead-code.sh');
    fs.writeFileSync(scriptPath, cleanupScript.join('\n'));
    fs.chmodSync(scriptPath, '755');
    
    console.log(`   ✅ Generated cleanup script: ${scriptPath}`);
    console.log(`   ⚠️  Review the script carefully before running!`);
    console.log(`   📊 Potential space savings: ${(results.potentialSavings / 1024 / 1024).toFixed(2)} MB`);
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new DeadCodeAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = DeadCodeAnalyzer;