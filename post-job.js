/* Backend adapter snippet - auto-inserted
   If APP_CONFIG.BACKEND_ENABLED is true, use API.* to call backend, otherwise fallback to localStorage logic.
*/
if (typeof window.APP_CONFIG === 'undefined') {
  window.APP_CONFIG = { BACKEND_ENABLED: false, API_BASE: "/api", COMMISSION_RATE: 0.15 };
}
if (window.APP_CONFIG.BACKEND_ENABLED && typeof window.API === 'undefined') {
  console.warn("APP_CONFIG.BACKEND_ENABLED=true but API wrapper not loaded. Please include api.js after config.js");
}

// post-job.js - Elan Yerləşdirmə Sistemi

class PostJobSystem {
    constructor() {
        this.currentUser = null;
        this.uploadedImages = [];
        this.requirements = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.setupCategorySubcategories();
        this.setupImageUpload();
        this.checkSubscriptionRequirement();
        console.log('📝 Post job system initialized');
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
        
        // Set default contact info
        document.getElementById('contactName').value = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('contactEmail').value = this.currentUser.email;
        document.getElementById('contactPhone').value = this.currentUser.phone || '';
    }

    setupEventListeners() {
        // Form submission
        const jobForm = document.getElementById('postJobForm');
        if (jobForm) {
            jobForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.previewJob();
            });
        }

        // Price type change
        const priceTypeRadios = document.querySelectorAll('input[name="priceType"]');
        priceTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.togglePriceInputs(e.target.value);
            });
        });

        // Job type change
        const jobTypeRadios = document.querySelectorAll('input[name="jobType"]');
        jobTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.updatePreview();
            });
        });

        // Category change
        const categorySelect = document.getElementById('category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.updateSubcategories(e.target.value);
                this.updatePreview();
            });
        }

        // Real-time preview updates
        const previewInputs = ['jobTitle', 'description', 'location', 'price'];
        previewInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.updatePreview();
                });
            }
        });

        // Modal close
        const modalClose = document.querySelectorAll('.modal-close');
        modalClose.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Editor toolbar
        const toolbarBtns = document.querySelectorAll('.toolbar-btn');
        toolbarBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.execCommand(btn.getAttribute('data-command'));
            });
        });

        // Window click for modal
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    setupCategorySubcategories() {
        this.subcategories = {
            'it': [
                'Veb Development',
                'Mobil Development',
                'Software Development',
                'Data Science',
                'Cybersecurity',
                'DevOps',
                'UI/UX Design'
            ],
            'design': [
                'Qrafik Dizayn',
                'UI/UX Design',
                '3D Modelleme',
                'Video Editing',
                'Fotoşəkilçilik',
                'Animasiya'
            ],
            'marketing': [
                'Digital Marketing',
                'SEO',
                'Sosial Media',
                'Content Marketing',
                'Email Marketing',
                'Marketinq Strateqiyası'
            ],
            'restaurant': [
                'Aşpaz',
                'Ofisiant',
                'Barista',
                'Anbardar',
                'Təmizlik işçisi',
                'Menecer'
            ],
            'retail': [
                'Satış məsləhətçisi',
                'Kassir',
                'Anbar işçisi',
                'Mağaza meneceri',
                'Məhsul təqdimatçısı'
            ],
            'education': [
                'Müəllim',
                'Tutor',
                'Təlimçi',
                'Tədris materialları',
                'Online kurs'
            ],
            'health': [
                'Həkim',
                'Hamşira',
                'Fizioterapevt',
                'Psixoloq',
                'Əczaçı'
            ],
            'other': [
                'Tərcümə',
                'Yazıçılıq',
                'Tədqiqat',
                'Konsaltinq',
                'Digər'
            ]
        };
    }

    updateSubcategories(category) {
        const subcategorySelect = document.getElementById('subcategory');
        if (!subcategorySelect) return;

        // Clear existing options
        subcategorySelect.innerHTML = '<option value="">Seçin</option>';

        // Add new options
        const subcategories = this.subcategories[category] || [];
        subcategories.forEach(subcat => {
            const option = document.createElement('option');
            option.value = subcat.toLowerCase().replace(/\s+/g, '-');
            option.textContent = subcat;
            subcategorySelect.appendChild(option);
        });
    }

    setupImageUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('imageUpload');

        if (uploadArea && fileInput) {
            // Click on upload area
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.background = '#f0f8ff';
                uploadArea.style.borderColor = '#007bff';
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.background = '';
                uploadArea.style.borderColor = '';
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.background = '';
                uploadArea.style.borderColor = '';
                
                const files = e.dataTransfer.files;
                this.handleImageFiles(files);
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                this.handleImageFiles(e.target.files);
            });
        }
    }

    handleImageFiles(files) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const maxFiles = 5;

        for (let i = 0; i < Math.min(files.length, maxFiles - this.uploadedImages.length); i++) {
            const file = files[i];

            // Check file size
            if (file.size > maxSize) {
                this.showNotification('Şəkil ölçüsü 5MB-dan çox ola bilməz', 'error');
                continue;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                this.showNotification('Yalnız şəkil faylları yükləyə bilərsiniz', 'error');
                continue;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.addImagePreview(file.name, e.target.result);
                this.uploadedImages.push({
                    name: file.name,
                    data: e.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    }

    addImagePreview(fileName, dataUrl) {
        const previewContainer = document.getElementById('imagePreview');
        if (!previewContainer) return;

        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${dataUrl}" alt="${fileName}">
            <button type="button" class="remove-image" onclick="postJobSystem.removeImage('${fileName}')">
                <i class="fas fa-times"></i>
            </button>
        `;

        previewContainer.appendChild(previewItem);
    }

    removeImage(fileName) {
        this.uploadedImages = this.uploadedImages.filter(img => img.name !== fileName);
        this.updateImagePreview();
    }

    updateImagePreview() {
        const previewContainer = document.getElementById('imagePreview');
        if (!previewContainer) return;

        previewContainer.innerHTML = '';
        this.uploadedImages.forEach(img => {
            this.addImagePreview(img.name, img.data);
        });
    }

    togglePriceInputs(priceType) {
        const priceInput = document.getElementById('price');
        const priceRange = document.getElementById('priceRange');

        if (priceType === 'fixed') {
            priceInput.style.display = 'block';
            priceRange.style.display = 'none';
            priceInput.required = true;
        } else if (priceType === 'range') {
            priceInput.style.display = 'none';
            priceRange.style.display = 'block';
            document.getElementById('minPrice').required = true;
        } else {
            priceInput.style.display = 'none';
            priceRange.style.display = 'none';
        }
    }

    addRequirement() {
        const requirementsList = document.getElementById('requirementsList');
        if (!requirementsList) return;

        const requirementId = Date.now();
        const requirementItem = document.createElement('div');
        requirementItem.className = 'requirement-item';
        requirementItem.innerHTML = `
            <input type="text" placeholder="Tələb daxil edin" id="requirement_${requirementId}">
            <button type="button" class="remove-requirement" onclick="postJobSystem.removeRequirement(${requirementId})">
                <i class="fas fa-times"></i>
            </button>
        `;

        requirementsList.appendChild(requirementItem);
        
        // Focus on new input
        setTimeout(() => {
            const input = document.getElementById(`requirement_${requirementId}`);
            if (input) input.focus();
        }, 100);
    }

    removeRequirement(id) {
        const requirementItem = document.querySelector(`#requirement_${id}`)?.closest('.requirement-item');
        if (requirementItem) {
            requirementItem.remove();
        }
    }

    getRequirements() {
        const requirementInputs = document.querySelectorAll('#requirementsList input[type="text"]');
        const requirements = [];
        
        requirementInputs.forEach(input => {
            if (input.value.trim()) {
                requirements.push(input.value.trim());
            }
        });
        
        return requirements;
    }

    // post-job.js - YENİLƏNMİŞ Abunəlik Yoxlaması

checkSubscriptionRequirement() {
    // YALNIZ business/restaurant/retail userları üçün abunəlik tələb olunur
    const requiresSubscription = ['business', 'restaurant', 'retail'].includes(this.currentUser.userType);
    
    if (requiresSubscription && !this.currentUser.subscription?.active) {
        document.getElementById('subscriptionCheck').style.display = 'block';
    } else {
        document.getElementById('subscriptionCheck').style.display = 'none';
    }
}

validateForm() {
    // ... digər validasiyalar ...
    
    // Abunəlik yoxlaması - YALNIZ business/restaurant/retail üçün
    const requiresSubscription = ['business', 'restaurant', 'retail'].includes(this.currentUser.userType);
    
    if (requiresSubscription && !this.currentUser.subscription?.active) {
        this.showNotification('Elan yerləşdirmək üçün abunəlik almalısınız', 'error');
        setTimeout(() => {
            window.location.href = 'pricing.html';
        }, 2000);
        return false;
    }
    
    return isValid;
}

previewJob() {
    if (!this.validateForm()) {
        return;
    }

    // YENİ Abunəlik yoxlaması - YALNIZ müəyyən user tipləri üçün
    const requiresSubscription = ['business', 'restaurant', 'retail'].includes(this.currentUser.userType);
    
    if (requiresSubscription && !this.currentUser.subscription?.active) {
        this.showNotification('Elan yerləşdirmək üçün abunəlik almalısınız', 'error');
        setTimeout(() => {
            window.location.href = 'pricing.html';
        }, 2000);
        return;
    }

    this.showPreviewModal();
}

    validateForm() {
        const form = document.getElementById('postJobForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        // Clear previous errors
        this.clearErrors();

        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showError(field.id, 'Bu sahə mütləq doldurulmalıdır');
                isValid = false;
            }
        });

        // Check price
        const priceType = document.querySelector('input[name="priceType"]:checked').value;
        if (priceType === 'fixed' && !document.getElementById('price').value) {
            this.showError('price', 'Qiymət daxil edin');
            isValid = false;
        }

        if (priceType === 'range') {
            const minPrice = document.getElementById('minPrice').value;
            const maxPrice = document.getElementById('maxPrice').value;
            if (!minPrice || !maxPrice) {
                this.showError('minPrice', 'Hər iki qiymət daxil edilməlidir');
                isValid = false;
            } else if (parseInt(minPrice) >= parseInt(maxPrice)) {
                this.showError('minPrice', 'Minimum qiymət maksimumdan kiçik olmalıdır');
                isValid = false;
            }
        }

        return isValid;
    }

    previewJob() {
        if (!this.validateForm()) {
            this.showNotification('Zəhmət olmasa bütün tələb olunan sahələri doldurun', 'error');
            return;
        }

        // Check subscription for business users
        if ((this.currentUser.userType === 'business' || 
             this.currentUser.userType === 'restaurant' || 
             this.currentUser.userType === 'retail') && 
            !this.currentUser.subscription?.active) {
            
            this.showNotification('Elan yerləşdirmək üçün abunəlik almalısınız', 'error');
            setTimeout(() => {
                window.location.href = 'pricing.html';
            }, 2000);
            return;
        }

        this.showPreviewModal();
    }

    showPreviewModal() {
        const modal = document.getElementById('previewModal');
        const modalContent = document.getElementById('modalPreviewContent');
        
        if (modal && modalContent) {
            modalContent.innerHTML = this.generatePreviewHTML();
            modal.style.display = 'block';
        }
    }

    closeModal() {
        const modal = document.getElementById('previewModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    generatePreviewHTML() {
        const formData = new FormData(document.getElementById('postJobForm'));
        const jobType = formData.get('jobType');
        const category = document.getElementById('category').options[document.getElementById('category').selectedIndex].text;
        const subcategory = document.getElementById('subcategory').value;
        const priceType = formData.get('priceType');
        
        let priceText = '';
        if (priceType === 'fixed') {
            priceText = `${formData.get('price')} ${formData.get('currency')}`;
        } else if (priceType === 'range') {
            priceText = `${formData.get('minPrice')} - ${formData.get('maxPrice')} ${formData.get('currency')}`;
        } else {
            priceText = 'Müzakirə olunan';
        }

        return `
            <div class="job-preview">
                <div class="preview-header">
                    <h2>${formData.get('jobTitle')}</h2>
                    <div class="preview-meta">
                        <span class="category">${category} ${subcategory ? '• ' + subcategory : ''}</span>
                        <span class="job-type">${this.getJobTypeText(jobType)}</span>
                    </div>
                </div>

                ${this.uploadedImages.length > 0 ? `
                <div class="preview-images">
                    ${this.uploadedImages.slice(0, 3).map(img => `
                        <img src="${img.data}" alt="${img.name}">
                    `).join('')}
                </div>
                ` : ''}

                <div class="preview-section">
                    <h3>İş Haqqında</h3>
                    <div class="preview-description">${formData.get('description').replace(/\n/g, '<br>')}</div>
                </div>

                ${this.getRequirements().length > 0 ? `
                <div class="preview-section">
                    <h3>Tələblər</h3>
                    <ul class="requirements-preview">
                        ${this.getRequirements().map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <div class="preview-details">
                    <div class="detail-item">
                        <strong>Qiymət:</strong>
                        <span>${priceText}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Lokasiya:</strong>
                        <span>${formData.get('location')}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Əlaqə:</strong>
                        <span>${formData.get('contactName')} • ${formData.get('contactPhone')} • ${formData.get('contactEmail')}</span>
                    </div>
                </div>

                ${formData.get('isUrgent') ? '<div class="urgent-badge">TƏCİLİ</div>' : ''}
                ${formData.get('isFeatured') ? '<div class="featured-badge">FEATURED</div>' : ''}
            </div>
        `;
    }

    updatePreview() {
        const previewContent = document.getElementById('previewContent');
        if (!previewContent) return;

        const jobTitle = document.getElementById('jobTitle').value;
        
        if (!jobTitle) {
            previewContent.innerHTML = `
                <div class="preview-placeholder">
                    <i class="fas fa-newspaper"></i>
                    <p>Elan məlumatları daxil edildikdə burada ön baxış görünəcək</p>
                </div>
            `;
            return;
        }

        previewContent.innerHTML = this.generatePreviewHTML();
    }

    getJobTypeText(jobType) {
        const types = {
            'job': 'İş Elanı',
            'service': 'Xidmət',
            'product': 'Məhsul'
        };
        return types[jobType] || jobType;
    }

    async submitJob() {
        const form = document.getElementById('postJobForm');
        const formData = new FormData(form);

        // Prepare job data
        const jobData = {
            id: Date.now(),
            userId: this.currentUser.id,
            userType: this.currentUser.userType,
            title: formData.get('jobTitle'),
            type: formData.get('jobType'),
            category: formData.get('category'),
            subcategory: formData.get('subcategory'),
            description: formData.get('description'),
            requirements: this.getRequirements(),
            images: this.uploadedImages,
            priceType: formData.get('priceType'),
            price: formData.get('price'),
            minPrice: formData.get('minPrice'),
            maxPrice: formData.get('maxPrice'),
            currency: formData.get('currency'),
            location: formData.get('location'),
            contactName: formData.get('contactName'),
            contactPhone: formData.get('contactPhone'),
            contactEmail: formData.get('contactEmail'),
            isUrgent: formData.get('isUrgent') === 'on',
            isFeatured: formData.get('isFeatured') === 'on',
            status: 'active',
            views: 0,
            applications: 0,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        };

        // Show loading
        this.setLoading(true);

        try {
            // Save to localStorage
            const jobs = JSON.parse(localStorage.getItem('biznet_jobs')) || [];
            jobs.push(jobData);
            localStorage.setItem('biznet_jobs', JSON.stringify(jobs));

            // Update user's job count
            this.updateUserJobCount();

            this.showNotification('Elan uğurla yerləşdirildi!', 'success');
            
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 2000);

        } catch (error) {
            this.showNotification('Xəta baş verdi: ' + error.message, 'error');
            this.setLoading(false);
        }
    }

    updateUserJobCount() {
        const users = JSON.parse(localStorage.getItem('biznet_users')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            if (!users[userIndex].jobCount) {
                users[userIndex].jobCount = 0;
            }
            users[userIndex].jobCount++;
            localStorage.setItem('biznet_users', JSON.stringify(users));
            
            // Update current user
            this.currentUser.jobCount = users[userIndex].jobCount;
            localStorage.setItem('biznet_user', JSON.stringify(this.currentUser));
        }
    }

    execCommand(command) {
        document.execCommand(command, false, null);
        document.getElementById('description').focus();
    }

    // Utility methods
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '#dc3545';
            
            // Create or update error message
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
        
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }

    setLoading(loading) {
        const submitBtn = document.querySelector('.btn-primary');
        if (submitBtn) {
            if (loading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yerləşdirilir...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Elanı Yerləşdir';
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

// Global functions
function addRequirement() {
    if (window.postJobSystem) {
        window.postJobSystem.addRequirement();
    }
}

function previewJob() {
    if (window.postJobSystem) {
        window.postJobSystem.previewJob();
    }
}

function submitJob() {
    if (window.postJobSystem) {
        window.postJobSystem.submitJob();
    }
}

function hideSubscriptionAlert() {
    document.getElementById('subscriptionCheck').style.display = 'none';
}

// Initialize system
document.addEventListener('DOMContentLoaded', () => {
    window.postJobSystem = new PostJobSystem();
});
