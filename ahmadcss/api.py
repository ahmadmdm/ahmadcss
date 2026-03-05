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
        # General
        "enable_theme": 1,
        "color_theme": "Silver",
        "dark_mode": 0,
        "enable_animations": 1,
        "animation_speed": "Normal",

        # Header
        "header_style": "Gradient",
        "header_gradient_start": "#0f3b4a",
        "header_gradient_end": "#0f766e",
        "header_blur": 30,
        "show_custom_logo": 0,

        # Body
        "body_gradient_start": "#dceef0",
        "body_gradient_middle": "#edf5f3",
        "body_gradient_end": "#efe1cd",
        "enable_glassmorphism": 1,
        "glass_blur": 20,
        "glass_opacity": 72,

        # Sidebar
        "sidebar_style": "Glass",
        "sidebar_gradient_start": "#1e1e2e",
        "sidebar_gradient_end": "#2d2d3f",
        "sidebar_width": 260,
        "sidebar_blur": 20,
        "sidebar_position": "Left",

        # Footer
        "footer_style": "Gradient",
        "footer_gradient_start": "#1e1e2e",
        "footer_gradient_end": "#2d2d3f",
        "footer_blur": 10,
        "show_footer": 1,

        # Typography
        "font_family": "Cairo",
        "font_size_base": 14,
        "arabic_font": "Cairo",
        "enable_custom_fonts": 1,

        # Colors
        "primary_color": "#0f766e",
        "secondary_color": "#d97706",
        "success_color": "#10b981",
        "warning_color": "#f59e0b",
        "error_color": "#ef4444",

        # Legacy
        "navbar_style": "Gradient",
        "navbar_blur": 30,
    }


# قائمة الحقول المسموح بتعديلها
ALLOWED_THEME_FIELDS = [
    'enable_theme', 'dark_mode', 'color_theme',
    'primary_color', 'secondary_color', 'success_color', 'warning_color', 'error_color',
    'enable_glassmorphism', 'glass_blur', 'glass_opacity',
    'enable_animations', 'animation_speed',
    'font_family', 'font_size_base', 'arabic_font', 'enable_custom_fonts',
    'header_style', 'header_gradient_start', 'header_gradient_end', 'header_blur',
    'show_custom_logo', 'custom_logo',
    'body_gradient_start', 'body_gradient_middle', 'body_gradient_end',
    'sidebar_style', 'sidebar_gradient_start', 'sidebar_gradient_end',
    'sidebar_width', 'sidebar_blur', 'sidebar_position',
    'footer_style', 'footer_gradient_start', 'footer_gradient_end',
    'footer_blur', 'show_footer',
    'navbar_style', 'navbar_blur',
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
            if key in ALLOWED_THEME_FIELDS and hasattr(doc, key):
                setattr(doc, key, value)
        
        doc.save()
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
