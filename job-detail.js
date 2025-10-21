// JOB DETAIL MANAGEMENT SYSTEM
class JobDetailSystem {
    constructor() {
        this.jobId = this.getJobIdFromURL();
        this.job = null;
        this.init();
    }

    init() {
        this.loadJobDetails();
        this.setupEventListeners();
        this.updateViewCount();
        console.log('💼 Job detail system initialized');
    }

    getJobIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 1; // Default olaraq 1
    }

    loadJobDetails() {
        // Gerçek uygulamada API'den çekilecek
        this.job = {
            id: 1,
            title: 'Frontend Developer',
            company: {
                name: 'TechCorp MMC',
                logo: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
                industry: 'IT & Texnologiya',
                size: '101-500 işçi',
                location: 'Bakı, Azərbaycan',
                website: 'https://techcorp.az',
                rating: 4.8,
                reviewCount: 124
            },
            category: 'it',
            type: 'full-time',
            location: 'baku',
            address: 'Bakı, Nizami küçəsi 123',
            experience: '3-5 il',
            education: 'Ali təhsil',
            salary: '2000-3000',
            applicationDeadline: '2024-02-15',
            description: `TechCorp MMC-də Frontend Developer kimi çalışmaq üçün peşəkar komandamıza qoşulun. Biz rəqəmsal transformasiya və innovativ texnoloji həllər üzrə aparıcı şirkətik.`,
            responsibilities: [
                'Müasir veb tətbiqlərin hazırlanması və dəstəklənməsi',
                'React və Vue.js framework-lərindən istifadə edərək interfeyslərin yaradılması',
                'Responsiv və istifadəçi dostu dizaynların həyata keçirilməsi',
                'Backend developerlər ilə əməkdaşlıq edərək API-lərin inteqrasiyası',
                'Kodun keyfiyyətinin və performansının təmin edilməsi',
                'Layihə zamanı texniki problemlərin həlli'
            ],
            requirements: {
                mandatory: [
                    '3 ildən çox Frontend development təcrübəsi',
                    'JavaScript və TypeScript bilikləri',
                    'React və/və ya Vue.js framework-ləri',
                    'Responsiv dizayn prinsipləri',
                    'Git version control sistemi'
                ],
                preferred: [
                    'Next.js və ya Nuxt.js bilikləri',
                    'Testing framework-ləri (Jest, Cypress)',
                    'CI/CD prosesləri ilə tanışlıq',
                    'Cloud platformaları (AWS, Azure)',
                    'Agile/Scrum metodologiyaları'
                ]
            },
            benefits: [
                'Sığorta', 'Yemək', 'Təlim', 'Nəqliyyat', 
                'İdman', 'Analıq məzuniyyəti', 'Bonus', 'Tətil'
            ],
            tags: ['React', 'Vue.js', 'JavaScript', 'TypeScript', 'HTML/CSS'],
            featured: true,
            urgent: true,
            remote: true,
            premium: true,
            views: 1245,
            applications: 47,
            postedDate: '2024-01-12',
            contact: {
                person: 'Aygün Məmmədova',
                email: 'career@techcorp.az',
                phone: '+994123456789'
            },
            similarJobs: [
                {
                    title: 'React Developer',
                    company: 'SoftTech Solutions',
                    location: 'Bakı • Remote',
                    salary: '₼ 2,500 - 3,500'
                },
                {
                    title: 'Vue.js Developer',
                    company: 'Creative Studio',
                    location: 'Gəncə • Hybrid',
                    salary: '₼ 1,800 - 2,500'
                },
                {
                    title: 'Full Stack Developer',
                    company: 'MarketPro',
                    location: 'Bakı • Ofis',
                    salary: '₼ 3,000 - 4,000'
                }
            ]
        };

        this.renderJobDetails();
    }

    setupEventListeners() {
        // Save job button
        const saveBtn = document.getElementById('saveJobBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.handleSaveJob();
            });
        }

        // Share job button
        const shareBtn = document.getElementById('shareJobBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.handleShareJob();
            });
        }

        // Apply now button
        const applyBtn = document.querySelector('.apply-now-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.handleApplyJob();
            });
        }

        // Follow company button
        const followBtn = document.querySelector('.follow-company-btn');
        if (followBtn) {
            followBtn.addEventListener('click', () => {
                this.handleFollowCompany();
            });
        }

        // Quick actions
        document.querySelectorAll('.action-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleQuickAction(e.target.closest('.action-item'));
            });
        });

        // Similar jobs click
        document.querySelectorAll('.similar-job-card').forEach(card => {
            card.addEventListener('click', () => {
                // Gerçek uygulamada ilgili iş detay sayfasına yönlendirilecek
                alert('Oxşar iş detalları göstəriləcək');
            });
        });
    }

    renderJobDetails() {
        if (!this.job) return;

        // Sayfa başlığını güncelle
        document.title = `${this.job.title} - ${this.job.company.name} - BizNet.az`;

        // Tarih formatı
        const postedDate = new Date(this.job.postedDate);
        const today = new Date();
        const diffTime = Math.abs(today - postedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let dateText = '';
        if (diffDays === 1) {
            dateText = 'Bu gün';
        } else if (diffDays <= 7) {
            dateText = `${diffDays} gün əvvəl`;
        } else {
            dateText = postedDate.toLocaleDateString('az-AZ');
        }

        // Son müracaat tarihi
        const deadline = new Date(this.job.applicationDeadline);
        const deadlineText = deadline.toLocaleDateString('az-AZ', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // Save button durumunu kontrol et
        const saveBtn = document.getElementById('saveJobBtn');
        if (saveBtn && this.isJobSaved(this.job.id)) {
            saveBtn.classList.add('saved');
            saveBtn.innerHTML = '<i class="far fa-bookmark"></i> Saxlanılıb';
        }

        // Follow button durumunu kontrol et
        const followBtn = document.querySelector('.follow-company-btn');
        if (followBtn && this.isCompanyFollowing(this.job.company.name)) {
            followBtn.classList.add('following');
            followBtn.innerHTML = '<i class="fas fa-check"></i> İzlənilir';
        }

        // İstatistikleri güncelle
        const stats = document.querySelector('.job-stats');
        if (stats) {
            stats.innerHTML = `
                <div class="stat">
                    <i class="fas fa-eye"></i>
                    <span>${this.job.views.toLocaleString()} baxış</span>
                </div>
                <div class="stat">
                    <i class="fas fa-users"></i>
                    <span>${this.job.applications} müraciət</span>
                </div>
                <div class="stat">
                    <i class="far fa-clock"></i>
                    <span>${dateText}</span>
                </div>
            `;
        }

        // Detay grid'i güncelle
        const detailsGrid = document.querySelector('.job-details-grid');
        if (detailsGrid) {
            detailsGrid.innerHTML = `
                <div class="detail-item">
                    <i class="fas fa-briefcase"></i>
                    <div>
                        <span class="label">İş Növü</span>
                        <span class="value">Tam ştat</span>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <span class="label">Ünvan</span>
                        <span class="value">${this.job.address}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <div>
                        <span class="label">Əmək Haqqı</span>
                        <span class="value">₼ ${this.job.salary.replace('-', ' - ')}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-chart-line"></i>
                    <div>
                        <span class="label">Təcrübə</span>
                        <span class="value">${this.job.experience}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-graduation-cap"></i>
                    <div>
                        <span class="label">Təhsil</span>
                        <span class="value">${this.job.education}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <div>
                        <span class="label">Son Müraciət</span>
                        <span class="value">${deadlineText}</span>
                    </div>
                </div>
            `;
        }

        // Özet bilgileri güncelle
        const summaryCard = document.querySelector('.summary-card .summary-items');
        if (summaryCard) {
            summaryCard.innerHTML = `
                <div class="summary-item">
                    <span class="label">Yerləşdirilib:</span>
                    <span class="value">${dateText}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Vakansiya:</span>
                    <span class="value">F-2024-00${this.job.id}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Baxış sayı:</span>
                    <span class="value">${this.job.views.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Müraciət:</span>
                    <span class="value">${this.job.applications}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Son müraciət:</span>
                    <span class="value">${deadlineText}</span>
                </div>
            `;
        }

        // Benzer işleri güncelle
        const similarJobs = document.querySelector('.similar-jobs');
        if (similarJobs && this.job.similarJobs) {
            similarJobs.innerHTML = this.job.similarJobs.map(job => `
                <div class="similar-job-card">
                    <h4>${job.title}</h4>
                    <div class="company">${job.company}</div>
                    <div class="location">${job.location}</div>
                    <div class="salary">${job.salary}</div>
                </div>
            `).join('');
        }
    }

    handleSaveJob() {
        const saveBtn = document.getElementById('saveJobBtn');
        const isCurrentlySaved = saveBtn.classList.contains('saved');
        
        if (isCurrentlySaved) {
            this.unsaveJob(this.job.id);
            saveBtn.classList.remove('saved');
            saveBtn.innerHTML = '<i class="far fa-bookmark"></i> Saxla';
            this.showNotification('İş elanı saxlanılanlardan silindi', 'info');
        } else {
            this.saveJob(this.job.id);
            saveBtn.classList.add('saved');
            saveBtn.innerHTML = '<i class="far fa-bookmark"></i> Saxlanılıb';
            this.showNotification('İş elanı saxlanılanlara əlavə edildi', 'success');
        }
    }

    handleShareJob() {
        if (navigator.share) {
            navigator.share({
                title: this.job.title,
                text: `${this.job.company.name} - ${this.job.title}`,
                url: window.location.href,
            })
            .then(() => console.log('Paylaşım başarılı'))
            .catch((error) => console.log('Paylaşım hatası', error));
        } else {
            // Fallback - linki kopyala
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    this.showNotification('Link kopyalandı', 'success');
                })
                .catch(() => {
                    this.showNotification('Link kopyalama başarısız', 'error');
                });
        }
    }

    handleApplyJob() {
        // Kullanıcı giriş kontrolü
        const isLoggedIn = this.checkUserAuth();
        
        if (!isLoggedIn) {
            this.showNotification('Müraciət etmək üçün daxil olun', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
            }, 2000);
            return;
        }

        // Müracaat sayfasına yönlendir
        window.location.href = `apply.html?id=${this.job.id}`;
    }

    handleFollowCompany() {
        const followBtn = document.querySelector('.follow-company-btn');
        const isCurrentlyFollowing = followBtn.classList.contains('following');
        
        if (isCurrentlyFollowing) {
            this.unfollowCompany(this.job.company.name);
            followBtn.classList.remove('following');
            followBtn.innerHTML = '<i class="fas fa-plus"></i> Şirkəti İzlə';
            this.showNotification('Şirkət izlənilənlərdən silindi', 'info');
        } else {
            this.followCompany(this.job.company.name);
            followBtn.classList.add('following');
            followBtn.innerHTML = '<i class="fas fa-check"></i> İzlənilir';
            this.showNotification('Şirkət izlənilənlərə əlavə edildi', 'success');
        }
    }

    handleQuickAction(actionItem) {
        const actionText = actionItem.textContent.trim();
        
        switch(actionText) {
            case 'İşi Saxla':
                this.handleSaveJob();
                break;
            case 'Paylaş':
                this.handleShareJob();
                break;
            case 'Şikayət et':
                this.handleReportJob();
                break;
            case 'Çap et':
                window.print();
                break;
        }
    }

    handleReportJob() {
        const reason = prompt('Şikayət səbəbini qeyd edin:');
        if (reason) {
            this.showNotification('Şikayətiniz qeydə alındı', 'success');
            // Gerçek uygulamada API'ye gönderilecek
        }
    }

    saveJob(jobId) {
        let savedJobs = JSON.parse(localStorage.getItem('biznet_saved_jobs')) || [];
        if (!savedJobs.includes(jobId)) {
            savedJobs.push(jobId);
            localStorage.setItem('biznet_saved_jobs', JSON.stringify(savedJobs));
        }
    }

    unsaveJob(jobId) {
        let savedJobs = JSON.parse(localStorage.getItem('biznet_saved_jobs')) || [];
        savedJobs = savedJobs.filter(id => id !== jobId);
        localStorage.setItem('biznet_saved_jobs', JSON.stringify(savedJobs));
    }

    isJobSaved(jobId) {
        const savedJobs = JSON.parse(localStorage.getItem('biznet_saved_jobs')) || [];
        return savedJobs.includes(jobId);
    }

    followCompany(companyName) {
        let followedCompanies = JSON.parse(localStorage.getItem('biznet_followed_companies')) || [];
        if (!followedCompanies.includes(companyName)) {
            followedCompanies.push(companyName);
            localStorage.setItem('biznet_followed_companies', JSON.stringify(followedCompanies));
        }
    }

    unfollowCompany(companyName) {
        let followedCompanies = JSON.parse(localStorage.getItem('biznet_followed_companies')) || [];
        followedCompanies = followedCompanies.filter(company => company !== companyName);
        localStorage.setItem('biznet_followed_companies', JSON.stringify(followedCompanies));
    }

    isCompanyFollowing(companyName) {
        const followedCompanies = JSON.parse(localStorage.getItem('biznet_followed_companies')) || [];
        return followedCompanies.includes(companyName);
    }

    checkUserAuth() {
        // Gerçek uygulamada daha karmaşık auth kontrolü yapılacak
        return localStorage.getItem('biznet_user_token') !== null;
    }

    updateViewCount() {
        // Gerçek uygulamada API'ye görüntülenme sayısını güncelleme isteği gönderilecek
        console.log(`Job ${this.jobId} viewed`);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.background = 'var(--success)';
        } else if (type === 'info') {
            notification.style.background = 'var(--primary)';
        } else if (type === 'warning') {
            notification.style.background = 'var(--warning)';
        } else if (type === 'error') {
            notification.style.background = 'var(--danger)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// CSS Animations for notifications
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize job detail system
document.addEventListener('DOMContentLoaded', () => {
    window.jobDetailSystem = new JobDetailSystem();
});