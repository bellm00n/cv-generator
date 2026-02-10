# App requirements (MVP)

CV Generator is a lightweight web application for creating an ATS-friendly CV in English with a live preview and one-click PDF export.

## General principles

- No UI libraries (no MUI/Ant/etc.). Use Tailwind + small custom components only.
- Visual style: clear, minimalistic, ATS-friendly (avoid heavy decoration, excessive icons, complex multi-column layouts).
- Consistency first: spacing, typography scale, border radius, button styles, and form controls should follow one simple system across the app.
- Fast & calm UI: avoid animations except subtle state transitions (focus/hover). No “busy” visuals.

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

- Repeatable blocks (Experience/Education):
  - each item displayed as a bordered card or simple container
  - actions: Add, Remove, optionally Move up/down (nice-to-have; not required unless you want sorting)

- Summary textarea:
  - free-form
  - character counter shown under the field
  - no hard limit (counter only)

### Visual style

- Minimal color palette (mostly neutrals) with 1 accent color for interactive elements.

- Buttons:
  - primary (Download PDF)
  - secondary (Preview on mobile/tablet)
  - destructive (Remove item) with clear but not aggressive styling

- Error states: consistent red tone + message; don’t over-highlight.

## Preview behavior (Responsive design)

- Desktop: two-pane layout (Editor + Preview visible). No “Preview” button.
- Mobile/Tablet: preview hidden by default to prioritize editing space.
  - “Preview” button opens preview (panel / modal / route—implementation choice)
  - easy way to return to editor (Back / Close)

## PDF styling reference

- The PDF layout should follow the provided example screenshot:
  - Reference: `docs/cv-example.pdf`

- MVP template should match this reference closely in:
  - section order
  - typography hierarchy
  - spacing and alignment
  - overall “clean ATS-friendly” look
