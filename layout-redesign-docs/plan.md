# CV Generator — Layout Redesign Plan

Implements the redesigned CV-editor and CV-list pages described in `task.md` (mockups 1–5).

Stack notes (already in repo): Next.js App Router, React 19, Tailwind v4, `react-hook-form`, `@react-pdf/renderer` + `react-pdf`, `next-auth`. Icons library `lucide-react` is **not yet installed** — task 1 adds it.

Conventions: every task is self-contained, deliverable, and ends with `npm run lint` clean. Tasks 2–8 depend on task 1.

---

## Task 1 — Foundations: icons + reusable Dropdown + SideMenu shell

**Mockups.** `./cv-page-left-side-menu.png` (SideMenu overlay, Dropdown popover), `./cv-page-mobile.png` (Dropdown `sheet` variant), `./cv-list.png` (SideMenu static).

**Description.**
Install `lucide-react` and build the two new generic UI primitives the rest of the work needs: a `Dropdown` (anchor button + menu) and a `SideMenu` (slide-in container with optional backdrop). These must look right both on desktop (popover under anchor) and mobile (full-screen overlay variant with list-style options + Cancel) — mobile variant matches mockup 3 (`Theme`/`Download` lower-right menus).

**Todo.**
- `npm i lucide-react` and verify `npm run lint`.
- `src/components/ui/Dropdown.tsx`: props `{ trigger, items: { label, onSelect, disabled? }[], align?, variant?: "popover" | "sheet" }`. Closes on outside click, `Escape`, or item select. `sheet` variant: full-screen gray overlay, options as full-width rows, a `Cancel` row at bottom.
- `src/components/ui/SideMenu.tsx`: props `{ open, onClose, variant: "overlay" | "static", children }`. `overlay` renders a fixed left panel + gray backdrop (click backdrop → `onClose`). `static` renders an in-flow left column (no backdrop, no close). Use Tailwind responsive helpers so a single instance can flip variants by breakpoint.
- Re-export from `src/components/ui` index if one is added (otherwise import directly).
- **Add a throwaway demo route** `app/(app)/_ui-demo/page.tsx` (client component) that mounts every variant of both primitives so the task can be verified by hand. Required placements:
  - A `Dropdown` (`popover` variant) with 2–3 sample items + one `disabled` item — anchored to a button labelled "Open popover".
  - A `Dropdown` (`sheet` variant) anchored to a separate button labelled "Open sheet" — items + a `Cancel` row.
  - A `SideMenu` (`overlay` variant) toggled by a hamburger button, with placeholder content + a `lucide-react` icon (e.g. `Github`) inside.
  - A `SideMenu` (`static` variant) rendered alongside the main content so both modes are visible at once.
  - Page heading "UI primitives demo" so it's obvious this route is non-production.
- The demo route is deleted in Task 8 — do **not** link to it from any other page.

**Testable outcomes.**
- Navigate to `/_ui-demo` and the page renders without console errors.
- `Open popover` button: opens under the button, closes on (a) item click, (b) outside click, (c) `Escape`. Disabled item does not fire `onSelect`.
- `Open sheet` button: opens a full-screen gray overlay with options as list rows; tapping `Cancel` or the backdrop dismisses it.
- Overlay `SideMenu`: hamburger opens it; clicking the backdrop closes; pressing `Escape` closes; body does not scroll while open.
- Static `SideMenu`: always visible next to main content; no backdrop; no close affordance.
- `lucide-react` icon is visible inside the overlay menu (smoke-check the dependency installed correctly).
- `npm run lint` passes.

---

## Task 2 — Left-side menu content + user logout popover

**Mockups.** `./cv-page-left-side-menu.png` (primary — menu contents and order), `./cv-list.png` and `./cv-list-mobile.png` (same menu rendered in static/overlay contexts).

**Description.**
Build the actual menu content rendered inside the `SideMenu` shell from task 1. Same component is reused by the CV editor page (overlay) and CV list page (static on desktop, overlay on mobile).

**Todo.**
- `src/components/AppSideMenu.tsx` (server-friendly: receives `session` as prop, no `auth()` call inside).
- Contents top→bottom: app title "CV Generator" (links to `/`), user block (avatar + name) — clickable, opens a small popover/dropdown anchored to the user row containing a `Log Out` action (reuse Task 1 `Dropdown`), nav links: `Main` → `/`, `My Resumes` → `/cv-list`, `Cover Letters` → disabled (visually muted, no href). Bottom of menu: GitHub link (icon + label, `href="https://github.com/bellm00n/cv-generator"`, `target="_blank"`, `rel="noopener noreferrer"`) — pin to bottom with `mt-auto`.
- Use `lucide-react` icons (e.g. `Home`, `FileText`, `Mail`, `Github`).
- `Log Out` action wires to existing `signOut` flow used in `Header.tsx`. Extract a small client wrapper for the form action.
- The 9-dot hamburger trigger is **not** in this component — pages render their own trigger and pass `open`/`onClose` to the shell.

**Testable outcomes.**
- Menu renders all required entries in the documented order.
- Clicking the user row opens a popover with `Log Out`; clicking `Log Out` signs out and redirects to `/`.
- `Cover Letters` is rendered but not clickable / no navigation.
- GitHub link points to `https://github.com/bellm00n/cv-generator` and opens in a new tab.
- Works inside both `overlay` and `static` `SideMenu` variants.
- `npm run lint` passes.

---

## Task 3 — CV editor page: new desktop layout, header, dropdowns (mockups 1 & 2)

**Mockups.** `./cv-page-scrolling.png` (3-pane 100vh layout, sticky header, fixed preview pagination), `./cv-page-left-side-menu.png` (header buttons: title left, Theme + Download dropdowns).

**Description.**
Rebuild the `/cv/[id]` page as a three-pane 100vh layout: sticky header on top, left editor scrolling independently, right preview scrolling independently. Move CV-title editing and download into the header. Add Theme dropdown (disabled — "Coming soon"). Wire hamburger to open the side menu (overlay variant on this page). The global `<Header />` from `app/(app)/layout.tsx` is no longer rendered here — the page owns its header.

**Todo.**
- Remove the global header from `/cv/[id]` page (either via a route-group restructure or by gating `<Header />` in `app/(app)/layout.tsx` so it's not rendered for the CV page; pick the simpler option).
- New `src/components/cv/CvPageHeader.tsx` containing, left→right: 9-dot hamburger (opens side menu), `EditableCvTitle`, `Theme` `Dropdown` (single disabled item "Coming soon"), `Download` `Dropdown` with `Download as PDF` (reuses `DownloadPdfButton` logic) and `Download as JSON` (existing `handleDownloadData`).
- Page shell: `h-screen flex flex-col`; header `shrink-0`; body `flex-1 grid grid-cols-2 min-h-0`; each pane `overflow-y-auto`.
- Remove the old "Upload data / Download data / Reset" button row entirely from `CvEditorPage.tsx`. Drop `handleUploadData`, `handleFileChange`, `handleReset`, `fileInputRef`, `editorKey` reset path — they move to cv-list (task 7).
- Preview pagination: lift the page nav out of `PdfPreviewFrame`'s scroll-flow and render it sticky/fixed at the bottom of the right pane (always visible while preview scrolls). Always render the controls even when `numPages <= 1` (per mockup 1 the chip is always shown — disable arrows in that case).
- Hook hamburger to `AppSideMenu` in overlay variant.

**Testable outcomes.**
- Page height equals viewport (no page-level scrollbar).
- Header stays visible while scrolling either pane.
- Left and right panes scroll independently.
- Pagination arrows + `n / total` remain visible at the bottom of the right pane regardless of preview scroll position.
- CV title edits in the header persist (PATCH to `/api/cv/[id]`).
- `Download` dropdown produces a valid PDF and a valid JSON file.
- `Theme` dropdown opens and shows "Coming soon" only.
- Hamburger opens the side menu; backdrop closes it.
- `npm run lint` passes.

---

## Task 4 — CV editor page: mobile adaptation (mockup 3)

**Mockup.** `./cv-page-mobile.png` (header Preview/Edit toggle, fixed bottom Theme/Download bar, sheet-style dropdowns with gray overlay).

**Description.**
At `<lg` breakpoint, the header keeps only the hamburger + CV title + a `Preview` toggle (label flips to `Edit` when preview is shown). Theme and Download move to a fixed bottom bar. Their dropdowns use the `sheet` variant from task 1.

**Todo.**
- In `CvPageHeader`, hide Theme/Download on mobile; show a right-side `Preview` ↔ `Edit` toggle button that flips `isMobilePreviewOpen`.
- Below `lg`, render a fixed bottom bar (`fixed bottom-0 inset-x-0`) containing `Theme` (left) and `Download as PDF / Download as JSON` (right) — both as `sheet`-variant dropdowns.
- Remove the existing "Open Preview / Back to editor" sticky bar from `CvEditorPage.tsx` (replaced by the header toggle).
- Ensure the bottom bar doesn't cover content: add bottom padding to the active pane on mobile.

**Testable outcomes.**
- On a narrow viewport: header shows hamburger + title + Preview toggle only.
- Tapping Preview hides editor and shows preview; button label becomes `Edit`; tapping again returns to editor.
- Bottom bar always visible, doesn't occlude scrollable content.
- Tapping Theme/Download opens a full-screen sheet with options listed; `Cancel` dismisses it.
- Selecting `Download as PDF` / `Download as JSON` produces the same files as desktop.
- Hamburger and side menu still work.
- `npm run lint` passes.

---

## Task 5 — Copy-CV API endpoint

**Mockup.** `./cv-list.png` (Copy action on each card — this task is the backend that powers it).

**Description.**
Add `POST /api/cv/[id]/copy` that duplicates a CV owned by the current user.

**Todo.**
- New route file `app/api/cv/[id]/copy/route.ts`.
- Reuse the auth + ownership check pattern from `app/api/cv/[id]/route.ts`.
- Insert a new row with `data` cloned verbatim and `title = "<original> copy"` (append " copy" suffix; if the original already ends in " copy", append again — simple, no de-duplication).
- Return the new CV (`{ id, title, ... }`, 201).

**Testable outcomes.**
- Unauthenticated request → 401.
- Foreign-user CV id → 403.
- Unknown id → 404.
- Owned id → 201 with new `id` ≠ original; `title` is `"<orig> copy"`; data deep-equal to original. Listing `/api/cv` returns both rows.
- `npm run lint` passes.

---

## Task 6 — CV list page: new desktop layout with persistent side menu (mockup 4)

**Mockup.** `./cv-list.png` (persistent side menu, "My resumes" heading + `New ▾` split button, 3-column card grid with Download/Copy/Remove icon row).

**Description.**
Replace the current `/cv-list` page. No top header on this route. Left column is the side menu (`static` variant). Right column has a "My resumes" heading with a New button + chevron-dropdown, and a responsive card grid.

**Todo.**
- Suppress the global `<Header />` on `/cv-list` (same mechanism chosen in task 3).
- New page layout: `flex h-screen` → `<AppSideMenu variant="static">` (≥lg) + main scroll area.
- Heading row: `<h1>My resumes</h1>` and on the right a split button: primary `New +` (creates blank CV and routes to `/cv/[id]`); attached chevron opens a `Dropdown` with `Create` (same as primary) and `Upload JSON`.
- `Upload JSON` opens a hidden `<input type="file">` (reuse logic ported from old `CvEditorPage` upload flow — parse via `parseImportedCv`, then POST to `/api/cv`, then route to the new CV).
- Card grid: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4`. Each card has: title (links to editor), `Created at: dd.mm.yyyy`, and an icon row with: `Download PDF` (lucide `Download`), `Copy` (lucide `Copy` → calls new `/copy` endpoint, then optimistic insert into list), `Remove` (lucide `Trash2` → existing DELETE flow with confirm).
- `GET /api/cv` already returns `createdAt`; format dd.mm.yyyy on the client.
- `Download PDF` from a card: fetch the CV's `data`, parse via `parseImportedCv`, render via existing `CvPdfDocument` + `@react-pdf/renderer` `pdf().toBlob()` — trigger download. Extract a small helper so this isn't duplicated.

**Testable outcomes.**
- `/cv-list` shows no top header on desktop.
- Side menu visible alongside (does not overlap) the list.
- `New +` creates a CV and navigates to it.
- Chevron dropdown shows `Create` and `Upload JSON`; uploading a valid JSON creates a CV and navigates to it; invalid JSON shows the existing error alert.
- Cards render in 3 columns on xl, 2 on md, 1 on sm.
- Each card shows formatted `dd.mm.yyyy` created date.
- `Download PDF` from a card produces a valid PDF.
- `Copy` creates a new card with `<orig> copy` and persists across reload.
- `Remove` confirms then removes the card.
- `npm run lint` passes.

---

## Task 7 — CV list page: mobile adaptation (mockup 5)

**Mockup.** `./cv-list-mobile.png` (mobile header with hamburger + `New ▾` split button, side menu becomes overlay, cards stack 1-per-row).

**Description.**
At `<lg`, hide the static side menu, add a mobile header containing a hamburger (opens the menu in `overlay` variant) and the `New` split button. Card grid collapses to 1 column.

**Todo.**
- On `/cv-list`, render a mobile-only header (`lg:hidden`) with: left — 9-dot hamburger; right — same `New +` split button as desktop.
- Hide the inline heading row's `New +` button on mobile (avoid duplication) — keep the `<h1>My resumes</h1>` on its own row below the mobile header.
- Switch `<AppSideMenu>` from `static` to `overlay` below `lg` (or render two instances gated by breakpoint — pick the simpler).
- Verify card grid responsiveness (already handled in task 6's classes).

**Testable outcomes.**
- On narrow viewport: top mobile header with hamburger + New visible.
- Tapping hamburger opens side menu over the page; tapping backdrop closes it.
- Cards stack 1 per row.
- All card actions (Download/Copy/Remove) still work.
- `npm run lint` passes.

---

## Task 8 — Cleanup, polish, regression sweep

**Mockups.** All — `./cv-page-scrolling.png`, `./cv-page-left-side-menu.png`, `./cv-page-mobile.png`, `./cv-list.png`, `./cv-list-mobile.png` (used as the visual checklist for the regression sweep).

**Description.**
Remove dead code surfaced by the redesign, consolidate duplicate utilities, and walk through both pages on desktop and mobile to catch regressions.

**Todo.**
- **Delete the Task 1 demo route** `app/(app)/_ui-demo/` and confirm no imports reference it.
- Delete any unused exports/files left behind from the old editor button row (e.g. `editorKey` if no longer needed, any reset utility).
- Confirm `EditableCvTitle` styling fits in the header (font size / inline edit affordance still readable).
- Verify autosave still triggers from the editor pane (task 3 changes shouldn't have touched it, but confirm).
- Check unauthenticated `/cv-list` and `/cv/[id]` redirects still work.
- Manual pass: editor desktop scroll behavior, mobile preview toggle, sheet dropdowns, side menu open/close on both pages, copy/delete/download from card.
- `npm run lint` passes.

**Testable outcomes.**
- `/_ui-demo` returns 404 (route is gone).
- No console errors on either page (desktop + mobile widths).
- No dead imports / unused vars (lint clean).
- Existing autosave still fires on edits.
- All flows from tasks 3–7 work end-to-end after the cleanup.

---

## Decisions captured from clarifying questions

- **Reset button is removed.** Not relocated anywhere.
- **Upload JSON moves to cv-list `New` dropdown** (no longer reachable from the editor).
- **Download dropdown** = PDF + JSON only. No Upload / Reset entries.
- **Cv-list desktop has no top header.** Sign-out lives behind the user-row popover in the side menu.
- **Copy CV** = new server endpoint `POST /api/cv/[id]/copy`.
- **Theme dropdown** = single disabled "Coming soon" item; no per-theme selection.
