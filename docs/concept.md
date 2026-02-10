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

- Reference: `docs/cv-example.pdf`

- Main design tokens (measured from the PDF content stream and rendered preview):

### Page and layout tokens

- `page.size`: A4 (`595.28pt x 841.89pt`)
- `page.margin.x`: `41pt`
- `page.contentWidth`: `513.28pt` (`595.28 - 41*2`)
- `page.topOffset`: `30pt` (container offset before header block)
- `layout.headerStartX`: `41pt`
- `layout.mainColumnStartX`: `58pt`
- `layout.sidebarStartX`: `413pt`
- `layout.sidebarWidth`: `141.28pt` (`595.28 - 413 - 41`)
- `layout.sectionIconIndent`: `17pt` (difference between `41pt` and `58pt`)

### Color tokens

- `color.text.primary`: `#262B33` (RGB `38, 43, 51`)
- `color.text.muted`: `#98A1B2` (RGB `152, 161, 178`) for dates/subtitle
- `color.icon.primary`: `#0F141F` (RGB `15, 20, 31`) for section icons
- `color.link`: `#2196F3` (RGB `33, 150, 243`)
- `color.background.page`: `#FFFFFF`

### Typography tokens

- `font.family.base`: `"Source Sans Pro", sans-serif`
- `font.weight.regular`: `400` (from `SourceSansPro-Regular`)
- `font.weight.semibold`: `600` (from `SourceSansPro-SemiBold`)
- `font.size.name`: `23pt`
- `font.size.sectionHeading`: `14pt`
- `font.size.subsectionHeading`: `11pt`
- `font.size.body`: `10.6pt`
- `font.size.sidebarItem`: `10pt`
- `font.size.meta`: `9pt`

### Spacing and rhythm tokens

- `lineHeight.body`: `15.37pt` (most body lines)
- `space.block`: `21.37pt` (recurring block/list gap)
- `space.sectionGap`: `~36.8pt` (major section jump)

- MVP PDF template should match this reference in section order, hierarchy, spacing, and overall ATS-friendly clarity.
