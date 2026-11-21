import { settings, saveMedia } from '../modules/settings.js';
import { renderMedia, toggleWallpaperPause, toggleWallpaperSource } from '../modules/mediaRenderer.js';
import { openModal } from './settingsModal.js';

export function updateTopbarPauseBtn() {
    const pauseBtn = document.getElementById("we-topbar-pause-btn");
    if (!pauseBtn) return;
    if (settings.wallpaperPaused) {
        pauseBtn.classList.add("we-is-paused");
        pauseBtn.title = "Resume Video / Wallpaper (Ctrl+Shift+P)";
        pauseBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
        `;
    } else {
        pauseBtn.classList.remove("we-is-paused");
        pauseBtn.title = "Pause Video / Wallpaper (Ctrl+Shift+P)";
        pauseBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>
        `;
    }
}

export function updateTopbarSourceBtn() {
    const srcBtn = document.getElementById("we-topbar-source-btn");
    if (!srcBtn) return;
    const isCustom = settings.wallpaperSource === "custom-video";
    if (isCustom) {
        srcBtn.classList.add("we-is-custom");
        srcBtn.title = "Source: Custom Video (Click to switch to Wallpaper Engine - Ctrl+Shift+S)";
        srcBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="2" y1="7" x2="7" y2="7"></line>
                <line x1="2" y1="17" x2="7" y2="17"></line>
                <line x1="17" y1="17" x2="22" y2="17"></line>
                <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
        `;
    } else {
        srcBtn.classList.remove("we-is-custom");
        srcBtn.title = "Source: Wallpaper Engine (Click to switch to Custom Video - Ctrl+Shift+S)";
        srcBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
        `;
    }
}

export function setupTopBarControls() {
    setInterval(() => {
        const navBar = document.querySelector('#global-nav-bar, [aria-label="global-nav-bar"], .Root__globalNav');
        if (!navBar) return;

        const rightGroup = (navBar.children && navBar.children.length >= 3)
            ? navBar.children[navBar.children.length - 1]
            : (navBar.lastElementChild || navBar);

        let controlsGroup = document.getElementById("we-topbar-controls-group");
        if (!controlsGroup) {
            controlsGroup = document.createElement("div");
            controlsGroup.id = "we-topbar-controls-group";
            if (rightGroup.firstElementChild) {
                rightGroup.insertBefore(controlsGroup, rightGroup.firstElementChild);
            } else {
                rightGroup.appendChild(controlsGroup);
            }
        } else if (controlsGroup.parentElement !== rightGroup) {
            if (rightGroup.firstElementChild) {
                rightGroup.insertBefore(controlsGroup, rightGroup.firstElementChild);
            } else {
                rightGroup.appendChild(controlsGroup);
            }
        }

        let pauseBtn = document.getElementById("we-topbar-pause-btn");
        if (!pauseBtn) {
            pauseBtn = document.createElement("button");
            pauseBtn.id = "we-topbar-pause-btn";
            pauseBtn.type = "button";
            pauseBtn.onmousedown = (e) => e.stopPropagation();
            pauseBtn.onpointerdown = (e) => e.stopPropagation();
            pauseBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWallpaperPause();
            };
            controlsGroup.appendChild(pauseBtn);
            updateTopbarPauseBtn();
        } else if (pauseBtn.parentElement !== controlsGroup) {
            controlsGroup.appendChild(pauseBtn);
        }

        let srcBtn = document.getElementById("we-topbar-source-btn");
        if (!srcBtn) {
            srcBtn = document.createElement("button");
            srcBtn.id = "we-topbar-source-btn";
            srcBtn.type = "button";
            srcBtn.onmousedown = (e) => e.stopPropagation();
            srcBtn.onpointerdown = (e) => e.stopPropagation();
            srcBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWallpaperSource();
            };
            controlsGroup.appendChild(srcBtn);
            updateTopbarSourceBtn();
        } else if (srcBtn.parentElement !== controlsGroup) {
            controlsGroup.appendChild(srcBtn);
        }

        let settingsBtn = document.getElementById("we-topbar-settings-btn");
        if (!settingsBtn) {
            settingsBtn = document.createElement("button");
            settingsBtn.id = "we-topbar-settings-btn";
            settingsBtn.type = "button";
            settingsBtn.title = "Wallpaper Settings (Ctrl+Shift+W)";
            settingsBtn.onmousedown = (e) => e.stopPropagation();
            settingsBtn.onpointerdown = (e) => e.stopPropagation();
            settingsBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal();
            };
            settingsBtn.innerHTML = `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            `;
            controlsGroup.appendChild(settingsBtn);
        } else if (settingsBtn.parentElement !== controlsGroup) {
            controlsGroup.appendChild(settingsBtn);
        }
    }, 800);

    window.addEventListener("we-pause-changed", () => {
        updateTopbarPauseBtn();
    });

    window.addEventListener("we-source-changed", () => {
        updateTopbarSourceBtn();
    });
}

export function setupSidebarControls() {
    function getSidebarTarget() {
        const headerBtnGroup = document.querySelector(
            'header .EXufBYN45LoUdBAn829X, [data-testid="your-library-x"] header .EXufBYN45LoUdBAn829X, .YourLibraryX header .EXufBYN45LoUdBAn829X, header .XEP6zra7FO94Q2YIHXs3'
        );
        if (headerBtnGroup) return { container: headerBtnGroup, insertBeforeFirst: true };

        const fallbackHeader = document.querySelector(
            '[data-testid="your-library-x"] header, .YourLibraryX header, #Desktop_LeftSidebar_Id header, .Root__nav-bar header'
        );
        if (fallbackHeader) return { container: fallbackHeader, insertBeforeFirst: false };

        const entryPoints = document.querySelector(
            '.main-yourLibraryX-entryPoints, .main-yourLibraryX-navItems, #Desktop_LeftSidebar_Id nav, .Root__nav-bar nav'
        );
        if (entryPoints) return { container: entryPoints, insertBeforeFirst: false };

        return null;
    }

    function createOrUpdateSidebarBtn() {
        document.querySelectorAll('#global-nav-bar .custom-navlink, .Root__globalNav .custom-navlink').forEach((el) => {
            const label = (el.getAttribute("aria-label") || el.getAttribute("title") || "").toLowerCase();
            const html = el.innerHTML || "";
            if (label.includes("marketplace") || html.includes("151.909 72.923") || html.includes("76.465 68.262")) {
                el.setAttribute("data-we-hidden-marketplace", "true");
            }
        });

        const target = getSidebarTarget();
        if (!target || !target.container) return;

        let btn = document.getElementById("we-sidebar-marketplace-btn");
        if (!btn) {
            btn = document.createElement("button");
            btn.id = "we-sidebar-marketplace-btn";
            btn.type = "button";
            btn.title = "Marketplace";
            btn.setAttribute("aria-label", "Marketplace");
            btn.innerHTML = `
                <svg viewBox="0 0 76.465 68.262">
                    <path d="M151.909 72.923v6.5h10.097l8.663 44.567h48.968v-6.5h-43.61l-1.2-6.172h42.974l10.35-33.91h-59.915l-.872-4.485H151.91zm17.59 10.984h49.867l-6.393 20.91h-39.409l-4.064-20.91z" transform="translate(-151.909 -72.923)"/><circle cx="23.216" cy="61.594" r="6.5"/><circle cx="61.49" cy="61.594" r="6.5"/>
                </svg>
            `;
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.Spicetify && Spicetify.Platform && Spicetify.Platform.History) {
                    Spicetify.Platform.History.push("/marketplace");
                } else {
                    const topLink = document.querySelector('button.custom-navlink[aria-label*="Marketplace"], #global-nav-bar a[href="/marketplace"]');
                    if (topLink) {
                        topLink.click();
                    } else {
                        window.location.hash = "/marketplace";
                    }
                }
            };
            if (window.Spicetify && Spicetify.Tippy && Spicetify.TippyProps) {
                try {
                    Spicetify.Tippy(btn, { content: "Marketplace", ...Spicetify.TippyProps });
                } catch (_) {}
            }
        }

        const isMarketplace = (window.Spicetify && Spicetify.Platform && Spicetify.Platform.History && Spicetify.Platform.History.location && Spicetify.Platform.History.location.pathname && Spicetify.Platform.History.location.pathname.startsWith("/marketplace"))
            || (window.location && (window.location.pathname.startsWith("/marketplace") || window.location.hash.includes("marketplace")));
        if (isMarketplace) {
            btn.classList.add("we-active");
        } else {
            btn.classList.remove("we-active");
        }

        if (btn.parentElement !== target.container) {
            if (target.insertBeforeFirst && target.container.firstElementChild) {
                target.container.insertBefore(btn, target.container.firstElementChild);
            } else {
                target.container.appendChild(btn);
            }
        }
    }

    createOrUpdateSidebarBtn();
    setInterval(createOrUpdateSidebarBtn, 800);
    if (window.Spicetify && Spicetify.Platform && Spicetify.Platform.History && Spicetify.Platform.History.listen) {
        try {
            Spicetify.Platform.History.listen(() => {
                createOrUpdateSidebarBtn();
            });
        } catch (_) {}
    }
}

export function setupUI() {
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === "W" || e.key === "w")) {
            openModal();
        }
        if (e.ctrlKey && e.shiftKey && (e.key === "P" || e.key === "p")) {
            toggleWallpaperPause();
        }
        if (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) {
            toggleWallpaperSource();
        }
    });

    setupTopBarControls();
    setupSidebarControls();

    document.addEventListener("dragover", (e) => {
        if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files")) {
            e.preventDefault();
        }
    });
    document.addEventListener("drop", (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            const isMedia = file.type.startsWith("image/") || file.type.startsWith("video/") || file.name.match(/\.(jpg|jpeg|png|webp|gif|mp4|webm|mov|mkv)$/i);
            if (isMedia) {
                const type = file.type || (file.name.match(/\.(mp4|webm|mov|mkv)$/i) ? "video/mp4" : "image/jpeg");
                saveMedia(file, file.name, type);
                renderMedia(file, type);
                window.dispatchEvent(new CustomEvent("we-source-changed", { detail: { source: "custom-video" } }));
                if (window.Spicetify && Spicetify.showNotification) {
                    Spicetify.showNotification("Loaded custom media: " + file.name);
                }
            }
        }
    });
}
