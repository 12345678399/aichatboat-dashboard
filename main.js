/**
 * NebulaX - Main JavaScript
 * Handles Sidebar, Theme Switching, SPA Navigation, and Global Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initThemeSwitcher();
    initLayoutSwitcher();
    initGlobalInteractions();
    initSPANavigation();
    initTabs();
    initModals();
    initAccordions();
});

/* --- Tabs Logic --- */
function initTabs() {
    const tabButtons = document.querySelectorAll('[data-tab-target]');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSelector = button.getAttribute('data-tab-target');
            const targetContent = document.querySelector(targetSelector);

            if (!targetContent) return;

            // Find parent tabs container to scope selection
            const parent = button.closest('.tabs-container') || document.body;

            // Deactivate siblings
            parent.querySelectorAll('[data-tab-target]').forEach(btn => btn.classList.remove('active'));
            parent.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            // Activate clicked
            button.classList.add('active');
            targetContent.classList.add('active');
        });
    });
}

/* --- Modals Logic --- */
function initModals() {
    // Open triggers
    document.querySelectorAll('[data-modal-target]').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-target');
            openModal(modalId);
        });
    });

    // Close triggers
    document.querySelectorAll('[data-modal-close]').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.querySelector(modalId);
    if (modal) modal.classList.add('open');
}

function closeModal(modal) {
    if (modal) modal.classList.remove('open');
}

/* --- Accordions Logic --- */
function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;

            // Optional: Close others
            // const parent = item.parentElement;
            // parent.querySelectorAll('.accordion-item').forEach(i => {
            //    if (i !== item) i.classList.remove('active');
            // });

            item.classList.toggle('active');
        });
    });
}

/* --- Toast Notification System --- */
window.showToast = (message, type = 'info', duration = 3000) => {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '';
    switch (type) {
        case 'success': icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'; break;
        case 'error': icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'; break;
        case 'warning': icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'; break;
        default: icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-in reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
};

/* --- SPA Navigation Logic --- */
function initSPANavigation() {
    // Select links from both sidebar and horizontal menu
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const sections = document.querySelectorAll('.page-section');

    if (!navLinks.length || !sections.length) return;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Get target page ID
            const targetPage = link.getAttribute('data-page');
            if (!targetPage) return;

            // 2. Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // 3. Add active class to ALL links pointing to this page (sync sidebar & horizontal)
            document.querySelectorAll(`.nav-link[data-page="${targetPage}"]`).forEach(l => {
                l.classList.add('active');
            });

            // 4. Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });

            // 5. Show target section
            const targetSection = document.getElementById(targetPage);
            if (targetSection) {
                targetSection.style.display = 'block';
                // Small delay to allow display:block to apply before opacity transition if we had one
                requestAnimationFrame(() => {
                    targetSection.classList.add('active');
                });
            }

            // 6. Mobile: Close sidebar on navigation
            if (window.innerWidth <= 1024) {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) sidebar.classList.remove('mobile-open');
            }
        });
    });
}

/* --- Layout Switcher Logic --- */
function initLayoutSwitcher() {
    const savedLayout = localStorage.getItem('nebulax-layout');
    if (savedLayout === 'horizontal') {
        document.body.classList.add('horizontal-layout');
    }

    window.toggleLayout = () => {
        document.body.classList.toggle('horizontal-layout');
        const isHorizontal = document.body.classList.contains('horizontal-layout');
        localStorage.setItem('nebulax-layout', isHorizontal ? 'horizontal' : 'vertical');
    };
}

/* --- Sidebar Logic --- */
function initSidebar() {
    const toggleBtn = document.querySelector('.toggle-sidebar-btn');
    const sidebar = document.querySelector('.sidebar');
    const appContainer = document.querySelector('.app-container');

    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
        // Desktop: Collapse
        if (window.innerWidth > 1024) {
            appContainer.classList.toggle('collapsed');
            // Store preference
            const isCollapsed = appContainer.classList.contains('collapsed');
            localStorage.setItem('sidebar-collapsed', isCollapsed);
        }
        // Mobile: Slide in
        else {
            sidebar.classList.toggle('mobile-open');
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 &&
            sidebar.classList.contains('mobile-open') &&
            !sidebar.contains(e.target) &&
            !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
        }
    });

    // Restore Desktop State
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState === 'true' && window.innerWidth > 1024) {
        appContainer.classList.add('collapsed');
    }
}

/* --- Theme Switcher Logic --- */
function initThemeSwitcher() {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('nebulax-theme') || 'default';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Expose function globally for demo purposes
    window.setTheme = (themeName) => {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('nebulax-theme', themeName);
    };
}

/* --- Interactions --- */
function initGlobalInteractions() {
    // Add ripple effect to buttons (Material Design style)
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;

            let ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            // CSS handles the animation class if we added it, 
            // but for now we rely on CSS active states.
        });
    });
}
