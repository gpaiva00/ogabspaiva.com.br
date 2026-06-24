import { describe, expect, test } from "bun:test";

const stylesheets = [
    ["shared shell", await Bun.file(import.meta.dir + "/miniapps.css").text()],
    [
        "file tree tool",
        await Bun.file(
            import.meta.dir + "/arvore-de-arquivos/styles.css",
        ).text(),
    ],
];

describe("mini-app responsive styles", () => {
    test.each(stylesheets)(
        "%s uses mobile defaults with min-width enhancements",
        (_, css) => {
            expect(css).not.toContain("@media (max-width");
            expect(css).toContain("@media (min-width");
        },
    );
});
