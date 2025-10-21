/* Backend adapter snippet - auto-inserted
   If APP_CONFIG.BACKEND_ENABLED is true, use API.* to call backend, otherwise fallback to localStorage logic.
*/
if (typeof window.APP_CONFIG === 'undefined') {
  window.APP_CONFIG = { BACKEND_ENABLED: false, API_BASE: "/api", COMMISSION_RATE: 0.15 };
}
if (window.APP_CONFIG.BACKEND_ENABLED && typeof window.API === 'undefined') {
  console.warn("APP_CONFIG.BACKEND_ENABLED=true but API wrapper not loaded. Please include api.js after config.js");
}

// register.js - Gelişmiş Kullanıcı Kayıt Sistemi

class RegisterSystem {
    constructor() {
        this.currentUserType = 'freelancer';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupUserTypeSelection();
        this.setupPasswordStrength();
        console.log('📝 Register system initialized');
    }

    setupEventListeners() {
        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(registerForm);
            });
        }

        // Password toggle
        const togglePassword = document.getElementById('togglePassword');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility('password');
            });
        }
        
        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', () => {
                this.togglePasswordVisibility('confirmPassword');
            });
        }

        // Phone input formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        }

        // Password strength check
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }

        // Real-time validation
        this.setupRealTimeValidation();
    }

    setupUserTypeSelection() {
        const userTypeTabs = document.querySelectorAll('.user-type-tab');
        const userTypeInfo = document.getElementById('userTypeInfo');
        const businessFields = document.getElementById('businessFields');
        const freelancerFields = document.getElementById('freelancerFields');

        const userTypeData = {
            freelancer: {
                icon: '💼',
                title: 'Freelancer Qeydiyyatı',
                description: 'Xidmətlərinizi təqdim edin, layihələr qazanın və qazanc əldə edin'
            },
            business: {
                icon: '🏢',
                title: 'Biznes Qeydiyyatı',
                description: 'Şirkətiniz üçün işçi tapın, elanlar yerləşdirin və biznesinizi inkişaf etdirin'
            },
            client: {
                icon: '👥',
                title: 'Müştəri Qeydiyyatı',
                description: 'Xidmət alın, freelancerlarla əlaqə saxlayın və layihələrə start verin'
            }
        };

        userTypeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                userTypeTabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Update current user type
                this.currentUserType = tab.dataset.userType;
                
                // Update info display
                const data = userTypeData[this.currentUserType];
                if (userTypeInfo && data) {
                    userTypeInfo.innerHTML = `
                        <div class="info-icon">${data.icon}</div>
                        <div class="info-content">
                            <h4>${data.title}</h4>
                            <p>${data.description}</p>
                        </div>
                    `;
                }

                // Show/hide specific fields
                this.toggleUserTypeFields();
            });
        });
    }

    toggleUserTypeFields() {
        const businessFields = document.getElementById('businessFields');
        const freelancerFields = document.getElementById('freelancerFields');
        const companyName = document.getElementById('companyName');
        const profession = document.getElementById('profession');

        // Reset required fields
        if (companyName) companyName.required = false;
        if (profession) profession.required = false;

        switch(this.currentUserType) {
            case 'business':
                if (businessFields) businessFields.style.display = 'block';
                if (freelancerFields) freelancerFields.style.display = 'none';
                if (companyName) companyName.required = true;
                break;
            case 'freelancer':
                if (businessFields) businessFields.style.display = 'none';
                if (freelancerFields) freelancerFields.style.display = 'block';
                if (profession) profession.required = true;
                break;
            case 'client':
                if (businessFields) businessFields.style.display = 'none';
                if (freelancerFields) freelancerFields.style.display = 'none';
                break;
        }
    }

    setupPasswordStrength() {
        this.passwordStrength = {
            weak: { class: 'weak', text: 'Zəif', width: '25%' },
            medium: { class: 'medium', text: 'Orta', width: '50%' },
            strong: { class: 'strong', text: 'Güclü', width: '75%' },
            veryStrong: { class: 'very-strong', text: 'Çox güclü', width: '100%' }
        };
    }

    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (!password) {
            strengthFill.style.width = '0%';
            strengthText.textContent = '';
            return;
        }

        let score = 0;
        
        // Length check
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        
        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^a-zA-Z0-9]/.test(password)) score += 1;

        let strength;
        if (score <= 2) {
            strength = this.passwordStrength.weak;
        } else if (score <= 4) {
            strength = this.passwordStrength.medium;
        } else if (score <= 5) {
            strength = this.passwordStrength.strong;
        } else {
            strength = this.passwordStrength.veryStrong;
        }

        strengthFill.style.width = strength.width;
        strengthFill.className = `strength-fill ${strength.class}`;
        strengthText.textContent = strength.text;
        strengthText.className = `strength-text ${strength.class}`;
    }

    setupRealTimeValidation() {
        // Email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                this.validateEmail(emailInput.value);
            });
        }

        // Password confirmation
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword) {
            confirmPassword.addEventListener('blur', () => {
                this.validatePasswordMatch();
            });
        }

        // Phone validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                this.validatePhone(phoneInput.value);
            });
        }
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            userType: this.currentUserType,
            agreeTerms: formData.get('agreeTerms') === 'on',
            newsletter: formData.get('newsletter') === 'on',
            profession: formData.get('profession'),
            experience: formData.get('experience'),
            companyName: formData.get('companyName'),
            companyType: formData.get('companyType')
        };

        // Validation
        if (!this.validateRegisterForm(userData)) {
            return;
        }

        // Show loading state
        this.setFormLoading(true);

        try {
            // Check if user already exists
            if (await this.userExists(userData.email)) {
                throw new Error('Bu email ünvanı ilə artıq qeydiyyatdan keçilib');
            }

            // Create user
            const user = await this.createUser(userData);
            
            // Save user
            this.saveUser(user);
            
            // Show success message
            this.showNotification('Hesab uğurla yaradıldı!', 'success');
            
            // Redirect based on user type
            setTimeout(() => {
                this.redirectAfterRegister(user);
            }, 2000);

        } catch (error) {
            this.showNotification(error.message, 'error');
            this.setFormLoading(false);
        }
    }

    validateRegisterForm(data) {
        let isValid = true;

        // Clear previous errors
        this.clearErrors();

        // First name validation
        if (!data.firstName || data.firstName.trim().length < 2) {
            this.showError('firstName', 'Ad ən azı 2 simvol olmalıdır');
            isValid = false;
        }

        // Last name validation
        if (!data.lastName || data.lastName.trim().length < 2) {
            this.showError('lastName', 'Soyad ən azı 2 simvol olmalıdır');
            isValid = false;
        }

        // Email validation
        if (!data.email) {
            this.showError('email', 'Email ünvanı mütləqdir');
            isValid = false;
        } else if (!this.isValidEmail(data.email)) {
            this.showError('email', 'Düzgün email ünvanı daxil edin');
            isValid = false;
        }

        // Phone validation
        if (!data.phone) {
            this.showError('phone', 'Telefon nömrəsi mütləqdir');
            isValid = false;
        } else if (!this.isValidPhone(data.phone)) {
            this.showError('phone', 'Düzgün telefon nömrəsi daxil edin');
            isValid = false;
        }

        // Password validation
        if (!data.password) {
            this.showError('password', 'Şifrə mütləqdir');
            isValid = false;
        } else if (data.password.length < 6) {
            this.showError('password', 'Şifrə ən azı 6 simvol olmalıdır');
            isValid = false;
        }

        // Password confirmation
        if (data.password !== data.confirmPassword) {
            this.showError('confirmPassword', 'Şifrələr uyğun gəlmir');
            isValid = false;
        }

        // Terms agreement
        if (!data.agreeTerms) {
            this.showError('terms', 'İstifadəçi razılaşmasını qəbul etməlisiniz');
            isValid = false;
        }

        // User type specific validations
        if (data.userType === 'business' && !data.companyName) {
            this.showError('companyName', 'Şirkət adı mütləqdir');
            isValid = false;
        }

        if (data.userType === 'freelancer' && !data.profession) {
            this.showError('profession', 'İxtisas seçməlisiniz');
            isValid = false;
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Basic phone validation for Azerbaijan
        const phoneRegex = /^\+994\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.startsWith('994')) {
            value = '+' + value;
        } else if (!value.startsWith('+994')) {
            value = '+994' + value;
        }

        // Format: +994 __ ___ __ __
        if (value.length > 4) value = value.slice(0, 4) + ' ' + value.slice(4);
        if (value.length > 7) value = value.slice(0, 7) + ' ' + value.slice(7);
        if (value.length > 11) value = value.slice(0, 11) + ' ' + value.slice(11);
        if (value.length > 14) value = value.slice(0, 14) + ' ' + value.slice(14);

        input.value = value;
    }

    validateEmail(email) {
        if (!email) return true;
        
        if (!this.isValidEmail(email)) {
            this.showError('email', 'Düzgün email ünvanı daxil edin');
            return false;
        }
        
        this.clearError('email');
        return true;
    }

    validatePhone(phone) {
        if (!phone) return true;
        
        if (!this.isValidPhone(phone)) {
            this.showError('phone', 'Düzgün telefon nömrəsi daxil edin');
            return false;
        }
        
        this.clearError('phone');
        return true;
    }

    validatePasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password && confirmPassword && password !== confirmPassword) {
            this.showError('confirmPassword', 'Şifrələr uyğun gəlmir');
            return false;
        }
        
        this.clearError('confirmPassword');
        return true;
    }

    showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement && inputElement) {
            errorElement.textContent = message;
            inputElement.classList.add('error');
        }
    }

    clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement && inputElement) {
            errorElement.textContent = '';
            inputElement.classList.remove('error');
        }
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('.form-group input, .form-group select');
        
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        inputElements.forEach(input => {
            input.classList.remove('error');
        });
    }

    setFormLoading(loading) {
        const submitBtn = document.querySelector('.auth-submit-btn');
        if (!submitBtn) return;

        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const form = document.getElementById('registerForm');

        if (loading) {
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'block';
            if (form) form.classList.add('form-loading');
        } else {
            submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'block';
            if (btnLoader) btnLoader.style.display = 'none';
            if (form) form.classList.remove('form-loading');
        }
    }

    async userExists(email) {
        // Check if user exists in localStorage
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
                const existingUser = users.find(user => user.email === email);
                resolve(!!existingUser);
            }, 500);
        });
    }

    async createUser(userData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = {
                    id: Date.now(),
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password, // In real app, this should be hashed
                    userType: userData.userType,
                    loggedIn: true,
                    subscription: userData.userType === 'business' ? { 
                        plan: 'none', 
                        active: false,
                        expiresAt: null
                    } : null,
                    balance: 0,
                    joinDate: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    profileComplete: false,
                    newsletter: userData.newsletter,
                    profession: userData.profession,
                    experience: userData.experience,
                    companyName: userData.companyName,
                    companyType: userData.companyType
                };

                // Save to users list
                const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
                users.push(user);
                localStorage.setItem('biznet_users', JSON.stringify(users));

                resolve(user);
            }, 1000);
        });
    }

    saveUser(user) {
        // Save as current user (without password)
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        
        localStorage.setItem('biznet_user', JSON.stringify(userWithoutPassword));
        
        // Update global auth system if exists
        if (window.authSystem) {
            window.authSystem.currentUser = userWithoutPassword;
            window.authSystem.updateUI();
        }
    }

    redirectAfterRegister(user) {
        switch(user.userType) {
            case 'freelancer':
                window.location.href = 'profile.html?setup=true';
                break;
            case 'business':
                window.location.href = user.subscription?.active ? 'post-job.html' : 'pricing.html';
                break;
            case 'client':
                window.location.href = 'jobs.html';
                break;
            default:
                window.location.href = 'profile.html?setup=true';
        }
    }

    togglePasswordVisibility(fieldId) {
        const input = document.getElementById(fieldId);
        const toggleBtn = document.getElementById('toggle' + fieldId.charAt(0).toUpperCase() + fieldId.slice(1));
        
        if (input && toggleBtn) {
            if (input.type === 'password') {
                input.type = 'text';
                toggleBtn.textContent = '🔒';
            } else {
                input.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        // Close on click
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }
}

// Social register function
function socialRegister(provider) {
    if (window.registerSystem) {
        window.registerSystem.showNotification(`${provider} ilə qeydiyyat hazırlanır...`, 'info');
    }
    
    // Simulate social registration
    setTimeout(() => {
        const socialUser = {
            id: Date.now(),
            email: `user_${Date.now()}@${provider}.com`,
            firstName: 'Social',
            lastName: 'User',
            userType: window.registerSystem?.currentUserType || 'freelancer',
            loggedIn: true,
            socialProvider: provider,
            joinDate: new Date().toISOString(),
            profileComplete: false
        };
        
        if (window.registerSystem) {
            window.registerSystem.saveUser(socialUser);
            window.registerSystem.showNotification(`${provider} ilə uğurla qeydiyyat olundu!`, 'success');
            
            setTimeout(() => {
                window.location.href = 'profile.html?setup=true';
            }, 1000);
        }
    }, 2000);
}

// Initialize register system
document.addEventListener('DOMContentLoaded', () => {
    window.registerSystem = new RegisterSystem();
});

// Add CSS animations for notifications
const notificationStyles = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.notification {
    font-family: Arial, sans-serif;
}

.notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    margin-left: 10px;
}

.form-loading {
    opacity: 0.7;
    pointer-events: none;
}

.btn-loader {
    display: none;
}

.strength-fill {
    height: 4px;
    border-radius: 2px;
    transition: all 0.3s ease;
}

.strength-fill.weak { background: #f44336; }
.strength-fill.medium { background: #ff9800; }
.strength-fill.strong { background: #4CAF50; }
.strength-fill.very-strong { background: #2196F3; }

.strength-text.weak { color: #f44336; }
.strength-text.medium { color: #ff9800; }
.strength-text.strong { color: #4CAF50; }
.strength-text.very-strong { color: #2196F3; }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);