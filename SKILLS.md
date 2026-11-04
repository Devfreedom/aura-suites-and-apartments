# Aura Event Center - Agent Skills & Workflows (`skills.md`)

This document defines the technical competencies, automated workflows, and domain-specific knowledge bases available to AI agents working on the Aura Event Center repository.

---

## 1. Technical Skill Stack
* **Framework:** Next.js (App Router, Server & Client Components, `next/font`, `next/image`).
* **Styling:** Tailwind CSS (Custom utility extensions, flexbox/grid layouts, responsive breakpoints).
* **Iconography & UI Utilities:** `lucide-react` icon integration, headless UI patterns for modals and dropdowns.
* **Language:** TypeScript (Strict typing for component props, booking schemas, and API payloads).

---

## 2. Core Operational Workflows

### Workflow A: Component Development & Integration
1. **Analyze Requirements:** Check brand guidelines (Navy `#1B365D`, Gold `#D4AF37`, Playfair Display, Inter).
2. **Draft Component:** Create clean `.tsx` files with proper TypeScript interfaces.
3. **Integrate Tailwind:** Use established token classes (`bg-navy`, `text-gold`, `font-serif`).
4. **Verify Interactivity:** Ensure client hooks (`'use client'`) are correctly scoped only where needed (e.g., carousels, modals, accordions).

### Workflow B: Luxury Branding & Styling Calibration
* **Color Application:** 
  * Primary backgrounds and headers use Deep Navy (`#1B365D`).
  * Accents, badges, highlights, and borders use Warm Gold (`#D4AF37`).
  * Clean off-white (`#F9FAFB`) for section backgrounds to maintain breathability and elegance.
* **Typography Enforcement:**
  * Headings (`<h1>` to `<h3>`) inherit serif styling (`font-serif`).
  * Body copy, buttons, and metadata inherit clean sans-serif (`font-sans`).

### Workflow C: Interactive Feature Handling
* **Lightbox Photo Gallery (`TourModal.tsx`):** Navigation logic, keyboard event listeners (Escape key, arrow keys), and thumbnail indexing.
* **Multi-Step Booking Form (`BookingModal.tsx`):** State machine management for step progression (Date selection $\rightarrow$ Event type $\rightarrow$ Contact details $\rightarrow$ Success confirmation).
* **FAQ Accordion (`FaqAccordion.tsx`):** Expand/collapse state toggling with smooth rotation of chevron icons.

---

## 3. Brand Specifications Reference
* **Official Venue Name:** Aura Event Center
* **Location:** No. 5 Kashim Ibrahim Road, Makurdi, Benue State
* **Capacity:** 500 - 700 Guests
* **Standard Rate:** ₦500,000 / Day
* **Key Features:** Ultra-HD LED screens, professional acoustics, central air conditioning, 100% reliable backup power.