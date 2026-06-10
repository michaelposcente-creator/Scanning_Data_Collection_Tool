/**
 * app.js — Application entry point
 * Wires FormEngine, Exporter, and the review/thank-you screens together.
 */

/* ── Shared event bus used by form.js ──────────────────── */
const AppEvents = {
  onSectionChange(currentIdx, total) {
    const container = document.getElementById("progressContainer");
    const fill      = document.getElementById("progressFill");
    const label     = document.getElementById("progressLabel");

    container.hidden = false;
    const pct = ((currentIdx + 1) / total) * 100;
    fill.style.width = `${pct}%`;
    label.textContent = `Section ${currentIdx + 1} of ${total}`;
  },

  onReview(formData, sections) {
    _showScreen("review");
    _buildReviewTable(formData, sections);
    _cachedFormData = formData;
    _cachedSections = sections;
  }
};

/* ── State ─────────────────────────────────────────────── */
let _cachedFormData = {};
let _cachedSections = [];

/* ── Screen management ─────────────────────────────────── */
function _showScreen(screen) {
  document.getElementById("formContainer").hidden    = screen !== "form";
  document.getElementById("progressContainer").hidden = screen !== "form";
  document.getElementById("reviewContainer").hidden  = screen !== "review";
  document.getElementById("thankYouContainer").hidden = screen !== "thanks";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── Review table builder ──────────────────────────────── */
function _buildReviewTable(formData, sections) {
  const container = document.getElementById("reviewTable");
  container.innerHTML = "";

  sections.forEach(section => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "review-section";

    const sectionTitle = document.createElement("div");
    sectionTitle.className = "review-section-title";
    sectionTitle.textContent = section.title;
    sectionDiv.appendChild(sectionTitle);

    const table = document.createElement("table");
    table.className = "review-table";

    section.fields.forEach(field => {
      if (field.type === "info") return;
      const row = document.createElement("tr");
      const labelCell = document.createElement("td");
      labelCell.textContent = field.label;

      const valueCell = document.createElement("td");
      const val = formData[field.id];
      if (val !== undefined && val !== "") {
        valueCell.textContent = field.unit ? `${val} ${field.unit}` : val;
      } else {
        valueCell.innerHTML = `<span class="review-empty">—</span>`;
      }

      row.appendChild(labelCell);
      row.appendChild(valueCell);
      table.appendChild(row);
    });

    sectionDiv.appendChild(table);
    container.appendChild(sectionDiv);
  });
}

/* ── Event listeners ───────────────────────────────────── */
document.getElementById("reviewBackBtn").addEventListener("click", () => {
  _showScreen("form");
  // Re-trigger the progress bar to reflect the last section
  AppEvents.onSectionChange(
    _cachedSections.length - 1,
    _cachedSections.length
  );
});

document.getElementById("exportBtn").addEventListener("click", () => {
  Exporter.downloadCSV(_cachedFormData, _cachedSections);
  _showScreen("thanks");
});

document.getElementById("startOverBtn").addEventListener("click", () => {
  _showScreen("form");
  FormEngine.init(FORM_CONFIG);
});

/* ── Bootstrap ─────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  FormEngine.init(FORM_CONFIG);
  _showScreen("form");
});
