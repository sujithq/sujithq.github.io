const { purgeCSSPlugin } = require('@fullhuman/postcss-purgecss');

const purgecss = purgeCSSPlugin({
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    const els = JSON.parse(content).htmlElements;
    const extracted = [...(els.tags || []), ...(els.classes || []), ...(els.ids || []),
    // '[data-bs-theme="dark"]',
    // '[data-bs-theme="light"]'
  ]
    console.log("Extracted:", extracted);
    return extracted;
  },
  safelist: {
    // deep: [
    //   /^\[data-bs-theme="dark"\]/,
    //   /^\[data-bs-theme="light"\]/,
    // ],
  },
});

module.exports = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};
