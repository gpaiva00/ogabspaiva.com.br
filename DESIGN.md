# Design reference

## Direction

The site uses a **warm editorial calm**: generous whitespace, restrained motion, tactile paper-like color, and clear hierarchy. Interfaces should feel authored and quiet rather than like a generic dashboard.

Mini apps extend this into an **editorial utility** pattern. A tool may be denser than an article or portfolio list, but it should still feel native to the same site.

## Foundations

### Color

- Light background: warm ivory (`#f7f3eb`) with subtle lighter and darker vertical variation.
- Light text: near-black brown (`#1d1a16`).
- Accent: oxide brown (`#8b513f`), with a darker interactive state (`#5d3028`).
- Lines and controls: warm gray-beige, never neutral blue-gray.
- Dark mode: near-black background (`#111111`), warm white text, muted gray, and a softened clay accent.
- Use automatic `prefers-color-scheme`; do not add an app-specific theme switch.

### Typography

- Display headings: Georgia or Times New Roman, regular weight, tight line height.
- Interface and body copy: the system sans-serif stack.
- Code and generated output: the system monospace stack.
- Small labels may use uppercase with deliberate letter spacing.

### Space and shape

- Content pages use 40px total horizontal breathing room on small screens.
- Editorial content remains narrow; interactive workbenches may expand to roughly 1100px.
- Use subtle 1px rules to structure content before reaching for raised cards.
- Corners are softly rounded, generally between 10px and 18px. Pill shapes are reserved for compact actions.

## Interaction

- Motion is short and functional: 160–240ms for hover, focus, status, and entry transitions.
- Support `prefers-reduced-motion: reduce`.
- Every interactive element needs a visible hover state and a strong `:focus-visible` outline.
- Primary actions use the accent color. Secondary actions use the page surface and a border. Destructive or clearing actions should be visually quiet until hovered.
- Status changes use `aria-live="polite"` and should not cause layout shift.

## Mini-app pattern

- Every mini app lives at `/miniapps/<slug>/` and links back to `/miniapps/`.
- Lead with the task outcome, not a feature list.
- Keep the main action visible without instructions. Put optional explanation below the workbench.
- Prefer immediate feedback. For text transformations, render output live.
- State explicitly when processing is local and avoid persistence unless the tool genuinely requires it.
- Desktop may place input and result side by side. Mobile stacks input before result without horizontal overflow.
- Reuse a shared mini-app shell for background, navigation, typography, and archive rows. Keep tool-specific layout in a local stylesheet.

## Accessibility checklist

- Semantic headings and landmarks.
- Explicit labels for every form control.
- Keyboard access for every action.
- Minimum 44px target height for primary controls on touch screens.
- Sufficient light and dark contrast.
- Output regions are labelled and keyboard focusable when selection is useful.
- Decorative SVGs use `aria-hidden="true"`; meaningful controls include accessible names.
