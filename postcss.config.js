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
    standard: ['active', 'show', 'fade'],
    deep: [
      /^bs-/,
      /^data-bs-/,
      /^\[data-bs-theme/,
      /^carousel/,
      /^modal/,
      /^nav/,
      /^collapse/,
      /^dropdown/
    ],
  },
});

module.exports = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};
