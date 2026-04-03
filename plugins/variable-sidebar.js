/**
 * Variable Panel Plugin for Docsify
 * 
 * Injects a persistent variable input bar at the top of the content area.
 * Stores values in localStorage for persistence.
 * Dispatches 'variables-changed' events on the document for other plugins.
 */

(function () {
  'use strict';

  // ── Variable Definitions ──────────────────────────────────────────
  const EDITABLE_VARS = [
    { key: 'PROJECT_ID', label: 'Project ID', type: 'text', placeholder: 'my-gcp-project' },
    { key: 'USER_NAME', label: 'User Name', type: 'text', placeholder: 'student-01-e3070b44be2c@qwiklabs.net' },
  ];

  const COMPUTED_VARS = [
    {
      key: 'USER_NAME_SHORT', label: 'Username (short)', derive: (vars) => {
        const name = vars.USER_NAME || '';
        return name.includes('@') ? name.split('@')[0] : name;
      }
    }
  ];

  const STORAGE_KEY = 'docsify_codelab_vars';

  // ── State ─────────────────────────────────────────────────────────
  let variables = loadVariables();

  function loadVariables() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  function saveVariables() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(variables));
  }

  function getAll() {
    const all = { ...variables };
    COMPUTED_VARS.forEach(cv => {
      all[cv.key] = cv.derive(variables);
    });
    return all;
  }

  function fireChange() {
    saveVariables();
    document.dispatchEvent(new CustomEvent('variables-changed', { detail: getAll() }));
    updateComputedFields();
    updateAllVarSpans();
  }

  // ── Build the top panel ───────────────────────────────────────────
  function buildPanel() {
    const content = document.querySelector('section.content');
    if (!content) return;

    // Panel container
    const panel = document.createElement('div');
    panel.id = 'var-panel';


    // Fields row
    const fields = document.createElement('div');
    fields.id = 'var-panel-fields';

    EDITABLE_VARS.forEach(v => {
      fields.appendChild(createField(v));
    });

    panel.appendChild(fields);

    // Insert at the top of the content area
    content.insertBefore(panel, content.firstChild);
  }

  function createField(v) {
    const field = document.createElement('div');
    field.className = 'var-field';
    const label = document.createElement('label');
    label.textContent = v.label;
    label.setAttribute('for', `var-${v.key}`);
    field.appendChild(label);

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.id = `var-${v.key}`;
    inp.placeholder = v.placeholder || '';
    inp.value = variables[v.key] || '';
    inp.addEventListener('input', () => {
      variables[v.key] = inp.value;
      fireChange();
    });
    field.appendChild(inp);

    return field;
  }

  function updateComputedFields() {
    COMPUTED_VARS.forEach(v => {
      const inp = document.getElementById(`var-computed-${v.key}`);
      if (inp) inp.value = v.derive(variables);
    });
  }

  function updateAllVarSpans() {
    const all = getAll();
    document.querySelectorAll('.var-value').forEach(span => {
      const varName = span.getAttribute('data-var');
      if (varName && all.hasOwnProperty(varName)) {
        const val = all[varName];
        span.textContent = val || `{{${varName}}}`;
        span.classList.toggle('empty', !val);
      }
    });
  }

  // ── Expose globally for other plugins ─────────────────────────────
  window.CodelabVars = {
    getAll,
    get: (key) => getAll()[key] || '',
  };

  // ── Docsify Plugin Hook ───────────────────────────────────────────
  function variablePanelPlugin(hook) {
    hook.mounted(function () {
      buildPanel();
      setTimeout(() => fireChange(), 100);
    });
  }

  // Register
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(variablePanelPlugin);
})();
