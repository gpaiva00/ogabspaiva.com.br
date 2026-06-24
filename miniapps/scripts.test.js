import { describe, expect, test } from "bun:test";

const appDirectory = import.meta.dir + "/arvore-de-arquivos";
const html = await Bun.file(appDirectory + "/index.html").text();
const appScript = await Bun.file(appDirectory + "/app.js").text();
const treeScript = await Bun.file(appDirectory + "/tree.js").text();

describe("mini-app script compatibility", () => {
    test("uses classic scripts without module syntax", () => {
        expect(html).not.toContain('type="module"');
        expect(appScript).not.toMatch(/^\s*import\s/m);
        expect(treeScript).not.toMatch(/^\s*export\s/m);
    });

    test("loads the tree API before the DOM controller", () => {
        const treeTag = '<script src="tree.js"></script>';
        const appTag = '<script src="app.js"></script>';
        const treeIndex = html.indexOf(treeTag);
        const appIndex = html.indexOf(appTag);

        expect(treeIndex).toBeGreaterThan(-1);
        expect(appIndex).toBeGreaterThan(treeIndex);
    });
});
