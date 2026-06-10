/**
 * questions.js — FORM CONFIGURATION
 *
 * This is the only file you need to edit to add, remove, or reorder
 * questions and sections. The rest of the application reads from
 * FORM_CONFIG automatically.
 *
 * ──────────────────────────────────────────────────────────────
 * SECTION structure:
 *   id:     unique snake_case identifier (no spaces)
 *   title:  heading shown to the user
 *   fields: [ ...field objects ]
 *
 * ──────────────────────────────────────────────────────────────
 * FIELD types and their extra properties:
 *
 *   type: "text"
 *     placeholder: "Enter value..."
 *
 *   type: "number"
 *     min: 0, max: 999, placeholder: "0", unit: "cm"
 *
 *   type: "date"
 *     (no extra props)
 *
 *   type: "select"
 *     options: ["Option A", "Option B", "Other"]
 *     otherOption: true  ← reveals a text box when "Other" is chosen
 *
 *   type: "radio"
 *     options: ["Yes", "No", "Unknown"]
 *     otherOption: true  ← same as above
 *
 *   type: "checkbox"
 *     options: ["Feature A", "Feature B"]  ← multiple can be selected
 *
 *   type: "textarea"
 *     placeholder: "Enter notes here..."
 *
 *   type: "computed"
 *     formula:  arithmetic expression referencing other field IDs
 *               e.g. "(trial_1 + trial_2) / 2"
 *     decimals: number of decimal places shown (default 2)
 *
 *   type: "info"
 *     title:   short bold heading (optional)
 *     content: instructional text — use \n for line breaks
 *     (info blocks are display-only; not exported to CSV)
 *
 * ──────────────────────────────────────────────────────────────
 * COMMON field properties (all input types):
 *   id:           unique snake_case key → becomes the CSV column header
 *   label:        text shown above the input
 *   required:     true | false — blocks Next if left empty
 *   unit:         suffix shown after the input, e.g. "mm", "years"
 *   fullWidth:    true — spans both grid columns
 *   image:        path to a reference image, e.g. "images/diagram.png"
 *   imageCaption: caption shown below the reference image
 *   generateRandom: true — adds a Generate button (text/number fields only)
 */

const FORM_CONFIG = {
  sections: [

    // ── SECTION 1 ─────────────────────────────────────────────
    {
      id: "participant_info",
      title: "Participant Demographic Information",
      fields: [
        {
          id: "participant_id",
          label: "Participant ID",
          type: "text",
          required: true,
          placeholder: "e.g. P001 or use Generate",
          generateRandom: true
        },
        {
          id: "date_of_assessment",
          label: "Date of Assessment",
          type: "date",
          required: true
        },
        {
          id: "completed_by",
          label: "Completed By",
          type: "text"
        },
        {
          id: "age",
          label: "Age",
          type: "number",
          min: 0,
          max: 120,
          unit: "years"
        },
        {
          id: "sex",
          label: "Biological Sex",
          type: "select",
          options: ["Male", "Female", "Other / Prefer not to say"]
        },
        {
          id: "notes",
          label: "General Notes",
          type: "textarea",
          placeholder: "Any additional participant-level notes...",
          fullWidth: true
        }
      ]
    },

    // ── SECTION 2 ─────────────────────────────────────────────
    {
      id: "amputation_details",
      title: "Amputation Details",
      fields: [
        {
          id: "amputation_side",
          label: "Side of Amputation",
          type: "radio",
          options: ["Left", "Right"]
        },
        {
          id: "amputation_level",
          label: "Level of Amputation",
          type: "select",
          otherOption: true,
          options: [
            "Transtibial (below knee)",
            "Transfemoral (above knee)",
            "Knee disarticulation",
            "Transradial (below elbow)",
            "Transhumeral (above elbow)",
            "Elbow disarticulation",
            "Partial foot",
            "Partial hand",
            "Other"
          ]
        },
        {
          id: "amputation_cause",
          label: "Cause of Amputation",
          type: "select",
          otherOption: true,
          options: [
            "Trauma / Accident",
            "Vascular disease",
            "Diabetes",
            "Cancer / Tumour",
            "Congenital",
            "Infection",
            "Other"
          ]
        },
        {
          id: "time_since_amputation",
          label: "Time Since Amputation",
          type: "number",
          min: 0,
          unit: "years"
        }
      ]
    },

    // ── SECTION 3 ─────────────────────────────────────────────
    {
      id: "prosthesis_characteristics",
      title: "Prosthesis Characteristics",
      fields: [
        {
          id: "Prosthesis_Duration",
          label: "How long have you been using a prosthesis?",
          type: "number",
          min: 0,
          unit: "years",
          placeholder: "0"
        },
        {
          id: "Socket_Type",
          label: "Socket Type",
          type: "select",
          otherOption: true,
          options: [
            "TSB (Total Surface Bearing)",
            "PTB (Patellar Tendon Bearing)",
            "Hybrid",
            "Not Sure",
            "Other"
          ]
        },
        {
          id: "suspension_type",
          label: "Suspension Mechanism",
          type: "select",
          otherOption: true,
          options: [
            "Pin / Distal lock",
            "Lanyard",
            "Sealing sleeve (external)",
            "Seal-In ring (integrated)",
            "Elevated vacuum (EVS)",
            "Vacuum assisted socket system (VASS)",
            "Anatomical / Self-suspending",
            "Suction (valve only, no liner)",
            "Other"
          ]
        },
        {
          id: "Socket_Duration",
          label: "How long have you been using your current socket?",
          type: "number",
          min: 0,
          unit: "months",
          placeholder: "0"
        },
        {
          id: "liner_type",
          label: "Liner Type",
          type: "select",
          otherOption: true,
          options: [
            "Össur Iceross Dermo",
            "Össur Iceross Dermo Plus",
            "Össur Iceross Dermo Seal-In X5",
            "Össur Iceross Comfort",
            "Össur Iceross Sport",
            "Össur Iceross Original",
            "Össur Iceross Seal-In X",
            "Össur Iceross Seal-In V",
            "Össur Iceross Seal-In X5",
            "Össur Iceross Synergy",
            "Össur Iceross Synergy Seal-In X5",
            "Ottobock Derma Comfort",
            "Ottobock Triton Comfort",
            "Ottobock 6Y30 Silicone Liner",
            "WillowWood Alpha Classic (Urethane)",
            "WillowWood Alpha Hybrid (Urethane/Silicone)",
            "WillowWood Alpha SmartTemp",
            "WillowWood Alpha Locking Liner",
            "WillowWood Alpha Seal-In Liner",
            "WillowWood Surge Liner",
            "Alps EasySlide",
            "Alps Supreme Seal",
            "Alps Alpine HP",
            "Alps Cushion Liner (Silicone)",
            "Alps Cushion Liner (Urethane)",
            "Silipos Act/Fit Gel Liner",
            "Silipos Gel Skin Liner",
            "Silipos Soft Strike Liner",
            "Spectra Logic",
            "Spectra Flow",
            "Spectra Form",
            "Silicone (non-branded)",
            "Polyurethane / Urethane (non-branded)",
            "Thermoplastic Elastomer / TPE (non-branded)",
            "Copolymer (non-branded)",
            "Hybrid Silicone-Urethane (non-branded)",
            "No liner (direct suspension)",
            "Other"
          ]
        },
        {
          id: "Liner_Thickness",
          label: "Liner Thickness",
          type: "number",
          min: 0,
          unit: "mm",
          placeholder: "0"
        },
        {
          id: "hours_per_day",
          label: "Hours Wearing Prosthesis per Day",
          type: "number",
          min: 0,
          max: 24,
          unit: "hours"
        },
        {
          id: "days_per_week",
          label: "Days Wearing Prosthesis per Week",
          type: "number",
          min: 0,
          max: 7,
          unit: "days"
        },
      ]
    },

    // ── SECTION 4 ─────────────────────────────────────────────
    {
      id: "mobility_activity",
      title: "Mobility and Activity Level",
      fields: [
        {
          id: "k_level",
          label: "Medicare Functional Classification Level (K Level)",
          type: "select",
          fullWidth: true,
          options: [
            "K0 — No ability or potential to ambulate (no prosthesis use)",
            "K1 — Home ambulatory (household distances only)",
            "K2 — Limited community ambulatory (low-level barriers only)",
            "K3 — Community ambulatory, unlimited (variable cadence)",
            "K4 — High activity (child, active adult, or athlete)"
          ]
        },
        {
          id: "current_fit_rating",
          label: "Current Prosthesis Fit",
          type: "select",
          options: [
            "Very Good - No problems",
            "Mostly Good - minor issues",
            "Fair - noticeable problems",
            "Poor - significant problems limiting use",
            "I am currently between sockets"
          ]
        },
        {
          id: "activity_notes",
          label: "Activity / Mobility Notes",
          type: "textarea",
          placeholder: "Additional notes on mobility and activity...",
          fullWidth: true
        }
      ]
    },

    // ── SECTION 5 ─────────────────────────────────────────────
    {
      id: "residual_limb_health",
      title: "Residual Limb Health",
      fields: [
        {
          id: "skin_integrity",
          label: "Skin Integrity",
          type: "checkbox",
          options: [
            "No skin problems",
            "Blisters",
            "Folliculitis",
            "Rash",
            "Redness",
            "Ulceration",
            "Open Wounds",
            "Excess Sweating"
          ]
        },
        {
          id: "volume_change",
          label: "Reported Volume Change Since Last Fitting",
          type: "radio",
          options: ["Increased", "Decreased", "No change", "Unknown"]
        },
        {
          id: "pain_at_rest",
          label: "Residual Limb Pain at Rest (NRS 0–10)",
          type: "number",
          min: 0,
          max: 10,
          placeholder: "0"
        },
        {
          id: "pain_with_prosthesis",
          label: "Residual Limb Pain with Prosthesis (NRS 0–10)",
          type: "number",
          min: 0,
          max: 10,
          placeholder: "0"
        },
        {
          id: "limb_health_notes",
          label: "Residual Limb Health Notes",
          type: "textarea",
          placeholder: "Additional observations on residual limb health...",
          fullWidth: true
        }
      ]
    },

    // ── SECTION 6 ─────────────────────────────────────────────
    {
      id: "scanning_protocol",
      title: "Scanning Protocol",
      fields: [

        // ── Part A — Setup ────────────────────────────────────
        {
          id: "info_setup",
          type: "info",
          title: "Part A — Registration Target Placement",
          content: "Participant dons gel liner using their usual technique. Confirm full seating with no air pockets.\nPosition the Velcro registration target assembly on the proximal residual limb, above the liner trim line.",
          image: "images/protocol_setup.png",
          imageCaption: "Registration target placement above the liner trim line on the proximal residual limb"
        },
        {
          id: "confirm_liner_seated",
          label: "Gel liner fully seated — no air pockets",
          type: "checkbox",
          fullWidth: true,
          options: ["Confirmed"]
        },
        {
          id: "confirm_target_placed",
          label: "Registration target positioned above liner trim line",
          type: "checkbox",
          fullWidth: true,
          options: ["Confirmed"]
        },
        {
          id: "target_dist_from_mtp",
          label: "Target Distance from Medial Tibial Plateau",
          type: "number",
          min: 0,
          unit: "cm",
          placeholder: "0.0"
        },

        // ── Part A — Physical Reference Measurements ──────────
        {
          id: "info_ref_measurements",
          type: "info",
          title: "Physical Reference Measurements (Part A)",
          content: "Measure total residual limb length first. The 50% and 30% measurement sites will be calculated automatically — place the tape measure at those distances from the distal end. Each circumference is recorded twice; averages are calculated automatically.",
          image: "images/protocol_ref_measurements.png",
          imageCaption: "Circumference measurement locations — 30% and 50% of residual limb length measured from the distal end"
        },
        {
          id: "residual_limb_length",
          label: "Total Residual Limb Length",
          type: "number",
          min: 0,
          unit: "mm",
          placeholder: "0.0"
        },
        {
          id: "location_50pct",
          label: "50% Measurement Site — Distance from Distal End",
          type: "computed",
          formula: "residual_limb_length * 0.5",
          decimals: 1,
          unit: "mm"
        },
        {
          id: "location_30pct",
          label: "30% Measurement Site — Distance from Distal End",
          type: "computed",
          formula: "residual_limb_length * 0.3",
          decimals: 1,
          unit: "mm"
        },
        {
          id: "dist_distal_to_marker",
          label: "Distal End to Proximal Edge of Marker",
          type: "number",
          min: 0,
          unit: "mm",
          placeholder: "0.0"
        },
        {
          id: "circ_50pct_t1",
          label: "Circumference at 50% Limb Length — Trial 1",
          type: "number",
          min: 0,
          unit: "mm",
          placeholder: "0.0"
        },
        {
          id: "circ_50pct_t2",
          label: "Circumference at 50% Limb Length — Trial 2",
          type: "number",
          min: 0,
          unit: "mm",
          placeholder: "0.0"
        },
        {
          id: "circ_50pct_avg",
          label: "Circumference at 50% — Average",
          type: "computed",
          formula: "(circ_50pct_t1 + circ_50pct_t2) / 2",
          decimals: 1,
          unit: "mm"
        },
        {
          id: "circ_30pct_t1",
          label: "Circumference at 30% Limb Length — Trial 1",
          type: "number",
          min: 0,
          unit: "mm",
          placeholder: "0.0"
        },
        {
          id: "circ_30pct_t2",
          label: "Circumference at 30% Limb Length — Trial 2",
          type: "number",
          min: 0,
          unit: "mm",
          placeholder: "0.0"
        },
        {
          id: "circ_30pct_avg",
          label: "Circumference at 30% — Average",
          type: "computed",
          formula: "(circ_30pct_t1 + circ_30pct_t2) / 2",
          decimals: 1,
          unit: "mm"
        },

        // ── Scan 1 ────────────────────────────────────────────
        {
          id: "info_scan1",
          type: "info",
          title: "Scan 1 — Liner-Covered Limb with Registration Target",
          content: "Participant seated, residual limb in standardised position (hip neutral, knee at 0° flexion; any deviation documented). Full 360° scan from distal tip to above the registration target in NIR mode. Review completeness immediately; re-scan incomplete regions and merge. Export as .OBJ or .STL.\n\nFile label: [ID]_Scan1_OverLiner",
          image: "images/protocol_scan1.png",
          imageCaption: "Scan 1: Full 360° scan of the liner-covered limb with registration target in place"
        },
        {
          id: "scan1_position_deviation",
          label: "Scan 1 — Position Deviation from Standard",
          type: "textarea",
          fullWidth: true,
          placeholder: "Leave blank if no deviation. Document any departure from hip neutral / knee 0° here."
        },
        {
          id: "scan1_complete",
          label: "Scan 1 Complete",
          type: "checkbox",
          fullWidth: true,
          options: ["Confirmed — exported as [ID]_Scan1_OverLiner"]
        },

        // ── Scan 2 ────────────────────────────────────────────
        {
          id: "info_scan2",
          type: "info",
          title: "Scan 2 — Bare Residual Limb with Registration Target",
          content: "Participant removes gel liner. Maintain the same participant position as Scan 1. Full 360° scan; review and export.\n\nFile label: [ID]_Scan2_BareLimb",
          image: "images/protocol_scan2.png",
          imageCaption: "Scan 2: Bare residual limb with registration target retained in the same position"
        },
        {
          id: "confirm_liner_removed",
          label: "Gel liner removed",
          type: "checkbox",
          fullWidth: true,
          options: ["Confirmed"]
        },
        {
          id: "scan2_position_deviation",
          label: "Scan 2 — Position Deviation from Standard",
          type: "textarea",
          fullWidth: true,
          placeholder: "Leave blank if no deviation."
        },
        {
          id: "scan2_complete",
          label: "Scan 2 Complete",
          type: "checkbox",
          fullWidth: true,
          options: ["Confirmed — exported as [ID]_Scan2_BareLimb"]
        },

        // ── Scans 3–5 ─────────────────────────────────────────
        {
          id: "info_scan345",
          type: "info",
          title: "Scans 3–5 — Socket Integration (Part D)",
          content: "Scan 3: Remove socket from pylon/foot or place in jig; full 360° scan of exterior and interior where possible; affix second registration target to socket exterior.\nScan 4: Participant re-dons liner and socket fully; registration target remains affixed above liner trim line.\nScan 5: Remove socket; retain liner and registration target in same position; full 360° scan as within-session drift reference.\n\nFile labels: [ID]_Scan3_Socket  /  [ID]_Scan4_LimbLinerSocket  /  [ID]_Scan5_LimbLinerMarker",
          image: "images/protocol_scan3_5.png",
          imageCaption: "Scans 3–5: Socket isolated (Scan 3), worn on limb with liner (Scan 4), and liner-only drift reference (Scan 5)"
        },
        {
          id: "scan3_complete",
          label: "Scan 3 Complete",
          type: "checkbox",
          fullWidth: true,
          options: ["Confirmed — exported as [ID]_Scan3_Socket"]
        },
        {
          id: "scan4_complete",
          label: "Scan 4 Complete",
          type: "checkbox",
          fullWidth: true,
          options: ["Confirmed — exported as [ID]_Scan4_LimbLinerSocket"]
        },
        {
          id: "scan5_complete",
          label: "Scan 5 Complete",
          type: "checkbox",
          fullWidth: true,
          options: ["Confirmed — exported as [ID]_Scan5_LimbLinerMarker"]
        },
        {
          id: "confirm_materials_removed",
          label: "All scanning materials and registration targets removed",
          type: "checkbox",
          fullWidth: true,
          options: ["Confirmed"]
        },
        {
          id: "scanning_notes",
          label: "Scanning Session Notes",
          type: "textarea",
          fullWidth: true,
          placeholder: "Any additional notes about the scanning session..."
        }
      ]
    },

    // ── SECTION 7 ─────────────────────────────────────────────
    {
      id: "post_scan_questionnaire",
      title: "Post-Scan Questionnaire",
      fields: [
        {
          id: "post_scan_notes",
          label: "Post-Scan Notes",
          type: "textarea",
          fullWidth: true,
          placeholder: "Post-scan questionnaire responses and notes..."
        }
      ]
    }

  ]
};
