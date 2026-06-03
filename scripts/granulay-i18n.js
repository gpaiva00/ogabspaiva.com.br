(function () {
    "use strict";

    var translations = {
        en: {
            hero: {
                title: "Granulay",
                subtitle: "Beautify your Mac screen",
                description:
                    "Brings authentic vintage grain texture to your Mac in real-time. Experience the warmth of analog visuals with modern convenience — your screen will never look the same.",
                downloadMacAppStore: "Download on the Mac App Store",
            },
            features: {
                title: "Crafted for You",
                subtitle: "Every detail designed to enhance your visual experience.",
                items: [
                    {
                        title: "Grain Intensity",
                        description: "From subtle to full-blown. Fine-tune the texture to match your aesthetic preference.",
                    },
                    {
                        title: "Grain Styles",
                        description: "Choose from fine, medium, or coarse. Each style is a different analog era.",
                    },
                    {
                        title: "Keep Brightness",
                        description: "Texture without dimming. Your screen stays vibrant while gaining character.",
                    },
                    {
                        title: "Static or Animated Grain",
                        description: "Pick a still grain for a photographic texture, or animated for that old-projector flicker.",
                    },
                    {
                        title: "Matte Mode",
                        description: "A matte finish that softens reflections and gives your screen a proper analog-film look.",
                    },
                    {
                        title: "Built-in Lo-Fi Station",
                        description: "Relaxing lo-fi music directly in the app. Set the mood while you work.",
                    },
                ],
                comingSoonLabel: "Coming soon",
            },
            footer: {
                title: "Get in Touch",
                privacy: "Privacy Policy",
                terms: "Terms of Use",
                rights: "All rights reserved.",
            },
        },
        pt: {
            hero: {
                title: "Granulay",
                subtitle: "Transforme a tela do seu Mac",
                description:
                    "Traga a autêntica textura de grão vintage para o seu Mac em tempo real. Experimente o calor dos visuais analógicos com a conveniência moderna — sua tela nunca mais será a mesma.",
                downloadMacAppStore: "Baixe na Mac App Store",
            },
            features: {
                title: "Feito para Você",
                subtitle: "Cada detalhe projetado para aprimorar sua experiência visual.",
                items: [
                    {
                        title: "Intensidade do Grão",
                        description: "De sutil a intenso. Ajuste a textura para combinar com sua preferência estética.",
                    },
                    {
                        title: "Estilos de Grão",
                        description: "Escolha entre fino, médio ou grosso. Cada estilo é uma era analógica diferente.",
                    },
                    {
                        title: "Manter Brilho",
                        description: "Textura sem escurecer. Sua tela permanece vibrante enquanto ganha personalidade.",
                    },
                    {
                        title: "Grão Estático ou Animado",
                        description: "Escolha entre um grão parado, tipo textura fotográfica, ou animado, com vida de projetor antigo.",
                    },
                    {
                        title: "Modo Fosco",
                        description: "Um acabamento fosco que suaviza reflexos e dá à sua tela aquela cara de filme analógico.",
                    },
                    {
                        title: "Estação Lo-Fi Integrada",
                        description: "Música lo-fi relaxante diretamente no app. Defina o clima enquanto você trabalha.",
                    },
                ],
                comingSoonLabel: "Em breve",
            },
            footer: {
                title: "Entre em Contato",
                privacy: "Política de Privacidade",
                terms: "Termos de Uso",
                rights: "Todos os direitos reservados.",
            },
        },
    };

    var browserLang =
        navigator.language || (navigator.languages && navigator.languages[0]);
    var lang = browserLang && browserLang.toLowerCase().startsWith("pt")
        ? "pt"
        : "en";

    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

    function resolve(path, obj) {
        return path.split(".").reduce(function (acc, key) {
            return acc && acc[key] !== undefined ? acc[key] : null;
        }, obj);
    }

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var key = el.getAttribute("data-i18n");
        var value = resolve(key, translations[lang]);
        if (value && typeof value === "string") {
            el.textContent = value;
        } else {
            console.warn("[i18n] Missing translation for key: " + key + " (lang: " + lang + ")");
        }
    });
})();