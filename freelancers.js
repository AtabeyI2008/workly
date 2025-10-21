// FREELANCERS MANAGEMENT SYSTEM
class FreelancersSystem {
    constructor() {
        this.freelancers = [];
        this.filteredFreelancers = [];
        this.currentFilters = {
            search: '',
            quickFilter: 'all',
            category: '',
            location: '',
            price: '',
            experience: '',
            skills: [],
            availability: [],
            languages: [],
            verification: [],
            maxRate: 200
        };
        this.currentSort = 'newest';
        this.currentPage = 1;
        this.freelancersPerPage = 9;
        this.totalPages = 1;
        
        this.init();
    }

    init() {
        console.log('🚀 Freelancers System initializing...');
        this.loadFreelancers();
        this.setupEventListeners();
        this.applyFilters();
        this.showNotification('Freelancers sistemi uğurla yükləndi!', 'success');
    }

    loadFreelancers() {
        // Əvvəlcə localStorage-dan yoxla
        const savedFreelancers = localStorage.getItem('biznet_freelancers');
        
        if (savedFreelancers && JSON.parse(savedFreelancers).length > 0) {
            this.freelancers = JSON.parse(savedFreelancers);
            console.log('📁 Freelancers loaded from localStorage:', this.freelancers.length);
        } else {
            // Sample data yüklə
            this.freelancers = this.getSampleFreelancers();
            this.saveFreelancersToStorage();
            console.log('📁 Sample freelancers loaded:', this.freelancers.length);
        }
        
        this.filteredFreelancers = [...this.freelancers];
        this.populateSkillsFilter();
    }

    getSampleFreelancers() {
        return [
            {
                id: 1,
                name: 'Rəşad Əliyev',
                title: 'Senior Veb Developer',
                avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                bio: '5 illik təcrübəsi olan senior veb developer. React, Node.js, MongoDB texnologiyaları üzrə ixtisaslaşmışam. 50+ layihə tamamlamışam.',
                rate: 75,
                rateDisplay: '₼ 50-100',
                experience: '5 il',
                experienceLevel: 5,
                location: 'Bakı',
                category: 'web-development',
                skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript', 'Express'],
                languages: ['azərbaycanca', 'ingiliscə', 'rusca'],
                availability: ['full-time', 'project-based'],
                verification: ['email-verified', 'phone-verified', 'portfolio-verified'],
                rating: 4.8,
                projects: 47,
                status: 'online',
                featured: true,
                premium: true,
                joinDate: '2023-05-15'
            },
            {
                id: 2,
                name: 'Leyla Hüseynova',
                title: 'UI/UX Dizayner',
                avatar: 'https://cdn-icons-png.flaticon.com/512/6997/6997662.png',
                bio: 'Kreativ UI/UX dizayner. İstifadəçi təcrübəsi və interfeys dizaynı üzrə mütəxəssis. 3 illik təcrübə, 30+ uğurlu layihə.',
                rate: 45,
                rateDisplay: '₼ 30-60',
                experience: '3 il',
                experienceLevel: 3,
                location: 'Bakı',
                category: 'design',
                skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping', 'Wireframing'],
                languages: ['azərbaycanca', 'ingiliscə'],
                availability: ['full-time', 'part-time'],
                verification: ['email-verified', 'portfolio-verified'],
                rating: 4.9,
                projects: 32,
                status: 'online',
                featured: false,
                premium: true,
                joinDate: '2023-08-22'
            },
            {
                id: 3,
                name: 'Orxan Məmmədov',
                title: 'Mobil Developer',
                avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                bio: 'iOS və Android platformaları üçün mobil tətbiqlər hazırlayıram. React Native və Flutter ixtisasım var.',
                rate: 60,
                rateDisplay: '₼ 40-80',
                experience: '4 il',
                experienceLevel: 4,
                location: 'Gəncə',
                category: 'mobile-development',
                skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase', 'REST API'],
                languages: ['azərbaycanca', 'ingiliscə', 'türkcə'],
                availability: ['project-based'],
                verification: ['email-verified', 'phone-verified'],
                rating: 4.7,
                projects: 28,
                status: 'offline',
                featured: true,
                premium: false,
                joinDate: '2023-03-10'
            },
            {
                id: 4,
                name: 'Aygün Qasımova',
                title: 'Digital Marketinq Mütəxəssisi',
                avatar: 'https://cdn-icons-png.flaticon.com/512/6997/6997662.png',
                bio: 'SEO, SEM və sosial media marketinqi üzrə mütəxəssis. Brendlərin onlayn mövcudluğunu gücləndirirəm.',
                rate: 35,
                rateDisplay: '₼ 25-45',
                experience: '2 il',
                experienceLevel: 2,
                location: 'Bakı',
                category: 'marketing',
                skills: ['SEO', 'Google Ads', 'Facebook Ads', 'Content Marketing', 'Analytics', 'SMM'],
                languages: ['azərbaycanca', 'ingiliscə', 'rusca'],
                availability: ['part-time', 'project-based'],
                verification: ['email-verified'],
                rating: 4.6,
                projects: 19,
                status: 'online',
                featured: false,
                premium: false,
                joinDate: '2023-11-05'
            },
            {
                id: 5,
                name: 'Elvin Nəsirov',
                title: 'Full Stack Developer',
                avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                bio: 'MERN stack üzrə full stack developer. Real-time applikasiyalar və API-lar hazırlayıram.',
                rate: 55,
                rateDisplay: '₼ 35-75',
                experience: '3 il',
                experienceLevel: 3,
                location: 'Sumqayıt',
                category: 'web-development',
                skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Socket.io', 'AWS'],
                languages: ['azərbaycanca', 'ingiliscə'],
                availability: ['full-time'],
                verification: ['email-verified', 'phone-verified'],
                rating: 4.8,
                projects: 35,
                status: 'online',
                featured: false,
                premium: true,
                joinDate: '2023-07-18'
            },
            {
                id: 6,
                name: 'Nərmin Əliyeva',
                title: 'Qrafik Dizayner',
                avatar: 'https://cdn-icons-png.flaticon.com/512/6997/6997662.png',
                bio: 'Veb və çap üçün qrafik dizayn. Logo, brend identikliyi, marketinq materialları hazırlayıram.',
                rate: 40,
                rateDisplay: '₼ 25-55',
                experience: '2 il',
                experienceLevel: 2,
                location: 'Bakı',
                category: 'design',
                skills: ['Photoshop', 'Illustrator', 'InDesign', 'Branding', 'Print Design', 'Logo Design'],
                languages: ['azərbaycanca', 'ingiliscə'],
                availability: ['part-time', 'project-based'],
                verification: ['email-verified', 'portfolio-verified'],
                rating: 4.5,
                projects: 24,
                status: 'offline',
                featured: false,
                premium: false,
                joinDate: '2023-09-12'
            },
            {
                id: 7,
                name: 'Tural Həsənov',
                title: 'DevOps Mühəndisi',
                avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                bio: 'CI/CD, cloud infrastrukturu və konteynerizasiya üzrə mütəxəssis. Sistemlərin performansını optimallaşdırıram.',
                rate: 85,
                rateDisplay: '₼ 60-110',
                experience: '6 il',
                experienceLevel: 6,
                location: 'Bakı',
                category: 'web-development',
                skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Bash'],
                languages: ['azərbaycanca', 'ingiliscə', 'rusca'],
                availability: ['full-time', 'project-based'],
                verification: ['email-verified', 'phone-verified', 'portfolio-verified'],
                rating: 4.9,
                projects: 42,
                status: 'online',
                featured: true,
                premium: true,
                joinDate: '2023-02-28'
            },
            {
                id: 8,
                name: 'Günay Məmmədova',
                title: 'Kontent Yazıçısı',
                avatar: 'https://cdn-icons-png.flaticon.com/512/6997/6997662.png',
                bio: 'SEO-optimallaşdırılmış məzmun, bloq yazıları və texniki sənədlər hazırlayıram. 4 illik təcrübə.',
                rate: 30,
                rateDisplay: '₼ 20-40',
                experience: '4 il',
                experienceLevel: 4,
                location: 'Bakı',
                category: 'writing',
                skills: ['Content Writing', 'SEO', 'Copywriting', 'Blog Writing', 'Technical Writing', 'Editing'],
                languages: ['azərbaycanca', 'ingiliscə', 'türkcə', 'rusca'],
                availability: ['part-time', 'project-based'],
                verification: ['email-verified', 'portfolio-verified'],
                rating: 4.7,
                projects: 56,
                status: 'online',
                featured: false,
                premium: false,
                joinDate: '2023-06-20'
            },
            {
                id: 9,
                name: 'Rövşən Cəfərov',
                title: 'Video Editor',
                avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                bio: 'Peşəkar video montajı və post-istehsal. Reklam, korporativ və şəxsi layihələr üçün video hazırlayıram.',
                rate: 50,
                rateDisplay: '₼ 35-65',
                experience: '3 il',
                experienceLevel: 3,
                location: 'Bakı',
                category: 'video-photo',
                skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Color Grading', 'Motion Graphics', 'Video Editing'],
                languages: ['azərbaycanca', 'ingiliscə'],
                availability: ['project-based'],
                verification: ['email-verified', 'portfolio-verified'],
                rating: 4.8,
                projects: 31,
                status: 'offline',
                featured: false,
                premium: true,
                joinDate: '2023-10-15'
            }
        ];
    }

    saveFreelancersToStorage() {
        localStorage.setItem('biznet_freelancers', JSON.stringify(this.freelancers));
    }

    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Quick filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickFilter(e.target);
            });
        });

        // Search input
        const searchInput = document.getElementById('freelancerSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.debouncedSearch();
            });
        }

        // Filter selects
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const filterName = e.target.id.replace('Filter', '').toLowerCase();
                this.currentFilters[filterName] = e.target.value;
            });
        });

        // Checkbox filters
        document.querySelectorAll('.checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxFilter(e.target);
            });
        });

        // Rate range slider
        const rateRange = document.getElementById('rateRange');
        if (rateRange) {
            rateRange.addEventListener('input', (e) => {
                this.currentFilters.maxRate = parseInt(e.target.value);
                document.getElementById('rateValue').textContent = `₼ ${e.target.value}`;
            });
        }

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }

        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.closest('.page-btn')) {
                this.handlePagination(e.target.closest('.page-btn'));
            }
        });

        // Modal close handlers
        this.setupModalHandlers();

        console.log('✅ Event listeners setup complete');
    }

    handleQuickFilter(button) {
        // Remove active class from all quick filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterType = button.dataset.filter;
        this.currentFilters.quickFilter = filterType;
        this.applyFilters();
    }

    handleCheckboxFilter(checkbox) {
        const value = checkbox.value;
        const section = checkbox.closest('.filter-section');
        const filterName = section.querySelector('h4').textContent.toLowerCase();
        
        // Map filter names to our filter keys
        const filterMap = {
            'mövcudluq': 'availability',
            'dillər': 'languages',
            'təsdiqləmə': 'verification'
        };
        
        const filterKey = filterMap[filterName];
        
        if (!filterKey) {
            console.warn('Unknown filter:', filterName);
            return;
        }
        
        if (!this.currentFilters[filterKey]) {
            this.currentFilters[filterKey] = [];
        }
        
        if (checkbox.checked) {
            if (!this.currentFilters[filterKey].includes(value)) {
                this.currentFilters[filterKey].push(value);
            }
        } else {
            this.currentFilters[filterKey] = this.currentFilters[filterKey].filter(item => item !== value);
        }
    }

    populateSkillsFilter() {
        const skillsList = document.getElementById('skillsList');
        if (!skillsList) return;

        // Get all unique skills from freelancers
        const allSkills = [...new Set(this.freelancers.flatMap(f => f.skills))];
        
        skillsList.innerHTML = allSkills.map(skill => `
            <div class="skill-item">
                <input type="checkbox" value="${skill}" id="skill-${skill}">
                <span class="checkmark"></span>
                <label for="skill-${skill}">${skill}</label>
            </div>
        `).join('');

        // Add event listeners to skill checkboxes
        skillsList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleSkillFilter(e.target);
            });
        });
    }

    handleSkillFilter(checkbox) {
        const skill = checkbox.value;
        
        if (!this.currentFilters.skills) {
            this.currentFilters.skills = [];
        }
        
        if (checkbox.checked) {
            if (!this.currentFilters.skills.includes(skill)) {
                this.currentFilters.skills.push(skill);
            }
        } else {
            this.currentFilters.skills = this.currentFilters.skills.filter(s => s !== skill);
        }
    }

    searchSkills(query) {
        const skillsList = document.getElementById('skillsList');
        const skillItems = skillsList.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            const skillName = item.querySelector('label').textContent.toLowerCase();
            if (skillName.includes(query.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    applyFilters() {
        console.log('🔍 Applying filters...', this.currentFilters);
        
        let filtered = [...this.freelancers];

        // Search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(freelancer => 
                freelancer.name.toLowerCase().includes(searchTerm) ||
                freelancer.title.toLowerCase().includes(searchTerm) ||
                freelancer.bio.toLowerCase().includes(searchTerm) ||
                freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm))
            );
        }

        // Quick filters
        switch(this.currentFilters.quickFilter) {
            case 'available':
                filtered = filtered.filter(f => f.status === 'online');
                break;
            case 'premium':
                filtered = filtered.filter(f => f.premium);
                break;
            case 'top-rated':
                filtered = filtered.filter(f => f.rating >= 4.5);
                break;
            case 'verified':
                filtered = filtered.filter(f => f.verification.length >= 2);
                break;
            case 'online':
                filtered = filtered.filter(f => f.status === 'online');
                break;
            // 'all' - no filter needed
        }

        // Category filter
        if (this.currentFilters.category) {
            filtered = filtered.filter(freelancer => freelancer.category === this.currentFilters.category);
        }

        // Location filter
        if (this.currentFilters.location) {
            if (this.currentFilters.location === 'remote') {
                filtered = filtered.filter(freelancer => freelancer.availability.includes('remote'));
            } else {
                filtered = filtered.filter(freelancer => 
                    freelancer.location.toLowerCase().includes(this.currentFilters.location)
                );
            }
        }

        // Price filter
        if (this.currentFilters.price) {
            filtered = filtered.filter(freelancer => {
                const priceRange = this.currentFilters.price;
                
                if (priceRange === '100+') {
                    return freelancer.rate >= 100;
                }
                
                const [min, max] = priceRange.split('-').map(Number);
                return freelancer.rate >= min && freelancer.rate <= max;
            });
        }

        // Experience filter
        if (this.currentFilters.experience) {
            const expLevel = parseInt(this.currentFilters.experience);
            filtered = filtered.filter(freelancer => freelancer.experienceLevel >= expLevel);
        }

        // Skills filter
        if (this.currentFilters.skills.length > 0) {
            filtered = filtered.filter(freelancer => 
                this.currentFilters.skills.some(skill => 
                    freelancer.skills.includes(skill)
                )
            );
        }

        // Availability filter
        if (this.currentFilters.availability.length > 0) {
            filtered = filtered.filter(freelancer => 
                this.currentFilters.availability.some(availability => 
                    freelancer.availability.includes(availability)
                )
            );
        }

        // Languages filter
        if (this.currentFilters.languages.length > 0) {
            filtered = filtered.filter(freelancer => 
                this.currentFilters.languages.some(language => 
                    freelancer.languages.includes(language)
                )
            );
        }

        // Verification filter
        if (this.currentFilters.verification.length > 0) {
            filtered = filtered.filter(freelancer => 
                this.currentFilters.verification.some(verification => 
                    freelancer.verification.includes(verification)
                )
            );
        }

        // Rate range filter
        filtered = filtered.filter(freelancer => freelancer.rate <= this.currentFilters.maxRate);

        this.filteredFreelancers = filtered;
        this.currentPage = 1; // Reset to first page when filters change
        
        this.sortFreelancers();
        this.renderFreelancers();
        this.updateResultsInfo();
        this.updatePagination();

        console.log('✅ Filters applied. Results:', this.filteredFreelancers.length);
    }

    sortFreelancers() {
        switch(this.currentSort) {
            case 'newest':
                this.filteredFreelancers.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
                break;
            case 'rating':
                this.filteredFreelancers.sort((a, b) => b.rating - a.rating);
                break;
            case 'price-high':
                this.filteredFreelancers.sort((a, b) => b.rate - a.rate);
                break;
            case 'price-low':
                this.filteredFreelancers.sort((a, b) => a.rate - b.rate);
                break;
            case 'experience':
                this.filteredFreelancers.sort((a, b) => b.experienceLevel - a.experienceLevel);
                break;
            case 'projects':
                this.filteredFreelancers.sort((a, b) => b.projects - a.projects);
                break;
        }
    }

    renderFreelancers() {
        const freelancersGrid = document.getElementById('freelancersGrid');
        if (!freelancersGrid) {
            console.error('❌ freelancersGrid element not found!');
            return;
        }

        const startIndex = (this.currentPage - 1) * this.freelancersPerPage;
        const endIndex = startIndex + this.freelancersPerPage;
        const freelancersToShow = this.filteredFreelancers.slice(startIndex, endIndex);

        console.log('📊 Rendering freelancers:', freelancersToShow.length);

        if (freelancersToShow.length === 0) {
            freelancersGrid.innerHTML = this.getNoFreelancersHTML();
            return;
        }

        freelancersGrid.innerHTML = freelancersToShow.map(freelancer => this.getFreelancerHTML(freelancer)).join('');
        
        // Re-attach event listeners for the new buttons
        this.attachFreelancerButtonsListeners();
    }

    getFreelancerHTML(freelancer) {
        const isSaved = this.isFreelancerSaved(freelancer.id);
        const savedClass = isSaved ? 'saved' : '';
        const featuredClass = freelancer.featured ? 'featured' : '';
        const premiumClass = freelancer.premium ? 'premium' : '';
        const statusClass = freelancer.status === 'online' ? 'online' : 'offline';
        
        return `
            <div class="freelancer-card ${featuredClass} ${premiumClass}" data-freelancer-id="${freelancer.id}">
                <div class="freelancer-header">
                    <img src="${freelancer.avatar}" alt="${freelancer.name}" class="freelancer-avatar">
                    <div class="freelancer-info">
                        <h3 class="freelancer-name">${freelancer.name}</h3>
                        <p class="freelancer-title">${freelancer.title}</p>
                        <div class="freelancer-meta">
                            <span class="rating">
                                <i class="fas fa-star"></i> ${freelancer.rating}
                            </span>
                            <span class="location">
                                <i class="fas fa-map-marker-alt"></i> ${freelancer.location}
                            </span>
                            <span class="status ${statusClass}">
                                <i class="fas fa-circle"></i> ${freelancer.status === 'online' ? 'Onlayn' : 'Oflayn'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <p class="freelancer-bio">${freelancer.bio}</p>
                
                <div class="freelancer-skills">
                    ${freelancer.skills.slice(0, 4).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    ${freelancer.skills.length > 4 ? `<span class="skill-tag">+${freelancer.skills.length - 4}</span>` : ''}
                </div>
                
                <div class="freelancer-footer">
                    <div class="freelancer-rate">${freelancer.rateDisplay}</div>
                    <div class="freelancer-actions">
                        <button class="save-freelancer-btn ${savedClass}" data-freelancer-id="${freelancer.id}">
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button class="view-profile-btn" data-freelancer-id="${freelancer.id}">
                            Profilə Bax
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getNoFreelancersHTML() {
        return `
            <div class="no-freelancers">
                <div class="no-freelancers-icon">🔍</div>
                <h3>Heç bir freelancer tapılmadı</h3>
                <p>Filter parametrlərini dəyişin və ya daha sonra yoxlayın</p>
                <button class="view-profile-btn" onclick="freelancersSystem.resetFilters()">Bütün Filterləri Sıfırla</button>
            </div>
        `;
    }

    attachFreelancerButtonsListeners() {
        // Save freelancer buttons
        document.querySelectorAll('.save-freelancer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const freelancerId = parseInt(btn.dataset.freelancerId);
                this.handleSaveFreelancer(freelancerId, btn);
            });
        });

        // View profile buttons
        document.querySelectorAll('.view-profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const freelancerId = parseInt(btn.dataset.freelancerId);
                this.openProfileModal(freelancerId);
            });
        });

        // Freelancer card clicks
        document.querySelectorAll('.freelancer-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.freelancer-actions')) {
                    const freelancerId = parseInt(card.dataset.freelancerId);
                    this.openProfileModal(freelancerId);
                }
            });
        });
    }

    handleSaveFreelancer(freelancerId, button) {
        const isCurrentlySaved = button.classList.contains('saved');
        
        if (isCurrentlySaved) {
            this.unsaveFreelancer(freelancerId);
            button.classList.remove('saved');
            this.showNotification('Freelancer saxlananlardan silindi', 'info');
        } else {
            this.saveFreelancer(freelancerId);
            button.classList.add('saved');
            this.showNotification('Freelancer saxlananlara əlavə edildi', 'success');
        }
    }

    saveFreelancer(freelancerId) {
        let savedFreelancers = JSON.parse(localStorage.getItem('biznet_saved_freelancers')) || [];
        if (!savedFreelancers.includes(freelancerId)) {
            savedFreelancers.push(freelancerId);
            localStorage.setItem('biznet_saved_freelancers', JSON.stringify(savedFreelancers));
        }
    }

    unsaveFreelancer(freelancerId) {
        let savedFreelancers = JSON.parse(localStorage.getItem('biznet_saved_freelancers')) || [];
        savedFreelancers = savedFreelancers.filter(id => id !== freelancerId);
        localStorage.setItem('biznet_saved_freelancers', JSON.stringify(savedFreelancers));
    }

    isFreelancerSaved(freelancerId) {
        const savedFreelancers = JSON.parse(localStorage.getItem('biznet_saved_freelancers')) || [];
        return savedFreelancers.includes(freelancerId);
    }

    setupModalHandlers() {
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModals();
            });
        });

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target);
            });
        });

        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitContactForm();
            });
        }
    }

    openProfileModal(freelancerId) {
        const freelancer = this.freelancers.find(f => f.id === freelancerId);
        if (!freelancer) return;

        const modal = document.getElementById('profileModal');
        
        // Populate modal data
        document.getElementById('modalAvatar').src = freelancer.avatar;
        document.getElementById('modalName').textContent = freelancer.name;
        document.getElementById('modalTitle').textContent = freelancer.title;
        document.getElementById('modalRating').innerHTML = `<i class="fas fa-star"></i> ${freelancer.rating}`;
        document.getElementById('modalLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${freelancer.location}`;
        document.getElementById('modalStatus').innerHTML = `<i class="fas fa-circle"></i> ${freelancer.status === 'online' ? 'Onlayn' : 'Oflayn'}`;
        document.getElementById('modalAbout').textContent = freelancer.bio;
        document.getElementById('modalHourlyRate').textContent = freelancer.rateDisplay;
        document.getElementById('modalExperience').textContent = freelancer.experience;
        document.getElementById('modalLanguages').textContent = freelancer.languages.join(', ');
        document.getElementById('modalVerification').textContent = freelancer.verification.map(v => {
            const map = {
                'email-verified': 'Email',
                'phone-verified': 'Telefon',
                'portfolio-verified': 'Portfolio'
            };
            return map[v] || v;
        }).join(', ');

        // Populate skills
        const skillsTags = document.getElementById('modalSkills');
        skillsTags.innerHTML = freelancer.skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');

        modal.style.display = 'block';
        modal.dataset.freelancerId = freelancerId;
        document.body.style.overflow = 'hidden';
    }

    switchTab(button) {
        const tabName = button.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Show corresponding content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
    }

    openContactModal() {
        const profileModal = document.getElementById('profileModal');
        const contactModal = document.getElementById('contactModal');
        
        profileModal.style.display = 'none';
        contactModal.style.display = 'block';
    }

    closeContactModal() {
        const profileModal = document.getElementById('profileModal');
        const contactModal = document.getElementById('contactModal');
        
        contactModal.style.display = 'none';
        profileModal.style.display = 'block';
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    submitContactForm() {
        const contactModal = document.getElementById('contactModal');
        const freelancerId = contactModal.dataset.freelancerId;
        const freelancer = this.freelancers.find(f => f.id == freelancerId);
        
        console.log('📤 Contact form submitted for freelancer:', freelancerId);
        
        this.showNotification('Mesajınız uğurla göndərildi! Freelancer tezliklə sizlə əlaqə saxlayacaq.', 'success');
        this.closeModals();
        
        // Reset form
        document.getElementById('contactForm').reset();
    }

    updateResultsInfo() {
        const resultsCount = document.getElementById('resultsCount');
        const resultsFilter = document.getElementById('resultsFilter');
        
        if (resultsCount) {
            resultsCount.textContent = `${this.filteredFreelancers.length} freelancer tapıldı`;
        }
        
        if (resultsFilter) {
            const activeFilters = Object.values(this.currentFilters).filter(val => 
                val && (Array.isArray(val) ? val.length > 0 : val !== 'all' && val !== 200)
            ).length;
            
            if (activeFilters > 1) { // search is always there
                resultsFilter.textContent = `${activeFilters - 1} filter tətbiq olundu`;
            } else {
                resultsFilter.textContent = 'Filterlər tətbiq olunmayıb';
            }
        }
    }

    updatePagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        this.totalPages = Math.ceil(this.filteredFreelancers.length / this.freelancersPerPage);
        
        if (this.totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        
        // Update prev/next buttons
        const prevBtn = pagination.querySelector('.prev-btn');
        const nextBtn = pagination.querySelector('.next-btn');
        
        prevBtn.classList.toggle('disabled', this.currentPage === 1);
        nextBtn.classList.toggle('disabled', this.currentPage === this.totalPages);
        
        // Update page numbers (simplified for now)
        const pageNumbers = pagination.querySelector('.page-numbers');
        let pagesHTML = '';
        
        for (let i = 1; i <= Math.min(this.totalPages, 5); i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            pagesHTML += `<button class="page-btn ${activeClass}">${i}</button>`;
        }
        
        if (this.totalPages > 5) {
            pagesHTML += '<span class="page-dots">...</span>';
            pagesHTML += `<button class="page-btn">${this.totalPages}</button>`;
        }
        
        pageNumbers.innerHTML = pagesHTML;
    }

    handlePagination(button) {
        if (button.classList.contains('disabled')) return;
        
        if (button.classList.contains('prev-btn')) {
            this.currentPage--;
        } else if (button.classList.contains('next-btn')) {
            this.currentPage++;
        } else {
            this.currentPage = parseInt(button.textContent);
        }
        
        this.renderFreelancers();
        this.updatePagination();
        
        // Scroll to top of freelancers grid
        const freelancersGrid = document.getElementById('freelancersGrid');
        if (freelancersGrid) {
            freelancersGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    resetFilters() {
        console.log('🧹 Clearing all filters...');
        
        // Reset filter state
        this.currentFilters = {
            search: '',
            quickFilter: 'all',
            category: '',
            location: '',
            price: '',
            experience: '',
            skills: [],
            availability: [],
            languages: [],
            verification: [],
            maxRate: 200
        };
        
        // Reset UI
        document.getElementById('freelancerSearch').value = '';
        document.getElementById('rateRange').value = 200;
        document.getElementById('rateValue').textContent = '₼ 200';
        
        document.querySelectorAll('.filter-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === 0); // First button (All) active
        });
        
        document.querySelectorAll('.filter-select').forEach(select => {
            select.value = '';
        });
        
        document.querySelectorAll('.checkbox input').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        document.querySelectorAll('.skill-item input').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Re-apply filters
        this.applyFilters();
        this.showNotification('Bütün filterlər sıfırlandı', 'info');
    }

    debouncedSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.applyFilters();
        }, 500);
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border-left: 4px solid #4299e1;
                    z-index: 10000;
                    max-width: 300px;
                    animation: slideInRight 0.3s ease;
                }
                .notification.success {
                    border-left-color: #48bb78;
                }
                .notification.error {
                    border-left-color: #e53e3e;
                }
                .notification.info {
                    border-left-color: #4299e1;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: #718096;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Global functions for HTML onclick handlers
function openContactModal() {
    window.freelancersSystem.openContactModal();
}

function closeContactModal() {
    window.freelancersSystem.closeContactModal();
}

function saveFreelancer() {
    const modal = document.getElementById('profileModal');
    const freelancerId = parseInt(modal.dataset.freelancerId);
    window.freelancersSystem.saveFreelancer(freelancerId);
    window.freelancersSystem.showNotification('Freelancer saxlananlara əlavə edildi', 'success');
}

// Initialize the freelancers system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM loaded, initializing Freelancers System...');
    window.freelancersSystem = new FreelancersSystem();
});