/**
 * Auto-initialization script for Sliding Tabs
 * This script automatically converts the navigation to sliding tabs when the page loads
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if the page has the sliding tabs container
    const slidingContainer = document.querySelector('.slide-tabs-container');
    
    if (slidingContainer) {
        // Initialize the sliding tabs
        const slidingTabs = new SlidingTabs('.slide-tabs-container');
        
        if (slidingTabs) {
            console.log('✅ Sliding tabs initialized successfully');
            
            // Add some enhancement features
            
            // 1. Determine active tab based on current page URL
            const currentPath = window.location.pathname;
            const tabs = slidingContainer.querySelectorAll('.slide-tab');
            
            tabs.forEach((tab, index) => {
                const href = tab.getAttribute('href');
                if (href && currentPath.includes(href.replace('.html', '').replace('index', ''))) {
                    slidingTabs.setTab(index);
                    console.log(`🎯 Set active tab: ${tab.textContent} (based on URL)`);
                }
            });
            
            // 2. Add keyboard navigation
            slidingContainer.addEventListener('keydown', function(e) {
                const activeIndex = slidingTabs.getCurrentTab();
                const totalTabs = tabs.length;
                
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        const prevIndex = activeIndex > 0 ? activeIndex - 1 : totalTabs - 1;
                        slidingTabs.setTab(prevIndex);
                        tabs[prevIndex].focus();
                        break;
                        
                    case 'ArrowRight':
                        e.preventDefault();
                        const nextIndex = activeIndex < totalTabs - 1 ? activeIndex + 1 : 0;
                        slidingTabs.setTab(nextIndex);
                        tabs[nextIndex].focus();
                        break;
                        
                    case 'Home':
                        e.preventDefault();
                        slidingTabs.setTab(0);
                        tabs[0].focus();
                        break;
                        
                    case 'End':
                        e.preventDefault();
                        slidingTabs.setTab(totalTabs - 1);
                        tabs[totalTabs - 1].focus();
                        break;
                }
            });
            
            // 3. Add smooth scrolling for anchor links
            slidingContainer.addEventListener('tabChange', function(e) {
                const href = e.detail.href;
                if (href && href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
            
            // 4. Add ARIA attributes for accessibility
            tabs.forEach((tab, index) => {
                tab.setAttribute('role', 'tab');
                tab.setAttribute('tabindex', index === slidingTabs.getCurrentTab() ? '0' : '-1');
                tab.setAttribute('aria-selected', index === slidingTabs.getCurrentTab() ? 'true' : 'false');
            });
            
            const tabsNav = slidingContainer.querySelector('.slide-tabs-nav');
            if (tabsNav) {
                tabsNav.setAttribute('role', 'tablist');
                tabsNav.setAttribute('aria-label', 'Main navigation');
            }
            
            // Update ARIA attributes when tabs change
            slidingContainer.addEventListener('tabChange', function(e) {
                tabs.forEach((tab, index) => {
                    tab.setAttribute('tabindex', index === e.detail.index ? '0' : '-1');
                    tab.setAttribute('aria-selected', index === e.detail.index ? 'true' : 'false');
                });
            });
            
            console.log('🚀 Enhanced features added: keyboard navigation, accessibility, URL detection');
        }
    } else {
        console.log('ℹ️ No sliding tabs container found on this page');
    }
    
    // Initialize any additional sliding tabs containers
    const additionalContainers = document.querySelectorAll('.slide-tabs-container:not(:first-child)');
    additionalContainers.forEach((container, index) => {
        const slidingTabs = new SlidingTabs(`.slide-tabs-container:nth-child(${index + 2})`);
        if (slidingTabs) {
            console.log(`✅ Additional sliding tabs container ${index + 2} initialized`);
        }
    });
});

// Export for external use
if (typeof window !== 'undefined') {
    window.initializeSlidingTabs = function(selector) {
        return new SlidingTabs(selector);
    };
}