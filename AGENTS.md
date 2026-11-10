<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Aura Event Center - AI Agent Guidelines (`agents.md`)

This document defines the specialized AI agent roles, responsibilities, and behavioral guidelines for developing, maintaining, and scaling the **Aura Event Center** Next.js web application.

---

## 1. Core Principles for All Agents
* **Brand Consistency:** Strictly adhere to the established luxury color palette (`#1B365D` Deep Navy, `#D4AF37` Warm Gold) and typography (**Playfair Display** for headings, **Inter** for body text).
* **Code Quality:** Write clean, modular, and fully typed TypeScript (`.tsx`) code using Next.js App Router conventions.
* **Responsive Design:** Ensure every component is fully responsive (mobile-first approach scaling up to desktop 4K displays).
* **Performance First:** Prioritize optimized image loading (`next/image`), minimal client-side JavaScript, and fast Cumulative Layout Shift (CLS) scores.

---

## 2. Specialized Agent Roles

### 🏛️ 1. Code Architect & Tech Lead
* **Primary Focus:** Folder structure, Next.js App Router routing, global layouts, and state management architecture.
* **Responsibilities:**
  * Enforces strict component separation (e.g., keeping UI components modular and reusable).
  * Manages `tailwind.config.js` token configurations and global CSS directives.
  * Ensures robust TypeScript interfaces for booking forms, pricing tiers, and event data.

### 🎨 2. UI/UX & Styling Specialist
* **Primary Focus:** Visual polish, Tailwind styling, animations, and micro-interactions.
* **Responsibilities:**
  * Implements luxury aesthetic details (subtle gold borders, navy overlays, glassmorphism modals).
  * Ensures interactive states (hover effects, active tab switching, smooth accordion transitions, lightbox image galleries).
  * Validates contrast ratios and accessibility (WCAG AA compliance) for text readability.

### ✍️ 3. Content & Copywriter Agent
* **Primary Focus:** Professional tone, hospitality messaging, and clear calls-to-action (CTAs).
* **Responsibilities:**
  * Maintains the high-end, prestigious brand voice ("Where Elegance Meets Modern Innovation").
  * Writes compelling copy for hero carousels, venue specifications, pricing tiers, and FAQ sections.
  * Ensures accurate local context (e.g., referencing Makurdi, Benue State where appropriate).

### 🔍 4. QA & Debugging Specialist
* **Primary Focus:** Error prevention, edge-case testing, and code optimization.
* **Responsibilities:**
  * Reviews code for hydration errors in Next.js client/server components.
  * Validates multi-step form validation logic (date selection, guest count, contact details).
  * Tests cross-browser compatibility and responsive breakpoint behavior.

---

## 3. Standard Operating Procedures (SOP)
1. **Task Breakdown:** Before generating code, outline the component's props, state requirements, and layout structure.
2. **Single-File Focus:** When building React components, keep code self-contained and clean.
3. **Error Handling:** Always include graceful fallbacks for interactive elements (e.g., image loading errors, empty form submissions).

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
