#!/usr/bin/env node

/**
 * Simple validation script for agentic workflow markdown files
 * Checks that the frontmatter is valid YAML and contains required fields
 */

const fs = require('fs');
const path = require('path');

function validateWorkflow(filePath) {
  console.log(`\n📋 Validating: ${path.basename(filePath)}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Find frontmatter boundaries
  const firstDivider = lines.findIndex(line => line.trim() === '---');
  const secondDivider = lines.findIndex((line, idx) => idx > firstDivider && line.trim() === '---');
  
  if (firstDivider === -1 || secondDivider === -1) {
    console.error('❌ ERROR: Invalid frontmatter - missing --- dividers');
    return false;
  }
  
  const frontmatter = lines.slice(firstDivider + 1, secondDivider).join('\n');
  const instructions = lines.slice(secondDivider + 1).join('\n');
  
  // Basic checks
  const checks = [
    { name: 'Has name field', test: () => frontmatter.includes('name:') },
    { name: 'Has description field', test: () => frontmatter.includes('description:') },
    { name: 'Has on (trigger) field', test: () => frontmatter.includes('on:') },
    { name: 'Has permissions field', test: () => frontmatter.includes('permissions:') },
    { name: 'Has engine field', test: () => frontmatter.includes('engine:') },
    { name: 'Has tools field', test: () => frontmatter.includes('tools:') },
    { name: 'Has steps field', test: () => frontmatter.includes('steps:') },
    { name: 'Has instructions section', test: () => instructions.length > 100 },
    { name: 'Instructions contain headers', test: () => instructions.includes('##') },
  ];
  
  let allPassed = true;
  checks.forEach(check => {
    const passed = check.test();
    console.log(passed ? `✅ ${check.name}` : `❌ ${check.name}`);
    if (!passed) allPassed = false;
  });
  
  // Count lines
  console.log(`\n📊 Stats:`);
  console.log(`   Frontmatter: ${secondDivider - firstDivider - 1} lines`);
  console.log(`   Instructions: ${lines.length - secondDivider - 1} lines`);
  console.log(`   Total: ${lines.length} lines`);
  
  return allPassed;
}

// Main execution
const workflowPath = process.argv[2] || '.github/workflows/security-advisory-responder.md';
const fullPath = path.resolve(workflowPath);

if (!fs.existsSync(fullPath)) {
  console.error(`❌ File not found: ${fullPath}`);
  process.exit(1);
}

const isValid = validateWorkflow(fullPath);
console.log(`\n${isValid ? '✅ Workflow is valid!' : '❌ Workflow has issues'}\n`);
process.exit(isValid ? 0 : 1);
