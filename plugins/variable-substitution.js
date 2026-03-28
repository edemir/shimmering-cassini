/**
 * Variable Substitution Plugin for Docsify
 * 
 * Replaces {{VAR_NAME}} mustache-style placeholders in rendered markdown
 * with actual variable values from the sidebar panel.
 * Lives updates when variables change.
 */

(function () {
  'use strict';

  const VAR_REGEX = /\{\{([A-Z_][A-Z0-9_]*)\}\}/g;

  /**
   * Replace {{VAR}} patterns with interactive <span> elements.
   */
  function substituteVariables(html) {
    if (!window.CodelabVars) return html;
    const vars = window.CodelabVars.getAll();

    // Skip substitution inside codejar-block elements (handled by codejar plugin)
    // Split on codejar-block divs to avoid double-processing
    return html.replace(VAR_REGEX, (match, varName, offset) => {
      // Check if this match is inside a codejar-block data attribute
      const before = html.substring(0, offset);
      const inDataAttr = before.lastIndexOf('data-code="') > before.lastIndexOf('"');
      if (inDataAttr) return match;

      const val = vars[varName];
      const displayVal = val || match;
      const emptyClass = val ? '' : ' empty';
      return `<span class="var-value${emptyClass}" data-var="${varName}">${displayVal}</span>`;
    });
  }

  /**
   * Re-scan and update all var-value spans on the page.
   */
  function refreshVarSpans() {
    if (!window.CodelabVars) return;
    const vars = window.CodelabVars.getAll();

    document.querySelectorAll('.var-value').forEach(span => {
      const varName = span.getAttribute('data-var');
      if (varName && vars.hasOwnProperty(varName)) {
        const val = vars[varName];
        span.textContent = val || `{{${varName}}}`;
        span.classList.toggle('empty', !val);
      }
    });

    // Also update CodeJar editors that have variables
    document.querySelectorAll('.codejar-editor').forEach(editor => {
      // We don't replace inside CodeJar editors to avoid cursor issues;
      // the codejar-blocks plugin handles that separately.
    });
  }

  // Listen for variable changes
  document.addEventListener('variables-changed', refreshVarSpans);

  // ── Docsify Plugin Hook ───────────────────────────────────────────
  function variableSubstitutionPlugin(hook) {
    hook.afterEach(function (html, next) {
      next(substituteVariables(html));
    });
  }

  // Register
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(variableSubstitutionPlugin);
})();
