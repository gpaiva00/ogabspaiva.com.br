# File-compatible mini apps design

## Goal

Every mini app must run when its `index.html` is opened directly through `file://` and when the same files are served by static hosting. Mini apps must not require a development server, application server, bundler, or build step.

## Runtime architecture

- Mini apps use ordered classic `<script>` elements with relative file paths.
- Runtime files do not use `type="module"`, `import`, or `export`.
- Reusable domain logic exposes one app-specific API on `window`, such as `window.FileTree`.
- The DOM controller loads after the domain script and consumes that global API.
- The same runtime files are used for both `file://` and static HTTPS hosting. There is no second implementation or generated bundle.
- CSS, images, scripts, and navigation use relative paths so pages remain portable as a directory.

For Árvore de Arquivos, `tree.js` defines `window.FileTree` and `app.js` consumes it. The HTML loads `tree.js` before `app.js`.

## Data flow

1. The browser reads `index.html` directly or from static hosting.
2. `tree.js` initializes the tree parsing and rendering API on `window.FileTree`.
3. `app.js` binds the form controls and renders the initial example.
4. User input stays in browser memory. No network request or browser storage is introduced.

## Failure behavior

- If the domain API is missing, `app.js` fails immediately with a clear initialization error rather than silently leaving an empty preview.
- Existing clipboard fallback behavior remains unchanged.
- Existing download, sorting, normalization, and mobile behavior remain unchanged.

## Testing

- Existing tree behavior tests continue to exercise the single `tree.js` implementation.
- A compatibility test asserts that mini-app HTML contains no module scripts.
- The compatibility test asserts that runtime JavaScript contains no `import` or `export` statements.
- The compatibility test verifies that domain scripts load before their DOM controllers.
- Browser verification covers initial preview, live input, sorting, copy, clear/example, download initiation, mobile overflow, and console errors.
- Direct `file://` verification is the acceptance check for the original failure.

## Repository standard

`DESIGN.md`, the project context, and the mini-app ADR will record direct-file compatibility as mandatory for every current and future mini app. Static hosting over HTTPS remains supported, but no mini app may depend on HTTP-only module loading.

## Non-goals

- Adding a framework or bundler.
- Maintaining separate development and production scripts.
- Inlining all JavaScript into HTML.
- Adding persistence, analytics, or server-side processing.
