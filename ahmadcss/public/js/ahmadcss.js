/* ═══════════════════════════════════════════════════════════════════════════
   AhmadCSS - Professional Glassmorphism v15.0
   JavaScript Module for Frappe/ERPNext
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';
    
    // Configuration - matches Frappe defaults
    const CONFIG = {
        navbarHeight: 48,  // Frappe default
        pageHeadHeight: 60, // Frappe default
        sidebarWidth: 260,
        animationDuration: 250
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('🎨 AhmadCSS v15.0 - Professional Glassmorphism loaded');
        
        // Clean up any inline styles that might cause conflicts
        cleanupInlineStyles();
        
        // Setup features
        setupRippleEffect();
        setupSmoothScroll();
        setupMobileSidebar();
        
        // Re-run on page navigation
        if (window.frappe && frappe.router) {
            frappe.router.on('change', function() {
                setTimeout(cleanupInlineStyles, 100);
            });
        }
    }
    
    /**
     * Clean up inline styles that might conflict with CSS
     */
    function cleanupInlineStyles() {
        // Remove any margin-left on body (common issue)
        const body = document.body;
        if (body) {
            body.style.marginLeft = '';
            body.style.paddingLeft = '';
        }
        
        // Ensure sidebar is visible on desktop
        const sidebar = document.querySelector('.layout-side-section');
        if (sidebar && window.innerWidth >= 992) {
            sidebar.style.display = '';
            sidebar.style.visibility = '';
            sidebar.style.opacity = '';
            sidebar.style.transform = '';
        }
    }
    
    /**
     * Material Design Ripple Effect
     */
    function setupRippleEffect() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('.btn, .shortcut-widget-box, .standard-sidebar-item');
            if (!target) return;
            
            // Create ripple
            const ripple = document.createElement('span');
            ripple.className = 'ahmadcss-ripple';
            
            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                pointer-events: none;
                animation: ahmadcss-ripple 0.6s ease-out;
            `;
            
            // Ensure target has relative positioning
            const originalPosition = getComputedStyle(target).position;
            if (originalPosition === 'static') {
                target.style.position = 'relative';
            }
            target.style.overflow = 'hidden';
            
            target.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
                if (originalPosition === 'static') {
                    target.style.position = '';
                }
            }, 600);
        });
        
        // Add ripple keyframes if not exist
        if (!document.getElementById('ahmadcss-ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ahmadcss-ripple-styles';
            style.textContent = `
                @keyframes ahmadcss-ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Smooth Scroll for anchor links
     */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    /**
     * Mobile Sidebar Toggle
     */
    function setupMobileSidebar() {
        // Create toggle button for mobile
        const navbar = document.querySelector('.navbar');
        if (!navbar || document.querySelector('.ahmadcss-sidebar-toggle')) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'ahmadcss-sidebar-toggle';
        toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        toggleBtn.style.cssText = `
            display: none;
            background: rgba(255,255,255,0.15);
            border: none;
            border-radius: 8px;
            padding: 8px;
            cursor: pointer;
            color: white;
            margin-right: 10px;
        `;
        
        toggleBtn.addEventListener('click', function() {
            const sidebar = document.querySelector('.layout-side-section');
            if (sidebar) {
                sidebar.classList.toggle('show');
                sidebar.classList.toggle('opened');
            }
        });
        
        navbar.insertBefore(toggleBtn, navbar.firstChild);
        
        // Show/hide toggle based on screen size
        function updateToggleVisibility() {
            toggleBtn.style.display = window.innerWidth < 992 ? 'flex' : 'none';
        }
        
        updateToggleVisibility();
        window.addEventListener('resize', updateToggleVisibility);
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth >= 992) return;
            
            const sidebar = document.querySelector('.layout-side-section');
            const isClickInside = sidebar?.contains(e.target) || toggleBtn.contains(e.target);
            
            if (!isClickInside && sidebar?.classList.contains('show')) {
                sidebar.classList.remove('show', 'opened');
            }
        });
    }
    
    // Expose for debugging
    window.AhmadCSS = {
        version: '15.0',
        config: CONFIG,
        refresh: cleanupInlineStyles
    };
    
})();
