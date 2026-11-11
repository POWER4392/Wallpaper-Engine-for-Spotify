import { fetchSpicetifyColor, extractAlbumColor } from './colorSync.js';

export function setupScrollWatcher() {
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
