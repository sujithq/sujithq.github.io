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
      // Critical theme-related attributes
      '[data-bs-theme="dark"]',
      '[data-bs-theme="light"]',
      '[data-bs-theme="auto"]',
      '[data-bs-theme-value="dark"]',
      '[data-bs-theme-value="light"]',
      '[data-bs-theme-value="auto"]',
      // Root theme selectors
      ':root',
      '[data-bs-theme=light]',
      '[data-bs-theme=dark]',
      // Dropdown theme components
      'dropdown-item-dark',
      'dropdown-item-light',
      'dropdown-item',
      'dropdown-menu',
      'dropdown-menu-dark',
      'dropdown-menu-light',
      'dropdown-toggle',
      // Basic theme classes
      'dark',
      'light'
    ];
    return extracted;
  },
  safelist: {
    standard: [
      // Bootstrap components
      'active', 'show', 'fade', 'collapse', 'collapsing', 'modal-backdrop',
      // Theme-related (preserve all!)
      'dark', 'light', 'auto',
      'dropdown-item-dark', 'dropdown-item-light',
      'bs-theme', 'data-bs-theme',
      'color-mode-toggler', 'color-mode-toggle',
      // Dropdown components for theme switching
      'dropdown', 'dropdown-item', 'dropdown-menu', 'dropdown-menu-end',
      'dropdown-menu-dark', 'dropdown-menu-light',
      'dropdown-toggle', 'dropdown-divider',
      // States and variations
      'btn-check', 'btn-active', 'nav-link', 'nav-item', 'navbar-nav', 'navbar-collapse',
      // Common Bootstrap classes
      'bg-primary', 'bg-secondary', 'bg-dark', 'bg-light',
      'text-primary', 'text-secondary', 'text-dark', 'text-light',
      // Bootstrap Icons used for theme switching
      'bi', 'bi-circle-half', 'bi-sun-fill', 'bi-moon-stars-fill'
    ],
    deep: [
      // Bootstrap prefixes (preserve all variants)
      /^bs-/,
      /^data-bs/,
      /^\[data-bs/,
      /data-bs-theme/,
      /data-bs-theme-value/,
      // Component-specific
      /^navbar/,
      /^nav-/,
      /^dropdown/,
      /^btn-/,
      // Theme-related (preserve all variations)
      /^color-mode/,
      /^theme/,
      /dark/,
      /light/,
      /auto/,
      // Specific Bootstrap theme-related selectors
      /:root/,
      /\[data-bs-theme=light\]/,
      /\[data-bs-theme=dark\]/,
      /\[data-bs-theme=auto\]/,
      // Bootstrap variables
      /^--bs-/
    ],
    greedy: [
      // Preserve all of these patterns in any context
      /dropdown/,
      /theme/,
      /^data-/,
      /dark/,
      /light/,
      /auto/,
      /^--bs-/,
      /:root/,
      /\[data-bs-/
    ]
  },
  variables: true,  // Keep CSS variables
  keyframes: true,  // Keep keyframes
  rejected: false,  // Don't output rejected selectors (for debugging)
  fontFace: true    // Keep font-face definitions
});

module.exports = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};

module.exports = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};
