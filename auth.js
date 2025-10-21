/* Backend adapter snippet - auto-inserted
   If APP_CONFIG.BACKEND_ENABLED is true, use API.* to call backend, otherwise fallback to localStorage logic.
*/
if (typeof window.APP_CONFIG === 'undefined') {
  window.APP_CONFIG = { BACKEND_ENABLED: false, API_BASE: "/api", COMMISSION_RATE: 0.15 };
}
if (window.APP_CONFIG.BACKEND_ENABLED && typeof window.API === 'undefined') {
  console.warn("APP_CONFIG.BACKEND_ENABLED=true but API wrapper not loaded. Please include api.js after config.js");
}

// auth.js - Kullanıcı Giriş ve Kimlik Doğrulama Sistemi

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
        this.updateUI();
        console.log('🔐 Auth system initialized');
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }

        // Logout buttons
        const logoutButtons = document.querySelectorAll('.logout-btn');
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        });

        // Password toggle
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility('password');
            });
        }

        // Remember me functionality
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe) {
            rememberMe.addEventListener('change', (e) => {
                this.setRememberMe(e.target.checked);
            });
        }
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            rememberMe: formData.get('rememberMe') === 'on'
        };

        // Validation
        if (!this.validateLoginForm(loginData)) {
            return;
        }

        // Show loading state
        this.setFormLoading(true);

        try {
            // Authenticate user
            const user = await this.authenticateUser(loginData.email, loginData.password);
            
            if (user) {
                // Login successful
                this.currentUser = user;
                this.saveCurrentUser();
                this.setRememberMe(loginData.rememberMe);
                
                this.showNotification('Uğurla giriş edildi!', 'success');
                
                // Redirect to appropriate page
                setTimeout(() => {
                    this.redirectAfterLogin(user);
                }, 1500);
            } else {
                throw new Error('Email və ya şifrə yanlışdır');
            }

        } catch (error) {
            this.showNotification(error.message, 'error');
            this.setFormLoading(false);
        }
    }

    validateLoginForm(data) {
        let isValid = true;
        this.clearErrors();

        // Email validation
        if (!data.email) {
            this.showError('email', 'Email ünvanı mütləqdir');
            isValid = false;
        } else if (!this.isValidEmail(data.email)) {
            this.showError('email', 'Düzgün email ünvanı daxil edin');
            isValid = false;
        }

        // Password validation
        if (!data.password) {
            this.showError('password', 'Şifrə mütləqdir');
            isValid = false;
        }

        return isValid;
    }

    async authenticateUser(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Get users from localStorage
                const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
                
                // Find user by email
                const user = users.find(u => u.email === email);
                
                if (!user) {
                    reject(new Error('Bu email ünvanı ilə qeydiyyat tapılmadı'));
                    return;
                }

                // Check password (in real app, this should compare hashed passwords)
                if (user.password !== password) {
                    reject(new Error('Şifrə yanlışdır'));
                    return;
                }

                // Update last login
                user.lastLogin = new Date().toISOString();
                user.loggedIn = true;

                // Update user in storage
                const userIndex = users.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                    users[userIndex] = user;
                    localStorage.setItem('biznet_users', JSON.stringify(users));
                }

                resolve(user);
            }, 1000);
        });
    }

    handleLogout() {
        if (this.currentUser) {
            // Update user loggedIn status
            const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex].loggedIn = false;
                localStorage.setItem('biznet_users', JSON.stringify(users));
            }
        }

        // Clear current user
        this.currentUser = null;
        localStorage.removeItem('biznet_user');
        localStorage.removeItem('rememberMe');

        this.showNotification('Uğurla çıxış edildi', 'info');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }

    loadCurrentUser() {
        // Check if user is remembered
        const rememberMe = localStorage.getItem('rememberMe');
        if (rememberMe === 'true') {
            const userData = localStorage.getItem('biznet_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                
                // Update last login time
                this.currentUser.lastLogin = new Date().toISOString();
            }
        } else {
            // Check session
            const sessionUser = sessionStorage.getItem('biznet_user');
            if (sessionUser) {
                this.currentUser = JSON.parse(sessionUser);
            }
        }
    }

    saveCurrentUser() {
        const userData = JSON.stringify(this.currentUser);
        
        if (localStorage.getItem('rememberMe') === 'true') {
            localStorage.setItem('biznet_user', userData);
        } else {
            sessionStorage.setItem('biznet_user', userData);
        }
    }

    setRememberMe(remember) {
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberMe');
            sessionStorage.removeItem('biznet_user');
        }
    }

    updateUI() {
        // Update navigation based on auth status
        const authLinks = document.querySelector('.auth-links');
        const userMenu = document.querySelector('.user-menu');
        const userName = document.querySelector('.user-name');

        if (this.isLoggedIn() && authLinks && userMenu) {
            authLinks.style.display = 'none';
            userMenu.style.display = 'flex';
            
            if (userName && this.currentUser) {
                userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            }
        } else if (authLinks && userMenu) {
            authLinks.style.display = 'flex';
            userMenu.style.display = 'none';
        }

        // Protect routes if needed
        this.protectRoutes();
    }

    isLoggedIn() {
        return this.currentUser !== null && this.currentUser.loggedIn === true;
    }

    protectRoutes() {
        const protectedRoutes = ['profile.html', 'dashboard.html', 'post-job.html'];
        const currentPage = window.location.pathname.split('/').pop();

        if (protectedRoutes.includes(currentPage) && !this.isLoggedIn()) {
            this.showNotification('Bu səhifəyə giriş üçün daxil olmalısınız', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }

        // Redirect to dashboard if user is logged in and tries to access login/register
        if (this.isLoggedIn() && (currentPage === 'login.html' || currentPage === 'register.html')) {
            this.showNotification('Artıq daxil olmusunuz', 'info');
            setTimeout(() => {
                this.redirectAfterLogin(this.currentUser);
            }, 1500);
        }
    }

   redirectAfterLogin(user) {
    switch(user.userType) {
        case 'freelancer':
            window.location.href = 'profile.html';
            break;
        case 'business':
            window.location.href = 'post-job.html';
            break;
        case 'client':
            window.location.href = 'jobs.html';
            break;
        default:
            window.location.href = 'profile.html';
    }
}

    // Utility methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    togglePasswordVisibility(fieldId) {
        const input = document.getElementById(fieldId);
        const toggleBtn = document.getElementById('togglePassword');
        
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

    setFormLoading(loading) {
        const submitBtn = document.querySelector('.auth-submit-btn');
        if (!submitBtn) return;

        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        if (loading) {
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'block';
        } else {
            submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'block';
            if (btnLoader) btnLoader.style.display = 'none';
        }
    }

    showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement && inputElement) {
            errorElement.textContent = message;
            inputElement.classList.add('error');
        }
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('.form-group input');
        
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        inputElements.forEach(input => {
            input.classList.remove('error');
        });
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

    getNotificationColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        return colors[type] || colors.info;
    }

    // User management methods
    getUser() {
        return this.currentUser;
    }

    updateUser(updatedData) {
        if (!this.currentUser) return;

        // Update current user
        this.currentUser = { ...this.currentUser, ...updatedData };
        
        // Update in storage
        const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('biznet_users', JSON.stringify(users));
            this.saveCurrentUser();
        }
    }

    // Password reset functionality
    async requestPasswordReset(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
                const user = users.find(u => u.email === email);
                
                if (user) {
                    // In real app, send email here
                    this.showNotification('Şifrə sıfırlama linki email ünvanınıza göndərildi', 'success');
                    resolve(true);
                } else {
                    this.showNotification('Bu email ünvanı ilə qeydiyyat tapılmadı', 'error');
                    resolve(false);
                }
            }, 1000);
        });
    }
}

// Initialize auth system
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});

// Social login function
function socialLogin(provider) {
    if (window.authSystem) {
        window.authSystem.showNotification(`${provider} ilə giriş edilir...`, 'info');
    }
    
    // Simulate social login
    setTimeout(() => {
        const socialUser = {
            id: Date.now(),
            email: `social_${Date.now()}@${provider}.com`,
            firstName: 'Social',
            lastName: 'User',
            userType: 'freelancer',
            loggedIn: true,
            socialProvider: provider,
            lastLogin: new Date().toISOString(),
            profileComplete: false
        };
        
        if (window.authSystem) {
            window.authSystem.currentUser = socialUser;
            window.authSystem.saveCurrentUser();
            window.authSystem.showNotification(`${provider} ilə uğurla giriş edildi!`, 'success');
            
            setTimeout(() => {
                window.authSystem.redirectAfterLogin(socialUser);
            }, 1000);
        }
    }, 2000);
}

// Global auth check function
function checkAuth() {
    return window.authSystem && window.authSystem.isLoggedIn();
}

// Get current user function
function getCurrentUser() {
    return window.authSystem ? window.authSystem.getUser() : null;
}

// Password reset handler
function handlePasswordReset() {
    const email = prompt('Şifrəni sıfırlamaq üçün email ünvanınızı daxil edin:');
    if (email && window.authSystem) {
        window.authSystem.requestPasswordReset(email);
    }
}