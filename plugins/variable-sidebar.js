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
    {
      key: 'USER_NAME', label: 'User Name', type: 'text',
      placeholder: 'student-01-e3070b44be2c@qwiklabs.net',
      validate: (val) => {
        if (!val) return null; // empty is handled by the warning banner
        if (!val.trim().endsWith('@qwiklabs.net')) {
          return 'Username must end with @qwiklabs.net';
        }
        return null;
      }
    },
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
    updateWarningVisibility();
  }

  function updateWarningVisibility() {
    const warning = document.getElementById('var-panel-warning');
    if (!warning) return;
    const allFilled = EDITABLE_VARS.every(v => variables[v.key] && variables[v.key].trim() !== '');
    warning.style.display = allFilled ? 'none' : 'flex';
  }

  // ── Build the top panel ───────────────────────────────────────────
  function buildPanel() {
    const content = document.querySelector('section.content');
    if (!content) return;

    // Panel container
    const panel = document.createElement('div');
    panel.id = 'var-panel';

    // Warning banner
    const warning = document.createElement('div');
    warning.id = 'var-panel-warning';
    warning.innerHTML = '<span class="var-warning-icon">⚠️</span>' +
      '<span class="var-warning-text">' +
      '<strong>Action Required:</strong> Please enter your <strong>Project ID</strong> and <strong>User Name</strong> below. ' +
      'These values are used throughout the lab instructions and code blocks.' +
      '</span>';
    panel.appendChild(warning);

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

    const inputWrap = document.createElement('div');
    inputWrap.className = 'var-input-wrap';

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.id = `var-${v.key}`;
    inp.placeholder = v.placeholder || '';
    inp.value = variables[v.key] || '';

    const errorMsg = document.createElement('div');
    errorMsg.className = 'var-field-error';
    errorMsg.id = `var-error-${v.key}`;

    inp.addEventListener('input', () => {
      variables[v.key] = inp.value;
      fireChange();
      // Run validation if defined
      if (v.validate) {
        const err = v.validate(inp.value);
        errorMsg.textContent = err || '';
        inp.classList.toggle('invalid', !!err);
        errorMsg.classList.toggle('visible', !!err);
      }
    });

    // Validate on load if there's already a value
    if (v.validate && inp.value) {
      const err = v.validate(inp.value);
      errorMsg.textContent = err || '';
      inp.classList.toggle('invalid', !!err);
      errorMsg.classList.toggle('visible', !!err);
    }

    inputWrap.appendChild(inp);
    inputWrap.appendChild(errorMsg);
    field.appendChild(inputWrap);

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
