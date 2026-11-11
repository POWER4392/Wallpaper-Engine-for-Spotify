import { settings, saveSettings, applyVisualSettings, BRIDGE_API, loadSavedMedia } from './settings.js';

let imageEl = null;
let videoEl = null;
let isSyncing = false;
let syncAbort = null;

export function applyPauseState() {
    if (!videoEl) videoEl = document.getElementById("we-video");
    if (videoEl) {
        if (settings.wallpaperPaused) {
            videoEl.pause();
        } else if (videoEl.src && !videoEl.classList.contains("we-media-hidden")) {
            videoEl.play().catch(() => {});
        }
    }
    window.dispatchEvent(new CustomEvent("we-pause-changed", { detail: { paused: settings.wallpaperPaused } }));
}

export function toggleWallpaperPause(paused) {
    if (paused === undefined) {
        settings.wallpaperPaused = !settings.wallpaperPaused;
    } else {
        settings.wallpaperPaused = paused;
    }
    saveSettings();
    applyPauseState();
    if (window.Spicetify && Spicetify.showNotification) {
        Spicetify.showNotification(
            settings.wallpaperPaused ? "Wallpaper / Video Paused" : "Wallpaper / Video Resumed"
        );
    }
}

export function renderMedia(source, type = "") {
    try {
        if (!imageEl) imageEl = document.getElementById("we-image");
        if (!videoEl) videoEl = document.getElementById("we-video");
        if (!imageEl || !videoEl) return;

        const isBlob = typeof source !== "string";
        const url = isBlob ? URL.createObjectURL(source) : source;
        const isVideo = (type && type.startsWith("video/")) ||
            (typeof source === "string" && source.match(/\.(mp4|webm|mkv|mov)($|\?)/i)) ||
            (isBlob && source.type && source.type.startsWith("video/"));

        if (isVideo) {
            imageEl.classList.add("we-media-hidden");

            videoEl.muted = true;
            videoEl.defaultMuted = true;
            videoEl.volume = 0;
            videoEl.loop = true;
            videoEl.playsInline = true;
            videoEl.autoplay = true;

            videoEl.onerror = () => {
                const err = videoEl.error;
                console.error("[Wallpaper Engine] videoEl playback error:", err);
                const code = err ? err.code : 0;
                let msg = "Video playback error";
                if (code === 4) {
                    msg = "Spotify CEF does not support MP4 H.264 directly. Please convert to .webm (VP8/VP9) or .gif!";
                }
                if (window.Spicetify && Spicetify.showNotification) {
                    Spicetify.showNotification(msg);
                }
                updateBridgeStatusUI(false, msg);
            };

            videoEl.onloadeddata = () => {
                videoEl.classList.remove("we-media-hidden");
                if (!settings.wallpaperPaused) {
                    videoEl.play().catch((e) => {
                        console.warn("[Wallpaper Engine] Autoplay failed:", e);
                    });
                }
            };

            if (videoEl.src !== url) {
                videoEl.src = url;
                videoEl.load();
            } else {
                videoEl.classList.remove("we-media-hidden");
                if (!settings.wallpaperPaused) {
                    videoEl.play().catch(() => {});
                }
            }
        } else {
            videoEl.pause();
            videoEl.classList.add("we-media-hidden");

            if (imageEl.src !== url) {
                imageEl.onload = () => {
                    imageEl.classList.remove("we-media-hidden");
                };
                imageEl.onerror = () => {
                    console.warn("[Wallpaper Engine] Waiting to reload image from bridge...");
                };
                imageEl.src = url;
            } else {
                imageEl.classList.remove("we-media-hidden");
            }
        }
    } catch (err) {
        console.error("[Wallpaper Engine] renderMedia error:", err);
    }
}

export async function loadAndApplyCustomMedia() {
    try {
        const saved = await loadSavedMedia();
        if (saved && saved.blob) {
            renderMedia(saved.blob, saved.type || "video/mp4");
            if (saved.name) {
                settings.mediaName = saved.name;
                settings.customMediaName = saved.name;
            }
            updateBridgeStatusUI(true, "Custom Video: " + (saved.name || "Active"));
            return true;
        }
    } catch (e) {
        console.warn("[Wallpaper Engine] Error loading custom media:", e);
    }
    return false;
}

export async function setWallpaperSource(source) {
    settings.wallpaperSource = source;
    saveSettings();

    if (source === "custom-video") {
        const loaded = await loadAndApplyCustomMedia();
        if (!loaded) {
            const fileInput = document.getElementById("we-file");
            if (fileInput) fileInput.click();
        }
        if (window.Spicetify && Spicetify.showNotification) {
            Spicetify.showNotification("Switched to Custom Video / Local File");
        }
    } else {
        await syncFromWallpaperEngine(true);
        if (window.Spicetify && Spicetify.showNotification) {
            Spicetify.showNotification("Switched to Wallpaper Engine Sync");
        }
    }
    window.dispatchEvent(new CustomEvent("we-source-changed", { detail: { source } }));
}

export function toggleWallpaperSource() {
    const next = settings.wallpaperSource === "custom-video" ? "wallpaper-engine" : "custom-video";
    return setWallpaperSource(next);
}

export function setupContainer() {
    if (document.getElementById("we-container")) return;
    const container = document.createElement("div");
    container.id = "we-container";
    container.innerHTML = `
        <img id="we-image" class="we-media-hidden" />
        <video id="we-video" class="we-media-hidden" autoplay loop muted playsinline></video>
        <div id="we-overlay"></div>
    `;
    document.body.prepend(container);

    imageEl = document.getElementById("we-image");
    videoEl = document.getElementById("we-video");
    applyVisualSettings();
    applyPauseState();

    if (settings.wallpaperSource === "custom-video") {
        loadAndApplyCustomMedia();
    } else {
        syncFromWallpaperEngine(false);
    }
}

export async function syncFromWallpaperEngine(manual = false) {
    if (settings.wallpaperSource === "custom-video" && !manual) return;
    if (isSyncing) return;
    try {
        isSyncing = true;
        if (syncAbort) {
            try { syncAbort.abort(); } catch {}
        }
        syncAbort = new AbortController();
        const timeoutId = setTimeout(() => syncAbort.abort(), 5000);

        let res;
        try {
            res = await fetch(`${BRIDGE_API}/api/current`, {
                cache: "no-store",
                signal: syncAbort.signal
            });
        } finally {
            clearTimeout(timeoutId);
        }
        if (!res.ok) throw new Error("Bridge not ready");
        const data = await res.json();

        if (data.status === "ok" && data.mediaUrl) {
            if (settings.wallpaperPaused && !manual) {
                isSyncing = false;
                return;
            }

            const syncKey = data.version ? `${data.fileName}@${data.version}` : data.fileName;
            const isVideoMedia = (data.mediaType && data.mediaType.startsWith("video/")) || /\.(mp4|webm|mkv|mov)($|\?)/i.test(data.mediaUrl || "");
            const hasValidMedia = isVideoMedia
                ? (videoEl && videoEl.src && videoEl.src !== "" && !videoEl.classList.contains("we-media-hidden"))
                : (imageEl && imageEl.src && imageEl.src !== "" && imageEl.naturalWidth > 0 && !imageEl.classList.contains("we-media-hidden"));
            if (syncKey === settings.lastSyncFile && hasValidMedia && !manual) {
                isSyncing = false;
                updateBridgeStatusUI(true, data.title);
                return;
            }

            settings.lastSyncFile = syncKey;
            settings.mediaName = `${data.title} (${data.fileName})`;
            settings.mediaType = data.mediaType;
            saveSettings();

            renderMedia(data.mediaUrl, data.mediaType);

            if (manual && window.Spicetify && Spicetify.showNotification) {
                Spicetify.showNotification("Synced: " + data.title);
            }

            updateBridgeStatusUI(true, data.title);
        } else {
            updateBridgeStatusUI(false, "No wallpaper found");
        }
    } catch (e) {
        updateBridgeStatusUI(false, "Bridge is not running");
        if (manual && window.Spicetify && Spicetify.showNotification) {
            Spicetify.showNotification("Bridge is not running");
        }
    } finally {
        isSyncing = false;
    }
}

export function updateBridgeStatusUI(connected, text) {
    const badge = document.getElementById("we-bridge-status");
    if (badge) {
        badge.innerHTML = connected
            ? `<span style="color:#1ed760;">Connected: ${text}</span>`
            : `<span style="color:#ff5555;"> ${text}</span>`;
    }
    const alertBox = document.getElementById("we-bridge-alert-box");
    if (alertBox) {
        alertBox.style.display = connected ? "none" : "block";
    }
}

export function startAutoSyncWatcher() {
    setInterval(() => {
        if (settings.wallpaperSource === "wallpaper-engine" && settings.autoSync && !settings.wallpaperPaused) {
            syncFromWallpaperEngine(false);
        }
    }, 3000);
}
