/* Navigation Menu JavaScript for Quotation Page */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation functionality
    initMobileNavigation();
    initDropdownMenus();
    initAccessibility();
});

function initMobileNavigation() {
    const mobileNav = document.querySelector('.mobile_nav');
    const topNavigation = document.getElementById('et-top-navigation');
    
    if (!mobileNav || !topNavigation) return;
    
    // Create mobile menu dropdown if it doesn't exist
    let mobileDropdown = document.querySelector('.mobile-menu-dropdown');
    if (!mobileDropdown) {
        mobileDropdown = createMobileMenuDropdown();
        topNavigation.appendChild(mobileDropdown);
    }
    
    // Mobile menu toggle functionality
    mobileNav.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMobileMenu();
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!topNavigation.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Handle escape key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function createMobileMenuDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'mobile-menu-dropdown';
    
    // Clone the main menu for mobile
    const mainMenu = document.getElementById('top-menu');
    if (mainMenu) {
        const mobileMenu = mainMenu.cloneNode(true);
        mobileMenu.id = 'mobile-menu';
        
        // Add submenu toggles for items with children
        const itemsWithChildren = mobileMenu.querySelectorAll('.menu-item-has-children');
        itemsWithChildren.forEach(function(item) {
            const toggle = document.createElement('span');
            toggle.className = 'mobile-submenu-toggle';
            toggle.innerHTML = '▼';
            toggle.setAttribute('role', 'button');
            toggle.setAttribute('tabindex', '0');
            toggle.setAttribute('aria-expanded', 'false');
            
            const link = item.querySelector('a');
            if (link) {
                link.style.position = 'relative';
                link.appendChild(toggle);
            }
            
            // Add click handler for submenu toggle
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleSubmenu(item, toggle);
            });
            
            // Add keyboard support
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSubmenu(item, toggle);
                }
            });
        });
        
        dropdown.appendChild(mobileMenu);
    }
    
    return dropdown;
}

function toggleMobileMenu() {
    const mobileNav = document.querySelector('.mobile_nav');
    const dropdown = document.querySelector('.mobile-menu-dropdown');
    
    if (!mobileNav || !dropdown) return;
    
    const isClosed = mobileNav.classList.contains('closed');
    
    if (isClosed) {
        // Open menu
        mobileNav.classList.remove('closed');
        dropdown.classList.add('open');
        mobileNav.setAttribute('aria-expanded', 'true');
        
        // Focus management
        const firstMenuItem = dropdown.querySelector('a');
        if (firstMenuItem) {
            firstMenuItem.focus();
        }
    } else {
        // Close menu
        closeMobileMenu();
    }
}

function closeMobileMenu() {
    const mobileNav = document.querySelector('.mobile_nav');
    const dropdown = document.querySelector('.mobile-menu-dropdown');
    
    if (!mobileNav || !dropdown) return;
    
    mobileNav.classList.add('closed');
    dropdown.classList.remove('open');
    mobileNav.setAttribute('aria-expanded', 'false');
    
    // Close all submenus
    const openSubmenus = dropdown.querySelectorAll('.menu-item-has-children.open');
    openSubmenus.forEach(function(item) {
        item.classList.remove('open');
        const toggle = item.querySelector('.mobile-submenu-toggle');
        if (toggle) {
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function toggleSubmenu(menuItem, toggle) {
    const isOpen = menuItem.classList.contains('open');
    
    // Close all other submenus first
    const allSubmenus = document.querySelectorAll('.menu-item-has-children.open');
    allSubmenus.forEach(function(item) {
        if (item !== menuItem) {
            item.classList.remove('open');
            const otherToggle = item.querySelector('.mobile-submenu-toggle');
            if (otherToggle) {
                otherToggle.classList.remove('open');
                otherToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Toggle current submenu
    if (isOpen) {
        menuItem.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    } else {
        menuItem.classList.add('open');
        toggle.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
    }
}

function initDropdownMenus() {
    const dropdownItems = document.querySelectorAll('#top-menu .menu-item-has-children');
    
    dropdownItems.forEach(function(item) {
        const submenu = item.querySelector('.sub-menu');
        
        if (submenu) {
            // Mouse events
            item.addEventListener('mouseenter', function() {
                clearTimeout(item.hideTimeout);
                submenu.style.display = 'block';
                setTimeout(function() {
                    submenu.classList.add('show');
                }, 10);
            });
            
            item.addEventListener('mouseleave', function() {
                item.hideTimeout = setTimeout(function() {
                    submenu.classList.remove('show');
                    setTimeout(function() {
                        if (!submenu.classList.contains('show')) {
                            submenu.style.display = 'none';
                        }
                    }, 300);
                }, 100);
            });
            
            // Keyboard navigation
            const mainLink = item.querySelector('a');
            if (mainLink) {
                mainLink.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const firstSubmenuLink = submenu.querySelector('a');
                        if (firstSubmenuLink) {
                            submenu.style.display = 'block';
                            submenu.classList.add('show');
                            firstSubmenuLink.focus();
                        }
                    }
                });
            }
            
            // Handle keyboard navigation within submenu
            const submenuLinks = submenu.querySelectorAll('a');
            submenuLinks.forEach(function(link, index) {
                link.addEventListener('keydown', function(e) {
                    switch(e.key) {
                        case 'ArrowDown':
                            e.preventDefault();
                            const nextLink = submenuLinks[index + 1];
                            if (nextLink) nextLink.focus();
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            if (index === 0) {
                                mainLink.focus();
                            } else {
                                const prevLink = submenuLinks[index - 1];
                                if (prevLink) prevLink.focus();
                            }
                            break;
                        case 'Escape':
                            e.preventDefault();
                            submenu.classList.remove('show');
                            submenu.style.display = 'none';
                            mainLink.focus();
                            break;
                    }
                });
            });
        }
    });
}

function initAccessibility() {
    // Add ARIA attributes
    const navigation = document.getElementById('top-menu-nav');
    if (navigation) {
        navigation.setAttribute('role', 'navigation');
        navigation.setAttribute('aria-label', 'Main navigation');
    }
    
    const mobileNav = document.querySelector('.mobile_nav');
    if (mobileNav) {
        mobileNav.setAttribute('role', 'button');
        mobileNav.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-label', 'Toggle mobile menu');
        mobileNav.setAttribute('tabindex', '0');
    }
    
    // Add keyboard support for mobile nav toggle
    if (mobileNav) {
        mobileNav.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
    }
    
    // Enhance link accessibility
    const menuLinks = document.querySelectorAll('#top-menu a, .mobile-menu-dropdown a');
    menuLinks.forEach(function(link) {
        // Add focus indicators
        link.addEventListener('focus', function() {
            this.style.outline = '2px solid #2ea3f2';
            this.style.outlineOffset = '2px';
        });
        
        link.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Utility function to handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 980) {
        closeMobileMenu();
    }
});

// Performance optimization: Debounce resize handler
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('resize', debounce(function() {
    if (window.innerWidth > 980) {
        closeMobileMenu();
    }
}, 250));