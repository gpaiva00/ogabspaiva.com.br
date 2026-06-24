# Mini-app glossary

## Collection terms

- **Mini app:** A focused browser utility that completes one task with little or no setup.
- **Hub:** The complete mini-app directory at `/miniapps/`.
- **Tool route:** A stable nested URL in the form `/miniapps/<slug>/`.

## Árvore de Arquivos terms

- **Path (`caminho`):** One pasted line describing a file or folder location. Both `/` and Windows `\\` separators are accepted.
- **Root (`pasta raiz`):** The editable top-level label displayed as the first tree line. It is presentation metadata, not part of each pasted path.
- **Folder (`pasta`):** Any path segment that contains descendants. An empty folder at the end of a path must be marked explicitly with a trailing slash, such as `docs/`.
- **File (`arquivo`):** A leaf path without a trailing slash. Extensions are not used for classification, so `LICENSE` is a file.
- **Tree (`árvore`):** The normalized text output rendered with `├──`, `└──`, and `│` connectors.
- **Sort mode (`ordenação`):** The rule used for siblings: folders first, simple alphabetical order, or original input order.
- **Live preview (`prévia ao vivo`):** Recalculation of the tree whenever the root name, paths, or sort mode changes. There is no generate action.
