const { purgeCSSPlugin } = require('@fullhuman/postcss-purgecss');

const purgecss = purgeCSSPlugin({
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    const els = JSON.parse(content).htmlElements;
    const extracted = [...(els.tags || []), ...(els.classes || []), ...(els.ids || []),
      '[data-bs-theme="dark"]',
      '[data-bs-theme="light"]'
    ]
    console.log("Extracted:", extracted);
    return extracted;
  },
  safelist: {
    standard: [
      'active', 
      'show', 
      'fade', 
      'collapse', 
      'collapsing',
      'modal-backdrop',
      'dark',
      'light',
      'dropdown-item-dark',
      'dropdown-item-light'
    ],
    deep: [
      /^bs-/,
      /^data-bs-/,
      /^\[data-bs-theme/,
      /^navbar/,
      /^nav-/,
      /^color-mode/,
      /^theme/
    ],
  },
  variables: true, // Keep CSS variables
  keyframes: true  // Keep keyframes
});

module.exports = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};
