export const DB_NAME = "SpotifyWallpaperEngineDB_v2";
export const STORE_NAME = "wallpapers";
export const SETTINGS_KEY = "WE_Spotify_Settings_v2";
export const BRIDGE_API = "http://127.0.0.1:43196";

export const defaultSettings = {
    opacity: 0.35,
    sidebarOpacity: 0,
    sidebarBlur: 0,
    playerOpacity: 0,
    headerOpacity: 0.35,
    headerBlur: 0,
    topBarOpacity: 0,
    topBarBlur: 0,
    searchBgColor: "#181818",
    searchBgOpacity: 0.96,
    bgBlur: 0,
    brightness: 100,
    fitMode: "cover",
    position: "center",
    posHorizontal: 50,
    targetMonitor: "Monitor0",
    videoIntroTrim: 0,
    videoSkipIntroOnStart: true,
    zoom: 100,
    autoSync: true,
    wallpaperPaused: false,
    wallpaperSource: "wallpaper-engine",
    mediaType: "unknown",
    mediaName: "No file selected",
    customMediaName: "",
    lastSyncFile: "",
    homeQuickTabs: true,
    homeQuickTabsLang: "auto",
};

export let settings = Object.assign({}, defaultSettings);

export function loadSettings() {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) settings = Object.assign({}, defaultSettings, JSON.parse(saved));
        if (settings.wallpaperSource === undefined) settings.wallpaperSource = "wallpaper-engine";
        if (settings.sidebarOpacity === undefined) settings.sidebarOpacity = 0;
        if (settings.sidebarBlur === undefined) settings.sidebarBlur = 0;
        if (settings.playerOpacity === undefined) settings.playerOpacity = 0;
        if (settings.topBarOpacity === undefined) settings.topBarOpacity = 0;
        if (settings.topBarBlur === undefined) settings.topBarBlur = 0;
        if (settings.wallpaperPaused === undefined) settings.wallpaperPaused = false;
        if (settings.searchBgColor === undefined) settings.searchBgColor = "#181818";
        if (settings.searchBgOpacity === undefined) settings.searchBgOpacity = 0.96;
        if (settings.homeQuickTabs === undefined) settings.homeQuickTabs = true;
        if (settings.homeQuickTabsLang === undefined) settings.homeQuickTabsLang = "auto";
        if (settings.posHorizontal === undefined) settings.posHorizontal = 50;
        if (settings.targetMonitor === undefined) settings.targetMonitor = "Monitor0";
        if (settings.videoIntroTrim === undefined) settings.videoIntroTrim = 0;
        if (settings.videoSkipIntroOnStart === undefined) settings.videoSkipIntroOnStart = true;
    } catch (e) {
        console.warn("[Wallpaper Engine] Failed to read localStorage:", e);
    }
    applyVisualSettings();
    return settings;
}

export function saveSettings() {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) { }
    applyVisualSettings();
}

export function applyVisualSettings() {
    document.documentElement.style.setProperty("--we-bg-opacity", settings.opacity);
    document.documentElement.style.setProperty("--we-sidebar-opacity", settings.sidebarOpacity !== undefined ? settings.sidebarOpacity : 0);
    document.documentElement.style.setProperty("--we-sidebar-blur", (settings.sidebarBlur !== undefined ? settings.sidebarBlur : 0) + "px");
    document.documentElement.style.setProperty("--we-player-opacity", settings.playerOpacity !== undefined ? settings.playerOpacity : 0);
    document.documentElement.style.setProperty("--we-header-opacity", settings.headerOpacity !== undefined ? settings.headerOpacity : 0.35);
    document.documentElement.style.setProperty("--we-header-blur", (settings.headerBlur || 0) + "px");
    document.documentElement.style.setProperty("--we-topbar-opacity", settings.topBarOpacity !== undefined ? settings.topBarOpacity : 0);
    document.documentElement.style.setProperty("--we-topbar-blur", (settings.topBarBlur || 0) + "px");
    document.documentElement.style.setProperty("--we-search-bg-color", settings.searchBgColor || "#181818");
    document.documentElement.style.setProperty("--we-search-bg-opacity", settings.searchBgOpacity !== undefined ? settings.searchBgOpacity : 0.96);
    document.documentElement.style.setProperty("--we-img-blur", (settings.bgBlur || 0) + "px");
    document.documentElement.style.setProperty("--we-img-brightness", (settings.brightness || 100) + "%");
    document.documentElement.style.setProperty("--we-fit-mode", settings.fitMode || "cover");
    let computedPos = settings.position || "center";
    if (settings.posHorizontal !== undefined) {
        let vert = "50%";
        if (settings.position === "top") vert = "0%";
        else if (settings.position === "bottom") vert = "100%";
        computedPos = `${settings.posHorizontal}% ${vert}`;
    }
    document.documentElement.style.setProperty("--we-pos", computedPos);
    document.documentElement.style.setProperty("--we-zoom", settings.zoom || 100);

    if (settings.wallpaperPaused) {
        document.body.classList.add("we-wallpaper-paused");
    } else {
        document.body.classList.remove("we-wallpaper-paused");
    }
}

export function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function saveMedia(blob, name, type) {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put({ blob, name, type }, "current_media");
        settings.customMediaName = name;
        settings.mediaName = name;
        settings.mediaType = type;
        settings.wallpaperSource = "custom-video";
        saveSettings();
    } catch (e) {
        console.warn("[Wallpaper Engine] Failed to save DB:", e);
    }
}

export async function loadSavedMedia() {
    try {
        const db = await openDB();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const req = tx.objectStore(STORE_NAME).get("current_media");
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        });
    } catch (e) {
        return null;
    }
}
