/* Backend adapter snippet - auto-inserted
   If APP_CONFIG.BACKEND_ENABLED is true, use API.* to call backend, otherwise fallback to localStorage logic.
*/
if (typeof window.APP_CONFIG === 'undefined') {
  window.APP_CONFIG = { BACKEND_ENABLED: false, API_BASE: "/api", COMMISSION_RATE: 0.15 };
}
if (window.APP_CONFIG.BACKEND_ENABLED && typeof window.API === 'undefined') {
  console.warn("APP_CONFIG.BACKEND_ENABLED=true but API wrapper not loaded. Please include api.js after config.js");
}

// JOBS MANAGEMENT SYSTEM
class JobsSystem {
    constructor() {
        this.jobs = [];
        this.filteredJobs = [];
        this.currentFilters = {
            search: '',
            category: 'all',
            type: [],
            location: [],
            experience: [],
            salary: 'all',
            date: 'all'
        };
        this.currentSort = 'newest';
        this.currentPage = 1;
        this.jobsPerPage = 10;
        this.init();
    }

    init() {
        this.loadJobs();
        this.setupEventListeners();
        this.applyFilters();
        console.log('💼 Jobs system initialized');
    }

    loadJobs() {
        // Örnek veri - gerçek uygulamada API'den çekilecek
        this.jobs = [
            {
                id: 1,
                title: 'Frontend Developer',
                company: {
                    name: 'TechCorp MMC',
                    logo: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png'
                },
                category: 'it',
                type: 'full-time',
                location: 'baku',
                experience: 'mid',
                salary: '2000-3000',
                description: 'React və Vue.js bilikləri olan Frontend Developer axtarırıq. 3 ildən çox təcrübə və komanda işi bacarığı tələb olunur.',
                tags: ['React', 'Vue.js', 'JavaScript', 'HTML/CSS'],
                date: '2024-01-15',
                featured: true,
                urgent: false,
                remote: true,
                applications: 24
            },
            {
                id: 2,
                title: 'Digital Marketing Specialist',
                company: {
                    name: 'MarketPro',
                    logo: 'https://cdn-icons-png.flaticon.com/512/3142/3142787.png'
                },
                category: 'marketing',
                type: 'full-time',
                location: 'baku',
                experience: 'mid',
                salary: '1500-2000',
                description: 'SEO, Google Ads və sosial media marketinqi üzrə təcrübəli mütəxəssis axtarırıq. Rəqəmsal marketinq strategiyalarının hazırlanması və icrası.',
                tags: ['SEO', 'Google Ads', 'SMM', 'Content Marketing'],
                date: '2024-01-14',
                featured: false,
                urgent: true,
                remote: false,
                applications: 18
            },
            {
                id: 3,
                title: 'Maliyyə Mütəxəssisi',
                company: {
                    name: 'FinanceTrust Bank',
                    logo: 'https://cdn-icons-png.flaticon.com/512/259/259399.png'
                },
                category: 'finance',
                type: 'full-time',
                location: 'baku',
                experience: 'senior',
                salary: '3000+',
                description: 'Bank sektorunda 5 ildən çox təcrübəsi olan maliyyə mütəxəssisi axtarırıq. Maliyyə hesablamaları, risk idarəsi və investisiya strategiyaları.',
                tags: ['Maliyyə', 'Bankçılıq', 'İnvestisiya', 'Risk İdarəsi'],
                date: '2024-01-13',
                featured: true,
                urgent: false,
                remote: false,
                applications: 32
            },
            {
                id: 4,
                title: 'UI/UX Dizayner',
                company: {
                    name: 'Creative Studio',
                    logo: 'https://cdn-icons-png.flaticon.com/512/1995/1995511.png'
                },
                category: 'it',
                type: 'full-time',
                location: 'ganja',
                experience: 'junior',
                salary: '1000-1500',
                description: 'Yaradıcı və istifadəçi təcrübəsinə həssas UI/UX dizayner axtarırıq. Figma, Adobe XD və digər dizayn alətləri ilə işləmə bacarığı.',
                tags: ['UI/UX', 'Figma', 'Adobe XD', 'Dizayn'],
                date: '2024-01-12',
                featured: false,
                urgent: false,
                remote: true,
                applications: 15
            },
            {
                id: 5,
                title: 'Tibb Bacısı',
                company: {
                    name: 'HealthCare Plus',
                    logo: 'https://cdn-icons-png.flaticon.com/512/2966/2966323.png'
                },
                category: 'healthcare',
                type: 'full-time',
                location: 'baku',
                experience: 'mid',
                salary: '800-1200',
                description: 'Təcrübəli tibb bacısı axtarırıq. Xəstə qayğısı, tibbi prosedurlar və sənədlərin idarə edilməsi üzrə bacarıq tələb olunur.',
                tags: ['Tibb', 'Xəstə Qayğısı', 'Səhiyyə'],
                date: '2024-01-11',
                featured: false,
                urgent: true,
                remote: false,
                applications: 28
            },
            {
                id: 6,
                title: 'İngilis Dili Müəllimi',
                company: {
                    name: 'EduSmart',
                    logo: 'https://cdn-icons-png.flaticon.com/512/1940/1940611.png'
                },
                category: 'education',
                type: 'part-time',
                location: 'baku',
                experience: 'mid',
                salary: '1000-1500',
                description: 'Təcrübəli ingilis dili müəllimi axtarırıq. IELTS, TOEFL hazırlığı və ümumi ingilis dili dərsləri üçün peşəkar müəllim.',
                tags: ['İngilis Dili', 'Təhsil', 'IELTS', 'TOEFL'],
                date: '2024-01-10',
                featured: false,
                urgent: false,
                remote: true,
                applications: 12
            },
            {
                id: 7,
                title: 'Backend Developer (Node.js)',
                company: {
                    name: 'TechCorp MMC',
                    logo: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png'
                },
                category: 'it',
                type: 'full-time',
                location: 'baku',
                experience: 'senior',
                salary: '3000+',
                description: 'Node.js, Express və MongoDB bilikləri olan Backend Developer axtarırıq. Microservices architecture və cloud technologies təcrübəsi.',
                tags: ['Node.js', 'Express', 'MongoDB', 'API Development'],
                date: '2024-01-09',
                featured: true,
                urgent: false,
                remote: true,
                applications: 19
            },
            {
                id: 8,
                title: 'Satış Meneceri',
                company: {
                    name: 'SalesHouse',
                    logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                },
                category: 'marketing',
                type: 'full-time',
                location: 'sumgait',
                experience: 'mid',
                salary: '1200-1800',
                description: 'Satış və biznes inkişafı üzrə təcrübəli menecer axtarırıq. Müştəri əlaqələri, satış strategiyaları və komanda idarəçiliyi.',
                tags: ['Satış', 'Biznes Development', 'Müştəri Əlaqələri'],
                date: '2024-01-08',
                featured: false,
                urgent: false,
                remote: false,
                applications: 22
            },
            {
                id: 9,
                title: 'Logistika Meneceri',
                company: {
                    name: 'Logistics Pro',
                    logo: 'https://cdn-icons-png.flaticon.com/512/2692/2692887.png'
                },
                category: 'logistics',
                type: 'full-time',
                location: 'baku',
                experience: 'senior',
                salary: '2000-2500',
                description: 'Logistika və anbar idarəçiliyi üzrə təcrübəli menecer axtarırıq. Təchizat zənciri optimallaşdırılması və daşıma prosesləri.',
                tags: ['Logistika', 'Anbar İdarəçiliyi', 'Təchizat Zənciri'],
                date: '2024-01-07',
                featured: false,
                urgent: true,
                remote: false,
                applications: 14
            },
            {
                id: 10,
                title: 'Mobil Tətbiq Developer',
                company: {
                    name: 'SoftTech Solutions',
                    logo: 'https://cdn-icons-png.flaticon.com/512/2920/2920244.png'
                },
                category: 'it',
                type: 'contract',
                location: 'baku',
                experience: 'mid',
                salary: '2500-3500',
                description: 'React Native və ya Flutter bilikləri olan Mobil Tətbiq Developer axtarırıq. iOS və Android platformaları üçün tətbiq inkişafı.',
                tags: ['React Native', 'Flutter', 'iOS', 'Android'],
                date: '2024-01-06',
                featured: true,
                urgent: false,
                remote: true,
                applications: 17
            },
            {
                id: 11,
                title: 'Mühasib',
                company: {
                    name: 'FinanceTrust Bank',
                    logo: 'https://cdn-icons-png.flaticon.com/512/259/259399.png'
                },
                category: 'finance',
                type: 'full-time',
                location: 'baku',
                experience: 'mid',
                salary: '1500-2000',
                description: 'Mühasibat uçotu və maliyyə hesablamaları üzrə təcrübəli mütəxəssis axtarırıq. Vergi hesablamaları və maliyyə hesabatları.',
                tags: ['Mühasibat', 'Maliyyə', 'Vergi', 'Hesabatlar'],
                date: '2024-01-05',
                featured: false,
                urgent: false,
                remote: false,
                applications: 26
            },
            {
                id: 12,
                title: 'Content Writer',
                company: {
                    name: 'MarketPro',
                    logo: 'https://cdn-icons-png.flaticon.com/512/3142/3142787.png'
                },
                category: 'marketing',
                type: 'freelance',
                location: 'remote',
                experience: 'junior',
                salary: '500-1000',
                description: 'Yaradıcı və keyfiyyətli məzmun yaza bilən Content Writer axtarırıq. SEO optimallaşdırılmış mətnlər və blog yazıları.',
                tags: ['Content Writing', 'SEO', 'Blogging', 'Yazı'],
                date: '2024-01-04',
                featured: false,
                urgent: false,
                remote: true,
                applications: 31
            }
        ];
        
        this.filteredJobs = [...this.jobs];
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
                this.searchJobs();
            }
        });

        // Checkbox filters
        document.querySelectorAll('.checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxFilter(e.target);
            });
        });

        // Radio filters
        document.querySelectorAll('.radio input').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleRadioFilter(e.target);
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

        // Save job buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.save-btn')) {
                this.handleSaveJob(e.target.closest('.save-btn'));
            }
        });
    }

    handleQuickFilter(button) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        button.classList.add('active');
        
        const category = button.dataset.category;
        this.currentFilters.category = category;
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

    handleRadioFilter(radio) {
        const filterType = radio.dataset.filter;
        const value = radio.value;
        
        this.currentFilters[filterType] = value;
        this.applyFilters();
    }

    searchJobs() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        this.currentFilters.search = searchTerm;
        this.applyFilters();
    }

    handleSortChange(sortType) {
        this.currentSort = sortType;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredJobs = this.jobs.filter(job => {
            // Category filter
            if (this.currentFilters.category !== 'all' && 
                this.currentFilters.category !== 'remote' && 
                this.currentFilters.category !== 'urgent' && 
                job.category !== this.currentFilters.category) {
                return false;
            }
            
            // Remote filter
            if (this.currentFilters.category === 'remote' && !job.remote) {
                return false;
            }
            
            // Urgent filter
            if (this.currentFilters.category === 'urgent' && !job.urgent) {
                return false;
            }
            
            // Search filter
            if (this.currentFilters.search && 
                !job.title.toLowerCase().includes(this.currentFilters.search) &&
                !job.company.name.toLowerCase().includes(this.currentFilters.search) &&
                !job.tags.some(tag => 
                    tag.toLowerCase().includes(this.currentFilters.search)
                )) {
                return false;
            }
            
            // Type filter
            if (this.currentFilters.type.length > 0 && 
                !this.currentFilters.type.includes(job.type)) {
                return false;
            }
            
            // Location filter
            if (this.currentFilters.location.length > 0 && 
                !this.currentFilters.location.includes(job.location)) {
                return false;
            }
            
            // Experience filter
            if (this.currentFilters.experience.length > 0 && 
                !this.currentFilters.experience.includes(job.experience)) {
                return false;
            }
            
            // Salary filter
            if (this.currentFilters.salary !== 'all' && 
                job.salary !== this.currentFilters.salary) {
                return false;
            }
            
            // Date filter
            if (this.currentFilters.date !== 'all') {
                const jobDate = new Date(job.date);
                const today = new Date();
                const diffTime = Math.abs(today - jobDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (this.currentFilters.date === 'today' && diffDays > 1) {
                    return false;
                } else if (this.currentFilters.date === 'week' && diffDays > 7) {
                    return false;
                } else if (this.currentFilters.date === 'month' && diffDays > 30) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.sortJobs();
        this.renderJobs();
        this.updateResultsInfo();
        this.updatePagination();
    }

    sortJobs() {
        switch(this.currentSort) {
            case 'newest':
                this.filteredJobs.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'relevant':
                // Basit bir uygunluk algoritması - gerçek uygulamada daha karmaşık olabilir
                this.filteredJobs.sort((a, b) => {
                    const aScore = (a.featured ? 10 : 0) + (a.urgent ? 5 : 0) + (a.applications / 10);
                    const bScore = (b.featured ? 10 : 0) + (b.urgent ? 5 : 0) + (b.applications / 10);
                    return bScore - aScore;
                });
                break;
            case 'salary':
                this.filteredJobs.sort((a, b) => {
                    const aSalary = parseInt(a.salary.split('-')[0]);
                    const bSalary = parseInt(b.salary.split('-')[0]);
                    return bSalary - aSalary;
                });
                break;
            case 'company':
                this.filteredJobs.sort((a, b) => a.company.name.localeCompare(b.company.name));
                break;
        }
    }

    resetFilters() {
        this.currentFilters = {
            search: '',
            category: 'all',
            type: [],
            location: [],
            experience: [],
            salary: 'all',
            date: 'all'
        };
        
        document.getElementById('searchInput').value = '';
        document.getElementById('sortSelect').value = 'newest';
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
        
        document.querySelectorAll('.checkbox input, .radio input').forEach(input => {
            input.checked = false;
        });
        
        document.querySelectorAll('.radio input[value="all"]').forEach(radio => {
            radio.checked = true;
        });
        
        this.applyFilters();
    }

    renderJobs() {
        const jobsList = document.getElementById('jobsList');
        if (!jobsList) return;

        const startIndex = (this.currentPage - 1) * this.jobsPerPage;
        const endIndex = startIndex + this.jobsPerPage;
        const jobsToShow = this.filteredJobs.slice(startIndex, endIndex);

        if (jobsToShow.length === 0) {
            jobsList.innerHTML = this.getNoJobsHTML();
            return;
        }

        jobsList.innerHTML = jobsToShow.map(job => this.getJobHTML(job)).join('');
    }

    getJobHTML(job) {
        const categoryNames = {
            'it': 'IT & Texnologiya',
            'marketing': 'Marketinq',
            'finance': 'Maliyyə',
            'healthcare': 'Səhiyyə',
            'education': 'Təhsil',
            'logistics': 'Logistika'
        };

        const typeNames = {
            'full-time': 'Tam ştat',
            'part-time': 'Yarımştat',
            'contract': 'Müqavilə',
            'freelance': 'Freelance',
            'internship': 'Staj'
        };

        const locationNames = {
            'baku': 'Bakı',
            'ganja': 'Gəncə',
            'sumgait': 'Sumqayıt',
            'lankaran': 'Lənkəran',
            'remote': 'Remote'
        };

        const experienceNames = {
            'entry': 'Təcrübəsiz',
            'junior': 'Kiçik',
            'mid': 'Orta',
            'senior': 'Böyük'
        };

        const salaryLabels = {
            '500-1000': '₼ 500 - 1,000',
            '1000-2000': '₼ 1,000 - 2,000',
            '2000-3000': '₼ 2,000 - 3,000',
            '3000+': '₼ 3,000+'
        };

        const isSaved = this.isJobSaved(job.id);
        const savedClass = isSaved ? 'saved' : '';

        // Tarix formatı
        const jobDate = new Date(job.date);
        const today = new Date();
        const diffTime = Math.abs(today - jobDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let dateText = '';
        if (diffDays === 1) {
            dateText = 'Bu gün';
        } else if (diffDays <= 7) {
            dateText = `${diffDays} gün əvvəl`;
        } else {
            dateText = jobDate.toLocaleDateString('az-AZ');
        }

        // Badge'ler
        const badges = [];
        if (job.featured) badges.push('<span class="job-badge badge-featured">Featured</span>');
        if (job.urgent) badges.push('<span class="job-badge badge-urgent">Təcili</span>');
        if (job.remote) badges.push('<span class="job-badge badge-remote">Remote</span>');
        if (diffDays <= 3) badges.push('<span class="job-badge badge-new">Yeni</span>');

        // Kart sınıfı
        let cardClass = 'job-card';
        if (job.featured) cardClass += ' featured';
        if (job.urgent) cardClass += ' urgent';
        if (job.remote) cardClass += ' remote';

        return `
            <div class="${cardClass}">
                <div class="job-badges">
                    ${badges.join('')}
                </div>
                
                <div class="job-header">
                    <div class="job-info">
                        <h3 class="job-title">${job.title}</h3>
                        <div class="job-company">
                            <img src="${job.company.logo}" alt="${job.company.name}" class="company-logo">
                            <span class="company-name">${job.company.name}</span>
                        </div>
                        <div class="job-meta">
                            <div class="meta-item">
                                <i class="fas fa-briefcase"></i>
                                <span>${typeNames[job.type]}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${locationNames[job.location]}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-chart-line"></i>
                                <span>${experienceNames[job.experience]}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-layer-group"></i>
                                <span>${categoryNames[job.category]}</span>
                            </div>
                        </div>
                    </div>
                    <div class="job-salary">${salaryLabels[job.salary]}</div>
                </div>

                <p class="job-description">${job.description}</p>

                <div class="job-tags">
                    ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                </div>

                <div class="job-footer">
                    <div class="job-date">
                        <i class="far fa-clock"></i>
                        <span>${dateText}</span>
                        <span> • ${job.applications} müraciət</span>
                    </div>
                    <div class="job-actions">
                        <button class="action-btn save-btn ${savedClass}" data-job-id="${job.id}">
                            <i class="far ${isSaved ? 'fa-bookmark' : 'fa-bookmark'}"></i>
                            ${isSaved ? 'Saxlanılıb' : 'Saxla'}
                        </button>
                        <a href="job-detail.html?id=${job.id}" class="action-btn view-btn">
                            <i class="far fa-eye"></i> Bax
                        </a>
                        <a href="apply.html?id=${job.id}" class="action-btn apply-btn">
                            <i class="fas fa-paper-plane"></i> Müraciət et
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    getNoJobsHTML() {
        return `
            <div class="no-results">
                <i class="fas fa-briefcase"></i>
                <h3>Heç bir iş elanı tapılmadı</h3>
                <p>Filter parametrlərini dəyişin və ya daha sonra yoxlayın</p>
                <button class="action-btn apply-btn" onclick="jobsSystem.resetFilters()">
                    <i class="fas fa-times"></i> Filterləri Sıfırla
                </button>
            </div>
        `;
    }

    updateResultsInfo() {
        const resultsCount = document.getElementById('resultsCount');
        const filterInfo = document.getElementById('filterInfo');
        
        if (resultsCount && filterInfo) {
            const count = this.filteredJobs.length;
            resultsCount.textContent = `${count} iş elanı tapıldı`;
            
            // Filter info text
            const activeFilters = [];
            if (this.currentFilters.category !== 'all') {
                activeFilters.push(`Kateqoriya: ${this.currentFilters.category}`);
            }
            if (this.currentFilters.search) {
                activeFilters.push(`Axtarış: "${this.currentFilters.search}"`);
            }
            if (this.currentFilters.type.length > 0) {
                activeFilters.push(`İş növü: ${this.currentFilters.type.length}`);
            }
            if (this.currentFilters.location.length > 0) {
                activeFilters.push(`Şəhər: ${this.currentFilters.location.length}`);
            }
            if (this.currentFilters.experience.length > 0) {
                activeFilters.push(`Təcrübə: ${this.currentFilters.experience.length}`);
            }
            if (this.currentFilters.salary !== 'all') {
                activeFilters.push(`Maaş: ${this.currentFilters.salary}`);
            }
            if (this.currentFilters.date !== 'all') {
                activeFilters.push(`Tarix: ${this.currentFilters.date}`);
            }
            
            filterInfo.textContent = activeFilters.length > 0 ? 
                `Filterlər: ${activeFilters.join(', ')}` : 
                'Filterlər tətbiq olunmayıb';
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredJobs.length / this.jobsPerPage);
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
        this.renderJobs();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredJobs.length / this.jobsPerPage);
        if (this.currentPage < totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    handleSaveJob(button) {
        const jobId = parseInt(button.dataset.jobId);
        const isCurrentlySaved = button.classList.contains('saved');
        
        if (isCurrentlySaved) {
            this.unsaveJob(jobId);
            button.classList.remove('saved');
            button.innerHTML = '<i class="far fa-bookmark"></i> Saxla';
            this.showNotification('İş elanı saxlanılanlardan silindi', 'info');
        } else {
            this.saveJob(jobId);
            button.classList.add('saved');
            button.innerHTML = '<i class="far fa-bookmark"></i> Saxlanılıb';
            this.showNotification('İş elanı saxlanılanlara əlavə edildi', 'success');
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

    showNotification(message, type) {
        // Basit bir bildirim sistemi
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

// Initialize jobs system
document.addEventListener('DOMContentLoaded', () => {
    window.jobsSystem = new JobsSystem();
});