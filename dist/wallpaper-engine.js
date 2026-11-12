(function () {
    const THEME_CSS = ":root {\r    --we-bg-opacity: var(--we-bg-opacity, 0.4);\r    --we-sidebar-opacity: var(--we-sidebar-opacity, 0);\r    --we-sidebar-blur: var(--we-sidebar-blur, 0px);\r    --we-player-opacity: var(--we-player-opacity, 0);\r    --we-header-opacity: var(--we-header-opacity, 0.35);\r    --we-header-blur: var(--we-header-blur, 0px);\r    --we-topbar-opacity: var(--we-topbar-opacity, 0);\r    --we-topbar-blur: var(--we-topbar-blur, 0px);\r    --we-search-bg-color: var(--we-search-bg-color, #181818);\r    --we-search-bg-opacity: var(--we-search-bg-opacity, 0.96);\r    --we-img-blur: var(--we-img-blur, 0px);\r    --we-img-brightness: var(--we-img-brightness, 100%);\r    --we-fit-mode: var(--we-fit-mode, cover);\r    --we-pos: var(--we-pos, center);\r    --we-zoom: var(--we-zoom, 100);\r    --background-base: rgba(18, 18, 18, var(--we-bg-opacity));\r    --background-elevated-base: rgba(24, 24, 24, calc(var(--we-bg-opacity) + 0.1)) !important;\r    --background-elevated-highlight: rgba(35, 35, 35, calc(var(--we-bg-opacity) + 0.15)) !important;\r    --background-highlight: rgba(30, 30, 30, calc(var(--we-bg-opacity) + 0.1)) !important;\r    --background-tinted-base: rgba(18, 18, 18, var(--we-bg-opacity));\r    --spice-main: transparent !important;\r    --spice-sidebar: #000000 !important;\r    --spice-player: rgba(12, 12, 12, var(--we-player-opacity)) !important;\r    --spice-card: rgba(255, 255, 255, 0.05) !important;\r}\rhtml,\rbody,\r#main,\r.Root,\r.RootContainer,\r.Root__top-container,\r.Root__main-view,\r.main-view-container,\r.main-view-container__scroll-node,\r.main-view-container__scroll-node-child,\r.os-viewport,\r[data-overlayscrollbars-viewport],\rmain,\rsection,\r.marketplace-header,\r.main-home-content {\r    overflow-x: hidden !important;\r    max-width: 100vw !important;\r}\r*::-webkit-scrollbar:horizontal,\r::-webkit-scrollbar:horizontal,\r*::-webkit-scrollbar-thumb:horizontal,\r::-webkit-scrollbar-thumb:horizontal {\r    display: none !important;\r    width: 0 !important;\r    height: 0 !important;\r    opacity: 0 !important;\r    visibility: hidden !important;\r    pointer-events: none !important;\r    background: transparent !important;\r}\r#we-container {\r    position: fixed !important;\r    inset: 0 !important;\r    width: 100vw !important;\r    height: 100vh !important;\r    z-index: 0 !important;\r    pointer-events: none !important;\r    overflow: hidden !important;\r    background-color: #121212 !important;\r}\r#we-image,\r#we-video {\r    width: 100% !important;\r    height: 100% !important;\r    object-fit: var(--we-fit-mode) !important;\r    object-position: var(--we-pos) !important;\r    position: absolute !important;\r    top: 0 !important;\r    left: 0 !important;\r    filter: blur(var(--we-img-blur)) brightness(var(--we-img-brightness)) !important;\r    transform: scale(calc(var(--we-zoom) / 100)) !important;\r    transform-origin: center center !important;\r    transition: opacity 0.35s ease, filter 0.15s ease, transform 0.15s ease !important;\r}\r.we-media-hidden {\r    display: none !important;\r    opacity: 0 !important;\r    visibility: hidden !important;\r    pointer-events: none !important;\r}\r#we-overlay {\r    position: absolute !important;\r    inset: 0 !important;\r    width: 100% !important;\r    height: 100% !important;\r    background: rgba(0, 0, 0, 0.22) !important;\r    pointer-events: none !important;\r}\rhtml,\rbody,\r#main,\r.Root,\r#main > .Root > div,\r.LiEjwLua6RNBCvlysAT2,\r#main-view,\r.Root__top-container,\r.Root__main-view,\r.main-view-container,\r.main-view-container__scroll-node,\r.main-view-container__scroll-node-child,\r.under-main-view,\r.RootContainer,\r.Root__globalNav,\r.gyQ3lHdZrOLMpQhHd2rw,\r.vuqd37gilTzgRKw2trTT,\r.Dm_tXf4_OMK2m7UbfxgV.i7X8RVjZPy66Kx0dUHIK:before,\r.encore-dark-theme .encore-app-frame-set,\r.encore-dark-theme .encore-muted-accent-set,\rmain,\rsection,\r.main-home-content,\r.bTgBWvuzt0s_dQWLj2OL,\r.Js8eeZY421_5B7PBMMbb,\r[class*=\"Js8eeZY421_5B7PBMMbb\"],\r.kqeAXHJzFfJ_27frg58J,\r[class*=\"kqeAXHJzFfJ_27frg58J\"],\r.YcaaSDZAKPOLI5dw6Knt,\r[class*=\"YcaaSDZAKPOLI5dw6Knt\"],\r.RzqDWBjV5htZanYHtMOj,\r[class*=\"RzqDWBjV5htZanYHtMOj\"],\r.gCzTaHIMnDRaHPeVzrbp,\r[class*=\"gCzTaHIMnDRaHPeVzrbp\"],\r.bokji1jrN2MBe7RA0384,\r[class*=\"bokji1jrN2MBe7RA0384\"],\r[grid-area=\"main-view\"],\r[data-testid=\"main-view\"],\r.main-entityHeader-backgroundColor,\r.main-entityHeader-overlay,\r.main-entityHeader-gradient,\r.main-actionBarBackground-background,\r.kMaYBahSBLOnErF7DLR2,\r[class*=\"kMaYBahSBLOnErF7DLR2\"],\r.IfBZ5VdI_2nwDMl4H6Yh,\r[class*=\"IfBZ5VdI_2nwDMl4H6Yh\"],\r.r8bczAWCEgb9_L0iyIcc,\r[class*=\"r8bczAWCEgb9_L0iyIcc\"],\r.xCEkyVpabf3oVGmFQVej,\r[class*=\"xCEkyVpabf3oVGmFQVej\"],\r.jTuahgNncRCCfJfiJwQi,\r[class*=\"jTuahgNncRCCfJfiJwQi\"],\r.lcKPSRpbeFvTvyLrI36l,\r[class*=\"lcKPSRpbeFvTvyLrI36l\"],\r.jZyXBWWqigs2RWA0z7ed,\r[class*=\"jZyXBWWqigs2RWA0z7ed\"],\r.Yt3NCcQ9MNQ6msx88cPe,\r[class*=\"Yt3NCcQ9MNQ6msx88cPe\"],\r[data-testid=\"home-page\"],\r.main-shelf-shelf,\r.main-trackList-trackListHeader,\r.rl0QlbVbrvgO0fB5Pkua,\r.e-10860-table-header-cell,\r[class*=\"table-header-cell\"] {\r    background: transparent !important;\r    background-color: transparent !important;\r    background-image: none !important;\r    backdrop-filter: none !important;\r    -webkit-backdrop-filter: none !important;\r}\r.kMaYBahSBLOnErF7DLR2,\r[class*=\"kMaYBahSBLOnErF7DLR2\"],\r.IfBZ5VdI_2nwDMl4H6Yh,\r[class*=\"IfBZ5VdI_2nwDMl4H6Yh\"] {\r    display: none !important;\r    opacity: 0 !important;\r}\r.rLb4jRJmAjuDMN1b9Atw,\r[class*=\"rLb4jRJmAjuDMN1b9Atw\"],\r[aria-label=\"global-nav-bar\"],\r#global-nav-bar {\r    background: rgba(18, 18, 18, var(--we-topbar-opacity, 0)) !important;\r    backdrop-filter: blur(var(--we-topbar-blur, 0px)) !important;\r    -webkit-backdrop-filter: blur(var(--we-topbar-blur, 0px)) !important;\r    z-index: 99 !important;\r    transition: opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease !important;\r}\r#global-nav-bar button[aria-label=\"Marketplace\"],\r#global-nav-bar button[aria-label=\"marketplace\"],\r#global-nav-bar [aria-label*=\"Marketplace\"],\r#global-nav-bar [aria-label*=\"marketplace\"],\r.Root__globalNav button[aria-label=\"Marketplace\"],\r.Root__globalNav button[aria-label=\"marketplace\"],\r.Root__globalNav [aria-label*=\"Marketplace\"],\r.Root__globalNav [aria-label*=\"marketplace\"],\r#global-nav-bar .custom-navlink,\r.Root__globalNav .custom-navlink {\r    display: none !important;\r}\r#we-topbar-controls-group {\r    display: inline-flex !important;\r    align-items: center !important;\r    gap: 6px !important;\r    margin-right: 12px !important;\r    margin-left: 8px !important;\r    flex-shrink: 0 !important;\r    z-index: 1000 !important;\r    -webkit-app-region: no-drag !important;\r    pointer-events: auto !important;\r    position: relative !important;\r}\r#we-topbar-pause-btn,\r#we-topbar-source-btn,\r#we-topbar-settings-btn {\r    display: inline-flex !important;\r    align-items: center !important;\r    justify-content: center !important;\r    width: 32px !important;\r    height: 32px !important;\r    min-width: 32px !important;\r    background: rgba(255, 255, 255, 0.08) !important;\r    border: 1px solid rgba(255, 255, 255, 0.12) !important;\r    border-radius: 50% !important;\r    color: #b3b3b3 !important;\r    cursor: pointer !important;\r    margin: 0 !important;\r    padding: 0 !important;\r    transition: all 0.2s ease !important;\r    flex-shrink: 0 !important;\r    vertical-align: middle !important;\r    -webkit-app-region: no-drag !important;\r    pointer-events: auto !important;\r    position: relative !important;\r    z-index: 1001 !important;\r}\r#we-topbar-pause-btn *,\r#we-topbar-source-btn *,\r#we-topbar-settings-btn * {\r    pointer-events: none !important;\r}\r#we-topbar-pause-btn:hover,\r#we-topbar-source-btn:hover,\r#we-topbar-settings-btn:hover {\r    background: rgba(255, 255, 255, 0.2) !important;\r    color: #fff !important;\r    border-color: rgba(255, 255, 255, 0.3) !important;\r    transform: scale(1.08) !important;\r}\r#we-topbar-pause-btn.we-is-paused {\r    background: rgba(234, 179, 8, 0.15) !important;\r    border-color: rgba(234, 179, 8, 0.4) !important;\r    color: #facc15 !important;\r}\r#we-topbar-source-btn.we-is-custom {\r    background: rgba(80, 155, 245, 0.18) !important;\r    border-color: rgba(80, 155, 245, 0.45) !important;\r    color: #509bf5 !important;\r}\r#we-sidebar-marketplace-btn {\r    display: inline-flex !important;\r    align-items: center !important;\r    justify-content: center !important;\r    width: 32px !important;\r    height: 32px !important;\r    min-width: 32px !important;\r    min-height: 32px !important;\r    border-radius: 50% !important;\r    background: transparent !important;\r    border: none !important;\r    color: #b3b3b3 !important;\r    cursor: pointer !important;\r    padding: 0 !important;\r    margin: 0 4px 0 0 !important;\r    transition: color 0.15s ease, background-color 0.15s ease, transform 0.15s ease !important;\r    vertical-align: middle !important;\r    flex-shrink: 0 !important;\r    outline: none !important;\r}\r#we-sidebar-marketplace-btn:hover {\r    color: #ffffff !important;\r    background: rgba(255, 255, 255, 0.12) !important;\r    transform: scale(1.08) !important;\r}\r#we-sidebar-marketplace-btn:active {\r    transform: scale(0.96) !important;\r}\r#we-sidebar-marketplace-btn.we-active {\r    color: #1ed760 !important;\r    background: rgba(30, 215, 96, 0.18) !important;\r}\r#we-sidebar-marketplace-btn svg {\r    width: 16px !important;\r    height: 16px !important;\r    fill: currentColor !important;\r    pointer-events: none !important;\r}\r._ddPhxHdxmpT13IbjTmr,\r[class*=\"_ddPhxHdxmpT13IbjTmr\"],\r.mkLf3oHSpzyF02_8URcp,\r[class*=\"mkLf3oHSpzyF02_8URcp\"],\r.YOYIfKkABUDGQ5vQmg7y,\r[class*=\"YOYIfKkABUDGQ5vQmg7y\"],\r.kflHPd1wGLg8GjJjmpc6,\r[class*=\"kflHPd\"],\r[class*=\"HomeHeader\"],\r[class*=\"home-header\"],\r.main-entityHeader-backgroundColor,\r.main-entityHeader-overlay {\r    opacity: var(--we-header-opacity) !important;\r    backdrop-filter: blur(var(--we-header-blur)) !important;\r    -webkit-backdrop-filter: blur(var(--we-header-blur)) !important;\r    transition: opacity 0.2s ease !important;\r}\r.U9oB67sd8gEL7q96iimU,\r.hCmXvvXW8zs7RN1MPuy8,\r.JicSmsOnmRYwWa_s1EFw,\r[class*=\"U9oB67sd8gEL7q96iimU\"],\r[class*=\"hCmXvvXW8zs7RN1MPuy8\"],\r.main-shelf-title,\r.main-entityHeader-title,\r.main-trackInfo-name,\r.main-trackInfo-artists,\r[data-testid=\"context-item-info-title\"],\r[data-testid=\"context-item-info-artist\"] {\r    -webkit-mask-image: none !important;\r    mask-image: none !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r.main-nowPlayingWidget-nowPlaying,\r.main-trackInfo-container,\r[data-testid=\"now-playing-widget\"] {\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r[data-testid=\"context-item-info-title\"] a,\r[data-testid=\"context-item-info-title\"] span,\r.main-trackInfo-name a,\r.main-trackInfo-name span {\r    color: var(--text-base, #ffffff) !important;\r    opacity: 1 !important;\r}\r[data-testid=\"context-item-info-artist\"] a,\r[data-testid=\"context-item-info-artist\"] span,\r.main-trackInfo-artists a,\r.main-trackInfo-artists span {\r    color: var(--text-subdued, #b3b3b3) !important;\r    opacity: 1 !important;\r}\rsvg,\r[data-encore-id=\"icon\"],\r.main-topBar-container svg,\r.main-nowPlayingBar-container svg,\r.Root__nav-bar svg,\r.Root__right-sidebar svg {\r    opacity: 1 !important;\r    visibility: visible !important;\r}\rbutton:disabled svg,\r[aria-disabled=\"true\"] svg {\r    opacity: 0.45 !important;\r}\r.gknHoFwcFh2WOkAgFZO3,\r.d7X9aolm5TS8_LZJnMlL,\r.ZkAIsM9Tz3jTaPXEtrAO,\r.HAar7rzRpAeBrQTxx8zt,\r.u1Nn8NuqlGfivWHb0MzS,\r._BbSuw7bQ6wM5s49U_SZ {\r    color: #000000 !important;\r}\r:is([class*=\"checkbox-indicator--selected\"], [class*=\"checkbox-indicator--indeterminate\"]):after {\r    background-color: #ffffff !important;\r}\r.cpe7XCQ9Xn2cGKY9mg1y {\r    color: #ffffff !important;\r}\r#search-dropdown,\r[id=\"search-dropdown\"],\r.c4S_V1zrMUEnmhi4Qaps,\r[class*=\"c4S_V1zrMUEnmhi4Qaps\"],\r.irnScW1A4fL00g6ugVVT,\r[class*=\"irnScW1A4fL00g6ugVVT\"],\r.rsWqM7GKHhCUtFP6zaZp,\r[class*=\"rsWqM7GKHhCUtFP6zaZp\"],\r.izeKI97uT3xjkJSjKotg,\rdialog[open],\r[data-testid=\"search-modal\"] {\r    background-color: var(--we-search-bg-color, #181818) !important;\r    background: var(--we-search-bg-color, #181818) !important;\r    opacity: var(--we-search-bg-opacity, 0.96) !important;\r    border: 1px solid rgba(255, 255, 255, 0.14) !important;\r    border-radius: 12px !important;\r    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08) !important;\r    backdrop-filter: blur(30px) !important;\r    -webkit-backdrop-filter: blur(30px) !important;\r    z-index: 9999 !important;\r}\r#search-dropdown *,\r[id=\"search-dropdown\"] *,\r.c4S_V1zrMUEnmhi4Qaps *,\r[class*=\"c4S_V1zrMUEnmhi4Qaps\"] *,\r.rsWqM7GKHhCUtFP6zaZp *,\r[class*=\"rsWqM7GKHhCUtFP6zaZp\"] * {\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r#search-dropdown [role=\"row\"]:hover,\r#search-dropdown li:hover,\r.c4S_V1zrMUEnmhi4Qaps [role=\"row\"]:hover,\r.c4S_V1zrMUEnmhi4Qaps li:hover,\r.rsWqM7GKHhCUtFP6zaZp .aL2PJnD23YU4xMPS_hD_:hover,\r[class*=\"rsWqM7GKHhCUtFP6zaZp\"] [class*=\"aL2PJnD\"]:hover {\r    background-color: rgba(255, 255, 255, 0.08) !important;\r    border-radius: 6px !important;\r}\r._NFePmYV2P6aLGrjLvuR,\r[class*=\"_NFePmYV2P6aLGrjLvuR\"],\r.MI75x8lBMXNep1yyjDEm,\r[class*=\"MI75x8lBMXNep1yyjDEm\"],\r.FWRsAr8oHcFEkQHOl2AX,\r[class*=\"FWRsAr8oHcFEkQHOl2AX\"],\r.GenericModal__overlay,\r[data-encore-id=\"dialogContainer\"] {\r    background-color: rgba(0, 0, 0, 0.72) !important;\r    backdrop-filter: blur(14px) !important;\r    -webkit-backdrop-filter: blur(14px) !important;\r    z-index: 99999 !important;\r}\r.EvmeKyemPmmbdjRZQezw,\r[class*=\"EvmeKyemPmmbdjRZQezw\"],\r.FnUUCAJ79nf4_lZGH0DB,\r[class*=\"FnUUCAJ79nf4_lZGH0DB\"],\r.NtWOkt024WYaueIUALuA,\r[class*=\"NtWOkt024WYaueIUALuA\"],\r.J3AtAGuT6X4todj9_fB3,\r[class*=\"J3AtAGuT6X4todj9_fB3\"],\r.XokIsLUKMjRuJSLJmTwY,\r[class*=\"XokIsLUKMjRuJSLJmTwY\"],\r.gTYd9GSAsWVjfay4zq69,\r[class*=\"gTYd9GSAsWVjfay4zq69\"],\r.oR0RlcQEKv9iw0PEpE2q,\r[class*=\"oR0RlcQEKv9iw0PEpE2q\"],\r.VKV9ocGl5fpJYLxCo_Eu,\r[class*=\"VKV9ocGl5fpJYLxCo_Eu\"],\r.jnrWk1nCBOEUqS_eCccW,\r[class*=\"jnrWk1nCBOEUqS_eCccW\"],\r.GenericModal,\r[role=\"dialog\"]:not(.we-dialog):not([data-testid=\"search-modal\"]),\r[data-encore-id=\"dialog\"],\r.encore-light-theme.EvmeKyemPmmbdjRZQezw,\r.encore-light-theme.FnUUCAJ79nf4_lZGH0DB,\r.zgG9WSeiO4h0v5UlYPDD,\r.lYaHTagyY6ldz_DLumwG,\r.mCh0k19iLfFYE1AGPgd3,\r.eXxMrRVGaPMLQ6dbQwwV,\r.U3QCOD6yUjLq69vfUqRC,\r.Jmay4m5T9oY2ThzaDAMR,\r.ixNu7Kll1pUsSiCYy539,\r.pG0OmoosHeNbG7JmBj5b {\r    --background-base: #181818 !important;\r    --background-elevated-base: #242424 !important;\r    --text-base: #ffffff !important;\r    --text-subdued: #b3b3b3 !important;\r    --essential-base: #ffffff !important;\r    background: #181818 !important;\r    background-color: #181818 !important;\r    color: #ffffff !important;\r    border: 1px solid rgba(255, 255, 255, 0.14) !important;\r    border-radius: 14px !important;\r    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.92), 0 0 0 1px rgba(255, 255, 255, 0.08) !important;\r    backdrop-filter: blur(28px) !important;\r    -webkit-backdrop-filter: blur(28px) !important;\r    box-sizing: border-box !important;\r}\r.EvmeKyemPmmbdjRZQezw *,\r[class*=\"EvmeKyemPmmbdjRZQezw\"] *,\r.FnUUCAJ79nf4_lZGH0DB *,\r[class*=\"FnUUCAJ79nf4_lZGH0DB\"] * {\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r.EvmeKyemPmmbdjRZQezw h1,\r[class*=\"EvmeKyemPmmbdjRZQezw\"] h1,\r.FnUUCAJ79nf4_lZGH0DB h1,\r[class*=\"FnUUCAJ79nf4_lZGH0DB\"] h1 {\r    color: #ffffff !important;\r    font-size: 20px !important;\r    font-weight: 700 !important;\r    letter-spacing: -0.02em !important;\r    margin: 0 0 10px 0 !important;\r}\r.EvmeKyemPmmbdjRZQezw p,\r[class*=\"EvmeKyemPmmbdjRZQezw\"] p,\r.FnUUCAJ79nf4_lZGH0DB p,\r[class*=\"FnUUCAJ79nf4_lZGH0DB\"] p {\r    color: #b3b3b3 !important;\r    font-size: 13.5px !important;\r    line-height: 1.55 !important;\r    margin: 0 0 18px 0 !important;\r}\r._fA4q2hl7XY7z6Sh5pRv,\r[class*=\"_fA4q2hl7XY7z6Sh5pRv\"],\r.KubpT42JTL9IbK8ixLiC button,\r.YBUiYN9k0MC_fAgWUau7 button,\r.EvmeKyemPmmbdjRZQezw button,\r.FnUUCAJ79nf4_lZGH0DB button {\r    background-color: #1ed760 !important;\r    color: #000000 !important;\r    font-weight: 700 !important;\r    font-size: 13.5px !important;\r    border-radius: 500px !important;\r    border: none !important;\r    padding: 10px 28px !important;\r    cursor: pointer !important;\r    display: inline-flex !important;\r    align-items: center !important;\r    justify-content: center !important;\r    box-shadow: 0 4px 14px rgba(30, 215, 96, 0.3) !important;\r    transition: transform 0.15s ease, background-color 0.15s ease !important;\r}\r._fA4q2hl7XY7z6Sh5pRv:hover,\r[class*=\"_fA4q2hl7XY7z6Sh5pRv\"]:hover,\r.KubpT42JTL9IbK8ixLiC button:hover,\r.YBUiYN9k0MC_fAgWUau7 button:hover,\r.EvmeKyemPmmbdjRZQezw button:hover,\r.FnUUCAJ79nf4_lZGH0DB button:hover {\r    background-color: #1fdf64 !important;\r    transform: scale(1.04) !important;\r}\r._fA4q2hl7XY7z6Sh5pRv:active,\r.KubpT42JTL9IbK8ixLiC button:active,\r.YBUiYN9k0MC_fAgWUau7 button:active {\r    transform: scale(0.98) !important;\r}\r.we-offline-dismiss-btn {\r    background: rgba(255, 255, 255, 0.1) !important;\r    color: #ffffff !important;\r    border: 1px solid rgba(255, 255, 255, 0.16) !important;\r    border-radius: 500px !important;\r    padding: 10px 22px !important;\r    font-size: 13px !important;\r    font-weight: 600 !important;\r    cursor: pointer !important;\r    transition: all 0.2s ease !important;\r    margin-right: 10px !important;\r}\r.we-offline-dismiss-btn:hover {\r    background: rgba(255, 255, 255, 0.18) !important;\r    color: #ffffff !important;\r    border-color: rgba(255, 255, 255, 0.28) !important;\r    transform: scale(1.03) !important;\r}\r.we-modal-corner-close {\r    position: absolute !important;\r    top: 14px !important;\r    right: 16px !important;\r    background: transparent !important;\r    border: none !important;\r    color: #888888 !important;\r    font-size: 20px !important;\r    line-height: 1 !important;\r    cursor: pointer !important;\r    padding: 4px 8px !important;\r    border-radius: 50% !important;\r    transition: color 0.15s ease, background-color 0.15s ease !important;\r    box-shadow: none !important;\r}\r.we-modal-corner-close:hover {\r    color: #ffffff !important;\r    background: rgba(255, 255, 255, 0.1) !important;\r    transform: none !important;\r}\r.iokCRJjXyIjWZgavMwbm,\r[class*=\"iokCRJjXyIjWZgavMwbm\"],\r#context-menu,\r[id=\"context-menu\"],\r[data-context-menu],\r[data-testid=\"context-menu\"],\r.main-contextMenu-menu,\rdiv[role=\"menu\"],\rul[role=\"menu\"],\rnav[role=\"menu\"],\r[data-encore-id=\"menu\"],\r[data-encore-id=\"contextMenu\"],\r.tippy-box[data-theme~=\"context-menu\"] {\r    --background-base: #242424 !important;\r    --background-elevated-base: #242424 !important;\r    --background-elevated-highlight: rgba(255, 255, 255, 0.12) !important;\r    --background-elevated-press: rgba(255, 255, 255, 0.18) !important;\r    --spice-card: #242424 !important;\r    background-color: #242424 !important;\r    background: #242424 !important;\r    border: 1px solid rgba(255, 255, 255, 0.12) !important;\r    border-radius: 8px !important;\r    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08) !important;\r    backdrop-filter: blur(24px) !important;\r    -webkit-backdrop-filter: blur(24px) !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    z-index: 9999 !important;\r}\r[role=\"tooltip\"],\r[data-encore-id=\"tooltip\"],\r[data-encore-id=\"popover\"],\r[data-encore-id=\"snackbar\"],\r[data-tippy-root]>.tippy-box,\r[data-tippy-root] .tippy-content,\r[data-tippy-root] .encore-light-theme,\r[data-tippy-root] .encore-inverted-light-set,\r[role=\"tooltip\"] .encore-light-theme,\r[role=\"tooltip\"] .encore-inverted-light-set,\r[data-encore-id=\"popover\"] .encore-light-theme,\r[data-encore-id=\"popover\"] .encore-inverted-light-set,\r.tippy-box[data-theme~=\"popover\"],\r.tippy-box[data-theme~=\"activation\"],\r.notistack-MuiContent,\r[class*=\"notistack-MuiContent\"],\r.notistack-Snackbar .encore-light-theme,\r.notistack-SnackbarContainer .encore-light-theme,\r.W1vSh9LnwRGIJBODcwJ3,\r.encore-light-theme.W1vSh9LnwRGIJBODcwJ3,\r.main-notificationBubble-NotificationBubble,\r[class*=\"notificationBubble\"] {\r    --background-base: #242424 !important;\r    --background-elevated-base: #242424 !important;\r    --text-base: #ffffff !important;\r    --text-subdued: #d1d1d1 !important;\r    --essential-base: #ffffff !important;\r    --parents-essential-base: #ffffff !important;\r    background-color: #242424 !important;\r    background: #242424 !important;\r    color: #ffffff !important;\r    border: 1px solid rgba(255, 255, 255, 0.14) !important;\r    border-radius: 8px !important;\r    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.12) !important;\r    backdrop-filter: blur(20px) !important;\r    -webkit-backdrop-filter: blur(20px) !important;\r}\r[role=\"tooltip\"] *,\r[data-encore-id=\"tooltip\"] *,\r[data-encore-id=\"popover\"] *,\r[data-encore-id=\"snackbar\"] *,\r[data-tippy-root]>.tippy-box *,\r.notistack-Snackbar *,\r.notistack-MuiContent *,\r#notistack-snackbar,\r#notistack-snackbar *,\r.W1vSh9LnwRGIJBODcwJ3 *,\r.main-notificationBubble-NotificationBubble * {\r    color: #ffffff !important;\r    --text-base: #ffffff !important;\r    --essential-base: #ffffff !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r[data-tippy-root][aria-hidden=\"true\"],\r.tippy-box[data-state=\"hidden\"],\r[role=\"tooltip\"][aria-hidden=\"true\"],\r[data-encore-id=\"popover\"][aria-hidden=\"true\"] {\r    opacity: 0 !important;\r    visibility: hidden !important;\r    pointer-events: none !important;\r}\r.iokCRJjXyIjWZgavMwbm *,\r[class*=\"iokCRJjXyIjWZgavMwbm\"] *,\r#context-menu *,\r[id=\"context-menu\"] *,\r[data-context-menu] *,\r[data-testid=\"context-menu\"] *,\r.main-contextMenu-menu *,\r[role=\"menu\"] *,\r[data-tippy-root]>.tippy-box * {\r    -webkit-mask-image: none !important;\r    mask-image: none !important;\r}\r.iokCRJjXyIjWZgavMwbm [role=\"menuitem\"],\r.iokCRJjXyIjWZgavMwbm button,\r#context-menu [role=\"menuitem\"],\r#context-menu button,\r.main-contextMenu-menu [role=\"menuitem\"],\r[role=\"menu\"] [role=\"menuitem\"],\r[role=\"menu\"] button {\r    color: #ffffff !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r.iokCRJjXyIjWZgavMwbm [role=\"menuitem\"]:hover,\r.iokCRJjXyIjWZgavMwbm button:hover,\r#context-menu [role=\"menuitem\"]:hover,\r#context-menu button:hover,\r.main-contextMenu-menu [role=\"menuitem\"]:hover,\r[role=\"menu\"] [role=\"menuitem\"]:hover,\r[role=\"menu\"] button:hover,\r[role=\"menu\"] li:hover {\r    background-color: rgba(255, 255, 255, 0.1) !important;\r    border-radius: 6px !important;\r}\r.iokCRJjXyIjWZgavMwbm p,\r.iokCRJjXyIjWZgavMwbm span:not([data-encore-id=\"icon\"]):not(button *),\r#context-menu p,\r[role=\"menu\"] p {\r    color: #b3b3b3 !important;\r    opacity: 1 !important;\r}\r[data-encore-id=\"chip\"][aria-selected=\"true\"],\r[data-encore-id=\"chip\"][aria-checked=\"true\"],\r[data-encore-id=\"chip\"].encore-inverted-light-set,\rbutton.encore-inverted-light-set,\rbutton .encore-inverted-light-set,\ra.encore-inverted-light-set,\ra .encore-inverted-light-set,\r.encore-dark-theme .encore-inverted-light-set,\r.encore-dark-theme .encore-inverted-set,\r.encore-dark-theme .encore-bright-accent-set,\r.encore-dark-theme .encore-positive-set,\r.encore-dark-theme .encore-warning-set,\r.encore-light-theme .encore-inverted-light-set,\r.encore-light-theme .encore-bright-accent-set,\r.encore-light-theme .encore-positive-set,\r.encore-light-theme .encore-warning-set,\r.Eg294RhMGE2iv6YOIHd8,\rbutton[aria-checked=\"true\"][class*=\"chip\"],\rbutton[aria-selected=\"true\"][class*=\"chip\"],\r.e-10860-chip[aria-checked=\"true\"],\r.e-10860-chip[aria-selected=\"true\"],\r.e-10860-legacy-chip--selected,\r.e-10860-legacy-chip__inner--selected,\r.o9cVZ8KdDdXGhGS2t2p4 [aria-selected=\"true\"],\r.o9cVZ8KdDdXGhGS2t2p4 [aria-checked=\"true\"],\r.o9cVZ8KdDdXGhGS2t2p4 button:first-child[aria-selected=\"true\"] {\r    --text-base: #000000 !important;\r    --text-subdued: #383838 !important;\r    --essential-base: #000000 !important;\r    --decorative-base: #000000 !important;\r    --parents-essential-base: #000000 !important;\r    color: #000000 !important;\r}\r[data-encore-id=\"chip\"][aria-selected=\"true\"] *,\r[data-encore-id=\"chip\"][aria-checked=\"true\"] *,\r[data-encore-id=\"chip\"].encore-inverted-light-set *,\rbutton.encore-inverted-light-set *,\rbutton .encore-inverted-light-set *,\ra.encore-inverted-light-set *,\ra .encore-inverted-light-set *,\r.encore-dark-theme .encore-inverted-light-set *,\r.encore-dark-theme .encore-inverted-set *,\r.encore-dark-theme .encore-bright-accent-set *,\r.encore-dark-theme .encore-positive-set *,\r.encore-dark-theme .encore-warning-set *,\r.encore-light-theme .encore-inverted-light-set *,\r.encore-light-theme .encore-bright-accent-set *,\r.encore-light-theme .encore-positive-set *,\r.encore-light-theme .encore-warning-set *,\r.Eg294RhMGE2iv6YOIHd8 *,\rbutton[aria-checked=\"true\"][class*=\"chip\"] *,\rbutton[aria-selected=\"true\"][class*=\"chip\"] *,\r.e-10860-chip[aria-checked=\"true\"] *,\r.e-10860-chip[aria-selected=\"true\"] *,\r.e-10860-legacy-chip--selected *,\r.e-10860-legacy-chip__inner--selected *,\r.o9cVZ8KdDdXGhGS2t2p4 [aria-selected=\"true\"] *,\r.o9cVZ8KdDdXGhGS2t2p4 [aria-checked=\"true\"] * {\r    color: #000000 !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r.Root__right-sidebar,\raside#Desktop_PanelContainer_Id,\raside._PCtpBj8KAibsMRyofjJ,\raside.main-buddyFeed-container,\r[grid-area=\"right-sidebar\"],\r[data-testid=\"now-playing-widget\"],\r[data-testid=\"now-playing-view\"] {\r    --text-base: #ffffff !important;\r    --text-subdued: #d1d1d1 !important;\r    --essential-base: #ffffff !important;\r}\r.Root__right-sidebar *,\raside#Desktop_PanelContainer_Id *,\raside._PCtpBj8KAibsMRyofjJ *,\raside.main-buddyFeed-container *,\r[grid-area=\"right-sidebar\"] *,\r[data-testid=\"now-playing-view\"] * {\r    -webkit-mask-image: none !important;\r    mask-image: none !important;\r}\raside .WU7dTdoNA51czqGivj8T,\r[grid-area=\"right-sidebar\"] .WU7dTdoNA51czqGivj8T {\r    position: sticky !important;\r    top: 0 !important;\r    z-index: 10 !important;\r    padding-inline: 16px !important;\r    background: transparent !important;\r}\raside .cciGXIL4H2kwy1SlhFHO,\r[grid-area=\"right-sidebar\"] .cciGXIL4H2kwy1SlhFHO {\r    display: flex !important;\r    flex-direction: row !important;\r    align-items: center !important;\r    justify-content: space-between !important;\r    gap: 12px !important;\r    height: 64px !important;\r    padding: 0 !important;\r    width: 100% !important;\r}\raside .YhwuATKkQlzoZCmTVzln,\r[grid-area=\"right-sidebar\"] .YhwuATKkQlzoZCmTVzln {\r    transform: none !important;\r    margin-inline-start: 0 !important;\r}\raside .VbB3qUTRgDiJahFnkGKZ,\r[grid-area=\"right-sidebar\"] .VbB3qUTRgDiJahFnkGKZ {\r    opacity: 1 !important;\r    visibility: visible !important;\r    flex-shrink: 0 !important;\r    color: #ffffff !important;\r}\raside .VGs80tqm_c_ySQSKajjJ,\r[grid-area=\"right-sidebar\"] .VGs80tqm_c_ySQSKajjJ {\r    flex: 1 1 auto !important;\r    min-width: 0 !important;\r    overflow: hidden !important;\r}\raside .VGs80tqm_c_ySQSKajjJ h1,\raside .VGs80tqm_c_ySQSKajjJ a,\raside .VGs80tqm_c_ySQSKajjJ span,\r[grid-area=\"right-sidebar\"] .VGs80tqm_c_ySQSKajjJ h1,\r[grid-area=\"right-sidebar\"] .VGs80tqm_c_ySQSKajjJ a,\r[grid-area=\"right-sidebar\"] .VGs80tqm_c_ySQSKajjJ span,\raside header h1,\raside header h2,\r[data-testid=\"panel-header\"] a,\r[data-testid=\"panel-header\"] span,\r[data-testid=\"panel-header\"] h1,\r[data-testid=\"panel-header\"] h2 {\r    color: #ffffff !important;\r    font-size: 1rem !important;\r    font-weight: 700 !important;\r    white-space: nowrap !important;\r    overflow: hidden !important;\r    text-overflow: ellipsis !important;\r    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8) !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    display: block !important;\r}\raside .YCPThfr7qRs0GWRULLMO,\raside .FPixZ7lIQyDOBbfN7u4e,\r[grid-area=\"right-sidebar\"] .YCPThfr7qRs0GWRULLMO,\r[grid-area=\"right-sidebar\"] .FPixZ7lIQyDOBbfN7u4e {\r    display: flex !important;\r    align-items: center !important;\r    gap: 8px !important;\r    margin-left: auto !important;\r    flex-shrink: 0 !important;\r}\raside .YCPThfr7qRs0GWRULLMO button,\raside .FPixZ7lIQyDOBbfN7u4e button,\r[grid-area=\"right-sidebar\"] .YCPThfr7qRs0GWRULLMO button,\r[grid-area=\"right-sidebar\"] .FPixZ7lIQyDOBbfN7u4e button {\r    color: #ffffff !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r}\raside .f8pB2G3XUFXNNPQ_Ppxb,\r[grid-area=\"right-sidebar\"] .f8pB2G3XUFXNNPQ_Ppxb {\r    display: flex !important;\r    align-items: center !important;\r    justify-content: space-between !important;\r    gap: 12px !important;\r    width: 100% !important;\r    padding: 10px 16px !important;\r    min-height: 64px !important;\r    box-sizing: border-box !important;\r    position: relative !important;\r}\raside .f8pB2G3XUFXNNPQ_Ppxb:before,\r[grid-area=\"right-sidebar\"] .f8pB2G3XUFXNNPQ_Ppxb:before {\r    opacity: 0.5 !important;\r}\raside .ythX3GWFZONFG4g1e0o9,\r[grid-area=\"right-sidebar\"] .ythX3GWFZONFG4g1e0o9 {\r    flex: 1 1 auto !important;\r    min-width: 0 !important;\r    overflow: hidden !important;\r    display: block !important;\r}\raside .bYH9fSPiWiXHLnKLf4cn,\r[grid-area=\"right-sidebar\"] .bYH9fSPiWiXHLnKLf4cn {\r    display: grid !important;\r    min-width: 0 !important;\r    width: 100% !important;\r}\raside .UxJZcpiOpOv5I0B1Tjdw,\r[grid-area=\"right-sidebar\"] .UxJZcpiOpOv5I0B1Tjdw,\raside [grid-area=\"title\"],\r[grid-area=\"right-sidebar\"] [grid-area=\"title\"] {\r    display: block !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    width: 100% !important;\r    min-width: 0 !important;\r    overflow: hidden !important;\r}\raside .UxJZcpiOpOv5I0B1Tjdw a,\raside .UxJZcpiOpOv5I0B1Tjdw span,\raside .d3zdrpIND1kwUkLadc04,\raside .d3zdrpIND1kwUkLadc04 a,\raside .d3zdrpIND1kwUkLadc04 span,\r[grid-area=\"right-sidebar\"] .UxJZcpiOpOv5I0B1Tjdw a,\r[grid-area=\"right-sidebar\"] .UxJZcpiOpOv5I0B1Tjdw span,\r[grid-area=\"right-sidebar\"] .d3zdrpIND1kwUkLadc04,\r[grid-area=\"right-sidebar\"] .d3zdrpIND1kwUkLadc04 a,\r[grid-area=\"right-sidebar\"] .d3zdrpIND1kwUkLadc04 span,\raside [data-testid*=\"track-name\"],\raside [data-testid*=\"title\"],\raside [data-testid=\"context-item-info-title\"],\raside [data-testid=\"context-item-info-title\"] a,\raside [data-testid=\"context-item-info-title\"] span,\raside [data-testid=\"track-info-name\"],\raside [data-testid=\"track-info-name\"] a,\raside [data-testid=\"track-info-name\"] span,\r.Root__right-sidebar [data-testid=\"context-item-info-title\"],\r.Root__right-sidebar [data-testid=\"context-item-info-title\"] a,\r.Root__right-sidebar [data-testid=\"context-item-info-title\"] span,\r.Root__right-sidebar [data-testid=\"track-info-name\"],\r.Root__right-sidebar [data-testid=\"track-info-name\"] a,\r.Root__right-sidebar [data-testid=\"track-info-name\"] span {\r    color: #ffffff !important;\r    font-size: 1.5rem !important;\r    font-weight: 700 !important;\r    line-height: 1.25 !important;\r    white-space: nowrap !important;\r    overflow: hidden !important;\r    text-overflow: ellipsis !important;\r    display: block !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8) !important;\r}\raside .yPuQIWyOhCzYrdC7hhfw,\r[grid-area=\"right-sidebar\"] .yPuQIWyOhCzYrdC7hhfw,\raside [grid-area*=\"subtitle\"],\r[grid-area=\"right-sidebar\"] [grid-area*=\"subtitle\"] {\r    display: flex !important;\r    align-items: baseline !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    min-width: 0 !important;\r    width: 100% !important;\r    margin-top: 4px !important;\r}\raside .yPuQIWyOhCzYrdC7hhfw a,\raside .yPuQIWyOhCzYrdC7hhfw span,\r[grid-area=\"right-sidebar\"] .yPuQIWyOhCzYrdC7hhfw a,\r[grid-area=\"right-sidebar\"] .yPuQIWyOhCzYrdC7hhfw span,\raside [data-testid*=\"artist\"],\raside [data-testid=\"context-item-info-artist\"],\raside [data-testid=\"context-item-info-artist\"] a,\raside [data-testid=\"context-item-info-artist\"] span,\raside [data-testid=\"track-info-artists\"],\raside [data-testid=\"track-info-artists\"] a,\raside [data-testid=\"track-info-artists\"] span,\r.Root__right-sidebar [data-testid=\"context-item-info-artist\"],\r.Root__right-sidebar [data-testid=\"context-item-info-artist\"] a,\r.Root__right-sidebar [data-testid=\"context-item-info-artist\"] span,\r.Root__right-sidebar [data-testid=\"track-info-artists\"],\r.Root__right-sidebar [data-testid=\"track-info-artists\"] a,\r.Root__right-sidebar [data-testid=\"track-info-artists\"] span {\r    color: #d1d1d1 !important;\r    font-size: 0.9375rem !important;\r    font-weight: 400 !important;\r    white-space: nowrap !important;\r    overflow: hidden !important;\r    text-overflow: ellipsis !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7) !important;\r}\raside .yPuQIWyOhCzYrdC7hhfw a:hover,\r[grid-area=\"right-sidebar\"] .yPuQIWyOhCzYrdC7hhfw a:hover {\r    color: #ffffff !important;\r    text-decoration: underline !important;\r}\raside .wlaBAYQk3K1M_lNqOKNw,\r[grid-area=\"right-sidebar\"] .wlaBAYQk3K1M_lNqOKNw,\raside .da733NgUMo3KFbRwTBHD,\r[grid-area=\"right-sidebar\"] .da733NgUMo3KFbRwTBHD {\r    display: flex !important;\r    align-items: center !important;\r    gap: 8px !important;\r    flex-shrink: 0 !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    width: auto !important;\r}\raside .wlaBAYQk3K1M_lNqOKNw button,\raside .da733NgUMo3KFbRwTBHD button,\r[grid-area=\"right-sidebar\"] .wlaBAYQk3K1M_lNqOKNw button,\r[grid-area=\"right-sidebar\"] .da733NgUMo3KFbRwTBHD button {\r    opacity: 1 !important;\r    visibility: visible !important;\r    color: #ffffff !important;\r}\r[data-encore-id=\"buttonPrimary\"],\r[data-testid*=\"play-button\"],\r.main-playButton-PlayButton {\r    background-color: #1ed760 !important;\r    color: #000000 !important;\r    --text-base: #000000 !important;\r}\r[data-encore-id=\"buttonPrimary\"]:has(.encore-inverted-light-set) {\r    background-color: transparent !important;\r    background: transparent !important;\r}\r[data-encore-id=\"buttonPrimary\"] *,\r[data-testid*=\"play-button\"] *,\r.main-playButton-PlayButton * {\r    color: #000000 !important;\r    --text-base: #000000 !important;\r}\r[data-encore-id=\"buttonPrimary\"] svg,\r[data-testid*=\"play-button\"] svg,\r.main-playButton-PlayButton svg {\r    fill: #000000 !important;\r    color: #000000 !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r[data-encore-id=\"buttonPrimary\"] svg path,\r[data-testid*=\"play-button\"] svg path,\r.main-playButton-PlayButton svg path {\r    fill: #000000 !important;\r    opacity: 1 !important;\r}\r.CcRlyOo0u4fhd31I7iZq,\r[class*=\"CcRlyOo0u4fhd31I7iZq\"],\r.view-homeShortcutsGrid-shortcut,\r[data-testid=\"shortcut-item\"] {\r    background: rgba(255, 255, 255, 0.08) !important;\r    background-color: rgba(255, 255, 255, 0.08) !important;\r    backdrop-filter: blur(10px) !important;\r    -webkit-backdrop-filter: blur(10px) !important;\r    border: 1px solid rgba(255, 255, 255, 0.08) !important;\r    border-radius: 6px !important;\r    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1) !important;\r}\r.CcRlyOo0u4fhd31I7iZq:hover,\r[class*=\"CcRlyOo0u4fhd31I7iZq\"]:hover,\r.view-homeShortcutsGrid-shortcut:hover,\r[data-testid=\"shortcut-item\"]:hover {\r    background: rgba(255, 255, 255, 0.16) !important;\r    background-color: rgba(255, 255, 255, 0.16) !important;\r    transform: translateY(-2px) !important;\r    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3) !important;\r}\r.CcRlyOo0u4fhd31I7iZq .pzmmqs_lMNAyiEsU3F8h,\r.CcRlyOo0u4fhd31I7iZq .F1CQ1Rh99zSbmmsaGuHT,\r.CcRlyOo0u4fhd31I7iZq .lfN014YqRpGe58bBgAGo,\r.CcRlyOo0u4fhd31I7iZq [data-encore-id=\"buttonPrimary\"],\r[class*=\"CcRlyOo0u4fhd31I7iZq\"] .pzmmqs_lMNAyiEsU3F8h,\r[class*=\"CcRlyOo0u4fhd31I7iZq\"] .F1CQ1Rh99zSbmmsaGuHT,\r[class*=\"CcRlyOo0u4fhd31I7iZq\"] .lfN014YqRpGe58bBgAGo,\r[class*=\"CcRlyOo0u4fhd31I7iZq\"] [data-encore-id=\"buttonPrimary\"],\r[data-testid=\"shortcut-item\"] [data-encore-id=\"buttonPrimary\"],\r[data-testid=\"shortcut-item\"] [data-testid*=\"play-button\"],\r[data-testid=\"shortcut-item\"] [class*=\"PlayButton\"],\r[data-testid=\"shortcut-item\"] [class*=\"playButton\"],\r.view-homeShortcutsGrid-shortcut [data-encore-id=\"buttonPrimary\"],\r.view-homeShortcutsGrid-shortcut [data-testid*=\"play-button\"],\r.view-homeShortcutsGrid-shortcut [class*=\"PlayButton\"],\r.view-homeShortcutsGrid-shortcut [class*=\"playButton\"],\r[class*=\"shortcut\"] [data-encore-id=\"buttonPrimary\"],\r[class*=\"shortcut\"] [data-testid*=\"play-button\"],\r[class*=\"Shortcut\"] [data-encore-id=\"buttonPrimary\"],\r.main-card-card .main-card-PlayButtonContainer,\r.main-card-card .main-card-PlayButtonContainer button,\r.main-card-card [data-encore-id=\"buttonPrimary\"],\r.main-card-card [data-testid*=\"play-button\"],\r[data-testid=\"card-click-handler\"] [data-encore-id=\"buttonPrimary\"],\r[data-testid=\"card-click-handler\"] [data-testid*=\"play-button\"],\r[class*=\"PlayButtonContainer\"] [data-encore-id=\"buttonPrimary\"],\r[class*=\"PlayButtonContainer\"] button,\r[class*=\"playButtonContainer\"] button {\r    opacity: 0 !important;\r    visibility: hidden !important;\r    pointer-events: none !important;\r    transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1), transform 0.2s cubic-bezier(0.2, 0, 0, 1) !important;\r    transform: translateY(4px) scale(0.9) !important;\r}\r.CcRlyOo0u4fhd31I7iZq:hover .pzmmqs_lMNAyiEsU3F8h,\r.CcRlyOo0u4fhd31I7iZq:hover .F1CQ1Rh99zSbmmsaGuHT,\r.CcRlyOo0u4fhd31I7iZq:hover .lfN014YqRpGe58bBgAGo,\r.CcRlyOo0u4fhd31I7iZq:hover [data-encore-id=\"buttonPrimary\"],\r[class*=\"CcRlyOo0u4fhd31I7iZq\"]:hover .pzmmqs_lMNAyiEsU3F8h,\r[class*=\"CcRlyOo0u4fhd31I7iZq\"]:hover .F1CQ1Rh99zSbmmsaGuHT,\r[class*=\"CcRlyOo0u4fhd31I7iZq\"]:hover .lfN014YqRpGe58bBgAGo,\r[class*=\"CcRlyOo0u4fhd31I7iZq\"]:hover [data-encore-id=\"buttonPrimary\"],\r[data-testid=\"shortcut-item\"]:hover [data-encore-id=\"buttonPrimary\"],\r[data-testid=\"shortcut-item\"]:hover [data-testid*=\"play-button\"],\r[data-testid=\"shortcut-item\"]:hover [class*=\"PlayButton\"],\r[data-testid=\"shortcut-item\"]:hover [class*=\"playButton\"],\r.view-homeShortcutsGrid-shortcut:hover [data-encore-id=\"buttonPrimary\"],\r.view-homeShortcutsGrid-shortcut:hover [data-testid*=\"play-button\"],\r.view-homeShortcutsGrid-shortcut:hover [class*=\"PlayButton\"],\r.view-homeShortcutsGrid-shortcut:hover [class*=\"playButton\"],\r[class*=\"shortcut\"]:hover [data-encore-id=\"buttonPrimary\"],\r[class*=\"shortcut\"]:hover [data-testid*=\"play-button\"],\r[class*=\"Shortcut\"]:hover [data-encore-id=\"buttonPrimary\"],\r.main-card-card:hover .main-card-PlayButtonContainer,\r.main-card-card:hover .main-card-PlayButtonContainer button,\r.main-card-card:hover [data-encore-id=\"buttonPrimary\"],\r.main-card-card:hover [data-testid*=\"play-button\"],\r[data-testid=\"card-click-handler\"]:hover [data-encore-id=\"buttonPrimary\"],\r[data-testid=\"card-click-handler\"]:hover [data-testid*=\"play-button\"],\r[class*=\"PlayButtonContainer\"]:hover [data-encore-id=\"buttonPrimary\"],\r[class*=\"PlayButtonContainer\"]:hover button,\r[class*=\"playButtonContainer\"]:hover button {\r    opacity: 1 !important;\r    visibility: visible !important;\r    pointer-events: auto !important;\r    transform: translateY(0) scale(1) !important;\r}\r.OsDLl_EbSaDJzGA6kqjL .GtL6v5f4OhSsTWIFTm5j,\r.GtL6v5f4OhSsTWIFTm5j,\r[class*=\"GtL6v5f4OhSsTWIFTm5j\"],\r.Kycla0k6aBuyHNByTQ5o,\r[class*=\"Kycla0k6aBuyHNByTQ5o\"],\r.Y9plb9njHKs43f4rlAVp,\r[class*=\"Y9plb9njHKs43f4rlAVp\"],\r.BN47g2Kc5QfLWhsUCe8N,\r.JicSmsOnmRYwWa_s1EFw,\r[data-testid=\"lyrics-npv-section\"],\r[data-testid=\"lyrics-npv-section\"] *,\r[data-testid=\"lyrics-fullscreen-container\"],\r[data-testid=\"lyrics-fullscreen-container\"] * {\r    -webkit-mask-image: none !important;\r    mask-image: none !important;\r    mask: none !important;\r    -webkit-mask: none !important;\r}\r[data-testid=\"lyrics-npv-section\"] p,\r[data-testid=\"lyrics-npv-section\"] h2,\r[data-testid=\"lyrics-npv-section\"] span:not(button *):not([class*=\"Button\"]),\r.GtL6v5f4OhSsTWIFTm5j p,\r.GtL6v5f4OhSsTWIFTm5j h2,\r.GtL6v5f4OhSsTWIFTm5j span:not(button *):not([class*=\"Button\"]) {\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r[data-testid=\"lyrics-npv-section\"] button,\r.GtL6v5f4OhSsTWIFTm5j button {\r    opacity: 0 !important;\r    visibility: hidden !important;\r    pointer-events: none !important;\r    transition: opacity 0.2s ease !important;\r}\r[data-testid=\"lyrics-npv-section\"]:hover button,\r.GtL6v5f4OhSsTWIFTm5j:hover button {\r    opacity: 1 !important;\r    visibility: visible !important;\r    pointer-events: auto !important;\r}\r[data-testid=\"lyrics-npv-section\"] button,\r[data-testid=\"lyrics-npv-section\"] button * {\r    color: #000000 !important;\r    --text-base: #000000 !important;\r}\r.main-card-card {\r    background-color: rgba(255, 255, 255, 0.04) !important;\r    transition: background-color 0.2s ease !important;\r}\r.main-card-card:hover {\r    background-color: rgba(255, 255, 255, 0.1) !important;\r}\r#Desktop_LeftSidebar_Id,\r.yQCyOSVcMCen_NJKPHB6,\r.sKQBt_niqUrjEllLDApe,\r.bQsutxbyIOatthweRHfK,\r[class*=\"bQsutxbyIOatthweRHfK\"],\r.jpHQLr33ZT5pJGBVFmjJ,\r[class*=\"jpHQLr33ZT5pJGBVFmjJ\"],\r.pYAcF6iYbY9AXoobvgmd,\r.wS8WRtgpp8hCpDALPMTR,\r[class*=\"wS8WRtgpp8hCpDALPMTR\"],\r[grid-area=\"left-sidebar\"],\r.Root__nav-bar {\r    --background-base: rgba(18, 18, 18, var(--we-sidebar-opacity, 0)) !important;\r    background-color: rgba(18, 18, 18, var(--we-sidebar-opacity, 0)) !important;\r    background: rgba(18, 18, 18, var(--we-sidebar-opacity, 0)) !important;\r    background-image: none !important;\r    border-radius: 8px !important;\r    backdrop-filter: blur(var(--we-sidebar-blur, 0px)) !important;\r    -webkit-backdrop-filter: blur(var(--we-sidebar-blur, 0px)) !important;\r}\r#Desktop_LeftSidebar_Id nav,\r#Desktop_LeftSidebar_Id [data-testid=\"your-library-x\"],\r#Desktop_LeftSidebar_Id .main-yourLibraryX-entryPoints,\r#Desktop_LeftSidebar_Id .main-yourLibraryX-navItems,\r#Desktop_LeftSidebar_Id .main-yourLibraryX-libraryRoot,\r#Desktop_LeftSidebar_Id .main-yourLibraryX-libraryContainer,\r#Desktop_LeftSidebar_Id .main-yourLibraryX-library,\r#Desktop_LeftSidebar_Id .main-yourLibraryX-scrollNode,\r#Desktop_LeftSidebar_Id .main-yourLibraryX-header,\r#Desktop_LeftSidebar_Id [class*=\"yourLibraryX\"],\r.wS8WRtgpp8hCpDALPMTR>div,\r[grid-area=\"left-sidebar\"] nav,\r[grid-area=\"left-sidebar\"] [data-testid=\"your-library-x\"],\r[grid-area=\"left-sidebar\"] .main-yourLibraryX-libraryContainer,\r[grid-area=\"left-sidebar\"] .main-yourLibraryX-library,\r[grid-area=\"left-sidebar\"] .main-yourLibraryX-scrollNode,\r[grid-area=\"left-sidebar\"] .main-yourLibraryX-header {\r    background: transparent !important;\r    background-color: transparent !important;\r    background-image: none !important;\r    backdrop-filter: none !important;\r    -webkit-backdrop-filter: none !important;\r}\raside.main-buddyFeed-container,\raside#Desktop_PanelContainer_Id,\raside._PCtpBj8KAibsMRyofjJ,\r[grid-area=\"right-sidebar\"],\r.Root__right-sidebar {\r    --background-base: rgba(18, 18, 18, var(--we-sidebar-opacity, 0.75)) !important;\r    background-color: rgba(18, 18, 18, var(--we-sidebar-opacity, 0.75)) !important;\r    background: rgba(18, 18, 18, var(--we-sidebar-opacity, 0.75)) !important;\r    background-image: none !important;\r    border-radius: 8px !important;\r    backdrop-filter: blur(var(--we-sidebar-blur, 15px)) !important;\r    -webkit-backdrop-filter: blur(var(--we-sidebar-blur, 15px)) !important;\r}\raside#Desktop_PanelContainer_Id>div,\r[grid-area=\"right-sidebar\"] .HEks3dIohQeqX5OWB2hO,\r[grid-area=\"right-sidebar\"] .z5LlcLjY7QXNKAKlui7E,\r[grid-area=\"right-sidebar\"] .tupiSNNoKG_TT60g3TFL {\r    background: transparent !important;\r    background-color: transparent !important;\r    backdrop-filter: none !important;\r    -webkit-backdrop-filter: none !important;\r}\r#Desktop_LeftSidebar_Id *,\r.bQsutxbyIOatthweRHfK *,\r.jpHQLr33ZT5pJGBVFmjJ *,\r.wS8WRtgpp8hCpDALPMTR *,\r.Root__nav-bar *,\r[data-testid=\"your-library-x\"] * {\r    -webkit-mask-image: none !important;\r    mask-image: none !important;\r}\r.Root__nav-bar svg:not([role=\"search\"] .CJ6qUy8V0xcpm2BAXmsI *),\r.Root__nav-bar [data-encore-id=\"icon\"],\r.Root__nav-bar [data-encore-id=\"chip\"],\r.Root__nav-bar button:not(.JfvAd_noA1Ap88JWjSXb),\r.Root__nav-bar p,\r.Root__nav-bar span:not([role=\"search\"] *),\r.Root__nav-bar a,\r.Root__nav-bar img,\r[data-testid=\"your-library-x\"] svg:not([role=\"search\"] .CJ6qUy8V0xcpm2BAXmsI *),\r[data-testid=\"your-library-x\"] [data-encore-id=\"icon\"],\r[data-testid=\"your-library-x\"] [data-encore-id=\"chip\"],\r[data-testid=\"your-library-x\"] p,\r[data-testid=\"your-library-x\"] span:not([role=\"search\"] *),\r[data-testid=\"your-library-x\"] a,\r[data-testid=\"your-library-x\"] button:not(.JfvAd_noA1Ap88JWjSXb),\r[data-testid=\"your-library-x\"] img {\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r[role=\"search\"] input[role=\"searchbox\"],\r.VLEMHA84xhh14jNJs1xQ:not(.FPcKeuKmKv0ViAZdaAkL) input,\r.VLEMHA84xhh14jNJs1xQ:not(.FPcKeuKmKv0ViAZdaAkL) .ojTYAIsRQtFIMsaigH6a,\r.VLEMHA84xhh14jNJs1xQ:not(.FPcKeuKmKv0ViAZdaAkL) .CJ6qUy8V0xcpm2BAXmsI,\r.VLEMHA84xhh14jNJs1xQ:not(.FPcKeuKmKv0ViAZdaAkL) .CJ6qUy8V0xcpm2BAXmsI *,\r.VLEMHA84xhh14jNJs1xQ:not(.FPcKeuKmKv0ViAZdaAkL) .BhZkB0gqPWkL7muCrc74,\r.VLEMHA84xhh14jNJs1xQ:not(.FPcKeuKmKv0ViAZdaAkL) .BhZkB0gqPWkL7muCrc74 * {\r    opacity: 0 !important;\r    visibility: hidden !important;\r    pointer-events: none !important;\r    width: 0 !important;\r    min-width: 0 !important;\r    max-width: 0 !important;\r    padding: 0 !important;\r    margin: 0 !important;\r    border: none !important;\r    font-size: 0 !important;\r    line-height: 0 !important;\r    color: transparent !important;\r}\r.VLEMHA84xhh14jNJs1xQ:not(.FPcKeuKmKv0ViAZdaAkL) button.K1tdqP5dATWqE2bXBrJ2,\r.VLEMHA84xhh14jNJs1xQ:not(.FPcKeuKmKv0ViAZdaAkL) button[aria-hidden=\"false\"],\r[role=\"search\"] button.K1tdqP5dATWqE2bXBrJ2 {\r    opacity: 1 !important;\r    visibility: visible !important;\r    pointer-events: auto !important;\r}\r.VLEMHA84xhh14jNJs1xQ.FPcKeuKmKv0ViAZdaAkL button.K1tdqP5dATWqE2bXBrJ2,\r.VLEMHA84xhh14jNJs1xQ.FPcKeuKmKv0ViAZdaAkL button[aria-hidden=\"true\"] {\r    opacity: 0 !important;\r    visibility: hidden !important;\r    pointer-events: none !important;\r    z-index: -1 !important;\r}\r.VLEMHA84xhh14jNJs1xQ.FPcKeuKmKv0ViAZdaAkL input,\r.VLEMHA84xhh14jNJs1xQ.FPcKeuKmKv0ViAZdaAkL .ojTYAIsRQtFIMsaigH6a,\r.VLEMHA84xhh14jNJs1xQ.FPcKeuKmKv0ViAZdaAkL .CJ6qUy8V0xcpm2BAXmsI,\r.VLEMHA84xhh14jNJs1xQ.FPcKeuKmKv0ViAZdaAkL .CJ6qUy8V0xcpm2BAXmsI * {\r    opacity: 1 !important;\r    visibility: visible !important;\r    pointer-events: auto !important;\r    color: inherit !important;\r    font-size: inherit !important;\r    line-height: inherit !important;\r    width: 188px !important;\r    max-width: 100% !important;\r    padding: 8px 32px !important;\r}\r.z0qdvwslOFVOAihShLIq,\r[class*=\"z0qdvwslOFVOAihShLIq\"],\r.L5dM7nzQpMJtRkvZZBZL,\r[class*=\"L5dM7nzQpMJtRkvZZBZL\"],\r.XvuTwlgQRqJ5NnVLN9ZH,\r.ukcftIJVxfBopi1UFFvF,\r[grid-area=\"now-playing-bar\"],\r.Root__now-playing-bar,\r.Root__now-playing-bar footer,\r.main-nowPlayingBar-container,\r.main-nowPlayingBar-nowPlayingBar,\rfooter,\r.Q7CmqShAn9DbDiuZrFJg {\r    background-color: rgba(12, 12, 12, var(--we-player-opacity, 0)) !important;\r    background: rgba(12, 12, 12, var(--we-player-opacity, 0)) !important;\r    border-top: 1px solid rgba(255, 255, 255, 0.06) !important;\r}\r.main-nowPlayingBar-container *,\r.Root__now-playing-bar *,\r.L5dM7nzQpMJtRkvZZBZL *,\r[data-testid=\"now-playing-widget\"] *,\r.player-controls *,\r.main-nowPlayingBar-right * {\r    -webkit-mask-image: none !important;\r    mask-image: none !important;\r}\r.main-nowPlayingBar-container svg,\r.main-nowPlayingBar-container button,\r.main-nowPlayingBar-container img,\r.main-nowPlayingBar-container a,\r.main-nowPlayingBar-container span,\r.main-nowPlayingBar-container p,\r.playback-bar,\r.playback-progressbar-isInteractive,\r[data-testid=\"playback-progressbar\"],\r.x-progressBar-progressBarBg,\r.x-progressBar-fillColor {\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r.D6xLplfPDUxExc6A2cjq,\r[class*=\"D6xLplfPDUxExc6A2cjq\"],\r.eHCihqz5SGW_TqcbF7R8,\r[class*=\"eHCihqz5SGW_TqcbF7R8\"],\raside[data-testid=\"now-playing-bar\"] [class*=\"D6xLplfPDUxExc6A2cjq\"],\raside[data-testid=\"now-playing-bar\"] .D6xLplfPDUxExc6A2cjq,\raside[data-testid=\"now-playing-bar\"] [class*=\"connect-bar\"],\raside[data-testid=\"now-playing-bar\"] [class*=\"ConnectBar\"],\r.main-connectBar-connectBar,\r[class*=\"main-connectBar-\"],\r[class*=\"connect-bar\"],\r[class*=\"connectBar\"],\r[class*=\"ConnectBar\"],\r[data-testid*=\"connect-bar\"],\r[data-testid*=\"connectBar\"] {\r    --text-base: #000000 !important;\r    --text-subdued: #121212 !important;\r    --text-bright-accent: #000000 !important;\r    --text-negative: #b31212 !important;\r    --text-warning: #9e6000 !important;\r    --text-positive: #000000 !important;\r    --text-announcement: #000000 !important;\r    --essential-base: #000000 !important;\r    --essential-subdued: #121212 !important;\r    --essential-bright-accent: #000000 !important;\r    --parents-essential-base: #000000 !important;\r    --decorative-base: #000000 !important;\r    --background-base: #1ed760 !important;\r    background-color: #1ed760 !important;\r    color: #000000 !important;\r}\r.D6xLplfPDUxExc6A2cjq *,\r[class*=\"D6xLplfPDUxExc6A2cjq\"] *,\r.eHCihqz5SGW_TqcbF7R8 *,\r[class*=\"eHCihqz5SGW_TqcbF7R8\"] *,\r.BmSki0RhlM2h9D4Q4K7X,\r.BmSki0RhlM2h9D4Q4K7X *,\r[class*=\"BmSki0RhlM2h9D4Q4K7X\"],\r[class*=\"BmSki0RhlM2h9D4Q4K7X\"] *,\r.JzBTsqQDFmp9oIiIoIeB,\r.JzBTsqQDFmp9oIiIoIeB *,\r[class*=\"JzBTsqQDFmp9oIiIoIeB\"],\r[class*=\"JzBTsqQDFmp9oIiIoIeB\"] *,\r.kP7k7Ql3SGbi1SV08vuY,\r.kP7k7Ql3SGbi1SV08vuY *,\r[class*=\"kP7k7Ql3SGbi1SV08vuY\"],\r[class*=\"kP7k7Ql3SGbi1SV08vuY\"] *,\r.main-connectBar-connectBar *,\r[class*=\"main-connectBar-\"] *,\r[class*=\"connect-bar\"] *,\r[class*=\"connectBar\"] *,\r[class*=\"ConnectBar\"] *,\r[data-testid*=\"connect-bar\"] *,\r[data-testid*=\"connectBar\"] * {\r    color: #000000 !important;\r    fill: #000000 !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    pointer-events: auto !important;\r    -webkit-mask-image: none !important;\r    mask-image: none !important;\r}\r.D6xLplfPDUxExc6A2cjq button,\r.D6xLplfPDUxExc6A2cjq span,\r.D6xLplfPDUxExc6A2cjq p,\r[class*=\"D6xLplfPDUxExc6A2cjq\"] button,\r[class*=\"D6xLplfPDUxExc6A2cjq\"] span,\r[class*=\"D6xLplfPDUxExc6A2cjq\"] p,\r.BmSki0RhlM2h9D4Q4K7X,\r[class*=\"BmSki0RhlM2h9D4Q4K7X\"] {\r    color: #000000 !important;\r    font-weight: 700 !important;\r    font-size: 11.5px !important;\r    line-height: normal !important;\r    letter-spacing: normal !important;\r    text-transform: none !important;\r    white-space: nowrap !important;\r}\r.D6xLplfPDUxExc6A2cjq svg,\r[class*=\"D6xLplfPDUxExc6A2cjq\"] svg,\r.JzBTsqQDFmp9oIiIoIeB,\r[class*=\"JzBTsqQDFmp9oIiIoIeB\"] {\r    display: inline-flex !important;\r    fill: #000000 !important;\r    color: #000000 !important;\r}\r.D6xLplfPDUxExc6A2cjq svg path,\r.D6xLplfPDUxExc6A2cjq svg rect,\r[class*=\"D6xLplfPDUxExc6A2cjq\"] svg path,\r[class*=\"D6xLplfPDUxExc6A2cjq\"] svg rect {\r    fill: #000000 !important;\r}\r.D6xLplfPDUxExc6A2cjq.bCCKNj_AITuR5Om0mimo,\r[class*=\"D6xLplfPDUxExc6A2cjq\"][class*=\"bCCKNj_AITuR5Om0mimo\"] {\r    background-color: rgba(36, 36, 36, 0.95) !important;\r    color: #ffffff !important;\r}\r.D6xLplfPDUxExc6A2cjq.bCCKNj_AITuR5Om0mimo *,\r[class*=\"D6xLplfPDUxExc6A2cjq\"][class*=\"bCCKNj_AITuR5Om0mimo\"] * {\r    color: #ffffff !important;\r    fill: #ffffff !important;\r}\r.ap_ioWdVFWJkrRicJB8C,\r[class*=\"ap_ioWdVFWJkrRicJB8C\"],\r.NTX5QnnAPQ3vbP3jyNlk,\r[class*=\"NTX5QnnAPQ3vbP3jyNlk\"],\r.goKxWei7aIJdA857U744,\r[class*=\"goKxWei7aIJdA857U744\"] {\r    background: transparent !important;\r    background-color: transparent !important;\r    background-image: none !important;\r    box-shadow: none !important;\r    opacity: 1 !important;\r    display: flex !important;\r    visibility: visible !important;\r    pointer-events: auto !important;\r}\r.goKxWei7aIJdA857U744:after,\r[class*=\"goKxWei7aIJdA857U744\"]:after {\r    background: transparent !important;\r    background-color: transparent !important;\r    background-image: none !important;\r    opacity: 0 !important;\r    display: none !important;\r}\r.EM9V2npqr6_18FGhODtx,\r.gig6fTpg9wjxwnYIkuMg,\r.QUZmsMEchZ10dIQyE93Q,\r[aria-label*=\"filter\"]:not(input):not([role=\"searchbox\"]),\r[aria-label*=\"Filter\"]:not(input):not([role=\"searchbox\"]),\r[aria-label*=\"bộ lọc\"]:not(input):not([role=\"searchbox\"]),\r[aria-label*=\"Bộ lọc\"]:not(input):not([role=\"searchbox\"]),\r[data-encore-id=\"chip\"],\r[class*=\"chip\"],\r[class*=\"Chip\"],\r[aria-label*=\"Previous\"],\r[aria-label*=\"Next\"],\r[aria-label*=\"Trước\"],\r[aria-label*=\"Tiếp\"],\rbutton[data-testid*=\"chevron\"],\r[class*=\"chevrons\"],\r[class*=\"chevron\"] {\r    opacity: 1 !important;\r    visibility: visible !important;\r    pointer-events: auto !important;\r}\r.QqprhKqwqIsC3c9SIKOE,\r[class*=\"QqprhKqwqIsC3c9SIKOE\"],\r.huL1DwMxKXMSuoZ02LmZ,\r[class*=\"huL1DwMxKXMSuoZ02LmZ\"],\r.OAo3buanAkrm481YoQm6,\r[class*=\"OAo3buanAkrm481YoQm6\"],\r.OAo3buanAkrm481YoQm6:after,\r.V7ICuEr1ZBtemPGKXeZb,\r[class*=\"V7ICuEr1ZBtemPGKXeZb\"],\r.AJjP1RzhySWiLWVcLlNA,\r[class*=\"AJjP1RzhySWiLWVcLlNA\"],\r.xWAGb7rkhYb1eQ8LiDaB,\r[class*=\"xWAGb7rkhYb1eQ8LiDaB\"],\r.xWAGb7rkhYb1eQ8LiDaB:after,\r.hiswRzE0bx1SgRvxBqW0,\r[class*=\"hiswRzE0bx1SgRvxBqW0\"],\r.wT74N9ojpAVDTx_TugfQ,\r[class*=\"wT74N9ojpAVDTx_TugfQ\"],\r.Zsz_4IzlyaFvu7jBCd06,\r[class*=\"Zsz_4IzlyaFvu7jBCd06\"],\r[data-testid=\"overscroll-background\"],\r[data-testid=\"background-overlay\"],\r.AJjP1RzhySWiLWVcLlNA,\r.Xx4EJR6ZWcW7jro0XDK2,\r[class*=\"Xx4EJR6ZWcW7jro0XDK2\"],\r.main-entityHeader-backgroundColor,\r.main-entityHeader-overlay,\r.main-entityHeader-gradient,\r.main-actionBarBackground-background,\r.rTHahewpyEmhd4usx52E,\r[class*=\"rTHahewpyEmhd4usx52E\"],\r.bP_s9AAlJVbM9CnSKRER,\r[class*=\"bP_s9AAlJVbM9CnSKRER\"],\r.As01tIbw5N5_eVOMmA7z,\r[class*=\"As01tIbw5N5_eVOMmA7z\"],\r.JpSQVHjL43tApu3BBboT,\r[class*=\"JpSQVHjL43tApu3BBboT\"],\r.gwdWMEes3HmtvEn4vSk2,\r[class*=\"gwdWMEes3HmtvEn4vSk2\"],\r.GD_sCWOL__rZjEUkNTYA,\r[class*=\"GD_sCWOL__rZjEUkNTYA\"],\r.ZU0Qwr33pAxgdxVYR21m,\r[class*=\"ZU0Qwr33pAxgdxVYR21m\"],\r.epX9OZEs2WWSRuky6bIs,\r[class*=\"epX9OZEs2WWSRuky6bIs\"],\r.ob4NiMt7UN8LQ1UniBIx,\r[class*=\"ob4NiMt7UN8LQ1UniBIx\"],\r.main-view-container__mh-footer-container,\r[class*=\"mh-footer-container\"],\r.mdoyl18mLQqK77IPy1wh,\r.mdoyl18mLQqK77IPy1wh:after,\r.LlCFa4rgglA2syNfdFRB,\r.main-topBar-background {\r    background: transparent !important;\r    background-color: transparent !important;\r    background-image: none !important;\r    box-shadow: none !important;\r    pointer-events: none !important;\r}\r.before-scroll-node {\r    display: block !important;\r    pointer-events: none !important;\r    transition: opacity 0.25s ease, transform 0.1s linear !important;\r    will-change: transform, opacity;\r}\r.before-scroll-node *,\r.MlWLm9_5qALi6Ay0_OCr,\r[class*=\"MlWLm9_5qALi6Ay0_OCr\"],\r.FNyVAJwiyJvKSs7fgcmI,\r[class*=\"FNyVAJwiyJvKSs7fgcmI\"],\r.b7x0AwQ51vLACMAHB71B,\r[class*=\"b7x0AwQ51vLACMAHB71B\"],\r[data-testid=\"background-image\"] {\r    pointer-events: none !important;\r}\r.MlWLm9_5qALi6Ay0_OCr,\r[class*=\"MlWLm9_5qALi6Ay0_OCr\"],\r.FNyVAJwiyJvKSs7fgcmI,\r[class*=\"FNyVAJwiyJvKSs7fgcmI\"] {\r    display: block !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.95) 50%, rgba(0, 0, 0, 0.5) 80%, rgba(0, 0, 0, 0) 100%) !important;\r    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.95) 50%, rgba(0, 0, 0, 0.5) 80%, rgba(0, 0, 0, 0) 100%) !important;\r}\r.b7x0AwQ51vLACMAHB71B,\r[class*=\"b7x0AwQ51vLACMAHB71B\"],\r.L0UgUY1nWxdZ3XyrJNMt,\r[class*=\"L0UgUY1nWxdZ3XyrJNMt\"],\r[data-testid=\"background-image\"] {\r    display: block !important;\r    opacity: 0.95 !important;\r    visibility: visible !important;\r}\r.P1kwly6O5plr1VQVdOLV,\r[data-testid=\"overscroll-background\"],\r.venMPE3QitySGonlITLf:after,\r.AE3dcjFNJ9068_vrnLB6:after {\r    display: none !important;\r    pointer-events: none !important;\r    width: 0 !important;\r    height: 0 !important;\r}\r[data-testid=\"entity-header\"],\r.bXvkHCNOXigrpicAqmgd,\r[class*=\"bXvkHCNOXigrpicAqmgd\"] {\r    background: transparent !important;\r    background-color: transparent !important;\r    display: flex !important;\r    visibility: visible !important;\r    opacity: 1 !important;\r    pointer-events: auto !important;\r}\r[data-testid=\"entity-header\"] *,\r.bXvkHCNOXigrpicAqmgd * {\r    visibility: visible !important;\r}\r.hbNOZbHD3bPL3OcHQWNn,\r[class*=\"hbNOZbHD3bPL3OcHQWNn\"],\r.uP1rcUSIWCFaOZaoH0ZG,\r[class*=\"uP1rcUSIWCFaOZaoH0ZG\"] {\r    background: transparent !important;\r    background-color: transparent !important;\r    background-image: none !important;\r    pointer-events: none !important;\r}\r.GECIboaMmkIqHDKwQ3vR,\r[class*=\"GECIboaMmkIqHDKwQ3vR\"],\r[data-testid=\"artist-page\"],\r.NH0t2tTyh4gSbg5Jd40w,\r[class*=\"NH0t2tTyh4gSbg5Jd40w\"],\r.z0ow24AABLbFsQt7mYDF,\r[class*=\"z0ow24AABLbFsQt7mYDF\"],\r.u9i__FHAyXJecXMPsrLQ,\r[class*=\"u9i__FHAyXJecXMPsrLQ\"],\r.ErNDIeqOIhQ9kGfrxqS_,\r[class*=\"ErNDIeqOIhQ9kGfrxqS_\"],\r.I5gPGkX7nJaKDMRuOyf2,\r[class*=\"I5gPGkX7nJaKDMRuOyf2\"] {\r    background: transparent !important;\r    background-color: transparent !important;\r}\r[data-testid=\"action-bar\"],\r[data-testid=\"action-bar-row\"] {\r    pointer-events: auto !important;\r}\r[data-testid=\"action-bar\"] *,\r[data-testid=\"action-bar-row\"] * {\r    pointer-events: auto !important;\r}\r[role=\"row\"],\r.xwwlUJUZLpjPnZByq04Y,\r[data-testid=\"tracklist-row\"],\r.main-trackList-trackListRow,\r.main-trackList-row {\r    cursor: pointer !important;\r    pointer-events: auto !important;\r    background: transparent !important;\r    transition: background-color 0.12s ease !important;\r}\r[role=\"row\"] *,\r.xwwlUJUZLpjPnZByq04Y *,\r[data-testid=\"tracklist-row\"] *,\r.main-trackList-trackListRow * {\r    pointer-events: auto !important;\r}\r[role=\"row\"]:hover,\r.xwwlUJUZLpjPnZByq04Y:hover,\r[data-testid=\"artist-page\"] [role=\"row\"]:hover,\r[data-testid=\"tracklist-row\"]:hover {\r    background-color: rgba(255, 255, 255, 0.12) !important;\r}\r[role=\"row\"]:active,\r.xwwlUJUZLpjPnZByq04Y:active,\r[data-testid=\"artist-page\"] [role=\"row\"]:active,\r[data-testid=\"tracklist-row\"]:active {\r    background-color: rgba(255, 255, 255, 0.22) !important;\r}\r[role=\"row\"] .l9kmLysnmcseyWh8xf0E,\r[role=\"row\"] button[aria-label*=\"Play\"],\r[role=\"row\"] button[aria-label*=\"Pause\"],\r[role=\"row\"] button[aria-label*=\"Phát\"],\r.xwwlUJUZLpjPnZByq04Y .l9kmLysnmcseyWh8xf0E {\r    pointer-events: auto !important;\r    cursor: pointer !important;\r}\r[role=\"row\"]:hover .l9kmLysnmcseyWh8xf0E,\r.xwwlUJUZLpjPnZByq04Y:hover .l9kmLysnmcseyWh8xf0E,\r[role=\"row\"]:focus-within .l9kmLysnmcseyWh8xf0E,\r.xwwlUJUZLpjPnZByq04Y:focus-within .l9kmLysnmcseyWh8xf0E {\r    opacity: 1 !important;\r    visibility: visible !important;\r    display: flex !important;\r    pointer-events: auto !important;\r}\r[role=\"row\"]:hover .Aa8Q1IvIum3HH4nBBx9U,\r.xwwlUJUZLpjPnZByq04Y:hover .Aa8Q1IvIum3HH4nBBx9U {\r    opacity: 0 !important;\r}\r.sxMpFt17cJVTesE9u6fX,\r[class*=\"sxMpFt17cJVTesE9u6fX\"],\r.oCSWtOAH_CgjIsi_H_PS,\r[class*=\"oCSWtOAH_CgjIsi_H_PS\"] {\r    display: none !important;\r    opacity: 0 !important;\r    visibility: hidden !important;\r    pointer-events: none !important;\r}\rbody.we-scrolled .before-scroll-node,\rbody.we-scrolled .before-scroll-node *,\rbody.we-scrolled [data-testid=\"background-image\"],\rbody.we-scrolled .MlWLm9_5qALi6Ay0_OCr,\rbody.we-scrolled [class*=\"MlWLm9_5qALi6Ay0_OCr\"],\rbody.we-scrolled .GfTKUTxvt__lBLQKmG9m,\rbody.we-scrolled [class*=\"GfTKUTxvt__lBLQKmG9m\"],\rbody.we-scrolled .b7x0AwQ51vLACMAHB71B,\rbody.we-scrolled [class*=\"b7x0AwQ51vLACMAHB71B\"],\rbody.we-scrolled .P1kwly6O5plr1VQVdOLV,\rbody.we-scrolled [class*=\"P1kwly6O5plr1VQVdOLV\"],\rbody.we-scrolled [data-testid=\"overscroll-background\"],\rbody.we-scrolled .wT74N9ojpAVDTx_TugfQ,\rbody.we-scrolled [class*=\"wT74N9ojpAVDTx_TugfQ\"],\rbody.we-scrolled .Zsz_4IzlyaFvu7jBCd06,\rbody.we-scrolled [class*=\"Zsz_4IzlyaFvu7jBCd06\"],\rbody.we-scrolled .main-entityHeader-backgroundColor,\rbody.we-scrolled .main-entityHeader-overlay,\rbody.we-scrolled .main-entityHeader-gradient {\r    opacity: 0 !important;\r    visibility: hidden !important;\r    pointer-events: none !important;\r}\r#global-nav-bar,\r.Root__globalNav,\r.main-topBar-container,\r.main-topBar-background,\r[data-testid=\"top-bar\"],\rbody.we-scrolled #global-nav-bar,\rbody.we-scrolled .Root__globalNav,\rbody.we-scrolled .main-topBar-container,\rbody.we-scrolled .main-topBar-background,\rbody.we-scrolled [data-testid=\"top-bar\"] {\r    background: rgba(18, 18, 18, var(--we-topbar-opacity, 0)) !important;\r    backdrop-filter: blur(var(--we-topbar-blur, 0px)) !important;\r    -webkit-backdrop-filter: blur(var(--we-topbar-blur, 0px)) !important;\r    box-shadow: none !important;\r    border: none !important;\r    border-bottom: none !important;\r}\rbody:not(.we-scrolled) header[data-testid=\"topbar\"],\rbody:not(.we-scrolled) .main-topBar-container,\rbody:not(.we-scrolled) .main-topBar-background,\rbody:not(.we-scrolled) .GnA7hn48eswLETlFDJp4,\rbody:not(.we-scrolled) .Ac2raqVCOQ_HYbbCkBAP,\rbody:not(.we-scrolled) .oCEpJz9qQElJmB4tFybO,\r.main-actionBar-ActionBarRow,\r[data-testid=\"action-bar-row\"],\r.main-actionBarBackground-background {\r    background: transparent !important;\r    background-color: transparent !important;\r    background-image: none !important;\r    box-shadow: none !important;\r    border: none !important;\r}\r.main-trackList-trackListHeader,\r[class*=\"trackListHeader\"],\r.rl0QlbVbrvgO0fB5Pkua,\r.wS4RXx56HUXHPjf7agj1,\r.e-10860-table-header-cell,\r[class*=\"table-header-cell\"] {\r    position: sticky !important;\r    top: var(--we-tracklist-top, 64px) !important;\r    z-index: 10 !important;\r    background: transparent !important;\r    background-color: transparent !important;\r    background-image: none !important;\r    backdrop-filter: none !important;\r    -webkit-backdrop-filter: none !important;\r    box-shadow: none !important;\r    border: none !important;\r    border-bottom: none !important;\r    transition: background 0.15s ease, background-color 0.15s ease !important;\r}\rbody:not(.we-tracklist-stuck) .main-trackList-trackListHeader,\rbody:not(.we-tracklist-stuck) [class*=\"trackListHeader\"],\rbody:not(.we-tracklist-stuck) .rl0QlbVbrvgO0fB5Pkua,\rbody:not(.we-tracklist-stuck) .wS4RXx56HUXHPjf7agj1,\rbody:not(.we-tracklist-stuck) .e-10860-table-header-cell,\rbody:not(.we-tracklist-stuck) [class*=\"table-header-cell\"],\rbody:not(.we-tracklist-stuck) .e-10860-table-container--sticky-header .e-10860-table-header-cell,\rbody:not(.we-tracklist-stuck) .e-10860-table-container--is-sticky .e-10860-table-header-cell,\rbody:not(.we-tracklist-stuck) [class*=\"table-container--is-sticky\"] [class*=\"table-header-cell\"],\rbody:not(.we-tracklist-stuck) [class*=\"table-container--sticky-header\"] [class*=\"table-header-cell\"],\r.main-trackList-trackListHeader:not(.we-tracklist-stuck):not(.wS4RXx56HUXHPjf7agj1):not(.main-trackList-trackListHeaderStuck) {\r    background: transparent !important;\r    background-color: transparent !important;\r    background-image: none !important;\r    backdrop-filter: none !important;\r    -webkit-backdrop-filter: none !important;\r    box-shadow: none !important;\r    border: none !important;\r    border-bottom: none !important;\r}\r.main-home-filterChipsContainer,\r[data-encore-id=\"chipList\"],\r[data-encore-id=\"chip\"],\r.main-topBar-topbarContent,\r[data-testid=\"topbar-content\"] {\r    opacity: 1 !important;\r    visibility: visible !important;\r    pointer-events: auto !important;\r}\rbody:not(.we-scrolled) .main-topBar-title {\r    opacity: 0;\r    visibility: hidden;\r    pointer-events: none;\r    transform: translateY(6px);\r    transition: opacity 0.2s ease, transform 0.2s ease;\r}\rbody.we-scrolled header[data-testid=\"topbar\"],\rbody.we-scrolled .main-topBar-container,\rbody.we-scrolled .main-topBar-background,\rbody.we-scrolled .GnA7hn48eswLETlFDJp4,\rbody.we-scrolled .Ac2raqVCOQ_HYbbCkBAP,\rbody.we-scrolled .oCEpJz9qQElJmB4tFybO {\r    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), var(--we-page-color, #181818) !important;\r    background-color: var(--we-page-color, #181818) !important;\r    backdrop-filter: blur(25px) !important;\r    -webkit-backdrop-filter: blur(25px) !important;\r    border: none !important;\r    border-bottom: none !important;\r    box-shadow: none !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    pointer-events: auto !important;\r}\rbody.we-tracklist-stuck .main-trackList-trackListHeader,\rbody.we-tracklist-stuck .rl0QlbVbrvgO0fB5Pkua,\rbody.we-tracklist-stuck .wS4RXx56HUXHPjf7agj1,\rbody.we-tracklist-stuck [class*=\"wS4RXx56HUXHPjf7agj1\"],\rbody.we-tracklist-stuck .main-trackList-trackListHeader.we-tracklist-stuck,\rbody.we-tracklist-stuck [class*=\"trackListHeader\"].we-tracklist-stuck,\rbody.we-tracklist-stuck .main-trackList-trackListHeaderStuck,\rbody.we-tracklist-stuck .wS4RXx56HUXHPjf7agj1.rl0QlbVbrvgO0fB5Pkua,\rbody.we-tracklist-stuck [class*=\"trackListHeaderStuck\"],\rbody.we-tracklist-stuck .e-10860-table-header-cell,\rbody.we-tracklist-stuck [class*=\"table-header-cell\"],\rbody.we-tracklist-stuck .e-10860-table-container--sticky-header .e-10860-table-header-cell,\rbody.we-tracklist-stuck .e-10860-table-container--is-sticky .e-10860-table-header-cell,\rbody.we-tracklist-stuck [class*=\"table-container--is-sticky\"] [class*=\"table-header-cell\"],\rbody.we-tracklist-stuck [class*=\"table-container--sticky-header\"] [class*=\"table-header-cell\"] {\r    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), var(--we-page-color, #181818) !important;\r    background-color: var(--we-page-color, #181818) !important;\r    backdrop-filter: blur(25px) !important;\r    -webkit-backdrop-filter: blur(25px) !important;\r    border: none !important;\r    border-top: none !important;\r    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;\r    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5) !important;\r    z-index: 10 !important;\r}\r.Zh3rQRncNEHrT9Zvp61n,\r[class*=\"Zh3rQRncNEHrT9Zvp61n\"],\r.WU7dTdoNA51czqGivj8T,\r[class*=\"WU7dTdoNA51czqGivj8T\"],\r.cciGXIL4H2kwy1SlhFHO,\r[class*=\"cciGXIL4H2kwy1SlhFHO\"] {\r    animation: none !important;\r    background: transparent !important;\r    background-color: transparent !important;\r    backdrop-filter: none !important;\r    -webkit-backdrop-filter: none !important;\r    border: none !important;\r    border-bottom: none !important;\r    box-shadow: none !important;\r    transition: background 0.25s ease, background-color 0.25s ease, backdrop-filter 0.25s ease, box-shadow 0.25s ease !important;\r}\rbody.we-right-scrolled .Zh3rQRncNEHrT9Zvp61n,\rbody.we-right-scrolled [class*=\"Zh3rQRncNEHrT9Zvp61n\"],\rbody.we-right-scrolled .WU7dTdoNA51czqGivj8T,\rbody.we-right-scrolled [class*=\"WU7dTdoNA51czqGivj8T\"],\rbody.we-right-scrolled .cciGXIL4H2kwy1SlhFHO,\rbody.we-right-scrolled [class*=\"cciGXIL4H2kwy1SlhFHO\"] {\r    background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), var(--we-page-color, #181818) !important;\r    background-color: var(--we-page-color, #181818) !important;\r    backdrop-filter: blur(25px) !important;\r    -webkit-backdrop-filter: blur(25px) !important;\r    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;\r    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6) !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    z-index: 99 !important;\r}\r.Zh3rQRncNEHrT9Zvp61n *,\r[class*=\"Zh3rQRncNEHrT9Zvp61n\"] *,\r.WU7dTdoNA51czqGivj8T *,\r[class*=\"WU7dTdoNA51czqGivj8T\"] *,\r.cciGXIL4H2kwy1SlhFHO *,\r[class*=\"cciGXIL4H2kwy1SlhFHO\"] * {\r    opacity: 1 !important;\r    visibility: visible !important;\r    -webkit-mask-image: none !important;\r    mask-image: none !important;\r}\r.rl0QlbVbrvgO0fB5Pkua *,\r[class*=\"rl0QlbVbrvgO0fB5Pkua\"] *,\r.main-trackList-trackListHeaderStuck *,\r[class*=\"trackListHeaderStuck\"] * {\r    color: #e0e0e0 !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    -webkit-mask-image: none !important;\r    mask-image: none !important;\r}\r.Q1NfqgV_yRJmogHJOsmI.gDQ_ybfqiGIG_T_lUN7L *,\r[class*=\"Q1NfqgV_yRJmogHJOsmI\"][class*=\"gDQ_ybfqiGIG_T_lUN7L\"] *,\r.GnA7hn48eswLETlFDJp4.TjakbamUlMlWoiEysK__ .Q1NfqgV_yRJmogHJOsmI *,\rbody.we-scrolled .Q1NfqgV_yRJmogHJOsmI.gDQ_ybfqiGIG_T_lUN7L *,\rbody.we-scrolled [class*=\"Q1NfqgV_yRJmogHJOsmI\"][class*=\"gDQ_ybfqiGIG_T_lUN7L\"] *,\rbody.we-scrolled .main-topBar-title,\rbody.we-scrolled .main-topBar-topbarContent,\rbody.we-scrolled .zyugqDUpsiWa8v7oczU1 *,\rbody.we-scrolled .cJhY7bOAfbdpUsMavIvn *,\rbody.we-scrolled .ap_ioWdVFWJkrRicJB8C * {\r    opacity: 1 !important;\r    visibility: visible !important;\r    pointer-events: auto !important;\r    transform: translateY(0) !important;\r    -webkit-mask-image: none !important;\r    mask-image: none !important;\r}\r[data-testid=\"action-bar-row\"] *,\r.main-actionBar-ActionBarRow * {\r    opacity: 1 !important;\r    visibility: visible !important;\r}\r#we-float-btn {\r    position: fixed !important;\r    bottom: 100px !important;\r    right: 25px !important;\r    z-index: 99999 !important;\r    background: linear-gradient(135deg, #1ed760, #179e46) !important;\r    color: #000 !important;\r    border: none !important;\r    border-radius: 50px !important;\r    padding: 8px 18px !important;\r    font-weight: 700 !important;\r    font-size: 13px !important;\r    cursor: pointer !important;\r    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5) !important;\r    display: flex !important;\r    align-items: center !important;\r    gap: 6px !important;\r    transition: transform 0.2s ease !important;\r}\r#we-float-btn:hover {\r    transform: scale(1.06) !important;\r}\r#we-modal-overlay {\r    position: fixed !important;\r    inset: 0 !important;\r    background: rgba(0, 0, 0, 0.72) !important;\r    z-index: 100000 !important;\r    display: flex !important;\r    align-items: center !important;\r    justify-content: center !important;\r}\r.we-dialog {\r    background: #1c1c1c !important;\r    border: 1px solid #333 !important;\r    border-radius: 14px !important;\r    padding: 22px 24px !important;\r    width: 480px !important;\r    max-width: 92vw !important;\r    max-height: 90vh !important;\r    overflow-y: auto !important;\r    color: #fff !important;\r    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85) !important;\r    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif !important;\r}\r.we-row {\r    margin-bottom: 13px !important;\r}\r.we-row label {\r    display: flex;\r    justify-content: space-between;\r    font-size: 13px;\r    color: #b3b3b3;\r    margin-bottom: 5px;\r}\r.we-slider {\r    width: 100%;\r    accent-color: #1ed760;\r    cursor: pointer;\r}\r.we-btn-group {\r    display: flex;\r    gap: 8px;\r    margin-top: 5px;\r}\r.we-btn-pill {\r    flex: 1;\r    background: rgba(255, 255, 255, 0.08);\r    color: #ccc;\r    border: 1px solid rgba(255, 255, 255, 0.1);\r    border-radius: 6px;\r    padding: 7px 10px;\r    font-size: 12px;\r    cursor: pointer;\r    transition: all 0.15s ease;\r    text-align: center;\r}\r.we-btn-pill:hover {\r    background: rgba(255, 255, 255, 0.15);\r    color: #fff;\r}\r.we-btn-pill.active {\r    background: #1ed760 !important;\r    color: #000 !important;\r    font-weight: 700 !important;\r    border-color: #1ed760 !important;\r}\r.we-btn-sync {\r    width: 100%;\r    background: #1ed760;\r    color: #000;\r    border: none;\r    border-radius: 8px;\r    padding: 10px;\r    font-weight: 700;\r    font-size: 13px;\r    cursor: pointer;\r    display: flex;\r    align-items: center;\r    justify-content: center;\r    gap: 8px;\r}\r.we-btn-sync:hover {\r    background: #1fdf64;\r}\r.marketplace-header {\r    background: rgba(18, 18, 18, 0.5) !important;\r    backdrop-filter: blur(20px) !important;\r    -webkit-backdrop-filter: blur(20px) !important;\r    border-radius: 14px !important;\r    padding: 8px 16px !important;\r    border: 1px solid rgba(255, 255, 255, 0.1) !important;\r    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;\r    display: flex !important;\r    align-items: center !important;\r    justify-content: space-between !important;\r    flex-wrap: nowrap !important;\r    gap: 12px !important;\r    box-sizing: border-box !important;\r    position: sticky !important;\r    top: 64px !important;\r    z-index: 50 !important;\r    overflow: visible !important;\r    transition: all 0.2s ease !important;\r}\r.marketplace-header__left {\r    display: inline-flex !important;\r    align-items: center !important;\r    flex-shrink: 0 !important;\r    gap: 8px !important;\r    z-index: 30 !important;\r    position: relative !important;\r}\r.marketplace-header__left>* {\r    margin: 0 !important;\r}\r.marketplace-header__label {\r    display: inline-flex !important;\r    align-items: center !important;\r    white-space: nowrap !important;\r    font-size: 13px !important;\r    font-weight: 700 !important;\r    color: #ffffff !important;\r    margin: 0 !important;\r    line-height: 1 !important;\r    letter-spacing: 0.3px !important;\r}\r.marketplace-header__right {\r    display: inline-flex !important;\r    align-items: center !important;\r    flex-shrink: 0 !important;\r    gap: 8px !important;\r    z-index: 30 !important;\r    position: relative !important;\r}\r.marketplace-header__right>* {\r    margin: 0 !important;\r}\r.marketplace-sortBox,\r.marketplace-sortBox-header,\r.marketplace-header .Dropdown-root,\r.Dropdown-root {\r    position: relative !important;\r    display: inline-block !important;\r}\r.marketplace-sortBox .Dropdown-control,\r.marketplace-header .Dropdown-control,\r.marketplace-content .Dropdown-control,\r.Dropdown-control {\r    background: rgba(255, 255, 255, 0.1) !important;\r    background-color: rgba(255, 255, 255, 0.1) !important;\r    border: 1px solid rgba(255, 255, 255, 0.16) !important;\r    border-radius: 8px !important;\r    color: #ffffff !important;\r    cursor: pointer !important;\r    font-size: 13px !important;\r    font-weight: 600 !important;\r    padding: 6px 30px 6px 12px !important;\r    outline: none !important;\r    box-sizing: border-box !important;\r    white-space: nowrap !important;\r    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease !important;\r    display: flex !important;\r    align-items: center !important;\r}\r.marketplace-sortBox .Dropdown-control:hover,\r.marketplace-header .Dropdown-control:hover,\r.marketplace-content .Dropdown-control:hover,\r.Dropdown-control:hover {\r    background: rgba(255, 255, 255, 0.18) !important;\r    border-color: rgba(255, 255, 255, 0.3) !important;\r    color: #ffffff !important;\r}\r.marketplace-sortBox .Dropdown-arrow,\r.marketplace-header .Dropdown-arrow,\r.Dropdown-arrow {\r    border-color: #ffffff transparent transparent !important;\r    border-style: solid !important;\r    border-width: 5px 5px 0 !important;\r    top: 50% !important;\r    transform: translateY(-50%) !important;\r    margin-top: 0 !important;\r    right: 12px !important;\r    position: absolute !important;\r}\r.Dropdown-root.is-open .Dropdown-arrow {\r    border-color: transparent transparent #ffffff !important;\r    border-width: 0 5px 5px !important;\r    top: 50% !important;\r    transform: translateY(-50%) !important;\r    margin-top: 0 !important;\r}\r.marketplace-sortBox .Dropdown-menu,\r.marketplace-header .Dropdown-menu,\r.marketplace-content .Dropdown-menu,\r.Dropdown-root .Dropdown-menu {\r    background: #1c1c1c !important;\r    background-color: #1c1c1c !important;\r    backdrop-filter: blur(28px) !important;\r    -webkit-backdrop-filter: blur(28px) !important;\r    border: 1px solid rgba(255, 255, 255, 0.16) !important;\r    border-radius: 8px !important;\r    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.85) !important;\r    box-sizing: border-box !important;\r    margin-top: 5px !important;\r    max-height: 260px !important;\r    overflow-y: auto !important;\r    position: absolute !important;\r    top: 100% !important;\r    left: 0 !important;\r    min-width: 140px !important;\r    width: max-content !important;\r    z-index: 999999 !important;\r    padding: 4px !important;\r}\r.marketplace-sortBox .Dropdown-option,\r.marketplace-header .Dropdown-option,\r.marketplace-content .Dropdown-option,\r.Dropdown-root .Dropdown-option {\r    box-sizing: border-box !important;\r    color: #b3b3b3 !important;\r    cursor: pointer !important;\r    display: block !important;\r    padding: 8px 12px !important;\r    font-size: 13px !important;\r    font-weight: 500 !important;\r    border-radius: 6px !important;\r    transition: background 0.15s ease, color 0.15s ease !important;\r    background: transparent !important;\r    white-space: nowrap !important;\r}\r.marketplace-sortBox .Dropdown-option:hover,\r.marketplace-header .Dropdown-option:hover,\r.marketplace-content .Dropdown-option:hover,\r.Dropdown-root .Dropdown-option:hover {\r    background: rgba(255, 255, 255, 0.12) !important;\r    color: #ffffff !important;\r}\r.marketplace-sortBox .Dropdown-option.is-selected,\r.marketplace-header .Dropdown-option.is-selected,\r.marketplace-content .Dropdown-option.is-selected,\r.Dropdown-root .Dropdown-option.is-selected {\r    background: #1ed760 !important;\r    background-color: #1ed760 !important;\r    color: #000000 !important;\r    font-weight: 700 !important;\r}\r.marketplace-header .searchbar--bar__wrapper {\r    flex-grow: 0 !important;\r}\r.marketplace-header .searchbar-bar {\r    background: rgba(255, 255, 255, 0.08) !important;\r    background-color: rgba(255, 255, 255, 0.08) !important;\r    border: 1px solid rgba(255, 255, 255, 0.12) !important;\r    border-radius: 500px !important;\r    color: #ffffff !important;\r    padding: 7px 12px !important;\r    font-size: 13px !important;\r    outline: none !important;\r    box-sizing: border-box !important;\r    transition: all 0.2s ease !important;\r    width: 150px !important;\r}\r.marketplace-header .searchbar-bar:focus {\r    background: rgba(255, 255, 255, 0.14) !important;\r    border-color: rgba(255, 255, 255, 0.3) !important;\r    width: 190px !important;\r}\r.marketplace-header-icon-button {\r    background: rgba(255, 255, 255, 0.08) !important;\r    background-color: rgba(255, 255, 255, 0.08) !important;\r    border: 1px solid rgba(255, 255, 255, 0.12) !important;\r    border-radius: 50% !important;\r    color: #b3b3b3 !important;\r    width: 32px !important;\r    height: 32px !important;\r    padding: 0 !important;\r    display: inline-flex !important;\r    align-items: center !important;\r    justify-content: center !important;\r    cursor: pointer !important;\r    transition: all 0.2s ease !important;\r    vertical-align: middle !important;\r    flex-shrink: 0 !important;\r}\r.marketplace-header-icon-button:hover {\r    background: rgba(255, 255, 255, 0.18) !important;\r    color: #ffffff !important;\r    border-color: rgba(255, 255, 255, 0.25) !important;\r    transform: scale(1.06) !important;\r}\r.marketplace-header .marketplace-tabBar.we-hidden-bridge,\r.marketplace-tabBar.we-hidden-bridge,\r.main-topBar-topbarContentWrapper .marketplace-tabBar {\r    position: fixed !important;\r    top: 0 !important;\r    left: 0 !important;\r    opacity: 0 !important;\r    pointer-events: none !important;\r    width: 0px !important;\r    height: 0px !important;\r    overflow: hidden !important;\r    z-index: -9999 !important;\r}\r#marketplace-quick-tabs-container,\r.marketplace-header #marketplace-quick-tabs-container {\r    -webkit-app-region: no-drag !important;\r    pointer-events: auto !important;\r    display: inline-flex !important;\r    align-items: center !important;\r    justify-content: center !important;\r    margin: 0 auto !important;\r    flex: 1 1 auto !important;\r    z-index: 20 !important;\r    background: transparent !important;\r    border: none !important;\r    box-shadow: none !important;\r    overflow: visible !important;\r}\r.marketplace-quick-tabs-list,\r.marketplace-header .marketplace-quick-tabs-list {\r    display: inline-flex !important;\r    align-items: center !important;\r    justify-content: center !important;\r    list-style: none !important;\r    margin: 0 !important;\r    padding: 0 !important;\r    gap: 8px !important;\r    background: transparent !important;\r    border: none !important;\r    box-shadow: none !important;\r    flex-wrap: nowrap !important;\r    white-space: nowrap !important;\r    pointer-events: auto !important;\r}\r.marketplace-quick-tab-item,\r.marketplace-header .marketplace-quick-tab-item {\r    -webkit-app-region: no-drag !important;\r    display: inline-flex !important;\r    align-items: center !important;\r    pointer-events: auto !important;\r    flex-shrink: 0 !important;\r    margin: 0 !important;\r    padding: 0 !important;\r    list-style: none !important;\r}\r.marketplace-quick-tab-btn,\r.marketplace-header .marketplace-quick-tab-btn {\r    appearance: none !important;\r    -webkit-appearance: none !important;\r    outline: none !important;\r    border: 1px solid rgba(255, 255, 255, 0.12) !important;\r    background: rgba(255, 255, 255, 0.08) !important;\r    color: #ffffff !important;\r    border-radius: 500px !important;\r    padding: 6px 16px !important;\r    font-size: 13px !important;\r    font-weight: 600 !important;\r    letter-spacing: 0.1px !important;\r    cursor: pointer !important;\r    display: inline-flex !important;\r    align-items: center !important;\r    justify-content: center !important;\r    backdrop-filter: blur(12px) !important;\r    -webkit-backdrop-filter: blur(12px) !important;\r    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;\r    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1) !important;\r    user-select: none !important;\r    white-space: nowrap !important;\r    font-family: inherit !important;\r    pointer-events: auto !important;\r}\r.marketplace-quick-tab-btn:hover,\r.marketplace-header .marketplace-quick-tab-btn:hover {\r    background: rgba(255, 255, 255, 0.16) !important;\r    border-color: rgba(255, 255, 255, 0.25) !important;\r    color: #ffffff !important;\r    transform: translateY(-1px) scale(1.02) !important;\r}\r.marketplace-quick-tab-btn:active,\r.marketplace-header .marketplace-quick-tab-btn:active {\r    transform: scale(0.97) !important;\r}\r.marketplace-quick-tab-btn.active,\r.marketplace-header .marketplace-quick-tab-btn.active {\r    background: #ffffff !important;\r    color: #000000 !important;\r    border-color: #ffffff !important;\r    font-weight: 700 !important;\r    box-shadow: 0 3px 12px rgba(255, 255, 255, 0.25) !important;\r}\r.marketplace-quick-tab-btn.active:hover,\r.marketplace-header .marketplace-quick-tab-btn.active:hover {\r    background: #f0f0f0 !important;\r    color: #000000 !important;\r    border-color: #f0f0f0 !important;\r}\r.marketplace-quick-tab-btn.active span,\r.marketplace-header .marketplace-quick-tab-btn.active span {\r    color: #000000 !important;\r    font-weight: 700 !important;\r}\r#we-home-quick-tabs {\r    position: sticky !important;\r    top: var(--we-tracklist-top, 64px) !important;\r    z-index: 999 !important;\r    padding: 12px var(--content-spacing, 32px) 8px var(--content-spacing, 32px) !important;\r    display: flex !important;\r    align-items: center !important;\r    background: transparent !important;\r    pointer-events: auto !important;\r    box-sizing: border-box !important;\r    transition: padding 0.2s ease !important;\r}\r@media (max-width: 768px) {\r    #we-home-quick-tabs {\r        padding: 8px 16px !important;\r    }\r}\r.we-home-quick-tabs-list {\r    display: inline-flex !important;\r    align-items: center !important;\r    list-style: none !important;\r    margin: 0 !important;\r    padding: 0 !important;\r    gap: 8px !important;\r    pointer-events: auto !important;\r}\r.we-home-quick-tab-item {\r    display: inline-flex !important;\r    align-items: center !important;\r    margin: 0 !important;\r    padding: 0 !important;\r    list-style: none !important;\r    pointer-events: auto !important;\r}\r.we-home-quick-tab-btn {\r    appearance: none !important;\r    -webkit-appearance: none !important;\r    outline: none !important;\r    border: 1px solid rgba(255, 255, 255, 0.12) !important;\r    background: rgba(255, 255, 255, 0.08) !important;\r    color: #ffffff !important;\r    border-radius: 500px !important;\r    padding: 7px 18px !important;\r    font-size: 13.5px !important;\r    font-weight: 600 !important;\r    letter-spacing: 0.1px !important;\r    cursor: pointer !important;\r    display: inline-flex !important;\r    align-items: center !important;\r    justify-content: center !important;\r    backdrop-filter: blur(12px) !important;\r    -webkit-backdrop-filter: blur(12px) !important;\r    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;\r    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1) !important;\r    user-select: none !important;\r    white-space: nowrap !important;\r    font-family: inherit !important;\r    pointer-events: auto !important;\r    position: relative !important;\r    z-index: 1000 !important;\r}\r.we-home-quick-tab-btn:hover {\r    background: rgba(255, 255, 255, 0.16) !important;\r    border-color: rgba(255, 255, 255, 0.25) !important;\r    color: #ffffff !important;\r    transform: translateY(-1px) scale(1.02) !important;\r}\r.we-home-quick-tab-btn:active {\r    transform: scale(0.97) !important;\r}\r.we-home-quick-tab-btn.active {\r    background: #ffffff !important;\r    color: #000000 !important;\r    border-color: #ffffff !important;\r    font-weight: 700 !important;\r    box-shadow: 0 4px 14px rgba(255, 255, 255, 0.25) !important;\r}\r.we-home-quick-tab-btn.active:hover {\r    background: #f0f0f0 !important;\r    color: #000000 !important;\r    border-color: #f0f0f0 !important;\r    box-shadow: 0 6px 18px rgba(255, 255, 255, 0.35) !important;\r}\r.we-home-quick-tab-btn.active span {\r    color: #000000 !important;\r    font-weight: 700 !important;\r}\r.main-home-filterChipsContainer,\r.S2e77KLs4Na3yTiaIZgI,\r.YOYIfKkABUDGQ5vQmg7y,\r.EM9V2npqr6_18FGhODtx,\r.gig6fTpg9wjxwnYIkuMg,\r[data-encore-id=\"chipList\"] {\r    background: transparent !important;\r    background-color: transparent !important;\r    background-image: none !important;\r    box-shadow: none !important;\r    border: none !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    pointer-events: auto !important;\r    position: relative !important;\r    z-index: 999 !important;\r}\r[data-encore-id=\"chip\"] {\r    background: rgba(255, 255, 255, 0.08) !important;\r    background-color: rgba(255, 255, 255, 0.08) !important;\r    color: #ffffff !important;\r    border: 1px solid rgba(255, 255, 255, 0.12) !important;\r    border-radius: 500px !important;\r    font-weight: 600 !important;\r    font-size: 13.5px !important;\r    cursor: pointer !important;\r    pointer-events: auto !important;\r    position: relative !important;\r    z-index: 1000 !important;\r    opacity: 1 !important;\r    visibility: visible !important;\r    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1) !important;\r    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;\r    backdrop-filter: blur(12px) !important;\r    -webkit-backdrop-filter: blur(12px) !important;\r}\r[data-encore-id=\"chip\"] span,\r[data-encore-id=\"chip\"] * {\r    color: inherit !important;\r    pointer-events: auto !important;\r}\r[data-encore-id=\"chip\"]:hover {\r    background: rgba(255, 255, 255, 0.16) !important;\r    background-color: rgba(255, 255, 255, 0.16) !important;\r    color: #ffffff !important;\r    border-color: rgba(255, 255, 255, 0.25) !important;\r    transform: translateY(-1px) !important;\r}\r[data-encore-id=\"chip\"][aria-checked=\"true\"],\r[data-encore-id=\"chip\"][aria-selected=\"true\"],\r[data-encore-id=\"chip\"][data-selected=\"true\"],\r[data-encore-id=\"chip\"].selected,\r[data-encore-id=\"chip\"]._selected,\r[data-encore-id=\"chip\"][class*=\"selected\"],\r[data-encore-id=\"chip\"][class*=\"Selected\"],\r[data-encore-id=\"chip\"][aria-current=\"page\"] {\r    background: #ffffff !important;\r    background-color: #ffffff !important;\r    color: #000000 !important;\r    border-color: #ffffff !important;\r    font-weight: 700 !important;\r    box-shadow: 0 4px 14px rgba(255, 255, 255, 0.25) !important;\r}\r[data-encore-id=\"chip\"][aria-checked=\"true\"] *,\r[data-encore-id=\"chip\"][aria-selected=\"true\"] *,\r[data-encore-id=\"chip\"][data-selected=\"true\"] *,\r[data-encore-id=\"chip\"].selected *,\r[data-encore-id=\"chip\"][class*=\"selected\"] * {\r    color: #000000 !important;\r    font-weight: 700 !important;\r}\r.gig6fTpg9wjxwnYIkuMg {\r    mask-image: none !important;\r    -webkit-mask-image: none !important;\r}\r.S2e77KLs4Na3yTiaIZgI:empty,\r.YOYIfKkABUDGQ5vQmg7y:empty {\r    display: none !important;\r}";

    const DB_NAME = "SpotifyWallpaperEngineDB_v2";
const STORE_NAME = "wallpapers";
const SETTINGS_KEY = "WE_Spotify_Settings_v2";
const BRIDGE_API = "http://127.0.0.1:43196";

const defaultSettings = {
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

let settings = Object.assign({}, defaultSettings);

function loadSettings() {
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

function saveSettings() {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) { }
    applyVisualSettings();
}

function applyVisualSettings() {
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

function openDB() {
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

async function saveMedia(blob, name, type) {
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

async function loadSavedMedia() {
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

    let imageEl = null;
let videoEl = null;
let isSyncing = false;
let syncAbort = null;

function applyVideoLoopSettings() {
    if (!videoEl) videoEl = document.getElementById("we-video");
    if (!videoEl) return;
    const trim = Number(settings.videoIntroTrim) || 0;
    videoEl.loop = trim <= 0;
    if (trim > 0 && videoEl.currentTime < trim && settings.videoSkipIntroOnStart) {
        videoEl.currentTime = trim;
    }
}

function applyPauseState() {
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

function toggleWallpaperPause(paused) {
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

function renderMedia(source, type = "", posterUrl = "", autoIntroTrim = 0) {
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
            if (posterUrl && imageEl) {
                if (imageEl.src !== posterUrl) {
                    imageEl.src = posterUrl;
                }
                imageEl.classList.remove("we-media-hidden");
            }

            videoEl.muted = true;
            videoEl.defaultMuted = true;
            videoEl.volume = 0;
            const manualTrim = Number(settings.videoIntroTrim) || 0;
            const currentTrim = manualTrim > 0 ? manualTrim : (Number(autoIntroTrim) || 0);
            videoEl.loop = currentTrim <= 0;
            videoEl.playsInline = true;
            videoEl.autoplay = true;

            let initialSeekDone = false;
            videoEl.onended = () => {
                const curTrim = (Number(settings.videoIntroTrim) || 0) || (Number(autoIntroTrim) || 0);
                if (curTrim > 0 && videoEl.duration && curTrim < videoEl.duration) {
                    videoEl.currentTime = curTrim;
                } else {
                    videoEl.currentTime = 0;
                }
                videoEl.play().catch(() => {});
            };

            videoEl.ontimeupdate = () => {
                const curTrim = (Number(settings.videoIntroTrim) || 0) || (Number(autoIntroTrim) || 0);
                if (curTrim > 0 && videoEl.duration && videoEl.currentTime >= videoEl.duration - 0.15) {
                    videoEl.currentTime = curTrim;
                    if (!settings.wallpaperPaused) {
                        videoEl.play().catch(() => {});
                    }
                }
            };

            videoEl.onerror = () => {
                const err = videoEl.error;
                console.error("[Wallpaper Engine] videoEl playback error:", err);
                videoEl.classList.add("we-media-hidden");
                if (posterUrl && imageEl) {
                    if (imageEl.src !== posterUrl) imageEl.src = posterUrl;
                    imageEl.classList.remove("we-media-hidden");
                } else if (imageEl.src) {
                    imageEl.classList.remove("we-media-hidden");
                }
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

            const onVideoReady = () => {
                videoEl.classList.remove("we-media-hidden");
                imageEl.classList.add("we-media-hidden");
                const mTrim = Number(settings.videoIntroTrim) || 0;
                const effectiveTrim = mTrim > 0 ? mTrim : (Number(autoIntroTrim) || 0);
                if (!initialSeekDone && settings.videoSkipIntroOnStart && effectiveTrim > 0 && videoEl.duration && effectiveTrim < videoEl.duration) {
                    initialSeekDone = true;
                    videoEl.currentTime = effectiveTrim;
                }
                if (!settings.wallpaperPaused) {
                    videoEl.play().catch((e) => {
                        console.warn("[Wallpaper Engine] Autoplay failed:", e);
                    });
                }
            };

            videoEl.onloadeddata = onVideoReady;
            videoEl.onplaying = onVideoReady;

            if (videoEl.src !== url) {
                videoEl.src = url;
                videoEl.load();
            } else {
                if (!settings.wallpaperPaused) {
                    videoEl.play().catch(() => {});
                }
                if (videoEl.readyState >= 2) {
                    onVideoReady();
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
                if (imageEl.complete && imageEl.naturalWidth > 0) {
                    imageEl.classList.remove("we-media-hidden");
                }
            } else {
                imageEl.classList.remove("we-media-hidden");
            }
        }
    } catch (err) {
        console.error("[Wallpaper Engine] renderMedia error:", err);
    }
}

async function loadAndApplyCustomMedia() {
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

async function setWallpaperSource(source) {
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

function toggleWallpaperSource() {
    const next = settings.wallpaperSource === "custom-video" ? "wallpaper-engine" : "custom-video";
    return setWallpaperSource(next);
}

function setupContainer() {
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

async function syncFromWallpaperEngine(manual = false) {
    if (settings.wallpaperSource === "custom-video" && !manual) return;
    if (isSyncing) return;
    try {
        isSyncing = true;
        if (syncAbort) {
            try { syncAbort.abort(); } catch {}
        }
        syncAbort = new AbortController();
        const timeoutId = setTimeout(() => syncAbort.abort(), 5000);

        const monParam = encodeURIComponent(settings.targetMonitor || "Monitor0");
        let res;
        try {
            res = await fetch(`${BRIDGE_API}/api/current?monitor=${monParam}`, {
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

            renderMedia(data.mediaUrl, data.mediaType, data.posterUrl, data.introDuration || 0);

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

function updateBridgeStatusUI(connected, text) {
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

function startAutoSyncWatcher() {
    setInterval(() => {
        if (settings.wallpaperSource === "wallpaper-engine" && settings.autoSync && !settings.wallpaperPaused) {
            syncFromWallpaperEngine(false);
        }
    }, 3000);
}

    const isValidColor = (col) => {
    if (!col || typeof col !== "string") return false;
    col = col.trim().toLowerCase();
    if (col === "transparent" || col === "inherit" || col === "initial") return false;
    if (col.startsWith("rgba(18, 18, 18") || col.startsWith("rgb(18, 18, 18)")) return false;
    if (col.startsWith("rgba(0, 0, 0") || col === "rgb(0, 0, 0)") return false;
    if (col === "#000" || col === "#000000" || col === "#121212" || col === "#181818") return false;
    return true;
};

const parseColorString = (str) => {
    if (!str) return null;
    const rgbMatch = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+\s*)?\)/i);
    if (rgbMatch) {
        const [_, r, g, b] = rgbMatch;
        return `rgb(${r}, ${g}, ${b})`;
    }
    const hexMatch = str.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/);
    if (hexMatch) return hexMatch[0];
    return null;
};

const getStyleColor = (el) => {
    if (!el) return null;
    try {
        const cssVar = el.style?.getPropertyValue?.("--background-base");
        if (cssVar && isValidColor(cssVar)) return cssVar.trim();

        if (el.style?.backgroundColor && isValidColor(el.style.backgroundColor)) {
            return el.style.backgroundColor;
        }

        if (el.style?.background) {
            const parsed = parseColorString(el.style.background);
            if (parsed && isValidColor(parsed)) return parsed;
        }

        const comp = window.getComputedStyle(el);
        if (comp) {
            const compVar = comp.getPropertyValue("--background-base");
            if (compVar && isValidColor(compVar)) return compVar.trim();
        }
    } catch {}
    return null;
};

const extractFromImage = (img) => {
    try {
        if (!img || !img.complete || !img.naturalWidth) return null;
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const col = `rgb(${r}, ${g}, ${b})`;
        if (isValidColor(col)) return col;
    } catch {}
    return null;
};

const extractAlbumColor = () => {
    const topBarBgs = document.querySelectorAll('.main-topBar-background, .Ac2raqVCOQ_HYbbCkBAP, [data-testid="topbar"] > div:first-child');
    for (const el of topBarBgs) {
        const col = getStyleColor(el);
        if (col) return col;
    }

    const underMain = document.querySelector('.under-main-view');
    if (underMain) {
        const col = getStyleColor(underMain);
        if (col) return col;
        try {
            const compBg = window.getComputedStyle(underMain).backgroundColor;
            if (isValidColor(compBg)) return compBg;
        } catch {}
    }

    const entityBg = document.querySelector('.main-entityHeader-backgroundColor');
    if (entityBg) {
        const col = getStyleColor(entityBg);
        if (col) return col;
    }

    const elemsWithVar = document.querySelectorAll('[style*="--background-base"]');
    for (const el of elemsWithVar) {
        if (el.closest('.Root__nav-bar') || el.closest('#Desktop_LeftSidebar_Id')) continue;
        const col = getStyleColor(el);
        if (col) return col;
    }

    const headerElems = document.querySelectorAll(`
        [data-testid="entity-header"],
        .main-entityHeader-container,
        .main-entityHeader-overlay,
        .main-view-container__scroll-node > div:first-child,
        [data-testid="playlist-page"] > div:first-child
    `);
    for (const el of headerElems) {
        const col = getStyleColor(el);
        if (col) return col;
    }

    const img = document.querySelector(`
        .main-entityHeader-image img,
        [data-testid="entity-header"] img,
        .main-image-image,
        [data-testid="playlist-image"] img
    `);
    if (img) {
        const col = extractFromImage(img);
        if (col) return col;
    }

    return null;
};

let lastExtractedUri = "";
const fetchSpicetifyColor = () => {
    try {
        if (window.Spicetify?.colorExtractor) {
            const pathname = window.Spicetify.Platform?.History?.location?.pathname || "";
            let uri = pathname.replace(/^\//, 'spotify:').replace(/\//g, ':');
            if (!uri || uri === 'spotify:' || uri.startsWith('spotify:search')) {
                uri = window.Spicetify.Player?.data?.item?.uri;
            }
            if (uri && uri !== lastExtractedUri) {
                lastExtractedUri = uri;
                window.Spicetify.colorExtractor(uri).then(colors => {
                    if (colors) {
                        const col = colors.VIBRANT || colors.PROMINENT || colors.DARK_VIBRANT || colors.LIGHT_VIBRANT;
                        if (col && isValidColor(col)) {
                            document.documentElement.style.setProperty('--we-page-color', col);
                        }
                    }
                }).catch(() => {});
            }
        }
    } catch {}
};

    function setupScrollWatcher() {
    const syncColorAndScroll = (e) => {
        fetchSpicetifyColor();
        const pageColor = extractAlbumColor();
        if (pageColor) {
            document.documentElement.style.setProperty('--we-page-color', pageColor);
        }

        let targetTop = 64;
        const topBarEl = document.querySelector('header[data-testid="topbar"], .main-topBar-container, #global-nav-bar');
        if (topBarEl) {
            const r = topBarEl.getBoundingClientRect();
            if (r.height > 0) targetTop = Math.round(r.height);
        }
        document.documentElement.style.setProperty('--we-tracklist-top', targetTop + 'px');

        let maxScrollTop = 0;
        const scrollContainers = document.querySelectorAll(
            '.main-view-container__scroll-node, .Root__main-view .os-viewport, .Root__main-view [data-overlayscrollbars-viewport], [grid-area="main-view"] [data-overlayscrollbars-viewport]'
        );
        scrollContainers.forEach(c => {
            if (c && typeof c.scrollTop === 'number' && c.scrollTop > maxScrollTop) {
                maxScrollTop = c.scrollTop;
            }
        });

        let isPastBanner = false;
        const actionBar = document.querySelector(
            '.main-actionBar-ActionBarRow, [data-testid="action-bar-row"], [data-testid="action-bar"]'
        );
        const mainViewContainer = document.querySelector(
            '.Root__main-view, [grid-area="main-view"], .main-view-container'
        );

        if (actionBar && mainViewContainer && mainViewContainer.contains(actionBar)) {
            const actionRect = actionBar.getBoundingClientRect();
            if (actionRect.top <= targetTop + 16 || actionRect.bottom <= targetTop + 40 || maxScrollTop > 240) {
                isPastBanner = true;
            }
        } else {
            if (maxScrollTop > 200) {
                isPastBanner = true;
            }
        }

        document.body.classList.toggle("we-scrolled", isPastBanner);

        const beforeNode = document.querySelector('.before-scroll-node');
        if (beforeNode) {
            if (maxScrollTop > 0) {
                const fadeProgress = Math.min(1, maxScrollTop / 240);
                beforeNode.style.opacity = (1 - fadeProgress).toFixed(2);
            } else {
                beforeNode.style.transform = '';
                beforeNode.style.opacity = '';
            }
        }

        let isTracklistStuck = false;
        const trackHeader = document.querySelector(
            '.main-trackList-trackListHeader, [data-testid="track-list-header"], .rl0QlbVbrvgO0fB5Pkua, .wS4RXx56HUXHPjf7agj1, [class*="trackListHeader"]'
        );
        if (trackHeader) {
            const trackRect = trackHeader.getBoundingClientRect();
            if (trackRect.top <= targetTop + 2 && trackRect.height > 0) {
                isTracklistStuck = true;
            }
        }

        document.body.classList.toggle("we-tracklist-stuck", isTracklistStuck);
        if (trackHeader) trackHeader.classList.toggle("we-tracklist-stuck", isTracklistStuck);

        const rightSidebar = document.querySelector(
            '.Root__right-sidebar, [grid-area="right-sidebar"], #Desktop_PanelContainer_Id, aside.main-buddyFeed-container'
        );
        let isRightScrolled = false;
        if (rightSidebar) {
            const visual = rightSidebar.querySelector(
                '.caAOfYXiCAm8Vhi8McGl, [class*="caAOfYXiCAm8Vhi8McGl"], [class*="VisualFrame"], .y6OKifI7z4sW24WtUOtl, [data-npv-root] img, [data-npv-root] video'
            );
            const header = rightSidebar.querySelector(
                '.Zh3rQRncNEHrT9Zvp61n, [class*="Zh3rQRncNEHrT9Zvp61n"], .WU7dTdoNA51czqGivj8T, .cciGXIL4H2kwy1SlhFHO'
            );
            const headerBottom = header ? header.getBoundingClientRect().bottom : 64;

            if (visual) {
                const visualRect = visual.getBoundingClientRect();
                if (visualRect.bottom <= headerBottom + 10) {
                    isRightScrolled = true;
                }
            } else {
                const rightViewports = rightSidebar.querySelectorAll(
                    '.os-viewport, [data-overlayscrollbars-viewport], [class*="scroll"], [class*="Scroll"]'
                );
                rightViewports.forEach(vp => {
                    if (vp && typeof vp.scrollTop === 'number' && vp.scrollTop > 180) {
                        isRightScrolled = true;
                    }
                });
            }
        }
        document.body.classList.toggle("we-right-scrolled", isRightScrolled);
    };

    window.addEventListener('scroll', syncColorAndScroll, { capture: true, passive: true });

    const attachScroll = () => {
        const scrollContainers = document.querySelectorAll(
            '.os-viewport, [data-overlayscrollbars-viewport], .main-view-container__scroll-node, .main-view-container__scroll-node-child, [data-testid="main-view"], .main-view-container, .Root__main-view, .Root__right-sidebar, [data-testid="now-playing-view"], main'
        );
        scrollContainers.forEach(container => {
            if (container.__we_scroll_bound__) return;
            container.__we_scroll_bound__ = true;
            container.addEventListener('scroll', syncColorAndScroll, { passive: true });
        });
    };
    attachScroll();
    setInterval(attachScroll, 1000);
    setInterval(syncColorAndScroll, 200);

    try {
        if (window.Spicetify?.Platform?.History?.listen) {
            window.Spicetify.Platform.History.listen(() => {
                const beforeNode = document.querySelector('.before-scroll-node');
                if (beforeNode) {
                    beforeNode.style.transform = '';
                    beforeNode.style.opacity = '';
                }
                setTimeout(syncColorAndScroll, 100);
            });
        }
    } catch {}
}

    const RECOMMENDATION_TABS = [
    { id: "all", vi: "Tất cả", en: "All" },
    { id: "music", vi: "Nhạc", en: "Music" },
    { id: "podcasts", vi: "Podcasts", en: "Podcasts" }
];

let isNavigating = false;

function getHomeMainEl() {
    return document.querySelector(
        'main[data-testid="home-page"], main[data-testid="genre-page"], .main-home-content, [data-testid="home-page"], [data-testid="genre-page"], .main-view-container__scroll-node-child > main, .main-view-container__scroll-node-child, main'
    );
}

function getActiveHomeTab() {
    try {
        const hist = window.Spicetify?.Platform?.History?.location || window.location;
        const search = hist?.search || window.location.search || "";
        const pathname = hist?.pathname || window.location.pathname || "";

        const params = new URLSearchParams(search);
        const facet = (params.get("facet") || "").toLowerCase();

        if (facet === "music" || pathname.includes("0JQ5DAqbMKFSi39LMRT0Cy")) {
            return "music";
        }
        if (facet === "podcasts" || pathname.includes("0JQ5DArNBzkmxXHCqFLx2J")) {
            return "podcasts";
        }

        const mainEl = getHomeMainEl();
        if (mainEl) {
            const activeChip = mainEl.querySelector(
                '.S2e77KLs4Na3yTiaIZgI [aria-checked="true"], .YOYIfKkABUDGQ5vQmg7y [aria-checked="true"], .S2e77KLs4Na3yTiaIZgI [aria-selected="true"], .YOYIfKkABUDGQ5vQmg7y [aria-selected="true"], .S2e77KLs4Na3yTiaIZgI [class*="selected"], .YOYIfKkABUDGQ5vQmg7y [class*="selected"], [data-encore-id="chip"][aria-checked="true"], [data-encore-id="chip"][aria-selected="true"]'
            );
            if (activeChip) {
                const txt = (activeChip.textContent || activeChip.getAttribute("aria-label") || "").toLowerCase().trim();
                if (txt.includes("nhạc") || txt.includes("music") || txt.includes("âm nhạc")) return "music";
                if (txt.includes("podcast")) return "podcasts";
                if (txt.includes("tất cả") || txt.includes("all")) return "all";
            }
        }

        if (pathname === "/" || pathname === "/home" || pathname.startsWith("/home")) {
            return "all";
        }
    } catch (_) { }
    return null;
}

function isRecommendationRoute() {
    try {
        const hist = window.Spicetify?.Platform?.History?.location || window.location;
        const pathname = hist?.pathname || window.location.pathname || "";
        return (
            pathname === "/" ||
            pathname === "/home" ||
            pathname.startsWith("/home?") ||
            pathname.startsWith("/home/") ||
            pathname.includes("0JQ5DAqbMKFSi39LMRT0Cy") ||
            pathname.includes("0JQ5DArNBzkmxXHCqFLx2J")
        );
    } catch (_) {
        return false;
    }
}

function findNativeChip(type) {
    try {
        const mainEl = getHomeMainEl();
        if (!mainEl) return null;

        const nativeRow = mainEl.querySelector(
            '.S2e77KLs4Na3yTiaIZgI, .YOYIfKkABUDGQ5vQmg7y, .main-home-filterChipsContainer, .EM9V2npqr6_18FGhODtx, .gig6fTpg9wjxwnYIkuMg, [data-encore-id="chipList"]'
        );

        let candidates = [];
        if (nativeRow) {
            candidates = Array.from(nativeRow.querySelectorAll(
                'button, [data-encore-id="chip"], [class*="chip"]'
            )).filter(el => !el.closest('#we-home-quick-tabs'));
        } else {
            candidates = Array.from(mainEl.querySelectorAll(
                '[data-encore-id="chip"]'
            )).filter(el => !el.closest('#we-home-quick-tabs'));
        }

        return candidates.find(btn => {
            const text = (btn.textContent || btn.getAttribute("aria-label") || "").toLowerCase().trim();
            if (!text) return false;
            if (type === "all") {
                return text === "all" || text === "tất cả" || (text.startsWith("all") && !text.includes("installed") && !text.includes("album"));
            }
            if (type === "music") {
                return text === "music" || text === "nhạc" || text.includes("âm nhạc") || (text.includes("music") && !text.includes("search"));
            }
            if (type === "podcasts") {
                return text === "podcasts" || text === "podcast" || text.includes("podcast");
            }
            return false;
        });
    } catch (_) {
        return null;
    }
}

function switchHomeTab(tabId) {
    if (isNavigating) return;

    const active = getActiveHomeTab();
    if (active === tabId) {
        const scrollEl = document.querySelector(
            '.main-view-container__scroll-node, [data-overlayscrollbars-viewport], .os-viewport, .Root__main-view .os-viewport'
        );
        if (scrollEl) {
            scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
    }

    isNavigating = true;
    setTimeout(() => {
        isNavigating = false;
    }, 500);

    const nativeChip = findNativeChip(tabId);
    if (nativeChip) {
        try {
            nativeChip.click();
            return;
        } catch (_) { }
    }

    if (window.Spicetify?.Platform?.History) {
        const hist = window.Spicetify.Platform.History;
        try {
            if (tabId === "all") {
                hist.push("/");
            } else if (tabId === "music") {
                hist.push("/home?facet=music");
            } else if (tabId === "podcasts") {
                hist.push("/home?facet=podcasts");
            }
        } catch (_) { }
    }
}

function getTabLabels() {
    const pref = settings.homeQuickTabsLang || "auto";
    let isVi = false;
    if (pref === "vi") {
        isVi = true;
    } else if (pref === "en") {
        isVi = false;
    } else {
        const detected = (window.Spicetify?.Locale?.getLocale?.() || document.documentElement.lang || "en").toLowerCase();
        isVi = detected.startsWith("vi");
    }

    return {
        isVi,
        all: isVi ? "Tất cả" : "All",
        music: isVi ? "Nhạc" : "Music",
        podcasts: isVi ? "Podcasts" : "Podcasts"
    };
}

function updateHomeQuickTabs() {
    if (settings.homeQuickTabs === false || !isRecommendationRoute()) {
        const existing = document.getElementById("we-home-quick-tabs");
        if (existing) existing.remove();
        return;
    }

    const mainEl = getHomeMainEl();
    if (!mainEl) return;

    mainEl.querySelectorAll(
        '.S2e77KLs4Na3yTiaIZgI, .YOYIfKkABUDGQ5vQmg7y, .main-home-filterChipsContainer, .EM9V2npqr6_18FGhODtx, .gig6fTpg9wjxwnYIkuMg, [data-encore-id="chipList"]'
    ).forEach(el => {
        if (el.style.display === 'none') el.style.display = '';
        if (el.style.visibility === 'hidden') el.style.visibility = '';
    });

    const hasNativeMusic = findNativeChip("music");
    const hasNativeAll = findNativeChip("all");
    const hasNativePodcasts = findNativeChip("podcasts");

    if (hasNativeMusic || (hasNativeAll && hasNativePodcasts)) {
        const existing = document.getElementById("we-home-quick-tabs");
        if (existing) existing.remove();
        return;
    }

    const activeTab = getActiveHomeTab() || "all";
    const labels = getTabLabels();

    let container = document.getElementById("we-home-quick-tabs");
    if (!container) {
        container = document.createElement("nav");
        container.id = "we-home-quick-tabs";
        container.className = "we-home-quick-tabs";
        container.setAttribute("aria-label", labels.isVi ? "Bộ lọc Đề xuất" : "Home recommendation filters");

        const ul = document.createElement("ul");
        ul.className = "we-home-quick-tabs-list";
        ul.setAttribute("role", "tablist");

        RECOMMENDATION_TABS.forEach(tab => {
            const li = document.createElement("li");
            li.className = "we-home-quick-tab-item";
            li.setAttribute("role", "presentation");

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `we-home-quick-tab-btn ${tab.id === activeTab ? "active" : ""}`;
            btn.setAttribute("role", "tab");
            btn.setAttribute("aria-selected", tab.id === activeTab ? "true" : "false");
            btn.setAttribute("data-tab", tab.id);

            const span = document.createElement("span");
            span.textContent = labels[tab.id];
            btn.appendChild(span);

            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                container.querySelectorAll(".we-home-quick-tab-btn").forEach(b => {
                    b.classList.remove("active");
                    b.setAttribute("aria-selected", "false");
                });
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");
                switchHomeTab(tab.id);
            });

            li.appendChild(btn);
            ul.appendChild(li);
        });

        container.appendChild(ul);

        const nativeContainer = mainEl.querySelector('.YOYIfKkABUDGQ5vQmg7y, .S2e77KLs4Na3yTiaIZgI, .EM9V2npqr6_18FGhODtx, .gig6fTpg9wjxwnYIkuMg, [data-encore-id="chipList"]');
        if (nativeContainer) {
            nativeContainer.parentNode.insertBefore(container, nativeContainer);
        } else if (mainEl.firstChild) {
            mainEl.insertBefore(container, mainEl.firstChild);
        } else {
            mainEl.appendChild(container);
        }
    } else {
        if (!mainEl.contains(container)) {
            if (mainEl.firstChild) {
                mainEl.insertBefore(container, mainEl.firstChild);
            } else {
                mainEl.appendChild(container);
            }
        }

        container.querySelectorAll(".we-home-quick-tab-btn").forEach(btn => {
            const tabId = btn.getAttribute("data-tab");
            const isActive = tabId === activeTab;
            btn.classList.toggle("active", isActive);
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
            const span = btn.querySelector("span");
            if (span && labels[tabId]) {
                span.textContent = labels[tabId];
            }
        });
    }
}

function setupHomeFeedQuickTabs() {
    window.__we_update_home_quick_tabs__ = updateHomeQuickTabs;

    updateHomeQuickTabs();
    setInterval(updateHomeQuickTabs, 350);

    if (window.Spicetify && window.Spicetify.Platform && window.Spicetify.Platform.History) {
        window.Spicetify.Platform.History.listen(() => {
            setTimeout(updateHomeQuickTabs, 50);
            setTimeout(updateHomeQuickTabs, 200);
            setTimeout(updateHomeQuickTabs, 500);
        });
    }
}

    const MARKETPLACE_TABS = [
    { id: "Extensions", label: "Extensions" },
    { id: "Themes", label: "Themes" },
    { id: "Snippets", label: "Snippets" },
    { id: "Apps", label: "Apps" },
    { id: "Installed", label: "Installed" }
];

function setupMarketplaceQuickTabs() {
    let checkInterval = null;

    function getActiveTab() {
        try {
            const nativeActive = document.querySelector('.marketplace-tabBar .marketplace-tabBar-active')?.closest('[data-tab]');
            if (nativeActive) {
                const tabAttr = nativeActive.getAttribute('data-tab');
                if (tabAttr) return tabAttr;
            }
            return localStorage.getItem("marketplace:active-tab") || "Extensions";
        } catch (_) {
            return "Extensions";
        }
    }

    function switchTab(tabId) {
        try {
            localStorage.setItem("marketplace:active-tab", tabId);
        } catch (_) {}

        const nativeTabBar = document.querySelector(".marketplace-tabBar");
        if (nativeTabBar) {
            const item = nativeTabBar.querySelector(`.marketplace-tabBar-headerItem[data-tab="${tabId}"]`);
            if (item) {
                item.click();
                const link = item.querySelector("a");
                if (link) link.click();
                return;
            }

            const moreControl = nativeTabBar.querySelector(".Dropdown-control");
            if (moreControl) {
                moreControl.click();
                setTimeout(() => {
                    const option = Array.from(document.querySelectorAll(".Dropdown-option")).find(
                        opt => (opt.textContent || "").trim().toLowerCase() === tabId.toLowerCase()
                    );
                    if (option) option.click();
                }, 10);
                return;
            }
        }

        if (window.Spicetify && window.Spicetify.Platform && window.Spicetify.Platform.History) {
            const loc = window.Spicetify.Platform.History.location;
            if (loc && loc.pathname === "/marketplace") {
                window.Spicetify.Platform.History.replace("/marketplace");
            }
        }
    }

    function updateQuickTabs() {
        const header = document.querySelector(".marketplace-header");
        if (!header) return;

        const nativeTabBar = document.querySelector(".marketplace-tabBar");
        if (nativeTabBar) {
            nativeTabBar.classList.add("we-hidden-bridge");
            nativeTabBar.style.setProperty("position", "fixed", "important");
            nativeTabBar.style.setProperty("top", "0", "important");
            nativeTabBar.style.setProperty("left", "0", "important");
            nativeTabBar.style.setProperty("opacity", "0", "important");
            nativeTabBar.style.setProperty("pointer-events", "none", "important");
            nativeTabBar.style.setProperty("width", "0px", "important");
            nativeTabBar.style.setProperty("height", "0px", "important");
            nativeTabBar.style.setProperty("overflow", "hidden", "important");
            nativeTabBar.style.setProperty("z-index", "-9999", "important");
        }

        let container = header.querySelector("#marketplace-quick-tabs-container");
        if (!container) {
            container = document.createElement("nav");
            container.id = "marketplace-quick-tabs-container";
            container.className = "marketplace-quick-tabs";

            const ul = document.createElement("ul");
            ul.className = "marketplace-quick-tabs-list";

            const activeTab = getActiveTab();

            MARKETPLACE_TABS.forEach(tab => {
                const li = document.createElement("li");
                li.className = "marketplace-quick-tab-item";

                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = `marketplace-quick-tab-btn ${tab.id === activeTab ? "active" : ""}`;
                btn.setAttribute("data-tab", tab.id);

                const span = document.createElement("span");
                span.textContent = tab.label;
                btn.appendChild(span);

                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    ul.querySelectorAll(".marketplace-quick-tab-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    switchTab(tab.id);
                });

                li.appendChild(btn);
                ul.appendChild(li);
            });

            container.appendChild(ul);

            const rightSide = header.querySelector(".marketplace-header__right");
            if (rightSide) {
                header.insertBefore(container, rightSide);
            } else {
                header.appendChild(container);
            }
        } else {
            const currentTab = getActiveTab();
            container.querySelectorAll(".marketplace-quick-tab-btn").forEach(btn => {
                const isActive = btn.getAttribute("data-tab") === currentTab;
                btn.classList.toggle("active", isActive);
            });
        }
    }

    function startWatcher() {
        if (checkInterval) clearInterval(checkInterval);
        checkInterval = setInterval(() => {
            const path = window.location?.pathname || window.Spicetify?.Platform?.History?.location?.pathname;
            if (path && path.includes("marketplace")) {
                updateQuickTabs();
            }
        }, 250);
    }

    startWatcher();

    if (window.Spicetify && window.Spicetify.Platform && window.Spicetify.Platform.History) {
        window.Spicetify.Platform.History.listen((location) => {
            if (location.pathname && location.pathname.includes("marketplace")) {
                setTimeout(updateQuickTabs, 50);
                setTimeout(updateQuickTabs, 200);
            }
        });
    }
}

    function updateTopbarPauseBtn() {
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

function updateTopbarSourceBtn() {
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

function setupTopBarControls() {
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

function setupSidebarControls() {
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
                    <path d="M151.909 72.923v6.5h10.097l8.663 44.567h48.968v-6.5h-43.61l-1.2-6.172h42.974l10.35-33.91h-59.915l-.872-4.485H151.91zm17.59 10.984h49.867l-6.393 20.91h-39.409l-4.064-20.91zm5.626 44.11a6.5 6.5 0 0 0-6.5 6.5 6.5 0 0 0 6.5 6.501 6.5 6.5 0 0 0 6.5-6.5 6.5 6.5 0 0 0-6.5-6.5zm38.274 0a6.5 6.5 0 0 0-6.5 6.5 6.5 0 0 0 6.5 6.501 6.5 6.5 0 0 0 6.5-6.5 6.5 6.5 0 0 0-6.5-6.5z" transform="translate(-151.909 -72.923)"/>
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

function setupUI() {
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

    if (!document.getElementById("we-float-btn")) {
        const btn = document.createElement("button");
        btn.id = "we-float-btn";
        btn.title = "Wallpaper Settings (Ctrl+Shift+W)";
        btn.innerHTML = `<span>Wallpaper</span>`;
        btn.onclick = openModal;
        document.body.appendChild(btn);
    }

    setupTopBarControls();
    setupSidebarControls();

    document.addEventListener("dragover", (e) => { e.preventDefault(); });
    document.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
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

    function openModal() {
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

    function setupOfflineHandler() {
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

    function injectStyles(cssContent) {
    let style = document.getElementById("we-styles");
    if (!style) {
        style = document.createElement("style");
        style.id = "we-styles";
        const target = document.head || document.documentElement;
        if (target) {
            target.appendChild(style);
        }
    }
    style.textContent = cssContent;
}

function initExtension(cssContent) {
    try {
        injectStyles(cssContent);
    } catch (_) {}

    if (window.__WALLPAPER_ENGINE_INITIALIZED__) return;
    window.__WALLPAPER_ENGINE_INITIALIZED__ = true;

    try {
        setupOfflineHandler();
    } catch (_) {}

    function safeInit() {
        if (!document.body) {
            setTimeout(safeInit, 200);
            return;
        }
        loadSettings();
        setupContainer();
        setupUI();
        setupScrollWatcher();
        setupHomeFeedQuickTabs();
        setupMarketplaceQuickTabs();
        startAutoSyncWatcher();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", safeInit);
    } else {
        setTimeout(safeInit, 200);
    }
}

    initExtension(THEME_CSS);
})();
