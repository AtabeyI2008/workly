// ƏSAS SİSTEM KONFİQURASİYASI
class BizNetApp {
    constructor() {
        this.currentUser = null;
        this.jobs = [];
        this.freelancers = [];
        this.companies = [];
        this.restaurants = [];
        this.messages = [];
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupAuth();
        this.setupSearch();
        this.setupNotifications();
        console.log('🚀 BizNet app initialized');
    }

    // DATA MANAGEMENT
    loadData() {
        // LocalStorage-dan məlumatları yüklə
        this.currentUser = JSON.parse(localStorage.getItem('biznet_user')) || null;
        this.jobs = JSON.parse(localStorage.getItem('biznet_jobs')) || this.getSampleJobs();
        this.freelancers = JSON.parse(localStorage.getItem('biznet_freelancers')) || this.getSampleFreelancers();
        this.companies = JSON.parse(localStorage.getItem('biznet_companies')) || this.getSampleCompanies();
        this.restaurants = JSON.parse(localStorage.getItem('biznet_restaurants')) || this.getSampleRestaurants();
        this.messages = JSON.parse(localStorage.getItem('biznet_messages')) || [];
    }

    saveData() {
        localStorage.setItem('biznet_user', JSON.stringify(this.currentUser));
        localStorage.setItem('biznet_jobs', JSON.stringify(this.jobs));
        localStorage.setItem('biznet_freelancers', JSON.stringify(this.freelancers));
        localStorage.setItem('biznet_companies', JSON.stringify(this.companies));
        localStorage.setItem('biznet_restaurants', JSON.stringify(this.restaurants));
        localStorage.setItem('biznet_messages', JSON.stringify(this.messages));
    }

    // EVENT LISTENERS
    setupEventListeners() {
        // Mobile menu
        this.setupMobileMenu();
        
        // Search functionality
        this.setupGlobalSearch();
        
        // Tab switching
        this.setupTabs();
        
        // Form submissions
        this.setupForms();
        
        // Click outside handlers
        this.setupClickOutside();
    }

    setupMobileMenu() {
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-links a');

        if (mobileBtn && navMenu) {
            mobileBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileBtn.classList.toggle('active');
            });

            // Close menu when clicking on links
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileBtn.classList.remove('active');
                });
            });
        }
    }

    setupGlobalSearch() {
        const searchInputs = document.querySelectorAll('.search-input');
        const searchBtns = document.querySelectorAll('.search-btn');

        searchBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.performSearch();
            });
        });

        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        });
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked tab
                btn.classList.add('active');
                
                const tabType = btn.dataset.tab;
                this.switchTab(tabType);
            });
        });
    }

    switchTab(tabType) {
        // Update search placeholder based on tab
        const searchInput = document.querySelector('.search-input');
        const categorySelect = document.querySelector('.search-select');
        
        switch(tabType) {
            case 'jobs':
                searchInput.placeholder = 'Vəzifə, şirkət adı və ya tələblər...';
                this.updateCategoryOptions('jobs');
                break;
            case 'freelancers':
                searchInput.placeholder = 'Freelancer adı, bacarıq və ya xidmət...';
                this.updateCategoryOptions('freelancers');
                break;
            case 'companies':
                searchInput.placeholder = 'Şirkət adı, sənaye və ya lokasiya...';
                this.updateCategoryOptions('companies');
                break;
            case 'restaurants':
                searchInput.placeholder = 'Restoran adı, mətbəx və ya vəzifə...';
                this.updateCategoryOptions('restaurants');
                break;
            default:
                searchInput.placeholder = 'Nə axtarırsan?';
                this.updateCategoryOptions('all');
        }
    }

    updateCategoryOptions(type) {
        const categorySelect = document.querySelector('.search-select');
        if (!categorySelect) return;

        const options = {
            all: [
                {value: '', text: 'Kateqoriya seç'},
                {value: 'design', text: 'Dizayn'},
                {value: 'development', text: 'Proqramlaşdırma'},
                {value: 'marketing', text: 'Marketinq'},
                {value: 'restaurant', text: 'Restoran'},
                {value: 'retail', text: 'Pərakəndə'}
            ],
            jobs: [
                {value: '', text: 'İxtisas seç'},
                {value: 'it', text: 'IT & Texnologiya'},
                {value: 'finance', text: 'Maliyyə'},
                {value: 'sales', text: 'Satış'},
                {value: 'marketing', text: 'Marketinq'}
            ],
            freelancers: [
                {value: '', text: 'Xidmət növü'},
                {value: 'web-dev', text: 'Veb Development'},
                {value: 'design', text: 'Dizayn'},
                {value: 'writing', text: 'Yazı & Tərcümə'},
                {value: 'marketing', text: 'Digital Marketinq'}
            ],
            companies: [
                {value: '', text: 'Sənaye'},
                {value: 'technology', text: 'Texnologiya'},
                {value: 'finance', text: 'Maliyyə'},
                {value: 'healthcare', text: 'Səhiyyə'},
                {value: 'education', text: 'Təhsil'}
            ],
            restaurants: [
                {value: '', text: 'Mətbəx növü'},
                {value: 'azeri', text: 'Azərbaycan'},
                {value: 'turkish', text: 'Türk'},
                {value: 'european', text: 'Avropa'},
                {value: 'asian', text: 'Asiya'}
            ]
        };

        categorySelect.innerHTML = options[type].map(opt => 
            `<option value="${opt.value}">${opt.text}</option>`
        ).join('');
    }

    performSearch() {
        const searchInput = document.querySelector('.search-input');
        const categorySelect = document.querySelector('.search-select');
        const citySelect = document.querySelectorAll('.search-select')[1];
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;

        const searchData = {
            query: searchInput.value.trim(),
            category: categorySelect.value,
            city: citySelect.value,
            type: activeTab
        };

        if (!searchData.query) {
            this.showNotification('Zəhmət olmasa axtarış sözü daxil edin', 'warning');
            return;
        }

        this.showNotification(`"${searchData.query}" üçün axtarış edilir...`, 'info');
        
        // Axtarış nəticələrini göstər
        setTimeout(() => {
            this.displaySearchResults(searchData);
        }, 1000);
    }

    displaySearchResults(searchData) {
        // Burada axtarış nəticələri göstəriləcək
        console.log('Search results:', searchData);
        
        // Müvəqqəti mesaj
        this.showNotification(`${searchData.type} üçün ${searchData.query} axtarışı tamamlandı`, 'success');
    }

    // AUTH SYSTEM
    setupAuth() {
        this.updateAuthUI();
    }

    updateAuthUI() {
        const loginBtn = document.querySelector('.login-btn');
        const registerBtn = document.querySelector('.register-btn');
        const navAuth = document.querySelector('.nav-auth');

        if (this.currentUser) {
            // User logged in
            if (loginBtn) loginBtn.textContent = this.currentUser.name;
            if (registerBtn) {
                registerBtn.textContent = 'Profil';
                registerBtn.href = 'profile.html';
            }
            
            // Add logout button
            if (navAuth && !navAuth.querySelector('.logout-btn')) {
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.className = 'logout-btn';
                logoutBtn.textContent = 'Çıxış';
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
                navAuth.appendChild(logoutBtn);
            }
        } else {
            // User not logged in
            if (loginBtn) loginBtn.textContent = 'Giriş';
            if (registerBtn) {
                registerBtn.textContent = 'Qeydiyyat';
                registerBtn.href = 'register.html';
            }
            
            // Remove logout button
            const logoutBtn = document.querySelector('.logout-btn');
            if (logoutBtn) logoutBtn.remove();
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('biznet_user');
        this.showNotification('Uğurla çıxış edildi', 'success');
        this.updateAuthUI();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // NOTIFICATION SYSTEM
    setupNotifications() {
        // Notification container yarat
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info') {
        const container = document.querySelector('.notification-container');
        const notification = document.createElement('div');
        
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            warning: '#ed8936',
            info: '#4299e1'
        };

        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        notification.style.cssText = `
            background: ${colors[type]};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
            min-width: 300px;
        `;

        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }

    // FORM HANDLING
    setupForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const action = form.getAttribute('data-action');

        switch(action) {
            case 'login':
                this.handleLogin(formData);
                break;
            case 'register':
                this.handleRegister(formData);
                break;
            case 'post-job':
                this.handlePostJob(formData);
                break;
            default:
                console.log('Form submitted:', Object.fromEntries(formData));
        }
    }

    // SAMPLE DATA
    getSampleJobs() {
        return [
            {
                id: 1,
                title: 'Veb Developer',
                company: 'TechCorp',
                location: 'Bakı',
                salary: '₼ 2000-3000',
                type: 'Tam ştat',
                description: 'React və Node.js bilən veb developer axtarırıq.',
                image: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
                date: '2024-01-15',
                category: 'it'
            },
            {
                id: 2,
                title: 'Qrafik Dizayner',
                company: 'Creative Studio',
                location: 'Gəncə',
                salary: '₼ 800-1200',
                type: 'Yarımştat',
                description: 'Adobe Creative Suite bilən kreativ dizayner.',
                image: 'https://cdn-icons-png.flaticon.com/512/1995/1995511.png',
                date: '2024-01-14',
                category: 'design'
            }
        ];
    }

    getSampleFreelancers() {
        return [
            {
                id: 1,
                name: 'Əli Məmmədov',
                skill: 'Veb Developer',
                rate: '₼ 50/saat',
                rating: 4.9,
                location: 'Bakı',
                image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                description: '5 illik təcrübə, React və Node.js ixtisasım.'
            }
        ];
    }

    getSampleCompanies() {
        return [
            {
                id: 1,
                name: 'TechCorp',
                industry: 'IT & Texnologiya',
                location: 'Bakı',
                jobs: 12,
                image: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
                description: 'Rəqəmsal transformasiya üzrə aparıcı şirkət.'
            }
        ];
    }

    getSampleRestaurants() {
        return [
            {
                id: 1,
                name: 'Lezzet Restoran',
                cuisine: 'Türk mətbəxi',
                location: 'Bakı',
                jobs: 3,
                image: 'https://cdn-icons-png.flaticon.com/512/878/878052.png',
                description: 'Ən ləziz türk yeməkləri.'
            }
        ];
    }

    // UTILITY FUNCTIONS
    setupClickOutside() {
        document.addEventListener('click', (e) => {
            // Mobile menu bağlama
            const mobileMenu = document.querySelector('.nav-menu');
            const mobileBtn = document.querySelector('.mobile-menu-btn');
            
            if (mobileMenu && mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !mobileBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
            }
        });
    }

    formatPrice(amount) {
        return new Intl.NumberFormat('az-AZ', {
            style: 'currency',
            currency: 'AZN'
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('az-AZ');
    }
}

// APP İNİTİALİZATİON
document.addEventListener('DOMContentLoaded', () => {
    window.biznetApp = new BizNetApp();
});

// GLOBAL FUNCTIONS
function showNotification(message, type = 'info') {
    if (window.biznetApp) {
        window.biznetApp.showNotification(message, type);
    }
}

function requireAuth() {
    if (window.biznetApp && !window.biznetApp.currentUser) {
        showNotification('Bu əməliyyat üçün giriş etməlisiniz', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    return true;
}