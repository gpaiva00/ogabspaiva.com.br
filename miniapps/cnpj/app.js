if (!globalThis.CnpjTool) {
    throw new Error("CnpjTool failed to initialize before app.js.");
}

const { generate, validate, format } = globalThis.CnpjTool;

const input = document.querySelector("#cnpj-input");
const typeButtons = document.querySelectorAll("[data-type]");
const maskButtons = document.querySelectorAll("[data-mask]");
const generateButton = document.querySelector("#generate-button");
const copyButton = document.querySelector("#copy-button");
const copyIcon = document.querySelector("#copy-icon");
const clearButton = document.querySelector("#clear-button");
const statusBadge = document.querySelector("#status-badge");

const copyIconMarkup = copyIcon.innerHTML;
let copyIconTimer;

const getSelectedType = () =>
    Array.from(typeButtons).find(
        (button) => button.getAttribute("aria-checked") === "true",
    ).dataset.type;

const getSelectedMasked = () =>
    Array.from(maskButtons).find(
        (button) => button.getAttribute("aria-checked") === "true",
    ).dataset.mask === "true";

const updateTypeButtons = (type) => {
    typeButtons.forEach((button) => {
        button.setAttribute("aria-checked", String(button.dataset.type === type));
    });
};

const updateMaskButtons = (masked) => {
    const value = String(masked);
    maskButtons.forEach((button) => {
        button.setAttribute("aria-checked", String(button.dataset.mask === value));
    });
};

const setEmptyStatus = () => {
    statusBadge.className = "status-badge is-empty";
    statusBadge.textContent = "Cole ou gere um CNPJ";
};

const setValidStatus = () => {
    statusBadge.className = "status-badge is-valid";
    statusBadge.textContent = "CNPJ válido";
};

const setInvalidStatus = () => {
    statusBadge.className = "status-badge is-invalid";
    statusBadge.textContent = "CNPJ inválido";
};

const validateInput = () => {
    const value = input.value;

    if (!value.trim()) {
        setEmptyStatus();
        return;
    }

    if (validate(value).valid) {
        setValidStatus();
    } else {
        setInvalidStatus();
    }
};

const generateInput = () => {
    const type = getSelectedType();
    const masked = getSelectedMasked();
    input.value = generate(type, masked);
    validateInput();
    input.focus();
};

const handleTypeChange = (event) => {
    updateTypeButtons(event.currentTarget.dataset.type);
    generateInput();
};

const handleMaskChange = (event) => {
    const masked = event.currentTarget.dataset.mask === "true";
    updateMaskButtons(masked);

    if (input.value.trim()) {
        input.value = format(input.value, masked);
    }
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

const copyInput = async () => {
    if (!input.value.trim()) {
        return;
    }

    try {
        await navigator.clipboard.writeText(input.value);
        showCopySuccess();
    } catch {
        input.select();
    }
};

const clearInput = () => {
    input.value = "";
    validateInput();
    input.focus();
};

generateButton.addEventListener("click", generateInput);
copyButton.addEventListener("click", copyInput);
clearButton.addEventListener("click", clearInput);
input.addEventListener("input", validateInput);

typeButtons.forEach((button) => {
    button.addEventListener("click", handleTypeChange);
});

maskButtons.forEach((button) => {
    button.addEventListener("click", handleMaskChange);
});
