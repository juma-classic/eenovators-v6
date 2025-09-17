/**
 * Modern Mobile Navigation System
 * Provides smooth, accessible mobile navigation with advanced features
 */

class MobileNavigation {
  constructor() {
    this.navToggle = document.getElementById('navToggle');
    this.navWrap = document.querySelector('.nav-wrap');
    this.navMenu = document.getElementById('mainMenu');
    this.body = document.body;
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    if (!this.navToggle || !this.navWrap) return;
    
    this.bindEvents();
    this.setupKeyboardNavigation();
    this.addQuickAccessButton();
    this.setupScrollBehavior();
  }
  
  bindEvents() {
    // Toggle button click
    this.navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });
    
    // Close on overlay click
    this.navWrap.addEventListener('click', (e) => {
      if (e.target === this.navWrap) {
        this.close();
      }
    });
    
    // Close on navigation link click
    const navLinks = this.navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.close();
      });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && this.isOpen) {
        this.close();
      }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }
  
  setupKeyboardNavigation() {
    // Trap focus within menu when open
    this.navWrap.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      if (e.key === 'Tab') {
        const focusableElements = this.navWrap.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }
  
  setupScrollBehavior() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Close menu on scroll (mobile UX best practice)
      if (this.isOpen && Math.abs(currentScrollY - lastScrollY) > 50) {
        this.close();
      }
      
      lastScrollY = currentScrollY;
    });
  }
  
  addQuickAccessButton() {
    // Add a floating call button for mobile users
    if (window.innerWidth <= 600) {
      const quickActions = document.createElement('div');
      quickActions.className = 'mobile-quick-actions';
      quickActions.innerHTML = `
        <a href="tel:+254700000000" class="quick-call-btn" aria-label="Call Eenovators">
          📞
        </a>
      `;
      
      // Only add if it doesn't already exist
      if (!document.querySelector('.mobile-quick-actions')) {
        document.body.appendChild(quickActions);
      }
    }
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  open() {
    this.isOpen = true;
    this.body.classList.add('nav-open');
    this.navWrap.classList.add('active');
    this.navToggle.classList.add('active');
    this.navToggle.setAttribute('aria-expanded', 'true');
    
    // Focus the first menu item for accessibility
    setTimeout(() => {
      const firstLink = this.navMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    }, 300);
    
    // Add smooth entrance animation
    this.animateMenuItems();
  }
  
  close() {
    this.isOpen = false;
    this.body.classList.remove('nav-open');
    this.navWrap.classList.remove('active');
    this.navToggle.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    
    // Return focus to toggle button
    this.navToggle.focus();
  }
  
  animateMenuItems() {
    const menuItems = this.navMenu.querySelectorAll('.nav-item');
    menuItems.forEach((item, index) => {
      item.style.animationDelay = `${(index + 1) * 0.05}s`;
    });
  }
}

// Enhanced touch gestures for mobile
class TouchGestureHandler {
  constructor(navigation) {
    this.nav = navigation;
    this.startX = 0;
    this.startY = 0;
    this.threshold = 100;
    
    this.init();
  }
  
  init() {
    // Swipe to close navigation
    this.nav.navWrap.addEventListener('touchstart', (e) => {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    });
    
    this.nav.navWrap.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = this.startX - endX;
      const diffY = this.startY - endY;
      
      // Swipe left to close
      if (Math.abs(diffX) > Math.abs(diffY) && diffX > this.threshold) {
        this.nav.close();
      }
      
      // Swipe up to close
      if (Math.abs(diffY) > Math.abs(diffX) && diffY > this.threshold) {
        this.nav.close();
      }
    });
  }
}

// Performance optimization for mobile
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    // Preload critical navigation assets
    this.preloadAssets();
    
    // Optimize animations for mobile devices
    this.optimizeAnimations();
    
    // Add viewport meta if missing
    this.ensureViewportMeta();
  }
  
  preloadAssets() {
    // Preload any critical CSS or images used in navigation
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = 'assets/css/responsive.css';
    document.head.appendChild(link);
  }
  
  optimizeAnimations() {
    // Reduce animations on slower devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
    }
  }
  
  ensureViewportMeta() {
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      document.head.appendChild(viewport);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const mobileNav = new MobileNavigation();
  const touchHandler = new TouchGestureHandler(mobileNav);
  const optimizer = new PerformanceOptimizer();
  
  // Add smooth scroll behavior for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Enhanced link interactions
  const navLinks = document.querySelectorAll('.nav-item a');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}