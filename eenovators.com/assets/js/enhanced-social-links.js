/**
 * Enhanced Social Media Links Component
 * Vanilla JavaScript implementation inspired by React social-links component
 * Provides interactive hover effects, preview cards, and animations
 */

class EnhancedSocialLinks {
    constructor() {
        this.socialContainer = null;
        this.socialList = null;
        this.previewCard = null;
        this.previewTimeout = null;
        this.isInitialized = false;
        
        // Social media platform data
        this.platformData = {
            facebook: {
                name: 'Facebook',
                description: 'Connect with us on Facebook',
                content: 'Stay updated with our latest solar innovations, project showcases, and sustainable energy solutions.',
                color: '#3b5998'
            },
            twitter: {
                name: 'X (Twitter)',
                description: 'Follow us on X',
                content: 'Get real-time updates on renewable energy trends, company news, and industry insights.',
                color: '#1da1f2'
            },
            linkedin: {
                name: 'LinkedIn',
                description: 'Connect professionally',
                content: 'Join our professional network for career opportunities, industry partnerships, and business updates.',
                color: '#0077b5'
            },
            instagram: {
                name: 'Instagram',
                description: 'Visual stories and updates',
                content: 'Explore behind-the-scenes content, project galleries, and visual stories of our sustainable journey.',
                color: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
            }
        };
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        this.findSocialElements();
        if (this.socialList) {
            this.enhanceSocialLinks();
            this.createPreviewCard();
            this.bindEvents();
            this.animateEntrance();
            this.isInitialized = true;
            console.log('Enhanced Social Links initialized successfully');
        }
    }
    
    findSocialElements() {
        // Find the social media follow container
        this.socialList = document.querySelector('.et_pb_social_media_follow_0_tb_footer');
        this.socialContainer = this.socialList?.parentElement;
        
        if (!this.socialList) {
            console.warn('Social media follow container not found');
            return;
        }
    }
    
    enhanceSocialLinks() {
        // Add enhanced classes
        this.socialList.classList.add('enhanced-social');
        
        // Wrap in enhanced container if not already wrapped
        if (!this.socialContainer.classList.contains('enhanced-social-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'enhanced-social-container';
            this.socialContainer.insertBefore(wrapper, this.socialList);
            wrapper.appendChild(this.socialList);
            this.socialContainer = wrapper;
        }
        
        // Process each social link
        const socialLinks = this.socialList.querySelectorAll('.et_pb_social_icon');
        socialLinks.forEach((link, index) => {
            this.enhanceSocialLink(link, index);
        });
    }
    
    enhanceSocialLink(linkElement, index) {
        const linkAnchor = linkElement.querySelector('a.icon');
        if (!linkAnchor) return;
        
        // Get platform type from class
        const platformClass = Array.from(linkElement.classList)
            .find(cls => cls.startsWith('et-social-'));
        const platform = platformClass ? platformClass.replace('et-social-', '') : 'unknown';
        
        // Store platform data
        linkElement.dataset.platform = platform;
        linkElement.dataset.index = index;
        
        // Add ARIA attributes
        linkAnchor.setAttribute('aria-label', `Follow us on ${this.platformData[platform]?.name || platform}`);
        linkAnchor.setAttribute('role', 'button');
        
        // Add keyboard support
        linkAnchor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleSocialClick(platform, linkAnchor);
            }
        });
    }
    
    createPreviewCard() {
        this.previewCard = document.createElement('div');
        this.previewCard.className = 'social-preview-card';
        this.previewCard.innerHTML = `
            <div class="preview-header">
                <div class="preview-icon"></div>
                <div class="preview-info">
                    <h3 class="preview-title"></h3>
                    <p class="preview-description"></p>
                </div>
            </div>
            <div class="preview-content"></div>
        `;
        
        this.socialContainer.appendChild(this.previewCard);
    }
    
    bindEvents() {
        const socialLinks = this.socialList.querySelectorAll('.et_pb_social_icon');
        
        socialLinks.forEach(link => {
            const anchor = link.querySelector('a.icon');
            const platform = link.dataset.platform;
            
            // Mouse events
            link.addEventListener('mouseenter', () => this.showPreview(platform, link));
            link.addEventListener('mouseleave', () => this.hidePreview());
            
            // Click events
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialClick(platform, anchor);
            });
            
            // Touch events for mobile
            link.addEventListener('touchstart', () => this.showPreview(platform, link));
            link.addEventListener('touchend', () => {
                setTimeout(() => this.hidePreview(), 2000); // Hide after 2 seconds on mobile
            });
        });
        
        // Hide preview when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.socialContainer.contains(e.target)) {
                this.hidePreview();
            }
        });
    }
    
    showPreview(platform, linkElement) {
        if (!this.platformData[platform]) return;
        
        clearTimeout(this.previewTimeout);
        
        const data = this.platformData[platform];
        const previewIcon = this.previewCard.querySelector('.preview-icon');
        const previewTitle = this.previewCard.querySelector('.preview-title');
        const previewDescription = this.previewCard.querySelector('.preview-description');
        const previewContent = this.previewCard.querySelector('.preview-content');
        
        // Update content
        previewTitle.textContent = data.name;
        previewDescription.textContent = data.description;
        previewContent.textContent = data.content;
        
        // Update styling
        this.previewCard.className = `social-preview-card preview-${platform}`;
        previewIcon.innerHTML = this.getSocialIcon(platform);
        
        // Position the preview card
        this.positionPreviewCard(linkElement);
        
        // Show with animation
        requestAnimationFrame(() => {
            this.previewCard.classList.add('show');
        });
    }
    
    hidePreview() {
        this.previewTimeout = setTimeout(() => {
            this.previewCard.classList.remove('show');
        }, 150);
    }
    
    positionPreviewCard(linkElement) {
        const linkRect = linkElement.getBoundingClientRect();
        const containerRect = this.socialContainer.getBoundingClientRect();
        const cardWidth = 280;
        
        // Calculate position relative to container
        const linkCenter = linkRect.left + linkRect.width / 2 - containerRect.left;
        let cardLeft = linkCenter - cardWidth / 2;
        
        // Ensure card stays within container bounds
        if (cardLeft < 10) cardLeft = 10;
        if (cardLeft + cardWidth > containerRect.width - 10) {
            cardLeft = containerRect.width - cardWidth - 10;
        }
        
        this.previewCard.style.left = `${cardLeft}px`;
        this.previewCard.style.transform = 'translateY(20px)';
    }
    
    getSocialIcon(platform) {
        const icons = {
            facebook: '&#xf09a;',
            twitter: '&#xf099;',
            linkedin: '&#xf0e1;',
            instagram: '&#xf16d;'
        };
        return icons[platform] || '&#xf0c0;';
    }
    
    handleSocialClick(platform, anchorElement) {
        // Add ripple effect
        this.createRippleEffect(anchorElement);
        
        // Add pulse animation
        const linkElement = anchorElement.closest('.et_pb_social_icon');
        linkElement.classList.add('pulse');
        setTimeout(() => linkElement.classList.remove('pulse'), 2000);
        
        // Get the actual URL from the href attribute
        const url = anchorElement.getAttribute('href');
        
        // If URL is just '#', show a message (for demo purposes)
        if (url === '#' || !url) {
            this.showNotification(`${this.platformData[platform]?.name || platform} link coming soon!`);
            return;
        }
        
        // Open the social media link
        window.open(url, '_blank', 'noopener,noreferrer');
        
        // Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_click', {
                'platform': platform,
                'link_text': anchorElement.getAttribute('title') || platform
            });
        }
    }
    
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 9999;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width - size) / 2 + 'px';
        ripple.style.top = (rect.height - size) / 2 + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    animateEntrance() {
        // Add staggered entrance animation
        this.socialList.classList.add('animate-in');
        
        const links = this.socialList.querySelectorAll('.et_pb_social_icon');
        links.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    showNotification(message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(145deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8));
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Public methods for external interaction
    triggerPulse(platform) {
        const link = this.socialList.querySelector(`[data-platform="${platform}"]`);
        if (link) {
            link.classList.add('pulse');
            setTimeout(() => link.classList.remove('pulse'), 2000);
        }
    }
    
    updatePlatformData(platform, newData) {
        if (this.platformData[platform]) {
            this.platformData[platform] = { ...this.platformData[platform], ...newData };
        }
    }
    
    destroy() {
        if (this.previewCard) {
            this.previewCard.remove();
        }
        
        if (this.socialList) {
            this.socialList.classList.remove('enhanced-social', 'animate-in');
            
            // Remove event listeners and enhancements
            const links = this.socialList.querySelectorAll('.et_pb_social_icon');
            links.forEach(link => {
                link.replaceWith(link.cloneNode(true));
            });
        }
        
        this.isInitialized = false;
    }
}

// Initialize the enhanced social links when DOM is ready
let enhancedSocialLinks;

// Auto-initialize
if (typeof window !== 'undefined') {
    enhancedSocialLinks = new EnhancedSocialLinks();
    
    // Expose to global scope for debugging/interaction
    window.EnhancedSocialLinks = EnhancedSocialLinks;
    window.enhancedSocialLinks = enhancedSocialLinks;
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);