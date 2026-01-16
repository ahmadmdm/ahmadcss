/* ═══════════════════════════════════════════════════════════════════════════
   AhmadCSS - Enterprise ERP Layout System v2.0
   JavaScript Module for Frappe-Based ERPNext
   
   Features:
   - Module-aware sidebar navigation
   - Global smart search with Frappe integration
   - KPI dashboard with real-time updates
   - Module tabs with state management
   - Quick actions system
   - Utility panel with widgets
   - Responsive layout management
   - RTL support
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════
    
    const ERP_CONFIG = {
        version: '2.0.0',
        prefix: 'erp_',
        breakpoints: {
            mobile: 640,
            tablet: 1024,
            desktop: 1280
        },
        animations: {
            fast: 100,
            base: 200,
            slow: 300
        },
        modules: {
            home: { icon: 'home', color: '#6366f1', label: 'Home' },
            accounting: { icon: 'calculator', color: '#10b981', label: 'Accounting' },
            selling: { icon: 'shopping-cart', color: '#f59e0b', label: 'Selling' },
            buying: { icon: 'truck', color: '#8b5cf6', label: 'Buying' },
            stock: { icon: 'package', color: '#3b82f6', label: 'Stock' },
            assets: { icon: 'briefcase', color: '#06b6d4', label: 'Assets' },
            manufacturing: { icon: 'settings', color: '#ec4899', label: 'Manufacturing' },
            projects: { icon: 'folder', color: '#f97316', label: 'Projects' },
            quality: { icon: 'check-circle', color: '#14b8a6', label: 'Quality' },
            hr: { icon: 'users', color: '#ef4444', label: 'HR' },
            setup: { icon: 'settings', color: '#64748b', label: 'Settings' }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // SVG ICONS LIBRARY
    // ═══════════════════════════════════════════════════════════════════════
    
    const Icons = {
        // Navigation Icons
        home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
        dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="8" y1="14" y2="14"/><line x1="8" x2="8" y1="18" y2="18"/><line x1="12" x2="12" y1="14" y2="14"/><line x1="12" x2="12" y1="18" y2="18"/><line x1="16" x2="16" y1="14" y2="18"/></svg>',
        'shopping-cart': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
        truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
        package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
        settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
        'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>',
        users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        
        // Action Icons
        search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
        'menu-collapse': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="15" y2="6"/><line x1="3" y1="18" x2="15" y2="18"/></svg>',
        bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
        help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        'chevron-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 12,15 18,9"/></svg>',
        'chevron-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,18 15,12 9,6"/></svg>',
        plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>',
        'star-outline': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>',
        
        // Status Icons
        'trending-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>',
        'trending-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/><polyline points="17,18 23,18 23,12"/></svg>',
        minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        'alert-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
        'alert-triangle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        
        // Document Icons
        file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>',
        'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>',
        'file-plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>',
        clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
        
        // Get icon by name
        get(name) {
            return this[name] || this.file;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════
    
    const Utils = {
        // Storage
        storage: {
            get(key, defaultValue = null) {
                try {
                    const value = localStorage.getItem(ERP_CONFIG.prefix + key);
                    return value !== null ? JSON.parse(value) : defaultValue;
                } catch (e) {
                    return defaultValue;
                }
            },
            set(key, value) {
                try {
                    localStorage.setItem(ERP_CONFIG.prefix + key, JSON.stringify(value));
                    return true;
                } catch (e) {
                    return false;
                }
            },
            remove(key) {
                try {
                    localStorage.removeItem(ERP_CONFIG.prefix + key);
                    return true;
                } catch (e) {
                    return false;
                }
            }
        },

        // DOM Helpers
        $(selector, parent = document) {
            return parent.querySelector(selector);
        },
        
        $$(selector, parent = document) {
            return Array.from(parent.querySelectorAll(selector));
        },
        
        create(tag, attrs = {}, children = []) {
            const el = document.createElement(tag);
            Object.entries(attrs).forEach(([key, value]) => {
                if (key === 'className') {
                    el.className = value;
                } else if (key === 'innerHTML') {
                    el.innerHTML = value;
                } else if (key === 'textContent') {
                    el.textContent = value;
                } else if (key.startsWith('on')) {
                    el.addEventListener(key.slice(2).toLowerCase(), value);
                } else if (key.startsWith('data')) {
                    el.dataset[key.slice(4).toLowerCase()] = value;
                } else {
                    el.setAttribute(key, value);
                }
            });
            children.forEach(child => {
                if (typeof child === 'string') {
                    el.appendChild(document.createTextNode(child));
                } else if (child) {
                    el.appendChild(child);
                }
            });
            return el;
        },

        // Format helpers
        formatNumber(num, decimals = 0) {
            if (num === null || num === undefined) return '0';
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(num);
        },
        
        formatCurrency(amount, currency = 'USD') {
            if (amount === null || amount === undefined) return '$0';
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        },
        
        formatPercent(value) {
            if (value === null || value === undefined) return '0%';
            return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
        },
        
        timeAgo(date) {
            const seconds = Math.floor((new Date() - new Date(date)) / 1000);
            const intervals = {
                year: 31536000,
                month: 2592000,
                week: 604800,
                day: 86400,
                hour: 3600,
                minute: 60
            };
            for (const [unit, secondsInUnit] of Object.entries(intervals)) {
                const interval = Math.floor(seconds / secondsInUnit);
                if (interval >= 1) {
                    return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
                }
            }
            return 'just now';
        },

        // Debounce
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Get current module from URL
        getCurrentModule() {
            const path = window.location.pathname;
            const moduleMap = {
                '/app/accounts': 'accounting',
                '/app/selling': 'selling',
                '/app/buying': 'buying',
                '/app/stock': 'stock',
                '/app/assets': 'assets',
                '/app/manufacturing': 'manufacturing',
                '/app/projects': 'projects',
                '/app/quality': 'quality',
                '/app/hr': 'hr',
                '/app/setup': 'setup',
                '/app': 'home'
            };
            
            for (const [route, module] of Object.entries(moduleMap)) {
                if (path.startsWith(route)) {
                    return module;
                }
            }
            return 'home';
        },

        // Check if Frappe is available
        isFrappeReady() {
            return window.frappe && window.frappe.call;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // SIDEBAR NAVIGATION MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const Sidebar = {
        isCollapsed: false,
        isMobileOpen: false,
        
        init() {
            this.isCollapsed = Utils.storage.get('sidebar_collapsed', false);
            this.render();
            this.bindEvents();
            this.setActiveModule();
        },
        
        render() {
            // Check if sidebar already exists
            if (Utils.$('.erp-sidebar')) return;
            
            const sidebar = Utils.create('aside', { className: 'erp-sidebar' + (this.isCollapsed ? ' erp-sidebar--collapsed' : '') });
            
            sidebar.innerHTML = `
                <div class="erp-sidebar__content">
                    <!-- Core Section -->
                    <div class="erp-sidebar__section">
                        <div class="erp-sidebar__section-title">Core</div>
                        <nav class="erp-sidebar__nav">
                            <a href="/app" class="erp-sidebar__item" data-module="home">
                                ${Icons.get('home')}
                                <span class="erp-sidebar__label">Home</span>
                            </a>
                            <a href="/app/dashboard" class="erp-sidebar__item" data-module="dashboard">
                                ${Icons.get('dashboard')}
                                <span class="erp-sidebar__label">Dashboard</span>
                            </a>
                        </nav>
                    </div>
                    
                    <!-- Business Modules Section -->
                    <div class="erp-sidebar__section">
                        <div class="erp-sidebar__section-title">Business</div>
                        <nav class="erp-sidebar__nav">
                            <a href="/app/accounts" class="erp-sidebar__item" data-module="accounting">
                                ${Icons.get('calculator')}
                                <span class="erp-sidebar__label">Accounting</span>
                            </a>
                            <a href="/app/selling" class="erp-sidebar__item" data-module="selling">
                                ${Icons.get('shopping-cart')}
                                <span class="erp-sidebar__label">Selling</span>
                            </a>
                            <a href="/app/buying" class="erp-sidebar__item" data-module="buying">
                                ${Icons.get('truck')}
                                <span class="erp-sidebar__label">Buying</span>
                            </a>
                            <a href="/app/stock" class="erp-sidebar__item" data-module="stock">
                                ${Icons.get('package')}
                                <span class="erp-sidebar__label">Stock</span>
                            </a>
                            <a href="/app/assets" class="erp-sidebar__item" data-module="assets">
                                ${Icons.get('briefcase')}
                                <span class="erp-sidebar__label">Assets</span>
                            </a>
                            <a href="/app/manufacturing" class="erp-sidebar__item" data-module="manufacturing">
                                ${Icons.get('settings')}
                                <span class="erp-sidebar__label">Manufacturing</span>
                            </a>
                            <a href="/app/projects" class="erp-sidebar__item" data-module="projects">
                                ${Icons.get('folder')}
                                <span class="erp-sidebar__label">Projects</span>
                            </a>
                            <a href="/app/quality" class="erp-sidebar__item" data-module="quality">
                                ${Icons.get('check-circle')}
                                <span class="erp-sidebar__label">Quality</span>
                            </a>
                            <a href="/app/hr" class="erp-sidebar__item" data-module="hr">
                                ${Icons.get('users')}
                                <span class="erp-sidebar__label">HR</span>
                            </a>
                        </nav>
                    </div>
                    
                    <!-- Custom Apps Section -->
                    <div class="erp-sidebar__section">
                        <div class="erp-sidebar__section-title">Apps</div>
                        <nav class="erp-sidebar__nav">
                            <a href="/app/pos" class="erp-sidebar__item" data-module="pos">
                                ${Icons.get('shopping-cart')}
                                <span class="erp-sidebar__label">Point of Sale</span>
                            </a>
                            <a href="/app/restaurant" class="erp-sidebar__item" data-module="restaurant">
                                ${Icons.get('clipboard')}
                                <span class="erp-sidebar__label">Restaurant POS</span>
                            </a>
                        </nav>
                    </div>
                    
                    <!-- System Section -->
                    <div class="erp-sidebar__section">
                        <div class="erp-sidebar__section-title">System</div>
                        <nav class="erp-sidebar__nav">
                            <a href="/app/setup" class="erp-sidebar__item" data-module="setup">
                                ${Icons.get('settings')}
                                <span class="erp-sidebar__label">Settings</span>
                            </a>
                            <a href="/app/users" class="erp-sidebar__item" data-module="users">
                                ${Icons.get('users')}
                                <span class="erp-sidebar__label">Users & Roles</span>
                            </a>
                        </nav>
                    </div>
                </div>
                
                <div class="erp-sidebar__footer">
                    <div class="erp-sidebar__version">v${ERP_CONFIG.version}</div>
                </div>
            `;
            
            // Insert after header or at beginning of body
            const header = Utils.$('.erp-header') || Utils.$('.navbar');
            if (header && header.parentNode) {
                header.parentNode.insertBefore(sidebar, header.nextSibling);
            } else {
                document.body.prepend(sidebar);
            }
            
            this.updateLayoutClass();
        },
        
        bindEvents() {
            // Toggle button in header
            const toggleBtn = Utils.$('.erp-header__toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggle());
            }
            
            // Mobile overlay
            document.addEventListener('click', (e) => {
                if (this.isMobileOpen && !e.target.closest('.erp-sidebar') && !e.target.closest('.erp-header__toggle')) {
                    this.closeMobile();
                }
            });
            
            // Keyboard shortcut
            document.addEventListener('keydown', (e) => {
                if (e.key === '[' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    this.toggle();
                }
            });
            
            // Window resize
            window.addEventListener('resize', Utils.debounce(() => {
                if (window.innerWidth > ERP_CONFIG.breakpoints.tablet) {
                    this.closeMobile();
                }
            }, 200));
        },
        
        toggle() {
            if (window.innerWidth <= ERP_CONFIG.breakpoints.tablet) {
                this.toggleMobile();
            } else {
                this.toggleCollapse();
            }
        },
        
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            Utils.storage.set('sidebar_collapsed', this.isCollapsed);
            
            const sidebar = Utils.$('.erp-sidebar');
            if (sidebar) {
                sidebar.classList.toggle('erp-sidebar--collapsed', this.isCollapsed);
            }
            
            this.updateLayoutClass();
        },
        
        toggleMobile() {
            this.isMobileOpen = !this.isMobileOpen;
            const sidebar = Utils.$('.erp-sidebar');
            if (sidebar) {
                sidebar.classList.toggle('erp-sidebar--mobile-open', this.isMobileOpen);
            }
            
            // Add/remove overlay
            let overlay = Utils.$('.erp-sidebar-overlay');
            if (this.isMobileOpen && !overlay) {
                overlay = Utils.create('div', { className: 'erp-sidebar-overlay' });
                document.body.appendChild(overlay);
            } else if (!this.isMobileOpen && overlay) {
                overlay.remove();
            }
        },
        
        closeMobile() {
            this.isMobileOpen = false;
            const sidebar = Utils.$('.erp-sidebar');
            if (sidebar) {
                sidebar.classList.remove('erp-sidebar--mobile-open');
            }
            const overlay = Utils.$('.erp-sidebar-overlay');
            if (overlay) overlay.remove();
        },
        
        updateLayoutClass() {
            const layout = Utils.$('.erp-layout') || document.body;
            layout.classList.toggle('erp-layout--sidebar-collapsed', this.isCollapsed);
        },
        
        setActiveModule() {
            const currentModule = Utils.getCurrentModule();
            const items = Utils.$$('.erp-sidebar__item');
            
            items.forEach(item => {
                const module = item.dataset.module;
                item.classList.toggle('erp-sidebar__item--active', module === currentModule);
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // HEADER MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const Header = {
        init() {
            this.render();
            this.bindEvents();
            this.updateModuleIndicator();
        },
        
        render() {
            // Don't render on login page
            if (this.isLoginPage()) return;
            
            // Check if our header already exists
            if (Utils.$('.erp-header')) return;
            
            // Get existing navbar for data
            const existingNavbar = Utils.$('.navbar');
            const companyName = this.getCompanyName();
            const userName = this.getUserName();
            const userAvatar = this.getUserAvatar();
            
            const header = Utils.create('header', { className: 'erp-header' });
            header.innerHTML = `
                <div class="erp-header__left">
                    <button class="erp-header__toggle" aria-label="Toggle Sidebar">
                        ${Icons.get('menu')}
                    </button>
                    <a href="/app" class="erp-header__brand">
                        <img src="/assets/frappe/images/frappe-icon.svg" alt="Logo" class="erp-header__logo" onerror="this.style.display='none'">
                        <span class="erp-header__company">${companyName}</span>
                    </a>
                    <div class="erp-header__module">
                        <span class="erp-header__module-dot"></span>
                        <span class="erp-header__module-name">Home</span>
                    </div>
                </div>
                
                <div class="erp-header__center">
                    <div class="erp-search">
                        <span class="erp-search__icon">${Icons.get('search')}</span>
                        <input type="text" class="erp-search__input" placeholder="Search documents, reports, masters..." />
                        <span class="erp-search__shortcut">⌘K</span>
                    </div>
                </div>
                
                <div class="erp-header__right">
                    <button class="erp-header__action" aria-label="Notifications" data-action="notifications">
                        ${Icons.get('bell')}
                        <span class="erp-header__action-badge" style="display: none;">0</span>
                    </button>
                    <button class="erp-header__action" aria-label="Help" data-action="help">
                        ${Icons.get('help')}
                    </button>
                    <button class="erp-header__user">
                        <div class="erp-header__avatar">
                            ${userAvatar ? `<img src="${userAvatar}" alt="${userName}">` : userName.charAt(0).toUpperCase()}
                        </div>
                        <span class="erp-header__user-name">${userName}</span>
                        <span class="erp-header__user-chevron">${Icons.get('chevron-down')}</span>
                    </button>
                </div>
            `;
            
            // Insert header
            if (existingNavbar) {
                existingNavbar.style.display = 'none';
            }
            document.body.prepend(header);
        },
        
        bindEvents() {
            // Search focus
            const searchInput = Utils.$('.erp-search__input');
            if (searchInput) {
                searchInput.addEventListener('focus', () => {
                    this.openSearch();
                });
                
                searchInput.addEventListener('input', Utils.debounce((e) => {
                    this.handleSearch(e.target.value);
                }, 300));
                
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        searchInput.blur();
                    }
                });
            }
            
            // Keyboard shortcut for search
            document.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    if (searchInput) searchInput.focus();
                }
            });
            
            // User menu
            const userBtn = Utils.$('.erp-header__user');
            if (userBtn) {
                userBtn.addEventListener('click', () => this.toggleUserMenu());
            }
            
            // Notifications
            const notifBtn = Utils.$('[data-action="notifications"]');
            if (notifBtn) {
                notifBtn.addEventListener('click', () => this.openNotifications());
            }
            
            // Help
            const helpBtn = Utils.$('[data-action="help"]');
            if (helpBtn) {
                helpBtn.addEventListener('click', () => this.openHelp());
            }
        },
        
        isLoginPage() {
            return window.location.pathname === '/login' || 
                   window.location.pathname === '/login/' ||
                   document.body.classList.contains('login-page');
        },
        
        getCompanyName() {
            if (Utils.isFrappeReady() && frappe.defaults) {
                return frappe.defaults.get_default('company') || 'ERP System';
            }
            return 'ERP System';
        },
        
        getUserName() {
            if (Utils.isFrappeReady() && frappe.session) {
                return frappe.session.user_fullname || frappe.session.user || 'User';
            }
            return 'User';
        },
        
        getUserAvatar() {
            if (Utils.isFrappeReady() && frappe.user_info) {
                const info = frappe.user_info(frappe.session.user);
                return info?.image || null;
            }
            return null;
        },
        
        updateModuleIndicator() {
            const currentModule = Utils.getCurrentModule();
            const moduleConfig = ERP_CONFIG.modules[currentModule] || ERP_CONFIG.modules.home;
            
            const moduleNameEl = Utils.$('.erp-header__module-name');
            const moduleDotEl = Utils.$('.erp-header__module-dot');
            
            if (moduleNameEl) {
                moduleNameEl.textContent = moduleConfig.label;
            }
            if (moduleDotEl) {
                moduleDotEl.style.background = moduleConfig.color;
            }
        },
        
        openSearch() {
            // Use Frappe's search if available
            if (Utils.isFrappeReady() && frappe.ui && frappe.ui.toolbar) {
                frappe.ui.toolbar.search?.show();
            }
        },
        
        handleSearch(query) {
            if (!query || query.length < 2) return;
            
            if (Utils.isFrappeReady() && frappe.call) {
                frappe.call({
                    method: 'frappe.utils.global_search.search',
                    args: { text: query, limit: 10 },
                    callback: (r) => {
                        this.showSearchResults(r.message);
                    }
                });
            }
        },
        
        showSearchResults(results) {
            // Implementation for search dropdown
            console.log('Search results:', results);
        },
        
        toggleUserMenu() {
            // Use Frappe's user dropdown if available
            if (Utils.isFrappeReady() && frappe.ui && frappe.ui.toolbar) {
                const dropdown = Utils.$('.dropdown-navbar-user');
                if (dropdown) {
                    dropdown.querySelector('.dropdown-toggle')?.click();
                }
            }
        },
        
        openNotifications() {
            if (Utils.isFrappeReady() && frappe.ui && frappe.ui.notifications) {
                frappe.ui.notifications.show();
            }
        },
        
        openHelp() {
            if (Utils.isFrappeReady() && frappe.ui) {
                frappe.ui.toolbar.show_help_modal?.();
            } else {
                window.open('https://docs.frappe.io', '_blank');
            }
        },
        
        setNotificationCount(count) {
            const badge = Utils.$('.erp-header__action-badge');
            if (badge) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = count > 0 ? 'flex' : 'none';
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // KPI DASHBOARD MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const KPIDashboard = {
        init() {
            this.setupMutationObserver();
        },
        
        setupMutationObserver() {
            // Watch for page changes to inject KPI cards
            const observer = new MutationObserver(Utils.debounce(() => {
                this.checkAndRenderKPIs();
            }, 500));
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },
        
        checkAndRenderKPIs() {
            // Check if we're on a module landing page
            const pageContainer = Utils.$('.page-container .layout-main-section');
            if (!pageContainer) return;
            
            // Don't add if already exists
            if (Utils.$('.erp-kpi-grid', pageContainer)) return;
            
            const currentModule = Utils.getCurrentModule();
            if (currentModule && currentModule !== 'home') {
                // Module page - could add KPIs here if needed
            }
        },
        
        createKPICard(config) {
            const { label, value, trend, trendValue, icon, variant = '' } = config;
            
            const trendClass = trend === 'up' ? 'erp-kpi-card__trend--up' :
                              trend === 'down' ? 'erp-kpi-card__trend--down' :
                              'erp-kpi-card__trend--neutral';
            
            const trendIcon = trend === 'up' ? Icons.get('trending-up') :
                             trend === 'down' ? Icons.get('trending-down') :
                             Icons.get('minus');
            
            const card = Utils.create('div', { 
                className: `erp-kpi-card ${variant ? `erp-kpi-card--${variant}` : ''}`
            });
            
            card.innerHTML = `
                <div class="erp-kpi-card__header">
                    <div class="erp-kpi-card__icon">
                        ${Icons.get(icon || 'file')}
                    </div>
                    ${trendValue !== undefined ? `
                        <div class="erp-kpi-card__trend ${trendClass}">
                            ${trendIcon}
                            <span>${Utils.formatPercent(trendValue)}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="erp-kpi-card__value">${value}</div>
                <div class="erp-kpi-card__label">${label}</div>
            `;
            
            return card;
        },
        
        createKPIGrid(kpis) {
            const grid = Utils.create('div', { className: 'erp-kpi-grid' });
            kpis.forEach(kpi => {
                grid.appendChild(this.createKPICard(kpi));
            });
            return grid;
        },
        
        // Module-specific KPI configurations
        getModuleKPIs(module) {
            const kpiConfigs = {
                accounting: [
                    { label: 'Total Revenue', value: '$0', icon: 'trending-up', trend: 'up', trendValue: 12.5, variant: 'success' },
                    { label: 'Total Expenses', value: '$0', icon: 'trending-down', trend: 'down', trendValue: -3.2, variant: 'warning' },
                    { label: 'Net Profit', value: '$0', icon: 'calculator', trend: 'up', trendValue: 8.7, variant: 'success' },
                    { label: 'Outstanding Receivables', value: '$0', icon: 'file-text', trend: 'neutral', trendValue: 0 },
                    { label: 'Outstanding Payables', value: '$0', icon: 'file-text', trend: 'neutral', trendValue: 0 }
                ],
                selling: [
                    { label: 'Total Orders', value: '0', icon: 'shopping-cart', trend: 'up', trendValue: 15.3 },
                    { label: 'Revenue This Month', value: '$0', icon: 'trending-up', variant: 'success' },
                    { label: 'Active Customers', value: '0', icon: 'users' },
                    { label: 'Pending Deliveries', value: '0', icon: 'truck', variant: 'warning' }
                ],
                buying: [
                    { label: 'Purchase Orders', value: '0', icon: 'file-text' },
                    { label: 'Pending Receipts', value: '0', icon: 'package', variant: 'warning' },
                    { label: 'Active Suppliers', value: '0', icon: 'users' },
                    { label: 'This Month Spend', value: '$0', icon: 'calculator' }
                ],
                stock: [
                    { label: 'Total Stock Value', value: '$0', icon: 'package' },
                    { label: 'Low Stock Items', value: '0', icon: 'alert-triangle', variant: 'error' },
                    { label: 'Pending Transfers', value: '0', icon: 'truck' },
                    { label: 'Warehouses', value: '0', icon: 'home' }
                ],
                hr: [
                    { label: 'Total Employees', value: '0', icon: 'users' },
                    { label: 'Present Today', value: '0', icon: 'check-circle', variant: 'success' },
                    { label: 'On Leave', value: '0', icon: 'alert-circle', variant: 'warning' },
                    { label: 'Open Positions', value: '0', icon: 'briefcase' }
                ]
            };
            
            return kpiConfigs[module] || [];
        },
        
        // Fetch real data for KPIs
        async fetchKPIData(module) {
            if (!Utils.isFrappeReady()) return null;
            
            try {
                const response = await frappe.call({
                    method: 'ahmadcss.api.get_module_kpis',
                    args: { module },
                    async: true
                });
                return response.message;
            } catch (e) {
                console.warn('Could not fetch KPI data:', e);
                return null;
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // QUICK ACTIONS MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const QuickActions = {
        getModuleActions(module) {
            const actionConfigs = {
                accounting: [
                    { label: 'Sales Invoice', icon: 'file-plus', route: '/app/sales-invoice/new' },
                    { label: 'Purchase Invoice', icon: 'file-plus', route: '/app/purchase-invoice/new' },
                    { label: 'Payment Entry', icon: 'file-text', route: '/app/payment-entry/new' },
                    { label: 'Journal Entry', icon: 'clipboard', route: '/app/journal-entry/new' },
                    { label: 'Chart of Accounts', icon: 'folder', route: '/app/account' },
                    { label: 'Financial Reports', icon: 'file-text', route: '/app/query-report' }
                ],
                selling: [
                    { label: 'Quotation', icon: 'file-plus', route: '/app/quotation/new' },
                    { label: 'Sales Order', icon: 'file-text', route: '/app/sales-order/new' },
                    { label: 'Delivery Note', icon: 'truck', route: '/app/delivery-note/new' },
                    { label: 'Sales Invoice', icon: 'file-plus', route: '/app/sales-invoice/new' },
                    { label: 'Customers', icon: 'users', route: '/app/customer' },
                    { label: 'Items', icon: 'package', route: '/app/item' }
                ],
                buying: [
                    { label: 'Supplier Quotation', icon: 'file-plus', route: '/app/supplier-quotation/new' },
                    { label: 'Purchase Order', icon: 'file-text', route: '/app/purchase-order/new' },
                    { label: 'Purchase Receipt', icon: 'package', route: '/app/purchase-receipt/new' },
                    { label: 'Purchase Invoice', icon: 'file-plus', route: '/app/purchase-invoice/new' },
                    { label: 'Suppliers', icon: 'users', route: '/app/supplier' },
                    { label: 'Items', icon: 'package', route: '/app/item' }
                ],
                stock: [
                    { label: 'Stock Entry', icon: 'file-plus', route: '/app/stock-entry/new' },
                    { label: 'Material Request', icon: 'file-text', route: '/app/material-request/new' },
                    { label: 'Stock Balance', icon: 'package', route: '/app/query-report/Stock Balance' },
                    { label: 'Item', icon: 'package', route: '/app/item/new' },
                    { label: 'Warehouse', icon: 'home', route: '/app/warehouse' },
                    { label: 'Stock Ledger', icon: 'file-text', route: '/app/query-report/Stock Ledger' }
                ],
                hr: [
                    { label: 'Employee', icon: 'users', route: '/app/employee/new' },
                    { label: 'Attendance', icon: 'check-circle', route: '/app/attendance/new' },
                    { label: 'Leave Application', icon: 'file-text', route: '/app/leave-application/new' },
                    { label: 'Payroll Entry', icon: 'calculator', route: '/app/payroll-entry/new' },
                    { label: 'Expense Claim', icon: 'file-plus', route: '/app/expense-claim/new' },
                    { label: 'Employee List', icon: 'users', route: '/app/employee' }
                ]
            };
            
            return actionConfigs[module] || [];
        },
        
        createActionCard(action) {
            const card = Utils.create('a', { 
                className: 'erp-action-card',
                href: action.route
            });
            
            card.innerHTML = `
                <div class="erp-action-card__icon">
                    ${Icons.get(action.icon)}
                </div>
                <span class="erp-action-card__label">${action.label}</span>
                ${action.description ? `<span class="erp-action-card__description">${action.description}</span>` : ''}
            `;
            
            return card;
        },
        
        createActionsGrid(module) {
            const actions = this.getModuleActions(module);
            if (!actions.length) return null;
            
            const container = Utils.create('div', { className: 'erp-quick-actions' });
            container.innerHTML = `
                <div class="erp-quick-actions__header">
                    <h3 class="erp-quick-actions__title">Quick Actions</h3>
                    <a href="/app/workspaces" class="erp-quick-actions__link">View All →</a>
                </div>
                <div class="erp-quick-actions__grid"></div>
            `;
            
            const grid = Utils.$('.erp-quick-actions__grid', container);
            actions.forEach(action => {
                grid.appendChild(this.createActionCard(action));
            });
            
            return container;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // MODULE TABS
    // ═══════════════════════════════════════════════════════════════════════
    
    const ModuleTabs = {
        defaultTabs: ['Overview', 'Transactions', 'Reports', 'Masters', 'Setup'],
        
        createTabs(tabs = this.defaultTabs, activeTab = 'Overview') {
            const tabsContainer = Utils.create('div', { className: 'erp-tabs' });
            
            tabs.forEach(tab => {
                const tabBtn = Utils.create('button', {
                    className: `erp-tabs__item ${tab === activeTab ? 'erp-tabs__item--active' : ''}`,
                    textContent: tab,
                    'data-tab': tab.toLowerCase()
                });
                
                tabBtn.addEventListener('click', () => this.switchTab(tab.toLowerCase(), tabsContainer));
                tabsContainer.appendChild(tabBtn);
            });
            
            return tabsContainer;
        },
        
        switchTab(tabId, container) {
            // Update active tab button
            Utils.$$('.erp-tabs__item', container).forEach(btn => {
                btn.classList.toggle('erp-tabs__item--active', btn.dataset.tab === tabId);
            });
            
            // Update tab panels
            Utils.$$('.erp-tab-panel').forEach(panel => {
                panel.classList.toggle('erp-tab-panel--active', panel.dataset.tab === tabId);
            });
            
            // Emit event for external handlers
            container.dispatchEvent(new CustomEvent('tabchange', { detail: { tab: tabId } }));
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY PANEL
    // ═══════════════════════════════════════════════════════════════════════
    
    const UtilityPanel = {
        isOpen: false,
        
        init() {
            this.render();
            this.bindEvents();
        },
        
        render() {
            if (Utils.$('.erp-utility-panel')) return;
            
            const panel = Utils.create('aside', { className: 'erp-utility-panel' });
            panel.innerHTML = `
                <div class="erp-utility-panel__header">
                    <h3 class="erp-utility-panel__title">Quick Access</h3>
                    <button class="erp-utility-panel__close" aria-label="Close">
                        ${Icons.get('x')}
                    </button>
                </div>
                <div class="erp-utility-panel__content">
                    <!-- Favorites Widget -->
                    <div class="erp-widget">
                        <div class="erp-widget__header">
                            <span class="erp-widget__title">Favorites</span>
                            <button class="erp-widget__action">Edit</button>
                        </div>
                        <ul class="erp-favorites" id="erp-favorites-list">
                            <!-- Populated dynamically -->
                        </ul>
                    </div>
                    
                    <!-- Recent Documents Widget -->
                    <div class="erp-widget">
                        <div class="erp-widget__header">
                            <span class="erp-widget__title">Recent</span>
                            <button class="erp-widget__action">Clear</button>
                        </div>
                        <ul class="erp-recent-docs" id="erp-recent-list">
                            <!-- Populated dynamically -->
                        </ul>
                    </div>
                    
                    <!-- Alerts Widget -->
                    <div class="erp-widget">
                        <div class="erp-widget__header">
                            <span class="erp-widget__title">Alerts</span>
                        </div>
                        <ul class="erp-alerts" id="erp-alerts-list">
                            <!-- Populated dynamically -->
                        </ul>
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            this.loadFavorites();
            this.loadRecents();
        },
        
        bindEvents() {
            const closeBtn = Utils.$('.erp-utility-panel__close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }
            
            // Keyboard shortcut
            document.addEventListener('keydown', (e) => {
                if (e.key === ']' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    this.toggle();
                }
            });
        },
        
        toggle() {
            this.isOpen ? this.close() : this.open();
        },
        
        open() {
            this.isOpen = true;
            const panel = Utils.$('.erp-utility-panel');
            if (panel) {
                panel.classList.add('erp-utility-panel--open');
            }
            document.body.classList.add('erp-layout--utility-open');
        },
        
        close() {
            this.isOpen = false;
            const panel = Utils.$('.erp-utility-panel');
            if (panel) {
                panel.classList.remove('erp-utility-panel--open');
            }
            document.body.classList.remove('erp-layout--utility-open');
        },
        
        loadFavorites() {
            const list = Utils.$('#erp-favorites-list');
            if (!list) return;
            
            const favorites = Utils.storage.get('favorites', []);
            
            if (favorites.length === 0) {
                list.innerHTML = '<li class="erp-favorites__empty">No favorites yet. Star items to add them here.</li>';
                return;
            }
            
            list.innerHTML = favorites.map(fav => `
                <li>
                    <a href="${fav.route}" class="erp-favorites__item">
                        ${Icons.get('star')}
                        <span>${fav.label}</span>
                    </a>
                </li>
            `).join('');
        },
        
        loadRecents() {
            const list = Utils.$('#erp-recent-list');
            if (!list) return;
            
            // Try to get from Frappe's route history
            let recents = [];
            if (Utils.isFrappeReady() && frappe.route_history) {
                recents = frappe.route_history.slice(0, 5).map(route => ({
                    name: route[1] || route[0],
                    type: route[0],
                    route: '/app/' + route.join('/'),
                    time: new Date()
                }));
            }
            
            if (recents.length === 0) {
                list.innerHTML = '<li class="erp-recent-docs__empty">No recent documents.</li>';
                return;
            }
            
            list.innerHTML = recents.map(doc => `
                <li>
                    <a href="${doc.route}" class="erp-recent-docs__item">
                        <div class="erp-recent-docs__icon">
                            ${Icons.get('file-text')}
                        </div>
                        <div class="erp-recent-docs__info">
                            <div class="erp-recent-docs__name">${doc.name}</div>
                            <div class="erp-recent-docs__meta">${doc.type}</div>
                        </div>
                    </a>
                </li>
            `).join('');
        },
        
        addFavorite(item) {
            const favorites = Utils.storage.get('favorites', []);
            if (!favorites.find(f => f.route === item.route)) {
                favorites.push(item);
                Utils.storage.set('favorites', favorites);
                this.loadFavorites();
            }
        },
        
        removeFavorite(route) {
            let favorites = Utils.storage.get('favorites', []);
            favorites = favorites.filter(f => f.route !== route);
            Utils.storage.set('favorites', favorites);
            this.loadFavorites();
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // MASTERS ACCORDION
    // ═══════════════════════════════════════════════════════════════════════
    
    const MastersAccordion = {
        getModuleMasters(module) {
            const mastersConfig = {
                accounting: {
                    masters: [
                        { label: 'Chart of Accounts', route: '/app/account' },
                        { label: 'Cost Center', route: '/app/cost-center' },
                        { label: 'Fiscal Year', route: '/app/fiscal-year' },
                        { label: 'Accounting Period', route: '/app/accounting-period' }
                    ],
                    transactions: [
                        { label: 'Sales Invoice', route: '/app/sales-invoice' },
                        { label: 'Purchase Invoice', route: '/app/purchase-invoice' },
                        { label: 'Payment Entry', route: '/app/payment-entry' },
                        { label: 'Journal Entry', route: '/app/journal-entry' }
                    ],
                    reports: [
                        { label: 'General Ledger', route: '/app/query-report/General Ledger' },
                        { label: 'Trial Balance', route: '/app/query-report/Trial Balance' },
                        { label: 'Profit & Loss', route: '/app/query-report/Profit and Loss Statement' },
                        { label: 'Balance Sheet', route: '/app/query-report/Balance Sheet' }
                    ],
                    settings: [
                        { label: 'Accounts Settings', route: '/app/accounts-settings' },
                        { label: 'Tax Templates', route: '/app/sales-taxes-and-charges-template' }
                    ]
                },
                selling: {
                    masters: [
                        { label: 'Customer', route: '/app/customer' },
                        { label: 'Customer Group', route: '/app/customer-group' },
                        { label: 'Territory', route: '/app/territory' },
                        { label: 'Sales Person', route: '/app/sales-person' }
                    ],
                    transactions: [
                        { label: 'Quotation', route: '/app/quotation' },
                        { label: 'Sales Order', route: '/app/sales-order' },
                        { label: 'Delivery Note', route: '/app/delivery-note' },
                        { label: 'Sales Invoice', route: '/app/sales-invoice' }
                    ],
                    reports: [
                        { label: 'Sales Analytics', route: '/app/query-report/Sales Analytics' },
                        { label: 'Sales Order Trends', route: '/app/query-report/Sales Order Trends' },
                        { label: 'Customer Acquisition', route: '/app/query-report/Customer Acquisition and Loyalty' }
                    ]
                }
                // Add more modules as needed
            };
            
            return mastersConfig[module] || {};
        },
        
        createSection(title, items, icon = 'folder') {
            const section = Utils.create('div', { className: 'erp-masters__section' });
            
            section.innerHTML = `
                <div class="erp-masters__header">
                    <div class="erp-masters__header-left">
                        <div class="erp-masters__header-icon">
                            ${Icons.get(icon)}
                        </div>
                        <span class="erp-masters__header-title">${title}</span>
                        <span class="erp-masters__header-count">(${items.length})</span>
                    </div>
                    <span class="erp-masters__chevron">${Icons.get('chevron-down')}</span>
                </div>
                <div class="erp-masters__content">
                    <ul class="erp-masters__list">
                        ${items.map(item => `
                            <li>
                                <a href="${item.route}" class="erp-masters__item">
                                    ${Icons.get('chevron-right')}
                                    <span>${item.label}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
            
            // Toggle functionality
            const header = Utils.$('.erp-masters__header', section);
            header.addEventListener('click', () => {
                section.classList.toggle('erp-masters__section--open');
            });
            
            return section;
        },
        
        createAccordion(module) {
            const config = this.getModuleMasters(module);
            if (!Object.keys(config).length) return null;
            
            const container = Utils.create('div', { className: 'erp-masters' });
            
            if (config.masters) {
                container.appendChild(this.createSection('Masters', config.masters, 'folder'));
            }
            if (config.transactions) {
                container.appendChild(this.createSection('Transactions', config.transactions, 'file-text'));
            }
            if (config.reports) {
                container.appendChild(this.createSection('Reports', config.reports, 'file'));
            }
            if (config.settings) {
                container.appendChild(this.createSection('Settings', config.settings, 'settings'));
            }
            
            return container;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // FOOTER MODULE
    // ═══════════════════════════════════════════════════════════════════════
    
    const Footer = {
        init() {
            this.render();
        },
        
        render() {
            if (Utils.$('.erp-footer')) return;
            
            const version = Utils.isFrappeReady() && frappe.boot ? frappe.boot.versions?.frappe : 'v15';
            const environment = Utils.isFrappeReady() && frappe.boot?.developer_mode ? 'Development' : 'Production';
            
            const footer = Utils.create('footer', { className: 'erp-footer' });
            footer.innerHTML = `
                <span class="erp-footer__item">AhmadCSS Enterprise</span>
                <span class="erp-footer__separator">•</span>
                <span class="erp-footer__item">${version}</span>
                <span class="erp-footer__separator">•</span>
                <span class="erp-footer__item">${environment}</span>
            `;
            
            document.body.appendChild(footer);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    
    const ERPLayout = {
        initialized: false,
        
        init() {
            if (this.initialized) return;
            
            // Don't initialize on login page
            if (this.isLoginPage()) return;
            
            // Wait for DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        },
        
        isLoginPage() {
            return window.location.pathname === '/login' || 
                   window.location.pathname === '/login/' ||
                   document.body.classList.contains('login-page');
        },
        
        setup() {
            // Add layout class to body
            document.body.classList.add('erp-layout');
            
            // Initialize modules
            Header.init();
            Sidebar.init();
            UtilityPanel.init();
            KPIDashboard.init();
            Footer.init();
            
            // Route change handling
            this.setupRouteListener();
            
            this.initialized = true;
            
            // Emit ready event
            document.dispatchEvent(new CustomEvent('erp-layout-ready'));
            
            console.log(`%c🎨 AhmadCSS Enterprise Layout v${ERP_CONFIG.version} Loaded`, 
                'color: #6366f1; font-weight: bold; font-size: 14px;');
        },
        
        setupRouteListener() {
            // Listen for Frappe route changes
            if (Utils.isFrappeReady() && frappe.router) {
                $(document).on('page-change', () => {
                    Header.updateModuleIndicator();
                    Sidebar.setActiveModule();
                });
            }
            
            // Fallback: History API
            const originalPushState = history.pushState;
            history.pushState = function() {
                originalPushState.apply(history, arguments);
                Header.updateModuleIndicator();
                Sidebar.setActiveModule();
            };
            
            window.addEventListener('popstate', () => {
                Header.updateModuleIndicator();
                Sidebar.setActiveModule();
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // EXPORTS
    // ═══════════════════════════════════════════════════════════════════════
    
    // Export to global scope
    window.ERPLayout = {
        init: () => ERPLayout.init(),
        Sidebar,
        Header,
        KPIDashboard,
        QuickActions,
        ModuleTabs,
        UtilityPanel,
        MastersAccordion,
        Utils,
        Icons,
        CONFIG: ERP_CONFIG
    };
    
    // Auto-initialize when Frappe is ready
    if (Utils.isFrappeReady()) {
        $(document).ready(() => ERPLayout.init());
    } else {
        // Fallback initialization
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => ERPLayout.init(), 500);
        });
    }

})();
