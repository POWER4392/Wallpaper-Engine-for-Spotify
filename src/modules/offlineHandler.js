export function setupOfflineHandler() {
    let autoReloadTimer = null;

    function handleOnline() {
        const errorTakeover = document.querySelector(
            "._NFePmYV2P6aLGrjLvuR, .EvmeKyemPmmbdjRZQezw, .FnUUCAJ79nf4_lZGH0DB"
        );
        if (errorTakeover && errorTakeover.style.display !== "none") {
            if (autoReloadTimer) clearTimeout(autoReloadTimer);
            autoReloadTimer = setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    window.addEventListener("online", handleOnline);

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            dismissAllErrorModals();
        }
    });

    function dismissAllErrorModals() {
        const backdrops = document.querySelectorAll("._NFePmYV2P6aLGrjLvuR, [class*='_NFePmYV2P6aLGrjLvuR']");
        backdrops.forEach((el) => {
            el.style.setProperty("display", "none", "important");
            el.style.setProperty("pointer-events", "none", "important");
        });
        const dialogs = document.querySelectorAll(".EvmeKyemPmmbdjRZQezw, .FnUUCAJ79nf4_lZGH0DB");
        dialogs.forEach((el) => {
            const parent = el.closest("._NFePmYV2P6aLGrjLvuR") || el.parentElement;
            if (parent && parent !== document.body) {
                parent.style.setProperty("display", "none", "important");
                parent.style.setProperty("pointer-events", "none", "important");
            } else {
                el.style.setProperty("display", "none", "important");
            }
        });
    }

    function enhanceModal(modalEl) {
        if (!modalEl || modalEl.dataset.weEnhanced) return;
        modalEl.dataset.weEnhanced = "true";

        modalEl.style.setProperty("position", "relative", "important");

        if (!modalEl.querySelector(".we-modal-corner-close")) {
            const closeBtn = document.createElement("button");
            closeBtn.className = "we-modal-corner-close";
            closeBtn.type = "button";
            closeBtn.innerHTML = "&times;";
            closeBtn.title = "Dismiss (Đóng) - Esc";
            closeBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                dismissAllErrorModals();
            };
            modalEl.appendChild(closeBtn);
        }

        const btnContainer = modalEl.querySelector(".KubpT42JTL9IbK8ixLiC, .YBUiYN9k0MC_fAgWUau7") || modalEl.lastElementChild;
        if (btnContainer && !modalEl.querySelector(".we-offline-dismiss-btn")) {
            const dismissBtn = document.createElement("button");
            dismissBtn.className = "we-offline-dismiss-btn";
            dismissBtn.type = "button";
            dismissBtn.textContent = "Dismiss / Bỏ qua";
            dismissBtn.title = "Dismiss this notice and continue using Spotify";
            dismissBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                dismissAllErrorModals();
            };
            btnContainer.insertBefore(dismissBtn, btnContainer.firstElementChild);
        }

        const primaryBtn = modalEl.querySelector("._fA4q2hl7XY7z6Sh5pRv, button:not(.we-offline-dismiss-btn):not(.we-modal-corner-close)");
        if (primaryBtn) {
            primaryBtn.style.setProperty("color", "#000000", "important");
            primaryBtn.style.setProperty("background-color", "#1ed760", "important");
            if (!primaryBtn.textContent || primaryBtn.textContent.trim() === "") {
                primaryBtn.textContent = "Reload Page / Thử lại";
            }
        }

        const isOffline = !navigator.onLine;
        const titleEl = modalEl.querySelector("h1");
        if (titleEl && !titleEl.dataset.weTextUpdated) {
            titleEl.dataset.weTextUpdated = "true";
            titleEl.textContent = isOffline
                ? "No Internet Connection (Mất kết nối mạng)"
                : "Connection / Loading Notice";
        }

        const descEl = modalEl.querySelector("p");
        if (descEl && !descEl.dataset.weTextUpdated) {
            descEl.dataset.weTextUpdated = "true";
            descEl.innerHTML = `
                Spotify could not reach server endpoints.<br>
                Wallpaper and local playback remain active.<br>
                <span style="display:inline-flex; align-items:center; gap:6px; margin-top:8px; font-size:12px; color:#1ed760; font-weight:500;">
                    <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#1ed760; box-shadow:0 0 6px #1ed760;"></span>
                    Spotify will automatically reconnect once your internet returns.
                </span>
            `;
        }
    }

    const recentNotifications = new Map();

    function installNotificationDeduplicator() {
        if (typeof Spicetify === "undefined") return;

        if (typeof Spicetify.showNotification === "function" && !Spicetify.showNotification._weWrapped) {
            const origShow = Spicetify.showNotification.bind(Spicetify);
            const wrappedShow = (message, isError = false, msTimeout) => {
                const key = typeof message === "string" ? message.trim() : String(message?.props?.children || message);
                const now = Date.now();
                const lastTime = recentNotifications.get(key) || 0;
                if (key && now - lastTime < 5000) {
                    return;
                }
                if (key) recentNotifications.set(key, now);
                return origShow(message, isError, msTimeout);
            };
            wrappedShow._weWrapped = true;
            Spicetify.showNotification = wrappedShow;
        }

        if (Spicetify.Snackbar && typeof Spicetify.Snackbar.enqueueSnackbar === "function" && !Spicetify.Snackbar.enqueueSnackbar._weWrapped) {
            const origEnqueue = Spicetify.Snackbar.enqueueSnackbar.bind(Spicetify.Snackbar);
            const wrappedEnqueue = (message, options) => {
                const key = typeof message === "string" ? message.trim() : String(message?.props?.children || "");
                const now = Date.now();
                const lastTime = recentNotifications.get(key) || 0;
                if (key && now - lastTime < 5000) {
                    return null;
                }
                if (key) recentNotifications.set(key, now);
                return origEnqueue(message, options);
            };
            wrappedEnqueue._weWrapped = true;
            Spicetify.Snackbar.enqueueSnackbar = wrappedEnqueue;
        }
    }

    function deduplicateAndEnhanceSnackbars() {
        const seenTexts = new Set();
        const snackbars = document.querySelectorAll(".notistack-Snackbar");
        snackbars.forEach((sb) => {
            const text = (sb.textContent || "").trim();
            if (text && seenTexts.has(text)) {
                sb.style.setProperty("display", "none", "important");
                return;
            }
            if (text) seenTexts.add(text);

            const bubble = sb.querySelector(".W1vSh9LnwRGIJBODcwJ3, .encore-light-theme, #notistack-snackbar");
            if (bubble) {
                bubble.style.setProperty("background-color", "rgba(32, 32, 32, 0.96)", "important");
                bubble.style.setProperty("color", "#ffffff", "important");
            }
        });
    }

    const scanModals = () => {
        installNotificationDeduplicator();
        deduplicateAndEnhanceSnackbars();
        document.querySelectorAll(".EvmeKyemPmmbdjRZQezw, .FnUUCAJ79nf4_lZGH0DB").forEach(enhanceModal);
    };

    try {
        const observer = new MutationObserver(scanModals);
        observer.observe(document.documentElement, { childList: true, subtree: true });
    } catch (_) {}

    setInterval(scanModals, 500);
    scanModals();
}
