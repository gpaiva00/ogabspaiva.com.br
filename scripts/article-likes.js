const likeButton = document.querySelector("[data-like-button]");
const likeCount = document.querySelector("[data-like-count]");
const likeStatus = document.querySelector("[data-like-status]");
const articleRoot = document.querySelector("[data-article-slug]");

if (likeButton && likeCount && articleRoot) {
    const article = articleRoot.dataset.articleSlug;
    const storageKey = `article-like:${article}`;
    const numberFormatter = new Intl.NumberFormat("pt-BR");
    let currentLikes = 0;

    const storage = {
        get() {
            try {
                return window.localStorage.getItem(storageKey);
            } catch {
                return null;
            }
        },
        set() {
            try {
                window.localStorage.setItem(storageKey, "1");
            } catch {
                return null;
            }
        },
        remove() {
            try {
                window.localStorage.removeItem(storageKey);
            } catch {
                return null;
            }
        },
    };

    const formatLikes = (likes) =>
        numberFormatter.format(Math.max(0, Number(likes) || 0));

    const setLiked = (isLiked) => {
        likeButton.classList.toggle("is-liked", isLiked);
        likeButton.setAttribute("aria-pressed", String(isLiked));
        likeButton.setAttribute(
            "aria-label",
            isLiked ? "Remover curtida do artigo" : "Curtir artigo",
        );
    };

    const setCount = (likes) => {
        currentLikes = Math.max(0, Number(likes) || 0);
        likeCount.textContent = formatLikes(currentLikes);
    };

    const setStatus = (message) => {
        if (!likeStatus) return;
        likeStatus.textContent = message;
    };

    const requestLikes = async (options = {}) => {
        const headers = options.body
            ? {
                  "content-type": "application/json",
              }
            : {};
        const response = await fetch(
            `/api/likes${options.method ? "" : `?article=${encodeURIComponent(article)}`}`,
            {
                headers,
                ...options,
            },
        );

        if (!response.ok) {
            throw new Error("Unable to load likes");
        }

        return response.json();
    };

    const syncInitialState = async () => {
        setLiked(storage.get() === "1");

        try {
            const data = await requestLikes();
            setCount(data.likes);
            setStatus("");
        } catch {
            setStatus("Curtidas indisponíveis");
        }
    };

    likeButton.addEventListener("click", async () => {
        const wasLiked = likeButton.getAttribute("aria-pressed") === "true";
        const nextLiked = !wasLiked;
        const delta = nextLiked ? 1 : -1;
        const previousLikes = currentLikes;

        likeButton.disabled = true;
        setLiked(nextLiked);
        setCount(previousLikes + delta);
        setStatus("");

        try {
            const data = await requestLikes({
                method: "POST",
                body: JSON.stringify({ article, delta }),
            });

            setCount(data.likes);

            if (nextLiked) {
                storage.set();
            } else {
                storage.remove();
            }
        } catch {
            setLiked(wasLiked);
            setCount(previousLikes);
            setStatus("Não foi possível registrar");
        } finally {
            likeButton.disabled = false;
        }
    });

    syncInitialState();
}
