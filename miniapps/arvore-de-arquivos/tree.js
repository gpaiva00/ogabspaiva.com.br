const createNode = (name, isFolder, order) => ({
    name,
    isFolder,
    order,
    children: new Map(),
});

const normalizePath = (path) =>
    path
        .trim()
        .replace(/\\/g, "/")
        .replace(/^(\.\/)+/, "")
        .replace(/\/+/g, "/")
        .replace(/\/+$/, "");

const compareNames = (left, right) =>
    left.name.localeCompare(right.name, "pt-BR", {
        numeric: true,
        sensitivity: "base",
    });

const sortChildren = (children, sortMode) => {
    if (sortMode === "input") {
        return children.sort((left, right) => left.order - right.order);
    }

    if (sortMode === "alphabetical") {
        return children.sort(compareNames);
    }

    return children.sort((left, right) => {
        if (left.isFolder !== right.isFolder) {
            return left.isFolder ? -1 : 1;
        }

        return compareNames(left, right);
    });
};

export const buildTree = (paths, rootName) => {
    const normalizedRoot = rootName.trim().replace(/[\\/]+$/, "") || "projeto";
    const root = createNode(normalizedRoot, true, 0);
    let order = 0;

    paths.forEach((rawPath) => {
        const original = rawPath.trim();

        if (!original || original.startsWith("#")) {
            return;
        }

        const explicitFolder = /[\\/]$/.test(original);
        const parts = normalizePath(original).split("/").filter(Boolean);
        let current = root;

        parts.forEach((part, index) => {
            const isLast = index === parts.length - 1;
            const isFolder = !isLast || explicitFolder;

            if (!current.children.has(part)) {
                order += 1;
                current.children.set(part, createNode(part, isFolder, order));
            }

            const child = current.children.get(part);

            if (isFolder) {
                child.isFolder = true;
            }

            current = child;
        });
    });

    return root;
};

export const renderTree = (root, sortMode = "folders-first") => {
    const lines = [`${root.name}/`];

    const walk = (node, prefix = "") => {
        const children = sortChildren(
            Array.from(node.children.values()),
            sortMode,
        );

        children.forEach((child, index) => {
            const isLast = index === children.length - 1;
            const connector = isLast ? "└── " : "├── ";
            const nextPrefix = prefix + (isLast ? "    " : "│   ");
            const displayName = child.isFolder ? `${child.name}/` : child.name;

            lines.push(prefix + connector + displayName);

            if (child.children.size > 0) {
                walk(child, nextPrefix);
            }
        });
    };

    walk(root);
    return lines.join("\n");
};

export const createDownloadName = (rootName) => {
    const safeRoot = rootName
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return safeRoot
        ? `${safeRoot}-arvore.txt`
        : "arvore-de-arquivos.txt";
};
