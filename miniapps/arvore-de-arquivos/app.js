import { buildTree, createDownloadName, renderTree } from "./tree.js";

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
const downloadButton = document.querySelector("#download-button");
const exampleButton = document.querySelector("#example-button");
const clearButton = document.querySelector("#clear-button");

let statusTimer;

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

const copyOutput = async () => {
    try {
        await navigator.clipboard.writeText(treeOutput.textContent);
        showStatus("Árvore copiada.");
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
