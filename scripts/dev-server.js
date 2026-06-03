import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const rootPath = resolve(fileURLToPath(root));
const startPort = Number(Bun.env.PORT || 4173);

const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".jpg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".webp": "image/webp",
};

const getMimeType = (pathname) => {
    const extension = pathname.slice(pathname.lastIndexOf("."));
    return mimeTypes[extension] || "application/octet-stream";
};

const getFile = async (pathname) => {
    const cleanPath = decodeURIComponent(pathname).replace(/^\/+/, "");
    const filePath = cleanPath.endsWith("/")
        ? `${cleanPath}index.html`
        : cleanPath || "index.html";
    const resolvedPath = resolve(rootPath, filePath);

    if (resolvedPath !== rootPath && !resolvedPath.startsWith(rootPath + sep)) {
        return { status: 400 };
    }

    const file = Bun.file(resolvedPath);

    if (await file.exists()) {
        return { file, pathname: filePath };
    }

    const indexPath = resolve(resolvedPath, "index.html");

    if (indexPath !== rootPath && !indexPath.startsWith(rootPath + sep)) {
        return { status: 400 };
    }

    const indexFile = Bun.file(indexPath);

    if (await indexFile.exists()) {
        return { file: indexFile, pathname: `${filePath}/index.html` };
    }

    return null;
};

const createServer = (port) =>
    Bun.serve({
        port,
        async fetch(request) {
            const url = new URL(request.url);

            if (url.pathname.startsWith("/api/")) {
                return Response.json(
                    {
                        error: "Use `bunx vercel dev` to test API routes locally.",
                    },
                    { status: 501 },
                );
            }

            const result = await getFile(url.pathname);

            if (!result) {
                return new Response("Not found", { status: 404 });
            }

            if (result.status === 400) {
                return new Response("Bad request", { status: 400 });
            }

            return new Response(result.file, {
                headers: {
                    "content-type": getMimeType(result.pathname),
                },
            });
        },
    });

let serverStarted = false;

for (let port = startPort; port < startPort + 20; port += 1) {
    try {
        createServer(port);
        serverStarted = true;
        console.log(`Static site running at http://localhost:${port}`);
        console.log("API routes require `bunx vercel dev`.");
        break;
    } catch (error) {
        if (error.code !== "EADDRINUSE") {
            throw error;
        }
    }
}

if (!serverStarted) {
    throw new Error(`No available port found from ${startPort} to ${startPort + 19}`);
}
