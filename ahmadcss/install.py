# Copyright (c) 2026, ahmaddev and contributors
# For license information, please see license.txt

import frappe


def before_install():
    """Run before installing the app"""
    pass


def after_install():
    """Run after installing the app"""
    # Create default settings
    create_default_settings()
    
    # Clear cache
    frappe.clear_cache()
    
    print("✨ AhmadCSS Theme installed successfully!")
    print("🎨 Visit 'AhmadCSS Settings' to customize your theme.")


def create_default_settings():
    """Create default AhmadCSS Settings"""
    if not frappe.db.exists("DocType", "AhmadCSS Settings"):
        return
    
    # Check if settings already exist
    if frappe.db.exists("AhmadCSS Settings", "AhmadCSS Settings"):
        return
    
    try:
        settings = frappe.get_doc({
            "doctype": "AhmadCSS Settings",
            "enable_theme": 1,
            "color_theme": "Silver",
            "dark_mode": 0,
            "primary_color": "#0f766e",
            "secondary_color": "#d97706",
            "success_color": "#10b981",
            "warning_color": "#f59e0b",
            "error_color": "#ef4444",
            "enable_glassmorphism": 1,
            "glass_blur": 20,
            "glass_opacity": 72,
            "enable_animations": 1,
            "animation_speed": "Normal",
            "font_family": "Cairo",
            "font_size_base": 14,
            "arabic_font": "Cairo",
            "enable_custom_fonts": 1,
            "header_style": "Gradient",
            "header_gradient_start": "#0f3b4a",
            "header_gradient_end": "#0f766e",
            "header_blur": 30,
            "show_custom_logo": 0,
            "body_gradient_start": "#dceef0",
            "body_gradient_middle": "#edf5f3",
            "body_gradient_end": "#efe1cd",
            "sidebar_style": "Glass",
            "sidebar_gradient_start": "#1e1e2e",
            "sidebar_gradient_end": "#2d2d3f",
            "sidebar_width": 260,
            "sidebar_blur": 20,
            "sidebar_position": "Left",
            "footer_style": "Gradient",
            "footer_gradient_start": "#1e1e2e",
            "footer_gradient_end": "#2d2d3f",
            "footer_blur": 10,
            "show_footer": 1,
        })
        settings.insert(ignore_permissions=True)
        frappe.db.commit()
    except Exception as e:
        frappe.log_error(f"Error creating AhmadCSS Settings: {str(e)}")


def after_migrate():
    """Run after migrations"""
    create_default_settings()
    frappe.clear_cache()
