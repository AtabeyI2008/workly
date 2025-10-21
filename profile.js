/* Backend adapter snippet - auto-inserted
   If APP_CONFIG.BACKEND_ENABLED is true, use API.* to call backend, otherwise fallback to localStorage logic.
*/
if (typeof window.APP_CONFIG === 'undefined') {
  window.APP_CONFIG = { BACKEND_ENABLED: false, API_BASE: "/api", COMMISSION_RATE: 0.15 };
}
if (window.APP_CONFIG.BACKEND_ENABLED && typeof window.API === 'undefined') {
  console.warn("APP_CONFIG.BACKEND_ENABLED=true but API wrapper not loaded. Please include api.js after config.js");
}

// profile.js - Profil İdarəetmə Sistemi

class ProfileSystem {
    constructor() {
        this.currentUser = null;
        this.isEditing = false;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.setupTabs();
        this.loadUserContent();
        console.log('👤 Profile system initialized');
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

        this.updateProfileDisplay();
    }

    updateProfileDisplay() {
        // Update avatar
        const avatarImg = document.getElementById('avatarImg');
        const profileAvatar = document.getElementById('profileAvatar');
        if (avatarImg) avatarImg.src = this.currentUser.avatar || '/api/placeholder/40/40';
        if (profileAvatar) profileAvatar.src = this.currentUser.avatar || '/api/placeholder/120/120';

        // Update user info
        document.getElementById('userName').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('profileName').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('profileEmail').textContent = this.currentUser.email;
        document.getElementById('profilePhone').textContent = this.currentUser.phone || 'N/A';
        document.getElementById('profileType').textContent = this.getUserTypeText(this.currentUser.userType);

        // Update form fields
        document.getElementById('firstName').value = this.currentUser.firstName || '';
        document.getElementById('lastName').value = this.currentUser.lastName || '';
        document.getElementById('profileEmailInput').value = this.currentUser.email || '';
        document.getElementById('profilePhoneInput').value = this.currentUser.phone || '';
        document.getElementById('about').value = this.currentUser.about || '';

        // Update user type specific fields
        this.toggleUserTypeFields();
    }

    getUserTypeText(userType) {
        const types = {
            'freelancer': 'Freelancer',
            'business': 'Biznes',
            'client': 'Müştəri'
        };
        return types[userType] || userType;
    }

    toggleUserTypeFields() {
        const freelancerFields = document.getElementById('freelancerFields');
        const businessFields = document.getElementById('businessFields');

        if (this.currentUser.userType === 'freelancer') {
            freelancerFields.style.display = 'block';
            businessFields.style.display = 'none';
            
            // Set freelancer specific fields
            document.getElementById('profession').value = this.currentUser.profession || '';
            document.getElementById('experience').value = this.currentUser.experience || '';
            document.getElementById('dailyRate').value = this.currentUser.dailyRate || '';
            document.getElementById('employment').value = this.currentUser.employment || 'freelance';
        } else if (this.currentUser.userType === 'business') {
            freelancerFields.style.display = 'none';
            businessFields.style.display = 'block';
            
            // Set business specific fields
            document.getElementById('companyName').value = this.currentUser.companyName || '';
            document.getElementById('companyType').value = this.currentUser.companyType || '';
            document.getElementById('companyAbout').value = this.currentUser.companyAbout || '';
        } else {
            freelancerFields.style.display = 'none';
            businessFields.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Personal form
        const personalForm = document.getElementById('personalForm');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePersonalInfo();
            });
        }

        // Edit personal info
        const editPersonalBtn = document.getElementById('editPersonalBtn');
        if (editPersonalBtn) {
            editPersonalBtn.addEventListener('click', () => {
                this.toggleEditMode(true);
            });
        }

        const cancelPersonalBtn = document.getElementById('cancelPersonalBtn');
        if (cancelPersonalBtn) {
            cancelPersonalBtn.addEventListener('click', () => {
                this.toggleEditMode(false);
                this.updateProfileDisplay();
            });
        }

        // Skills
        const addSkillBtn = document.getElementById('addSkillBtn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => {
                this.showSkillForm();
            });
        }

        const skillForm = document.getElementById('skillForm');
        if (skillForm) {
            skillForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addSkill();
            });
        }

        const cancelSkillBtn = document.getElementById('cancelSkillBtn');
        if (cancelSkillBtn) {
            cancelSkillBtn.addEventListener('click', () => {
                this.hideSkillForm();
            });
        }

        // Avatar upload
        const avatarUpload = document.getElementById('avatarUpload');
        if (avatarUpload) {
            avatarUpload.addEventListener('click', () => {
                this.uploadAvatar();
            });
        }

        // Settings
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                this.showPasswordModal();
            });
        }

        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                this.deleteAccount();
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

        // Modal
        const modal = document.getElementById('passwordModal');
        const modalClose = document.querySelectorAll('.modal-close');
        modalClose.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword();
            });
        }
    }

    setupTabs() {
        const navItems = document.querySelectorAll('.nav-item');
        const tabContents = document.querySelectorAll('.tab-content');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                tabContents.forEach(tab => tab.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Show corresponding tab
                const tabId = item.getAttribute('data-tab') + '-tab';
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                    
                    // Load tab specific content
                    this.loadTabContent(item.getAttribute('data-tab'));
                }
            });
        });
    }

    loadTabContent(tabName) {
        switch(tabName) {
            case 'skills':
                this.loadSkills();
                break;
            case 'jobs':
                this.loadJobs();
                break;
            case 'portfolio':
                this.loadPortfolio();
                break;
            case 'reviews':
                this.loadReviews();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    toggleEditMode(editing) {
        this.isEditing = editing;
        const form = document.getElementById('personalForm');
        const inputs = form.querySelectorAll('input, select, textarea');
        const editBtn = document.getElementById('editPersonalBtn');
        const cancelBtn = document.getElementById('cancelPersonalBtn');

        inputs.forEach(input => {
            input.disabled = !editing;
        });

        if (editing) {
            editBtn.style.display = 'none';
            cancelBtn.style.display = 'block';
        } else {
            editBtn.style.display = 'block';
            cancelBtn.style.display = 'none';
        }
    }

    async savePersonalInfo() {
        const formData = new FormData(document.getElementById('personalForm'));
        const updatedData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            about: formData.get('about')
        };

        // User type specific data
        if (this.currentUser.userType === 'freelancer') {
            updatedData.profession = formData.get('profession');
            updatedData.experience = formData.get('experience');
            updatedData.dailyRate = formData.get('dailyRate');
            updatedData.employment = formData.get('employment');
        } else if (this.currentUser.userType === 'business') {
            updatedData.companyName = formData.get('companyName');
            updatedData.companyType = formData.get('companyType');
            updatedData.companyAbout = formData.get('companyAbout');
        }

        try {
            // Update in localStorage
            const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...updatedData };
                localStorage.setItem('biznet_users', JSON.stringify(users));
            }

            // Update current user
            this.currentUser = { ...this.currentUser, ...updatedData };
            localStorage.setItem('biznet_user', JSON.stringify(this.currentUser));

            // Update auth system if exists
            if (window.authSystem) {
                window.authSystem.currentUser = this.currentUser;
                window.authSystem.updateUI();
            }

            this.updateProfileDisplay();
            this.toggleEditMode(false);
            this.showNotification('Məlumatlar uğurla yeniləndi!', 'success');

        } catch (error) {
            this.showNotification('Xəta baş verdi: ' + error.message, 'error');
        }
    }

    // Skills Management
    showSkillForm() {
        document.getElementById('skillForm').style.display = 'block';
        document.getElementById('addSkillBtn').style.display = 'none';
    }

    hideSkillForm() {
        document.getElementById('skillForm').style.display = 'none';
        document.getElementById('addSkillBtn').style.display = 'block';
        document.getElementById('skillForm').reset();
    }

    addSkill() {
        const skillName = document.getElementById('skillName').value.trim();
        const skillLevel = document.getElementById('skillLevel').value;

        if (!skillName) {
            this.showNotification('Bacarıq adı daxil edin', 'error');
            return;
        }

        const skills = this.currentUser.skills || [];
        skills.push({ name: skillName, level: skillLevel });

        this.updateUserSkills(skills);
        this.hideSkillForm();
        this.loadSkills();
    }

    updateUserSkills(skills) {
        this.currentUser.skills = skills;
        
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].skills = skills;
            localStorage.setItem('biznet_users', JSON.stringify(users));
            localStorage.setItem('biznet_user', JSON.stringify(this.currentUser));
        }
    }

    loadSkills() {
        const skillsList = document.getElementById('skillsList');
        if (!skillsList) return;

        const skills = this.currentUser.skills || [];
        
        if (skills.length === 0) {
            skillsList.innerHTML = '<p class="no-data">Hələ ki, heç bir bacarıq əlavə etməmisiniz</p>';
            return;
        }

        skillsList.innerHTML = skills.map(skill => `
            <div class="skill-tag">
                ${skill.name}
                <span class="level">(${this.getSkillLevelText(skill.level)})</span>
                <button class="remove-skill" data-skill="${skill.name}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Add event listeners to remove buttons
        skillsList.querySelectorAll('.remove-skill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const skillName = e.target.closest('.remove-skill').getAttribute('data-skill');
                this.removeSkill(skillName);
            });
        });
    }

    getSkillLevelText(level) {
        const levels = {
            'beginner': 'Yeni başlayan',
            'intermediate': 'Orta',
            'advanced': 'İleri',
            'expert': 'Ekspert'
        };
        return levels[level] || level;
    }

    removeSkill(skillName) {
        const skills = this.currentUser.skills || [];
        const updatedSkills = skills.filter(skill => skill.name !== skillName);
        this.updateUserSkills(updatedSkills);
        this.loadSkills();
    }

    // Jobs Management
    loadJobs() {
        const jobsList = document.getElementById('jobsList');
        if (!jobsList) return;

        // Get user's jobs from localStorage
        const allJobs = JSON.parse(localStorage.getItem('biznet_jobs')) || [];
        const userJobs = allJobs.filter(job => job.userId === this.currentUser.id);

        if (userJobs.length === 0) {
            jobsList.innerHTML = `
                <div class="no-data">
                    <p>Hələ ki, heç bir elan yerləşdirməmisiniz</p>
                    <a href="post-job.html" class="add-btn">İlk elanınızı yerləşdirin</a>
                </div>
            `;
            return;
        }

        jobsList.innerHTML = userJobs.map(job => `
            <div class="job-item">
                <div class="job-header">
                    <h3 class="job-title">${job.title}</h3>
                    <span class="job-status status-${job.status}">${this.getStatusText(job.status)}</span>
                </div>
                <div class="job-meta">
                    <span><i class="fas fa-money-bill-wave"></i> ${job.salary}₼</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-clock"></i> ${new Date(job.createdAt).toLocaleDateString('az-AZ')}</span>
                </div>
                <p class="job-description">${job.description.substring(0, 150)}...</p>
                <div class="job-actions">
                    <button class="action-btn edit" onclick="profileSystem.editJob(${job.id})">Redaktə</button>
                    <button class="action-btn delete" onclick="profileSystem.deleteJob(${job.id})">Sil</button>
                </div>
            </div>
        `).join('');

        // Setup filter buttons
        this.setupJobFilters();
    }

    setupJobFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterJobs(btn.getAttribute('data-status'));
            });
        });
    }

    filterJobs(status) {
        // Implementation for filtering jobs
        console.log('Filtering jobs by:', status);
    }

    getStatusText(status) {
        const statuses = {
            'active': 'Aktiv',
            'pending': 'Gözləyən',
            'completed': 'Tamamlanmış'
        };
        return statuses[status] || status;
    }

    editJob(jobId) {
        window.location.href = `post-job.html?edit=${jobId}`;
    }

    deleteJob(jobId) {
        if (confirm('Bu elanı silmək istədiyinizə əminsiniz?')) {
            const allJobs = JSON.parse(localStorage.getItem('biznet_jobs')) || [];
            const updatedJobs = allJobs.filter(job => job.id !== jobId);
            localStorage.setItem('biznet_jobs', JSON.stringify(updatedJobs));
            this.loadJobs();
            this.showNotification('Elan uğurla silindi', 'success');
        }
    }

    // Portfolio Management
    loadPortfolio() {
        const portfolioGrid = document.getElementById('portfolioGrid');
        if (!portfolioGrid) return;

        const portfolio = this.currentUser.portfolio || [];
        
        if (portfolio.length === 0) {
            portfolioGrid.innerHTML = `
                <div class="no-data">
                    <p>Hələ ki, heç bir portfolio əlavə etməmisiniz</p>
                    <button class="add-btn" onclick="profileSystem.addPortfolioItem()">İlk işinizi əlavə edin</button>
                </div>
            `;
            return;
        }

        portfolioGrid.innerHTML = portfolio.map(item => `
            <div class="portfolio-item">
                <div class="portfolio-image">
                    <i class="fas fa-image fa-3x"></i>
                </div>
                <div class="portfolio-info">
                    <div class="portfolio-title">${item.title}</div>
                    <div class="portfolio-desc">${item.description}</div>
                    <div class="portfolio-actions">
                        <button class="action-btn" onclick="profileSystem.editPortfolioItem('${item.id}')">Redaktə</button>
                        <button class="action-btn delete" onclick="profileSystem.deletePortfolioItem('${item.id}')">Sil</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    addPortfolioItem() {
        // Implementation for adding portfolio item
        this.showNotification('Portfolio əlavə etmə funksionallığı hazırlanır...', 'info');
    }

    // Reviews
    loadReviews() {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        const reviews = this.currentUser.reviews || [];
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p class="no-data">Hələ ki, heç bir rəy almayıbsınız</p>';
            return;
        }

        // Calculate average rating
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        document.getElementById('averageRating').textContent = averageRating.toFixed(1);
        document.getElementById('reviewCount').textContent = `${reviews.length} rəy`;

        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            ${review.reviewerName.charAt(0)}
                        </div>
                        <div>
                            <div class="reviewer-name">${review.reviewerName}</div>
                            <div class="review-date">${new Date(review.date).toLocaleDateString('az-AZ')}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
                <div class="review-text">${review.comment}</div>
            </div>
        `).join('');
    }

    // Settings
    loadSettings() {
        // Load notification settings
        document.getElementById('emailNotifications').checked = this.currentUser.settings?.emailNotifications !== false;
        document.getElementById('smsNotifications').checked = this.currentUser.settings?.smsNotifications || false;
    }

    // Avatar Upload
    uploadAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.processAvatar(file);
            }
        };
        
        input.click();
    }

    processAvatar(file) {
        // Simulate avatar upload
        this.showNotification('Profil şəkli yüklənir...', 'info');
        
        setTimeout(() => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentUser.avatar = e.target.result;
                this.updateProfileDisplay();
                this.showNotification('Profil şəkli uğurla yeniləndi!', 'success');
                
                // Update in localStorage
                const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
                const userIndex = users.findIndex(u => u.id === this.currentUser.id);
                
                if (userIndex !== -1) {
                    users[userIndex].avatar = this.currentUser.avatar;
                    localStorage.setItem('biznet_users', JSON.stringify(users));
                    localStorage.setItem('biznet_user', JSON.stringify(this.currentUser));
                }
            };
            reader.readAsDataURL(file);
        }, 1000);
    }

    // Password Change
    showPasswordModal() {
        document.getElementById('passwordModal').style.display = 'block';
    }

    async changePassword() {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmPassword) {
            this.showNotification('Yeni şifrələr uyğun gəlmir', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showNotification('Şifrə ən azı 6 simvol olmalıdır', 'error');
            return;
        }

        try {
            // Verify old password
            const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
            const user = users.find(u => u.id === this.currentUser.id);
            
            if (user.password !== oldPassword) {
                this.showNotification('Köhnə şifrə yanlışdır', 'error');
                return;
            }

            // Update password
            user.password = newPassword;
            localStorage.setItem('biznet_users', JSON.stringify(users));

            document.getElementById('passwordModal').style.display = 'none';
            document.getElementById('passwordForm').reset();
            this.showNotification('Şifrə uğurla dəyişdirildi!', 'success');

        } catch (error) {
            this.showNotification('Xəta baş verdi: ' + error.message, 'error');
        }
    }

    // Account Deletion
    deleteAccount() {
        if (confirm('Hesabınızı silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz!')) {
            if (prompt('Silinməni təsdiqləmək üçün "SİL" yazın:') === 'SİL') {
                // Remove user from localStorage
                const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
                const updatedUsers = users.filter(u => u.id !== this.currentUser.id);
                localStorage.setItem('biznet_users', JSON.stringify(updatedUsers));
                
                // Clear current user
                localStorage.removeItem('biznet_user');
                sessionStorage.removeItem('biznet_user');
                
                this.showNotification('Hesabınız uğurla silindi', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        }
    }

    // Logout
    logout() {
        if (window.authSystem) {
            window.authSystem.handleLogout();
        } else {
            localStorage.removeItem('biznet_user');
            sessionStorage.removeItem('biznet_user');
            window.location.href = 'login.html';
        }
    }

    // Notification System
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
}

// Initialize profile system
document.addEventListener('DOMContentLoaded', () => {
    window.profileSystem = new ProfileSystem();
});