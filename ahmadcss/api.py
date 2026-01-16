# Copyright (c) 2026, ahmaddev and contributors
# For license information, please see license.txt

import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def get_theme_settings():
    """Get public theme settings - available for all users including guests"""
    try:
        if frappe.db.exists("DocType", "AhmadCSS Settings"):
            settings = frappe.get_single("AhmadCSS Settings")
            return {
                # General
                "enable_theme": settings.enable_theme,
                "color_theme": getattr(settings, 'color_theme', 'Silver'),
                "dark_mode": settings.dark_mode,
                "enable_animations": settings.enable_animations,
                "animation_speed": settings.animation_speed or "Normal",
                
                # Header
                "header_style": getattr(settings, 'header_style', 'Gradient'),
                "header_gradient_start": getattr(settings, 'header_gradient_start', '#7c3aed'),
                "header_gradient_end": getattr(settings, 'header_gradient_end', '#3b82f6'),
                "header_blur": getattr(settings, 'header_blur', 30),
                
                # Body
                "body_gradient_start": getattr(settings, 'body_gradient_start', '#667eea'),
                "body_gradient_middle": getattr(settings, 'body_gradient_middle', '#764ba2'),
                "body_gradient_end": getattr(settings, 'body_gradient_end', '#f093fb'),
                "enable_glassmorphism": settings.enable_glassmorphism,
                "glass_blur": settings.glass_blur or 20,
                "glass_opacity": settings.glass_opacity or 72,
                
                # Sidebar
                "sidebar_style": settings.sidebar_style or "Glass",
                "sidebar_gradient_start": getattr(settings, 'sidebar_gradient_start', '#1e1e2e'),
                "sidebar_gradient_end": getattr(settings, 'sidebar_gradient_end', '#2d2d3f'),
                "sidebar_width": settings.sidebar_width or 260,
                "sidebar_blur": settings.sidebar_blur or 20,
                
                # Footer
                "footer_style": getattr(settings, 'footer_style', 'Gradient'),
                "footer_gradient_start": getattr(settings, 'footer_gradient_start', '#1e1e2e'),
                "footer_gradient_end": getattr(settings, 'footer_gradient_end', '#2d2d3f'),
                "show_footer": getattr(settings, 'show_footer', 1),
                
                # Typography
                "font_family": settings.font_family or "Cairo",
                
                # Colors
                "primary_color": settings.primary_color or "#7c3aed",
                "secondary_color": settings.secondary_color or "#3b82f6",
                
                # Legacy support
                "navbar_style": getattr(settings, 'header_style', 'Gradient'),
                "navbar_blur": getattr(settings, 'header_blur', 30),
            }
    except Exception:
        pass
    
    return get_default_theme()


def get_default_theme():
    """Return default theme settings"""
    return {
        "enable_theme": 1,
        "color_theme": "Silver",
        "dark_mode": 0,
        "primary_color": "#7c3aed",
        "secondary_color": "#3b82f6",
        "enable_glassmorphism": 1,
        "glass_blur": 20,
        "glass_opacity": 72,
        "enable_animations": 1,
        "animation_speed": "Normal",
        "font_family": "Cairo",
        "navbar_style": "Gradient",
        "sidebar_style": "Glass",
        "sidebar_width": 260
    }


# قائمة الحقول المسموح بتعديلها
ALLOWED_THEME_FIELDS = [
    'enable_theme', 'dark_mode', 'primary_color', 'secondary_color',
    'enable_glassmorphism', 'glass_blur', 'glass_opacity', 'enable_animations',
    'animation_speed', 'font_family', 'navbar_style', 'sidebar_style',
    'sidebar_width', 'color_theme'
]


@frappe.whitelist()
def save_theme_settings(settings):
    """Save theme settings with validation"""
    import json
    
    try:
        if isinstance(settings, str):
            settings = json.loads(settings)
        
        if not frappe.db.exists("DocType", "AhmadCSS Settings"):
            return {"success": False, "message": _("Settings not configured")}
        
        # Use flags to avoid timestamp check and use db_set for atomic update
        for key, value in settings.items():
            if key in ALLOWED_THEME_FIELDS:
                frappe.db.set_single_value("AhmadCSS Settings", key, value)
        
        frappe.clear_cache()
        
        return {"success": True, "message": _("Settings saved successfully")}
    except Exception as e:
        # Truncate error message for logging
        error_msg = str(e)[:100] if len(str(e)) > 100 else str(e)
        frappe.log_error(title="Theme Settings Error", message=error_msg)
        return {"success": False, "message": error_msg}


# تم نقل toggle_dark_mode إلى ahmadcss_settings.py لتجنب التكرار
# استخدم: ahmadcss.ahmadcss.doctype.ahmadcss_settings.ahmadcss_settings.toggle_dark_mode


@frappe.whitelist()
def reset_theme():
    """Reset theme to default"""
    defaults = get_default_theme()
    
    doc = frappe.get_single("AhmadCSS Settings")
    
    for key, value in defaults.items():
        if hasattr(doc, key):
            setattr(doc, key, value)
    
    doc.custom_css = ""
    doc.custom_js = ""
    doc.save()
    frappe.clear_cache()
    
    return {"success": True, "message": _("Theme reset to defaults")}


def get_boot_info(bootinfo):
    """Add theme settings to boot info"""
    bootinfo.ahmadcss = get_theme_settings()


# ═══════════════════════════════════════════════════════════════════════════
# ERP SHELL v3.0 API - Workspace KPIs & Dashboard Data
# ═══════════════════════════════════════════════════════════════════════════

@frappe.whitelist()
def get_workspace_kpis(workspace):
    """
    Get KPI data for a specific workspace
    Returns real-time data from ERPNext
    
    Workspaces: finance, sales, purchasing, inventory, manufacturing, people, projects, quality
    """
    try:
        kpi_handlers = {
            'finance': get_finance_kpis,
            'sales': get_selling_kpis,
            'purchasing': get_buying_kpis,
            'inventory': get_stock_kpis,
            'manufacturing': get_manufacturing_kpis,
            'people': get_hr_kpis,
            'projects': get_projects_kpis,
            'quality': get_quality_kpis,
            # Legacy aliases
            'accounting': get_finance_kpis,
            'selling': get_selling_kpis,
            'buying': get_buying_kpis,
            'stock': get_stock_kpis,
            'hr': get_hr_kpis,
            'assets': get_assets_kpis,
        }
        
        handler = kpi_handlers.get(workspace)
        if handler:
            return handler()
        
        return []
    except Exception as e:
        frappe.log_error(title=f"Workspace KPI Error: {workspace}", message=str(e)[:200])
        return []


# Legacy alias for backward compatibility
@frappe.whitelist()
def get_module_kpis(module):
    """Legacy function - redirects to get_workspace_kpis"""
    return get_workspace_kpis(module)


def get_finance_kpis():
    """Get finance workspace KPIs (Accounting, Banking, etc.)"""
    from frappe.utils import nowdate, getdate, add_months
    
    company = frappe.defaults.get_user_default("Company") or frappe.db.get_single_value("Global Defaults", "default_company")
    if not company:
        return []
    
    today = nowdate()
    month_start = getdate(today).replace(day=1)
    last_month_start = add_months(month_start, -1)
    
    kpis = []
    
    try:
        # Total Revenue (This Month)
        revenue_this_month = frappe.db.sql("""
            SELECT COALESCE(SUM(grand_total), 0) as total
            FROM `tabSales Invoice`
            WHERE docstatus = 1 AND company = %s
            AND posting_date >= %s AND posting_date <= %s
        """, (company, month_start, today), as_dict=True)[0].total or 0
        
        # Revenue Last Month (for comparison)
        revenue_last_month = frappe.db.sql("""
            SELECT COALESCE(SUM(grand_total), 0) as total
            FROM `tabSales Invoice`
            WHERE docstatus = 1 AND company = %s
            AND posting_date >= %s AND posting_date < %s
        """, (company, last_month_start, month_start), as_dict=True)[0].total or 0
        
        revenue_trend = ((revenue_this_month - revenue_last_month) / revenue_last_month * 100) if revenue_last_month > 0 else 0
        
        kpis.append({
            'label': _('Total Revenue'),
            'value': fmt_money(revenue_this_month, currency=frappe.db.get_value("Company", company, "default_currency")),
            'trend': 'up' if revenue_trend > 0 else ('down' if revenue_trend < 0 else 'neutral'),
            'trend_value': round(revenue_trend, 1),
            'icon': 'trending-up',
            'variant': 'success'
        })
        
        # Total Expenses (This Month)
        expenses = frappe.db.sql("""
            SELECT COALESCE(SUM(grand_total), 0) as total
            FROM `tabPurchase Invoice`
            WHERE docstatus = 1 AND company = %s
            AND posting_date >= %s AND posting_date <= %s
        """, (company, month_start, today), as_dict=True)[0].total or 0
        
        kpis.append({
            'label': _('Total Expenses'),
            'value': fmt_money(expenses, currency=frappe.db.get_value("Company", company, "default_currency")),
            'icon': 'trending-down',
            'variant': 'warning'
        })
        
        # Net Profit
        profit = revenue_this_month - expenses
        kpis.append({
            'label': _('Net Profit'),
            'value': fmt_money(profit, currency=frappe.db.get_value("Company", company, "default_currency")),
            'trend': 'up' if profit > 0 else 'down',
            'icon': 'calculator',
            'variant': 'success' if profit > 0 else 'error'
        })
        
        # Outstanding Receivables
        receivables = frappe.db.sql("""
            SELECT COALESCE(SUM(outstanding_amount), 0) as total
            FROM `tabSales Invoice`
            WHERE docstatus = 1 AND company = %s AND outstanding_amount > 0
        """, (company,), as_dict=True)[0].total or 0
        
        kpis.append({
            'label': _('Outstanding Receivables'),
            'value': fmt_money(receivables, currency=frappe.db.get_value("Company", company, "default_currency")),
            'icon': 'file-text'
        })
        
        # Outstanding Payables
        payables = frappe.db.sql("""
            SELECT COALESCE(SUM(outstanding_amount), 0) as total
            FROM `tabPurchase Invoice`
            WHERE docstatus = 1 AND company = %s AND outstanding_amount > 0
        """, (company,), as_dict=True)[0].total or 0
        
        kpis.append({
            'label': _('Outstanding Payables'),
            'value': fmt_money(payables, currency=frappe.db.get_value("Company", company, "default_currency")),
            'icon': 'file-text'
        })
        
    except Exception as e:
        frappe.log_error(title="Accounting KPIs Error", message=str(e)[:200])
    
    return kpis


def get_selling_kpis():
    """Get selling module KPIs"""
    from frappe.utils import nowdate, getdate
    
    company = frappe.defaults.get_user_default("Company") or frappe.db.get_single_value("Global Defaults", "default_company")
    if not company:
        return []
    
    today = nowdate()
    month_start = getdate(today).replace(day=1)
    
    kpis = []
    
    try:
        # Total Orders This Month
        orders = frappe.db.count("Sales Order", {
            "company": company,
            "transaction_date": [">=", month_start],
            "docstatus": 1
        })
        
        kpis.append({
            'label': _('Total Orders'),
            'value': str(orders),
            'icon': 'shopping-cart'
        })
        
        # Revenue This Month
        revenue = frappe.db.sql("""
            SELECT COALESCE(SUM(grand_total), 0) as total
            FROM `tabSales Order`
            WHERE docstatus = 1 AND company = %s
            AND transaction_date >= %s
        """, (company, month_start), as_dict=True)[0].total or 0
        
        kpis.append({
            'label': _('Revenue This Month'),
            'value': fmt_money(revenue, currency=frappe.db.get_value("Company", company, "default_currency")),
            'icon': 'trending-up',
            'variant': 'success'
        })
        
        # Active Customers
        customers = frappe.db.count("Customer", {"disabled": 0})
        kpis.append({
            'label': _('Active Customers'),
            'value': str(customers),
            'icon': 'users'
        })
        
        # Pending Deliveries
        pending = frappe.db.count("Delivery Note", {
            "company": company,
            "docstatus": 0
        })
        kpis.append({
            'label': _('Pending Deliveries'),
            'value': str(pending),
            'icon': 'truck',
            'variant': 'warning' if pending > 0 else ''
        })
        
    except Exception as e:
        frappe.log_error(title="Selling KPIs Error", message=str(e)[:200])
    
    return kpis


def get_buying_kpis():
    """Get buying module KPIs"""
    from frappe.utils import nowdate, getdate
    
    company = frappe.defaults.get_user_default("Company") or frappe.db.get_single_value("Global Defaults", "default_company")
    if not company:
        return []
    
    today = nowdate()
    month_start = getdate(today).replace(day=1)
    
    kpis = []
    
    try:
        # Purchase Orders
        orders = frappe.db.count("Purchase Order", {
            "company": company,
            "transaction_date": [">=", month_start],
            "docstatus": 1
        })
        kpis.append({
            'label': _('Purchase Orders'),
            'value': str(orders),
            'icon': 'file-text'
        })
        
        # Pending Receipts
        pending = frappe.db.count("Purchase Receipt", {
            "company": company,
            "docstatus": 0
        })
        kpis.append({
            'label': _('Pending Receipts'),
            'value': str(pending),
            'icon': 'package',
            'variant': 'warning' if pending > 0 else ''
        })
        
        # Active Suppliers
        suppliers = frappe.db.count("Supplier", {"disabled": 0})
        kpis.append({
            'label': _('Active Suppliers'),
            'value': str(suppliers),
            'icon': 'users'
        })
        
        # This Month Spend
        spend = frappe.db.sql("""
            SELECT COALESCE(SUM(grand_total), 0) as total
            FROM `tabPurchase Order`
            WHERE docstatus = 1 AND company = %s
            AND transaction_date >= %s
        """, (company, month_start), as_dict=True)[0].total or 0
        
        kpis.append({
            'label': _('This Month Spend'),
            'value': fmt_money(spend, currency=frappe.db.get_value("Company", company, "default_currency")),
            'icon': 'calculator'
        })
        
    except Exception as e:
        frappe.log_error(title="Buying KPIs Error", message=str(e)[:200])
    
    return kpis


def get_stock_kpis():
    """Get stock module KPIs"""
    company = frappe.defaults.get_user_default("Company") or frappe.db.get_single_value("Global Defaults", "default_company")
    
    kpis = []
    
    try:
        # Total Stock Value
        stock_value = frappe.db.sql("""
            SELECT COALESCE(SUM(stock_value), 0) as total
            FROM `tabBin`
        """, as_dict=True)[0].total or 0
        
        currency = frappe.db.get_value("Company", company, "default_currency") if company else "USD"
        kpis.append({
            'label': _('Total Stock Value'),
            'value': fmt_money(stock_value, currency=currency),
            'icon': 'package'
        })
        
        # Low Stock Items (items below reorder level)
        low_stock = frappe.db.sql("""
            SELECT COUNT(DISTINCT b.item_code) as count
            FROM `tabBin` b
            INNER JOIN `tabItem` i ON b.item_code = i.name
            WHERE b.actual_qty < COALESCE(i.safety_stock, 0)
            AND i.is_stock_item = 1
        """, as_dict=True)[0].count or 0
        
        kpis.append({
            'label': _('Low Stock Items'),
            'value': str(low_stock),
            'icon': 'alert-triangle',
            'variant': 'error' if low_stock > 0 else ''
        })
        
        # Pending Transfers
        transfers = frappe.db.count("Stock Entry", {
            "docstatus": 0,
            "stock_entry_type": "Material Transfer"
        })
        kpis.append({
            'label': _('Pending Transfers'),
            'value': str(transfers),
            'icon': 'truck'
        })
        
        # Warehouses
        warehouses = frappe.db.count("Warehouse", {"is_group": 0, "disabled": 0})
        kpis.append({
            'label': _('Warehouses'),
            'value': str(warehouses),
            'icon': 'home'
        })
        
    except Exception as e:
        frappe.log_error(title="Stock KPIs Error", message=str(e)[:200])
    
    return kpis


def get_hr_kpis():
    """Get HR module KPIs"""
    from frappe.utils import nowdate
    
    kpis = []
    
    try:
        # Total Employees
        employees = frappe.db.count("Employee", {"status": "Active"})
        kpis.append({
            'label': _('Total Employees'),
            'value': str(employees),
            'icon': 'users'
        })
        
        # Present Today
        today = nowdate()
        present = frappe.db.count("Attendance", {
            "attendance_date": today,
            "status": "Present",
            "docstatus": 1
        })
        kpis.append({
            'label': _('Present Today'),
            'value': str(present),
            'icon': 'check-circle',
            'variant': 'success'
        })
        
        # On Leave
        on_leave = frappe.db.count("Attendance", {
            "attendance_date": today,
            "status": "On Leave",
            "docstatus": 1
        })
        kpis.append({
            'label': _('On Leave'),
            'value': str(on_leave),
            'icon': 'alert-circle',
            'variant': 'warning' if on_leave > 0 else ''
        })
        
        # Open Positions (Job Openings)
        if frappe.db.exists("DocType", "Job Opening"):
            openings = frappe.db.count("Job Opening", {"status": "Open"})
            kpis.append({
                'label': _('Open Positions'),
                'value': str(openings),
                'icon': 'briefcase'
            })
        
    except Exception as e:
        frappe.log_error(title="HR KPIs Error", message=str(e)[:200])
    
    return kpis


def get_manufacturing_kpis():
    """Get manufacturing module KPIs"""
    kpis = []
    
    try:
        if not frappe.db.exists("DocType", "Work Order"):
            return kpis
        
        # Active Work Orders
        active = frappe.db.count("Work Order", {
            "status": ["in", ["Not Started", "In Process"]],
            "docstatus": 1
        })
        kpis.append({
            'label': _('Active Work Orders'),
            'value': str(active),
            'icon': 'settings'
        })
        
        # Completed This Month
        from frappe.utils import nowdate, getdate
        month_start = getdate(nowdate()).replace(day=1)
        completed = frappe.db.count("Work Order", {
            "status": "Completed",
            "actual_end_date": [">=", month_start],
            "docstatus": 1
        })
        kpis.append({
            'label': _('Completed This Month'),
            'value': str(completed),
            'icon': 'check-circle',
            'variant': 'success'
        })
        
        # Overdue
        overdue = frappe.db.count("Work Order", {
            "status": ["in", ["Not Started", "In Process"]],
            "planned_end_date": ["<", nowdate()],
            "docstatus": 1
        })
        kpis.append({
            'label': _('Overdue'),
            'value': str(overdue),
            'icon': 'alert-triangle',
            'variant': 'error' if overdue > 0 else ''
        })
        
    except Exception as e:
        frappe.log_error(title="Manufacturing KPIs Error", message=str(e)[:200])
    
    return kpis


def get_projects_kpis():
    """Get projects module KPIs"""
    kpis = []
    
    try:
        if not frappe.db.exists("DocType", "Project"):
            return kpis
        
        # Active Projects
        active = frappe.db.count("Project", {"status": "Open"})
        kpis.append({
            'label': _('Active Projects'),
            'value': str(active),
            'icon': 'folder'
        })
        
        # Overdue Tasks
        from frappe.utils import nowdate
        overdue = frappe.db.count("Task", {
            "status": ["not in", ["Completed", "Cancelled"]],
            "exp_end_date": ["<", nowdate()]
        })
        kpis.append({
            'label': _('Overdue Tasks'),
            'value': str(overdue),
            'icon': 'alert-triangle',
            'variant': 'error' if overdue > 0 else ''
        })
        
        # Completed This Month
        from frappe.utils import getdate
        month_start = getdate(nowdate()).replace(day=1)
        completed = frappe.db.count("Task", {
            "status": "Completed",
            "completed_on": [">=", month_start]
        })
        kpis.append({
            'label': _('Tasks Completed'),
            'value': str(completed),
            'icon': 'check-circle',
            'variant': 'success'
        })
        
    except Exception as e:
        frappe.log_error(title="Projects KPIs Error", message=str(e)[:200])
    
    return kpis


def get_quality_kpis():
    """Get quality workspace KPIs"""
    kpis = []
    
    try:
        # Quality Inspection
        if frappe.db.exists("DocType", "Quality Inspection"):
            from frappe.utils import nowdate, getdate, add_months
            
            today = nowdate()
            month_start = getdate(today).replace(day=1)
            
            # Total Inspections This Month
            total_inspections = frappe.db.count("Quality Inspection", {
                "docstatus": 1,
                "inspection_date": [">=", month_start]
            })
            kpis.append({
                'label': _('Inspections This Month'),
                'value': str(total_inspections),
                'icon': 'check-circle'
            })
            
            # Passed Inspections
            passed = frappe.db.count("Quality Inspection", {
                "docstatus": 1,
                "status": "Accepted",
                "inspection_date": [">=", month_start]
            })
            kpis.append({
                'label': _('Passed'),
                'value': str(passed),
                'icon': 'check',
                'variant': 'success'
            })
            
            # Failed Inspections
            failed = frappe.db.count("Quality Inspection", {
                "docstatus": 1,
                "status": "Rejected",
                "inspection_date": [">=", month_start]
            })
            kpis.append({
                'label': _('Failed'),
                'value': str(failed),
                'icon': 'x',
                'variant': 'error' if failed > 0 else ''
            })
            
            # Pass Rate
            if total_inspections > 0:
                pass_rate = round((passed / total_inspections) * 100, 1)
                kpis.append({
                    'label': _('Pass Rate'),
                    'value': f"{pass_rate}%",
                    'icon': 'percent',
                    'variant': 'success' if pass_rate >= 90 else ('warning' if pass_rate >= 70 else 'error')
                })
        
        # Non Conformance
        if frappe.db.exists("DocType", "Non Conformance"):
            open_ncrs = frappe.db.count("Non Conformance", {
                "status": ["not in", ["Closed", "Cancelled"]]
            })
            kpis.append({
                'label': _('Open NCRs'),
                'value': str(open_ncrs),
                'icon': 'alert-triangle',
                'variant': 'warning' if open_ncrs > 0 else ''
            })
        
    except Exception as e:
        frappe.log_error(title="Quality KPIs Error", message=str(e)[:200])
    
    return kpis


def get_assets_kpis():
    """Get assets module KPIs"""
    kpis = []
    
    try:
        if not frappe.db.exists("DocType", "Asset"):
            return kpis
        
        company = frappe.defaults.get_user_default("Company") or frappe.db.get_single_value("Global Defaults", "default_company")
        
        # Total Assets
        total = frappe.db.count("Asset", {"docstatus": 1})
        kpis.append({
            'label': _('Total Assets'),
            'value': str(total),
            'icon': 'briefcase'
        })
        
        # Total Value
        value = frappe.db.sql("""
            SELECT COALESCE(SUM(gross_purchase_amount), 0) as total
            FROM `tabAsset`
            WHERE docstatus = 1
        """, as_dict=True)[0].total or 0
        
        currency = frappe.db.get_value("Company", company, "default_currency") if company else "USD"
        kpis.append({
            'label': _('Total Value'),
            'value': fmt_money(value, currency=currency),
            'icon': 'calculator'
        })
        
        # Pending Repairs
        repairs = frappe.db.count("Asset Repair", {"repair_status": "Pending"}) if frappe.db.exists("DocType", "Asset Repair") else 0
        kpis.append({
            'label': _('Pending Repairs'),
            'value': str(repairs),
            'icon': 'settings',
            'variant': 'warning' if repairs > 0 else ''
        })
        
    except Exception as e:
        frappe.log_error(title="Assets KPIs Error", message=str(e)[:200])
    
    return kpis


def fmt_money(amount, currency="USD"):
    """Format money with currency"""
    try:
        from frappe.utils import fmt_money as frappe_fmt_money
        return frappe_fmt_money(amount, currency=currency)
    except:
        return f"{currency} {amount:,.0f}"


@frappe.whitelist()
def get_recent_documents(limit=10):
    """Get recent documents for the current user"""
    try:
        documents = frappe.db.sql("""
            SELECT 
                reference_doctype as doctype,
                reference_name as name,
                link_doctype,
                link_name,
                creation
            FROM `tabComment`
            WHERE owner = %s
            AND comment_type = 'Info'
            ORDER BY creation DESC
            LIMIT %s
        """, (frappe.session.user, limit), as_dict=True)
        
        return documents
    except Exception as e:
        frappe.log_error(title="Recent Documents Error", message=str(e)[:200])
        return []


@frappe.whitelist()
def get_user_favorites():
    """Get user's favorited documents"""
    try:
        favorites = frappe.get_all(
            "User Shortcut",
            filters={"user": frappe.session.user},
            fields=["label", "link_to", "type"],
            limit=20
        )
        
        return [
            {
                "label": f.label,
                "route": f"/app/{f.link_to.lower().replace(' ', '-')}" if f.type == "DocType" else f.link_to,
                "type": f.type
            }
            for f in favorites
        ]
    except Exception as e:
        frappe.log_error(title="Favorites Error", message=str(e)[:200])
        return []


@frappe.whitelist()
def add_to_favorites(doctype, label, route):
    """Add a document/report to favorites"""
    try:
        if not frappe.db.exists("User Shortcut", {"user": frappe.session.user, "link_to": doctype}):
            frappe.get_doc({
                "doctype": "User Shortcut",
                "user": frappe.session.user,
                "label": label,
                "link_to": doctype,
                "type": "DocType"
            }).insert(ignore_permissions=True)
            
            return {"success": True, "message": _("Added to favorites")}
        else:
            return {"success": False, "message": _("Already in favorites")}
    except Exception as e:
        return {"success": False, "message": str(e)[:100]}


@frappe.whitelist()
def remove_from_favorites(doctype):
    """Remove from favorites"""
    try:
        frappe.delete_doc("User Shortcut", {"user": frappe.session.user, "link_to": doctype}, ignore_permissions=True)
        return {"success": True, "message": _("Removed from favorites")}
    except Exception as e:
        return {"success": False, "message": str(e)[:100]}
