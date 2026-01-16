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
    // PERMISSION UTILITIES - Check if user is admin
    // ═══════════════════════════════════════════════════════════════════════
    
    const Permissions = {
        isAdmin() {
            // Check if user has System Manager role or is Administrator
            if (!window.frappe || !frappe.user) return false;
            
            const roles = frappe.user_roles || [];
            return roles.includes('System Manager') || 
                   roles.includes('Administrator') ||
                   frappe.session?.user === 'Administrator';
        },
        
        canEditTheme() {
            return this.isAdmin();
        }
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
            
            // Sync with server if available - only for admins
            if (Permissions.isAdmin() && window.frappe && frappe.call) {
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
            // Don't create toggle button on login page
            if (window.location.pathname === '/login' || 
                window.location.pathname === '/login/' ||
                document.body.classList.contains('login-page') ||
                document.querySelector('.login-content')) {
                return;
            }
            
            // Only show dark mode toggle to admins
            if (!Permissions.isAdmin()) {
                return;
            }
            
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
            // Only show theme customizer to admins
            if (!Permissions.isAdmin()) {
                return;
            }
            
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
    // COLOR THEME MODULE (All Themes)
    // ═══════════════════════════════════════════════════════════════════════
    
    const ColorTheme = {
        currentTheme: 'purple',
        themes: [
            'purple', 'silver', 'bento-grids', 'material-web',
            'ocean-blue', 'sunset', 'forest', 'rose-gold', 'northern-lights',
            'midnight', 'coral-reef', 'lavender-dream', 'cyberpunk', 'desert-sand',
            'light-glass'
        ],
        themeConfig: {
            'purple': {
                name: 'Purple',
                nameAr: 'أرجواني',
                emoji: '💜',
                gradient: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                cssClass: '',
                dataTheme: ''
            },
            'silver': {
                name: 'Silver',
                nameAr: 'فضي',
                emoji: '🌫️',
                gradient: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                cssClass: 'ahmadcss-theme-silver',
                dataTheme: 'silver'
            },
            'bento-grids': {
                name: 'Bento Grids',
                nameAr: 'بينتو',
                emoji: '📦',
                gradient: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                cssClass: 'theme-bento-grids',
                dataTheme: 'bento-grids'
            },
            'material-web': {
                name: 'Material Web',
                nameAr: 'ماتيريال',
                emoji: '🎨',
                gradient: 'linear-gradient(135deg, #6750A4 0%, #D0BCFF 100%)',
                cssClass: 'theme-material-web',
                dataTheme: 'material-web'
            },
            'ocean-blue': {
                name: 'Ocean Blue',
                nameAr: 'المحيط الأزرق',
                emoji: '🌊',
                gradient: 'linear-gradient(135deg, #023e8a 0%, #0077b6 35%, #00b4d8 65%, #90e0ef 100%)',
                cssClass: 'ahmadcss-theme-ocean-blue',
                dataTheme: 'ocean-blue'
            },
            'sunset': {
                name: 'Sunset',
                nameAr: 'غروب الشمس',
                emoji: '🌅',
                gradient: 'linear-gradient(135deg, #7400b8 0%, #f72585 30%, #ff8c00 60%, #ffbe0b 100%)',
                cssClass: 'ahmadcss-theme-sunset',
                dataTheme: 'sunset'
            },
            'forest': {
                name: 'Forest',
                nameAr: 'الغابة',
                emoji: '🌲',
                gradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 30%, #40916c 60%, #95d5b2 100%)',
                cssClass: 'ahmadcss-theme-forest',
                dataTheme: 'forest'
            },
            'rose-gold': {
                name: 'Rose Gold',
                nameAr: 'ذهبي وردي',
                emoji: '🌸',
                gradient: 'linear-gradient(135deg, #8e4a52 0%, #b76e79 30%, #d4a5a5 60%, #f5e6e8 100%)',
                cssClass: 'ahmadcss-theme-rose-gold',
                dataTheme: 'rose-gold'
            },
            'northern-lights': {
                name: 'Northern Lights',
                nameAr: 'الشفق القطبي',
                emoji: '🌌',
                gradient: 'linear-gradient(135deg, #073b4c 0%, #118ab2 25%, #06d6a0 50%, #ffd166 75%, #ef476f 100%)',
                cssClass: 'ahmadcss-theme-northern-lights',
                dataTheme: 'northern-lights'
            },
            'midnight': {
                name: 'Midnight',
                nameAr: 'منتصف الليل',
                emoji: '🌙',
                gradient: 'linear-gradient(135deg, #10002b 0%, #240046 30%, #3c096c 60%, #5a189a 100%)',
                cssClass: 'ahmadcss-theme-midnight',
                dataTheme: 'midnight'
            },
            'coral-reef': {
                name: 'Coral Reef',
                nameAr: 'الشعاب المرجانية',
                emoji: '🐠',
                gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 30%, #48dbfb 60%, #1dd1a1 100%)',
                cssClass: 'ahmadcss-theme-coral-reef',
                dataTheme: 'coral-reef'
            },
            'lavender-dream': {
                name: 'Lavender Dream',
                nameAr: 'حلم اللافندر',
                emoji: '💜',
                gradient: 'linear-gradient(135deg, #5a189a 0%, #7b2cbf 25%, #9d4edd 50%, #c77dff 75%, #e0aaff 100%)',
                cssClass: 'ahmadcss-theme-lavender-dream',
                dataTheme: 'lavender-dream'
            },
            'cyberpunk': {
                name: 'Cyberpunk',
                nameAr: 'سايبربانك',
                emoji: '🤖',
                gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 30%, #00ff88 60%, #ff00ff 100%)',
                cssClass: 'ahmadcss-theme-cyberpunk',
                dataTheme: 'cyberpunk'
            },
            'desert-sand': {
                name: 'Desert Sand',
                nameAr: 'رمال الصحراء',
                emoji: '🏜️',
                gradient: 'linear-gradient(135deg, #8b4513 0%, #c2703a 30%, #daa06d 60%, #f4e4c1 100%)',
                cssClass: 'ahmadcss-theme-desert-sand',
                dataTheme: 'desert-sand'
            },
            'light-glass': {
                name: 'Light Glass',
                nameAr: 'زجاج فاتح',
                emoji: '☁️',
                gradient: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
                cssClass: 'ahmadcss-theme-light-glass',
                dataTheme: 'light-glass'
            }
        },
        
        init() {
            // Load theme from server settings first
            this.loadFromServer();
        },
        
        // Initialize silently without showing switcher (for homepage and login)
        initSilent() {
            // First, apply saved theme immediately for faster rendering
            const saved = Storage.get('color_theme', 'purple');
            this.currentTheme = saved;
            this.apply();
            
            // Then try to get theme from server to sync
            this.loadThemeFromAPI().then(serverTheme => {
                if (serverTheme && this.themes.includes(serverTheme)) {
                    this.currentTheme = serverTheme;
                    Storage.set('color_theme', serverTheme);
                    this.apply();
                }
            }).catch(() => {
                // Keep the localStorage theme if API fails
            });
        },
        
        // Load theme from API using fetch (works for guests too)
        async loadThemeFromAPI() {
            try {
                const response = await fetch('/api/method/ahmadcss.api.get_theme_settings', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.message && data.message.color_theme) {
                        return this.normalizeThemeName(data.message.color_theme);
                    }
                }
            } catch (e) {
                // Silently fail for guests
            }
            return null;
        },
        
        loadFromServer() {
            // First, apply saved theme immediately for faster rendering
            const saved = Storage.get('color_theme', 'purple');
            this.currentTheme = saved;
            this.apply();
            
            // Then try to get theme from server to sync
            this.loadThemeFromAPI().then(serverTheme => {
                if (serverTheme && this.themes.includes(serverTheme)) {
                    this.currentTheme = serverTheme;
                    Storage.set('color_theme', serverTheme);
                    this.apply();
                }
                this.createSwitcher();
            }).catch(() => {
                // Keep the localStorage theme if API fails
                this.createSwitcher();
            });
        },
        
        normalizeThemeName(name) {
            if (!name) return 'purple';
            const normalized = name.toLowerCase().replace(/\s+/g, '-');
            // Map display names to internal names
            const mapping = {
                'purple': 'purple',
                'silver': 'silver',
                'bento-grids': 'bento-grids',
                'bento grids': 'bento-grids',
                'material-web': 'material-web',
                'material web': 'material-web',
                'ocean-blue': 'ocean-blue',
                'ocean blue': 'ocean-blue',
                'sunset': 'sunset',
                'forest': 'forest',
                'rose-gold': 'rose-gold',
                'rose gold': 'rose-gold',
                'northern-lights': 'northern-lights',
                'northern lights': 'northern-lights',
                'midnight': 'midnight',
                'coral-reef': 'coral-reef',
                'coral reef': 'coral-reef',
                'lavender-dream': 'lavender-dream',
                'lavender dream': 'lavender-dream',
                'cyberpunk': 'cyberpunk',
                'desert-sand': 'desert-sand',
                'desert sand': 'desert-sand',
                'light-glass': 'light-glass',
                'light glass': 'light-glass'
            };
            return mapping[normalized] || normalized;
        },
        
        apply() {
            // Unload all theme CSS files first
            this.unloadAllThemes();
            
            // Remove all theme classes
            this.themes.forEach(theme => {
                const config = this.themeConfig[theme];
                if (config && config.cssClass) {
                    document.body.classList.remove(config.cssClass);
                }
                document.body.classList.remove(`ahmadcss-theme-${theme}`);
            });
            document.documentElement.removeAttribute('data-ahmadcss-theme');
            document.documentElement.removeAttribute('data-theme');
            
            // Load CSS file for current theme dynamically
            this.loadThemeCSS(this.currentTheme);
            
            // Apply current theme classes
            const config = this.themeConfig[this.currentTheme];
            if (config) {
                if (config.cssClass) {
                    document.body.classList.add(config.cssClass);
                }
                if (config.dataTheme) {
                    document.documentElement.setAttribute('data-ahmadcss-theme', config.dataTheme);
                    document.documentElement.setAttribute('data-theme', config.dataTheme);
                }
            }
            
            // Dispatch event for other modules
            document.dispatchEvent(new CustomEvent('ahmadcss:theme-changed', {
                detail: { theme: this.currentTheme, config: config }
            }));
        },
        
        loadThemeCSS(themeName) {
            // Map theme names to CSS files
            const cssMap = {
                'purple': 'glass-ultimate.css',
                'silver': 'glass-silver.css',
                'bento-grids': 'bento-grids.css',
                'material-web': 'material-web.css',
                'light-glass': 'light-glass.css',
                'ocean-blue': 'themes-collection.css',
                'sunset': 'themes-collection.css',
                'forest': 'themes-collection.css',
                'rose-gold': 'themes-collection.css',
                'northern-lights': 'themes-collection.css',
                'midnight': 'themes-collection.css',
                'coral-reef': 'themes-collection.css',
                'lavender-dream': 'themes-collection.css',
                'cyberpunk': 'themes-collection.css',
                'desert-sand': 'themes-collection.css'
            };
            
            const cssFile = cssMap[themeName];
            if (!cssFile) return;
            
            // Check if already loaded
            const existingLink = document.querySelector(`link[data-ahmadcss-theme-css="${cssFile}"]`);
            if (existingLink) return;
            
            // Create and append link element
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `/assets/ahmadcss/css/${cssFile}`;
            link.setAttribute('data-ahmadcss-theme-css', cssFile);
            document.head.appendChild(link);
        },
        
        unloadAllThemes() {
            // Remove all dynamically loaded theme CSS files
            const themeLinks = document.querySelectorAll('link[data-ahmadcss-theme-css]');
            themeLinks.forEach(link => link.remove());
        },
        
        setTheme(themeName) {
            const normalized = this.normalizeThemeName(themeName);
            if (this.themes.includes(normalized)) {
                this.currentTheme = normalized;
                Storage.set('color_theme', normalized);
                this.apply();
                this.updateSwitcher();
                
                // Sync with server
                this.syncToServer(normalized);
                
                const config = this.themeConfig[normalized];
                Toast.show({
                    message: __('Switched to {0} theme', [config.name + ' ' + config.emoji]),
                    type: 'info'
                });
            }
        },
        
        syncToServer(themeName) {
            // Don't sync if user is on settings page to avoid timestamp conflicts
            if (window.location.pathname.includes('AhmadCSS%20Settings') || 
                window.location.pathname.includes('AhmadCSS-Settings') ||
                window.location.pathname.includes('ahmadcss-settings')) {
                return;
            }
            
            if (window.frappe && frappe.call) {
                frappe.call({
                    method: 'ahmadcss.api.save_theme_settings',
                    args: {
                        settings: JSON.stringify({ color_theme: this.getDisplayName(themeName) })
                    },
                    async: true,
                    freeze: false,
                    error: function() {
                        // Silently ignore errors - theme is already saved locally
                    }
                });
            }
        },
        
        getDisplayName(themeName) {
            const mapping = {
                'purple': 'Purple',
                'silver': 'Silver',
                'bento-grids': 'Bento Grids',
                'material-web': 'Material Web'
            };
            return mapping[themeName] || themeName;
        },
        
        toggle() {
            const currentIndex = this.themes.indexOf(this.currentTheme);
            const nextIndex = (currentIndex + 1) % this.themes.length;
            this.setTheme(this.themes[nextIndex]);
        },
        
        createSwitcher() {
            // Only show theme switcher to admins
            if (!Permissions.isAdmin()) {
                return;
            }
            
            const navbar = document.querySelector('.navbar');
            if (!navbar || document.querySelector('.ahmadcss-theme-switcher')) return;
            
            const switcher = document.createElement('div');
            switcher.className = 'ahmadcss-theme-switcher';
            
            let buttonsHtml = '';
            this.themes.forEach(theme => {
                const config = this.themeConfig[theme];
                buttonsHtml += `
                    <button class="ahmadcss-theme-btn" data-theme="${theme}" title="${config.name} Theme">
                        <span style="background: ${config.gradient};"></span>
                    </button>
                `;
            });
            switcher.innerHTML = buttonsHtml;
            
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
    
    function isLoginPage() {
        return window.location.pathname === '/login' || 
               window.location.pathname === '/login/' ||
               document.body.classList.contains('login-page') ||
               document.querySelector('.login-content');
    }
    
    function isHomePage() {
        return window.location.pathname === '/' || 
               window.location.pathname === '/app' ||
               window.location.pathname === '/app/' ||
               window.location.pathname === '/app/home';
    }
    
    function activateERPShell() {
        // Don't add erp-shell class - work with Frappe's existing layout
        // Just initialize enhancements if available
        if (window.ERPShell && window.ERPShell.Shell) {
            try {
                window.ERPShell.Shell.init();
            } catch(e) {
                console.warn('ERP Shell init skipped:', e.message);
            }
        }
    }
    
    function init() {
        if (window.frappe?.boot?.developer_mode) {
            console.log(`🎨 AhmadCSS v${CONFIG.version} - Professional Glassmorphism loaded`);
        }
        
        // Clean up any inline styles
        Utils.cleanupInlineStyles();
        
        // ALWAYS apply theme on all pages (including login and home) for consistency
        // Skip theme CONTROLS on login page, but still apply the theme colors
        if (isLoginPage()) {
            ColorTheme.initSilent();  // Apply theme without controls
            return;
        }
        
        // On homepage, only apply theme without showing controls
        if (isHomePage()) {
            ColorTheme.initSilent();  // Apply saved theme without showing switcher
            Toast.init();
            RippleEffect.init();
            SmoothScroll.init();
            SidebarToggle.init();
            MobileSidebar.init();
            activateERPShell();  // Activate ERP Shell v3.0
            return;
        }
        
        // Initialize all modules (only for logged-in users on other pages)
        ColorTheme.init();  // Initialize color theme first
        DarkMode.init();
        Toast.init();
        ThemeCustomizer.init();
        RippleEffect.init();
        SmoothScroll.init();
        SidebarToggle.init();  // Desktop sidebar toggle
        MobileSidebar.init();
        activateERPShell();  // Activate ERP Shell v3.0
        
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
        
        // ERP Shell v3.0
        shell: window.ERPShell || null,
        
        // Utilities
        refresh: Utils.cleanupInlineStyles
    };
    
})();
