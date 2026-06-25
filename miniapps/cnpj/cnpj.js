(() => {
    "use strict";

    const BASE_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const FULL_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const NUMERIC = "0123456789";
    const ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const ALL_ZEROS = "00000000000000";

    const TYPES = Object.freeze({
        NUMERIC: "numeric",
        ALPHANUMERIC: "alphanumeric",
    });

    const strip = (value) => String(value || "").replace(/[^a-zA-Z0-9]/g, "");

    const normalize = (value) => strip(value).toUpperCase();

    const charValue = (char) => char.charCodeAt(0) - 48;

    const calculateDigit = (base, weights) => {
        let sum = 0;
        for (let i = 0; i < base.length; i++) {
            sum += charValue(base[i]) * weights[i];
        }
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    const generateDigits = (base) => {
        const first = calculateDigit(base, BASE_WEIGHTS);
        const second = calculateDigit(base + first, FULL_WEIGHTS);
        return `${first}${second}`;
    };

    const randomChars = (length, chars) => {
        const pool = chars.length;
        const bytes = crypto.getRandomValues(new Uint32Array(length));
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars[bytes[i] % pool];
        }
        return result;
    };

    const generateBase = (type) => {
        const chars = type === TYPES.NUMERIC ? NUMERIC : ALPHANUMERIC;
        return randomChars(12, chars);
    };

    const generate = (type = TYPES.ALPHANUMERIC, masked = true) => {
        const base = generateBase(type);
        const digits = generateDigits(base);
        return format(base + digits, masked);
    };

    const format = (value, masked = true) => {
        const normalized = normalize(value);
        if (!masked || normalized.length !== 14) {
            return normalized;
        }
        return (
            `${normalized.slice(0, 2)}.` +
            `${normalized.slice(2, 5)}.` +
            `${normalized.slice(5, 8)}/` +
            `${normalized.slice(8, 12)}-` +
            `${normalized.slice(12)}`
        );
    };

    const detectType = (normalized) => {
        if (/^[0-9]{14}$/.test(normalized)) {
            return TYPES.NUMERIC;
        }
        if (/^[A-Z0-9]{14}$/.test(normalized)) {
            return TYPES.ALPHANUMERIC;
        }
        return null;
    };

    const validate = (value) => {
        const normalized = normalize(value);
        const type = detectType(normalized);

        if (!type) {
            return { valid: false, type: null, masked: false };
        }

        const masked = /[./-]/.test(String(value || ""));

        if (/^(.)\1{13}$/.test(normalized) || normalized === ALL_ZEROS) {
            return { valid: false, type, masked };
        }

        const base = normalized.slice(0, 12);
        const digits = normalized.slice(12);
        const valid = digits === generateDigits(base);

        return { valid, type, masked };
    };

    globalThis.CnpjTool = Object.freeze({
        generate,
        validate,
        format,
        strip,
        normalize,
    });
})();
