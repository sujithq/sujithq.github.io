const fs = require("fs");

const HUGO_STATS_PATH = "./hugo_stats.json";
const isProd = process.env.HUGO_ENVIRONMENT === "production";
const hasHugoStats = fs.existsSync(HUGO_STATS_PATH);

const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    let els = { tags: [], classes: [], ids: [] };
    try {
      els = JSON.parse(content).htmlElements || els;
    } catch {
      // Fallback keeps build stable if stats content is temporarily invalid.
      return [];
    }
    const extracted = [
      ...(els.tags || []),
      ...(els.classes || []),
      ...(els.ids || []),
      '[data-bs-theme="dark"]',
      '[data-bs-theme="light"]',
      '[data-bs-theme="auto"]',
      '[data-bs-theme-value="dark"]',
      '[data-bs-theme-value="light"]',
      '[data-bs-theme-value="auto"]',
      ":root",
      "[data-bs-theme=light]",
      "[data-bs-theme=dark]",
      "dropdown-item-dark",
      "dropdown-item-light",
      "dropdown-item",
      "dropdown-menu",
      "dropdown-menu-dark",
      "dropdown-menu-light",
      "dropdown-toggle",
      "dark",
      "light",
    ];
      // Sort and deduplicate for deterministic CSS output (prevents hash churn)
      return Array.from(new Set(extracted)).sort();
  },
  safelist: {
    standard: [
      "active", "show", "fade", "collapse", "collapsing", "modal-backdrop",
      "dark", "light", "auto",
      "ubb-node", "ubb-actions-cell", "is-idle", "is-pass", "is-warn", "is-block",
      "dropdown-item-dark", "dropdown-item-light",
      "bs-theme", "data-bs-theme",
      "color-mode-toggler", "color-mode-toggle",
      "dropdown", "dropdown-item", "dropdown-menu", "dropdown-menu-end",
      "dropdown-menu-dark", "dropdown-menu-light",
      "dropdown-toggle", "dropdown-divider",
      "accordion", "accordion-item", "accordion-header", "accordion-button",
      "accordion-collapse", "accordion-body",
      "btn-check", "btn-active", "nav-link", "nav-item", "navbar-nav", "navbar-collapse",
      "bg-primary", "bg-secondary", "bg-dark", "bg-light",
      "text-primary", "text-secondary", "text-dark", "text-light",
      "fas", "fab", "fa-adjust", "fa-sun", "fa-moon",
    ],
    deep: [
      /^bs-/,
      /^data-bs/,
      /^\[data-bs/,
      /data-bs-theme/,
      /data-bs-theme-value/,
      /^navbar/,
      /^nav-/,
      /^accordion/,
      /^dropdown/,
      /^btn-/,
      /^color-mode/,
      /^theme/,
      /dark/,
      /light/,
      /auto/,
      /:root/,
      /\[data-bs-theme=light\]/,
      /\[data-bs-theme=dark\]/,
      /\[data-bs-theme=auto\]/,
      /^--bs-/,
    ],
    greedy: [
      /dropdown/,
      /accordion/,
      /theme/,
      /^data-/,
      /dark/,
      /light/,
      /auto/,
      /^--bs-/,
      /:root/,
      /\[data-bs-/,
    ],
  },
  variables: true,
  keyframes: true,
  rejected: false,
  fontFace: true,
});

module.exports = {
  plugins: [
    ...(isProd && hasHugoStats ? [purgecss] : []),
  ],
};