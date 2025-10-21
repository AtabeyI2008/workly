// COMPANIES MANAGEMENT SYSTEM
class CompaniesSystem {
    constructor() {
        this.companies = [];
        this.filteredCompanies = [];
        this.currentFilters = {
            search: '',
            industry: 'all',
            location: [],
            size: [],
            features: []
        };
        this.currentSort = 'rating';
        this.currentPage = 1;
        this.companiesPerPage = 9;
        this.init();
    }

    init() {
        this.loadCompanies();
        this.setupEventListeners();
        this.applyFilters();
        console.log('🏢 Companies system initialized');
    }

    loadCompanies() {
        // Örnek veri - gerçek uygulamada API'den çekilecek
        this.companies = [
            {
                id: 1,
                name: 'TechCorp MMC',
                industry: 'IT',
                location: 'baku',
                size: 'large',
                activeJobs: 15,
                description: 'Rəqəmsal transformasiya və innovativ texnoloji həllər üzrə aparıcı şirkət. 10 ildən çox təcrübə.',
                logo: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
                rating: 4.8,
                reviewCount: 124,
                specialties: ['Veb Development', 'Mobil Tətbiqlər', 'AI & ML', 'Cloud Solutions'],
                benefits: ['Sığorta', 'Yemək', 'Bonus', 'Təlim'],
                featured: true,
                premium: true,
                founded: 2014,
                employees: 250,
                projects: 500,
                website: 'https://techcorp.az',
                email: 'career@techcorp.az',
                remote: true
            },
            {
                id: 2,
                name: 'Creative Studio',
                industry: 'dizayn',
                location: 'ganja',
                size: 'small',
                activeJobs: 8,
                description: 'Yaradıcı dizayn həlləri və brend strateqiyaları üzrə ixtisaslaşmış studiya.',
                logo: 'https://cdn-icons-png.flaticon.com/512/1995/1995511.png',
                rating: 4.6,
                reviewCount: 89,
                specialties: ['UI/UX Dizayn', 'Qrafik Dizayn', 'Branding', 'Digital Marketinq'],
                benefits: ['Yemək', 'Təlim', 'Esnek saat'],
                featured: false,
                premium: false,
                founded: 2018,
                employees: 35,
                projects: 200,
                website: 'https://creativestudio.az',
                email: 'info@creativestudio.az',
                remote: true
            },
            {
                id: 3,
                name: 'MarketPro',
                industry: 'marketinq',
                location: 'baku',
                size: 'medium',
                activeJobs: 12,
                description: 'SEO, SEM və sosial media marketinqi üzrə ekspert komanda. Rəqəmsal böyümə üçün həllər.',
                logo: 'https://cdn-icons-png.flaticon.com/512/3142/3142787.png',
                rating: 4.7,
                reviewCount: 156,
                specialties: ['SEO', 'Google Ads', 'SMM', 'Content Marketinq'],
                benefits: ['Sığorta', 'Bonus', 'Karyera inkişafı', 'Yemək'],
                featured: true,
                premium: true,
                founded: 2016,
                employees: 80,
                projects: 350,
                website: 'https://marketpro.az',
                email: 'hr@marketpro.az',
                remote: true
            },
            {
                id: 4,
                name: 'SalesHouse',
                industry: 'marketinq',
                location: 'sumgait',
                size: 'large',
                activeJobs: 6,
                description: 'Satış strategiyaları və biznes inkişafı üzrə lider şirkət. 5 ildir bazar lideri.',
                logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                rating: 4.5,
                reviewCount: 78,
                specialties: ['Satış Strategiyaları', 'Biznes Development', 'Müştəri Xidməti'],
                benefits: ['Yüksək bonus', 'Karyera imkanları', 'Yemək'],
                featured: false,
                premium: false,
                founded: 2019,
                employees: 150,
                projects: 180,
                website: 'https://saleshouse.az',
                email: 'careers@saleshouse.az',
                remote: false
            },
            {
                id: 5,
                name: 'FinanceTrust Bank',
                industry: 'maliyye',
                location: 'baku',
                size: 'large',
                activeJobs: 25,
                description: 'Azərbaycanın etibarlı banklarından biri. 20 ildən çox təcrübə.',
                logo: 'https://cdn-icons-png.flaticon.com/512/259/259399.png',
                rating: 4.4,
                reviewCount: 234,
                specialties: ['Bankçılıq', 'İnvestisiya', 'Kredit', 'Maliyyə Xidmətləri'],
                benefits: ['Sığorta', 'Yemək', 'Nəqliyyat', 'Əlavə tətillər'],
                featured: true,
                premium: true,
                founded: 2003,
                employees: 1200,
                projects: null,
                website: 'https://financetrust.az',
                email: 'hr@financetrust.az',
                remote: false
            },
            {
                id: 6,
                name: 'HealthCare Plus',
                industry: 'saglamliq',
                location: 'baku',
                size: 'large',
                activeJobs: 18,
                description: 'Müasir tibbi xidmətlər və səhiyyə həlləri üzrə aparıcı şirkət.',
                logo: 'https://cdn-icons-png.flaticon.com/512/2966/2966323.png',
                rating: 4.9,
                reviewCount: 189,
                specialties: ['Tibb Xidmətləri', 'Həkimlik', 'Tibb Bacısı', 'Laboratoriya'],
                benefits: ['Sığorta', 'Yemək', 'Nəqliyyat', 'Tibb xidməti'],
                featured: false,
                premium: true,
                founded: 2015,
                employees: 300,
                projects: null,
                website: 'https://healthcareplus.az',
                email: 'careers@healthcareplus.az',
                remote: false
            },
            {
                id: 7,
                name: 'EduSmart',
                industry: 'tehsil',
                location: 'baku',
                size: 'medium',
                activeJobs: 10,
                description: 'İnnovativ təhsil həlləri və peşəkar təlimlər üzrə ixtisaslaşmış mərkəz.',
                logo: 'https://cdn-icons-png.flaticon.com/512/1940/1940611.png',
                rating: 4.7,
                reviewCount: 95,
                specialties: ['Təhsil', 'Təlim', 'Konsaltinq', 'Karyera İnkişafı'],
                benefits: ['Təlim', 'Karyera inkişafı', 'Yemək', 'Esnek saat'],
                featured: true,
                premium: false,
                founded: 2017,
                employees: 65,
                projects: 120,
                website: 'https://edusmart.az',
                email: 'info@edusmart.az',
                remote: true
            },
            {
                id: 8,
                name: 'Logistics Pro',
                industry: 'logistika',
                location: 'baku',
                size: 'large',
                activeJobs: 14,
                description: 'Beynəlxalq logistika və daşıma xidmətləri üzrə aparıcı şirkət.',
                logo: 'https://cdn-icons-png.flaticon.com/512/2692/2692887.png',
                rating: 4.5,
                reviewCount: 112,
                specialties: ['Logistika', 'Daşıma', 'Anbar', 'Təchizat Zənciri'],
                benefits: ['Sığorta', 'Yemək', 'Nəqliyyat', 'Bonus'],
                featured: false,
                premium: false,
                founded: 2012,
                employees: 180,
                projects: null,
                website: 'https://logisticspro.az',
                email: 'hr@logisticspro.az',
                remote: false
            },
            {
                id: 9,
                name: 'RealEstate Experts',
                industry: 'marketinq',
                location: 'baku',
                size: 'small',
                activeJobs: 7,
                description: 'Daşınmaz əmlak bazarında peşəkar xidmətlər və konsaltinq.',
                logo: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
                rating: 4.8,
                reviewCount: 67,
                specialties: ['Daşınmaz Əmlak', 'Konsaltinq', 'Satış', 'Kirayə'],
                benefits: ['Yüksək komissiya', 'Yemək', 'Karyera imkanları'],
                featured: false,
                premium: true,
                founded: 2020,
                employees: 25,
                projects: 80,
                website: 'https://realestateexperts.az',
                email: 'info@realestateexperts.az',
                remote: false
            },
            {
                id: 10,
                name: 'SoftTech Solutions',
                industry: 'IT',
                location: 'baku',
                size: 'medium',
                activeJobs: 11,
                description: 'Müasir proqram təminatı həlləri və IT konsaltinq xidmətləri.',
                logo: 'https://cdn-icons-png.flaticon.com/512/2920/2920244.png',
                rating: 4.6,
                reviewCount: 132,
                specialties: ['Proqram Təminatı', 'IT Konsaltinq', 'Sistem İnteqrasiyası'],
                benefits: ['Sığorta', 'Yemək', 'Təlim', 'Bonus'],
                featured: true,
                premium: false,
                founded: 2018,
                employees: 90,
                projects: 240,
                website: 'https://softtech.az',
                email: 'careers@softtech.az',
                remote: true
            },
            {
                id: 11,
                name: 'MediCare Group',
                industry: 'saglamliq',
                location: 'ganja',
                size: 'medium',
                activeJobs: 9,
                description: 'Müasir tibbi mərkəz və səhiyyə xidmətləri üzrə ixtisaslaşmış qrup.',
                logo: 'https://cdn-icons-png.flaticon.com/512/2966/2966323.png',
                rating: 4.7,
                reviewCount: 78,
                specialties: ['Tibb Xidmətləri', 'Laboratoriya', 'Diqnostika'],
                benefits: ['Sığorta', 'Yemək', 'Tibb xidməti'],
                featured: false,
                premium: false,
                founded: 2016,
                employees: 120,
                projects: null,
                website: 'https://medicaregroup.az',
                email: 'info@medicaregroup.az',
                remote: false
            },
            {
                id: 12,
                name: 'EduFuture Academy',
                industry: 'tehsil',
                location: 'lankaran',
                size: 'small',
                activeJobs: 5,
                description: 'Xarici dillər və peşəkar təlimlər üzrə təhsil mərkəzi.',
                logo: 'https://cdn-icons-png.flaticon.com/512/1940/1940611.png',
                rating: 4.5,
                reviewCount: 45,
                specialties: ['Xarici Dillər', 'Peşəkar Təlimlər', 'Konsaltinq'],
                benefits: ['Təlim', 'Karyera inkişafı', 'Yemək'],
                featured: false,
                premium: false,
                founded: 2019,
                employees: 30,
                projects: 60,
                website: 'https://edufuture.az',
                email: 'info@edufuture.az',
                remote: true
            }
        ];
        
        this.filteredCompanies = [...this.companies];
    }

    setupEventListeners() {
        // Quick filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickFilter(e.target);
            });
        });

        // Search input
        document.getElementById('searchInput').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.searchCompanies();
            }
        });

        // Checkbox filters
        document.querySelectorAll('.checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxFilter(e.target);
            });
        });

        // Sort select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.handleSortChange(e.target.value);
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            this.previousPage();
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.nextPage();
        });

        // Follow buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.follow-btn')) {
                this.handleFollowCompany(e.target.closest('.follow-btn'));
            }
        });
    }

    handleQuickFilter(button) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        button.classList.add('active');
        
        const industry = button.dataset.industry;
        this.currentFilters.industry = industry;
        this.applyFilters();
    }

    handleCheckboxFilter(checkbox) {
        const filterType = checkbox.dataset.filter;
        const value = checkbox.value;
        
        if (!this.currentFilters[filterType]) {
            this.currentFilters[filterType] = [];
        }
        
        if (checkbox.checked) {
            this.currentFilters[filterType].push(value);
        } else {
            this.currentFilters[filterType] = this.currentFilters[filterType].filter(item => item !== value);
        }
        
        this.applyFilters();
    }

    searchCompanies() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        this.currentFilters.search = searchTerm;
        this.applyFilters();
    }

    handleSortChange(sortType) {
        this.currentSort = sortType;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredCompanies = this.companies.filter(company => {
            // Industry filter
            if (this.currentFilters.industry !== 'all' && 
                this.currentFilters.industry !== 'premium' && 
                company.industry !== this.currentFilters.industry) {
                return false;
            }
            
            // Premium filter
            if (this.currentFilters.industry === 'premium' && !company.premium) {
                return false;
            }
            
            // Search filter
            if (this.currentFilters.search && 
                !company.name.toLowerCase().includes(this.currentFilters.search) &&
                !company.industry.toLowerCase().includes(this.currentFilters.search) &&
                !company.specialties.some(specialty => 
                    specialty.toLowerCase().includes(this.currentFilters.search)
                )) {
                return false;
            }
            
            // Location filter
            if (this.currentFilters.location.length > 0 && 
                !this.currentFilters.location.includes(company.location)) {
                return false;
            }
            
            // Size filter
            if (this.currentFilters.size.length > 0 && 
                !this.currentFilters.size.includes(company.size)) {
                return false;
            }
            
            // Features filter
            if (this.currentFilters.features.length > 0) {
                const hasAllFeatures = this.currentFilters.features.every(feature => {
                    if (feature === 'premium') return company.premium;
                    if (feature === 'featured') return company.featured;
                    if (feature === 'remote') return company.remote;
                    return false;
                });
                if (!hasAllFeatures) return false;
            }
            
            return true;
        });
        
        this.sortCompanies();
        this.renderCompanies();
        this.updateResultsInfo();
        this.updatePagination();
    }

    sortCompanies() {
        switch(this.currentSort) {
            case 'rating':
                this.filteredCompanies.sort((a, b) => b.rating - a.rating);
                break;
            case 'jobs':
                this.filteredCompanies.sort((a, b) => b.activeJobs - a.activeJobs);
                break;
            case 'newest':
                this.filteredCompanies.sort((a, b) => b.founded - a.founded);
                break;
            case 'name':
                this.filteredCompanies.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    resetFilters() {
        this.currentFilters = {
            search: '',
            industry: 'all',
            location: [],
            size: [],
            features: []
        };
        
        document.getElementById('searchInput').value = '';
        document.getElementById('sortSelect').value = 'rating';
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector('.filter-btn[data-industry="all"]').classList.add('active');
        
        document.querySelectorAll('.checkbox input').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        this.applyFilters();
    }

    renderCompanies() {
        const companiesGrid = document.getElementById('companiesGrid');
        if (!companiesGrid) return;

        const startIndex = (this.currentPage - 1) * this.companiesPerPage;
        const endIndex = startIndex + this.companiesPerPage;
        const companiesToShow = this.filteredCompanies.slice(startIndex, endIndex);

        if (companiesToShow.length === 0) {
            companiesGrid.innerHTML = this.getNoCompaniesHTML();
            return;
        }

        companiesGrid.innerHTML = companiesToShow.map(company => this.getCompanyHTML(company)).join('');
    }

    getCompanyHTML(company) {
        const industryNames = {
            'IT': 'IT & Texnologiya',
            'marketinq': 'Marketinq',
            'maliyye': 'Maliyyə',
            'saglamliq': 'Səhiyyə',
            'tehsil': 'Təhsil',
            'logistika': 'Logistika',
            'dizayn': 'Dizayn'
        };

        const locationNames = {
            'baku': 'Bakı',
            'ganja': 'Gəncə',
            'sumgait': 'Sumqayıt',
            'lankaran': 'Lənkəran'
        };

        const sizeLabels = {
            'small': '1-50 işçi',
            'medium': '51-200 işçi',
            'large': '200+ işçi'
        };

        const isFollowing = this.isCompanyFollowing(company.id);
        const followingClass = isFollowing ? 'following' : '';

        return `
            <div class="company-card ${company.featured ? 'featured' : ''} ${company.premium ? 'premium' : ''}">
                ${company.premium ? '<div class="premium-badge">PREMIUM</div>' : ''}
                
                <div class="company-logo-container">
                    <img src="${company.logo}" alt="${company.name}" class="company-logo">
                </div>
                
                <div class="company-content">
                    <div class="company-header">
                        <h3 class="company-name">${company.name}</h3>
                        <div class="company-industry">${industryNames[company.industry]}</div>
                        
                        <div class="company-rating">
                            <span class="rating-stars">${this.getStarRating(company.rating)}</span>
                            <span class="rating-count">${company.rating} (${company.reviewCount} rəy)</span>
                        </div>
                    </div>

                    <div class="company-meta">
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${locationNames[company.location]}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${sizeLabels[company.size]}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-briefcase"></i>
                            <span>${company.activeJobs} vakansiya</span>
                        </div>
                    </div>

                    <p class="company-description">${company.description}</p>

                    <div class="company-specialties">
                        ${company.specialties.map(specialty => `<span class="specialty-tag">${specialty}</span>`).join('')}
                    </div>

                    <div class="company-stats">
                        <div class="stat-item">
                            <span class="stat-number">${company.founded}</span>
                            <span class="stat-label">Qurulub</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${company.employees}</span>
                            <span class="stat-label">İşçi</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${company.projects || '-'}</span>
                            <span class="stat-label">Layihə</span>
                        </div>
                    </div>

                    <div class="company-benefits">
                        ${company.benefits.map(benefit => `
                            <div class="benefit-item">
                                <i class="fas fa-check"></i>
                                <span>${benefit}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="company-footer">
                        <button class="action-btn follow-btn ${followingClass}" data-company-id="${company.id}">
                            <i class="fas ${isFollowing ? 'fa-check' : 'fa-plus'}"></i>
                            ${isFollowing ? 'İzlənilir' : 'İzlə'}
                        </button>
                        <a href="jobs.html?company=${company.id}" class="action-btn view-jobs-btn">
                            <i class="fas fa-briefcase"></i> Vəzifələr
                        </a>
                        <a href="messages.html?to=company_${company.id}" class="action-btn contact-btn">
                            <i class="fas fa-envelope"></i> Əlaqə
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    getNoCompaniesHTML() {
        return `
            <div class="no-results">
                <i class="fas fa-building"></i>
                <h3>Heç bir şirkət tapılmadı</h3>
                <p>Filter parametrlərini dəyişin və ya daha sonra yoxlayın</p>
                <button class="action-btn contact-btn" onclick="companiesSystem.resetFilters()">
                    <i class="fas fa-times"></i> Filterləri Sıfırla
                </button>
            </div>
        `;
    }

    getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + (hasHalfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
    }

    updateResultsInfo() {
        const resultsCount = document.getElementById('resultsCount');
        const filterInfo = document.getElementById('filterInfo');
        
        if (resultsCount && filterInfo) {
            const count = this.filteredCompanies.length;
            resultsCount.textContent = `${count} şirkət tapıldı`;
            
            // Filter info text
            const activeFilters = [];
            if (this.currentFilters.industry !== 'all') {
                activeFilters.push(`Sənaye: ${this.currentFilters.industry}`);
            }
            if (this.currentFilters.search) {
                activeFilters.push(`Axtarış: "${this.currentFilters.search}"`);
            }
            if (this.currentFilters.location.length > 0) {
                activeFilters.push(`Şəhər: ${this.currentFilters.location.length}`);
            }
            if (this.currentFilters.size.length > 0) {
                activeFilters.push(`Ölçü: ${this.currentFilters.size.length}`);
            }
            if (this.currentFilters.features.length > 0) {
                activeFilters.push(`Xüsusiyyət: ${this.currentFilters.features.length}`);
            }
            
            filterInfo.textContent = activeFilters.length > 0 ? 
                `Filterlər: ${activeFilters.join(', ')}` : 
                'Filterlər tətbiq olunmayıb';
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredCompanies.length / this.companiesPerPage);
        const pageNumbers = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    this.goToPage(i);
                });
                pageNumbers.appendChild(pageBtn);
            }
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
            prevBtn.classList.toggle('disabled', this.currentPage === 1);
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
            nextBtn.classList.toggle('disabled', this.currentPage === totalPages);
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderCompanies();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredCompanies.length / this.companiesPerPage);
        if (this.currentPage < totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    handleFollowCompany(button) {
        const companyId = parseInt(button.dataset.companyId);
        const isCurrentlyFollowing = button.classList.contains('following');
        
        if (isCurrentlyFollowing) {
            this.unfollowCompany(companyId);
            button.classList.remove('following');
            button.innerHTML = '<i class="fas fa-plus"></i> İzlə';
            this.showNotification('Şirkət izlənilənlərdən silindi', 'info');
        } else {
            this.followCompany(companyId);
            button.classList.add('following');
            button.innerHTML = '<i class="fas fa-check"></i> İzlənilir';
            this.showNotification('Şirkət izlənilənlərə əlavə edildi', 'success');
        }
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
        // Basit bir bildirim sistemi - gerçek uygulamada daha gelişmiş bir sistem kullanılabilir
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize companies system
document.addEventListener('DOMContentLoaded', () => {
    window.companiesSystem = new CompaniesSystem();
});