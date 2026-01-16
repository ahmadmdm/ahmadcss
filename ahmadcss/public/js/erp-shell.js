/* ═══════════════════════════════════════════════════════════════════════════
   AhmadCSS - ERP Shell Controller v3.0
   
   🎯 UNIVERSAL WORKSPACE LAYOUT FRAMEWORK
   Every workspace uses the EXACT same structure:
   - Shell (sidebar + header + content)
   - Context Tabs (Overview, Transactions, Reports, Masters, Setup)
   - KPI Summary (3-5 cards)
   - Content Panels
   
   Only DATA changes between workspaces, never the layout.
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // 🗂️ WORKSPACE DEFINITIONS
    // All workspaces available in the system
    // ═══════════════════════════════════════════════════════════════════════

    const WORKSPACES = {
        home: {
            id: 'home',
            label: 'الرئيسية',
            labelEn: 'Home',
            icon: 'home',
            route: '/app'
        },
        finance: {
            id: 'finance',
            label: 'المالية',
            labelEn: 'Finance',
            icon: 'wallet',
            route: '/app/finance'
        },
        sales: {
            id: 'sales',
            label: 'المبيعات',
            labelEn: 'Sales',
            icon: 'shopping-cart',
            route: '/app/sales'
        },
        purchasing: {
            id: 'purchasing',
            label: 'المشتريات',
            labelEn: 'Purchasing',
            icon: 'truck',
            route: '/app/purchasing'
        },
        inventory: {
            id: 'inventory',
            label: 'المخزون',
            labelEn: 'Inventory',
            icon: 'package',
            route: '/app/inventory'
        },
        manufacturing: {
            id: 'manufacturing',
            label: 'التصنيع',
            labelEn: 'Manufacturing',
            icon: 'settings',
            route: '/app/manufacturing'
        },
        people: {
            id: 'people',
            label: 'الموارد البشرية',
            labelEn: 'People',
            icon: 'users',
            route: '/app/people'
        },
        projects: {
            id: 'projects',
            label: 'المشاريع',
            labelEn: 'Projects',
            icon: 'folder',
            route: '/app/projects'
        },
        quality: {
            id: 'quality',
            label: 'الجودة',
            labelEn: 'Quality',
            icon: 'check-circle',
            route: '/app/quality'
        },
        system: {
            id: 'system',
            label: 'النظام',
            labelEn: 'System',
            icon: 'sliders',
            route: '/app/system'
        }
    };

    // Context Tabs - Same for ALL workspaces
    const CONTEXT_TABS = [
        { id: 'overview', label: 'نظرة عامة', labelEn: 'Overview', icon: 'grid' },
        { id: 'transactions', label: 'العمليات', labelEn: 'Transactions', icon: 'file-text' },
        { id: 'reports', label: 'التقارير', labelEn: 'Reports', icon: 'bar-chart-2' },
        { id: 'masters', label: 'البيانات الرئيسية', labelEn: 'Masters', icon: 'database' },
        { id: 'setup', label: 'الإعدادات', labelEn: 'Setup', icon: 'settings', requiresRole: ['System Manager', 'Administrator'] }
    ];

    // ═══════════════════════════════════════════════════════════════════════
    // 🎨 ICONS - Feather-style SVG icons
    // ═══════════════════════════════════════════════════════════════════════

    const ICONS = {
        home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
        wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
        'shopping-cart': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
        truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
        package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
        'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
        grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        'bar-chart-2': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
        database: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
        search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
        menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
        plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        'chevron-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
        'chevron-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
        x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
        sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
        'arrow-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
        'arrow-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
        refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>'
    };

    function getIcon(name) {
        return ICONS[name] || ICONS.grid;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🔧 UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    function formatCurrency(value, currency = 'SAR') {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    function formatNumber(value) {
        return new Intl.NumberFormat('ar-SA').format(value);
    }

    function formatPercent(value) {
        return (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function hasRole(roles) {
        if (!frappe.user_roles) return false;
        return roles.some(role => frappe.user_roles.includes(role));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🎛️ SHELL CONTROLLER
    // Main controller for the entire ERP shell
    // ═══════════════════════════════════════════════════════════════════════

    const Shell = {
        state: {
            currentWorkspace: null,
            currentTab: 'overview',
            sidebarCollapsed: false,
            darkMode: false
        },

        init() {
            // Check if we're in Frappe Desk
            if (typeof frappe === 'undefined') {
                console.warn('Frappe not found. Shell running in standalone mode.');
            }

            // Load saved preferences
            this.loadPreferences();
            
            // Initialize components
            this.initSidebar();
            this.initHeader();
            this.detectCurrentWorkspace();
            
            // Setup event listeners
            this.bindEvents();

            console.log('ERP Shell initialized');
        },

        loadPreferences() {
            try {
                const prefs = localStorage.getItem('ahmadcss_shell_prefs');
                if (prefs) {
                    const parsed = JSON.parse(prefs);
                    this.state.sidebarCollapsed = parsed.sidebarCollapsed || false;
                    this.state.darkMode = parsed.darkMode || false;
                }
            } catch (e) {
                console.warn('Could not load shell preferences');
            }
        },

        savePreferences() {
            try {
                localStorage.setItem('ahmadcss_shell_prefs', JSON.stringify({
                    sidebarCollapsed: this.state.sidebarCollapsed,
                    darkMode: this.state.darkMode
                }));
            } catch (e) {
                console.warn('Could not save shell preferences');
            }
        },

        initSidebar() {
            const sidebar = document.querySelector('.shell-sidebar');
            if (!sidebar) return;

            // Build workspace navigation
            const nav = sidebar.querySelector('.shell-sidebar__nav');
            if (nav) {
                nav.innerHTML = this.renderWorkspaceNav();
            }

            // Set collapsed state
            if (this.state.sidebarCollapsed) {
                sidebar.classList.add('shell-sidebar--collapsed');
            }
        },

        renderWorkspaceNav() {
            let html = '<ul class="workspace-nav">';
            
            for (const [id, workspace] of Object.entries(WORKSPACES)) {
                const isActive = this.state.currentWorkspace === id;
                html += `
                    <li class="workspace-nav__item ${isActive ? 'workspace-nav__item--active' : ''}">
                        <a href="${workspace.route}" class="workspace-nav__link" data-workspace="${id}">
                            <span class="workspace-nav__icon">${getIcon(workspace.icon)}</span>
                            <span class="workspace-nav__label">${workspace.label}</span>
                        </a>
                    </li>
                `;
            }
            
            html += '</ul>';
            return html;
        },

        initHeader() {
            const header = document.querySelector('.shell-header');
            if (!header) return;

            // Add search functionality
            const searchInput = header.querySelector('.shell-search__input');
            if (searchInput) {
                searchInput.addEventListener('input', debounce((e) => {
                    this.handleSearch(e.target.value);
                }, 300));
            }
        },

        detectCurrentWorkspace() {
            // Detect workspace from URL
            const path = window.location.pathname;
            
            for (const [id, workspace] of Object.entries(WORKSPACES)) {
                if (path.includes(workspace.route) || path === workspace.route) {
                    this.state.currentWorkspace = id;
                    break;
                }
            }

            // Default to home
            if (!this.state.currentWorkspace) {
                this.state.currentWorkspace = 'home';
            }

            this.updateActiveWorkspace();
        },

        updateActiveWorkspace() {
            // Update sidebar active state
            document.querySelectorAll('.workspace-nav__item').forEach(item => {
                item.classList.remove('workspace-nav__item--active');
            });

            const activeLink = document.querySelector(`[data-workspace="${this.state.currentWorkspace}"]`);
            if (activeLink) {
                activeLink.closest('.workspace-nav__item').classList.add('workspace-nav__item--active');
            }

            // Update page title in header
            const workspace = WORKSPACES[this.state.currentWorkspace];
            const titleEl = document.querySelector('.shell-header__title');
            if (titleEl && workspace) {
                titleEl.textContent = workspace.label;
            }
        },

        bindEvents() {
            // Sidebar toggle
            document.addEventListener('click', (e) => {
                const toggle = e.target.closest('[data-action="toggle-sidebar"]');
                if (toggle) {
                    this.toggleSidebar();
                }
            });

            // Dark mode toggle
            document.addEventListener('click', (e) => {
                const toggle = e.target.closest('[data-action="toggle-dark-mode"]');
                if (toggle) {
                    this.toggleDarkMode();
                }
            });

            // Workspace navigation
            document.addEventListener('click', (e) => {
                const link = e.target.closest('.workspace-nav__link');
                if (link) {
                    e.preventDefault();
                    const workspaceId = link.dataset.workspace;
                    this.navigateToWorkspace(workspaceId);
                }
            });

            // Context tab switching
            document.addEventListener('click', (e) => {
                const tab = e.target.closest('.workspace-tabs__item');
                if (tab) {
                    const tabId = tab.dataset.tab;
                    this.switchTab(tabId);
                }
            });

            // Masters group toggle
            document.addEventListener('click', (e) => {
                const header = e.target.closest('.masters-group__header');
                if (header) {
                    const group = header.closest('.masters-group');
                    group.classList.toggle('masters-group--open');
                }
            });

            // Responsive sidebar close on outside click
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    const sidebar = document.querySelector('.shell-sidebar');
                    const toggle = e.target.closest('[data-action="toggle-sidebar"]');
                    
                    if (sidebar && !sidebar.contains(e.target) && !toggle && !sidebar.classList.contains('shell-sidebar--collapsed')) {
                        this.toggleSidebar();
                    }
                }
            });
        },

        toggleSidebar() {
            const sidebar = document.querySelector('.shell-sidebar');
            const shell = document.querySelector('.shell');
            
            if (sidebar) {
                this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
                sidebar.classList.toggle('shell-sidebar--collapsed');
                if (shell) {
                    shell.classList.toggle('shell--sidebar-collapsed');
                }
                this.savePreferences();
            }
        },

        toggleDarkMode() {
            this.state.darkMode = !this.state.darkMode;
            document.documentElement.classList.toggle('dark-mode', this.state.darkMode);
            this.savePreferences();
        },

        navigateToWorkspace(workspaceId) {
            const workspace = WORKSPACES[workspaceId];
            if (!workspace) return;

            this.state.currentWorkspace = workspaceId;
            this.state.currentTab = 'overview';
            this.updateActiveWorkspace();

            // Navigate using Frappe router or direct
            if (typeof frappe !== 'undefined' && frappe.set_route) {
                frappe.set_route(workspace.route.replace('/app/', ''));
            } else {
                window.location.href = workspace.route;
            }
        },

        switchTab(tabId) {
            // Check role requirement for setup tab
            const tab = CONTEXT_TABS.find(t => t.id === tabId);
            if (tab && tab.requiresRole && !hasRole(tab.requiresRole)) {
                console.warn('Access denied to tab:', tabId);
                return;
            }

            this.state.currentTab = tabId;

            // Update tab buttons
            document.querySelectorAll('.workspace-tabs__item').forEach(item => {
                item.classList.remove('workspace-tabs__item--active');
            });
            const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
            if (activeTab) {
                activeTab.classList.add('workspace-tabs__item--active');
            }

            // Update panels
            document.querySelectorAll('.workspace-panel').forEach(panel => {
                panel.classList.remove('workspace-panel--active');
            });
            const activePanel = document.querySelector(`[data-panel="${tabId}"]`);
            if (activePanel) {
                activePanel.classList.add('workspace-panel--active');
            }
        },

        handleSearch(query) {
            if (query.length < 2) return;

            // Use Frappe's awesome bar if available
            if (typeof frappe !== 'undefined' && frappe.search) {
                frappe.search.utils.search(query);
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // 📊 WORKSPACE CONTENT CONTROLLER
    // Handles loading and rendering workspace-specific content
    // ═══════════════════════════════════════════════════════════════════════

    const WorkspaceContent = {
        async init(workspaceId) {
            this.workspaceId = workspaceId;
            
            // Render context tabs
            this.renderContextTabs();
            
            // Load overview by default
            await this.loadTab('overview');
        },

        renderContextTabs() {
            const container = document.querySelector('.workspace-tabs-container');
            if (!container) return;

            let html = '<div class="workspace-tabs">';
            
            CONTEXT_TABS.forEach(tab => {
                // Check role requirement
                if (tab.requiresRole && !hasRole(tab.requiresRole)) {
                    return;
                }
                
                const isActive = Shell.state.currentTab === tab.id;
                html += `
                    <button class="workspace-tabs__item ${isActive ? 'workspace-tabs__item--active' : ''}" 
                            data-tab="${tab.id}">
                        ${tab.label}
                    </button>
                `;
            });
            
            html += '</div>';
            container.innerHTML = html;
        },

        async loadTab(tabId) {
            const panelContainer = document.querySelector('.workspace-content');
            if (!panelContainer) return;

            // Show loading state
            this.showLoading(panelContainer);

            try {
                switch (tabId) {
                    case 'overview':
                        await this.loadOverview(panelContainer);
                        break;
                    case 'transactions':
                        await this.loadTransactions(panelContainer);
                        break;
                    case 'reports':
                        await this.loadReports(panelContainer);
                        break;
                    case 'masters':
                        await this.loadMasters(panelContainer);
                        break;
                    case 'setup':
                        await this.loadSetup(panelContainer);
                        break;
                }
            } catch (error) {
                console.error('Error loading tab content:', error);
                this.showError(panelContainer);
            }
        },

        showLoading(container) {
            container.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                </div>
            `;
        },

        showError(container) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon">${getIcon('x')}</div>
                    <div class="empty-state__title">حدث خطأ</div>
                    <div class="empty-state__desc">تعذر تحميل البيانات. الرجاء المحاولة مرة أخرى.</div>
                    <button class="btn btn--secondary" onclick="WorkspaceContent.loadTab('${Shell.state.currentTab}')">
                        ${getIcon('refresh')} إعادة المحاولة
                    </button>
                </div>
            `;
        },

        async loadOverview(container) {
            // Fetch KPIs from server
            const kpis = await this.fetchKPIs();
            const alerts = await this.fetchAlerts();

            container.innerHTML = `
                <div class="workspace-panel workspace-panel--active" data-panel="overview">
                    ${this.renderKPIGrid(kpis)}
                    ${this.renderInsightPanel()}
                    ${this.renderAlertsSection(alerts)}
                </div>
            `;

            // Initialize chart if echarts is available
            this.initChart();
        },

        async loadTransactions(container) {
            const actions = await this.fetchTransactionActions();
            
            container.innerHTML = `
                <div class="workspace-panel workspace-panel--active" data-panel="transactions">
                    <div class="action-section">
                        ${this.renderActionGroups(actions)}
                    </div>
                </div>
            `;
        },

        async loadReports(container) {
            const reports = await this.fetchReports();
            
            container.innerHTML = `
                <div class="workspace-panel workspace-panel--active" data-panel="reports">
                    <div class="action-section">
                        <div class="action-section__header">
                            <h3 class="action-section__title">التقارير المتاحة</h3>
                        </div>
                        <div class="reports-grid">
                            ${this.renderReportCards(reports)}
                        </div>
                    </div>
                </div>
            `;
        },

        async loadMasters(container) {
            const masters = await this.fetchMasters();
            
            container.innerHTML = `
                <div class="workspace-panel workspace-panel--active" data-panel="masters">
                    <div class="masters-section">
                        ${this.renderMasterGroups(masters)}
                    </div>
                </div>
            `;
        },

        async loadSetup(container) {
            const settings = await this.fetchSettings();
            
            container.innerHTML = `
                <div class="workspace-panel workspace-panel--active" data-panel="setup">
                    <div class="setup-section">
                        <div class="setup-section__header">
                            <div class="setup-section__icon">${getIcon('settings')}</div>
                            <div>
                                <div class="setup-section__title">إعدادات النظام</div>
                                <div class="setup-section__desc">إعدادات متقدمة للمديرين فقط</div>
                            </div>
                        </div>
                        <div class="setup-grid">
                            ${this.renderSetupItems(settings)}
                        </div>
                    </div>
                </div>
            `;
        },

        // API Fetch Methods
        async fetchKPIs() {
            if (typeof frappe !== 'undefined') {
                try {
                    const method = `ahmadcss.api.get_${this.workspaceId}_kpis`;
                    const result = await frappe.call({ method });
                    return result.message || [];
                } catch (e) {
                    console.warn('Could not fetch KPIs:', e);
                }
            }
            return this.getDemoKPIs();
        },

        async fetchAlerts() {
            // Return demo alerts for now
            return [];
        },

        async fetchTransactionActions() {
            // Return workspace-specific actions
            return this.getWorkspaceActions();
        },

        async fetchReports() {
            // Return workspace-specific reports
            return this.getWorkspaceReports();
        },

        async fetchMasters() {
            // Return workspace-specific masters
            return this.getWorkspaceMasters();
        },

        async fetchSettings() {
            // Return workspace-specific settings
            return this.getWorkspaceSettings();
        },

        // Demo Data Methods
        getDemoKPIs() {
            const kpis = {
                finance: [
                    { label: 'إجمالي الإيرادات', value: 450000, trend: 12.5, format: 'currency' },
                    { label: 'إجمالي المصروفات', value: 280000, trend: -5.2, format: 'currency' },
                    { label: 'صافي الربح', value: 170000, trend: 18.3, format: 'currency' },
                    { label: 'التدفق النقدي', value: 95000, trend: 8.7, format: 'currency' }
                ],
                sales: [
                    { label: 'المبيعات هذا الشهر', value: 320000, trend: 15.2, format: 'currency' },
                    { label: 'عدد الطلبات', value: 156, trend: 8.5, format: 'number' },
                    { label: 'متوسط قيمة الطلب', value: 2051, trend: 6.2, format: 'currency' },
                    { label: 'معدل التحويل', value: 24.5, trend: 3.1, format: 'percent' }
                ],
                purchasing: [
                    { label: 'إجمالي المشتريات', value: 180000, trend: -2.5, format: 'currency' },
                    { label: 'طلبات الشراء المعلقة', value: 23, trend: 0, format: 'number' },
                    { label: 'متوسط وقت التوصيل', value: 5.2, trend: -12, format: 'days' },
                    { label: 'عدد الموردين النشطين', value: 45, trend: 5, format: 'number' }
                ],
                inventory: [
                    { label: 'قيمة المخزون', value: 850000, trend: 3.2, format: 'currency' },
                    { label: 'الأصناف تحت الحد', value: 12, trend: -25, format: 'number' },
                    { label: 'معدل دوران المخزون', value: 4.5, trend: 8.3, format: 'number' },
                    { label: 'أصناف بدون حركة', value: 28, trend: 15, format: 'number' }
                ]
            };

            return kpis[this.workspaceId] || kpis.finance;
        },

        getWorkspaceActions() {
            // Define transaction actions per workspace
            const actions = {
                finance: {
                    daily: ['Journal Entry', 'Payment Entry', 'Bank Reconciliation'],
                    periodic: ['Period Closing', 'Budget'],
                    special: ['Deferred Revenue', 'Asset Depreciation']
                },
                sales: {
                    daily: ['Sales Order', 'Sales Invoice', 'Delivery Note'],
                    periodic: ['Quotation', 'Credit Note'],
                    special: ['POS Invoice', 'Sales Return']
                },
                purchasing: {
                    daily: ['Purchase Order', 'Purchase Invoice', 'Purchase Receipt'],
                    periodic: ['Request for Quotation', 'Supplier Quotation'],
                    special: ['Debit Note', 'Purchase Return']
                }
            };

            return actions[this.workspaceId] || {};
        },

        getWorkspaceReports() {
            const reports = {
                finance: [
                    { title: 'ميزان المراجعة', desc: 'عرض أرصدة جميع الحسابات', doctype: 'Trial Balance' },
                    { title: 'قائمة الدخل', desc: 'الإيرادات والمصروفات', doctype: 'Profit and Loss Statement' },
                    { title: 'الميزانية العمومية', desc: 'الأصول والخصوم وحقوق الملكية', doctype: 'Balance Sheet' },
                    { title: 'دفتر الأستاذ', desc: 'تفاصيل حركة الحسابات', doctype: 'General Ledger' }
                ],
                sales: [
                    { title: 'تقرير المبيعات', desc: 'تحليل المبيعات حسب الفترة', doctype: 'Sales Analytics' },
                    { title: 'تقرير العملاء', desc: 'أداء العملاء والمستحقات', doctype: 'Customer Ledger' },
                    { title: 'تقرير الأصناف الأكثر مبيعاً', desc: 'تحليل المنتجات', doctype: 'Item Sales Report' }
                ]
            };

            return reports[this.workspaceId] || [];
        },

        getWorkspaceMasters() {
            const masters = {
                finance: [
                    { group: 'الحسابات', items: ['Chart of Accounts', 'Cost Center', 'Project'] },
                    { group: 'البنوك', items: ['Bank', 'Bank Account', 'Mode of Payment'] },
                    { group: 'الميزانيات', items: ['Budget', 'Fiscal Year', 'Accounting Period'] }
                ],
                sales: [
                    { group: 'العملاء', items: ['Customer', 'Customer Group', 'Territory'] },
                    { group: 'الأسعار', items: ['Price List', 'Pricing Rule', 'Coupon Code'] },
                    { group: 'الإعدادات', items: ['Sales Person', 'Sales Partner', 'Campaign'] }
                ]
            };

            return masters[this.workspaceId] || [];
        },

        getWorkspaceSettings() {
            return [
                { title: 'إعدادات الحسابات', doctype: 'Accounts Settings' },
                { title: 'إعدادات الطباعة', doctype: 'Print Settings' },
                { title: 'قوالب الإشعارات', doctype: 'Notification' }
            ];
        },

        // Render Methods
        renderKPIGrid(kpis) {
            if (!kpis || kpis.length === 0) {
                return '<div class="kpi-grid"><div class="empty-state__desc">لا توجد بيانات</div></div>';
            }

            let html = '<div class="kpi-grid">';
            
            kpis.forEach(kpi => {
                const trendClass = kpi.trend > 0 ? 'up' : kpi.trend < 0 ? 'down' : 'neutral';
                const trendIcon = kpi.trend > 0 ? 'arrow-up' : kpi.trend < 0 ? 'arrow-down' : '';
                
                let displayValue;
                switch (kpi.format) {
                    case 'currency':
                        displayValue = formatCurrency(kpi.value);
                        break;
                    case 'percent':
                        displayValue = kpi.value + '%';
                        break;
                    case 'days':
                        displayValue = kpi.value + ' يوم';
                        break;
                    default:
                        displayValue = formatNumber(kpi.value);
                }

                html += `
                    <div class="kpi-card">
                        <div class="kpi-card__header">
                            <div class="kpi-card__icon">${getIcon('bar-chart-2')}</div>
                            ${kpi.trend !== 0 ? `
                                <div class="kpi-card__trend kpi-card__trend--${trendClass}">
                                    ${trendIcon ? getIcon(trendIcon) : ''}
                                    ${formatPercent(kpi.trend)}
                                </div>
                            ` : ''}
                        </div>
                        <div class="kpi-card__value">${displayValue}</div>
                        <div class="kpi-card__label">${kpi.label}</div>
                    </div>
                `;
            });
            
            html += '</div>';
            return html;
        },

        renderInsightPanel() {
            return `
                <div class="insight-panel">
                    <div class="insight-panel__header">
                        <div class="insight-panel__title">نظرة تحليلية</div>
                        <div class="insight-panel__controls">
                            <button class="insight-panel__btn insight-panel__btn--active" data-range="week">أسبوع</button>
                            <button class="insight-panel__btn" data-range="month">شهر</button>
                            <button class="insight-panel__btn" data-range="year">سنة</button>
                        </div>
                    </div>
                    <div class="insight-panel__chart" id="insight-chart"></div>
                </div>
            `;
        },

        renderAlertsSection(alerts) {
            if (!alerts || alerts.length === 0) return '';

            let html = '<div class="alerts-section">';
            
            alerts.forEach(alert => {
                html += `
                    <div class="alert-card alert-card--${alert.type}">
                        <div class="alert-card__icon">${getIcon('bell')}</div>
                        <div class="alert-card__content">
                            <div class="alert-card__title">${alert.title}</div>
                            <div class="alert-card__message">${alert.message}</div>
                        </div>
                        <button class="alert-card__dismiss">${getIcon('x')}</button>
                    </div>
                `;
            });
            
            html += '</div>';
            return html;
        },

        renderActionGroups(actions) {
            let html = '';
            
            const groupLabels = {
                daily: 'العمليات اليومية',
                periodic: 'العمليات الدورية',
                special: 'عمليات خاصة'
            };

            for (const [group, items] of Object.entries(actions)) {
                if (!items || items.length === 0) continue;
                
                html += `
                    <div class="action-group">
                        <div class="action-group__label">${groupLabels[group] || group}</div>
                        <div class="action-grid">
                            ${items.map(item => `
                                <a href="/app/${frappe.slug(item)}/new" class="action-card">
                                    <div class="action-card__icon">${getIcon('plus')}</div>
                                    <div class="action-card__label">${item}</div>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            return html;
        },

        renderReportCards(reports) {
            return reports.map(report => `
                <a href="/app/query-report/${report.doctype}" class="report-card">
                    <div class="report-card__icon">${getIcon('bar-chart-2')}</div>
                    <div class="report-card__content">
                        <div class="report-card__title">${report.title}</div>
                        <div class="report-card__desc">${report.desc}</div>
                    </div>
                    <button class="report-card__favorite" data-report="${report.doctype}">
                        ${getIcon('star')}
                    </button>
                </a>
            `).join('');
        },

        renderMasterGroups(masters) {
            return masters.map(group => `
                <div class="masters-group">
                    <div class="masters-group__header">
                        <div class="masters-group__header-left">
                            <div class="masters-group__icon">${getIcon('database')}</div>
                            <span class="masters-group__title">${group.group}</span>
                            <span class="masters-group__count">(${group.items.length})</span>
                        </div>
                        <div class="masters-group__chevron">${getIcon('chevron-down')}</div>
                    </div>
                    <div class="masters-group__content">
                        <ul class="masters-list">
                            ${group.items.map(item => `
                                <li>
                                    <a href="/app/${frappe.slug(item)}" class="masters-list__item">
                                        ${getIcon('chevron-right')}
                                        ${item}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');
        },

        renderSetupItems(settings) {
            return settings.map(setting => `
                <a href="/app/${frappe.slug(setting.doctype)}" class="setup-item">
                    ${getIcon('settings')}
                    ${setting.title}
                </a>
            `).join('');
        },

        initChart() {
            const chartContainer = document.getElementById('insight-chart');
            if (!chartContainer || typeof echarts === 'undefined') return;

            const chart = echarts.init(chartContainer);
            
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
                    axisLine: { lineStyle: { color: '#e2e8f0' } },
                    axisLabel: { color: '#64748b' }
                },
                yAxis: {
                    type: 'value',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { lineStyle: { color: '#f1f5f9' } },
                    axisLabel: { color: '#64748b' }
                },
                series: [{
                    data: [12000, 15000, 18000, 14000, 22000, 19000, 25000],
                    type: 'bar',
                    itemStyle: {
                        color: '#6366f1',
                        borderRadius: [4, 4, 0, 0]
                    },
                    barWidth: '50%'
                }]
            };

            chart.setOption(option);

            // Responsive
            window.addEventListener('resize', () => chart.resize());
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // ⭐ FAVORITES WIDGET
    // ═══════════════════════════════════════════════════════════════════════

    const Favorites = {
        async init() {
            const container = document.querySelector('.favorites-widget');
            if (!container) return;

            await this.load();
        },

        async load() {
            const container = document.querySelector('.favorites-widget');
            if (!container) return;

            try {
                const favorites = await this.fetchFavorites();
                this.render(container, favorites);
            } catch (e) {
                console.warn('Could not load favorites:', e);
            }
        },

        async fetchFavorites() {
            if (typeof frappe !== 'undefined') {
                try {
                    const result = await frappe.call({ method: 'ahmadcss.api.get_user_favorites' });
                    return result.message || [];
                } catch (e) {
                    return [];
                }
            }
            return [];
        },

        render(container, favorites) {
            let html = `
                <div class="favorites-widget__header">
                    <span class="favorites-widget__title">المفضلة</span>
                </div>
            `;

            if (favorites.length === 0) {
                html += '<div class="favorites-list__empty">لا توجد عناصر مفضلة</div>';
            } else {
                html += '<ul class="favorites-list">';
                favorites.forEach(fav => {
                    html += `
                        <li>
                            <a href="/app/${fav.route}" class="favorites-list__item">
                                ${getIcon('star')}
                                ${fav.label}
                            </a>
                        </li>
                    `;
                });
                html += '</ul>';
            }

            container.innerHTML = html;
        },

        async add(doctype, name) {
            if (typeof frappe !== 'undefined') {
                await frappe.call({
                    method: 'ahmadcss.api.add_to_favorites',
                    args: { doctype, name }
                });
                await this.load();
            }
        },

        async remove(doctype, name) {
            if (typeof frappe !== 'undefined') {
                await frappe.call({
                    method: 'ahmadcss.api.remove_from_favorites',
                    args: { doctype, name }
                });
                await this.load();
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // 🕐 RECENT ACTIVITY WIDGET
    // ═══════════════════════════════════════════════════════════════════════

    const RecentActivity = {
        async init() {
            const container = document.querySelector('.recent-widget');
            if (!container) return;

            await this.load();
        },

        async load() {
            const container = document.querySelector('.recent-widget');
            if (!container) return;

            try {
                const recent = await this.fetchRecent();
                this.render(container, recent);
            } catch (e) {
                console.warn('Could not load recent activity:', e);
            }
        },

        async fetchRecent() {
            if (typeof frappe !== 'undefined') {
                try {
                    const result = await frappe.call({ 
                        method: 'ahmadcss.api.get_recent_documents',
                        args: { limit: 5 }
                    });
                    return result.message || [];
                } catch (e) {
                    return [];
                }
            }
            return [];
        },

        render(container, recent) {
            let html = `
                <div class="recent-widget__header">
                    <span class="recent-widget__title">آخر النشاطات</span>
                </div>
            `;

            if (recent.length === 0) {
                html += '<div class="favorites-list__empty">لا توجد نشاطات حديثة</div>';
            } else {
                html += '<ul class="recent-list">';
                recent.forEach(item => {
                    html += `
                        <li>
                            <a href="/app/${frappe.slug(item.doctype)}/${item.name}" class="recent-list__item">
                                <div class="recent-list__icon">${getIcon('file-text')}</div>
                                <div class="recent-list__content">
                                    <div class="recent-list__name">${item.name}</div>
                                    <div class="recent-list__meta">${item.doctype} • ${item.modified}</div>
                                </div>
                            </a>
                        </li>
                    `;
                });
                html += '</ul>';
            }

            container.innerHTML = html;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // 🚀 INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════

    // Frappe slug helper
    if (typeof frappe === 'undefined') {
        window.frappe = {
            slug: (s) => s.toLowerCase().replace(/\s+/g, '-')
        };
    }

    // Initialize when DOM is ready
    function initializeShell() {
        Shell.init();
        Favorites.init();
        RecentActivity.init();
        
        // Initialize workspace content if we're in a workspace
        if (Shell.state.currentWorkspace && Shell.state.currentWorkspace !== 'home') {
            WorkspaceContent.init(Shell.state.currentWorkspace);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeShell);
    } else {
        initializeShell();
    }

    // Expose modules globally
    window.ERPShell = {
        Shell,
        WorkspaceContent,
        Favorites,
        RecentActivity,
        WORKSPACES,
        CONTEXT_TABS,
        getIcon
    };

})();
