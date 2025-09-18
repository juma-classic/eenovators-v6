/**
 * Sliding Tabs Navigation JavaScript
 * Converts the React SlideTabs component functionality to vanilla JavaScript
 */

class SlidingTabs {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.warn(`SlidingTabs: Container ${containerSelector} not found`);
            return;
        }
        
        this.nav = this.container.querySelector('.slide-tabs-nav');
        this.tabs = Array.from(this.container.querySelectorAll('.slide-tab'));
        this.cursor = this.container.querySelector('.slide-cursor');
        this.selectedIndex = 0; // Default to first tab
        
        this.init();
    }
    
    init() {
        if (!this.nav || !this.cursor || this.tabs.length === 0) {
            console.warn('SlidingTabs: Required elements not found');
            return;
        }
        
        // Set initial cursor position
        this.setCursorPosition(this.selectedIndex);
        this.setActiveTab(this.selectedIndex);
        
        // Add event listeners
        this.addEventListeners();
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    addEventListeners() {
        // Add hover effects for each tab
        this.tabs.forEach((tab, index) => {
            // Mouse enter - move cursor to hovered tab
            tab.addEventListener('mouseenter', () => {
                this.setCursorPosition(index, true);
            });
            
            // Click - set as active tab
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveTab(index);
                this.setCursorPosition(index);
                
                // Handle navigation (if needed)
                this.handleNavigation(tab, index);
            });
        });
        
        // Mouse leave container - return cursor to selected tab
        this.container.addEventListener('mouseleave', () => {
            this.setCursorPosition(this.selectedIndex);
        });
    }
    
    setCursorPosition(index, isHover = false) {
        const targetTab = this.tabs[index];
        if (!targetTab) return;
        
        const tabRect = targetTab.getBoundingClientRect();
        const containerRect = this.nav.getBoundingClientRect();
        
        const left = targetTab.offsetLeft;
        const width = tabRect.width;
        
        // Apply position to cursor
        this.cursor.style.left = `${left}px`;
        this.cursor.style.width = `${width}px`;
        this.cursor.classList.add('visible');
        
        // Adjust transition speed for hover vs click
        if (isHover) {
            this.cursor.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            this.cursor.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }
    
    setActiveTab(index) {
        // Remove active class from all tabs
        this.tabs.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to selected tab
        if (this.tabs[index]) {
            this.tabs[index].classList.add('active');
            this.selectedIndex = index;
        }
    }
    
    handleNavigation(tab, index) {
        // Get the href from the tab
        const href = tab.getAttribute('href');
        
        // If it's a real link (not # or empty), navigate
        if (href && href !== '#' && href !== '') {
            // Small delay to show the animation
            setTimeout(() => {
                window.location.href = href;
            }, 150);
        }
        
        // Emit custom event for external handling
        const event = new CustomEvent('tabChange', {
            detail: { index, tab, href }
        });
        this.container.dispatchEvent(event);
    }
    
    handleResize() {
        // Recalculate cursor position on resize
        this.setCursorPosition(this.selectedIndex);
    }
    
    // Public method to programmatically set active tab
    setTab(index) {
        if (index >= 0 && index < this.tabs.length) {
            this.setActiveTab(index);
            this.setCursorPosition(index);
        }
    }
    
    // Public method to get current tab
    getCurrentTab() {
        return this.selectedIndex;
    }
    
    // Public method to add a new tab
    addTab(text, href, index = -1) {
        const newTab = document.createElement('a');
        newTab.className = 'slide-tab';
        newTab.href = href || '#';
        newTab.textContent = text;
        
        if (index === -1 || index >= this.tabs.length) {
            this.nav.appendChild(newTab);
        } else {
            this.nav.insertBefore(newTab, this.tabs[index]);
        }
        
        // Refresh tabs array and re-initialize
        this.tabs = Array.from(this.container.querySelectorAll('.slide-tab'));
        this.addEventListeners();
    }
    
    // Public method to remove a tab
    removeTab(index) {
        if (index >= 0 && index < this.tabs.length) {
            this.tabs[index].remove();
            this.tabs = Array.from(this.container.querySelectorAll('.slide-tab'));
            
            // Adjust selected index if necessary
            if (this.selectedIndex >= this.tabs.length) {
                this.selectedIndex = Math.max(0, this.tabs.length - 1);
            }
            
            this.setCursorPosition(this.selectedIndex);
        }
    }
}

// Utility function to create sliding tabs from existing navigation
function convertToSlidingTabs(navSelector, options = {}) {
    const nav = document.querySelector(navSelector);
    if (!nav) {
        console.warn(`convertToSlidingTabs: Navigation ${navSelector} not found`);
        return null;
    }
    
    // Default options
    const config = {
        maintainOriginalLinks: true,
        excludeDropdowns: true,
        activeTabIndex: 0,
        ...options
    };
    
    // Get existing menu items
    const menuItems = Array.from(nav.querySelectorAll('li > a'));
    
    // Filter out dropdown items if specified
    const tabs = config.excludeDropdowns 
        ? menuItems.filter(item => !item.parentElement.querySelector('.sub-menu'))
        : menuItems;
    
    // Create new sliding tabs container
    const container = document.createElement('div');
    container.className = 'slide-tabs-container';
    
    const tabsNav = document.createElement('div');
    tabsNav.className = 'slide-tabs-nav';
    
    // Create tabs
    tabs.forEach((originalLink, index) => {
        const tab = document.createElement('a');
        tab.className = 'slide-tab';
        tab.href = config.maintainOriginalLinks ? originalLink.href : '#';
        tab.textContent = originalLink.textContent.trim();
        tab.setAttribute('data-original-index', index);
        
        tabsNav.appendChild(tab);
    });
    
    // Create cursor
    const cursor = document.createElement('div');
    cursor.className = 'slide-cursor';
    tabsNav.appendChild(cursor);
    
    container.appendChild(tabsNav);
    
    // Replace original navigation
    nav.parentNode.replaceChild(container, nav);
    
    // Initialize sliding tabs
    const slidingTabs = new SlidingTabs('.slide-tabs-container');
    
    // Set initial active tab
    if (config.activeTabIndex >= 0 && config.activeTabIndex < tabs.length) {
        slidingTabs.setTab(config.activeTabIndex);
    }
    
    return slidingTabs;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we should auto-initialize
    const autoInit = document.querySelector('[data-sliding-tabs="auto"]');
    if (autoInit) {
        const navSelector = autoInit.getAttribute('data-nav-selector') || '#top-menu-nav';
        convertToSlidingTabs(navSelector);
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SlidingTabs, convertToSlidingTabs };
} else if (typeof window !== 'undefined') {
    window.SlidingTabs = SlidingTabs;
    window.convertToSlidingTabs = convertToSlidingTabs;
}