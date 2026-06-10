# Digital Geometric Assessment of Amputated Limbs — Data Collection Tool

A lightweight, static web application for research data collection. Runs entirely in the browser — no server, no database, no internet connection required. All data stays on the researcher's device until they download it as a CSV.

---

## How to use

1. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
2. Fill out each section and click **Next**.
3. On the **Review** screen, verify all entries.
4. Click **Download CSV** — the file saves to your Downloads folder.
5. Open the CSV in Microsoft Excel for analysis.

---

## How to add or modify questions

**Edit only one file: `js/questions.js`**

Everything else (rendering, validation, navigation, CSV export) is automatic.

### Adding a field to an existing section

Find the section in `questions.js` and add a field object to its `fields` array:

```js
{
  id: "my_new_field",      // unique identifier — becomes the CSV column
  label: "My Question",    // shown to the user
  type: "text",            // see field types below
  required: true           // blocks Next if left empty
}
```

### Adding a new section

Copy a section block and add it to the `sections` array:

```js
{
  id: "my_section",
  title: "My Section Title",
  fields: [
    { id: "field_one", label: "First Question", type: "text" },
    { id: "field_two", label: "Second Question", type: "number", unit: "cm" }
  ]
}
```

---

## Field types reference

| type | Description | Extra properties |
|------|-------------|-----------------|
| `text` | Single-line text | `placeholder` |
| `number` | Numeric input | `min`, `max`, `placeholder`, `unit` |
| `date` | Date picker | — |
| `select` | Dropdown list | `options: ["A", "B", "C"]` |
| `radio` | Single-choice buttons | `options: ["Yes", "No"]` |
| `checkbox` | Multi-select checkboxes | `options: ["A", "B", "C"]` |
| `textarea` | Multi-line text | `placeholder`, `fullWidth: true` |
| `computed` | Auto-calculated read-only value | `formula`, `decimals` |

### Common properties (all types)

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | **Required.** Unique snake_case key. Becomes the CSV column header. |
| `label` | string | **Required.** Text shown above the input. |
| `type` | string | **Required.** See table above. |
| `required` | boolean | If `true`, the user cannot advance without filling this field. |
| `unit` | string | Displayed after the input, e.g. `"cm"`, `"kg"`. |
| `fullWidth` | boolean | Spans both columns in the grid. Good for textareas. |
| `image` | string | Path to a reference image shown via a toggle button, e.g. `"images/diagram.png"`. |
| `imageCaption` | string | Optional caption displayed below the reference image. |

### `computed` field properties

| Property | Type | Description |
|----------|------|-------------|
| `formula` | string | Arithmetic expression. Reference other fields by their `id`. Example: `"proximal_circumference / distal_circumference"` |
| `decimals` | number | Decimal places to display (default `2`). |

The computed value updates live as dependent fields are filled in and is included in the CSV export. Supported operators: `+` `-` `*` `/` `**` `Math.round()` `Math.sqrt()` and any standard JS `Math` expression.

### Adding reference images

1. Place your image files in the `images/` folder (create it if needed).
2. Add the `image` property to any field pointing to that file:

```js
{
  id: "limb_length",
  label: "Residual Limb Length",
  type: "number",
  unit: "mm",
  image: "images/limb_length_diagram.png",
  imageCaption: "Measure from point A to point B as shown."
}
```

A small **Reference** button appears next to the field label. Clicking it reveals the image inline — clicking again hides it.

---

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set **Source** to `main` branch, `/ (root)` folder.
4. GitHub will provide a URL — share it with your team.

No build step required.

---

## Project structure

```
/
├── index.html          Application shell
├── css/
│   └── styles.css      Visual design
├── js/
│   ├── questions.js    ← Edit this to change questions
│   ├── form.js         Rendering engine (do not edit)
│   ├── export.js       CSV generation (do not edit)
│   └── app.js          App wiring (do not edit)
└── README.md           This file
```
