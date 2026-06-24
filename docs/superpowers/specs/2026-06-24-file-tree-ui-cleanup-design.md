# File Tree UI Cleanup

## Scope

- Remove the `01` and `02` labels beside the panel titles.
- Remove the “Tudo fica aqui” note and its icon.
- Remove the “Prévia ao vivo” label.
- After a successful copy, temporarily replace the copy icon with a check icon while keeping the “Copiar” label unchanged.

## Behavior

The check appears for about 1.5 seconds, then the original copy icon returns. Copy failures continue to use the existing text status so users receive actionable feedback. Status messages for download, example, and clear actions remain unchanged.

## Implementation

Reuse the existing copy button and its inline SVG. Toggle the SVG contents and a success state in `app.js`; do not add dependencies or new components. Remove CSS selectors that become unused after deleting the labels and privacy note.

## Verification

- Confirm the four removed labels no longer render.
- Confirm clicking “Copiar” copies the tree and briefly shows a check without changing the button label or width.
- Confirm the copy icon returns automatically.
- Confirm copy-error feedback and the other existing status messages still work.
