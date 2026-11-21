const MARKETPLACE_TABS = [
    { id: "Extensions", label: "Extensions" },
    { id: "Themes", label: "Themes" },
    { id: "Snippets", label: "Snippets" },
    { id: "Apps", label: "Apps" },
    { id: "Installed", label: "Installed" }
];

export function setupMarketplaceQuickTabs() {
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
                moreControl.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
                moreControl.click();
                let tries = 0;
                const tryPickOption = () => {
                    const option = Array.from(nativeTabBar.querySelectorAll(".Dropdown-option")).concat(
                        Array.from(document.querySelectorAll(".Dropdown-menu .Dropdown-option"))
                    ).find(
                        opt => (opt.textContent || "").trim().toLowerCase() === tabId.toLowerCase()
                    );
                    if (option) {
                        option.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
                        option.click();
                    } else if (++tries < 6) {
                        setTimeout(tryPickOption, 30);
                    }
                };
                setTimeout(tryPickOption, 20);
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
            nativeTabBar.style.setProperty("top", "-9999px", "important");
            nativeTabBar.style.setProperty("left", "-9999px", "important");
            nativeTabBar.style.setProperty("opacity", "0", "important");
            nativeTabBar.style.setProperty("pointer-events", "none", "important");
            nativeTabBar.style.setProperty("width", "900px", "important");
            nativeTabBar.style.setProperty("height", "48px", "important");
            nativeTabBar.style.setProperty("overflow", "visible", "important");
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
