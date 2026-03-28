/**
 * CodeJar Blocks Plugin for Docsify
 *
 * Converts specially-marked code blocks into CodeJar editor instances.
 *
 * Markers:
 *   ```bash {codejar}           → editable code block
 *   ```yaml {codejar-readonly}  → read-only, auto-updates with variables
 *
 * Code is base64-encoded in a data attribute so Docsify's markdown
 * processor cannot strip whitespace or mangle special characters.
 */

(function () {
  'use strict';

  // Keep track of CodeJar instances so we can destroy them on page change
  let activeEditors = [];

  /**
   * Pre-process raw markdown to embed code blocks as HTML with the code
   * stored in a data attribute (base64-encoded to preserve whitespace).
   */
  function preprocessMarkdown(markdown) {
    return markdown.replace(
      /```(\w+)\s*\{codejar(?:-(readonly))?\}\n([\s\S]*?)```/g,
      (match, lang, readonly, code) => {
        const roAttr = readonly ? ' data-readonly="true"' : '';
        const encoded = btoa(unescape(encodeURIComponent(code.trimEnd())));
        return `<div class="codejar-block" data-lang="${lang}"${roAttr} data-code="${encoded}"></div>`;
      }
    );
  }

  /**
   * Initialize CodeJar on all .codejar-block elements in the page.
   */
  function initCodeJarBlocks() {
    activeEditors.forEach(ed => { if (ed.destroy) ed.destroy(); });
    activeEditors = [];

    document.querySelectorAll('.codejar-block').forEach(block => {
      const lang = block.getAttribute('data-lang') || 'bash';
      const isReadonly = block.hasAttribute('data-readonly');
      const encoded = block.getAttribute('data-code') || '';

      // Decode raw code
      let rawCode = '';
      try { rawCode = decodeURIComponent(escape(atob(encoded))); }
      catch (e) { rawCode = block.textContent.trim(); }

      // Substitute variables
      let code = rawCode;
      if (window.CodelabVars) {
        const vars = window.CodelabVars.getAll();
        code = code.replace(/\{\{([A-Z_][A-Z0-9_]*)\}\}/g, (m, key) => vars[key] || m);
      }

      // Build wrapper
      const wrap = document.createElement('div');
      wrap.className = 'codejar-wrap';
      wrap.setAttribute('data-template', rawCode);

      // Header bar
      const header = document.createElement('div');
      header.className = 'codejar-header';

      const langLabel = document.createElement('span');
      langLabel.className = 'codejar-lang';
      langLabel.textContent = lang;
      if (!isReadonly) {
        const badge = document.createElement('span');
        badge.className = 'editable-badge';
        badge.textContent = 'EDITABLE';
        langLabel.appendChild(badge);
      }
      header.appendChild(langLabel);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'codejar-copy';
      copyBtn.innerHTML = '📋 Copy';
      header.appendChild(copyBtn);

      wrap.appendChild(header);

      // Editor element
      const editorEl = document.createElement('div');
      editorEl.className = `codejar-editor language-${lang}`;
      editorEl.textContent = code;
      wrap.appendChild(editorEl);

      // Replace original block
      block.replaceWith(wrap);

      // Prism highlight helper
      const highlight = (el) => {
        if (window.Prism) {
          const grammar = Prism.languages[lang] || Prism.languages.markup;
          el.innerHTML = Prism.highlight(el.textContent, grammar, lang);
        }
      };

      // Initialize CodeJar
      let jar = null;
      if (typeof CodeJar !== 'undefined') {
        jar = CodeJar(editorEl, highlight, {
          tab: '  ',
          indentOn: /[{(]$/,
          addClosing: false,
        });
        if (isReadonly) {
          editorEl.setAttribute('contenteditable', 'false');
        }
        activeEditors.push(jar);
      } else {
        highlight(editorEl);
        if (!isReadonly) {
          editorEl.setAttribute('contenteditable', 'true');
        }
      }

      // Copy button
      copyBtn.addEventListener('click', () => {
        const text = editorEl.textContent;
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.innerHTML = '✓ Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        });
      });
    });
  }

  /**
   * When variables change, re-substitute in all code blocks.
   */
  document.addEventListener('variables-changed', () => {
    document.querySelectorAll('.codejar-wrap').forEach(wrap => {
      const editor = wrap.querySelector('.codejar-editor');
      if (!editor) return;

      const rawTemplate = wrap.getAttribute('data-template');
      if (!rawTemplate || !window.CodelabVars) return;

      const vars = window.CodelabVars.getAll();
      const newCode = rawTemplate.replace(/\{\{([A-Z_][A-Z0-9_]*)\}\}/g, (m, key) => vars[key] || m);

      const langEl = wrap.querySelector('.codejar-lang');
      const lang = langEl ? langEl.childNodes[0].textContent.trim().toLowerCase() : 'bash';

      editor.textContent = newCode;
      if (window.Prism) {
        const grammar = Prism.languages[lang] || Prism.languages.markup;
        editor.innerHTML = Prism.highlight(editor.textContent, grammar, lang);
      }

      const isReadonly = editor.getAttribute('contenteditable') === 'false';
      if (!isReadonly) {
        editor.setAttribute('contenteditable', 'true');
      }
    });
  });

  // ── Docsify Plugin Hooks ──────────────────────────────────────────
  function codejarPlugin(hook) {
    hook.beforeEach(function (markdown) {
      return preprocessMarkdown(markdown);
    });
    hook.doneEach(function () {
      setTimeout(() => { initCodeJarBlocks(); }, 50);
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(codejarPlugin);
})();
