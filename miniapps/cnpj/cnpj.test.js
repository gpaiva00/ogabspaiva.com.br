import { describe, expect, test } from "bun:test";
import "./cnpj.js";

const { generate, validate, format, strip, normalize } = globalThis.CnpjTool;

describe("CNPJ tool", () => {
    test("validates official alphanumeric example", () => {
        const result = validate("12.ABC.345/01DE-35");
        expect(result.valid).toBe(true);
        expect(result.type).toBe("alphanumeric");
        expect(result.masked).toBe(true);
    });

    test("validates unmasked alphanumeric CNPJ", () => {
        expect(validate("12ABC34501DE35").valid).toBe(true);
    });

    test("normalizes lowercase input", () => {
        const result = validate("12.abc.345/01de-35");
        expect(result.valid).toBe(true);
        expect(result.type).toBe("alphanumeric");
    });

    test("validates numeric CNPJ", () => {
        expect(validate("11.444.777/0001-61").valid).toBe(true);
        expect(validate("11.444.777/0001-61").type).toBe("numeric");
    });

    test("rejects zeroed CNPJ", () => {
        expect(validate("00.000.000/0000-00").valid).toBe(false);
    });

    test("rejects repeated characters", () => {
        expect(validate("11111111111111").valid).toBe(false);
        expect(validate("AAAAAAAAAAAAAA").valid).toBe(false);
    });

    test("rejects wrong digits", () => {
        expect(validate("12.ABC.345/01DE-00").valid).toBe(false);
    });

    test("rejects invalid length", () => {
        expect(validate("12.ABC.345/01DE-3").valid).toBe(false);
        expect(validate("12.ABC.345/01DE-350").valid).toBe(false);
    });

    test("formats with or without mask", () => {
        expect(format("12ABC34501DE35", true)).toBe("12.ABC.345/01DE-35");
        expect(format("12.ABC.345/01DE-35", false)).toBe("12ABC34501DE35");
    });

    test("strips and normalizes", () => {
        expect(strip("12.ABC.345/01DE-35")).toBe("12ABC34501DE35");
        expect(normalize("12.abc.345/01de-35")).toBe("12ABC34501DE35");
    });

    test("generates valid alphanumeric CNPJ", () => {
        const value = generate("alphanumeric", false);
        const result = validate(value);
        expect(result.valid).toBe(true);
        expect(result.type).toBe("alphanumeric");
        expect(value).toHaveLength(14);
    });

    test("generates valid numeric CNPJ", () => {
        const value = generate("numeric", false);
        const result = validate(value);
        expect(result.valid).toBe(true);
        expect(result.type).toBe("numeric");
        expect(value).toHaveLength(14);
    });

    test("generates masked CNPJ", () => {
        const value = generate("alphanumeric", true);
        expect(value).toMatch(/^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-[0-9]{2}$/);
    });
});
