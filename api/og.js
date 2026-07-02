import { ImageResponse } from "@vercel/og";
import { LORA_400, LORA_700 } from "./og-fonts.js";

const SITE = "ogabspaiva.com.br";

const h = (type, props = {}, ...children) => ({
    type,
    props: {
        ...props,
        children:
            children.length === 1
                ? children[0]
                : children.length
                  ? children
                  : undefined,
    },
});

const APPS = {
    "arvore-de-arquivos": {
        eyebrow: "Mini App",
        title: "Árvore de Arquivos",
        description:
            "Transforme uma lista de caminhos em uma árvore pronta para copiar ou baixar.",
        paths: [
            "M4 4v16",
            "M4 8h5",
            "M4 16h5",
            "M9 5.5h7.5a2.5 2.5 0 0 1 0 5H9z",
            "M9 13.5h5.5a2.5 2.5 0 0 1 0 5H9z",
        ],
    },
    cnpj: {
        eyebrow: "Mini App",
        title: "CNPJ",
        description:
            "Gere e valide CNPJs numéricos e alfanuméricos direto no navegador.",
        paths: [
            "M4 4h16v16H4z",
            "M8 10h2",
            "M8 14h2",
            "M13 10h3",
            "M13 14h3",
        ],
    },
    miniapps: {
        eyebrow: "Coleção",
        title: "Mini Apps",
        description:
            "Ferramentas rápidas, privadas e sem cadastro para pequenas tarefas do dia a dia.",
        paths: [
            "M4 4h7v7H4z",
            "M13 4h7v7h-7z",
            "M4 13h7v7H4z",
            "M13 13h7v7h-7z",
        ],
    },
};

const FONTS = [
    { name: "Lora", data: LORA_400, weight: 400, style: "normal" },
    { name: "Lora", data: LORA_700, weight: 700, style: "normal" },
];

const icon = (paths) =>
    h(
        "svg",
        {
            viewBox: "0 0 24 24",
            width: 72,
            height: 72,
            fill: "none",
            stroke: "#f7f3eb",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
        },
        ...paths.map((d) => h("path", { d })),
    );

const card = (meta) =>
    h(
        "div",
        {
            style: {
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                background: "#f7f3eb",
                padding: "80px 88px",
                justifyContent: "space-between",
            },
        },
        h(
            "div",
            { style: { display: "flex", alignItems: "center" } },
            h(
                "div",
                {
                    style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "128px",
                        height: "128px",
                        background: "#8b513f",
                        borderRadius: "30px",
                        marginRight: "44px",
                        flexShrink: 0,
                    },
                },
                icon(meta.paths),
            ),
            h(
                "div",
                { style: { display: "flex", flexDirection: "column" } },
                h(
                    "div",
                    {
                        style: {
                            fontFamily: "Lora",
                            fontSize: "26px",
                            fontWeight: 400,
                            color: "#8b513f",
                            letterSpacing: "6px",
                            marginBottom: "18px",
                        },
                    },
                    meta.eyebrow.toUpperCase(),
                ),
                h(
                    "div",
                    {
                        style: {
                            fontFamily: "Lora",
                            fontSize: "78px",
                            fontWeight: 700,
                            color: "#1d1a16",
                            lineHeight: 1.05,
                        },
                    },
                    meta.title,
                ),
            ),
        ),
        h(
            "div",
            { style: { display: "flex", flexDirection: "column" } },
            h(
                "div",
                {
                    style: {
                        fontFamily: "Lora",
                        fontSize: "33px",
                        fontWeight: 400,
                        color: "#6b6358",
                        lineHeight: 1.4,
                        maxWidth: "980px",
                    },
                },
                meta.description,
            ),
        ),
        h(
            "div",
            { style: { display: "flex", alignItems: "center" } },
            h(
                "div",
                {
                    style: {
                        fontFamily: "Lora",
                        fontSize: "24px",
                        fontWeight: 400,
                        color: "#8b513f",
                        letterSpacing: "2px",
                    },
                },
                SITE,
            ),
        ),
    );

export default async function handler(req, res) {
    const app = req.query?.app || "";
    const meta = APPS[app];

    if (!meta) {
        res.statusCode = 404;
        res.setHeader("content-type", "text/plain; charset=utf-8");
        res.end("Not found");
        return;
    }

    const image = new ImageResponse(card(meta), {
        width: 1200,
        height: 630,
        fonts: FONTS,
    });
    const body = Buffer.from(await image.arrayBuffer());

    res.statusCode = 200;
    res.setHeader("content-type", "image/png");
    res.setHeader(
        "cache-control",
        "public, max-age=86400, s-maxage=31536000, immutable",
    );
    res.end(body);
}
