/* Backend adapter snippet - auto-inserted
   If APP_CONFIG.BACKEND_ENABLED is true, use API.* to call backend, otherwise fallback to localStorage logic.
*/
if (typeof window.APP_CONFIG === 'undefined') {
  window.APP_CONFIG = { BACKEND_ENABLED: false, API_BASE: "/api", COMMISSION_RATE: 0.15 };
}
if (window.APP_CONFIG.BACKEND_ENABLED && typeof window.API === 'undefined') {
  console.warn("APP_CONFIG.BACKEND_ENABLED=true but API wrapper not loaded. Please include api.js after config.js");
}

// balance.js - Balans İdarəetmə Sistemi

class BalanceSystem {
    constructor() {
        this.currentUser = null;
        this.selectedAmount = 0;
        this.selectedMethod = null;
        this.selectedMethodType = null;
        this.transactions = [];
        this.paymentMethods = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadBalanceData();
        this.loadPaymentMethods();
        this.loadTransactions();
        console.log('💰 Balance system initialized');
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
            window.location.href = 'login.html';
            return;
        }

        this.updateUI();
    }

    updateUI() {
        // Update user info in navbar
        document.getElementById('userName').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        
        const avatarImg = document.getElementById('avatarImg');
        if (avatarImg && this.currentUser.avatar) {
            avatarImg.src = this.currentUser.avatar;
        }
    }

    setupEventListeners() {
        // Amount options
        const amountOptions = document.querySelectorAll('.amount-option');
        amountOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectAmountOption(e.target);
            });
        });

        // Custom amount input
        const customAmount = document.getElementById('customAmount');
        if (customAmount) {
            customAmount.addEventListener('input', (e) => {
                this.handleCustomAmount(e.target.value);
            });
        }

        // Withdraw amount input
        const withdrawAmount = document.getElementById('withdrawAmount');
        if (withdrawAmount) {
            withdrawAmount.addEventListener('input', (e) => {
                this.handleWithdrawAmount(e.target.value);
            });
        }

        // Method type selection
        const methodTypes = document.querySelectorAll('.method-type-card');
        methodTypes.forEach(type => {
            type.addEventListener('click', (e) => {
                this.selectMethodType(e.currentTarget);
            });
        });

        // Modal close buttons
        const modalClose = document.querySelectorAll('.modal-close');
        modalClose.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Save method button
        const saveMethodBtn = document.getElementById('saveMethodBtn');
        if (saveMethodBtn) {
            saveMethodBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.savePaymentMethod();
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

        // Window click for modals
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });

        // Card number formatting
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                this.formatCardNumber(e.target);
            });
        }

        // Card expiry formatting
        const cardExpiry = document.getElementById('cardExpiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                this.formatExpiryDate(e.target);
            });
        }

        // Phone number formatting
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        });
    }

    loadBalanceData() {
        // Load balance from user data or initialize
        if (!this.currentUser.balance) {
            this.currentUser.balance = {
                current: 0,
                totalIncome: 0,
                totalExpense: 0,
                totalTransactions: 0
            };
        }

        this.updateBalanceDisplay();
    }

    updateBalanceDisplay() {
        document.getElementById('currentBalance').textContent = 
            this.currentUser.balance.current.toFixed(2);
        
        document.getElementById('totalIncome').textContent = 
            this.currentUser.balance.totalIncome.toFixed(2) + ' AZN';
        
        document.getElementById('totalExpense').textContent = 
            this.currentUser.balance.totalExpense.toFixed(2) + ' AZN';
        
        document.getElementById('totalTransactions').textContent = 
            this.currentUser.balance.totalTransactions;
    }

    loadPaymentMethods() {
        // Load payment methods from localStorage
        const savedMethods = localStorage.getItem(`biznet_payment_methods_${this.currentUser.id}`);
        
        if (savedMethods) {
            this.paymentMethods = JSON.parse(savedMethods);
        } else {
            // Create sample payment methods
            this.paymentMethods = this.createSamplePaymentMethods();
            this.savePaymentMethods();
        }

        this.renderPaymentMethods();
        this.renderFundingMethods();
        this.renderWithdrawMethods();
    }

    createSamplePaymentMethods() {
        return [
            {
                id: 1,
                type: 'card',
                name: 'Bank Kartı',
                details: '**** **** **** 1234',
                isDefault: true,
                icon: 'fas fa-credit-card'
            },
            {
                id: 2,
                type: 'portmanat',
                name: 'Portmanat',
                details: '+994 55 *** ** 45',
                isDefault: false,
                icon: 'fas fa-mobile-alt'
            }
        ];
    }

    renderPaymentMethods() {
        const methodsList = document.getElementById('paymentMethodsList');
        if (!methodsList) return;

        if (this.paymentMethods.length === 0) {
            methodsList.innerHTML = `
                <div class="no-methods">
                    <p>Heç bir ödəniş üsulu əlavə etməmisiniz</p>
                </div>
            `;
            return;
        }

        methodsList.innerHTML = this.paymentMethods.map(method => `
            <div class="method-item">
                <div class="method-info">
                    <div class="method-icon">
                        <i class="${method.icon}"></i>
                    </div>
                    <div class="method-details">
                        <h4>${method.name}</h4>
                        <span>${method.details}</span>
                    </div>
                </div>
                <div class="method-actions">
                    ${method.isDefault ? `
                        <span class="default-badge">Əsas</span>
                    ` : `
                        <button class="method-action-btn" onclick="balanceSystem.setDefaultMethod(${method.id})" title="Əsas et">
                            <i class="fas fa-star"></i>
                        </button>
                    `}
                    <button class="method-action-btn delete" onclick="balanceSystem.deletePaymentMethod(${method.id})" title="Sil">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderFundingMethods() {
        const fundingMethods = document.getElementById('fundingMethods');
        if (!fundingMethods) return;

        fundingMethods.innerHTML = this.paymentMethods.map(method => `
            <label class="method-option">
                <input type="radio" name="fundingMethod" value="${method.id}" ${method.isDefault ? 'checked' : ''}>
                <div class="method-option-icon">
                    <i class="${method.icon}"></i>
                </div>
                <div class="method-option-details">
                    <h5>${method.name}</h5>
                    <span>${method.details}</span>
                </div>
            </label>
        `).join('');

        // Add event listeners to method options
        const methodOptions = fundingMethods.querySelectorAll('.method-option');
        methodOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectPaymentMethod(option);
            });
        });
    }

    renderWithdrawMethods() {
        const withdrawMethods = document.getElementById('withdrawMethods');
        if (!withdrawMethods) return;

        // For withdrawal, show only card and bank transfer methods
        const withdrawEligibleMethods = this.paymentMethods.filter(method => 
            method.type === 'card' || method.type === 'bank'
        );

        if (withdrawEligibleMethods.length === 0) {
            withdrawMethods.innerHTML = `
                <div class="no-methods">
                    <p>Çıxarış üçün uyğun ödəniş üsulu yoxdur</p>
                </div>
            `;
            return;
        }

        withdrawMethods.innerHTML = withdrawEligibleMethods.map(method => `
            <label class="method-option">
                <input type="radio" name="withdrawMethod" value="${method.id}" ${method.isDefault ? 'checked' : ''}>
                <div class="method-option-icon">
                    <i class="${method.icon}"></i>
                </div>
                <div class="method-option-details">
                    <h5>${method.name}</h5>
                    <span>${method.details}</span>
                </div>
            </label>
        `).join('');

        // Add event listeners to method options
        const methodOptions = withdrawMethods.querySelectorAll('.method-option');
        methodOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectWithdrawMethod(option);
            });
        });
    }

    loadTransactions() {
        // Load transactions from localStorage
        const savedTransactions = localStorage.getItem(`biznet_transactions_${this.currentUser.id}`);
        
        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
        } else {
            // Create sample transactions
            this.transactions = this.createSampleTransactions();
            this.saveTransactions();
        }

        this.renderTransactions();
    }

    createSampleTransactions() {
        return [
            {
                id: 1,
                type: 'income',
                amount: 150.00,
                description: 'Layihə ödənişi',
                method: 'Bank Kartı',
                status: 'completed',
                date: new Date(Date.now() - 86400000).toISOString(),
                icon: 'fas fa-arrow-down'
            },
            {
                id: 2,
                type: 'expense',
                amount: -25.00,
                description: 'Pro abunəlik',
                method: 'Portmanat',
                status: 'completed',
                date: new Date(Date.now() - 172800000).toISOString(),
                icon: 'fas fa-arrow-up'
            },
            {
                id: 3,
                type: 'withdrawal',
                amount: -100.00,
                description: 'Pul çıxarışı',
                method: 'Bank Kartı',
                status: 'completed',
                date: new Date(Date.now() - 259200000).toISOString(),
                icon: 'fas fa-arrow-up'
            }
        ];
    }

    renderTransactions(filter = 'all') {
        const transactionsList = document.getElementById('transactionsList');
        if (!transactionsList) return;

        let filteredTransactions = this.transactions;
        
        if (filter !== 'all') {
            filteredTransactions = this.transactions.filter(transaction => 
                transaction.type === filter
            );
        }

        if (filteredTransactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="no-transactions">
                    <p>Heç bir əməliyyat tapılmadı</p>
                </div>
            `;
            return;
        }

        transactionsList.innerHTML = filteredTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon ${transaction.type}">
                        <i class="${transaction.icon}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.description}</h4>
                        <span>${this.formatDate(transaction.date)} • ${transaction.method}</span>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                    ${transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)} AZN
                </div>
            </div>
        `).join('');
    }

    // Modal Functions
    showAddFundsModal() {
        const modal = document.getElementById('addFundsModal');
        if (modal) {
            this.resetAddFundsModal();
            modal.style.display = 'block';
        }
    }

    showWithdrawModal() {
        const modal = document.getElementById('withdrawModal');
        if (modal) {
            this.resetWithdrawModal();
            modal.style.display = 'block';
        }
    }

    showAddPaymentMethodModal() {
        const modal = document.getElementById('addPaymentMethodModal');
        if (modal) {
            this.resetAddMethodModal();
            modal.style.display = 'block';
        }
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    resetAddFundsModal() {
        // Reset amount selection
        document.querySelectorAll('.amount-option').forEach(option => {
            option.classList.remove('active');
        });
        document.getElementById('customAmount').value = '';
        this.selectedAmount = 0;
        this.updatePaymentSummary();
    }

    resetWithdrawModal() {
        document.getElementById('withdrawAmount').value = '';
        document.getElementById('availableBalance').textContent = 
            this.currentUser.balance.current.toFixed(2) + ' AZN';
        this.updateWithdrawSummary();
    }

    resetAddMethodModal() {
        document.querySelectorAll('.method-type-card').forEach(card => {
            card.classList.remove('active');
        });
        document.getElementById('paymentMethodForm').style.display = 'none';
        document.getElementById('saveMethodBtn').style.display = 'none';
        this.selectedMethodType = null;
    }

    // Amount Selection
    selectAmountOption(option) {
        // Remove active class from all options
        document.querySelectorAll('.amount-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to selected option
        option.classList.add('active');
        
        // Clear custom amount
        document.getElementById('customAmount').value = '';
        
        // Set selected amount
        this.selectedAmount = parseFloat(option.getAttribute('data-amount'));
        this.updatePaymentSummary();
    }

    handleCustomAmount(amount) {
        // Remove active class from preset options
        document.querySelectorAll('.amount-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        this.selectedAmount = parseFloat(amount) || 0;
        this.updatePaymentSummary();
    }

    handleWithdrawAmount(amount) {
        const withdrawAmount = parseFloat(amount) || 0;
        this.updateWithdrawSummary(withdrawAmount);
    }

    updatePaymentSummary() {
        const amount = this.selectedAmount;
        const fee = amount * 0.015; // 1.5% commission
        const total = amount + fee;

        document.getElementById('summaryAmount').textContent = amount.toFixed(2) + ' AZN';
        document.getElementById('summaryFee').textContent = fee.toFixed(2) + ' AZN';
        document.getElementById('summaryTotal').textContent = total.toFixed(2) + ' AZN';
    }

    updateWithdrawSummary(amount = 0) {
        const fee = amount * 0.01; // 1% commission
        const total = amount - fee;

        document.getElementById('withdrawSummaryAmount').textContent = amount.toFixed(2) + ' AZN';
        document.getElementById('withdrawSummaryFee').textContent = fee.toFixed(2) + ' AZN';
        document.getElementById('withdrawSummaryTotal').textContent = total.toFixed(2) + ' AZN';
    }

    // Payment Method Selection
    selectPaymentMethod(option) {
        document.querySelectorAll('#fundingMethods .method-option').forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        
        const radio = option.querySelector('input[type="radio"]');
        this.selectedMethod = parseInt(radio.value);
    }

    selectWithdrawMethod(option) {
        document.querySelectorAll('#withdrawMethods .method-option').forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        
        const radio = option.querySelector('input[type="radio"]');
        this.selectedMethod = parseInt(radio.value);
    }

    selectMethodType(card) {
        document.querySelectorAll('.method-type-card').forEach(c => {
            c.classList.remove('active');
        });
        card.classList.add('active');
        
        this.selectedMethodType = card.getAttribute('data-type');
        this.showMethodForm(this.selectedMethodType);
    }

    showMethodForm(methodType) {
        const form = document.getElementById('paymentMethodForm');
        const saveBtn = document.getElementById('saveMethodBtn');
        
        // Hide all form sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show selected form section
        const selectedSection = document.querySelector(`.${methodType}-form`);
        if (selectedSection) {
            selectedSection.style.display = 'block';
            form.style.display = 'block';
            saveBtn.style.display = 'flex';
        }
    }

    // Payment Processing
    async processPayment() {
        if (this.selectedAmount <= 0) {
            this.showNotification('Zəhmət olmasa məbləğ seçin', 'error');
            return;
        }

        if (!this.selectedMethod) {
            this.showNotification('Zəhmət olmasa ödəniş üsulu seçin', 'error');
            return;
        }

        const method = this.paymentMethods.find(m => m.id === this.selectedMethod);
        const amount = this.selectedAmount;
        const fee = amount * 0.015;
        const total = amount + fee;

        // Show loading
        this.setLoading(true, 'addFundsModal');

        try {
            // Simulate payment processing
            await this.simulatePaymentProcessing(method, total);

            // Add funds to balance
            this.addFunds(amount);

            // Create transaction record
            this.createTransaction({
                type: 'income',
                amount: amount,
                description: 'Hesaba pul əlavəsi',
                method: method.name,
                status: 'completed'
            });

            this.showNotification('Pul uğurla əlavə edildi!', 'success');
            this.closeModals();

        } catch (error) {
            this.showNotification('Ödəniş zamanı xəta baş verdi: ' + error.message, 'error');
        } finally {
            this.setLoading(false, 'addFundsModal');
        }
    }

    async processWithdrawal() {
        const amountInput = document.getElementById('withdrawAmount');
        const amount = parseFloat(amountInput.value);

        if (!amount || amount < 10) {
            this.showNotification('Minimum çıxarış məbləği 10 AZN-dır', 'error');
            return;
        }

        if (amount > this.currentUser.balance.current) {
            this.showNotification('Balansınız kifayət deyil', 'error');
            return;
        }

        if (!this.selectedMethod) {
            this.showNotification('Zəhmət olmasa çıxarış üsulu seçin', 'error');
            return;
        }

        const method = this.paymentMethods.find(m => m.id === this.selectedMethod);
        const fee = amount * 0.01;
        const netAmount = amount - fee;

        // Show loading
        this.setLoading(true, 'withdrawModal');

        try {
            // Simulate withdrawal processing
            await this.simulateWithdrawalProcessing(method, amount);

            // Deduct from balance
            this.deductFunds(amount);

            // Create transaction record
            this.createTransaction({
                type: 'withdrawal',
                amount: -amount,
                description: 'Pul çıxarışı',
                method: method.name,
                status: 'completed'
            });

            this.showNotification('Çıxarış uğurla tamamlandı! Pul 1-3 iş günü ərzində köçürüləcək.', 'success');
            this.closeModals();

        } catch (error) {
            this.showNotification('Çıxarış zamanı xəta baş verdi: ' + error.message, 'error');
        } finally {
            this.setLoading(false, 'withdrawModal');
        }
    }

    // Payment Method Management
    savePaymentMethod() {
        if (!this.selectedMethodType) {
            this.showNotification('Zəhmət olmasa ödəniş üsulu növü seçin', 'error');
            return;
        }

        let methodData;
        
        switch (this.selectedMethodType) {
            case 'card':
                methodData = this.validateCardForm();
                break;
            case 'portmanat':
                methodData = this.validatePortmanatForm();
                break;
            case 'expresspay':
                methodData = this.validateExpressPayForm();
                break;
            case 'millikart':
                methodData = this.validateMilliKartForm();
                break;
            case 'bank':
                methodData = this.validateBankForm();
                break;
            default:
                this.showNotification('Seçilmiş üsul üçün forma tapılmadı', 'error');
                return;
        }

        if (!methodData) return;

        const newMethod = {
            id: Date.now(),
            type: this.selectedMethodType,
            name: methodData.name,
            details: methodData.details,
            isDefault: this.paymentMethods.length === 0,
            icon: this.getMethodIcon(this.selectedMethodType),
            ...methodData.extraData
        };

        this.paymentMethods.push(newMethod);
        this.savePaymentMethods();
        this.renderPaymentMethods();
        this.renderFundingMethods();
        this.renderWithdrawMethods();

        this.showNotification('Ödəniş üsulu uğurla əlavə edildi!', 'success');
        this.closeModals();
    }

    validateCardForm() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;
        const cardHolder = document.getElementById('cardHolder').value;

        if (!cardNumber || cardNumber.length !== 16) {
            this.showNotification('Düzgün kart nömrəsi daxil edin', 'error');
            return null;
        }

        if (!cardExpiry || !this.validateExpiryDate(cardExpiry)) {
            this.showNotification('Düzgün son istifadə tarixi daxil edin', 'error');
            return null;
        }

        if (!cardCvv || cardCvv.length !== 3) {
            this.showNotification('Düzgün CVV daxil edin', 'error');
            return null;
        }

        if (!cardHolder || cardHolder.trim().length < 3) {
            this.showNotification('Kart sahibinin adını daxil edin', 'error');
            return null;
        }

        return {
            name: 'Bank Kartı',
            details: `**** **** **** ${cardNumber.slice(-4)}`,
            extraData: {
                cardNumber: cardNumber,
                expiryDate: cardExpiry,
                cardHolder: cardHolder.toUpperCase()
            }
        };
    }

    validatePortmanatForm() {
        const operator = document.getElementById('portmanatOperator').value;
        const number = document.getElementById('portmanatNumber').value;

        if (!operator) {
            this.showNotification('Mobil operator seçin', 'error');
            return null;
        }

        if (!number || number.replace(/\D/g, '').length !== 12) {
            this.showNotification('Düzgün mobil nömrə daxil edin', 'error');
            return null;
        }

        const operatorNames = {
            'azercell': 'Azercell',
            'bakcell': 'Bakcell',
            'nar': 'Nar',
            'naxtel': 'Naxtel'
        };

        return {
            name: 'Portmanat',
            details: `${number} (${operatorNames[operator]})`,
            extraData: {
                operator: operator,
                phoneNumber: number
            }
        };
    }

    validateExpressPayForm() {
        const expresspayId = document.getElementById('expresspayId').value;

        if (!expresspayId) {
            this.showNotification('ExpressPay ID daxil edin', 'error');
            return null;
        }

        return {
            name: 'ExpressPay',
            details: `ID: ${expresspayId}`,
            extraData: {
                expresspayId: expresspayId
            }
        };
    }

    validateMilliKartForm() {
        const millikartNumber = document.getElementById('millikartNumber').value;
        const millikartPhone = document.getElementById('millikartPhone').value;

        if (!millikartNumber) {
            this.showNotification('MilliKart nömrəsi daxil edin', 'error');
            return null;
        }

        if (!millikartPhone || millikartPhone.replace(/\D/g, '').length !== 12) {
            this.showNotification('Düzgün əlaqə nömrəsi daxil edin', 'error');
            return null;
        }

        return {
            name: 'MilliKart',
            details: `Kart: ${millikartNumber.slice(-4)}`,
            extraData: {
                cardNumber: millikartNumber,
                phoneNumber: millikartPhone
            }
        };
    }

    validateBankForm() {
        const bankName = document.getElementById('bankName').value;
        const accountNumber = document.getElementById('accountNumber').value;
        const accountHolder = document.getElementById('accountHolder').value;

        if (!bankName) {
            this.showNotification('Bank seçin', 'error');
            return null;
        }

        if (!accountNumber) {
            this.showNotification('Hesab nömrəsi daxil edin', 'error');
            return null;
        }

        if (!accountHolder) {
            this.showNotification('Hesab sahibinin adını daxil edin', 'error');
            return null;
        }

        const bankNames = {
            'accessbank': 'AccessBank',
            'pasha': 'Pasha Bank',
            'kapital': 'Kapital Bank',
            'rabite': 'Rabitə Bankı',
            'other': 'Digər Bank'
        };

        return {
            name: 'Bank Köçürməsi',
            details: `${bankNames[bankName]} - ****${accountNumber.slice(-4)}`,
            extraData: {
                bankName: bankName,
                accountNumber: accountNumber,
                accountHolder: accountHolder
            }
        };
    }

    setDefaultMethod(methodId) {
        this.paymentMethods.forEach(method => {
            method.isDefault = method.id === methodId;
        });
        this.savePaymentMethods();
        this.renderPaymentMethods();
        this.renderFundingMethods();
        this.renderWithdrawMethods();
        this.showNotification('Əsas ödəniş üsulu dəyişdirildi', 'success');
    }

    deletePaymentMethod(methodId) {
        if (this.paymentMethods.length <= 1) {
            this.showNotification('Ən azı bir ödəniş üsulu olmalıdır', 'error');
            return;
        }

        if (confirm('Bu ödəniş üsulunu silmək istədiyinizə əminsiniz?')) {
            this.paymentMethods = this.paymentMethods.filter(method => method.id !== methodId);
            
            // If we deleted the default method, set a new default
            if (!this.paymentMethods.some(method => method.isDefault) && this.paymentMethods.length > 0) {
                this.paymentMethods[0].isDefault = true;
            }
            
            this.savePaymentMethods();
            this.renderPaymentMethods();
            this.renderFundingMethods();
            this.renderWithdrawMethods();
            this.showNotification('Ödəniş üsulu silindi', 'success');
        }
    }

    // Balance Management
    addFunds(amount) {
        this.currentUser.balance.current += amount;
        this.currentUser.balance.totalIncome += amount;
        this.currentUser.balance.totalTransactions++;
        this.saveUserData();
        this.updateBalanceDisplay();
    }

    deductFunds(amount) {
        this.currentUser.balance.current -= amount;
        this.currentUser.balance.totalExpense += amount;
        this.currentUser.balance.totalTransactions++;
        this.saveUserData();
        this.updateBalanceDisplay();
    }

    createTransaction(transactionData) {
        const transaction = {
            id: Date.now(),
            ...transactionData,
            date: new Date().toISOString(),
            icon: this.getTransactionIcon(transactionData.type)
        };

        this.transactions.unshift(transaction);
        this.saveTransactions();
        this.renderTransactions();
    }

    // Utility Methods
    getMethodIcon(methodType) {
        const icons = {
            'card': 'fas fa-credit-card',
            'portmanat': 'fas fa-mobile-alt',
            'expresspay': 'fas fa-bolt',
            'millikart': 'fas fa-credit-card',
            'bank': 'fas fa-university'
        };
        return icons[methodType] || 'fas fa-wallet';
    }

    getTransactionIcon(transactionType) {
        const icons = {
            'income': 'fas fa-arrow-down',
            'expense': 'fas fa-arrow-up',
            'withdrawal': 'fas fa-arrow-up',
            'payment': 'fas fa-credit-card'
        };
        return icons[transactionType] || 'fas fa-exchange-alt';
    }

    formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
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

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.startsWith('994')) {
            value = '+' + value;
        }
        // Format: +994 __ ___ __ __
        if (value.length > 4) value = value.slice(0, 4) + ' ' + value.slice(4);
        if (value.length > 7) value = value.slice(0, 7) + ' ' + value.slice(7);
        if (value.length > 11) value = value.slice(0, 11) + ' ' + value.slice(11);
        if (value.length > 14) value = value.slice(0, 14) + ' ' + value.slice(14);
        input.value = value;
    }

    validateExpiryDate(expiryDate) {
        const [month, year] = expiryDate.split('/');
        if (!month || !year || month.length !== 2 || year.length !== 2) return false;

        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        const expMonth = parseInt(month);
        const expYear = parseInt(year);

        if (expMonth < 1 || expMonth > 12) return false;
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;

        return true;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 86400000) { // 1 day
            return date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
        } else if (diff < 604800000) { // 1 week
            return date.toLocaleDateString('az-AZ', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit' });
        }
    }

    // Simulation Methods
    async simulatePaymentProcessing(method, amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const isSuccess = Math.random() > 0.1; // 90% success rate
                if (isSuccess) {
                    resolve();
                } else {
                    reject(new Error('Ödəniş uğursuz oldu. Zəhmət olmasa kart məlumatlarını yoxlayın.'));
                }
            }, 2000);
        });
    }

    async simulateWithdrawalProcessing(method, amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const isSuccess = Math.random() > 0.05; // 95% success rate
                if (isSuccess) {
                    resolve();
                } else {
                    reject(new Error('Çıxarış uğursuz oldu. Zəhmət olmasa bank məlumatlarını yoxlayın.'));
                }
            }, 3000);
        });
    }

    // Data Persistence
    saveUserData() {
        const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('biznet_users', JSON.stringify(users));
        }
        
        localStorage.setItem('biznet_user', JSON.stringify(this.currentUser));
    }

    savePaymentMethods() {
        localStorage.setItem(`biznet_payment_methods_${this.currentUser.id}`, JSON.stringify(this.paymentMethods));
    }

    saveTransactions() {
        localStorage.setItem(`biznet_transactions_${this.currentUser.id}`, JSON.stringify(this.transactions));
    }

    // UI Helpers
    setLoading(loading, modalId) {
        const modal = document.getElementById(modalId);
        const submitBtn = modal?.querySelector('.btn-primary');
        
        if (submitBtn) {
            if (loading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> İşlənir...';
                modal.classList.add('loading');
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = modalId === 'addFundsModal' ? 
                    '<i class="fas fa-lock"></i> Ödəniş Et' : 
                    '<i class="fas fa-check"></i> Təsdiq et';
                modal.classList.remove('loading');
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

// Global Functions
function filterTransactions() {
    const filter = document.getElementById('transactionFilter').value;
    if (window.balanceSystem) {
        window.balanceSystem.renderTransactions(filter);
    }
}

function exportTransactions() {
    if (window.balanceSystem) {
        // Simple export simulation
        window.balanceSystem.showNotification('Əməliyyatlar export edildi', 'success');
    }
}

function showAddFundsModal() {
    if (window.balanceSystem) {
        window.balanceSystem.showAddFundsModal();
    }
}

function showWithdrawModal() {
    if (window.balanceSystem) {
        window.balanceSystem.showWithdrawModal();
    }
}

function showAddPaymentMethodModal() {
    if (window.balanceSystem) {
        window.balanceSystem.showAddPaymentMethodModal();
    }
}

function processPayment() {
    if (window.balanceSystem) {
        window.balanceSystem.processPayment();
    }
}

function processWithdrawal() {
    if (window.balanceSystem) {
        window.balanceSystem.processWithdrawal();
    }
}

// Initialize system
document.addEventListener('DOMContentLoaded', () => {
    window.balanceSystem = new BalanceSystem();
});