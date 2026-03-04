(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // ../ahmadcss/ahmadcss/public/js/ahmadcss.bundle.js
  var require_ahmadcss_bundle = __commonJS({
    "../ahmadcss/ahmadcss/public/js/ahmadcss.bundle.js"() {
      (function() {
        "use strict";
        const CONFIG = {
          version: "17.0",
          navbarHeight: 52,
          pageHeadHeight: 60,
          sidebarWidth: 260,
          animationDuration: 250,
          toastDuration: 4e3,
          storagePrefix: "ahmadcss_"
        };
        const Permissions = {
          isAdmin() {
            var _a;
            if (!window.frappe || !frappe.user)
              return false;
            const roles = frappe.user_roles || [];
            return roles.includes("System Manager") || roles.includes("Administrator") || ((_a = frappe.session) == null ? void 0 : _a.user) === "Administrator";
          },
          canEditTheme() {
            return this.isAdmin();
          }
        };
        const Storage = {
          get(key, defaultValue = null) {
            var _a, _b;
            try {
              const value = localStorage.getItem(CONFIG.storagePrefix + key);
              return value !== null ? JSON.parse(value) : defaultValue;
            } catch (e) {
              if ((_b = (_a = window.frappe) == null ? void 0 : _a.boot) == null ? void 0 : _b.developer_mode) {
                console.warn("AhmadCSS Storage.get error:", e);
              }
              return defaultValue;
            }
          },
          set(key, value) {
            var _a, _b;
            try {
              localStorage.setItem(CONFIG.storagePrefix + key, JSON.stringify(value));
              return true;
            } catch (e) {
              if ((_b = (_a = window.frappe) == null ? void 0 : _a.boot) == null ? void 0 : _b.developer_mode) {
                console.warn("AhmadCSS Storage.set error:", e);
              }
              return false;
            }
          },
          remove(key) {
            var _a, _b;
            try {
              localStorage.removeItem(CONFIG.storagePrefix + key);
              return true;
            } catch (e) {
              if ((_b = (_a = window.frappe) == null ? void 0 : _a.boot) == null ? void 0 : _b.developer_mode) {
                console.warn("AhmadCSS Storage.remove error:", e);
              }
              return false;
            }
          }
        };
        const DarkMode = {
          isEnabled: false,
          init() {
            const saved = Storage.get("dark_mode");
            if (saved !== null) {
              this.isEnabled = saved;
            } else {
              this.isEnabled = window.matchMedia("(prefers-color-scheme: dark)").matches;
            }
            this.apply();
            this.createToggleButton();
            this.listenSystemChange();
          },
          apply() {
            if (this.isEnabled) {
              document.documentElement.setAttribute("data-theme", "dark");
              document.body.classList.add("ahmadcss-dark");
            } else {
              document.documentElement.setAttribute("data-theme", "light");
              document.body.classList.remove("ahmadcss-dark");
            }
          },
          toggle() {
            this.isEnabled = !this.isEnabled;
            Storage.set("dark_mode", this.isEnabled);
            this.apply();
            this.updateToggleButton();
            if (Permissions.isAdmin() && window.frappe && frappe.call) {
              frappe.call({
                method: "ahmadcss.ahmadcss.doctype.ahmadcss_settings.ahmadcss_settings.toggle_dark_mode",
                async: true
              });
            }
            Toast.show({
              message: this.isEnabled ? __("Dark mode enabled") + " \u{1F319}" : __("Light mode enabled") + " \u2600\uFE0F",
              type: "info"
            });
          },
          createToggleButton() {
            if (window.location.pathname === "/login" || window.location.pathname === "/login/" || document.body.classList.contains("login-page") || document.querySelector(".login-content")) {
              return;
            }
            if (!Permissions.isAdmin()) {
              return;
            }
            const navbar = document.querySelector(".navbar");
            if (!navbar || document.querySelector(".ahmadcss-darkmode-toggle"))
              return;
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "ahmadcss-darkmode-toggle";
            toggleBtn.setAttribute("aria-label", "Toggle Dark Mode");
            toggleBtn.innerHTML = this.getIcon();
            toggleBtn.addEventListener("click", () => this.toggle());
            const navRight = navbar.querySelector(".navbar-right") || navbar.querySelector(".nav-right") || navbar;
            navRight.appendChild(toggleBtn);
          },
          updateToggleButton() {
            const btn = document.querySelector(".ahmadcss-darkmode-toggle");
            if (btn) {
              btn.innerHTML = this.getIcon();
            }
          },
          getIcon() {
            return this.isEnabled ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
          },
          listenSystemChange() {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
              if (Storage.get("dark_mode") === null) {
                this.isEnabled = e.matches;
                this.apply();
                this.updateToggleButton();
              }
            });
          }
        };
        const Toast = {
          container: null,
          init() {
            this.createContainer();
          },
          createContainer() {
            if (document.querySelector(".ahmadcss-toast-container"))
              return;
            this.container = document.createElement("div");
            this.container.className = "ahmadcss-toast-container";
            document.body.appendChild(this.container);
          },
          show({ message, type = "info", duration = CONFIG.toastDuration, title = null }) {
            if (!this.container)
              this.createContainer();
            const toast = document.createElement("div");
            toast.className = `ahmadcss-toast ahmadcss-toast-${type}`;
            const icons = {
              success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
              error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
              warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
              info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
            };
            const iconDiv = document.createElement("div");
            iconDiv.className = "ahmadcss-toast-icon";
            iconDiv.innerHTML = icons[type] || icons.info;
            const contentDiv = document.createElement("div");
            contentDiv.className = "ahmadcss-toast-content";
            if (title) {
              const titleDiv = document.createElement("div");
              titleDiv.className = "ahmadcss-toast-title";
              titleDiv.textContent = title;
              contentDiv.appendChild(titleDiv);
            }
            const messageDiv = document.createElement("div");
            messageDiv.className = "ahmadcss-toast-message";
            messageDiv.textContent = message;
            contentDiv.appendChild(messageDiv);
            const closeBtn = document.createElement("button");
            closeBtn.className = "ahmadcss-toast-close";
            closeBtn.setAttribute("aria-label", "Close");
            closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
            const progressDiv = document.createElement("div");
            progressDiv.className = "ahmadcss-toast-progress";
            toast.appendChild(iconDiv);
            toast.appendChild(contentDiv);
            toast.appendChild(closeBtn);
            toast.appendChild(progressDiv);
            closeBtn.addEventListener("click", () => {
              this.dismiss(toast);
            });
            setTimeout(() => this.dismiss(toast), duration);
            progressDiv.style.animation = `ahmadcss-toast-progress ${duration}ms linear forwards`;
            this.container.appendChild(toast);
            requestAnimationFrame(() => {
              toast.classList.add("ahmadcss-toast-show");
            });
            return toast;
          },
          dismiss(toast) {
            toast.classList.remove("ahmadcss-toast-show");
            toast.classList.add("ahmadcss-toast-hide");
            setTimeout(() => toast.remove(), 300);
          },
          success(message, title = null) {
            return this.show({ message, type: "success", title });
          },
          error(message, title = null) {
            return this.show({ message, type: "error", title });
          },
          warning(message, title = null) {
            return this.show({ message, type: "warning", title });
          },
          info(message, title = null) {
            return this.show({ message, type: "info", title });
          }
        };
        const Skeleton = {
          show(container, options = {}) {
            const {
              rows = 3,
              avatar = false,
              type = "lines"
            } = options;
            const element = typeof container === "string" ? document.querySelector(container) : container;
            if (!element)
              return null;
            const skeleton = document.createElement("div");
            skeleton.className = "ahmadcss-skeleton-wrapper";
            skeleton.innerHTML = this.getTemplate(type, rows, avatar);
            element.innerHTML = "";
            element.appendChild(skeleton);
            return skeleton;
          },
          hide(container) {
            const element = typeof container === "string" ? document.querySelector(container) : container;
            if (!element)
              return;
            const skeleton = element.querySelector(".ahmadcss-skeleton-wrapper");
            if (skeleton) {
              skeleton.classList.add("ahmadcss-skeleton-fade");
              setTimeout(() => skeleton.remove(), 300);
            }
          },
          getTemplate(type, rows, avatar) {
            switch (type) {
              case "card":
                return `
                        <div class="ahmadcss-skeleton-card">
                            <div class="ahmadcss-skeleton ahmadcss-skeleton-image"></div>
                            <div class="ahmadcss-skeleton-body">
                                <div class="ahmadcss-skeleton ahmadcss-skeleton-title"></div>
                                <div class="ahmadcss-skeleton ahmadcss-skeleton-text"></div>
                                <div class="ahmadcss-skeleton ahmadcss-skeleton-text" style="width: 60%"></div>
                            </div>
                        </div>
                    `;
              case "table":
                let tableRows = "";
                for (let i = 0; i < rows; i++) {
                  tableRows += `
                            <div class="ahmadcss-skeleton-table-row">
                                <div class="ahmadcss-skeleton ahmadcss-skeleton-cell" style="width: 15%"></div>
                                <div class="ahmadcss-skeleton ahmadcss-skeleton-cell" style="width: 25%"></div>
                                <div class="ahmadcss-skeleton ahmadcss-skeleton-cell" style="width: 35%"></div>
                                <div class="ahmadcss-skeleton ahmadcss-skeleton-cell" style="width: 15%"></div>
                            </div>
                        `;
                }
                return `<div class="ahmadcss-skeleton-table">${tableRows}</div>`;
              case "form":
                let fields = "";
                for (let i = 0; i < rows; i++) {
                  fields += `
                            <div class="ahmadcss-skeleton-field">
                                <div class="ahmadcss-skeleton ahmadcss-skeleton-label"></div>
                                <div class="ahmadcss-skeleton ahmadcss-skeleton-input"></div>
                            </div>
                        `;
                }
                return `<div class="ahmadcss-skeleton-form">${fields}</div>`;
              default:
                let lines = "";
                if (avatar) {
                  lines += '<div class="ahmadcss-skeleton ahmadcss-skeleton-avatar"></div>';
                }
                lines += '<div class="ahmadcss-skeleton-lines">';
                for (let i = 0; i < rows; i++) {
                  const width = i === rows - 1 ? "60%" : 90 - i * 10 + "%";
                  lines += `<div class="ahmadcss-skeleton ahmadcss-skeleton-line" style="width: ${width}"></div>`;
                }
                lines += "</div>";
                return lines;
            }
          }
        };
        const ThemeCustomizer = {
          isOpen: false,
          panel: null,
          init() {
            this.createPanel();
            this.createToggleButton();
            this.loadSavedTheme();
          },
          createPanel() {
            if (document.querySelector(".ahmadcss-customizer"))
              return;
            this.panel = document.createElement("div");
            this.panel.className = "ahmadcss-customizer";
            this.panel.innerHTML = `
                <div class="ahmadcss-customizer-header">
                    <h3>\u{1F3A8} Theme Customizer</h3>
                    <button class="ahmadcss-customizer-close" aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="ahmadcss-customizer-body">
                    <div class="ahmadcss-customizer-section">
                        <label>Primary Color</label>
                        <input type="color" id="ahmadcss-primary-color" value="#0f766e">
                    </div>
                    <div class="ahmadcss-customizer-section">
                        <label>Secondary Color</label>
                        <input type="color" id="ahmadcss-secondary-color" value="#d97706">
                    </div>
                    <div class="ahmadcss-customizer-section">
                        <label>Glass Blur: <span id="blur-value">20</span>px</label>
                        <input type="range" id="ahmadcss-blur" min="0" max="50" value="20">
                    </div>
                    <div class="ahmadcss-customizer-section">
                        <label>Glass Opacity: <span id="opacity-value">72</span>%</label>
                        <input type="range" id="ahmadcss-opacity" min="30" max="100" value="72">
                    </div>
                    <div class="ahmadcss-customizer-section">
                        <label>Border Radius: <span id="radius-value">16</span>px</label>
                        <input type="range" id="ahmadcss-radius" min="0" max="30" value="16">
                    </div>
                </div>
                <div class="ahmadcss-customizer-footer">
                    <button class="ahmadcss-btn ahmadcss-btn-secondary" id="ahmadcss-reset">Reset</button>
                    <button class="ahmadcss-btn ahmadcss-btn-primary" id="ahmadcss-save">Save</button>
                </div>
            `;
            document.body.appendChild(this.panel);
            this.bindEvents();
          },
          bindEvents() {
            this.panel.querySelector(".ahmadcss-customizer-close").addEventListener("click", () => this.close());
            this.panel.querySelector("#ahmadcss-primary-color").addEventListener("input", (e) => {
              this.updateCSS("--primary-600", e.target.value);
            });
            this.panel.querySelector("#ahmadcss-secondary-color").addEventListener("input", (e) => {
              this.updateCSS("--secondary-500", e.target.value);
            });
            this.panel.querySelector("#ahmadcss-blur").addEventListener("input", (e) => {
              document.getElementById("blur-value").textContent = e.target.value;
              this.updateCSS("--glass-blur", e.target.value + "px");
            });
            this.panel.querySelector("#ahmadcss-opacity").addEventListener("input", (e) => {
              document.getElementById("opacity-value").textContent = e.target.value;
              const opacity = e.target.value / 100;
              this.updateCSS("--glass-white", `rgba(255, 255, 255, ${opacity})`);
            });
            this.panel.querySelector("#ahmadcss-radius").addEventListener("input", (e) => {
              document.getElementById("radius-value").textContent = e.target.value;
              this.updateCSS("--radius-lg", e.target.value + "px");
            });
            this.panel.querySelector("#ahmadcss-save").addEventListener("click", () => this.saveTheme());
            this.panel.querySelector("#ahmadcss-reset").addEventListener("click", () => this.resetTheme());
          },
          updateCSS(property, value) {
            document.documentElement.style.setProperty(property, value);
          },
          saveTheme() {
            const theme = {
              primaryColor: this.panel.querySelector("#ahmadcss-primary-color").value,
              secondaryColor: this.panel.querySelector("#ahmadcss-secondary-color").value,
              blur: this.panel.querySelector("#ahmadcss-blur").value,
              opacity: this.panel.querySelector("#ahmadcss-opacity").value,
              radius: this.panel.querySelector("#ahmadcss-radius").value
            };
            Storage.set("custom_theme", theme);
            Toast.success(__("Theme saved successfully") + " \u2728");
          },
          loadSavedTheme() {
            const theme = Storage.get("custom_theme");
            if (!theme)
              return;
            this.updateCSS("--primary-600", theme.primaryColor);
            this.updateCSS("--secondary-500", theme.secondaryColor);
            this.updateCSS("--glass-blur", theme.blur + "px");
            this.updateCSS("--glass-white", `rgba(255, 255, 255, ${theme.opacity / 100})`);
            this.updateCSS("--radius-lg", theme.radius + "px");
            if (this.panel) {
              this.panel.querySelector("#ahmadcss-primary-color").value = theme.primaryColor;
              this.panel.querySelector("#ahmadcss-secondary-color").value = theme.secondaryColor;
              this.panel.querySelector("#ahmadcss-blur").value = theme.blur;
              this.panel.querySelector("#ahmadcss-opacity").value = theme.opacity;
              this.panel.querySelector("#ahmadcss-radius").value = theme.radius;
              document.getElementById("blur-value").textContent = theme.blur;
              document.getElementById("opacity-value").textContent = theme.opacity;
              document.getElementById("radius-value").textContent = theme.radius;
            }
          },
          resetTheme() {
            Storage.remove("custom_theme");
            location.reload();
          },
          createToggleButton() {
            if (!Permissions.isAdmin()) {
              return;
            }
            const navbar = document.querySelector(".navbar");
            if (!navbar || document.querySelector(".ahmadcss-customizer-toggle"))
              return;
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "ahmadcss-customizer-toggle";
            toggleBtn.setAttribute("aria-label", "Theme Customizer");
            toggleBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
            toggleBtn.addEventListener("click", () => this.toggle());
            const navRight = navbar.querySelector(".navbar-right") || navbar.querySelector(".nav-right") || navbar;
            navRight.appendChild(toggleBtn);
          },
          toggle() {
            this.isOpen = !this.isOpen;
            this.panel.classList.toggle("ahmadcss-customizer-open", this.isOpen);
          },
          close() {
            this.isOpen = false;
            this.panel.classList.remove("ahmadcss-customizer-open");
          }
        };
        const RippleEffect = {
          init() {
            document.addEventListener("click", this.handleClick.bind(this));
            this.injectStyles();
          },
          handleClick(e) {
            const target = e.target.closest(".btn, .shortcut-widget-box, .standard-sidebar-item, .ahmadcss-btn");
            if (!target)
              return;
            const ripple = document.createElement("span");
            ripple.className = "ahmadcss-ripple";
            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                pointer-events: none;
                animation: ahmadcss-ripple 0.6s ease-out;
            `;
            const originalPosition = getComputedStyle(target).position;
            if (originalPosition === "static") {
              target.style.position = "relative";
            }
            target.style.overflow = "hidden";
            target.appendChild(ripple);
            setTimeout(() => {
              ripple.remove();
              if (originalPosition === "static") {
                target.style.position = "";
              }
            }, 600);
          },
          injectStyles() {
            if (document.getElementById("ahmadcss-ripple-styles"))
              return;
            const style = document.createElement("style");
            style.id = "ahmadcss-ripple-styles";
            style.textContent = `
                @keyframes ahmadcss-ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
          }
        };
        const SmoothScroll = {
          init() {
            document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
              anchor.addEventListener("click", function(e) {
                const targetId = this.getAttribute("href");
                if (targetId === "#")
                  return;
                const target = document.querySelector(targetId);
                if (target) {
                  e.preventDefault();
                  target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  });
                }
              });
            });
          }
        };
        const SidebarToggle = {
          isCollapsed: false,
          init() {
            this.isCollapsed = Storage.get("sidebar_collapsed", false);
            if (this.isCollapsed) {
              this.collapse();
            }
            this.bindFrappeToggle();
            this.bindCustomToggle();
          },
          bindFrappeToggle() {
            const bindToggle = () => {
              const toggleBtns = document.querySelectorAll('.sidebar-toggle-btn, .sidebar-toggle-placeholder, [data-action="toggle-sidebar"]');
              toggleBtns.forEach((btn) => {
                if (btn.dataset.ahmadcssBound)
                  return;
                btn.dataset.ahmadcssBound = "true";
                btn.addEventListener("click", (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.toggle();
                });
              });
            };
            bindToggle();
            if (window.frappe && frappe.router) {
              frappe.router.on("change", () => {
                setTimeout(bindToggle, 100);
              });
            }
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                  bindToggle();
                }
              });
            });
            observer.observe(document.body, { childList: true, subtree: true });
            $(document.body).on("toggleSidebar", () => {
              const sidebar = document.querySelector(".layout-side-section");
              const isVisible = sidebar && window.getComputedStyle(sidebar).display !== "none" && !sidebar.classList.contains("ahmadcss-sidebar-collapsed");
              if (!isVisible) {
                document.body.classList.add("sidebar-collapsed");
              } else {
                document.body.classList.remove("sidebar-collapsed");
              }
            });
          },
          bindCustomToggle() {
            document.addEventListener("click", (e) => {
              const target = e.target.closest(".ahmadcss-sidebar-toggle");
              if (target) {
                e.preventDefault();
                this.toggle();
              }
            });
          },
          toggle() {
            this.isCollapsed = !this.isCollapsed;
            Storage.set("sidebar_collapsed", this.isCollapsed);
            if (this.isCollapsed) {
              this.collapse();
            } else {
              this.expand();
            }
          },
          collapse() {
            const sidebar = document.querySelector(".layout-side-section");
            const mainSection = document.querySelector(".layout-main-section-wrapper");
            if (sidebar) {
              sidebar.classList.add("ahmadcss-sidebar-collapsed");
              sidebar.style.setProperty("display", "none", "important");
              sidebar.style.setProperty("width", "0", "important");
              sidebar.style.setProperty("max-width", "0", "important");
            }
            if (mainSection) {
              mainSection.classList.add("ahmadcss-sidebar-collapsed");
              mainSection.style.setProperty("max-width", "100%", "important");
              mainSection.style.setProperty("flex", "1 1 100%", "important");
              mainSection.style.setProperty("width", "100%", "important");
            }
            document.body.classList.add("sidebar-collapsed");
          },
          expand() {
            const sidebar = document.querySelector(".layout-side-section");
            const mainSection = document.querySelector(".layout-main-section-wrapper");
            if (sidebar) {
              sidebar.classList.remove("ahmadcss-sidebar-collapsed");
              sidebar.style.removeProperty("display");
              sidebar.style.removeProperty("width");
              sidebar.style.removeProperty("max-width");
            }
            if (mainSection) {
              mainSection.classList.remove("ahmadcss-sidebar-collapsed");
              mainSection.style.removeProperty("max-width");
              mainSection.style.removeProperty("flex");
              mainSection.style.removeProperty("width");
            }
            document.body.classList.remove("sidebar-collapsed");
          }
        };
        const MobileSidebar = {
          toggleBtn: null,
          init() {
            this.createToggleButton();
            this.bindEvents();
          },
          createToggleButton() {
            const navbar = document.querySelector(".navbar");
            if (!navbar || document.querySelector(".ahmadcss-sidebar-toggle"))
              return;
            this.toggleBtn = document.createElement("button");
            this.toggleBtn.className = "ahmadcss-sidebar-toggle";
            this.toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
            this.toggleBtn.addEventListener("click", () => this.toggle());
            navbar.insertBefore(this.toggleBtn, navbar.firstChild);
            this.updateVisibility();
          },
          bindEvents() {
            window.addEventListener("resize", () => this.updateVisibility());
            document.addEventListener("click", (e) => {
              var _a;
              if (window.innerWidth >= 992)
                return;
              const sidebar = document.querySelector(".layout-side-section");
              const isClickInside = (sidebar == null ? void 0 : sidebar.contains(e.target)) || ((_a = this.toggleBtn) == null ? void 0 : _a.contains(e.target));
              if (!isClickInside && (sidebar == null ? void 0 : sidebar.classList.contains("show"))) {
                sidebar.classList.remove("show", "opened");
              }
            });
          },
          toggle() {
            const sidebar = document.querySelector(".layout-side-section");
            if (sidebar) {
              sidebar.classList.toggle("show");
              sidebar.classList.toggle("opened");
            }
          },
          updateVisibility() {
            if (this.toggleBtn) {
              this.toggleBtn.style.display = window.innerWidth < 992 ? "flex" : "none";
            }
          }
        };
        const ColorTheme = {
          currentTheme: "silver",
          themes: [
            "purple",
            "silver"
          ],
          themeConfig: {
            "purple": {
              name: "Purple",
              nameAr: "\u0623\u0631\u062C\u0648\u0627\u0646\u064A",
              emoji: "\u{1F49C}",
              gradient: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
              cssClass: "",
              dataTheme: ""
            },
            "silver": {
              name: "Silver",
              nameAr: "\u0641\u0636\u064A",
              emoji: "\u{1F32B}\uFE0F",
              gradient: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
              cssClass: "ahmadcss-theme-silver",
              dataTheme: "silver"
            }
          },
          init() {
            this.loadFromServer();
          },
          initSilent() {
            const saved = Storage.get("color_theme", "silver");
            this.currentTheme = saved;
            this.apply();
            this.loadThemeFromAPI().then((serverTheme) => {
              if (serverTheme && this.themes.includes(serverTheme)) {
                this.currentTheme = serverTheme;
                Storage.set("color_theme", serverTheme);
                this.apply();
              }
            }).catch(() => {
            });
          },
          async loadThemeFromAPI() {
            try {
              const response = await fetch("/api/method/ahmadcss.api.get_theme_settings", {
                method: "GET",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
                }
              });
              if (response.ok) {
                const data = await response.json();
                if (data && data.message && data.message.color_theme) {
                  return this.normalizeThemeName(data.message.color_theme);
                }
              }
            } catch (e) {
            }
            return null;
          },
          loadFromServer() {
            const saved = Storage.get("color_theme", "silver");
            this.currentTheme = saved;
            this.apply();
            this.loadThemeFromAPI().then((serverTheme) => {
              if (serverTheme && this.themes.includes(serverTheme)) {
                this.currentTheme = serverTheme;
                Storage.set("color_theme", serverTheme);
                this.apply();
              }
            }).catch(() => {
            });
          },
          normalizeThemeName(name) {
            if (!name)
              return "silver";
            const normalized = name.toLowerCase().replace(/\s+/g, "-");
            const mapping = {
              "purple": "purple",
              "silver": "silver",
              "purple-theme": "purple",
              "silver-theme": "silver"
            };
            return mapping[normalized] || "silver";
          },
          apply() {
            this.unloadAllThemes();
            this.themes.forEach((theme) => {
              const config2 = this.themeConfig[theme];
              if (config2 && config2.cssClass) {
                document.body.classList.remove(config2.cssClass);
              }
              document.body.classList.remove(`ahmadcss-theme-${theme}`);
            });
            document.documentElement.removeAttribute("data-ahmadcss-theme");
            document.documentElement.removeAttribute("data-theme");
            this.loadThemeCSS(this.currentTheme);
            const config = this.themeConfig[this.currentTheme];
            if (config) {
              if (config.cssClass) {
                document.body.classList.add(config.cssClass);
              }
              if (config.dataTheme) {
                document.documentElement.setAttribute("data-ahmadcss-theme", config.dataTheme);
                document.documentElement.setAttribute("data-theme", config.dataTheme);
              }
            }
            document.dispatchEvent(new CustomEvent("ahmadcss:theme-changed", {
              detail: { theme: this.currentTheme, config }
            }));
          },
          loadThemeCSS(themeName) {
            const cssMap = {
              "purple": "glass-ultimate.css",
              "silver": "glass-silver.css"
            };
            const cssFile = cssMap[themeName];
            if (!cssFile)
              return;
            const existingLink = document.querySelector(`link[data-ahmadcss-theme-css="${cssFile}"]`);
            if (existingLink)
              existingLink.remove();
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `/assets/ahmadcss/css/${cssFile}?v=${CONFIG.version}`;
            link.setAttribute("data-ahmadcss-theme-css", cssFile);
            document.head.appendChild(link);
          },
          unloadAllThemes() {
            const themeLinks = document.querySelectorAll("link[data-ahmadcss-theme-css]");
            themeLinks.forEach((link) => link.remove());
          },
          setTheme(themeName) {
            const normalized = this.normalizeThemeName(themeName);
            if (this.themes.includes(normalized)) {
              this.currentTheme = normalized;
              Storage.set("color_theme", normalized);
              this.apply();
              this.updateSwitcher();
              this.syncToServer(normalized);
              const config = this.themeConfig[normalized];
              Toast.show({
                message: __("Switched to {0} theme", [config.name + " " + config.emoji]),
                type: "info"
              });
            }
          },
          syncToServer(themeName) {
            if (window.location.pathname.includes("AhmadCSS%20Settings") || window.location.pathname.includes("AhmadCSS-Settings") || window.location.pathname.includes("ahmadcss-settings")) {
              return;
            }
            if (window.frappe && frappe.call) {
              frappe.call({
                method: "ahmadcss.api.save_theme_settings",
                args: {
                  settings: JSON.stringify({ color_theme: this.getDisplayName(themeName) })
                },
                async: true,
                freeze: false,
                error: function() {
                }
              });
            }
          },
          getDisplayName(themeName) {
            const mapping = {
              "purple": "Purple",
              "silver": "Silver"
            };
            return mapping[themeName] || themeName;
          },
          toggle() {
            const currentIndex = this.themes.indexOf(this.currentTheme);
            const nextIndex = (currentIndex + 1) % this.themes.length;
            this.setTheme(this.themes[nextIndex]);
          },
          createSwitcher() {
          },
          updateSwitcher() {
            const buttons = document.querySelectorAll(".ahmadcss-theme-btn");
            buttons.forEach((btn) => {
              btn.classList.toggle("active", btn.dataset.theme === this.currentTheme);
            });
          }
        };
        const Utils = {
          cleanupInlineStyles() {
            const body = document.body;
            if (body) {
              body.style.marginLeft = "";
              body.style.paddingLeft = "";
            }
            const sidebar = document.querySelector(".layout-side-section");
            if (sidebar && window.innerWidth >= 992) {
              sidebar.style.display = "";
              sidebar.style.visibility = "";
              sidebar.style.opacity = "";
              sidebar.style.transform = "";
            }
          }
        };
        function isLoginPage() {
          return window.location.pathname === "/login" || window.location.pathname === "/login/" || document.body.classList.contains("login-page") || document.querySelector(".login-content");
        }
        function isHomePage() {
          return window.location.pathname === "/" || window.location.pathname === "/app" || window.location.pathname === "/app/" || window.location.pathname === "/app/home";
        }
        function init() {
          var _a, _b;
          if ((_b = (_a = window.frappe) == null ? void 0 : _a.boot) == null ? void 0 : _b.developer_mode) {
            console.log(`\u{1F3A8} AhmadCSS v${CONFIG.version} - Professional Glassmorphism loaded`);
          }
          Utils.cleanupInlineStyles();
          if (isLoginPage()) {
            ColorTheme.initSilent();
            return;
          }
          if (isHomePage()) {
            ColorTheme.initSilent();
            Toast.init();
            RippleEffect.init();
            SmoothScroll.init();
            SidebarToggle.init();
            MobileSidebar.init();
            return;
          }
          ColorTheme.init();
          DarkMode.init();
          Toast.init();
          ThemeCustomizer.init();
          RippleEffect.init();
          SmoothScroll.init();
          SidebarToggle.init();
          MobileSidebar.init();
          if (window.frappe && frappe.router) {
            frappe.router.on("change", function() {
              setTimeout(Utils.cleanupInlineStyles, 100);
              setTimeout(() => SidebarToggle.bindFrappeToggle(), 200);
            });
          }
        }
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", init);
        } else {
          init();
        }
        window.AhmadCSS = {
          version: CONFIG.version,
          config: CONFIG,
          colorTheme: ColorTheme,
          setTheme: (theme) => ColorTheme.setTheme(theme),
          toggleTheme: () => ColorTheme.toggle(),
          darkMode: DarkMode,
          toggleDarkMode: () => DarkMode.toggle(),
          sidebar: SidebarToggle,
          toggleSidebar: () => SidebarToggle.toggle(),
          toast: Toast,
          notify: Toast.show.bind(Toast),
          skeleton: Skeleton,
          customizer: ThemeCustomizer,
          refresh: Utils.cleanupInlineStyles
        };
      })();
    }
  });
  require_ahmadcss_bundle();
})();
//# sourceMappingURL=ahmadcss.bundle.LQ4PJIIA.js.map
