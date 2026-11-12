import { settings, saveSettings, saveMedia } from '../modules/settings.js';
import { renderMedia, syncFromWallpaperEngine, toggleWallpaperPause, setWallpaperSource, applyVideoLoopSettings } from '../modules/mediaRenderer.js';

export function openModal() {
        if (document.getElementById("we-modal-overlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "we-modal-overlay";
        overlay.innerHTML = `
            <div class="we-dialog">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                    <h2 style="margin:0; font-size:1.15rem; font-weight:700;">Wallpaper Engine & Dimensions</h2>
                    <button id="we-close"style="background:none; border:none; color:#aaa; font-size:24px; cursor:pointer;">&times;</button>
                </div>

                <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:12px; margin-bottom:14px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-weight:700; font-size:13px;">Wallpaper Source:</span>
                        <span id="we-current-source-badge" style="font-size:11px; padding:2px 8px; border-radius:12px; background:${settings.wallpaperSource === 'custom-video' ? 'rgba(80,155,245,0.15)' : 'rgba(30,215,96,0.15)'}; color:${settings.wallpaperSource === 'custom-video' ? '#509bf5' : '#1ed760'}; font-weight:600;">
                            ${settings.wallpaperSource === "custom-video" ? "Custom Video" : "Wallpaper Engine"}
                        </span>
                    </div>

                    <div class="we-btn-group" id="we-source-group" style="margin-bottom:12px;">
                        <button class="we-btn-pill ${settings.wallpaperSource !== 'custom-video' ? 'active' : ''}" id="we-btn-src-we" data-source="wallpaper-engine">
                            Wallpaper Engine
                        </button>
                        <button class="we-btn-pill ${settings.wallpaperSource === 'custom-video' ? 'active' : ''}" id="we-btn-src-custom" data-source="custom-video">
                            Custom Video / File
                        </button>
                    </div>

                    <div id="we-panel-we" style="display:${settings.wallpaperSource !== 'custom-video' ? 'block' : 'none'};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span style="font-size:12px; color:#aaa;">Connection:</span>
                            <div id="we-bridge-status" style="font-size:12px;">Checking connection...</div>
                        </div>
                        <button class="we-btn-sync" id="we-btn-sync-now">Sync from Wallpaper Engine Now</button>
                        <label style="display:flex; align-items:center; gap:8px; margin-top:8px; font-size:12px; color:#bbb; cursor:pointer;">
                            <input type="checkbox" id="we-chk-autosync" ${settings.autoSync ? "checked" : ""} style="accent-color:#1ed760;" />Auto-sync wallpaper with Wallpaper Engine (Realtime)
                        </label>

                        <div id="we-bridge-alert-box" style="display:none; background:rgba(234, 179, 8, 0.08); border:1px solid rgba(234, 179, 8, 0.28); border-radius:10px; padding:12px; margin-top:10px;">
                            <div style="margin-bottom:6px;">
                                <b style="font-size:12px; color:#facc15;">Background Sync Service Required</b>
                            </div>
                            <p style="font-size:11px; color:#ccc; margin:0 0 10px 0; line-height:1.45;">
                                A one-time activation is required to automatically synchronize backgrounds from Wallpaper Engine when Spotify opens:
                            </p>
                            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                                <button id="we-btn-download-activator" style="flex:1; min-width:140px; background:#1ed760; color:#000; border:none; border-radius:8px; padding:8px 12px; font-weight:700; font-size:11px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                                    Download 1-Click Activator
                                </button>
                                <button id="we-btn-copy-command" style="flex:1; min-width:140px; background:rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:8px 12px; font-weight:600; font-size:11px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                                    Copy PowerShell Command
                                </button>
                            </div>

                            <div style="margin-top:10px; padding:9px 11px; background:rgba(0,0,0,0.32); border-radius:8px; border:1px solid rgba(255,255,255,0.08); font-size:11px; line-height:1.5; color:#bbb;">
                                <div style="font-weight:700; color:#1ed760; margin-bottom:4px;">
                                    Security & Transparency (100% Open Source):
                                </div>
                                <div style="color:#aaa; font-size:10.5px;">
                                    Spotify runs inside an isolated web sandbox and cannot read external disk files. This activator registers a local bridge daemon listening exclusively on <code>127.0.0.1:43196</code> to stream active wallpaper data into Spotify. Zero external telemetry, 100% open source, and completely safe.
                                </div>
                            </div>
                        </div>

                        <div style="font-size:11px; color:#888; margin-top:8px; line-height:1.4;">
                            Note: Some wallpapers may not function properly or may fail to display due to technical limitations. Compatibility will be improved in future updates.
                        </div>
                    </div>

                    <div id="we-panel-custom" style="display:${settings.wallpaperSource === 'custom-video' ? 'block' : 'none'};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span style="font-size:12px; color:#aaa;">Active Media:</span>
                            <span id="we-custom-name" style="font-size:12px; color:#509bf5; font-weight:600; text-overflow:ellipsis; overflow:hidden; max-width:230px; white-space:nowrap;">
                                ${settings.customMediaName || settings.mediaName || "No file selected"}
                            </span>
                        </div>
                        <button class="we-btn-sync" id="we-btn-pick-custom" style="background:#2e77d0; color:#fff;">
                            Select / Change Video or Image
                        </button>
                        <input type="file" id="we-file" accept="video/webm,video/mp4,image/gif,image/jpeg,image/png,image/webp" style="display:none;" />
                        <div style="font-size:11px; color:#aaa; margin-top:6px; text-align:center; line-height:1.4;">
                            Supports <code>.webm</code> videos, <code>.gif</code> animations, and <code>.png, .jpg, .webp</code> images.<br>
                            <span style="color:#eab308; font-size:10px;">(Note: MP4 files require conversion to .webm via tools/convert-to-webm.bat for live playback)</span>
                        </div>
                    </div>

                    <button class="we-btn-pill ${settings.wallpaperPaused ? 'active' : ''}" id="we-btn-toggle-pause" style="margin-top:10px; width:100%; display:flex; align-items:center; justify-content:center; gap:8px;">
                        ${settings.wallpaperPaused ? 'Resume Video / Wallpaper' : 'Pause Video / Wallpaper'}
                    </button>
                </div>

                <div style="background:rgba(80,150,255,0.06); border:1px solid rgba(80,150,255,0.22); border-radius:10px; padding:12px; margin-bottom:14px;">
                    <div style="font-weight:700; font-size:13px; color:#5096ff; margin-bottom:8px;">Video Playback & Intro Loop:</div>
                    <div class="we-row" style="margin-bottom:8px !important;">
                        <label>
                            <span>Skip Video Intro / Loop Start:</span>
                            <b id="we-intro-trim-val">${settings.videoIntroTrim || 0}s</b>
                        </label>
                        <input type="range" class="we-slider" id="we-intro-trim" min="0" max="30" step="0.5" value="${settings.videoIntroTrim || 0}">
                    </div>
                    <div class="we-checkbox-row" style="margin-bottom:0 !important;">
                        <label class="we-chk-label" style="font-size:12px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                            <input type="checkbox" id="we-chk-skip-start" ${settings.videoSkipIntroOnStart ? 'checked' : ''}>
                            <span>Skip intro immediately on start</span>
                        </label>
                    </div>
                </div>

                
                <div style="background:rgba(30,215,96,0.06); border:1px solid rgba(30,215,96,0.25); border-radius:10px; padding:12px; margin-bottom:14px;">
                    <div style="font-weight:700; font-size:13px; color:#1ed760; margin-bottom:8px;">Wallpaper Size & Position:</div>

                    <div class="we-row"style="margin-bottom:8px !important;">
                        <label><span>Display Fit Mode:</span></label>
                        <div class="we-btn-group"id="we-fit-group">
                            <button class="we-btn-pill ${settings.fitMode === 'cover' ? 'active' : ''}"data-val="cover">Cover (Fill Frame)</button>
                            <button class="we-btn-pill ${settings.fitMode === 'contain' ? 'active' : ''}"data-val="contain">Contain (Fit All)</button>
                            <button class="we-btn-pill ${settings.fitMode === 'fill' ? 'active' : ''}"data-val="fill">Stretch (Fill)</button>
                        </div>
                    </div>

                    <div class="we-row"style="margin-bottom:8px !important;">
                        <label><span>Horizontal Focus (Screen / Subject):</span>
                            <b id="we-pos-x-val">${settings.posHorizontal || 50}%</b>
                        </label>
                        <div class="we-btn-group"id="we-pos-x-group"style="margin-bottom:6px;">
                            <button class="we-btn-pill ${(settings.posHorizontal || 50) === 0 ? 'active' : ''}"data-val="0">Left (Details 0%)</button>
                            <button class="we-btn-pill ${(settings.posHorizontal || 50) === 50 ? 'active' : ''}"data-val="50">Center (50%)</button>
                            <button class="we-btn-pill ${(settings.posHorizontal || 50) === 100 ? 'active' : ''}"data-val="100">Right (Subject 100%)</button>
                        </div>
                        <input type="range"class="we-slider"id="we-pos-x"min="0"max="100"value="${settings.posHorizontal || 50}">
                    </div>

                    <div class="we-row"style="margin-bottom:8px !important;">
                        <label><span>Vertical Focus:</span></label>
                        <div class="we-btn-group"id="we-pos-group">
                            <button class="we-btn-pill ${settings.position === 'top' ? 'active' : ''}"data-val="top">Top (Head)</button>
                            <button class="we-btn-pill ${settings.position === 'center' ? 'active' : ''}"data-val="center">Center</button>
                            <button class="we-btn-pill ${settings.position === 'bottom' ? 'active' : ''}"data-val="bottom">Bottom</button>
                        </div>
                    </div>

                    <div class="we-row"style="margin-bottom:8px !important;">
                        <label><span>Dual-Monitor Wallpaper Source:</span></label>
                        <div class="we-btn-group"id="we-mon-group">
                            <button class="we-btn-pill ${(!settings.targetMonitor || settings.targetMonitor === 'Monitor0') ? 'active' : ''}"data-val="Monitor0">Monitor 1</button>
                            <button class="we-btn-pill ${settings.targetMonitor === 'Monitor1' ? 'active' : ''}"data-val="Monitor1">Monitor 2</button>
                        </div>
                    </div>

                    <div class="we-row"style="margin-bottom:0 !important;">
                        <label><span>Zoom:</span>
                            <b id="we-zoom-val">${settings.zoom || 100}%</b>
                        </label>
                        <input type="range"class="we-slider"id="we-zoom"min="60"max="160"value="${settings.zoom || 100}">
                    </div>
                </div>

                
                <div class="we-row">
                    <label><span>Wallpaper Blur:</span>
                        <b id="we-bl-val">${settings.bgBlur || 0}px</b>
                    </label>
                    <input type="range"class="we-slider"id="we-bl"min="0"max="30"value="${settings.bgBlur || 0}">
                </div>

                <div class="we-row">
                    <label><span>Spotify Darkness:</span>
                        <b id="we-op-val">${Math.round(settings.opacity * 100)}%</b>
                    </label>
                    <input type="range"class="we-slider"id="we-op"min="0"max="90"value="${settings.opacity * 100}">
                </div>

                
                <div style="background:rgba(255, 75, 75, 0.08); border:1px solid rgba(255, 75, 75, 0.25); border-radius:10px; padding:12px; margin-bottom:13px;">
                    <div style="font-weight:700; font-size:13px; color:#ff6b6b; margin-bottom:8px;">Header & Banner Opacity:</div>
                    
                    <div class="we-row"style="margin-bottom:8px !important;">
                        <label><span>Header Opacity (0% = Fully Transparent):</span>
                            <b id="we-header-op-val">${Math.round((settings.headerOpacity !== undefined ? settings.headerOpacity : 0.35) * 100)}%</b>
                        </label>
                        <input type="range"class="we-slider"id="we-header-op"min="0"max="100"value="${Math.round((settings.headerOpacity !== undefined ? settings.headerOpacity : 0.35) * 100)}">
                    </div>

                    <div class="we-row"style="margin-bottom:0 !important;">
                        <label><span>Header Glass Blur:</span>
                            <b id="we-header-bl-val">${settings.headerBlur || 0}px</b>
                        </label>
                        <input type="range"class="we-slider"id="we-header-bl"min="0"max="25"value="${settings.headerBlur || 0}">
                    </div>
                </div>

                
                <div style="background:rgba(168, 85, 247, 0.08); border:1px solid rgba(168, 85, 247, 0.25); border-radius:10px; padding:12px; margin-bottom:13px;">
                    <div style="font-weight:700; font-size:13px; color:#c084fc; margin-bottom:8px;">Top Navigation Bar (Top Bar):</div>

                    <div class="we-row"style="margin-bottom:8px !important;">
                        <label><span>Top Bar Background Opacity (0% = Fully Transparent):</span>
                            <b id="we-topbar-op-val">${Math.round((settings.topBarOpacity !== undefined ? settings.topBarOpacity : 0) * 100)}%</b>
                        </label>
                        <input type="range"class="we-slider"id="we-topbar-op"min="0"max="100"value="${Math.round((settings.topBarOpacity !== undefined ? settings.topBarOpacity : 0) * 100)}"style="accent-color:#c084fc;">
                    </div>

                    <div class="we-row"style="margin-bottom:0 !important;">
                        <label><span>Top Bar Glass Blur:</span>
                            <b id="we-topbar-bl-val">${settings.topBarBlur || 0}px</b>
                        </label>
                        <input type="range"class="we-slider"id="we-topbar-bl"min="0"max="25"value="${settings.topBarBlur || 0}"style="accent-color:#c084fc;">
                    </div>
                </div>

                
                <div style="background:rgba(29, 185, 84, 0.08); border:1px solid rgba(29, 185, 84, 0.25); border-radius:10px; padding:12px; margin-bottom:13px;">
                    <div style="font-weight:700; font-size:13px; color:#1ed760; margin-bottom:8px;">Sidebar & Bottom Player Bar:</div>
                    
                    <div class="we-row"style="margin-bottom:8px !important;">
                        <label><span>Sidebar Background Opacity (0% = Fully Transparent):</span>
                            <b id="we-sidebar-op-val">${Math.round((settings.sidebarOpacity !== undefined ? settings.sidebarOpacity : 0) * 100)}%</b>
                        </label>
                        <input type="range"class="we-slider"id="we-sidebar-op"min="0"max="100"value="${Math.round((settings.sidebarOpacity !== undefined ? settings.sidebarOpacity : 0) * 100)}">
                    </div>

                    <div class="we-row"style="margin-bottom:8px !important;">
                        <label><span>Sidebar Glass Blur:</span>
                            <b id="we-sidebar-bl-val">${settings.sidebarBlur || 0}px</b>
                        </label>
                        <input type="range"class="we-slider"id="we-sidebar-bl"min="0"max="25"value="${settings.sidebarBlur || 0}">
                    </div>

                    <div class="we-row"style="margin-bottom:0 !important;">
                        <label><span>Player Bar Background Opacity (0% = Fully Transparent):</span>
                            <b id="we-player-op-val">${Math.round((settings.playerOpacity !== undefined ? settings.playerOpacity : 0) * 100)}%</b>
                        </label>
                        <input type="range"class="we-slider"id="we-player-op"min="0"max="100"value="${Math.round((settings.playerOpacity !== undefined ? settings.playerOpacity : 0) * 100)}">
                    </div>
                </div>

                
                <div style="background:rgba(80, 155, 245, 0.08); border:1px solid rgba(80, 155, 245, 0.25); border-radius:10px; padding:12px; margin-bottom:13px;">
                    <div style="font-weight:700; font-size:13px; color:#509bf5; margin-bottom:8px;">Search Dropdown Color & Opacity:</div>
                    
                    <div class="we-row"style="margin-bottom:8px !important;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"><span style="font-size:13px; color:#ccc;">Search background color:</span>
                            <div style="display:flex; align-items:center; gap:8px;"><span id="we-search-color-hex"style="font-size:12px; color:#888; font-family:monospace;">${settings.searchBgColor || '#181818'}</span>
                                <input type="color"id="we-search-color"value="${settings.searchBgColor || '#181818'}"style="width:36px; height:28px; border:none; border-radius:6px; cursor:pointer; background:transparent; padding:0;" />
                            </div>
                        </div>
                        <div class="we-btn-group"id="we-search-presets"style="flex-wrap:wrap; gap:6px;">
                            <button class="we-btn-pill"data-col="#181818"style="background:#181818; border-color:#444;">Default</button>
                            <button class="we-btn-pill"data-col="#101010"style="background:#101010; border-color:#333;">Pitch Black</button>
                            <button class="we-btn-pill"data-col="#0f172a"style="background:#0f172a; border-color:#1e293b;">Navy Dark</button>
                            <button class="we-btn-pill"data-col="#0d1f18"style="background:#0d1f18; border-color:#133327;">Dark Pine</button>
                            <button class="we-btn-pill"data-col="#1a0d24"style="background:#1a0d24; border-color:#2a143b;">Deep Purple</button>
                        </div>
                    </div>

                    <div class="we-row"style="margin-bottom:0 !important;">
                        <label><span>Search Dropdown Opacity:</span>
                            <b id="we-search-op-val">${Math.round((settings.searchBgOpacity !== undefined ? settings.searchBgOpacity : 0.96) * 100)}%</b>
                        </label>
                        <input type="range"class="we-slider"id="we-search-op"min="70"max="100"value="${Math.round((settings.searchBgOpacity !== undefined ? settings.searchBgOpacity : 0.96) * 100)}">
                    </div>
                </div>

                <div class="we-row">
                    <label><span>Wallpaper Brightness:</span>
                        <b id="we-br-val">${settings.brightness}%</b>
                    </label>
                    <input type="range"class="we-slider"id="we-br"min="20"max="150"value="${settings.brightness}">
                </div>

                <div style="background:rgba(30, 215, 96, 0.08); border:1px solid rgba(30, 215, 96, 0.25); border-radius:10px; padding:12px; margin-bottom:13px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:700; font-size:13px; color:#1ed760;">Recommendation Filters (All / Music / Podcasts):</div>
                            <div style="font-size:11.5px; color:#aaa; margin-top:2px;">Tất cả, Nhạc & Podcasts cho Trang chủ / Đề xuất</div>
                        </div>
                        <input type="checkbox" id="we-chk-home-quick-tabs" ${settings.homeQuickTabs !== false ? "checked" : ""} style="accent-color:#1ed760; width:18px; height:18px; cursor:pointer;" />
                    </div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.08);">
                    <a href="https://github.com/POWER4392/Spotify---Wallpaper-Engine/issues/new/choose"target="_blank"rel="noopener noreferrer"style="font-size:12px; color:#1ed760; text-decoration:none; display:flex; align-items:center; gap:6px; font-weight:600; transition:opacity 0.2s ease;">
                        💬 Feedback & Bug Reports
                    </a>
                    <button id="we-ok"style="background:#1ed760; color:#000; border:none; padding:8px 24px; border-radius:20px; font-weight:700; cursor:pointer;">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        let onPauseChanged = null;
        const close = () => {
            if (onPauseChanged) window.removeEventListener("we-pause-changed", onPauseChanged);
            overlay.remove();
        };
        document.getElementById("we-close").onclick = close;
        document.getElementById("we-ok").onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };

        const updateSourceUI = () => {
            const isCustom = settings.wallpaperSource === "custom-video";
            const badge = document.getElementById("we-current-source-badge");
            if (badge) {
                badge.textContent = isCustom ? "Custom Video" : "Wallpaper Engine";
                badge.style.color = isCustom ? "#509bf5" : "#1ed760";
                badge.style.background = isCustom ? "rgba(80, 155, 245, 0.15)" : "rgba(30, 215, 96, 0.15)";
            }
            const btnWe = document.getElementById("we-btn-src-we");
            const btnCustom = document.getElementById("we-btn-src-custom");
            if (btnWe && btnCustom) {
                btnWe.classList.toggle("active", !isCustom);
                btnCustom.classList.toggle("active", isCustom);
            }
            const panelWe = document.getElementById("we-panel-we");
            const panelCustom = document.getElementById("we-panel-custom");
            if (panelWe) panelWe.style.display = !isCustom ? "block" : "none";
            if (panelCustom) panelCustom.style.display = isCustom ? "block" : "none";
            const customName = document.getElementById("we-custom-name");
            if (customName) {
                customName.textContent = settings.customMediaName || settings.mediaName || "No file selected";
            }
        };

        const btnSrcWe = document.getElementById("we-btn-src-we");
        if (btnSrcWe) {
            btnSrcWe.onclick = async () => {
                await setWallpaperSource("wallpaper-engine");
                updateSourceUI();
            };
        }

        const btnSrcCustom = document.getElementById("we-btn-src-custom");
        if (btnSrcCustom) {
            btnSrcCustom.onclick = async () => {
                await setWallpaperSource("custom-video");
                updateSourceUI();
            };
        }

        const btnPickCustom = document.getElementById("we-btn-pick-custom");
        const fileInput = document.getElementById("we-file");
        if (btnPickCustom && fileInput) {
            btnPickCustom.onclick = () => fileInput.click();
        }

        if (fileInput) {
            fileInput.onchange = (e) => {
                if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const type = file.type || (file.name.match(/\.(mp4|webm|mkv|mov)$/i) ? "video/mp4" : "image/jpeg");
                    saveMedia(file, file.name, type);
                    renderMedia(file, type);
                    updateSourceUI();
                    if (window.Spicetify && Spicetify.showNotification) {
                        Spicetify.showNotification("Loaded: " + file.name);
                    }
                }
            };
        }

        if (settings.wallpaperSource === "wallpaper-engine") {
            if (settings.mediaName && settings.mediaName !== "No file selected") {
                updateBridgeStatusUI(true, settings.mediaName);
            }
            syncFromWallpaperEngine(false);
        } else {
            updateBridgeStatusUI(true, "Custom Video: " + (settings.customMediaName || settings.mediaName || "Active"));
        }

        document.getElementById("we-btn-sync-now").onclick = () => {
            syncFromWallpaperEngine(true);
        };

        const showActivatorNotice = (onConfirm) => {
            const existing = document.getElementById("we-dialog-backdrop");
            if (existing) existing.remove();

            const dialog = document.createElement("div");
            dialog.id = "we-dialog-backdrop";
            dialog.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 1000002;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            `;

            dialog.innerHTML = `
                <div style="background:#181818; border:1px solid rgba(255, 255, 255, 0.16); border-radius:14px; max-width:460px; width:100%; padding:22px; box-shadow:0 16px 40px rgba(0,0,0,0.85); color:#eee;">
                    <div style="font-size:15px; font-weight:700; color:#fff; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
                        <span>Background Service Notice</span>
                        <button id="we-dialog-close" style="background:transparent; border:none; color:#888; font-size:20px; cursor:pointer; line-height:1; padding:0 4px;">&times;</button>
                    </div>

                    <p style="font-size:12px; color:#ccc; line-height:1.55; margin:0 0 12px 0;">
                        To allow real-time wallpaper synchronization, this activator registers a local background service on your computer.
                    </p>

                    <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:12px; margin-bottom:16px; font-size:11.5px; line-height:1.6; color:#bbb;">
                        <div style="font-weight:600; color:#1ed760; margin-bottom:6px;">Process Details & Safety:</div>
                        <ul style="margin:0; padding-left:18px; color:#aaa;">
                            <li>Registers a silent watcher script (<code>watch-spotify.ps1</code>) in Windows Startup.</li>
                            <li>Runs a local bridge listening exclusively on <code>127.0.0.1:43196</code> to feed wallpapers into Spotify.</li>
                            <li>Suspends automatically whenever Spotify is closed to minimize system resource usage.</li>
                            <li>100% open-source, safe, and operates strictly offline with zero external network tracking.</li>
                        </ul>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px;">
                        <button id="we-dialog-cancel" style="background:rgba(255,255,255,0.08); color:#fff; border:1px solid rgba(255,255,255,0.15); border-radius:20px; padding:7px 16px; font-weight:600; font-size:12px; cursor:pointer;">
                            Cancel
                        </button>
                        <button id="we-dialog-proceed" style="background:#1ed760; color:#000; border:none; border-radius:20px; padding:7px 18px; font-weight:700; font-size:12px; cursor:pointer;">
                            Download & Proceed
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            const closeDialog = () => { dialog.remove(); };
            dialog.querySelector("#we-dialog-close").onclick = closeDialog;
            dialog.querySelector("#we-dialog-cancel").onclick = closeDialog;
            dialog.querySelector("#we-dialog-proceed").onclick = () => {
                closeDialog();
                onConfirm();
            };
            dialog.onclick = (e) => {
                if (e.target === dialog) closeDialog();
            };
        };

        const executeDownloadActivator = () => {
            const batScript = `@echo off
chcp 65001 >nul
title Spotify Wallpaper Engine - Auto Setup
echo ============================================================
echo   Spotify ^<^-^> Wallpaper Engine Sync - Auto Setup
echo ============================================================
echo [Notice: 100%% Open-Source ^& Safe]
echo Starts the local bridge (127.0.0.1:43196) and registers a
echo background watcher daemon so Spotify automatically syncs.
echo No personal data is collected or sent anywhere.
echo ============================================================
echo.

if exist "%~dp0scripts\\setup\\setup-autostart.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\\setup\\setup-autostart.ps1"
    start "" wscript.exe "%~dp0scripts\\sync\\start-sync-silent.vbs"
    echo.
    echo [OK] Activated successfully from local repository!
    timeout /t 3 >nul
    exit /b
)

if exist "e:\\Mod\\spotify-wallpaper\\scripts\\setup\\install-bridge.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "e:\\Mod\\spotify-wallpaper\\scripts\\setup\\install-bridge.ps1"
    pause
    exit /b
)

echo Downloading and configuring background bridge from GitHub...
powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr -useb https://raw.githubusercontent.com/POWER4392/Spotify---Wallpaper-Engine/main/scripts/setup/install-bridge.ps1 | iex"
echo.
pause
`;
            const blob = new Blob([batScript], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Activate-Spotify-Wallpaper-Sync.bat";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (window.Spicetify && Spicetify.showNotification) {
                Spicetify.showNotification("Activator downloaded! Run the file to complete background setup.");
            }
        };

        const btnDownloadActivator = document.getElementById("we-btn-download-activator");
        if (btnDownloadActivator) {
            btnDownloadActivator.onclick = () => {
                showActivatorNotice(executeDownloadActivator);
            };
        }

        const btnCopyCommand = document.getElementById("we-btn-copy-command");
        if (btnCopyCommand) {
            btnCopyCommand.onclick = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                const cmd = 'powershell -WindowStyle Hidden -Command "iwr -useb https://raw.githubusercontent.com/POWER4392/Spotify---Wallpaper-Engine/main/scripts/setup/install-bridge.ps1 | iex"';
                
                let copied = false;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(cmd).catch(() => {});
                    copied = true;
                }
                try {
                    const ta = document.createElement("textarea");
                    ta.value = cmd;
                    ta.style.position = "fixed";
                    ta.style.top = "-9999px";
                    ta.style.left = "-9999px";
                    document.body.appendChild(ta);
                    ta.focus();
                    ta.select();
                    document.execCommand("copy");
                    document.body.removeChild(ta);
                    copied = true;
                } catch (err) {
                    console.warn("[Wallpaper Engine] Fallback execCommand failed:", err);
                }

                btnCopyCommand.textContent = "Copied to Clipboard!";
                btnCopyCommand.style.background = "#1ed760";
                btnCopyCommand.style.color = "#000";
                btnCopyCommand.style.borderColor = "#1ed760";
                btnCopyCommand.style.fontWeight = "700";

                setTimeout(() => {
                    btnCopyCommand.textContent = "Copy PowerShell Command";
                    btnCopyCommand.style.background = "rgba(255,255,255,0.1)";
                    btnCopyCommand.style.color = "#fff";
                    btnCopyCommand.style.borderColor = "rgba(255,255,255,0.2)";
                    btnCopyCommand.style.fontWeight = "600";
                }, 2500);

                if (window.Spicetify && Spicetify.showNotification) {
                    Spicetify.showNotification("Command copied to clipboard! Paste into PowerShell or Run (Win+R) and press Enter.");
                }
            };
        }

        const pauseBtnModal = document.getElementById("we-btn-toggle-pause");
        if (pauseBtnModal) {
            pauseBtnModal.onclick = () => {
                toggleWallpaperPause();
                pauseBtnModal.textContent = settings.wallpaperPaused ? 'Resume Video / Wallpaper' : 'Pause Video / Wallpaper';
                if (settings.wallpaperPaused) {
                    pauseBtnModal.classList.add("active");
                } else {
                    pauseBtnModal.classList.remove("active");
                }
            };
        }

        onPauseChanged = (e) => {
            if (pauseBtnModal) {
                pauseBtnModal.textContent = settings.wallpaperPaused ? 'Resume Video / Wallpaper' : 'Pause Video / Wallpaper';
                if (settings.wallpaperPaused) {
                    pauseBtnModal.classList.add("active");
                } else {
                    pauseBtnModal.classList.remove("active");
                }
            }
        };
        window.addEventListener("we-pause-changed", onPauseChanged);

        document.getElementById("we-chk-autosync").onchange = (e) => {
            settings.autoSync = e.target.checked;
            saveSettings();
        };

        const introSlider = document.getElementById("we-intro-trim");
        if (introSlider) {
            introSlider.oninput = (e) => {
                const val = parseFloat(e.target.value) || 0;
                settings.videoIntroTrim = val;
                document.getElementById("we-intro-trim-val").textContent = val + "s";
                saveSettings();
                applyVideoLoopSettings();
            };
        }

        const skipStartChk = document.getElementById("we-chk-skip-start");
        if (skipStartChk) {
            skipStartChk.onchange = (e) => {
                settings.videoSkipIntroOnStart = e.target.checked;
                saveSettings();
                applyVideoLoopSettings();
            };
        };

        const chkHomeTabs = document.getElementById("we-chk-home-quick-tabs");
        if (chkHomeTabs) {
            chkHomeTabs.onchange = (e) => {
                settings.homeQuickTabs = e.target.checked;
                saveSettings();
                if (window.__we_update_home_quick_tabs__) {
                    window.__we_update_home_quick_tabs__();
                }
            };
        }

        document.querySelectorAll("#we-fit-group .we-btn-pill").forEach((btn) => {
            btn.onclick = () => {
                document.querySelectorAll("#we-fit-group .we-btn-pill").forEach(b =>b.classList.remove("active"));
                btn.classList.add("active");
                settings.fitMode = btn.getAttribute("data-val");
                saveSettings();
            };
        });

        document.querySelectorAll("#we-pos-group .we-btn-pill").forEach((btn) => {
            btn.onclick = () => {
                document.querySelectorAll("#we-pos-group .we-btn-pill").forEach(b =>b.classList.remove("active"));
                btn.classList.add("active");
                settings.position = btn.getAttribute("data-val");
                saveSettings();
            };
        });

        document.querySelectorAll("#we-pos-x-group .we-btn-pill").forEach((btn) => {
            btn.onclick = () => {
                document.querySelectorAll("#we-pos-x-group .we-btn-pill").forEach(b =>b.classList.remove("active"));
                btn.classList.add("active");
                const val = parseInt(btn.getAttribute("data-val"));
                settings.posHorizontal = val;
                const s = document.getElementById("we-pos-x");
                if (s) s.value = val;
                const v = document.getElementById("we-pos-x-val");
                if (v) v.textContent = val + "%";
                saveSettings();
            };
        });

        const sliderPosX = document.getElementById("we-pos-x");
        if (sliderPosX) {
            sliderPosX.oninput = (e) => {
                const val = parseInt(e.target.value);
                settings.posHorizontal = val;
                const v = document.getElementById("we-pos-x-val");
                if (v) v.textContent = val + "%";
                document.querySelectorAll("#we-pos-x-group .we-btn-pill").forEach(b => {
                    b.classList.toggle("active", parseInt(b.getAttribute("data-val")) === val);
                });
                saveSettings();
            };
        }

        document.querySelectorAll("#we-mon-group .we-btn-pill").forEach((btn) => {
            btn.onclick = () => {
                document.querySelectorAll("#we-mon-group .we-btn-pill").forEach(b =>b.classList.remove("active"));
                btn.classList.add("active");
                settings.targetMonitor = btn.getAttribute("data-val");
                settings.lastSyncFile = "";
                saveSettings();
                syncFromWallpaperEngine(true);
            };
        });

        const sliderZoom = document.getElementById("we-zoom");
        sliderZoom.oninput = (e) => {
            settings.zoom = parseInt(e.target.value);
            document.getElementById("we-zoom-val").textContent = e.target.value + "%";
            saveSettings();
        };

        const sliderBl = document.getElementById("we-bl");
        sliderBl.oninput = (e) => {
            settings.bgBlur = parseInt(e.target.value);
            document.getElementById("we-bl-val").textContent = e.target.value + "px";
            saveSettings();
        };
        const sliderOp = document.getElementById("we-op");
        sliderOp.oninput = (e) => {
            settings.opacity = parseInt(e.target.value) / 100;
            document.getElementById("we-op-val").textContent = e.target.value + "%";
            saveSettings();
        };

        const sliderHeaderOp = document.getElementById("we-header-op");
        if (sliderHeaderOp) {
            sliderHeaderOp.oninput = (e) => {
                settings.headerOpacity = parseInt(e.target.value) / 100;
                document.getElementById("we-header-op-val").textContent = e.target.value + "%";
                saveSettings();
            };
        }

        const sliderHeaderBl = document.getElementById("we-header-bl");
        if (sliderHeaderBl) {
            sliderHeaderBl.oninput = (e) => {
                settings.headerBlur = parseInt(e.target.value);
                document.getElementById("we-header-bl-val").textContent = e.target.value + "px";
                saveSettings();
            };
        }

        const sliderTopBarOp = document.getElementById("we-topbar-op");
        if (sliderTopBarOp) {
            sliderTopBarOp.oninput = (e) => {
                settings.topBarOpacity = parseInt(e.target.value) / 100;
                document.getElementById("we-topbar-op-val").textContent = e.target.value + "%";
                saveSettings();
            };
        }

        const sliderTopBarBl = document.getElementById("we-topbar-bl");
        if (sliderTopBarBl) {
            sliderTopBarBl.oninput = (e) => {
                settings.topBarBlur = parseInt(e.target.value);
                document.getElementById("we-topbar-bl-val").textContent = e.target.value + "px";
                saveSettings();
            };
        }

        const sliderSidebarOp = document.getElementById("we-sidebar-op");
        if (sliderSidebarOp) {
            sliderSidebarOp.oninput = (e) => {
                settings.sidebarOpacity = parseInt(e.target.value) / 100;
                document.getElementById("we-sidebar-op-val").textContent = e.target.value + "%";
                saveSettings();
            };
        }

        const sliderSidebarBl = document.getElementById("we-sidebar-bl");
        if (sliderSidebarBl) {
            sliderSidebarBl.oninput = (e) => {
                settings.sidebarBlur = parseInt(e.target.value);
                document.getElementById("we-sidebar-bl-val").textContent = e.target.value + "px";
                saveSettings();
            };
        }

        const sliderPlayerOp = document.getElementById("we-player-op");
        if (sliderPlayerOp) {
            sliderPlayerOp.oninput = (e) => {
                settings.playerOpacity = parseInt(e.target.value) / 100;
                document.getElementById("we-player-op-val").textContent = e.target.value + "%";
                saveSettings();
            };
        }

        const searchColorInput = document.getElementById("we-search-color");
        if (searchColorInput) {
            searchColorInput.oninput = (e) => {
                settings.searchBgColor = e.target.value;
                const hexLabel = document.getElementById("we-search-color-hex");
                if (hexLabel) hexLabel.textContent = e.target.value;
                saveSettings();
            };
        }

        document.querySelectorAll("#we-search-presets button").forEach(btn => {
            btn.onclick = () => {
                const col = btn.getAttribute("data-col");
                if (col) {
                    settings.searchBgColor = col;
                    if (searchColorInput) searchColorInput.value = col;
                    const hexLabel = document.getElementById("we-search-color-hex");
                    if (hexLabel) hexLabel.textContent = col;
                    saveSettings();
                }
            };
        });

        const sliderSearchOp = document.getElementById("we-search-op");
        if (sliderSearchOp) {
            sliderSearchOp.oninput = (e) => {
                settings.searchBgOpacity = parseInt(e.target.value) / 100;
                document.getElementById("we-search-op-val").textContent = e.target.value + "%";
                saveSettings();
            };
        }

        const sliderBr = document.getElementById("we-br");
        sliderBr.oninput = (e) => {
            settings.brightness = parseInt(e.target.value);
            document.getElementById("we-br-val").textContent = e.target.value + "%";
            saveSettings();
        };
    }
