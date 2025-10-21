// Company Detail Management System
class CompanyDetailSystem {
    constructor() {
        this.companyId = this.getCompanyIdFromURL();
        this.company = null;
        this.init();
    }

    init() {
        this.loadCompanyDetails();
        this.setupEventListeners();
        console.log('🏢 Company detail system initialized');
    }

    getCompanyIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 1;
    }

    loadCompanyDetails() {
        // Gerçek uygulamada API'den çekilecek
        this.company = {
            id: 1,
            name: 'TechCorp MMC',
            tagline: 'Rəqəmsal Transformasiya və İnnovativ Texnoloji Həllər',
            logo: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
            industry: 'IT & Texnologiya',
            size: '101-500',
            location: 'Bakı, Nizami küçəsi 123',
            website: 'https://techcorp.az',
            phone: '+994123456789',
            email: 'info@techcorp.az',
            founded: 2014,
            employees: 250,
            openJobs: 15,
            projects: 500,
            rating: 4.8,
            reviewCount: 124,
            premium: true,
            verified: true,
            description: `TechCorp MMC 2014-cü ildən etibarən rəqəmsal transformasiya və innovativ texnoloji həllər üzrə fəaliyyət göstərən aparıcı şirkətdir. Biz müasir texnologiyalar vasitəsilə müştərilərimizin biznes proseslərini optimallaşdırır və onların rəqəmsal dəyişim yolunda etibarlı tərəfdaşı oluruq.`,
            mission: `Missiyamız innovativ texnoloji həllər vasitəsilə müştərilərimizin biznes uğurunu təmin etməkdir. Dəyərlərimiz: şəffaflıq, keyfiyyət, innovasiya və komanda işi.`,
            services: [
                {
                    icon: 'fas fa-laptop-code',
                    title: 'Veb Development',
                    description: 'Müasir veb tətbiqlərin hazırlanması'
                },
                {
                    icon: 'fas fa-mobile-alt',
                    title: 'Mobil Tətbiqlər',
                    description: 'iOS və Android platformaları üçün tətbiqlər'
                },
                {
                    icon: 'fas fa-cloud',
                    title: 'Cloud Solutions',
                    description: 'Bulud texnologiyaları və infrastruktur'
                },
                {
                    icon: 'fas fa-robot',
                    title: 'AI & ML',
                    description: 'Süni intellekt və maşın öyrənmə'
                }
            ],
            benefits: [
                {
                    icon: 'fas fa-heartbeat',
                    title: 'Sığorta',
                    description: 'Tam sığorta paketi'
                },
                {
                    icon: 'fas fa-utensils',
                    title: 'Yemək',
                    description: 'Pulsuz nahar'
                },
                {
                    icon: 'fas fa-graduation-cap',
                    title: 'Təlim',
                    description: 'Peşəkar inkişaf üçün təlimlər'
                },
                {
                    icon: 'fas fa-dumbbell',
                    title: 'İdman',
                    description: 'İdman zallarına güzəştli giriş'
                },
                {
                    icon: 'fas fa-plane',
                    title: 'Tətil',
                    description: '24 gün illik məzuniyyət'
                },
                {
                    icon: 'fas fa-home',
                    title: 'Remote İş',
                    description: 'Çevik iş qrafiki'
                }
            ],
            openPositions: [
                {
                    title: 'Frontend Developer',
                    location: 'Bakı',
                    type: 'Tam ştat',
                    salary: '₼ 2,000 - 3,000',
                    description: 'React və Vue.js bilikləri olan Frontend Developer axtarırıq. 3 ildən çox təcrübə...',
                    date: '3 gün əvvəl'
                },
                {
                    title: 'Backend Developer (Node.js)',
                    location: 'Remote',
                    type: 'Tam ştat',
                    salary: '₼ 2,500 - 3,500',
                    description: 'Node.js, Express və MongoDB bilikləri olan Backend Developer axtarırıq...',
                    date: '1 həftə əvvəl'
                },
                {
                    title: 'UI/UX Dizayner',
                    location: 'Bakı',
                    type: 'Tam ştat',
                    salary: '₼ 1,500 - 2,200',
                    description: 'Figma və Adobe XD bilikləri olan yaradıcı UI/UX dizayner axtarırıq...',
                    date: '2 həftə əvvəl'
                }
            ],
            reviews: [
                {
                    name: 'İlkin Məmmədov',
                    position: 'Frontend Developer',
                    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                    rating: 5,
                    date: '2 ay əvvəl',
                    text: 'TechCorp-da 3 ildir çalışıram. Komanda mühiti əla, texnoloji imkanlar zəngin, karyera inkişafı üçün çoxlu fürsətlər var. Xüsusilə təlim və konfranslara dəstək çox yaxşıdır.'
                },
                {
                    name: 'Aygün Hüseynova',
                    position: 'UI/UX Dizayner',
                    avatar: 'https://cdn-icons-png.flaticon.com/512/4329/4329421.png',
                    rating: 4.5,
                    date: '1 ay əvvəl',
                    text: 'Yaradıcılıq üçün mükəmməl şərait. Dizayn komandası çox peşəkar və dəstəkleyicidir. Layihələr maraqlı və müxtəlifdir.'
                }
            ],
            similarCompanies: [
                {
                    name: 'MarketPro',
                    industry: 'Digital Marketinq',
                    logo: 'https://cdn-icons-png.flaticon.com/512/3142/3142787.png'
                },
                {
                    name: 'SoftTech Solutions',
                    industry: 'Proqram Təminatı',
                    logo: 'https://cdn-icons-png.flaticon.com/512/2920/2920244.png'
                },
                {
                    name: 'Creative Studio',
                    industry: 'Dizayn & Marketinq',
                    logo: 'https://cdn-icons-png.flaticon.com/512/1995/1995511.png'
                }
            ]
        };

        this.renderCompanyDetails();
    }

    setupEventListeners() {
        // Follow company button
        const followBtn = document.querySelector('.follow-btn');
        if (followBtn) {
            followBtn.addEventListener('click', () => {
                this.handleFollowCompany();
            });
        }

        // Share button
        const shareBtn = document.querySelector('.btn-outline:last-child');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.handleShareCompany();
            });
        }

        // View jobs button
        const viewJobsBtn = document.querySelector('.btn-primary');
        if (viewJobsBtn) {
            viewJobsBtn.addEventListener('click', () => {
                this.handleViewJobs();
            });
        }

        // Contact buttons
        const messageBtn = document.querySelector('.contact-actions .btn-primary');
        const callBtn = document.querySelector('.contact-actions .btn-outline');
        
        if (messageBtn) {
            messageBtn.addEventListener('click', () => {
                this.handleSendMessage();
            });
        }

        if (callBtn) {
            callBtn.addEventListener('click', () => {
                this.handleMakeCall();
            });
        }

        // Similar companies click
        document.querySelectorAll('.similar-company').forEach(company => {
            company.addEventListener('click', () => {
                // Gerçek uygulamada ilgili şirket detay sayfasına yönlendirilecek
                this.showNotification('Oxşar şirkət səhifəsinə yönləndiriləcək', 'info');
            });
        });
    }

    renderCompanyDetails() {
        if (!this.company) return;

        // Sayfa başlığını güncelle
        document.title = `${this.company.name} - Şirkət Profili - BizNet.az`;

        // Follow button durumunu kontrol et
        const followBtn = document.querySelector('.follow-btn');
        if (followBtn && this.isCompanyFollowing(this.company.id)) {
            followBtn.classList.add('following');
            followBtn.innerHTML = '<i class="fas fa-check"></i> İzlənilir';
        }

        // Benzer şirketleri render et
        this.renderSimilarCompanies();
    }

    renderSimilarCompanies() {
        const similarContainer = document.querySelector('.similar-companies');
        if (similarContainer && this.company.similarCompanies) {
            similarContainer.innerHTML = this.company.similarCompanies.map(company => `
                <div class="similar-company">
                    <img src="${company.logo}" alt="${company.name}">
                    <div>
                        <h4>${company.name}</h4>
                        <span>${company.industry}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    handleFollowCompany() {
        const followBtn = document.querySelector('.follow-btn');
        const isCurrentlyFollowing = followBtn.classList.contains('following');
        
        if (isCurrentlyFollowing) {
            this.unfollowCompany(this.company.id);
            followBtn.classList.remove('following');
            followBtn.innerHTML = '<i class="fas fa-plus"></i> Şirkəti İzlə';
            this.showNotification('Şirkət izlənilənlərdən silindi', 'info');
        } else {
            this.followCompany(this.company.id);
            followBtn.classList.add('following');
            followBtn.innerHTML = '<i class="fas fa-check"></i> İzlənilir';
            this.showNotification('Şirkət izlənilənlərə əlavə edildi', 'success');
        }
    }

    handleShareCompany() {
        if (navigator.share) {
            navigator.share({
                title: this.company.name,
                text: `${this.company.name} - ${this.company.tagline}`,
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

    handleViewJobs() {
        window.location.href = `jobs.html?company=${this.company.id}`;
    }

    handleSendMessage() {
        window.location.href = `messages.html?to=company_${this.company.id}`;
    }

    handleMakeCall() {
        window.location.href = `tel:${this.company.phone}`;
    }

    followCompany(companyId) {
        let followedCompanies = JSON.parse(localStorage.getItem('biznet_followed_companies')) || [];
        if (!followedCompanies.includes(companyId)) {
            followedCompanies.push(companyId);
            localStorage.setItem('biznet_followed_companies', JSON.stringify(followedCompanies));
        }
    }

    unfollowCompany(companyId) {
        let followedCompanies = JSON.parse(localStorage.getItem('biznet_followed_companies')) || [];
        followedCompanies = followedCompanies.filter(id => id !== companyId);
        localStorage.setItem('biznet_followed_companies', JSON.stringify(followedCompanies));
    }

    isCompanyFollowing(companyId) {
        const followedCompanies = JSON.parse(localStorage.getItem('biznet_followed_companies')) || [];
        return followedCompanies.includes(companyId);
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

// Initialize company detail system
document.addEventListener('DOMContentLoaded', () => {
    window.companyDetailSystem = new CompanyDetailSystem();
});