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

## CNPJ terms

- **CNPJ (`Cadastro Nacional da Pessoa Jurídica`):** The Brazilian national registry of legal entities.
- **Numeric CNPJ (`CNPJ numérico`):** The historical format with 14 numeric characters.
- **Alphanumeric CNPJ (`CNPJ alfanumérico`):** The new format, starting in July 2026, where the first 12 characters may be letters or digits and the last 2 are check digits.
- **Base (`base`):** The first 12 characters of the CNPJ, used to calculate the check digits.
- **Check digits (`dígitos verificadores`):** The last 2 numeric characters, calculated with modulo 11 over the base.
- **Mask (`máscara`):** The formatted display `AA.AAA.AAA/AAAA-DV` (or `XX.XXX.XXX/XXXX-XX` for numeric CNPJs).
- **Normalize (`normalizar`):** Remove mask characters, trim spaces, and convert letters to uppercase before validation.
