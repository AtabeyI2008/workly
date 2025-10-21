// pricing.js - Abunəlik Planları Sistemi

class PricingSystem {
    constructor() {
        this.currentUser = null;
        this.selectedPlan = null;
        this.isYearlyBilling = false;
        this.plans = {
            basic: {
                monthly: 10,
                yearly: 96, // 10 * 12 * 0.8 (20% discount)
                jobs: 3,
                features: ['standart_gorsunus', 'esas_axtaris']
            },
            pro: {
                monthly: 25,
                yearly: 240, // 25 * 12 * 0.8
                jobs: 10,
                features: ['standart_gorsunus', 'esas_axtaris', '5_sekil', 'logo', 'ust_siralar']
            },
            premium: {
                monthly: 50,
                yearly: 480, // 50 * 12 * 0.8
                jobs: 'limitsiz',
                features: ['premium_gorsunus', 'esas_axtaris', '10_sekil', 'logo', 'ust_siralar', 'esas_reklam']
            }
        };
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updatePrices();
        console.log('💰 Pricing system initialized');
    }

    loadUserData() {
        // Get current user from auth system or localStorage
        if (window.authSystem && window.authSystem.currentUser) {
            this.currentUser = window.authSystem.currentUser;
        } else {
            const userData = localStorage.getItem('biznet_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        }

        if (!this.currentUser) {
            // window.location.href = 'login.html';
            return;
        }

        this.updateUI();
    }

    updateUI() {
        // Update user info in navbar
        const userName = document.getElementById('userName');
        const avatarImg = document.getElementById('avatarImg');
        
        if (userName) {
            userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }
        
        if (avatarImg && this.currentUser.avatar) {
            avatarImg.src = this.currentUser.avatar;
        }

        // Show current plan if user has subscription
        this.showCurrentPlan();
    }

    setupEventListeners() {
        // Billing toggle
        const billingToggle = document.getElementById('yearlyBilling');
        if (billingToggle) {
            billingToggle.addEventListener('change', (e) => {
                this.isYearlyBilling = e.target.checked;
                this.updatePrices();
            });
        }

        // FAQ accordion
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                this.toggleFAQ(question);
            });
        });

        // Modal close
        const modalClose = document.querySelectorAll('.modal-close');
        modalClose.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Window click for modal
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Card number formatting
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                this.formatCardNumber(e.target);
            });
        }

        // Expiry date formatting
        const expiryDate = document.getElementById('expiryDate');
        if (expiryDate) {
            expiryDate.addEventListener('input', (e) => {
                this.formatExpiryDate(e.target);
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    updatePrices() {
        // Update all plan prices based on billing cycle
        Object.keys(this.plans).forEach(plan => {
            const priceElement = document.getElementById(`${plan}Price`);
            if (priceElement) {
                const price = this.isYearlyBilling ? this.plans[plan].yearly : this.plans[plan].monthly;
                priceElement.textContent = price;
            }
        });
    }

    selectPlan(plan) {
        this.selectedPlan = plan;
        
        // Check if user is logged in
        if (!this.currentUser) {
            this.showNotification('Zəhmət olmasa əvvəlcə daxil olun', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }

        // Check if user already has this plan
        if (this.currentUser.subscription?.plan === plan && this.currentUser.subscription?.active) {
            this.showNotification('Siz artıq bu plana abunəsiniz', 'info');
            return;
        }

        this.showPaymentModal();
    }

    showPaymentModal() {
        const modal = document.getElementById('paymentModal');
        const planInfo = document.getElementById('selectedPlanInfo');
        
        if (modal && planInfo) {
            const planData = this.plans[this.selectedPlan];
            const price = this.isYearlyBilling ? planData.yearly : planData.monthly;
            const period = this.isYearlyBilling ? 'il' : 'ay';
            
            planInfo.innerHTML = `
                <div class="plan-summary">${this.getPlanName(this.selectedPlan)} Planı</div>
                <div class="plan-price-summary">${price} AZN</div>
                <div class="plan-period">${this.isYearlyBilling ? '12 aylıq abunəlik' : '1 aylıq abunəlik'}</div>
            `;

            // Update payment summary
            document.getElementById('summaryPlan').textContent = this.getPlanName(this.selectedPlan);
            document.getElementById('summaryPeriod').textContent = this.isYearlyBilling ? '1 il' : '1 ay';
            document.getElementById('summaryTotal').textContent = `${price} AZN`;

            modal.style.display = 'block';
        }
    }

    closeModal() {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.style.display = 'none';
            // Reset form
            document.getElementById('paymentForm').reset();
        }
    }

    async processPayment() {
        const form = document.getElementById('paymentForm');
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardHolder = document.getElementById('cardHolder').value;

        // Validation
        if (!this.validatePaymentForm(cardNumber, expiryDate, cvv, cardHolder)) {
            return;
        }

        // Show loading
        this.setLoading(true);

        try {
            // Simulate payment processing
            await this.simulatePayment();

            // Activate subscription
            this.activateSubscription();

            this.showNotification('Abunəlik uğurla aktivləşdirildi!', 'success');
            this.closeModal();

            // Redirect to profile
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 2000);

        } catch (error) {
            this.showNotification('Ödəniş zamanı xəta baş verdi: ' + error.message, 'error');
            this.setLoading(false);
        }
    }

    validatePaymentForm(cardNumber, expiryDate, cvv, cardHolder) {
        let isValid = true;
        this.clearErrors();

        // Card number validation (simple Luhn check)
        if (!cardNumber || cardNumber.length !== 16 || !this.luhnCheck(cardNumber)) {
            this.showError('cardNumber', 'Düzgün kart nömrəsi daxil edin');
            isValid = false;
        }

        // Expiry date validation
        if (!expiryDate || !this.validateExpiryDate(expiryDate)) {
            this.showError('expiryDate', 'Düzgün son istifadə tarixi daxil edin');
            isValid = false;
        }

        // CVV validation
        if (!cvv || cvv.length !== 3 || !/^\d+$/.test(cvv)) {
            this.showError('cvv', 'Düzgün CVV daxil edin');
            isValid = false;
        }

        // Card holder validation
        if (!cardHolder || cardHolder.trim().length < 3) {
            this.showError('cardHolder', 'Kart sahibinin adını daxil edin');
            isValid = false;
        }

        return isValid;
    }

    luhnCheck(cardNumber) {
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    validateExpiryDate(expiryDate) {
        const [month, year] = expiryDate.split('/');
        if (!month || !year || month.length !== 2 || year.length !== 2) {
            return false;
        }

        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        const expMonth = parseInt(month);
        const expYear = parseInt(year);

        if (expMonth < 1 || expMonth > 12) {
            return false;
        }

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return false;
        }

        return true;
    }

    simulatePayment() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure
                const isSuccess = Math.random() > 0.1; // 90% success rate
                
                if (isSuccess) {
                    resolve();
                } else {
                    reject(new Error('Kartınızdan ödəniş alınmadı. Zəhmət olmasa kart məlumatlarını yoxlayın.'));
                }
            }, 2000);
        });
    }

    activateSubscription() {
        const planData = this.plans[this.selectedPlan];
        const price = this.isYearlyBilling ? planData.yearly : planData.monthly;
        
        const subscription = {
            plan: this.selectedPlan,
            active: true,
            price: price,
            jobsLimit: planData.jobs,
            features: planData.features,
            startDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + (this.isYearlyBilling ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
            billing: this.isYearlyBilling ? 'yearly' : 'monthly'
        };

        // Update user in localStorage
        const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].subscription = subscription;
            localStorage.setItem('biznet_users', JSON.stringify(users));
        }

        // Update current user
        this.currentUser.subscription = subscription;
        localStorage.setItem('biznet_user', JSON.stringify(this.currentUser));

        // Update auth system if exists
        if (window.authSystem) {
            window.authSystem.currentUser = this.currentUser;
        }
    }

    showCurrentPlan() {
        if (this.currentUser.subscription?.active) {
            const currentPlan = this.currentUser.subscription.plan;
            const planCards = document.querySelectorAll('.plan-card');
            
            planCards.forEach(card => {
                if (card.classList.contains(currentPlan)) {
                    const button = card.querySelector('.plan-btn');
                    if (button) {
                        button.textContent = 'Cari Plan';
                        button.disabled = true;
                        button.style.background = '#28a745';
                    }
                }
            });
        }
    }

    toggleFAQ(question) {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    }

    startFreeTrial() {
        if (!this.currentUser) {
            this.showNotification('Zəhmət olmasa əvvəlcə daxil olun', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }

        // Check if user already used free trial
        if (this.currentUser.usedFreeTrial) {
            this.showNotification('Siz artıq pulsuz sınaq müddətindən istifadə etmisiniz', 'info');
            return;
        }

        // Activate free trial
        const trialSubscription = {
            plan: 'trial',
            active: true,
            price: 0,
            jobsLimit: 3,
            features: ['standart_gorsunus', 'esas_axtaris', '3_sekil'],
            startDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            isTrial: true
        };

        // Update user
        const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].subscription = trialSubscription;
            users[userIndex].usedFreeTrial = true;
            localStorage.setItem('biznet_users', JSON.stringify(users));
        }

        this.currentUser.subscription = trialSubscription;
        this.currentUser.usedFreeTrial = true;
        localStorage.setItem('biznet_user', JSON.stringify(this.currentUser));

        this.showNotification('7 günlük pulsuz sınaq müddəti aktivləşdirildi!', 'success');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    }

    // Utility methods
    getPlanName(plan) {
        const names = {
            'basic': 'Basic',
            'pro': 'Pro',
            'premium': 'Premium'
        };
        return names[plan] || plan;
    }

    formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
        
        // Add spaces every 4 characters
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        
        // Limit to 19 characters (16 digits + 3 spaces)
        value = value.substring(0, 19);
        
        input.value = value;
    }

    formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        input.value = value;
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '#dc3545';
            
            let errorElement = field.parentNode.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
            errorElement.style.color = '#dc3545';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '5px';
        }
    }

    clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.remove());
        
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }

    setLoading(loading) {
        const submitBtn = document.querySelector('.modal-footer .btn-primary');
        if (submitBtn) {
            if (loading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ödəniş Edilir...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-lock"></i> Təhlükəsiz Ödəniş Et';
            }
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        return colors[type] || colors.info;
    }

    logout() {
        if (window.authSystem) {
            window.authSystem.handleLogout();
        } else {
            localStorage.removeItem('biznet_user');
            sessionStorage.removeItem('biznet_user');
            window.location.href = 'login.html';
        }
    }
}

// Global functions
function selectPlan(plan) {
    if (window.pricingSystem) {
        window.pricingSystem.selectPlan(plan);
    }
}

function processPayment() {
    if (window.pricingSystem) {
        window.pricingSystem.processPayment();
    }
}

function startFreeTrial() {
    if (window.pricingSystem) {
        window.pricingSystem.startFreeTrial();
    }
}

// Initialize system
document.addEventListener('DOMContentLoaded', () => {
    window.pricingSystem = new PricingSystem();
});