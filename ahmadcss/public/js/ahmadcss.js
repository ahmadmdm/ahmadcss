/* ═══════════════════════════════════════════════════════════════════════════
   AhmadCSS - Professional Glassmorphism v15.0
   JavaScript Module for Frappe/ERPNext
   
   Features:
   - Dark Mode Toggle with persistence
   - Toast Notifications
   - Loading Skeletons
   - Theme Customizer
   - Ripple Effects
   - Smooth Scroll
   - Mobile Sidebar
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';
    
    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════
    
    const CONFIG = {
        version: '15.0',
        navbarHeight: 48,
        pageHeadHeight: 60,
        sidebarWidth: 260,
        animationDuration: 250,
        toastDuration: 4000,
        storagePrefix: 'ahmadcss_'
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // STORAGE UTILITIES
    // ═══════════════════════════════════════════════════════════════════════
    
    const Storage = {
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(CONFIG.storagePrefix + key);
                return value !== null ? JSON.parse(value) : defaultValue;
            } catch (e) {
                if (window.frappe?.boot?.developer_mode) {
                    console.warn('AhmadCSS Storage.get error:', e);
                }
                return defaultValue;
            }
        },
        
        set(key, value) {
            try {
                localStorage.setItem(CONFIG.storagePrefix + key, JSON.stringify(value));
                return true;
            } catch (e) {
                if (window.frappe?.boot?.developer_mode) {
                    console.warn('AhmadCSS Storage.set error:', e);
                }
                return false;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(CONFIG.storagePrefix + key);
                return true;
            } catch (e) {
                if (window.frappe?.boot?.developer_mode) {
                    console.warn('AhmadCSS Storage.remove error:', e);
                }
                return false;
            }
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // DARK MODE MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const DarkMode = {
        isEnabled: false,
        
        init() {
            // Check saved preference
            const saved = Storage.get('dark_mode');
            if (saved !== null) {
                this.isEnabled = saved;
            } else {
                // Check system preference
                this.isEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            
            this.apply();
            this.createToggleButton();
            this.listenSystemChange();
        },
        
        apply() {
            if (this.isEnabled) {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.body.classList.add('ahmadcss-dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                document.body.classList.remove('ahmadcss-dark');
            }
        },
        
        toggle() {
            this.isEnabled = !this.isEnabled;
            Storage.set('dark_mode', this.isEnabled);
            this.apply();
            this.updateToggleButton();
            
            // Sync with server if available
            if (window.frappe && frappe.call) {
                frappe.call({
                    method: 'ahmadcss.ahmadcss.doctype.ahmadcss_settings.ahmadcss_settings.toggle_dark_mode',
                    async: true
                });
            }
            
            Toast.show({
                message: this.isEnabled ? __('Dark mode enabled') + ' 🌙' : __('Light mode enabled') + ' ☀️',
                type: 'info'
            });
        },
        
        createToggleButton() {
            const navbar = document.querySelector('.navbar');
            if (!navbar || document.querySelector('.ahmadcss-darkmode-toggle')) return;
            
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'ahmadcss-darkmode-toggle';
            toggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');
            toggleBtn.innerHTML = this.getIcon();
            
            toggleBtn.addEventListener('click', () => this.toggle());
            
            // Find a good place to insert (before user dropdown or at end)
            const navRight = navbar.querySelector('.navbar-right') || navbar.querySelector('.nav-right') || navbar;
            navRight.appendChild(toggleBtn);
        },
        
        updateToggleButton() {
            const btn = document.querySelector('.ahmadcss-darkmode-toggle');
            if (btn) {
                btn.innerHTML = this.getIcon();
            }
        },
        
        getIcon() {
            return this.isEnabled 
                ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
                : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        },
        
        listenSystemChange() {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (Storage.get('dark_mode') === null) {
                    this.isEnabled = e.matches;
                    this.apply();
                    this.updateToggleButton();
                }
            });
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // TOAST NOTIFICATIONS MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const Toast = {
        container: null,
        
        init() {
            this.createContainer();
        },
        
        createContainer() {
            if (document.querySelector('.ahmadcss-toast-container')) return;
            
            this.container = document.createElement('div');
            this.container.className = 'ahmadcss-toast-container';
            document.body.appendChild(this.container);
        },
        
        show({ message, type = 'info', duration = CONFIG.toastDuration, title = null }) {
            if (!this.container) this.createContainer();
            
            const toast = document.createElement('div');
            toast.className = `ahmadcss-toast ahmadcss-toast-${type}`;
            
            const icons = {
                success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
                error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
                warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
                info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
            };
            
            // استخدام DOM API بدلاً من innerHTML لمنع XSS
            const iconDiv = document.createElement('div');
            iconDiv.className = 'ahmadcss-toast-icon';
            iconDiv.innerHTML = icons[type] || icons.info;  // Safe: predefined icons only
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'ahmadcss-toast-content';
            
            if (title) {
                const titleDiv = document.createElement('div');
                titleDiv.className = 'ahmadcss-toast-title';
                titleDiv.textContent = title;  // Safe: textContent escapes HTML
                contentDiv.appendChild(titleDiv);
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'ahmadcss-toast-message';
            messageDiv.textContent = message;  // Safe: textContent escapes HTML
            contentDiv.appendChild(messageDiv);
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'ahmadcss-toast-close';
            closeBtn.setAttribute('aria-label', 'Close');
            closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
            
            const progressDiv = document.createElement('div');
            progressDiv.className = 'ahmadcss-toast-progress';
            
            toast.appendChild(iconDiv);
            toast.appendChild(contentDiv);
            toast.appendChild(closeBtn);
            toast.appendChild(progressDiv);
            
            // Close button
            closeBtn.addEventListener('click', () => {
                this.dismiss(toast);
            });
            
            // Auto dismiss
            setTimeout(() => this.dismiss(toast), duration);
            
            // Progress bar animation
            progressDiv.style.animation = `ahmadcss-toast-progress ${duration}ms linear forwards`;
            
            this.container.appendChild(toast);
            
            // Trigger animation
            requestAnimationFrame(() => {
                toast.classList.add('ahmadcss-toast-show');
            });
            
            return toast;
        },
        
        dismiss(toast) {
            toast.classList.remove('ahmadcss-toast-show');
            toast.classList.add('ahmadcss-toast-hide');
            setTimeout(() => toast.remove(), 300);
        },
        
        success(message, title = null) {
            return this.show({ message, type: 'success', title });
        },
        
        error(message, title = null) {
            return this.show({ message, type: 'error', title });
        },
        
        warning(message, title = null) {
            return this.show({ message, type: 'warning', title });
        },
        
        info(message, title = null) {
            return this.show({ message, type: 'info', title });
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // LOADING SKELETON MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const Skeleton = {
        show(container, options = {}) {
            const {
                rows = 3,
                avatar = false,
                type = 'lines' // 'lines', 'card', 'table', 'form'
            } = options;
            
            const element = typeof container === 'string' 
                ? document.querySelector(container) 
                : container;
            
            if (!element) return null;
            
            const skeleton = document.createElement('div');
            skeleton.className = 'ahmadcss-skeleton-wrapper';
            skeleton.innerHTML = this.getTemplate(type, rows, avatar);
            
            element.innerHTML = '';
            element.appendChild(skeleton);
            
            return skeleton;
        },
        
        hide(container) {
            const element = typeof container === 'string' 
                ? document.querySelector(container) 
                : container;
            
            if (!element) return;
            
            const skeleton = element.querySelector('.ahmadcss-skeleton-wrapper');
            if (skeleton) {
                skeleton.classList.add('ahmadcss-skeleton-fade');
                setTimeout(() => skeleton.remove(), 300);
            }
        },
        
        getTemplate(type, rows, avatar) {
            switch(type) {
                case 'card':
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
                
                case 'table':
                    let tableRows = '';
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
                
                case 'form':
                    let fields = '';
                    for (let i = 0; i < rows; i++) {
                        fields += `
                            <div class="ahmadcss-skeleton-field">
                                <div class="ahmadcss-skeleton ahmadcss-skeleton-label"></div>
                                <div class="ahmadcss-skeleton ahmadcss-skeleton-input"></div>
                            </div>
                        `;
                    }
                    return `<div class="ahmadcss-skeleton-form">${fields}</div>`;
                
                default: // lines
                    let lines = '';
                    if (avatar) {
                        lines += '<div class="ahmadcss-skeleton ahmadcss-skeleton-avatar"></div>';
                    }
                    lines += '<div class="ahmadcss-skeleton-lines">';
                    for (let i = 0; i < rows; i++) {
                        const width = i === rows - 1 ? '60%' : (90 - i * 10) + '%';
                        lines += `<div class="ahmadcss-skeleton ahmadcss-skeleton-line" style="width: ${width}"></div>`;
                    }
                    lines += '</div>';
                    return lines;
            }
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // THEME CUSTOMIZER MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const ThemeCustomizer = {
        isOpen: false,
        panel: null,
        
        init() {
            this.createPanel();
            this.createToggleButton();
            this.loadSavedTheme();
        },
        
        createPanel() {
            if (document.querySelector('.ahmadcss-customizer')) return;
            
            this.panel = document.createElement('div');
            this.panel.className = 'ahmadcss-customizer';
            this.panel.innerHTML = `
                <div class="ahmadcss-customizer-header">
                    <h3>🎨 Theme Customizer</h3>
                    <button class="ahmadcss-customizer-close" aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="ahmadcss-customizer-body">
                    <div class="ahmadcss-customizer-section">
                        <label>Primary Color</label>
                        <input type="color" id="ahmadcss-primary-color" value="#7c3aed">
                    </div>
                    <div class="ahmadcss-customizer-section">
                        <label>Secondary Color</label>
                        <input type="color" id="ahmadcss-secondary-color" value="#3b82f6">
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
            // Close button
            this.panel.querySelector('.ahmadcss-customizer-close').addEventListener('click', () => this.close());
            
            // Color pickers
            this.panel.querySelector('#ahmadcss-primary-color').addEventListener('input', (e) => {
                this.updateCSS('--primary-600', e.target.value);
            });
            
            this.panel.querySelector('#ahmadcss-secondary-color').addEventListener('input', (e) => {
                this.updateCSS('--secondary-500', e.target.value);
            });
            
            // Range sliders
            this.panel.querySelector('#ahmadcss-blur').addEventListener('input', (e) => {
                document.getElementById('blur-value').textContent = e.target.value;
                this.updateCSS('--glass-blur', e.target.value + 'px');
            });
            
            this.panel.querySelector('#ahmadcss-opacity').addEventListener('input', (e) => {
                document.getElementById('opacity-value').textContent = e.target.value;
                const opacity = e.target.value / 100;
                this.updateCSS('--glass-white', `rgba(255, 255, 255, ${opacity})`);
            });
            
            this.panel.querySelector('#ahmadcss-radius').addEventListener('input', (e) => {
                document.getElementById('radius-value').textContent = e.target.value;
                this.updateCSS('--radius-lg', e.target.value + 'px');
            });
            
            // Save button
            this.panel.querySelector('#ahmadcss-save').addEventListener('click', () => this.saveTheme());
            
            // Reset button
            this.panel.querySelector('#ahmadcss-reset').addEventListener('click', () => this.resetTheme());
        },
        
        updateCSS(property, value) {
            document.documentElement.style.setProperty(property, value);
        },
        
        saveTheme() {
            const theme = {
                primaryColor: this.panel.querySelector('#ahmadcss-primary-color').value,
                secondaryColor: this.panel.querySelector('#ahmadcss-secondary-color').value,
                blur: this.panel.querySelector('#ahmadcss-blur').value,
                opacity: this.panel.querySelector('#ahmadcss-opacity').value,
                radius: this.panel.querySelector('#ahmadcss-radius').value
            };
            
            Storage.set('custom_theme', theme);
            Toast.success(__('Theme saved successfully') + ' ✨');
        },
        
        loadSavedTheme() {
            const theme = Storage.get('custom_theme');
            if (!theme) return;
            
            this.updateCSS('--primary-600', theme.primaryColor);
            this.updateCSS('--secondary-500', theme.secondaryColor);
            this.updateCSS('--glass-blur', theme.blur + 'px');
            this.updateCSS('--glass-white', `rgba(255, 255, 255, ${theme.opacity / 100})`);
            this.updateCSS('--radius-lg', theme.radius + 'px');
            
            // Update panel values
            if (this.panel) {
                this.panel.querySelector('#ahmadcss-primary-color').value = theme.primaryColor;
                this.panel.querySelector('#ahmadcss-secondary-color').value = theme.secondaryColor;
                this.panel.querySelector('#ahmadcss-blur').value = theme.blur;
                this.panel.querySelector('#ahmadcss-opacity').value = theme.opacity;
                this.panel.querySelector('#ahmadcss-radius').value = theme.radius;
                document.getElementById('blur-value').textContent = theme.blur;
                document.getElementById('opacity-value').textContent = theme.opacity;
                document.getElementById('radius-value').textContent = theme.radius;
            }
        },
        
        resetTheme() {
            Storage.remove('custom_theme');
            location.reload();
        },
        
        createToggleButton() {
            const navbar = document.querySelector('.navbar');
            if (!navbar || document.querySelector('.ahmadcss-customizer-toggle')) return;
            
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'ahmadcss-customizer-toggle';
            toggleBtn.setAttribute('aria-label', 'Theme Customizer');
            toggleBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
            
            toggleBtn.addEventListener('click', () => this.toggle());
            
            const navRight = navbar.querySelector('.navbar-right') || navbar.querySelector('.nav-right') || navbar;
            navRight.appendChild(toggleBtn);
        },
        
        toggle() {
            this.isOpen = !this.isOpen;
            this.panel.classList.toggle('ahmadcss-customizer-open', this.isOpen);
        },
        
        close() {
            this.isOpen = false;
            this.panel.classList.remove('ahmadcss-customizer-open');
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // RIPPLE EFFECT MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const RippleEffect = {
        init() {
            document.addEventListener('click', this.handleClick.bind(this));
            this.injectStyles();
        },
        
        handleClick(e) {
            const target = e.target.closest('.btn, .shortcut-widget-box, .standard-sidebar-item, .ahmadcss-btn');
            if (!target) return;
            
            const ripple = document.createElement('span');
            ripple.className = 'ahmadcss-ripple';
            
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
            if (originalPosition === 'static') {
                target.style.position = 'relative';
            }
            target.style.overflow = 'hidden';
            
            target.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
                if (originalPosition === 'static') {
                    target.style.position = '';
                }
            }, 600);
        },
        
        injectStyles() {
            if (document.getElementById('ahmadcss-ripple-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'ahmadcss-ripple-styles';
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
    
    // ═══════════════════════════════════════════════════════════════════════
    // SMOOTH SCROLL MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // SIDEBAR TOGGLE MODULE (Desktop & Mobile)
    // ═══════════════════════════════════════════════════════════════════════
    
    const SidebarToggle = {
        isCollapsed: false,
        
        init() {
            // Check saved state
            this.isCollapsed = Storage.get('sidebar_collapsed', false);
            
            // Apply saved state
            if (this.isCollapsed) {
                this.collapse();
            }
            
            // Bind to Frappe's toggle button
            this.bindFrappeToggle();
            
            // Also handle our custom toggle
            this.bindCustomToggle();
        },
        
        bindFrappeToggle() {
            // Wait for DOM and bind to Frappe's sidebar toggle
            const bindToggle = () => {
                const toggleBtns = document.querySelectorAll('.sidebar-toggle-btn, .sidebar-toggle-placeholder, [data-action="toggle-sidebar"]');
                
                toggleBtns.forEach(btn => {
                    if (btn.dataset.ahmadcssBound) return;
                    btn.dataset.ahmadcssBound = 'true';
                    
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggle();
                    });
                });
            };
            
            // Bind immediately and after page changes
            bindToggle();
            
            // Re-bind on page navigation
            if (window.frappe && frappe.router) {
                frappe.router.on('change', () => {
                    setTimeout(bindToggle, 100);
                });
            }
            
            // Also use MutationObserver to catch dynamically added buttons
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        bindToggle();
                    }
                });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Listen to Frappe's toggle event for compatibility
            $(document.body).on('toggleSidebar', () => {
                const sidebar = document.querySelector('.layout-side-section');
                const isVisible = sidebar && 
                                  window.getComputedStyle(sidebar).display !== 'none' &&
                                  !sidebar.classList.contains('ahmadcss-sidebar-collapsed');
                
                if (!isVisible) {
                    document.body.classList.add('sidebar-collapsed');
                } else {
                    document.body.classList.remove('sidebar-collapsed');
                }
            });
        },
        
        bindCustomToggle() {
            document.addEventListener('click', (e) => {
                const target = e.target.closest('.ahmadcss-sidebar-toggle');
                if (target) {
                    e.preventDefault();
                    this.toggle();
                }
            });
        },
        
        toggle() {
            this.isCollapsed = !this.isCollapsed;
            Storage.set('sidebar_collapsed', this.isCollapsed);
            
            if (this.isCollapsed) {
                this.collapse();
            } else {
                this.expand();
            }
        },
        
        collapse() {
            const sidebar = document.querySelector('.layout-side-section');
            const mainSection = document.querySelector('.layout-main-section-wrapper');
            
            if (sidebar) {
                sidebar.classList.add('ahmadcss-sidebar-collapsed');
                // Use setProperty to override !important in CSS
                sidebar.style.setProperty('display', 'none', 'important');
                sidebar.style.setProperty('width', '0', 'important');
                sidebar.style.setProperty('max-width', '0', 'important');
            }
            
            if (mainSection) {
                mainSection.classList.add('ahmadcss-sidebar-collapsed');
                mainSection.style.setProperty('max-width', '100%', 'important');
                mainSection.style.setProperty('flex', '1 1 100%', 'important');
                mainSection.style.setProperty('width', '100%', 'important');
            }
            
            document.body.classList.add('sidebar-collapsed');
        },
        
        expand() {
            const sidebar = document.querySelector('.layout-side-section');
            const mainSection = document.querySelector('.layout-main-section-wrapper');
            
            if (sidebar) {
                sidebar.classList.remove('ahmadcss-sidebar-collapsed');
                // Remove inline styles to let CSS take control
                sidebar.style.removeProperty('display');
                sidebar.style.removeProperty('width');
                sidebar.style.removeProperty('max-width');
            }
            
            if (mainSection) {
                mainSection.classList.remove('ahmadcss-sidebar-collapsed');
                mainSection.style.removeProperty('max-width');
                mainSection.style.removeProperty('flex');
                mainSection.style.removeProperty('width');
            }
            
            document.body.classList.remove('sidebar-collapsed');
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // MOBILE SIDEBAR MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const MobileSidebar = {
        toggleBtn: null,
        
        init() {
            this.createToggleButton();
            this.bindEvents();
        },
        
        createToggleButton() {
            const navbar = document.querySelector('.navbar');
            if (!navbar || document.querySelector('.ahmadcss-sidebar-toggle')) return;
            
            this.toggleBtn = document.createElement('button');
            this.toggleBtn.className = 'ahmadcss-sidebar-toggle';
            this.toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
            
            this.toggleBtn.addEventListener('click', () => this.toggle());
            
            navbar.insertBefore(this.toggleBtn, navbar.firstChild);
            this.updateVisibility();
        },
        
        bindEvents() {
            window.addEventListener('resize', () => this.updateVisibility());
            
            document.addEventListener('click', (e) => {
                if (window.innerWidth >= 992) return;
                
                const sidebar = document.querySelector('.layout-side-section');
                const isClickInside = sidebar?.contains(e.target) || this.toggleBtn?.contains(e.target);
                
                if (!isClickInside && sidebar?.classList.contains('show')) {
                    sidebar.classList.remove('show', 'opened');
                }
            });
        },
        
        toggle() {
            const sidebar = document.querySelector('.layout-side-section');
            if (sidebar) {
                sidebar.classList.toggle('show');
                sidebar.classList.toggle('opened');
            }
        },
        
        updateVisibility() {
            if (this.toggleBtn) {
                this.toggleBtn.style.display = window.innerWidth < 992 ? 'flex' : 'none';
            }
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // COLOR THEME MODULE (Purple / Silver)
    // ═══════════════════════════════════════════════════════════════════════
    
    const ColorTheme = {
        currentTheme: 'purple',
        themes: ['purple', 'silver'],
        
        init() {
            // Check saved preference - default to purple
            const saved = Storage.get('color_theme', 'purple');
            this.currentTheme = saved;
            this.apply();
            this.createSwitcher();
        },
        
        apply() {
            // Remove all theme classes
            this.themes.forEach(theme => {
                document.body.classList.remove(`ahmadcss-theme-${theme}`);
                document.documentElement.removeAttribute(`data-ahmadcss-theme`);
            });
            
            // Apply current theme (purple is default, silver requires class)
            if (this.currentTheme === 'silver') {
                document.body.classList.add(`ahmadcss-theme-silver`);
                document.documentElement.setAttribute('data-ahmadcss-theme', 'silver');
            }
        },
        
        setTheme(themeName) {
            if (this.themes.includes(themeName)) {
                this.currentTheme = themeName;
                Storage.set('color_theme', themeName);
                this.apply();
                this.updateSwitcher();
                
                const themeNames = {
                    purple: __('Purple') + ' 💜',
                    silver: __('Silver') + ' 🌫️'
                };
                
                Toast.show({
                    message: __('Switched to {0} theme', [themeNames[themeName]]),
                    type: 'info'
                });
            }
        },
        
        toggle() {
            const currentIndex = this.themes.indexOf(this.currentTheme);
            const nextIndex = (currentIndex + 1) % this.themes.length;
            this.setTheme(this.themes[nextIndex]);
        },
        
        createSwitcher() {
            const navbar = document.querySelector('.navbar');
            if (!navbar || document.querySelector('.ahmadcss-theme-switcher')) return;
            
            const switcher = document.createElement('div');
            switcher.className = 'ahmadcss-theme-switcher';
            switcher.innerHTML = `
                <button class="ahmadcss-theme-btn" data-theme="purple" title="Purple Theme">
                    <span style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);"></span>
                </button>
                <button class="ahmadcss-theme-btn" data-theme="silver" title="Silver Theme">
                    <span style="background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);"></span>
                </button>
            `;
            
            // Bind click events
            switcher.querySelectorAll('.ahmadcss-theme-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.setTheme(btn.dataset.theme);
                });
            });
            
            const navRight = navbar.querySelector('.navbar-right') || navbar.querySelector('.nav-right') || navbar;
            navRight.insertBefore(switcher, navRight.firstChild);
            
            this.updateSwitcher();
        },
        
        updateSwitcher() {
            const buttons = document.querySelectorAll('.ahmadcss-theme-btn');
            buttons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === this.currentTheme);
            });
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════════════
    
    const Utils = {
        cleanupInlineStyles() {
            const body = document.body;
            if (body) {
                body.style.marginLeft = '';
                body.style.paddingLeft = '';
            }
            
            const sidebar = document.querySelector('.layout-side-section');
            if (sidebar && window.innerWidth >= 992) {
                sidebar.style.display = '';
                sidebar.style.visibility = '';
                sidebar.style.opacity = '';
                sidebar.style.transform = '';
            }
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    
    function init() {
        if (window.frappe?.boot?.developer_mode) {
            console.log(`🎨 AhmadCSS v${CONFIG.version} - Professional Glassmorphism loaded`);
        }
        
        // Clean up any inline styles
        Utils.cleanupInlineStyles();
        
        // Initialize all modules
        ColorTheme.init();  // Initialize color theme first
        DarkMode.init();
        Toast.init();
        ThemeCustomizer.init();
        RippleEffect.init();
        SmoothScroll.init();
        SidebarToggle.init();  // Desktop sidebar toggle
        MobileSidebar.init();
        
        // Re-run on page navigation
        if (window.frappe && frappe.router) {
            frappe.router.on('change', function() {
                setTimeout(Utils.cleanupInlineStyles, 100);
                setTimeout(() => SidebarToggle.bindFrappeToggle(), 200);
            });
        }
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // EXPOSE PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════
    
    window.AhmadCSS = {
        version: CONFIG.version,
        config: CONFIG,
        
        // Color Theme
        colorTheme: ColorTheme,
        setTheme: (theme) => ColorTheme.setTheme(theme),
        toggleTheme: () => ColorTheme.toggle(),
        
        // Dark Mode
        darkMode: DarkMode,
        toggleDarkMode: () => DarkMode.toggle(),
        
        // Sidebar
        sidebar: SidebarToggle,
        toggleSidebar: () => SidebarToggle.toggle(),
        
        // Toast Notifications
        toast: Toast,
        notify: Toast.show.bind(Toast),
        
        // Loading Skeleton
        skeleton: Skeleton,
        
        // Theme Customizer
        customizer: ThemeCustomizer,
        
        // Utilities
        refresh: Utils.cleanupInlineStyles
    };
    
})();
