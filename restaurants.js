// RESTAURANTS MANAGEMENT SYSTEM
class RestaurantsSystem {
    constructor() {
        this.restaurants = [];
        this.filteredRestaurants = [];
        this.currentFilters = {
            type: 'all',
            search: '',
            location: [],
            cuisine: [],
            features: [],
            price: 'all'
        };
        this.currentSort = 'rating';
        this.currentPage = 1;
        this.restaurantsPerPage = 9;
        this.init();
    }

    init() {
        this.loadRestaurants();
        this.setupEventListeners();
        this.applyFilters();
        console.log('🍽️ Restaurants system initialized');
    }

    loadRestaurants() {
        // Örnek veri - gerçek uygulamada API'den çekilecek
        this.restaurants = [
            {
                id: 1,
                name: 'Lezzet Restoran',
                type: 'restaurant',
                cuisine: 'turkish',
                location: 'baku',
                activeJobs: 8,
                description: 'Ən ləziz türk mətbəxi. Ən yaxşı keyfiyyət və xidmət. 5 ildir bazar lideri.',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.8,
                reviewCount: 234,
                features: ['delivery', 'takeaway', 'terrace', 'parking', 'wifi'],
                priceRange: 'medium',
                jobs: [
                    { position: 'Aşpaz', salary: '₼ 800-1200' },
                    { position: 'Ofisiant', salary: '₼ 400-600' },
                    { position: 'Kassir', salary: '₼ 350-500' }
                ],
                premium: true,
                delivery: true,
                phone: '+994 12 345 67 89',
                address: 'Nizami küçəsi 123',
                workingHours: '09:00 - 00:00'
            },
            {
                id: 2,
                name: 'Fresh Market',
                type: 'market',
                cuisine: 'local',
                location: 'ganja',
                activeJobs: 5,
                description: 'Təzə tərəvəz, meyvə və ərzaq məhsulları. Ən yaxşı qiymətlər.',
                image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.6,
                reviewCount: 156,
                features: ['parking'],
                priceRange: 'budget',
                jobs: [
                    { position: 'Satış köməkçisi', salary: '₼ 350-450' },
                    { position: 'Kassir', salary: '₼ 300-400' },
                    { position: 'Anbar işçisi', salary: '₼ 400-500' }
                ],
                premium: false,
                delivery: false,
                phone: '+994 22 345 67 89',
                address: 'Şah İsmayıl Xətai pr. 45',
                workingHours: '07:00 - 23:00'
            },
            {
                id: 3,
                name: 'Pizza Palace',
                type: 'restaurant',
                cuisine: 'italian',
                location: 'baku',
                activeJobs: 6,
                description: 'Ən ləziz italyan pizzaları. Həqiqi italyan reseptləri.',
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.7,
                reviewCount: 189,
                features: ['delivery', 'takeaway', 'wifi'],
                priceRange: 'medium',
                jobs: [
                    { position: 'Pizza aşpazı', salary: '₼ 600-900' },
                    { position: 'Ofisiant', salary: '₼ 400-550' }
                ],
                premium: false,
                delivery: true,
                phone: '+994 12 987 65 43',
                address: 'Füzuli küçəsi 78',
                workingHours: '10:00 - 00:00'
            },
            {
                id: 4,
                name: 'Sushi Master',
                type: 'restaurant',
                cuisine: 'asian',
                location: 'baku',
                activeJobs: 4,
                description: 'Ən təzə balıq və ənənəvi yapon texnikaları. Professional şeflər.',
                image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.9,
                reviewCount: 267,
                features: ['delivery', 'takeaway', 'wifi'],
                priceRange: 'high',
                jobs: [
                    { position: 'Suşi şefi', salary: '₼ 1200-1800' },
                    { position: 'Ofisiant', salary: '₼ 500-700' }
                ],
                premium: true,
                delivery: true,
                phone: '+994 12 555 44 33',
                address: 'Neftçilər pr. 156',
                workingHours: '11:00 - 23:00'
            },
            {
                id: 5,
                name: 'Burger House',
                type: 'fastfood',
                cuisine: 'american',
                location: 'sumgait',
                activeJobs: 3,
                description: 'Ən dadlı burgerlər və kartof fri. Sürətli xidmət.',
                image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.5,
                reviewCount: 134,
                features: ['delivery', 'takeaway'],
                priceRange: 'budget',
                jobs: [
                    { position: 'Burger aşpazı', salary: '₼ 400-600' },
                    { position: 'Kassir', salary: '₼ 300-450' }
                ],
                premium: false,
                delivery: true,
                phone: '+994 18 123 45 67',
                address: 'M.Ə.Rəsulzadə küçəsi 89',
                workingHours: '08:00 - 02:00'
            },
            {
                id: 6,
                name: 'Coffee Lab',
                type: 'cafe',
                cuisine: 'european',
                location: 'baku',
                activeJobs: 4,
                description: 'Xüsusi qovrulmuş kofe çeşidləri. Rahat atmosfer.',
                image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.6,
                reviewCount: 178,
                features: ['wifi', 'terrace'],
                priceRange: 'medium',
                jobs: [
                    { position: 'Barista', salary: '₼ 500-700' },
                    { position: 'Ofisiant', salary: '₼ 400-550' }
                ],
                premium: true,
                delivery: false,
                phone: '+994 12 777 88 99',
                address: 'R.Behbudov küçəsi 34',
                workingHours: '07:00 - 23:00'
            },
            {
                id: 7,
                name: 'Azərbaycan Ev Restoranı',
                type: 'restaurant',
                cuisine: 'azeri',
                location: 'baku',
                activeJobs: 7,
                description: 'Ənənəvi Azərbaycan mətbəxi. Ev dadı və rahat atmosfer.',
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.7,
                reviewCount: 312,
                features: ['terrace', 'parking', 'wifi'],
                priceRange: 'medium',
                jobs: [
                    { position: 'Azərbaycan aşpazı', salary: '₼ 700-1000' },
                    { position: 'Ofisiant', salary: '₼ 450-600' },
                    { position: 'Qənnadı', salary: '₼ 500-700' }
                ],
                premium: false,
                delivery: true,
                phone: '+994 12 444 55 66',
                address: 'İstiqlaliyyət küçəsi 25',
                workingHours: '10:00 - 23:00'
            },
            {
                id: 8,
                name: 'Green Market',
                type: 'market',
                cuisine: 'local',
                location: 'lankaran',
                activeJobs: 4,
                description: 'Təbii və orqanik məhsullar. Ən təzə tərəvəz və meyvələr.',
                image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.4,
                reviewCount: 98,
                features: ['parking'],
                priceRange: 'budget',
                jobs: [
                    { position: 'Satış nümayəndəsi', salary: '₼ 300-400' },
                    { position: 'Kassir', salary: '₼ 280-350' }
                ],
                premium: false,
                delivery: false,
                phone: '+994 25 123 45 67',
                address: 'Dədə Qorqud küçəsi 12',
                workingHours: '08:00 - 22:00'
            },
            {
                id: 9,
                name: 'Elite Steakhouse',
                type: 'restaurant',
                cuisine: 'european',
                location: 'baku',
                activeJobs: 5,
                description: 'Premium ət məhsulları və eksklüziv şərait. Xüsusi şərait.',
                image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.9,
                reviewCount: 201,
                features: ['terrace', 'parking', 'wifi'],
                priceRange: 'premium',
                jobs: [
                    { position: 'Şef', salary: '₼ 1500-2500' },
                    { position: 'Ofisiant', salary: '₼ 600-900' }
                ],
                premium: true,
                delivery: false,
                phone: '+994 12 999 88 77',
                address: 'Neftçilər pr. 203',
                workingHours: '12:00 - 00:00'
            }
        ];
        
        this.filteredRestaurants = [...this.restaurants];
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
                this.searchRestaurants();
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
    }

    handleQuickFilter(button) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        button.classList.add('active');
        
        const filterType = button.dataset.type;
        this.currentFilters.type = filterType;
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

    searchRestaurants() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        this.currentFilters.search = searchTerm;
        this.applyFilters();
    }

    handleSortChange(sortType) {
        this.currentSort = sortType;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredRestaurants = this.restaurants.filter(restaurant => {
            // Type filter
            if (this.currentFilters.type !== 'all' && restaurant.type !== this.currentFilters.type) {
                return false;
            }
            
            // Search filter
            if (this.currentFilters.search && 
                !restaurant.name.toLowerCase().includes(this.currentFilters.search) &&
                !restaurant.description.toLowerCase().includes(this.currentFilters.search)) {
                return false;
            }
            
            // Location filter
            if (this.currentFilters.location.length > 0 && 
                !this.currentFilters.location.includes(restaurant.location)) {
                return false;
            }
            
            // Cuisine filter
            if (this.currentFilters.cuisine.length > 0 && 
                !this.currentFilters.cuisine.includes(restaurant.cuisine)) {
                return false;
            }
            
            // Features filter
            if (this.currentFilters.features.length > 0) {
                const hasAllFeatures = this.currentFilters.features.every(feature => 
                    restaurant.features.includes(feature)
                );
                if (!hasAllFeatures) return false;
            }
            
            // Price filter
            if (this.currentFilters.price !== 'all' && 
                restaurant.priceRange !== this.currentFilters.price) {
                return false;
            }
            
            return true;
        });
        
        this.sortRestaurants();
        this.renderRestaurants();
        this.updateResultsInfo();
        this.updatePagination();
    }

    sortRestaurants() {
        switch(this.currentSort) {
            case 'rating':
                this.filteredRestaurants.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                // For demo, we'll sort by ID (assuming newer ones have higher IDs)
                this.filteredRestaurants.sort((a, b) => b.id - a.id);
                break;
            case 'jobs':
                this.filteredRestaurants.sort((a, b) => b.activeJobs - a.activeJobs);
                break;
            case 'name':
                this.filteredRestaurants.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    resetFilters() {
        this.currentFilters = {
            type: 'all',
            search: '',
            location: [],
            cuisine: [],
            features: [],
            price: 'all'
        };
        
        document.getElementById('searchInput').value = '';
        document.getElementById('sortSelect').value = 'rating';
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector('.filter-btn[data-type="all"]').classList.add('active');
        
        document.querySelectorAll('.checkbox input, .radio input').forEach(input => {
            input.checked = false;
        });
        
        document.querySelector('.radio input[value="all"]').checked = true;
        
        this.applyFilters();
    }

    renderRestaurants() {
        const restaurantsGrid = document.getElementById('restaurantsGrid');
        if (!restaurantsGrid) return;

        const startIndex = (this.currentPage - 1) * this.restaurantsPerPage;
        const endIndex = startIndex + this.restaurantsPerPage;
        const restaurantsToShow = this.filteredRestaurants.slice(startIndex, endIndex);

        if (restaurantsToShow.length === 0) {
            restaurantsGrid.innerHTML = this.getNoRestaurantsHTML();
            return;
        }

        restaurantsGrid.innerHTML = restaurantsToShow.map(restaurant => this.getRestaurantHTML(restaurant)).join('');
    }

    getRestaurantHTML(restaurant) {
        const typeNames = {
            'restaurant': 'Restoran',
            'market': 'Market',
            'cafe': 'Kafe',
            'fastfood': 'Fast Food'
        };

        const cuisineNames = {
            'turkish': 'Türk',
            'italian': 'İtalyan',
            'asian': 'Asiya',
            'american': 'Amerikan',
            'european': 'Avropa',
            'local': 'Yerli',
            'azeri': 'Azərbaycan'
        };

        const locationNames = {
            'baku': 'Bakı',
            'ganja': 'Gəncə',
            'sumgait': 'Sumqayıt',
            'lankaran': 'Lənkəran'
        };

        const priceRangeLabels = {
            'budget': '₼',
            'medium': '₼₼',
            'high': '₼₼₼',
            'premium': '₼₼₼₼'
        };

        return `
            <div class="restaurant-card ${restaurant.premium ? 'premium' : ''}">
                ${restaurant.premium ? '<div class="premium-badge">PREMIUM</div>' : ''}
                
                <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
                
                <div class="restaurant-content">
                    <div class="restaurant-header">
                        <div>
                            <h3 class="restaurant-name">${restaurant.name}</h3>
                            <div class="restaurant-type">${typeNames[restaurant.type]} • ${cuisineNames[restaurant.cuisine]} mətbəxi</div>
                        </div>
                        <div class="restaurant-rating">
                            <i class="fas fa-star"></i>
                            <span class="rating-value">${restaurant.rating}</span>
                        </div>
                    </div>

                    <div class="restaurant-meta">
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${locationNames[restaurant.location]}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-briefcase"></i>
                            <span>${restaurant.activeJobs} vakansiya</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${restaurant.workingHours}</span>
                        </div>
                    </div>

                    <p class="restaurant-description">${restaurant.description}</p>

                    <div class="restaurant-features">
                        ${restaurant.features.map(feature => {
                            const featureIcons = {
                                'delivery': 'fas fa-truck',
                                'takeaway': 'fas fa-shopping-bag',
                                'terrace': 'fas fa-umbrella-beach',
                                'parking': 'fas fa-parking',
                                'wifi': 'fas fa-wifi'
                            };
                            return `<span class="feature-tag"><i class="${featureIcons[feature]}"></i> ${feature}</span>`;
                        }).join('')}
                    </div>

                    <div class="restaurant-jobs">
                        <div class="jobs-title">Açıq Vəzifələr</div>
                        <div class="job-items">
                            ${restaurant.jobs.slice(0, 2).map(job => `
                                <div class="job-item">
                                    <span class="job-position">${job.position}</span>
                                    <span class="job-salary">${job.salary}</span>
                                </div>
                            `).join('')}
                            ${restaurant.jobs.length > 2 ? 
                                `<div class="job-item">
                                    <span class="job-position">+${restaurant.jobs.length - 2} digər vəzifə</span>
                                    <span class="job-salary"></span>
                                </div>` : ''}
                        </div>
                    </div>

                    <div class="restaurant-footer">
                        <div class="price-range">${priceRangeLabels[restaurant.priceRange]}</div>
                        <div class="restaurant-actions">
                            <a href="tel:${restaurant.phone}" class="action-btn contact-btn">
                                <i class="fas fa-phone"></i> Zəng et
                            </a>
                            <a href="jobs.html?restaurant=${restaurant.id}" class="action-btn apply-btn">
                                <i class="fas fa-briefcase"></i> Müraciət et
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getNoRestaurantsHTML() {
        return `
            <div class="no-results">
                <i class="fas fa-utensils"></i>
                <h3>Heç bir restoran və ya market tapılmadı</h3>
                <p>Filter parametrlərini dəyişin və ya daha sonra yoxlayın</p>
                <button class="action-btn contact-btn" onclick="restaurantsSystem.resetFilters()">
                    <i class="fas fa-times"></i> Filterləri Sıfırla
                </button>
            </div>
        `;
    }

    updateResultsInfo() {
        const resultsCount = document.getElementById('resultsCount');
        const filterInfo = document.getElementById('filterInfo');
        
        if (resultsCount && filterInfo) {
            const count = this.filteredRestaurants.length;
            resultsCount.textContent = `${count} restoran və market tapıldı`;
            
            // Filter info text
            const activeFilters = [];
            if (this.currentFilters.type !== 'all') {
                activeFilters.push(`Növ: ${this.currentFilters.type}`);
            }
            if (this.currentFilters.search) {
                activeFilters.push(`Axtarış: "${this.currentFilters.search}"`);
            }
            if (this.currentFilters.location.length > 0) {
                activeFilters.push(`Şəhər: ${this.currentFilters.location.length}`);
            }
            if (this.currentFilters.cuisine.length > 0) {
                activeFilters.push(`Mətbəx: ${this.currentFilters.cuisine.length}`);
            }
            if (this.currentFilters.features.length > 0) {
                activeFilters.push(`Xüsusiyyət: ${this.currentFilters.features.length}`);
            }
            if (this.currentFilters.price !== 'all') {
                activeFilters.push(`Qiymət: ${this.currentFilters.price}`);
            }
            
            filterInfo.textContent = activeFilters.length > 0 ? 
                `Filterlər: ${activeFilters.join(', ')}` : 
                'Filterlər tətbiq olunmayıb';
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredRestaurants.length / this.restaurantsPerPage);
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
        this.renderRestaurants();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredRestaurants.length / this.restaurantsPerPage);
        if (this.currentPage < totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }
}

// Initialize restaurants system
document.addEventListener('DOMContentLoaded', () => {
    window.restaurantsSystem = new RestaurantsSystem();
});