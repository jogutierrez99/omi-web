# AGENTS.md

## Project Overview

This repository contains the source code for a professional commercial website.

The primary goal is to build a modern, fast, responsive and visually polished website while preserving the established brand identity.

The website should feel premium, clean and trustworthy.

The design is based around:

* Clean white backgrounds
* Dark/black typography
* Gold accent elements
* Rounded UI elements
* High-quality product imagery
* Strong visual hierarchy
* Generous spacing
* Clear calls to action
* Mobile-first responsive design

When modifying the website, always preserve the existing visual identity unless explicitly instructed otherwise.

---

# Tech Stack

Before making changes, inspect the repository and determine the actual stack from files such as:

* `package.json`
* `next.config.*`
* `tsconfig.json`
* `tailwind.config.*`
* existing source files

Do not assume versions.

The expected architecture is generally:

* Next.js
* React
* TypeScript
* Tailwind CSS or the existing styling system
* Vercel for deployment

If the repository uses different technologies, follow the existing project architecture instead of migrating technologies without explicit permission.

---

# Primary Development Principles

Always prioritize:

1. Correctness
2. Visual consistency
3. Responsive behavior
4. Maintainability
5. Performance
6. Accessibility
7. SEO

Do not introduce unnecessary complexity.

Prefer simple, reusable and understandable solutions.

---

# Existing Design Is the Source of Truth

When screenshots, mockups, reference images or existing pages are provided, treat them as the primary visual reference.

Match them as closely as reasonably possible.

Pay particular attention to:

* spacing
* alignment
* typography
* font sizes
* font weights
* border radius
* image proportions
* section heights
* button dimensions
* icon sizes
* visual hierarchy
* desktop layout
* mobile layout

Do not redesign components simply because another design approach seems better.

If the user asks for a specific visual modification, change only what is necessary to implement that modification.

---

# Brand Style

Maintain a premium and minimal visual appearance.

Preferred characteristics:

* white or very light backgrounds
* strong dark typography
* gold details and icons
* subtle shadows
* rounded cards
* rounded buttons
* generous whitespace
* large high-quality imagery
* visually clean sections

Avoid:

* excessive gradients
* unnecessary animations
* cluttered layouts
* excessive borders
* random colors
* inconsistent spacing
* oversized shadows
* overly complex UI elements

Gold should be treated as an accent color rather than used excessively.

---

# Responsive Design

Every page and component must work correctly on:

* mobile
* tablet
* laptop
* desktop
* large desktop

Mobile layouts must not be treated as an afterthought.

Check for:

* horizontal overflow
* text wrapping
* oversized images
* buttons outside the viewport
* broken grids
* excessive vertical spacing
* unreadably small text

Prefer responsive CSS rather than JavaScript-based viewport detection.

---

# Components

Prefer reusable components instead of duplicating markup.

Typical reusable components may include:

* Header
* Navigation
* Hero
* ProductCard
* ServiceCard
* PromotionBanner
* CTAButton
* SectionTitle
* ContactSection
* Footer

Before creating a new component, check whether an equivalent component already exists.

Do not create unnecessary abstractions for very small pieces of markup.

---

# Next.js Guidelines

If the project uses Next.js App Router:

* Prefer Server Components by default.
* Add `"use client"` only when client-side behavior is actually required.
* Avoid unnecessary client components.
* Use `next/image` for relevant images.
* Use `next/link` for internal navigation.
* Use Next.js metadata APIs for SEO when appropriate.

Do not convert Server Components to Client Components simply for convenience.

---

# TypeScript

Use TypeScript correctly.

Avoid:

* `any`
* unsafe type assertions
* duplicated interfaces
* unnecessary generic complexity

Prefer explicit and understandable types.

If a type already exists, reuse it.

The project should compile without TypeScript errors.

---

# Styling

Use the project's existing styling system.

If Tailwind CSS is being used:

* prefer Tailwind utilities
* preserve the existing design tokens
* reuse common spacing patterns
* avoid arbitrary values when an existing token is appropriate

However, precise arbitrary values are acceptable when required to faithfully reproduce an approved design.

Avoid mixing multiple styling approaches without a clear reason.

---

# Images and Assets

Never replace an approved image unless explicitly requested.

Preserve original image quality whenever possible.

Use appropriate image formats and dimensions.

Avoid stretching or distorting images.

Product images should maintain their natural aspect ratio.

Use meaningful `alt` text for relevant images.

Decorative images may use empty alt text when appropriate.

Do not use random placeholder images in finished sections.

---

# Icons

Use the project's existing icon library whenever possible.

Do not mix multiple icon libraries unnecessarily.

Icons must follow the visual style of the site.

Gold icons used in promotional or informational sections should remain visually consistent.

---

# Content

Preserve user-approved wording exactly unless the user explicitly asks for copy changes.

Do not silently rewrite:

* promotions
* product names
* prices
* contact details
* addresses
* emails
* legal text
* CTA wording

Spanish is the primary language of the website unless otherwise specified.

Pay attention to correct Spanish spelling and accents.

---

# Promotions

Promotional messaging is particularly sensitive.

If an approved promotion exists, preserve its wording and hierarchy.

For example, if the promotion says:

"Recarga 2 y paga 1"

do not rewrite it as another marketing phrase unless explicitly requested.

Likewise, approved terminology such as:

"En formato botellón"

should be preserved exactly.

---

# Accessibility

Maintain reasonable accessibility standards.

Ensure:

* buttons have understandable labels
* links describe their destination
* images have appropriate alt text
* interactive elements are keyboard accessible
* text has adequate contrast
* form fields have labels
* semantic HTML is used where appropriate

Prefer semantic elements such as:

* `header`
* `nav`
* `main`
* `section`
* `article`
* `footer`

---

# SEO

Public pages should have appropriate:

* page titles
* descriptions
* semantic heading structure
* meaningful content
* crawlable navigation

Each page should normally contain a single logical `h1`.

Do not add fake keyword stuffing.

---

# Performance

Avoid unnecessary dependencies.

Before installing a package, determine whether the functionality can be implemented cleanly with the existing stack.

Optimize:

* images
* fonts
* JavaScript sent to the browser
* component rendering
* network requests

Avoid premature optimization that harms readability.

---

# Animations

Animations should be subtle and purposeful.

Good examples:

* small hover transitions
* button feedback
* gentle section entrances
* subtle image scaling on hover

Avoid:

* excessive movement
* long animations
* distracting scroll effects
* animations that reduce usability

Respect `prefers-reduced-motion` when appropriate.

---

# Forms

Forms must include:

* validation
* understandable error messages
* loading state
* success state

Do not expose credentials or secrets in client-side code.

Never hardcode API keys.

Use environment variables where appropriate.

---

# Security

Never expose:

* passwords
* private tokens
* API secrets
* private keys
* service credentials

Do not commit `.env` files containing secrets.

Client-side environment variables must only contain values safe to expose publicly.

---

# Repository Discipline

Before modifying code:

1. Inspect the relevant files.
2. Understand the current implementation.
3. Search for existing reusable components.
4. Identify the smallest safe set of changes.

Do not modify unrelated files.

Do not perform large refactors unless explicitly requested.

Do not rename directories, components or routes without a clear reason.

---

# Do Not Break Existing Functionality

When implementing a new feature:

* preserve existing routes
* preserve working components
* preserve existing responsive layouts
* preserve approved visual elements
* preserve existing functionality

Avoid rewriting entire files when a focused modification is sufficient.

---

# Quality Checks

After meaningful changes, run the appropriate available checks.

Typically:

```bash
npm run lint
```

and:

```bash
npm run build
```

If the repository has tests, run the relevant tests as well.

If another package manager is used, use the corresponding commands.

Examples:

```bash
pnpm lint
pnpm build
```

or:

```bash
yarn lint
yarn build
```

Do not claim a check passed unless it was actually executed successfully.

---

# Visual Verification

For UI changes, inspect the final implementation for:

* desktop appearance
* mobile appearance
* spacing consistency
* typography
* alignment
* image sizing
* overflow
* broken layouts

Compare against the supplied reference design whenever one exists.

A successful build alone does not mean a visual task is complete.

---

# Error Handling

If an implementation causes errors:

1. Determine the root cause.
2. Fix the root cause rather than hiding the error.
3. Avoid disabling TypeScript, lint rules or validation simply to make the error disappear.

Do not use broad suppressions unless absolutely necessary.

---

# Dependencies

Do not install a new npm dependency unless it provides meaningful value.

Before installing anything:

1. Check whether the project already has a suitable dependency.
2. Check whether native browser/React/Next.js functionality is sufficient.
3. Prefer well-maintained packages.

Do not add libraries for trivial functionality.

---

# File Structure

Follow the existing project structure.

A typical Next.js project might use:

```text
app/
components/
public/
lib/
styles/
```

but the existing repository structure takes precedence.

Keep:

* pages/routes in the appropriate routing directory
* reusable UI in components
* static assets in `public`
* shared utilities in an appropriate utility/lib directory

---

# Working Method

For every requested change:

1. Read the request carefully.
2. Inspect the relevant existing implementation.
3. Identify dependencies and affected components.
4. Make the smallest coherent change.
5. Check responsiveness.
6. Check TypeScript/lint errors.
7. Run the relevant project checks.
8. Review the final result.
9. Summarize exactly what was changed.

If something is ambiguous, first infer from:

1. the existing code
2. supplied screenshots
3. established project design
4. nearby components

Avoid inventing new product requirements.

---

# Autonomous Work

You are allowed to inspect and modify multiple files when necessary to complete a task properly.

Do not stop after identifying a problem when it can safely be fixed.

When a request requires changes across several components, implement the complete solution rather than only modifying the first obvious file.

However, do not expand the scope beyond the user's actual request.

---

# Definition of Done

A task is complete when:

* the requested functionality exists
* the visual result matches the approved design
* desktop layout works
* mobile layout works
* existing functionality has not been unnecessarily broken
* TypeScript is valid
* relevant lint/build checks pass where available
* no secrets have been exposed
* no obvious placeholder content remains

The objective is not merely to produce code.

The objective is to leave the website in a production-quality state.
