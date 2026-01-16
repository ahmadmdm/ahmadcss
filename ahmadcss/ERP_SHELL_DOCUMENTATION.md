# AhmadCSS - ERP Shell v3.0
## Universal Workspace-Centric Layout Framework

---

## 🎯 Design Philosophy

This is a **WORKSPACE-CENTRIC** system where:

- ✅ Every workspace uses the **EXACT same layout structure**
- ✅ Only **data and actions** change between workspaces, never the layout
- ✅ **Single accent color** system (Indigo) - no module-specific colors
- ✅ **Semantic status colors** ONLY for status indicators (success, warning, danger, info)
- ✅ Cairo font as primary typeface (Arabic-first design)

### What This Is NOT

- ❌ NOT centered around any specific module (Accounting, Sales, etc.)
- ❌ NOT using module-specific colors
- ❌ NOT showing doctype lists in the sidebar
- ❌ NOT showing shortcut grids permanently

---

## 📐 Layout Structure

```
┌────────────────────────────────────────────────────┐
│                    HEADER                          │
│  [☰] [Logo] [Title]    [🔍 Search]    [🔔] [👤]   │
├──────────┬─────────────────────────────────────────┤
│          │                                          │
│ SIDEBAR  │           MAIN CONTENT                  │
│          │  ┌─────────────────────────────────┐    │
│ ┌──────┐ │  │ Context Tabs                    │    │
│ │Home  │ │  │ [Overview][Transactions][Reports]│   │
│ │Finance│ │  │ [Masters][Setup]               │    │
│ │Sales │ │  ├─────────────────────────────────┤    │
│ │Buying│ │  │                                 │    │
│ │Stock │ │  │       Tab Content               │    │
│ │Mfg   │ │  │       (KPIs, Actions, etc.)     │    │
│ │People│ │  │                                 │    │
│ │...   │ │  └─────────────────────────────────┘    │
│ └──────┘ │                                          │
│          │                                          │
├──────────┴─────────────────────────────────────────┤
│                    FOOTER                          │
└────────────────────────────────────────────────────┘
```

---

## 🗂️ Workspaces (Primary Navigation)

These appear in the **sidebar** and are mutually exclusive:

| Workspace | Arabic | English | Description |
|-----------|--------|---------|-------------|
| Home | الرئيسية | Home | Dashboard overview |
| Finance | المالية | Finance | GL, AP, AR, Banking |
| Sales | المبيعات | Sales | Quotations, Orders, Invoices |
| Purchasing | المشتريات | Purchasing | RFQ, PO, Purchase Invoices |
| Inventory | المخزون | Inventory | Stock, Warehouses, Transfers |
| Manufacturing | التصنيع | Manufacturing | BOM, Work Orders |
| People | الموارد البشرية | People | HR, Payroll, Recruitment |
| Projects | المشاريع | Projects | Project management |
| Quality | الجودة | Quality | QC, Inspections |
| System | النظام | System | Settings, Users |

---

## 📑 Context Tabs (Secondary Navigation)

Each workspace has these **5 tabs** in the main content area:

| Tab | Arabic | Description |
|-----|--------|-------------|
| Overview | نظرة عامة | KPIs, charts, alerts |
| Transactions | العمليات | Daily/periodic document creation |
| Reports | التقارير | Available reports for this workspace |
| Masters | البيانات الرئيسية | Master data (collapsible categories) |
| Setup | الإعدادات | Settings (visible to managers only) |

---

## 📁 File Structure

```
ahmadcss/public/
├── css/
│   ├── erp-shell.css          # Core shell layout + design tokens
│   ├── workspace-template.css  # Workspace content components
│   ├── frappe-integration.css  # Bridges with Frappe Desk
│   └── components.css          # Shared UI components
│
└── js/
    ├── erp-shell.js            # Shell controller + workspace content
    └── ahmadcss.js             # Theme management
```

---

## 🎨 Design Tokens

### Spacing Scale (4px base)
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

### Accent Color (Indigo - Single System Color)
```css
--accent-50: #eef2ff;
--accent-100: #e0e7ff;
--accent-200: #c7d2fe;
--accent-300: #a5b4fc;
--accent-400: #818cf8;
--accent-500: #6366f1;  /* Primary */
--accent-600: #4f46e5;  /* Hover/Active */
--accent-700: #4338ca;
--accent-800: #3730a3;
--accent-900: #312e81;
```

### Status Colors (ONLY for status indicators)
```css
/* Success */
--status-success: #10b981;
--status-success-bg: #ecfdf5;
--status-success-text: #065f46;

/* Warning */
--status-warning: #f59e0b;
--status-warning-bg: #fffbeb;
--status-warning-text: #92400e;

/* Danger */
--status-danger: #ef4444;
--status-danger-bg: #fef2f2;
--status-danger-text: #991b1b;

/* Info */
--status-info: #3b82f6;
--status-info-bg: #eff6ff;
--status-info-text: #1e40af;
```

### Layout Dimensions
```css
--shell-header-height: 52px;
--shell-sidebar-width: 240px;
--shell-sidebar-collapsed: 64px;
--shell-content-max-width: 1440px;
--shell-footer-height: 32px;
```

---

## 🖥️ Shell HTML Structure

```html
<body class="erp-shell">
    <div class="shell">
        <!-- Header -->
        <header class="shell-header">
            <div class="shell-header__left">
                <button class="shell-header__toggle" data-action="toggle-sidebar">☰</button>
                <a href="/" class="shell-header__brand">
                    <img src="logo.svg" class="shell-header__logo">
                    <span class="shell-header__title">ERP System</span>
                </a>
            </div>
            <div class="shell-header__center">
                <div class="shell-search">
                    <input type="text" class="shell-search__input" placeholder="بحث...">
                </div>
            </div>
            <div class="shell-header__right">
                <button class="shell-header__action">🔔</button>
                <button class="shell-header__user">
                    <div class="shell-header__avatar">A</div>
                </button>
            </div>
        </header>

        <div class="shell__body">
            <!-- Sidebar -->
            <aside class="shell-sidebar">
                <div class="shell-sidebar__content">
                    <nav class="shell-sidebar__nav">
                        <!-- Workspace navigation rendered by JS -->
                    </nav>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="shell__content">
                <div class="shell-main">
                    <div class="shell-main__container">
                        <!-- Context Tabs -->
                        <div class="workspace-tabs-container">
                            <div class="workspace-tabs">
                                <button class="workspace-tabs__item workspace-tabs__item--active" data-tab="overview">نظرة عامة</button>
                                <button class="workspace-tabs__item" data-tab="transactions">العمليات</button>
                                <button class="workspace-tabs__item" data-tab="reports">التقارير</button>
                                <button class="workspace-tabs__item" data-tab="masters">البيانات الرئيسية</button>
                                <button class="workspace-tabs__item" data-tab="setup">الإعدادات</button>
                            </div>
                        </div>

                        <!-- Workspace Content -->
                        <div class="workspace-content">
                            <!-- Tab panels rendered by JS -->
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Footer -->
        <footer class="shell-footer">
            <span>© 2025 Company Name</span>
            <span>Powered by Frappe</span>
        </footer>
    </div>
</body>
```

---

## 📊 Workspace Content Template

Each workspace follows this **exact pattern**:

### A. Overview Panel
```html
<div class="workspace-panel workspace-panel--active" data-panel="overview">
    <!-- KPI Cards -->
    <div class="kpi-grid">
        <div class="kpi-card">...</div>
        <div class="kpi-card">...</div>
        <div class="kpi-card">...</div>
    </div>
    
    <!-- Insight Chart -->
    <div class="insight-panel">...</div>
    
    <!-- Alerts -->
    <div class="alerts-section">...</div>
</div>
```

### B. Transactions Panel
```html
<div class="workspace-panel" data-panel="transactions">
    <div class="action-section">
        <!-- Daily Operations -->
        <div class="action-group">
            <div class="action-group__label">العمليات اليومية</div>
            <div class="action-grid">
                <a href="/app/new-doc" class="action-card">...</a>
            </div>
        </div>
        
        <!-- Periodic Operations -->
        <div class="action-group">
            <div class="action-group__label">العمليات الدورية</div>
            <div class="action-grid">...</div>
        </div>
    </div>
</div>
```

### C. Reports Panel
```html
<div class="workspace-panel" data-panel="reports">
    <div class="reports-grid">
        <a href="/app/query-report/Report" class="report-card">
            <div class="report-card__icon">📊</div>
            <div class="report-card__content">
                <div class="report-card__title">Report Name</div>
                <div class="report-card__desc">Description</div>
            </div>
        </a>
    </div>
</div>
```

### D. Masters Panel
```html
<div class="workspace-panel" data-panel="masters">
    <div class="masters-section">
        <div class="masters-group">
            <div class="masters-group__header">
                <span class="masters-group__title">Category Name</span>
                <span class="masters-group__chevron">▼</span>
            </div>
            <div class="masters-group__content">
                <ul class="masters-list">
                    <li><a href="/app/doctype" class="masters-list__item">Master 1</a></li>
                    <li><a href="/app/doctype" class="masters-list__item">Master 2</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>
```

### E. Setup Panel (Permission-Based)
```html
<div class="workspace-panel" data-panel="setup">
    <div class="setup-section">
        <div class="setup-section__header">
            <div class="setup-section__icon">⚙️</div>
            <div class="setup-section__title">إعدادات النظام</div>
        </div>
        <div class="setup-grid">
            <a href="/app/settings" class="setup-item">Settings 1</a>
            <a href="/app/settings" class="setup-item">Settings 2</a>
        </div>
    </div>
</div>
```

---

## 🔌 JavaScript API

```javascript
// Global namespace
window.ERPShell = {
    Shell,           // Main shell controller
    WorkspaceContent,// Workspace content manager
    Favorites,       // Favorites widget
    RecentActivity,  // Recent activity widget
    WORKSPACES,      // Workspace definitions
    CONTEXT_TABS,    // Tab definitions
    getIcon          // SVG icon helper
};

// Navigate to workspace
ERPShell.Shell.navigateToWorkspace('finance');

// Switch tab
ERPShell.Shell.switchTab('transactions');

// Toggle sidebar
ERPShell.Shell.toggleSidebar();

// Toggle dark mode
ERPShell.Shell.toggleDarkMode();

// Load workspace content
await ERPShell.WorkspaceContent.init('sales');
```

---

## 🌙 Dark Mode

Dark mode is automatically handled via the `[data-theme="dark"]` attribute or `.dark-mode` class on the root element.

```javascript
// Toggle dark mode
ERPShell.Shell.toggleDarkMode();

// Or manually
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## 🔄 RTL Support

RTL is automatically handled via the `[dir="rtl"]` attribute on `<html>`:

```html
<html dir="rtl" lang="ar">
```

All components are designed to work seamlessly in RTL mode.

---

## 📱 Responsive Breakpoints

| Breakpoint | Description |
|------------|-------------|
| `1024px` | Tablet - sidebar collapses to overlay |
| `640px` | Mobile - header search hidden, content padding reduced |

---

## ⚙️ Integration with Frappe

The `frappe-integration.css` file handles all Frappe Desk overrides:

1. **Hides** default Frappe navbar when shell is active
2. **Hides** default Frappe workspace sidebar
3. **Styles** Frappe forms, lists, and reports to match shell design
4. **Applies** shell design tokens to Frappe controls

To activate the shell, add the `erp-shell` class to `<body>`:

```html
<body class="erp-shell">
```

---

## 🛠️ Customization

### Adding a New Workspace

1. Add to `WORKSPACES` in `erp-shell.js`:
```javascript
const WORKSPACES = {
    // ...existing
    myworkspace: {
        id: 'myworkspace',
        label: 'مساحتي',
        labelEn: 'My Workspace',
        icon: 'grid',
        route: '/app/myworkspace'
    }
};
```

2. Add workspace-specific data methods in `WorkspaceContent`:
```javascript
getWorkspaceActions() {
    const actions = {
        // ...existing
        myworkspace: {
            daily: ['Doc Type 1', 'Doc Type 2'],
            periodic: ['Doc Type 3']
        }
    };
}
```

### Adding Custom KPIs

Implement an API endpoint in `api.py`:
```python
@frappe.whitelist()
def get_myworkspace_kpis():
    return [
        {"label": "KPI 1", "value": 1000, "trend": 5.2, "format": "number"},
        {"label": "KPI 2", "value": 50000, "trend": -2.1, "format": "currency"}
    ]
```

---

## 📝 License

MIT License - See LICENSE file for details.
