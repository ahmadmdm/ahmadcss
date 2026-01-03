# Copyright (c) 2026, ahmaddev and contributors
# For license information, please see license.txt

import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def get_theme_settings():
    """Get public theme settings"""
    try:
        if frappe.db.exists("DocType", "AhmadCSS Settings"):
            settings = frappe.get_single("AhmadCSS Settings")
            return {
                "enable_theme": settings.enable_theme,
                "color_theme": getattr(settings, 'color_theme', 'Purple'),
                "dark_mode": settings.dark_mode,
                "primary_color": settings.primary_color,
                "secondary_color": settings.secondary_color,
                "enable_glassmorphism": settings.enable_glassmorphism,
                "glass_blur": settings.glass_blur,
                "glass_opacity": settings.glass_opacity,
                "enable_animations": settings.enable_animations,
                "animation_speed": settings.animation_speed,
                "font_family": settings.font_family,
                "navbar_style": settings.navbar_style,
                "sidebar_style": settings.sidebar_style,
                "sidebar_width": settings.sidebar_width
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
        
        doc = frappe.get_single("AhmadCSS Settings")
        
        for key, value in settings.items():
            # التحقق من أن الحقل مسموح به
            if key in ALLOWED_THEME_FIELDS and hasattr(doc, key):
                setattr(doc, key, value)
        
        doc.save()
        frappe.clear_cache()
        
        return {"success": True, "message": _("Settings saved successfully")}
    except Exception as e:
        frappe.log_error(f"Error saving theme settings: {str(e)}")
        return {"success": False, "message": str(e)}


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
