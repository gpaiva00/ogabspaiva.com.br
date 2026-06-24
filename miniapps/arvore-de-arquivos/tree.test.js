import { describe, expect, test } from "bun:test";
import { buildTree, createDownloadName, renderTree } from "./tree.js";

const render = (paths, sortMode = "folders-first", rootName = "meu-projeto") =>
    renderTree(buildTree(paths, rootName), sortMode);

describe("file tree", () => {
    test("renders nested paths with folders before files", () => {
        expect(
            render([
                "src/components/Button.js",
                "src/index.js",
                "README.md",
            ]),
        ).toBe(`meu-projeto/
├── src/
│   ├── components/
│   │   └── Button.js
│   └── index.js
└── README.md`);
    });

    test("treats extensionless leaves as files and trailing slashes as folders", () => {
        expect(render(["LICENSE", "docs/"], "input")).toBe(`meu-projeto/
├── LICENSE
└── docs/`);
    });

    test("normalizes dot prefixes, Windows separators, and repeated separators", () => {
        expect(
            render([String.raw`.\src\\components\Button.js`]),
        ).toBe(`meu-projeto/
└── src/
    └── components/
        └── Button.js`);
    });

    test("merges duplicate paths", () => {
        expect(render(["src/index.js", "src/index.js"])).toBe(`meu-projeto/
└── src/
    └── index.js`);
    });

    test("promotes a leaf to a folder when descendants are added", () => {
        expect(render(["src", "src/index.js"], "input")).toBe(`meu-projeto/
└── src/
    └── index.js`);
    });

    test("supports folders-first, alphabetical, and input ordering", () => {
        const paths = ["zeta.txt", "beta/file.js", "alfa.txt", "alpha/"];

        expect(render(paths, "folders-first")).toBe(`meu-projeto/
├── alpha/
├── beta/
│   └── file.js
├── alfa.txt
└── zeta.txt`);

        expect(render(paths, "alphabetical")).toBe(`meu-projeto/
├── alfa.txt
├── alpha/
├── beta/
│   └── file.js
└── zeta.txt`);

        expect(render(paths, "input")).toBe(`meu-projeto/
├── zeta.txt
├── beta/
│   └── file.js
├── alfa.txt
└── alpha/`);
    });

    test("ignores empty lines and comments and uses a safe root fallback", () => {
        expect(render(["", "   ", "# ignored", "README.md"], "input", " ")).toBe(
            `projeto/
└── README.md`,
        );
    });

    test("creates a safe download filename from the root name", () => {
        expect(createDownloadName("Meu Projeto! ")).toBe(
            "meu-projeto-arvore.txt",
        );
        expect(createDownloadName(" ")).toBe("arvore-de-arquivos.txt");
    });
});
