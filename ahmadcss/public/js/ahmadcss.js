/*
 * AhmadCSS - Interactive Effects JavaScript
 * Ripple effects, smooth scrolling, and UI enhancements
 */

(function() {
    'use strict';

    // Wait for DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initRippleEffect();
        initSmoothScroll();
        initTooltips();
        initPageTransitions();
        initNavbarScroll();
        console.log('🎨 AhmadCSS Material Theme loaded successfully!');
    });

    // ============================================
    // RIPPLE EFFECT FOR BUTTONS
    // ============================================
    function initRippleEffect() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('.btn, .nav-link, .dropdown-item, .sidebar-menu a, .list-row');
            if (!target) return;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            
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
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            `;
            
            target.style.position = 'relative';
            target.style.overflow = 'hidden';
            target.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });

        // Add ripple animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    function initSmoothScroll() {
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

    // ============================================
    // ENHANCED TOOLTIPS
    // ============================================
    function initTooltips() {
        // Initialize Bootstrap tooltips if available
        if (typeof $ !== 'undefined' && $.fn.tooltip) {
            $('[data-toggle="tooltip"], [title]').tooltip({
                trigger: 'hover',
                container: 'body',
                template: '<div class="tooltip ahmad-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            });
        }
    }

    // ============================================
    // PAGE TRANSITIONS
    // ============================================
    function initPageTransitions() {
        // Add fade-in effect to main content
        const mainContent = document.querySelector('.page-container, .main-section, [data-page-container]');
        if (mainContent) {
            mainContent.classList.add('ahmad-fade-in');
        }

        // Observe for new content
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Add animation to new cards
                        const cards = node.querySelectorAll ? node.querySelectorAll('.card, .frappe-card, .widget') : [];
                        cards.forEach((card, index) => {
                            card.style.animationDelay = `${index * 0.05}s`;
                            card.classList.add('ahmad-slide-up');
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .ahmad-fade-in {
                animation: ahmadFadeIn 0.3s ease-out;
            }
            
            .ahmad-slide-up {
                animation: ahmadSlideUp 0.4s ease-out forwards;
                opacity: 0;
            }
            
            @keyframes ahmadFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes ahmadSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
            
            lastScroll = currentScroll;
        });

        // Add navbar scroll styles
        const style = document.createElement('style');
        style.textContent = `
            .navbar {
                transition: all 0.3s ease;
            }
            
            .navbar.navbar-scrolled {
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // FRAPPE INTEGRATION HELPERS
    // ============================================
    
    // Override frappe.show_alert for better styling
    if (typeof frappe !== 'undefined') {
        const originalShowAlert = frappe.show_alert;
        frappe.show_alert = function(message, seconds, actions) {
            // Add custom class for styling
            const result = originalShowAlert.call(this, message, seconds, actions);
            
            // Find and enhance the alert
            setTimeout(() => {
                const alerts = document.querySelectorAll('.desk-alert:not(.ahmad-styled)');
                alerts.forEach(alert => {
                    alert.classList.add('ahmad-styled');
                    alert.style.borderRadius = '12px';
                    alert.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                });
            }, 10);
            
            return result;
        };

        // Enhance frappe.msgprint
        const originalMsgprint = frappe.msgprint;
        frappe.msgprint = function(msg, title, indicator) {
            const result = originalMsgprint.call(this, msg, title, indicator);
            
            setTimeout(() => {
                const modal = document.querySelector('.msgprint-dialog .modal-content');
                if (modal && !modal.classList.contains('ahmad-styled')) {
                    modal.classList.add('ahmad-styled');
                    modal.style.borderRadius = '16px';
                    modal.style.overflow = 'hidden';
                }
            }, 50);
            
            return result;
        };
    }

    // ============================================
    // UTILITY: Add loading skeleton
    // ============================================
    window.ahmadShowSkeleton = function(container, count = 3) {
        const skeleton = `
            <div class="ahmad-skeleton" style="padding: 16px;">
                ${Array(count).fill(`
                    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                        <div class="skeleton" style="width: 48px; height: 48px; border-radius: 8px;"></div>
                        <div style="flex: 1;">
                            <div class="skeleton" style="height: 16px; width: 70%; margin-bottom: 8px;"></div>
                            <div class="skeleton" style="height: 12px; width: 50%;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.innerHTML = skeleton;
        }
    };

    // ============================================
    // UTILITY: Format numbers with animation
    // ============================================
    window.ahmadAnimateNumber = function(element, endValue, duration = 1000) {
        const startValue = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            
            const currentValue = Math.floor(startValue + (endValue - startValue) * easeProgress);
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = endValue.toLocaleString();
            }
        }
        
        requestAnimationFrame(update);
    };

})();
