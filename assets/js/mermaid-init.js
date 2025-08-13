// Lightweight Mermaid integration: transforms ```mermaid code fences into rendered diagrams.
// Loads mermaid only if such fences are present to avoid unnecessary payload.
document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('pre code.language-mermaid, pre code.mermaid');
  if (!codeBlocks.length) return; // No mermaid content on this page

  function loadMermaid(callback) {
    if (window.mermaid) return callback();
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.onload = callback;
    script.onerror = () => console.error('Failed to load Mermaid library');
    document.head.appendChild(script);
  }

  loadMermaid(() => {
    try {
      const theme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'default';
      window.mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme });

      codeBlocks.forEach((code) => {
        const pre = code.closest('pre');
        const container = document.createElement('div');
        container.className = 'mermaid';
        container.textContent = code.textContent;
        if (pre) pre.replaceWith(container); else code.replaceWith(container);
      });

      window.mermaid.run();

      // Re-render on theme change to keep diagrams in sync
      const observer = new MutationObserver((muts) => {
        if (muts.some(m => m.attributeName === 'data-bs-theme')) {
          const newTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'default';
          window.mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: newTheme });
          window.mermaid.run();
        }
      });
      observer.observe(document.documentElement, { attributes: true });
    } catch (e) {
      console.error('Mermaid render failed', e);
    }
  });
});
