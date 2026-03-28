/**
 * Inline Copy Plugin for Docsify
 *
 * Adds a small copy button next to inline <code> elements that have the
 * 'copyable' class. In markdown, use the syntax:  `command`{copy}
 *
 * The plugin:
 * 1. Pre-processes markdown to convert `code`{copy} → <code class="copyable">code</code>
 * 2. After render, attaches click-to-copy buttons to .copyable elements
 */

(function () {
  'use strict';

  function inlineCopyPlugin(hook) {
    // Pre-process markdown: convert `code`{copy} to a placeholder
    hook.beforeEach(function (content) {
      // Match `...`{copy} — the backtick code followed by {copy}
      return content.replace(/`([^`]+)`\{copy\}/g, function (_, code) {
        return '<code class="copyable">' + code + '</code>';
      });
    });

    // After each page render, attach copy buttons
    hook.doneEach(function () {
      document.querySelectorAll('code.copyable').forEach(function (el) {
        // Skip if already processed
        if (el.nextElementSibling && el.nextElementSibling.classList.contains('inline-copy-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'inline-copy-btn';
        btn.title = 'Copy to clipboard';
        btn.innerHTML = '📋';
        btn.addEventListener('click', function () {
          // Get text, resolving any variable substitutions
          const text = el.textContent;
          navigator.clipboard.writeText(text).then(function () {
            btn.innerHTML = '✅';
            btn.classList.add('copied');
            setTimeout(function () {
              btn.innerHTML = '📋';
              btn.classList.remove('copied');
            }, 1500);
          });
        });
        el.parentNode.insertBefore(btn, el.nextSibling);
      });
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(inlineCopyPlugin);
})();
