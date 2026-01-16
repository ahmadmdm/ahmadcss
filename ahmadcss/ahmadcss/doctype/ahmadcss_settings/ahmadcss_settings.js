// Copyright (c) 2026, ahmaddev and contributors
// For license information, please see license.txt

frappe.ui.form.on("AhmadCSS Settings", {
    refresh: function(frm) {
        // Add preview button
        frm.add_custom_button(__('Preview Theme'), function() {
            applyThemePreview(frm);
        }, __('Actions'));
        
        // Add reset button
        frm.add_custom_button(__('Reset to Default'), function() {
            frappe.confirm(
                __('Are you sure you want to reset all theme settings to default?'),
                function() {
                    frappe.call({
                        method: 'ahmadcss.api.reset_theme',
                        callback: function(r) {
                            if (r.message && r.message.success) {
                                frappe.msgprint(__('Theme reset successfully. Refreshing...'));
                                setTimeout(() => location.reload(), 1500);
                            }
                        }
                    });
                }
            );
        }, __('Actions'));
    },
    
    after_save: function(frm) {
        // Apply theme changes immediately after save
        applyThemeChanges(frm);
        frappe.show_alert({
            message: __('Theme settings saved and applied!'),
            indicator: 'green'
        }, 3);
    },
    
    color_theme: function(frm) {
        // Preview theme change immediately
        applyThemePreview(frm);
    },
    
    dark_mode: function(frm) {
        // Preview dark mode change
        if (window.AhmadCSS && AhmadCSS.darkMode) {
            if (frm.doc.dark_mode) {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.body.classList.add('ahmadcss-dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                document.body.classList.remove('ahmadcss-dark');
            }
        }
    },
    
    primary_color: function(frm) {
        if (frm.doc.primary_color) {
            document.documentElement.style.setProperty('--primary-600', frm.doc.primary_color);
        }
    },
    
    secondary_color: function(frm) {
        if (frm.doc.secondary_color) {
            document.documentElement.style.setProperty('--secondary-500', frm.doc.secondary_color);
        }
    },
    
    glass_blur: function(frm) {
        if (frm.doc.glass_blur !== undefined) {
            document.documentElement.style.setProperty('--glass-blur', frm.doc.glass_blur + 'px');
        }
    },
    
    glass_opacity: function(frm) {
        if (frm.doc.glass_opacity !== undefined) {
            const opacity = frm.doc.glass_opacity / 100;
            document.documentElement.style.setProperty('--glass-white', `rgba(255, 255, 255, ${opacity})`);
        }
    }
});

function applyThemePreview(frm) {
    const themeName = frm.doc.color_theme;
    if (window.AhmadCSS && AhmadCSS.colorTheme) {
        // Map display name to internal name
        const themeMap = {
            'Purple': 'purple',
            'Silver': 'silver',
            'Bento Grids': 'bento-grids',
            'Material Web': 'material-web'
        };
        const internalName = themeMap[themeName] || themeName.toLowerCase().replace(/\s+/g, '-');
        AhmadCSS.colorTheme.setTheme(internalName);
    }
}

function applyThemeChanges(frm) {
    // Apply all theme changes
    applyThemePreview(frm);
    
    // Apply dark mode
    if (frm.doc.dark_mode && window.AhmadCSS) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('ahmadcss-dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('ahmadcss-dark');
    }
    
    // Cache will be cleared on next page load automatically
}
