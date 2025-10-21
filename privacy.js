// PRIVACY POLICY INTERACTIVITY
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 Privacy Policy page loaded');
    
    initializePrivacyPage();
    setupSmoothScrolling();
    setupCookieManagement();
});

function initializePrivacyPage() {
    // Highlight active section in sidebar
    const sections = document.querySelectorAll('.policy-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

function setupSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

function setupCookieManagement() {
    // Load saved cookie preferences
    loadCookiePreferences();
}

function manageCookies() {
    const modal = document.getElementById('cookiesModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCookiesModal() {
    const modal = document.getElementById('cookiesModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function acceptAllCookies() {
    document.getElementById('functionalCookies').checked = true;
    document.getElementById('analyticalCookies').checked = true;
    document.getElementById('marketingCookies').checked = true;
    saveCookiePreferences();
}

function saveCookiePreferences() {
    const preferences = {
        functional: document.getElementById('functionalCookies').checked,
        analytical: document.getElementById('analyticalCookies').checked,
        marketing: document.getElementById('marketingCookies').checked
    };
    
    localStorage.setItem('biznet_cookie_preferences', JSON.stringify(preferences));
    
    showNotification('Cookies parametrləriniz uğurla saxlanıldı!', 'success');
    closeCookiesModal();
}

function loadCookiePreferences() {
    const saved = localStorage.getItem('biznet_cookie_preferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        document.getElementById('functionalCookies').checked = preferences.functional;
        document.getElementById('analyticalCookies').checked = preferences.analytical;
        document.getElementById('marketingCookies').checked = preferences.marketing;
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-left: 4px solid #4299e1;
                z-index: 10000;
                max-width: 300px;
                animation: slideInRight 0.3s ease;
            }
            .notification.success {
                border-left-color: #48bb78;
            }
            .notification.error {
                border-left-color: #e53e3e;
            }
            .notification.info {
                border-left-color: #4299e1;
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #718096;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('cookiesModal');
    if (e.target === modal) {
        closeCookiesModal();
    }
});

// Close modal with escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCookiesModal();
    }
});

// Add data labels for mobile table
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        const cookieRows = document.querySelectorAll('.cookie-row:not(.header)');
        cookieRows.forEach(row => {
            const cells = row.children;
            cells[0].setAttribute('data-label', 'Cookies Növü');
            cells[1].setAttribute('data-label', 'Məqsəd');
            cells[2].setAttribute('data-label', 'Müddət');
        });
    }
});