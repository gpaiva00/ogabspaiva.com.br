if (!globalThis.FileTree) {
    throw new Error("FileTree failed to initialize before app.js.");
}

const { buildTree, createDownloadName, renderTree } = globalThis.FileTree;

const sample = `src/components/Button.js
src/components/Header.js
src/App.js
src/index.js
public/index.html
package.json
README.md`;

const rootName = document.querySelector("#root-name");
const sortMode = document.querySelector("#sort-mode");
const pathsInput = document.querySelector("#paths-input");
const treeOutput = document.querySelector("#tree-output");
const actionStatus = document.querySelector("#action-status");
const copyButton = document.querySelector("#copy-button");
const copyIcon = document.querySelector("#copy-icon");
const downloadButton = document.querySelector("#download-button");
const exampleButton = document.querySelector("#example-button");
const clearButton = document.querySelector("#clear-button");

let statusTimer;
let copyIconTimer;
const copyIconMarkup = copyIcon.innerHTML;

const render = () => {
    const tree = buildTree(pathsInput.value.split(/\r?\n/), rootName.value);
    treeOutput.textContent = renderTree(tree, sortMode.value);
};

const showStatus = (message) => {
    window.clearTimeout(statusTimer);
    actionStatus.textContent = message;
    statusTimer = window.setTimeout(() => {
        actionStatus.textContent = "";
    }, 2600);
};

const selectOutput = () => {
    const range = document.createRange();
    range.selectNodeContents(treeOutput);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    treeOutput.focus();
};

const showCopySuccess = () => {
    window.clearTimeout(copyIconTimer);
    copyIcon.innerHTML = '<path d="m5 12 4 4L19 6" />';
    copyButton.setAttribute("aria-label", "Copiado");
    copyIconTimer = window.setTimeout(() => {
        copyIcon.innerHTML = copyIconMarkup;
        copyButton.removeAttribute("aria-label");
    }, 1500);
};

const copyOutput = async () => {
    try {
        await navigator.clipboard.writeText(treeOutput.textContent);
        showCopySuccess();
    } catch {
        selectOutput();
        showStatus("Texto selecionado para copiar.");
    }
};

const downloadOutput = () => {
    const blob = new Blob([treeOutput.textContent], {
        type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = createDownloadName(rootName.value);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showStatus("Arquivo preparado.");
};

[rootName, pathsInput].forEach((element) => {
    element.addEventListener("input", render);
});

sortMode.addEventListener("change", render);
copyButton.addEventListener("click", copyOutput);
downloadButton.addEventListener("click", downloadOutput);

exampleButton.addEventListener("click", () => {
    rootName.value = "meu-projeto";
    sortMode.value = "folders-first";
    pathsInput.value = sample;
    render();
    pathsInput.focus();
    showStatus("Exemplo restaurado.");
});

clearButton.addEventListener("click", () => {
    pathsInput.value = "";
    render();
    pathsInput.focus();
    showStatus("Entrada limpa.");
});

render();
