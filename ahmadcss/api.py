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
                "header_gradient_start": getattr(settings, 'header_gradient_start', '#0f3b4a'),
                "header_gradient_end": getattr(settings, 'header_gradient_end', '#0f766e'),
                "header_blur": getattr(settings, 'header_blur', 30),
                
                # Body
                "body_gradient_start": getattr(settings, 'body_gradient_start', '#dceef0'),
                "body_gradient_middle": getattr(settings, 'body_gradient_middle', '#edf5f3'),
                "body_gradient_end": getattr(settings, 'body_gradient_end', '#efe1cd'),
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
                "primary_color": settings.primary_color or "#0f766e",
                "secondary_color": settings.secondary_color or "#d97706",
                
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
        "primary_color": "#0f766e",
        "secondary_color": "#d97706",
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
