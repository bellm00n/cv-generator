# App requirements (MVP)

CV Generator is a lightweight web application for creating an ATS-friendly CV in English with a live preview and one-click PDF export.

External ATS scoring/checker integrations are out of scope for MVP.

## General principles

- No UI libraries (no MUI/Ant/etc.). Use Tailwind + small custom components only.
- Visual style: clear, minimalistic, ATS-friendly (avoid heavy decoration, excessive icons, complex multi-column layouts).
- Consistency first: spacing, typography scale, border radius, button styles, and form controls should follow one simple system across the app.
- Fast & calm UI: avoid animations except subtle state transitions (focus/hover). No “busy” visuals.
- Persist form state in `localStorage` (autosave + restore on reload).

## Editor (Form UI)

### Layout & structure

- Single long form with clearly separated sections.
- Each section has:
  - title + short helper text (optional)
  - consistent spacing (same vertical rhythm between inputs)
  - optional “Add item” / “Remove” controls for repeatable sections (Experience, Education).

### Inputs & interactions

- Inputs should be accessible by default:
  - visible `<label>` for every field
  - logical tab order
  - clear focus styles
  - inline validation messages (small, neutral tone)
  - validation is warning-only for MVP and does not block PDF export

- Repeatable blocks (Experience/Education):
  - each item displayed as a bordered card or simple container
  - actions: Add, Remove, optionally Move up/down (nice-to-have; not required unless you want sorting)

- Summary textarea:
  - free-form
  - character counter shown under the field
  - no hard limit (counter only)

### Canonical fields

- Name and surname
- Title
- City
- Number
- Email
- Summary
- Employment history (repeatable cards):
  - Title
  - Company name
  - Start date and End date (optional)
  - Bullets with description
  - If End date is empty, show `Present` in preview/PDF
- Education (repeatable cards):
  - Degree
  - University
  - Start date and End date
- Skills (list of keywords)
- Languages (list)

### Visual style

- Minimal color palette (mostly neutrals) with 1 accent color for interactive elements.

- Buttons:
  - primary (Download PDF)
  - secondary (Preview on mobile/tablet)
  - destructive (Remove item) with clear but not aggressive styling

- Error states: consistent red tone + message; don’t over-highlight.

## Preview behavior (Responsive design)

- Preview should look like the generated PDF and render as paginated A4 pages with visible page boundaries.
- Desktop: two-pane layout (Editor + Preview visible). No “Preview” button.
- Mobile/Tablet: preview hidden by default to prioritize editing space.
  - “Preview” button opens preview (panel / modal / route—implementation choice)
  - easy way to return to editor (Back / Close)

## PDF styling reference

- Reference: `docs/cv-example.pdf`

- Essential design tokens (MVP):
  - Page: A4 (`595.28pt x 841.89pt`), horizontal margin `41pt`, top offset `30pt`
  - Layout: main column start `58pt`, sidebar start `413pt`, sidebar width `141.28pt`
  - Colors: primary text `#262B33`, muted text `#98A1B2`, links `#2196F3`, page background `#FFFFFF`
  - Typography: `"Source Sans Pro", sans-serif`; weights `400/600`; sizes: name `23pt`, section heading `14pt`, body `10.6pt`, meta `9pt`
  - Rhythm: body line-height `15.37pt`, block gap `21.37pt`, section gap `36.8pt`

- MVP PDF template should match this reference in section order, hierarchy, spacing, and overall ATS-friendly clarity.

## Technical stack (MVP)

- Next.js (React framework; routing and app structure)
- Tailwind CSS (UI styling)
- @react-pdf/renderer (rendering CV preview + generating PDF)
- Zod + React Hook Form for form validation and structured data
- LocalStorage for autosave (still “no backend”)