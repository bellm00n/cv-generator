# Task 1: Project Setup and Application Shell

## Goal
Initialize the MVP foundation with Next.js and required libraries, and create a responsive app shell that supports parallel Editor and Preview development.

## Scope
- Bootstrap a Next.js project structure (App Router recommended) if not already present.
- Install and configure required MVP dependencies:
  - `tailwindcss` (+ PostCSS/autoprefixer setup)
  - `@react-pdf/renderer`
  - `react-hook-form`
  - `zod`
  - `@hookform/resolvers`
- Define a single shared design baseline:
  - base typography scale
  - spacing rhythm
  - neutral color palette + one accent color
  - shared button/input primitives (minimal custom components, no UI kit)
- Implement the main responsive layout only (no functional editor/preview yet):
  - desktop: two-pane container (left = editor area, right = preview area)
  - mobile/tablet: editor-first layout with preview region hidden by default
- Add placeholder sections/components:
  - `EditorPanel` placeholder
  - `PreviewPanel` placeholder
  - top-level action area with disabled/placeholder controls
- Add application data model scaffolding for CV structure (TypeScript types/interfaces) without full business logic.
- Ensure no backend dependency is introduced (local-only app architecture).

## Testable Outcodes
- [x] `npm run build` starts without setup errors.
- [x] Tailwind styles are applied correctly in the app.
- [x] Project includes all required MVP libraries in `package.json`.
- [x] Desktop viewport shows two panes side-by-side.
- [x] Mobile/tablet viewport prioritizes editor area and hides preview by default.
- [x] No actual editor form or PDF rendering logic is implemented in this task.

---

# Task 2: Implement Editor Form (Data Entry + Validation + Autosave)

## Goal
Build a complete, accessible CV editor form with repeatable sections, warning-only validation, and `localStorage` autosave/restore.

## Scope
- Implement Editor UI as a single long form with clearly separated sections and consistent spacing.
- Build canonical form fields:
  - Name and surname
  - Title
  - City
  - Number
  - Email
  - Summary (textarea + character counter)
  - Skills (list input)
  - Languages (list input)
- Implement repeatable section: Employment history
  - fields: title, company name, start date, end date (optional), bullet descriptions
  - controls: Add item, Remove item
  - optional: Move up/down (nice-to-have only)
- Implement repeatable section: Education
  - fields: degree, university, start date, end date
  - controls: Add item, Remove item
  - optional: Move up/down (nice-to-have only)
- Use `react-hook-form` + Zod schema:
  - define structured validation for all fields
  - show inline validation messages in neutral warning style
  - do not block PDF export on validation warnings (MVP rule)
- Accessibility requirements:
  - visible `<label>` for each input
  - logical tab order
  - clear focus states
  - consistent error/warning presentation
- Implement autosave:
  - persist form state to `localStorage` on change/debounced change
  - restore saved state on reload
  - handle malformed/old saved data gracefully

## Testable Outcodes
- [ ] All canonical fields from requirements are editable in the UI.
- [ ] Experience/Education items can be added and removed reliably.
- [ ] Summary shows a live character counter with no hard limit enforcement.
- [ ] Validation messages are shown inline and do not prevent continuing workflow.
- [ ] Keyboard navigation works across all controls with visible focus.
- [ ] Form data persists after refresh and is restored from `localStorage`.
- [ ] No backend/API call is required for saving form state.

---

# Task 3: Implement PDF Preview and Download

## Goal
Render a live, ATS-friendly A4 CV preview from form data and support one-click PDF export that follows the provided reference layout.

## Scope
- Create a `@react-pdf/renderer` document template mapped to editor data.
- Implement section ordering and hierarchy to match MVP requirements and `docs/cv-example.pdf`.
- Apply essential design tokens in template:
  - A4 page size (`595.28pt x 841.89pt`)
  - margins/offsets and column geometry from requirements
  - typography (`"Source Sans Pro"`, weights/sizes per spec)
  - colors (`#262B33`, `#98A1B2`, `#2196F3`, white background)
  - spacing rhythm (line-height/block/section gaps)
- Implement preview behavior:
  - desktop: live preview visible in right pane by default
  - mobile/tablet: preview opened via explicit button and closable back to editor
  - preview should visually represent paginated A4 pages with clear boundaries
- Implement PDF export action:
  - one-click “Download PDF” button
  - generated file reflects current form state
- Add data transformation rules:
  - if employment end date is empty, show `Present`
  - normalize list rendering for skills/languages/bullets
- Ensure warning-only validation does not block preview or export.

## Testable Outcodes
- [ ] Right pane (desktop) shows a live CV preview based on current form data.
- [ ] Mobile/tablet flow allows opening and closing preview without losing form input.
- [ ] Preview output follows the intended ATS-friendly structure and hierarchy.
- [ ] Empty employment end date renders as `Present` in preview/PDF.
- [ ] Clicking “Download PDF” exports a valid PDF file.
- [ ] Exported PDF visually aligns with `docs/cv-example.pdf` reference at MVP level.
- [ ] Validation warnings are visible but do not block preview or PDF download.
