import { get, put } from "@vercel/blob";

const LIKES_BLOB_PATH = "data/article-likes.json";
const ALLOWED_ARTICLES = new Set(["como-organizo-minha-vida-digital"]);
const MAX_BODY_BYTES = 1024;
const MAX_WRITE_ATTEMPTS = 3;

const json = (response, statusCode, body) => {
    response.statusCode = statusCode;
    response.setHeader("content-type", "application/json; charset=utf-8");
    response.setHeader("cache-control", "no-store");
    response.end(JSON.stringify(body));
};

const isAllowedArticle = (article) =>
    typeof article === "string" && ALLOWED_ARTICLES.has(article);

class BodyTooLargeError extends Error {}

const getHeader = (request, name) => {
    if (typeof request.headers?.get === "function") {
        return request.headers.get(name);
    }

    return request.headers?.[name.toLowerCase()] || "";
};

const readRequestBody = async (request) => {
    if (request.body && typeof request.body === "object") {
        return request.body;
    }

    if (typeof request.body === "string") {
        if (Buffer.byteLength(request.body, "utf8") > MAX_BODY_BYTES) {
            throw new BodyTooLargeError();
        }

        return JSON.parse(request.body);
    }

    const chunks = [];
    let size = 0;

    for await (const chunk of request) {
        size += chunk.length;

        if (size > MAX_BODY_BYTES) {
            throw new BodyTooLargeError();
        }

        chunks.push(chunk);
    }

    if (chunks.length === 0) {
        return {};
    }

    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const getLikeRequest = (body) => ({
    article: typeof body?.article === "string" ? body.article : "",
    delta: Number(body?.delta),
});

const readLikes = async () => {
    const blob = await get(LIKES_BLOB_PATH, {
        access: "private",
        useCache: false,
    });

    if (!blob) {
        return { likes: {}, etag: null };
    }

    const data = await new Response(blob.stream).json();

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return { likes: {}, etag: blob.blob.etag };
    }

    return { likes: data, etag: blob.blob.etag };
};

const writeLikes = async (likes, etag) => {
    await put(LIKES_BLOB_PATH, JSON.stringify(likes), {
        access: "private",
        allowOverwrite: Boolean(etag),
        contentType: "application/json; charset=utf-8",
        cacheControlMaxAge: 60,
        ...(etag ? { ifMatch: etag } : {}),
    });
};

const isPreconditionError = (error) =>
    error?.name === "BlobPreconditionFailedError" ||
    String(error?.message || "").includes("precondition") ||
    String(error?.message || "").includes("already exists");

const updateLikes = async (article, delta) => {
    for (let attempt = 1; attempt <= MAX_WRITE_ATTEMPTS; attempt += 1) {
        const { likes, etag } = await readLikes();
        const nextCount = Math.max(0, (Number(likes[article]) || 0) + delta);
        likes[article] = nextCount;

        try {
            await writeLikes(likes, etag);
            return nextCount;
        } catch (error) {
            if (!isPreconditionError(error) || attempt === MAX_WRITE_ATTEMPTS) {
                throw error;
            }
        }
    }

    throw new Error("Unable to write article likes");
};

export default async function handler(request, response) {
    if (request.method !== "GET" && request.method !== "POST") {
        response.setHeader("allow", "GET, POST");
        json(response, 405, { error: "Method not allowed" });
        return;
    }

    try {
        if (request.method === "GET") {
            const url = new URL(request.url, "https://ogabspaiva.com.br");
            const article = url.searchParams.get("article");

            if (!isAllowedArticle(article)) {
                json(response, 400, { error: "Invalid article" });
                return;
            }

            const { likes } = await readLikes();
            json(response, 200, {
                article,
                likes: Math.max(0, Number(likes[article]) || 0),
            });
            return;
        }

        const contentType = getHeader(request, "content-type");

        if (!contentType.includes("application/json")) {
            json(response, 415, { error: "Content type must be application/json" });
            return;
        }

        const body = await readRequestBody(request);
        const { article, delta } = getLikeRequest(body);

        if (!isAllowedArticle(article) || ![1, -1].includes(delta)) {
            json(response, 400, { error: "Invalid like request" });
            return;
        }

        const nextCount = await updateLikes(article, delta);
        json(response, 200, { article, likes: nextCount });
    } catch (error) {
        if (error instanceof SyntaxError) {
            json(response, 400, { error: "Invalid JSON" });
            return;
        }

        if (error instanceof BodyTooLargeError) {
            json(response, 413, { error: "Request body too large" });
            return;
        }

        console.error(error);
        json(response, 500, { error: "Unable to update article likes" });
    }
}
