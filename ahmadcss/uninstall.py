# Copyright (c) 2026, ahmaddev and contributors
# For license information, please see license.txt

import frappe


def before_uninstall():
    """Run before uninstalling the app"""
    pass


def after_uninstall():
    """Run after uninstalling the app"""
    # Clean up settings
    try:
        if frappe.db.exists("DocType", "AhmadCSS Settings"):
            frappe.delete_doc("DocType", "AhmadCSS Settings", force=True)
    except Exception:
        pass
    
    frappe.clear_cache()
    print("👋 AhmadCSS Theme uninstalled successfully!")
