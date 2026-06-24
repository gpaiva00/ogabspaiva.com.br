# ADR 0001: Mini-app information architecture

- Status: Accepted
- Date: 2026-06-23

## Context

The portfolio is expanding into a collection of small utilities for common, short-lived tasks. The first utility turns pasted paths into a shareable file tree. Future examples may include a guitar tuner and other focused browser tools.

The collection needs stable URLs without turning the static site into a framework-based application.

## Decision

- `/miniapps/` is the collection hub.
- Each utility receives a nested route: `/miniapps/<slug>/`.
- The homepage Mini Apps tab may link directly to a utility to minimize clicks.
- Each utility remains a standalone static page using vanilla HTML, CSS, and JavaScript.
- Runtime JavaScript uses ordered classic scripts with relative paths so every mini app works through both `file://` and static HTTPS hosting.
- ES modules, bundlers, build steps, and separate development or production implementations are not allowed for mini apps.
- Shared collection styling lives under `/miniapps/`; tool-specific styling and behavior live beside the tool.
- The first version of Árvore de Arquivos accepts pasted text only.
- Processing happens entirely in the browser. User input is not uploaded or persisted.

## Consequences

- New tools can be added without changing the site’s build or deployment model.
- Every mini app can be opened directly from disk without browser-origin errors.
- Links remain predictable and independently shareable.
- The hub becomes the complete directory while the homepage can stay selective.
- Shared patterns may be extracted only after a second tool proves they are actually shared.
- A native folder picker, saved history, accounts, and server-side processing are outside v1.
