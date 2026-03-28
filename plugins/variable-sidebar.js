/**
 * Variable Sidebar Plugin for Docsify
 * 
 * Injects editable and computed variable fields into the left Docsify sidebar,
 * below the navigation. Stores values in localStorage for persistence.
 * Dispatches 'variables-changed' events on the document for other plugins.
 */

(function () {
  'use strict';

  // ── Variable Definitions ──────────────────────────────────────────
  const EDITABLE_VARS = [
    { key: 'PROJECT_ID', label: 'Project ID', type: 'text', placeholder: 'my-gcp-project' },
    { key: 'PROJECT_NUMBER', label: 'Project Number', type: 'text', placeholder: '123456789012' },
    { key: 'REGION', label: 'Region', type: 'select', options: [
        'us-central1', 'us-east1', 'us-west1',
        'europe-west1', 'europe-west4',
        'asia-east1', 'asia-northeast1',
        'australia-southeast1'
      ]
    },
    { key: 'EMAIL', label: 'Email Address', type: 'text', placeholder: 'user@example.com' },
  ];

  const COMPUTED_VARS = [
    { key: 'USERNAME', label: 'Username', derive: (vars) => {
      const email = vars.EMAIL || '';
      return email.includes('@') ? email.split('@')[0] : email;
    }},
    { key: 'BUCKET_NAME', label: 'Bucket Name', derive: (vars) => {
      return vars.PROJECT_ID ? `${vars.PROJECT_ID}-bucket` : '';
    }},
    { key: 'SERVICE_ACCOUNT', label: 'Service Account', derive: (vars) => {
      return vars.PROJECT_ID ? `${vars.PROJECT_ID}@${vars.PROJECT_ID}.iam.gserviceaccount.com` : '';
    }},
    { key: 'DATASET_ID', label: 'BigQuery Dataset', derive: (vars) => {
      return vars.PROJECT_ID ? `${vars.PROJECT_ID}.hackathon_dataset` : '';
    }},
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

  // ── Build the panel inside the left sidebar ───────────────────────
  function buildPanel() {
    const sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;

    // Panel container — inserted after sidebar nav
    const panel = document.createElement('div');
    panel.id = 'var-panel';

    // Header
    const header = document.createElement('div');
    header.id = 'var-panel-header';
    header.innerHTML = `<h3>Lab Variables</h3>`;
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.className = 'var-reset-btn';
    resetBtn.addEventListener('click', () => {
      variables = {};
      saveVariables();
      document.querySelectorAll('#var-panel-body input:not([readonly])').forEach(inp => { inp.value = ''; });
      document.querySelectorAll('#var-panel-body select').forEach(sel => { sel.selectedIndex = 0; });
      fireChange();
    });
    header.appendChild(resetBtn);
    panel.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.id = 'var-panel-body';

    // Editable group
    const editGroup = document.createElement('div');
    editGroup.className = 'var-group';
    editGroup.innerHTML = `<div class="var-group-title">Editable</div>`;
    EDITABLE_VARS.forEach(v => {
      editGroup.appendChild(createField(v));
    });
    body.appendChild(editGroup);

    // Computed group
    const compGroup = document.createElement('div');
    compGroup.className = 'var-group';
    compGroup.innerHTML = `<div class="var-group-title computed">Computed</div>`;
    COMPUTED_VARS.forEach(v => {
      compGroup.appendChild(createComputedField(v));
    });
    body.appendChild(compGroup);

    panel.appendChild(body);

    // Insert after the sidebar nav
    sidebar.parentNode.appendChild(panel);

    // Initial computed values
    updateComputedFields();
  }

  function createField(v) {
    const field = document.createElement('div');
    field.className = 'var-field';
    const label = document.createElement('label');
    label.textContent = v.label;
    label.setAttribute('for', `var-${v.key}`);
    field.appendChild(label);

    if (v.type === 'select') {
      const sel = document.createElement('select');
      sel.id = `var-${v.key}`;
      v.options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        if (variables[v.key] === opt) o.selected = true;
        sel.appendChild(o);
      });
      if (!variables[v.key]) {
        variables[v.key] = v.options[0];
      }
      sel.addEventListener('change', () => {
        variables[v.key] = sel.value;
        fireChange();
      });
      field.appendChild(sel);
    } else {
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
    }

    return field;
  }

  function createComputedField(v) {
    const field = document.createElement('div');
    field.className = 'var-field';
    const label = document.createElement('label');
    label.textContent = v.label;
    field.appendChild(label);

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.id = `var-computed-${v.key}`;
    inp.readOnly = true;
    inp.value = v.derive(variables);
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
  function variableSidebarPlugin(hook) {
    hook.mounted(function () {
      buildPanel();
      // Fire initial event so other plugins can pick up vars
      setTimeout(() => fireChange(), 100);
    });
  }

  // Register
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(variableSidebarPlugin);
})();
