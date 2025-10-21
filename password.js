// Password Recovery System
class PasswordRecovery {
    constructor() {
        this.currentStep = 1;
        this.userEmail = '';
        this.verificationCode = '';
        this.timerInterval = null;
        this.timeLeft = 300; // 5 minutes
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showStep(1);
    }

    setupEventListeners() {
        // Email form submission
        document.getElementById('forgotPasswordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailSubmit();
        });

        // Code verification form
        document.getElementById('verifyCodeForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCodeVerification();
        });

        // New password form
        document.getElementById('newPasswordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordReset();
        });

        // Code input handling
        this.setupCodeInputs();
        
        // Password strength check
        this.setupPasswordStrength();
        
        // Resend code button
        document.getElementById('resendCode')?.addEventListener('click', () => {
            this.resendVerificationCode();
        });
    }

    handleEmailSubmit() {
        const email = document.getElementById('email').value;
        
        if (!this.validateEmail(email)) {
            this.showNotification('Zəhmət olmasa düzgün email ünvanı daxil edin', 'error');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('#forgotPasswordForm button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Göndərilir...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.userEmail = email;
            document.getElementById('userEmail').textContent = email;
            
            this.showNotification('Bərpa kodu email ünvanınıza göndərildi', 'success');
            this.showStep(2);
            this.startTimer();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    handleCodeVerification() {
        const enteredCode = document.getElementById('verificationCode').value;
        
        if (enteredCode.length !== 6) {
            this.showNotification('Zəhmət olmasa 6 rəqəmli kodu daxil edin', 'error');
            return;
        }

        // Simulate code verification
        setTimeout(() => {
            this.showNotification('Kod uğurla təsdiqləndi', 'success');
            this.showStep(3);
            this.stopTimer();
        }, 1500);
    }

    handlePasswordReset() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            this.showNotification('Şifrələr uyğunlaşmır', 'error');
            return;
        }

        if (newPassword.length < 8) {
            this.showNotification('Şifrə ən az 8 simvol olmalıdır', 'error');
            return;
        }

        // Show loading
        const submitBtn = document.querySelector('#newPasswordForm button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Yenilənir...';
        submitBtn.disabled = true;

        // Simulate password reset
        setTimeout(() => {
            this.showStep('success');
            this.showNotification('Şifrəniz uğurla yeniləndi', 'success');
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    setupCodeInputs() {
        const codeInputs = document.querySelectorAll('.code-input');
        
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                // Auto-focus next input
                if (value && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                
                // Update hidden input
                this.updateCodeValue();
                
                // Add filled class
                if (value) {
                    input.classList.add('filled');
                } else {
                    input.classList.remove('filled');
                }
            });
            
            input.addEventListener('keydown', (e) => {
                // Handle backspace
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });
            
            // Prevent non-numeric input
            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
        });
    }

    updateCodeValue() {
        const codeInputs = document.querySelectorAll('.code-input');
        const code = Array.from(codeInputs).map(input => input.value).join('');
        document.getElementById('verificationCode').value = code;
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('newPassword');
        const confirmInput = document.getElementById('confirmPassword');
        
        passwordInput.addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });
        
        confirmInput.addEventListener('input', (e) => {
            this.checkPasswordMatch();
        });
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        
        // Contains numbers
        if (/\d/.test(password)) strength += 1;
        
        // Contains special characters
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
        
        // Contains uppercase and lowercase
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
        
        // Update UI
        const container = document.querySelector('.password-strength');
        container.className = 'password-strength';
        
        if (strength === 0) {
            strengthText.textContent = 'Şifrə gücü: Zəif';
        } else if (strength <= 2) {
            container.classList.add('weak');
            strengthText.textContent = 'Şifrə gücü: Orta';
        } else if (strength === 3) {
            container.classList.add('medium');
            strengthText.textContent = 'Şifrə gücü: Yaxşı';
        } else {
            container.classList.add('strong');
            strengthText.textContent = 'Şifrə gücü: Güclü';
        }
    }

    checkPasswordMatch() {
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const matchElement = document.getElementById('passwordMatch');
        
        if (!password || !confirmPassword) {
            matchElement.classList.remove('visible');
            return;
        }
        
        matchElement.classList.add('visible');
        
        if (password === confirmPassword) {
            matchElement.textContent = 'Şifrələr uyğunlaşır ✓';
            matchElement.className = 'password-match visible matching';
        } else {
            matchElement.textContent = 'Şifrələr uyğunlaşmır ✗';
            matchElement.className = 'password-match visible not-matching';
        }
    }

    startTimer() {
        this.timeLeft = 300; // Reset to 5 minutes
        const timerElement = document.getElementById('timer');
        const resendBtn = document.getElementById('resendCode');
        
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.stopTimer();
                resendBtn.disabled = false;
                resendBtn.textContent = 'Kodu yenidən göndər';
            }
            
            if (this.timeLeft <= 30) {
                timerElement.parentElement.classList.add('expiring');
            }
        }, 1000);
        
        resendBtn.disabled = true;
        resendBtn.textContent = 'Kodu yenidən göndər';
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    resendVerificationCode() {
        // Simulate resend code
        this.showNotification('Yeni bərpa kodu göndərildi', 'success');
        this.startTimer();
        
        // Clear existing code inputs
        document.querySelectorAll('.code-input').forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });
        document.getElementById('verificationCode').value = '';
        
        // Focus first input
        document.querySelector('.code-input').focus();
    }

    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.recovery-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show target step
        const targetStep = document.getElementById(`step${stepNumber}`) || 
                          document.getElementById('successStep');
        targetStep.classList.add('active');
        
        // Update progress steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        
        if (stepNumber !== 'success') {
            document.querySelectorAll('.step').forEach(step => {
                if (parseInt(step.dataset.step) <= stepNumber) {
                    step.classList.add('active');
                }
            });
        }
        
        this.currentStep = stepNumber;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.background = '#10b981';
        } else if (type === 'error') {
            notification.style.background = '#ef4444';
        } else {
            notification.style.background = '#667eea';
        }
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Global function for step navigation
function goToStep(stepNumber) {
    if (window.passwordRecovery) {
        window.passwordRecovery.showStep(stepNumber);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('forgotPasswordForm')) {
        window.passwordRecovery = new PasswordRecovery();
    }
});