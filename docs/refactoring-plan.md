# Refactoring Plan

## Phase 1: Infrastructure

Set up ESLint + Prettier (linter and formatter in one)
- Install `prettier`, `prettier-plugin-tailwindcss`, `eslint-plugin-prettier`, `eslint-config-prettier`
- Install `eslint`, `eslint-config-next`, `@typescript-eslint/*` plugins
- Configure `.eslintrc.json` (strict TS rules, react-hooks, import order + prettier plugin)
- Prettier uses the default (recommended) config, no separate `.prettierrc.json`
- Prettier runs as an ESLint rule via `eslint-plugin-prettier` — a single `eslint --fix` call formats and lints
- Update npm script `lint` to run linter with auto-fix on the entire project
- Format the entire project and fix lint errors


## Phase 2: Structure Refactoring

### 2.1. Split `EditorPanel.tsx` (771 lines)
Extract into separate components:
- `PersonalDetailsSection`
- `SummarySection`
- `LinksSection`
- `SkillsSection`
- `LanguagesSection`
- `EmploymentHistorySection` (in editor/)
- `EducationSection` (in editor/)

### 2.2. Split `cvForm.ts` (421 lines)
- `src/lib/schemas.ts` — Zod schemas
- `src/lib/normalizers.ts` — normalization functions
- `src/lib/mappers.ts` — data mapping

### 2.3. Simplify `app/page.tsx` (206 lines)
- Extract file import/export logic into a hook or utility

## Phase 3: Code Cleanup

### 3.1. Remove duplication
- Consolidate `MONTH_LABELS` / `MONTH_FULL_NAMES` into one place (`constants.ts`)
- Extract repeated card styles into a component or constant
- Extract regex patterns (dates, bold) into constants

### 3.2. Fix dirty code
- Fill empty `catch` blocks — at least `console.error`
- Remove `as unknown` casts where possible

### 3.3. Add barrel exports (index.ts)
- `src/components/ui/index.ts`
- `src/components/editor/index.ts`
- `src/components/preview/index.ts`