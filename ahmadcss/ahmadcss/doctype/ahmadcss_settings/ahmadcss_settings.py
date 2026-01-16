# Copyright (c) 2026, ahmaddev and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class AhmadCSSSettings(Document):
    def validate(self):
        """Validate settings before saving"""
        if self.glass_blur and (self.glass_blur < 0 or self.glass_blur > 100):
            frappe.throw("Glass Blur must be between 0 and 100")
        
        if self.glass_opacity and (self.glass_opacity < 0 or self.glass_opacity > 100):
            frappe.throw("Glass Opacity must be between 0 and 100")
        
        if self.sidebar_width and (self.sidebar_width < 200 or self.sidebar_width > 400):
            frappe.throw("Sidebar Width must be between 200 and 400")
    
    def on_update(self):
        """Clear cache when settings are updated"""
        frappe.clear_cache()
        
    @staticmethod
    def get_settings():
        """Get AhmadCSS settings as dict"""
        try:
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
                "show_custom_logo": settings.show_custom_logo,
                "custom_logo": settings.custom_logo,
                
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
                "sidebar_position": settings.sidebar_position or "Left",
                
                # Footer
                "footer_style": getattr(settings, 'footer_style', 'Gradient'),
                "footer_gradient_start": getattr(settings, 'footer_gradient_start', '#1e1e2e'),
                "footer_gradient_end": getattr(settings, 'footer_gradient_end', '#2d2d3f'),
                "footer_blur": getattr(settings, 'footer_blur', 10),
                "show_footer": getattr(settings, 'show_footer', 1),
                
                # Typography
                "font_family": settings.font_family or "Cairo",
                "font_size_base": settings.font_size_base or 14,
                "arabic_font": settings.arabic_font or "Cairo",
                "enable_custom_fonts": settings.enable_custom_fonts,
                
                # Colors
                "primary_color": settings.primary_color or "#7c3aed",
                "secondary_color": settings.secondary_color or "#3b82f6",
                "success_color": getattr(settings, 'success_color', '#10b981'),
                "warning_color": getattr(settings, 'warning_color', '#f59e0b'),
                "error_color": getattr(settings, 'error_color', '#ef4444'),
                
                # Advanced
                "custom_css": settings.custom_css or "",
                "custom_js": settings.custom_js or "",
                
                # Legacy support (for backward compatibility)
                "navbar_style": getattr(settings, 'header_style', 'Gradient'),
                "navbar_blur": getattr(settings, 'header_blur', 30),
                "gradient_start": getattr(settings, 'body_gradient_start', '#667eea'),
                "gradient_end": getattr(settings, 'body_gradient_end', '#f093fb'),
            }
        except Exception:
            return get_default_settings()


def get_default_settings():
    """Return default settings"""
    return {
        # General
        "enable_theme": 1,
        "color_theme": "Silver",
        "dark_mode": 0,
        "enable_animations": 1,
        "animation_speed": "Normal",
        
        # Header
        "header_style": "Gradient",
        "header_gradient_start": "#7c3aed",
        "header_gradient_end": "#3b82f6",
        "header_blur": 30,
        "show_custom_logo": 0,
        "custom_logo": None,
        
        # Body
        "body_gradient_start": "#667eea",
        "body_gradient_middle": "#764ba2",
        "body_gradient_end": "#f093fb",
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
        "primary_color": "#7c3aed",
        "secondary_color": "#3b82f6",
        "success_color": "#10b981",
        "warning_color": "#f59e0b",
        "error_color": "#ef4444",
        
        # Advanced
        "custom_css": "",
        "custom_js": "",
        
        # Legacy
        "navbar_style": "Gradient",
        "navbar_blur": 30,
        "gradient_start": "#667eea",
        "gradient_end": "#f093fb",
    }


@frappe.whitelist()
def get_ahmadcss_settings():
    """API to get settings"""
    return AhmadCSSSettings.get_settings()


@frappe.whitelist()
def toggle_dark_mode():
    """Toggle dark mode setting"""
    settings = frappe.get_single("AhmadCSS Settings")
    settings.dark_mode = not settings.dark_mode
    settings.save()
    frappe.clear_cache()
    return {"dark_mode": settings.dark_mode}


# قائمة الحقول المسموح بتعديلها
ALLOWED_SETTINGS_FIELDS = [
    'enable_theme', 'dark_mode', 'primary_color', 'secondary_color',
    'gradient_start', 'gradient_end', 'enable_glassmorphism', 'glass_blur',
    'glass_opacity', 'enable_animations', 'animation_speed', 'font_family',
    'font_size_base', 'arabic_font', 'enable_custom_fonts', 'navbar_style',
    'navbar_blur', 'show_custom_logo', 'custom_logo', 'sidebar_style',
    'sidebar_width', 'sidebar_blur', 'sidebar_position', 'custom_css', 'custom_js'
]


@frappe.whitelist()
def update_setting(field, value):
    """Update a single setting with validation"""
    # التحقق من أن الحقل مسموح به
    if field not in ALLOWED_SETTINGS_FIELDS:
        frappe.log_error(f"Attempted to update invalid field: {field}")
        return {"success": False, "message": "Invalid field"}
    
    try:
        settings = frappe.get_single("AhmadCSS Settings")
        if hasattr(settings, field):
            setattr(settings, field, value)
            settings.save()
            frappe.clear_cache()
            return {"success": True, "field": field, "value": value}
        return {"success": False, "message": "Field not found"}
    except Exception as e:
        frappe.log_error(f"Error updating setting {field}: {str(e)}")
        return {"success": False, "message": str(e)}
