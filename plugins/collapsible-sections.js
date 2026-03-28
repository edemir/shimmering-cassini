/**
 * Collapsible Sections Plugin for Docsify
 *
 * Wraps arbitrary markdown content in collapsible, hidden-by-default sections.
 * Perfect for solutions, hints, and bonus content in codelabs.
 *
 * Syntax (in markdown):
 *
 *   <!-- collapse "💡 Show Hint" -->
 *   Any markdown here — text, code blocks, images, lists…
 *   <!-- /collapse -->
 *
 *   <!-- collapse "🔑 Show Solution" -->
 *   ```bash {codejar}
 *   gcloud config set project my-project
 *   ```
 *   <!-- /collapse -->
 *
 * The quoted string after `collapse` is the toggle label.
 * If omitted, defaults to "Show / Hide".
 */

(function () {
  'use strict';

  const OPEN_RE  = /<!--\s*collapse\s*(?:"([^"]*)")?\s*-->/g;
  const CLOSE_RE = /<!--\s*\/collapse\s*-->/g;

  /**
   * Pre-process markdown:
   *   Replace opening marker with an HTML wrapper + toggle button.
   *   Replace closing marker with closing tags.
   *   The inner markdown is left untouched so Docsify renders it normally.
   */
  function preprocessMarkdown(markdown) {
    // First, replace opening markers
    let result = markdown.replace(OPEN_RE, (match, label) => {
      const title = label || 'Show / Hide';
      // The inner-content div is initially hidden via CSS (max-height: 0)
      return `<div class="collapse-section collapsed" data-label-show="${title}" data-label-hide="${title.replace(/^(Show|👀|💡|🔑)\s*/i, 'Hide ')}">\n` +
             `<button class="collapse-toggle" onclick="this.parentElement.classList.toggle('collapsed'); ` +
             `var s=this.parentElement; var sh=s.dataset.labelShow; var hi=s.dataset.labelHide; ` +
             `this.innerHTML=s.classList.contains('collapsed') ? '<span class=\\'collapse-icon\\'>▶</span> '+sh : '<span class=\\'collapse-icon\\'>▼</span> '+hi;">` +
             `<span class="collapse-icon">▶</span> ${title}</button>\n` +
             `<div class="collapse-content">\n`;
    });

    // Then, replace closing markers
    result = result.replace(CLOSE_RE, '</div>\n</div>\n');

    return result;
  }

  // ── Docsify Plugin Hook ───────────────────────────────────────────
  function collapsibleSectionsPlugin(hook) {
    hook.beforeEach(function (markdown) {
      return preprocessMarkdown(markdown);
    });
  }

  // Register
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(collapsibleSectionsPlugin);
})();
