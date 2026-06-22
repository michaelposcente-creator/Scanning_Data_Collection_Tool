/**
 * form.js — Form rendering engine
 * Reads FORM_CONFIG from questions.js and builds the DOM.
 * Exposes FormEngine to app.js.
 */

const FormEngine = (() => {

  let _sections = [];
  let _currentIndex = 0;
  let _formData = {};
  let _sectionEls = [];

  /* ── Public init ─────────────────────────────────────── */

  function init(config) {
    _sections = config.sections;
    _formData = {};
    _currentIndex = 0;
    _sectionEls = [];

    // Pre-populate defaults so computed fields and unit controllers have initial values
    _sections.forEach(s => s.fields.forEach(f => {
      if (f.defaultValue !== undefined) _formData[f.id] = f.defaultValue;
    }));

    const container = document.getElementById("formContainer");
    container.innerHTML = "";

    _sections.forEach((section, idx) => {
      const card = _buildSection(section, idx);
      _sectionEls.push(card);
      container.appendChild(card);
    });

    _showSection(0);
  }

  /* ── Section builder ─────────────────────────────────── */

  function _buildSection(section, idx) {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `section-${section.id}`;
    card.hidden = true;

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = section.title;
    card.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "fields-grid";
    card.appendChild(grid);

    section.fields.forEach(field => {
      grid.appendChild(_buildField(field));
    });

    const nav = document.createElement("div");
    nav.className = "nav-row";

    const backBtn = document.createElement("button");
    backBtn.className = "btn btn-secondary" + (idx === 0 ? " btn-back-hidden" : "");
    backBtn.textContent = "Back";
    backBtn.addEventListener("click", () => goBack());

    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-primary";
    nextBtn.textContent = idx === _sections.length - 1 ? "Review" : "Next";
    nextBtn.addEventListener("click", () => goNext());

    nav.appendChild(backBtn);
    nav.appendChild(nextBtn);
    card.appendChild(nav);

    return card;
  }

  /* ── Field builder ───────────────────────────────────── */

  function _buildField(field) {
    const group = document.createElement("div");
    group.className = "field-group" + (field.fullWidth ? " full-width" : "");
    group.dataset.fieldId = field.id;
    if (field.unitGroup) group.dataset.unitGroup = field.unitGroup;

    // Label row — label text + optional image toggle button
    const labelRow = document.createElement("div");
    labelRow.className = "label-row";

    const labelEl = document.createElement("label");
    labelEl.htmlFor = field.id;
    labelEl.textContent = field.label;
    if (field.required) {
      const star = document.createElement("span");
      star.className = "required-star";
      star.textContent = " *";
      labelEl.appendChild(star);
    }
    labelRow.appendChild(labelEl);

    if (field.image) {
      labelRow.appendChild(_buildImageBtn(field));
    }

    group.appendChild(labelRow);

    // Info blocks are self-contained — return early, no label/input/error needed
    if (field.type === "info") {
      return _buildInfoBlock(field);
    }

    // Input — type dispatch
    if (field.type === "computed") {
      group.appendChild(_buildComputedDisplay(field));
    } else if (field.type === "select") {
      const sel = _buildSelect(field);
      group.appendChild(_wrapWithUnit(sel, field.unit));
      if (field.otherOption) {
        const specify = _buildOtherSpecify(field);
        group.appendChild(specify);
        sel.addEventListener("change", () => {
          specify.hidden = sel.value !== "Other";
          if (specify.hidden) specify.querySelector("input").value = "";
          _saveValue(field);
        });
      }
    } else if (field.type === "radio") {
      const radioGroup = _buildRadioGroup(field);
      group.appendChild(radioGroup);
      if (field.controlsUnitGroup) {
        radioGroup.addEventListener("change", () => {
          const checked = radioGroup.querySelector("input:checked");
          if (!checked) return;
          document.querySelectorAll(`[data-unit-group="${field.controlsUnitGroup}"] .unit-label`)
            .forEach(span => { span.textContent = checked.value; });
          _saveValue(field);
        });
      }
      if (field.otherOption) {
        const specify = _buildOtherSpecify(field);
        group.appendChild(specify);
        radioGroup.addEventListener("change", () => {
          const checked = radioGroup.querySelector("input:checked");
          const isOther = checked && checked.value === "Other";
          specify.hidden = !isOther;
          if (!isOther) specify.querySelector("input").value = "";
          _saveValue(field);
        });
      }
    } else if (field.type === "checkbox") {
      group.appendChild(_buildCheckboxGroup(field));
    } else if (field.type === "textarea") {
      const ta = document.createElement("textarea");
      ta.id = field.id;
      ta.name = field.id;
      if (field.placeholder) ta.placeholder = field.placeholder;
      ta.addEventListener("change", () => _saveValue(field));
      group.appendChild(_wrapWithUnit(ta, field.unit));
    } else {
      // text, number, date
      const input = document.createElement("input");
      input.type = field.type;
      input.id = field.id;
      input.name = field.id;
      if (field.placeholder !== undefined) input.placeholder = field.placeholder;
      if (field.min !== undefined) input.min = field.min;
      if (field.max !== undefined) input.max = field.max;
      input.addEventListener("input", () => _saveValue(field));
      input.addEventListener("change", () => _saveValue(field));

      if (field.generateRandom) {
        const wrapper = document.createElement("div");
        wrapper.className = "input-wrapper";
        wrapper.appendChild(input);
        if (field.unit) {
          const unitSpan = document.createElement("span");
          unitSpan.className = "unit-label";
          unitSpan.textContent = field.unit;
          wrapper.appendChild(unitSpan);
        }
        const genBtn = document.createElement("button");
        genBtn.type = "button";
        genBtn.className = "btn-generate";
        genBtn.textContent = "Generate";
        genBtn.title = "Generate a random 6-digit ID";
        genBtn.addEventListener("click", () => {
          input.value = String(Math.floor(100000 + Math.random() * 900000));
          input.dispatchEvent(new Event("input"));
          input.focus();
        });
        wrapper.appendChild(genBtn);
        group.appendChild(wrapper);
      } else {
        group.appendChild(_wrapWithUnit(input, field.unit));
      }
    }

    // Error message (not shown for computed fields)
    if (field.type !== "computed") {
      group.appendChild(_buildErrorEl(field.id));
    }

    // Image preview panel (hidden until toggled)
    if (field.image) {
      group.appendChild(_buildImagePreview(field));
    }

    return group;
  }

  /* ── Sub-builders ────────────────────────────────────── */

  function _wrapWithUnit(inputEl, unit) {
    if (!unit) return inputEl;
    const wrapper = document.createElement("div");
    wrapper.className = "input-wrapper";
    wrapper.appendChild(inputEl);
    const unitSpan = document.createElement("span");
    unitSpan.className = "unit-label";
    unitSpan.textContent = unit;
    wrapper.appendChild(unitSpan);
    return wrapper;
  }

  function _buildSelect(field) {
    const sel = document.createElement("select");
    sel.id = field.id;
    sel.name = field.id;

    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "— Select —";
    blank.disabled = true;
    blank.selected = true;
    sel.appendChild(blank);

    (field.options || []).forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      sel.appendChild(option);
    });

    sel.addEventListener("change", () => _saveValue(field));
    return sel;
  }

  function _buildRadioGroup(field) {
    const wrapper = document.createElement("div");
    wrapper.className = "radio-group";
    wrapper.id = field.id;

    (field.options || []).forEach(opt => {
      const lbl = document.createElement("label");
      lbl.className = "radio-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = field.id;
      input.value = opt;
      if (field.defaultValue !== undefined && opt === field.defaultValue) input.checked = true;
      input.addEventListener("change", () => _saveValue(field));
      lbl.appendChild(input);
      lbl.appendChild(document.createTextNode(opt));
      wrapper.appendChild(lbl);
    });

    return wrapper;
  }

  function _buildCheckboxGroup(field) {
    const wrapper = document.createElement("div");
    wrapper.className = "checkbox-group";
    wrapper.id = field.id;

    (field.options || []).forEach(opt => {
      const lbl = document.createElement("label");
      lbl.className = "checkbox-option";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = field.id;
      input.value = opt;
      input.addEventListener("change", () => _saveValue(field));
      lbl.appendChild(input);
      lbl.appendChild(document.createTextNode(opt));
      wrapper.appendChild(lbl);
    });

    return wrapper;
  }

  function _buildInfoBlock(field) {
    const block = document.createElement("div");
    block.className = "info-block full-width";

    if (field.title) {
      const heading = document.createElement("p");
      heading.className = "info-block-title";
      heading.textContent = field.title;
      block.appendChild(heading);
    }

    if (field.content) {
      const body = document.createElement("p");
      body.className = "info-block-content";
      body.style.whiteSpace = "pre-line";
      body.textContent = field.content;
      block.appendChild(body);
    }

    if (field.image) {
      const imgWrap = document.createElement("div");
      imgWrap.className = "info-block-image-wrap";

      const img = document.createElement("img");
      img.src = field.image;
      img.alt = field.imageCaption || (field.title ? `Reference for: ${field.title}` : "Reference image");
      img.className = "info-block-image";
      imgWrap.appendChild(img);

      if (field.imageCaption) {
        const caption = document.createElement("p");
        caption.className = "info-block-image-caption";
        caption.textContent = field.imageCaption;
        imgWrap.appendChild(caption);
      }

      block.appendChild(imgWrap);
    }

    return block;
  }

  function _buildOtherSpecify(field) {
    const wrapper = document.createElement("div");
    wrapper.className = "other-specify-wrapper";
    wrapper.hidden = true;

    const input = document.createElement("input");
    input.type = "text";
    input.id = `${field.id}_other_specify`;
    input.placeholder = "Please specify…";
    input.addEventListener("input", () => _saveValue(field));

    wrapper.appendChild(input);
    return wrapper;
  }

  function _buildErrorEl(fieldId) {
    const err = document.createElement("span");
    err.className = "field-error";
    err.id = `error-${fieldId}`;
    err.textContent = "This field is required.";
    return err;
  }

  /* ── Computed field display ──────────────────────────── */

  function _buildComputedDisplay(field) {
    const display = document.createElement("div");
    display.className = "computed-display";
    display.id = field.id;
    display.dataset.formula  = field.formula  || "";
    display.dataset.decimals = field.decimals !== undefined ? field.decimals : 2;

    const valueSpan = document.createElement("span");
    valueSpan.className = "computed-value";
    valueSpan.textContent = "—";
    display.appendChild(valueSpan);

    if (field.unit) {
      const unitSpan = document.createElement("span");
      unitSpan.className = "computed-unit";
      unitSpan.textContent = " " + field.unit;
      display.appendChild(unitSpan);
    }

    const hint = document.createElement("span");
    hint.className = "computed-hint";
    hint.textContent = "auto-calculated";
    display.appendChild(hint);

    return display;
  }

  /* ── Reference image ─────────────────────────────────── */

  function _buildImageBtn(field) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "field-image-btn";
    btn.dataset.previewId = `img-preview-${field.id}`;
    // Camera icon + label
    btn.innerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" ` +
      `fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
      `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>` +
      `<polyline points="21 15 16 10 5 21"/></svg>Reference`;

    btn.addEventListener("click", () => {
      const preview = document.getElementById(btn.dataset.previewId);
      if (!preview) return;
      const opening = preview.hidden;
      preview.hidden = !opening;
      btn.classList.toggle("active", opening);
    });

    return btn;
  }

  function _buildImagePreview(field) {
    const panel = document.createElement("div");
    panel.className = "field-image-preview";
    panel.id = `img-preview-${field.id}`;
    panel.hidden = true;

    const img = document.createElement("img");
    img.src = field.image;
    img.alt = `Reference diagram for: ${field.label}`;
    img.className = "field-image";
    panel.appendChild(img);

    if (field.imageCaption) {
      const caption = document.createElement("p");
      caption.className = "field-image-caption";
      caption.textContent = field.imageCaption;
      panel.appendChild(caption);
    }

    return panel;
  }

  /* ── Value persistence ───────────────────────────────── */

  function _saveValue(field) {
    if (field.type === "computed") return; // read-only

    let raw;
    if (field.type === "radio") {
      const checked = document.querySelector(`input[name="${field.id}"]:checked`);
      raw = checked ? checked.value : "";
    } else if (field.type === "checkbox") {
      const checked = [...document.querySelectorAll(`input[name="${field.id}"]:checked`)];
      _formData[field.id] = checked.map(c => c.value).join("; ");
      _clearError(field.id);
      _updateComputedFields();
      return;
    } else {
      const el = document.getElementById(field.id);
      raw = el ? el.value : "";
    }

    // If "Other" was chosen and a specify input exists, use its text instead
    if (field.otherOption && raw === "Other") {
      const specifyEl = document.getElementById(`${field.id}_other_specify`);
      const text = specifyEl ? specifyEl.value.trim() : "";
      _formData[field.id] = text ? `Other: ${text}` : "Other";
    } else {
      _formData[field.id] = raw;
    }

    _clearError(field.id);
    _updateComputedFields();
  }

  /* ── Computed field evaluation ───────────────────────── */

  function _updateComputedFields() {
    _sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.type !== "computed") return;
        const display = document.getElementById(field.id);
        if (!display) return;

        const decimals = parseInt(display.dataset.decimals, 10);
        const result   = _evalFormula(display.dataset.formula, _formData);
        const span     = display.querySelector(".computed-value");

        if (result !== null && isFinite(result) && !isNaN(result)) {
          const formatted = Number.isInteger(result) ? String(result) : result.toFixed(decimals);
          span.textContent = formatted;
          _formData[field.id] = formatted;
          display.classList.remove("computed-stale");
        } else {
          span.textContent = "—";
          _formData[field.id] = "";
          // Only mark stale if a formula is defined (blank formula = intentionally empty)
          display.classList.toggle("computed-stale", !!display.dataset.formula);
        }
      });
    });
  }

  /**
   * Safely evaluate a formula string that may reference field IDs as variables.
   * Formulas are developer-authored (in questions.js), not user input.
   */
  function _evalFormula(formula, formData) {
    if (!formula) return null;
    try {
      const ids  = Object.keys(formData);
      const vals = ids.map(k => { const n = parseFloat(formData[k]); return isNaN(n) ? 0 : n; });
      // new Function is safe here: formula comes from the config file, not from user input
      // eslint-disable-next-line no-new-func
      return new Function(...ids, `"use strict"; return (${formula});`)(...vals);
    } catch {
      return null;
    }
  }

  /* ── Validation ──────────────────────────────────────── */

  function _validateSection(sectionIdx) {
    const section = _sections[sectionIdx];
    let valid = true;

    section.fields.forEach(field => {
      if (!field.required || field.type === "computed" || field.type === "info") return;
      _saveValue(field);
      if ((_formData[field.id] || "").trim() === "") {
        _showError(field.id);
        valid = false;
      } else {
        _clearError(field.id);
      }
    });

    return valid;
  }

  function _showError(fieldId) {
    const errEl  = document.getElementById(`error-${fieldId}`);
    const inputEl = document.getElementById(fieldId);
    if (errEl)   errEl.classList.add("visible");
    if (inputEl && inputEl.tagName !== "DIV") inputEl.classList.add("invalid");
  }

  function _clearError(fieldId) {
    const errEl  = document.getElementById(`error-${fieldId}`);
    const inputEl = document.getElementById(fieldId);
    if (errEl)   errEl.classList.remove("visible");
    if (inputEl && inputEl.tagName !== "DIV") inputEl.classList.remove("invalid");
  }

  /* ── Navigation ──────────────────────────────────────── */

  function _showSection(idx) {
    _sectionEls.forEach((el, i) => { el.hidden = i !== idx; });
    _currentIndex = idx;
    AppEvents.onSectionChange(idx, _sections.length);
    _updateComputedFields();
  }

  function goNext() {
    if (!_validateSection(_currentIndex)) return;
    if (_currentIndex < _sections.length - 1) {
      _showSection(_currentIndex + 1);
    } else {
      AppEvents.onReview(_formData, _sections);
    }
  }

  function goBack() {
    if (_currentIndex > 0) _showSection(_currentIndex - 1);
  }

  /* ── Public API ──────────────────────────────────────── */

  return { init, goNext, goBack };

})();
