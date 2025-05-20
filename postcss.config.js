const { purgeCSSPlugin } = require('@fullhuman/postcss-purgecss');

const purgecss = purgeCSSPlugin({
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    const els = JSON.parse(content).htmlElements;
    // Ensure we extract all classes, including potential dynamic ones used for theme switching
    const extracted = [
      ...(els.tags || []), 
      ...(els.classes || []), 
      ...(els.ids || []),
      '[data-bs-theme="dark"]',
      '[data-bs-theme="light"]',
      '[data-bs-theme-value="dark"]',
      '[data-bs-theme-value="light"]',
      'dropdown-item-dark',
      'dropdown-item-light',
      'dropdown-item',
      'dropdown-menu',
      'dropdown-toggle',
      'dark',
      'light'
    ];
    console.log("Extracted:", extracted);
    return extracted;
  },
  safelist: {
    standard: [
      // Bootstrap components
      'active', 'show', 'fade', 'collapse', 'collapsing', 'modal-backdrop',
      // Theme-related
      'dark', 'light', 'dropdown-item-dark', 'dropdown-item-light',
      // Dropdown components
      'dropdown', 'dropdown-item', 'dropdown-menu', 'dropdown-toggle', 'dropdown-divider',
      // States and variations
      'btn-check', 'btn-active', 'nav-link', 'nav-item', 'navbar-nav', 'navbar-collapse',
      // Common Bootstrap classes
      'bg-primary', 'bg-secondary', 'bg-dark', 'bg-light',
      'text-primary', 'text-secondary', 'text-dark', 'text-light'
    ],
    deep: [
      // Bootstrap prefixes
      /^bs-/,
      /^data-bs/,
      /^\[data-bs/,
      // Component-specific
      /^navbar/,
      /^nav-/,
      /^dropdown/,
      /^btn-/,
      // Theme-related
      /^color-mode/,
      /^theme/,
      /dark/,
      /light/
    ],
    greedy: [
      // Preserve all of these patterns in any context
      /dropdown/,
      /theme/,
      /^data-/,
      /dark/,
      /light/
    ]
  },
  variables: true,  // Keep CSS variables
  keyframes: true   // Keep keyframes
});

module.exports = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};
