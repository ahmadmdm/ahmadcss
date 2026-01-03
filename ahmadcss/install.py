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
            "dark_mode": 0,
            "primary_color": "#7c3aed",
            "secondary_color": "#3b82f6",
            "gradient_start": "#667eea",
            "gradient_end": "#764ba2",
            "enable_glassmorphism": 1,
            "glass_blur": 20,
            "glass_opacity": 72,
            "enable_animations": 1,
            "animation_speed": "Normal",
            "font_family": "Cairo",
            "font_size_base": 14,
            "arabic_font": "Cairo",
            "enable_custom_fonts": 1,
            "navbar_style": "Gradient",
            "navbar_blur": 30,
            "show_custom_logo": 0,
            "sidebar_style": "Glass",
            "sidebar_width": 260,
            "sidebar_blur": 20,
            "sidebar_position": "Left"
        })
        settings.insert(ignore_permissions=True)
        frappe.db.commit()
    except Exception as e:
        frappe.log_error(f"Error creating AhmadCSS Settings: {str(e)}")


def after_migrate():
    """Run after migrations"""
    create_default_settings()
    frappe.clear_cache()
