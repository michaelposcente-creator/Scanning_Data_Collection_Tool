/**
 * export.js — CSV generation and download
 * No external libraries required.
 */

const Exporter = (() => {

  /**
   * Build a CSV from the flat formData object and trigger a download.
   * Header row uses field labels; data row uses captured values.
   *
   * @param {Object} formData  — { fieldId: value, ... }
   * @param {Array}  sections  — FORM_CONFIG.sections (for ordered labels)
   */
  function downloadCSV(formData, sections) {
    const headers = [];
    const values  = [];

    sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.type === "info") return;
        headers.push(_escape(field.label));
        const raw = formData[field.id];
        values.push(_escape(raw !== undefined && raw !== null ? String(raw) : ""));
      });
    });

    const csv = [headers.join(","), values.join(",")].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);

    const timestamp = _timestamp();
    const filename  = `participant_data_${timestamp}.csv`;

    const link = document.createElement("a");
    link.href     = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  /* Wrap value in quotes and escape internal quotes per RFC 4180 */
  function _escape(value) {
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  }

  function _timestamp() {
    const d = new Date();
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  return { downloadCSV };

})();
