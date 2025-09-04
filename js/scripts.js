
// Prime Properties Real Estate JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0,0,0,0.12)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.96)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        }
    });

    // Animated counters
    const animateCounters = () => {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (target === 500) {
                        counter.textContent = '$' + Math.ceil(current) + 'M';
                    } else if (target === 98) {
                        counter.textContent = Math.ceil(current) + '%';
                    } else {
                        counter.textContent = Math.ceil(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target === 500) {
                        counter.textContent = '$' + target + 'M';
                    } else if (target === 98) {
                        counter.textContent = target + '%';
                    } else {
                        counter.textContent = target;
                    }
                }
            };
            
            updateCounter();
        });
    };

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger counter animation
                if (entry.target.querySelector('[data-count]')) {
                    setTimeout(animateCounters, 500);
                }
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    const elementsToAnimate = document.querySelectorAll('.property-card, .agent-card, '.hero-stats', '.about-stat'));
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Property search functionality
    const searchButton = document.getElementById('searchProperties');
    const propertyType = document.getElementById('propertyType');
    const priceRange = document.getElementById('priceRange');
    const bedrooms = document.getElementById('bedrooms');

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const type = propertyType.value;
            const price = priceRange.value;
            const beds = bedrooms.value;
            
            let searchCriteria = [];
            if (type) searchCriteria.push(`Type: ${type}`);
            if (price) searchCriteria.push(`Price: ${formatPriceRange(price)}`);
            if (beds) searchCriteria.push(`Bedrooms: ${beds}+`);
            
            if (searchCriteria.length > 0) {
                showSearchResults(searchCriteria.join(', '));
            } else {
                alert('Please select at least one search criteria');
            }
        });
    }

    // Property filtering
    const filterButtons = document.querySelectorAll('.btn-filter');
    const propertyItems = document.querySelectorAll('.property-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter properties
            propertyItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hide');
                    setTimeout(() => {
                        item.style.display = 'block';
                    }, 50);
                } else {
                    item.classList.add('hide');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Mortgage calculator
    const homePrice = document.getElementById('homePrice');
    const downPayment = document.getElementById('downPayment');
    const interestRate = document.getElementById('interestRate');
    const loanTerm = document.getElementById('loanTerm');

    if (homePrice && downPayment) {
        homePrice.addEventListener('input', updateDownPaymentPercent);
        downPayment.addEventListener('input', updateDownPaymentPercent);
        
        // Initial calculation
        calculateMortgage();
    }

    function updateDownPaymentPercent() {
        const price = parseFloat(homePrice.value) || 0;
        const down = parseFloat(downPayment.value) || 0;
        const percent = price > 0 ? ((down / price) * 100).toFixed(1) : 0;
        document.getElementById('downPaymentPercent').textContent = percent + '%';
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const data = {
                firstName: document.getElementById('contactFirstName').value,
                lastName: document.getElementById('contactLastName').value,
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,
                inquiryType: document.getElementById('inquiryType').value,
                priceRange: document.getElementById('priceRangeContact').value,
                timeframe: document.getElementById('timeframe').value,
                message: document.getElementById('contactMessage').value
            };
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending Message...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                const successAlert = document.createElement('div');
                successAlert.className = 'alert alert-success mt-3';
                
                const inquiryTypeName = getInquiryTypeName(data.inquiryType);
                const timeframeName = getTimeframeName(data.timeframe);
                const priceRangeName = getPriceRangeName(data.priceRange);
                
                successAlert.innerHTML = `
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>Thank You for Contacting Prime Properties! 🏡</strong><br>
                    Hello ${data.firstName} ${data.lastName}, we've received your ${inquiryTypeName.toLowerCase()} inquiry.
                    <br><br>
                    <small>
                        <strong>Your Inquiry Details:</strong><br>
                        • Interest: ${inquiryTypeName}<br>
                        ${data.priceRange ? `• Budget: ${priceRangeName}<br>` : ''}
                        ${data.timeframe ? `• Timeline: ${timeframeName}<br>` : ''}
                        • Contact: ${data.email} | ${data.phone}<br>
                        <br>
                        <strong>What's Next:</strong><br>
                        1. One of our expert agents will review your needs<br>
                        2. We'll call you within 4 hours to discuss your requirements<br>
                        3. Schedule a consultation or property viewing<br>
                        4. Begin your Austin real estate journey with confidence<br>
                        <br>
                        <strong>Immediate Questions?</strong> Call our office at (512) 555-0199<br>
                        <strong>Ready to start?</strong> Browse our featured properties while you wait! 🌟
                    </small>
                `;
                
                this.parentNode.insertBefore(successAlert, this.nextSibling);
                
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    successAlert.remove();
                }, 18000);
                
                successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
            }, 2000);
        });
    }

    // Property card interactions
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.classList.add('luxury-card');
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-18px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Agent card interactions
    const agentCards = document.querySelectorAll('.agent-card');
    agentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Property favorites functionality
    const favoriteButtons = document.querySelectorAll('.btn-outline-navy');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (this.innerHTML.includes('fa-heart')) {
                const isFavorited = this.innerHTML.includes('fas');
                
                if (isFavorited) {
                    this.innerHTML = '<i class="far fa-heart"></i>';
                    this.classList.remove('text-danger');
                    showToast('Property removed from favorites', 'info');
                } else {
                    this.innerHTML = '<i class="fas fa-heart"></i>';
                    this.classList.add('text-danger');
                    showToast('Property added to favorites!', 'success');
                }
            }
        });
    });

    // Advanced search functionality
    function showSearchResults(criteria) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-navy">Search Results</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <h6 class="alert-heading">Search Criteria: ${criteria}</h6>
                            <p class="mb-0">We found several properties matching your criteria. Our agents are preparing a customized list for you.</p>
                        </div>
                        <div class="text-center">
                            <i class="fas fa-home fa-3x text-gold mb-3"></i>
                            <h6>Your Perfect Home Awaits!</h6>
                            <p>Based on your search criteria, we'll connect you with properties that match your needs and budget.</p>
                            <button class="btn btn-gold me-2" onclick="document.querySelector('#contact').scrollIntoView({behavior: 'smooth'}); bootstrap.Modal.getInstance(this.closest('.modal')).hide();">
                                Contact an Agent
                            </button>
                            <button class="btn btn-outline-navy" onclick="bootstrap.Modal.getInstance(this.closest('.modal')).hide();">
                                Continue Browsing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modal);
        });
    }

    // Toast notification system
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast align-items-center border-0 show`;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            background: ${type === 'success' ? 'linear-gradient(135deg, var(--gold), var(--dark-gold))' : 'var(--navy)'};
            color: white;
            border-radius: 10px;
        `;
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentNode.parentNode.remove()"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }

    // Utility functions
    function formatPriceRange(range) {
        const ranges = {
            '0-500000': 'Under $500K',
            '500000-1000000': '$500K - $1M',
            '1000000-2000000': '$1M - $2M',
            '2000000+': '$2M+'
        };
        return ranges[range] || range;
    }

    function getPriceRangeName(range) {
        const ranges = {
            '0-300000': 'Under $300K',
            '300000-500000': '$300K - $500K',
            '500000-750000': '$500K - $750K',
            '750000-1000000': '$750K - $1M',
            '1000000-2000000': '$1M - $2M',
            '2000000+': '$2M+'
        };
        return ranges[range] || 'Custom Range';
    }

    function getInquiryTypeName(inquiry) {
        const inquiries = {
            'buying': 'Home Buying',
            'selling': 'Property Selling',
            'renting': 'Rental Properties',
            'investment': 'Investment Opportunities',
            'market-analysis': 'Market Analysis',
            'other': 'General Real Estate'
        };
        return inquiries[inquiry] || inquiry;
    }

    function getTimeframeName(timeframe) {
        const timeframes = {
            'immediately': 'Ready to move now',
            '1-3months': 'Within 1-3 months',
            '3-6months': 'Within 3-6 months',
            '6-12months': 'Within 6-12 months',
            'just-looking': 'Just exploring options'
        };
        return timeframes[timeframe] || timeframe;
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        if (hero && window.innerWidth > 768) {
            hero.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    // Loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Mobile menu enhancement
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        const mobileLinks = navbarCollapse.querySelectorAll('.nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            });
        });
    }

    // Add scroll progress indicator
    const createScrollIndicator = () => {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, var(--gold), var(--navy));
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(indicator);
        
        window.addEventListener('scroll', () => {
            const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            indicator.style.width = scrolled + '%';
        });
    };
    
    createScrollIndicator();

    console.log('Prime Properties real estate website loaded successfully! 🏡✨');
});

// Global mortgage calculator function
function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const loanTerm = parseInt(document.getElementById('loanTerm').value) || 30;
    
    // Calculate loan amount
    const loanAmount = homePrice - downPayment;
    
    // Calculate monthly payment
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = loanTerm * 12;
    
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
        monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
        monthlyPayment = loanAmount / numPayments;
    }
    
    // Calculate totals
    const totalAmount = monthlyPayment * numPayments;
    const totalInterest = totalAmount - loanAmount;
    
    // Calculate additional costs (estimates)
    const propertyTax = (homePrice * 0.015) / 12; // 1.5% annually
    const insurance = (homePrice * 0.005) / 12; // 0.5% annually
    const pmi = (downPayment / homePrice < 0.2) ? (loanAmount * 0.005) / 12 : 0; // 0.5% if less than 20% down
    
    const totalMonthly = monthlyPayment + propertyTax + insurance + pmi;
    
    // Update display
    document.getElementById('monthlyPayment').textContent = '$' + monthlyPayment.toFixed(0);
    document.getElementById('loanAmount').textContent = '$' + loanAmount.toLocaleString();
    document.getElementById('totalInterest').textContent = '$' + totalInterest.toFixed(0);
    document.getElementById('totalAmount').textContent = '$' + totalAmount.toFixed(0);
    document.getElementById('propertyTax').textContent = '$' + propertyTax.toFixed(0);
    document.getElementById('insurance').textContent = '$' + insurance.toFixed(0);
    document.getElementById('pmi').textContent = '$' + pmi.toFixed(0);
    document.getElementById('totalMonthly').textContent = '$' + totalMonthly.toFixed(0);
    
    // Update down payment percentage
    const percent = homePrice > 0 ? ((downPayment / homePrice) * 100).toFixed(1) : 0;
    document.getElementById('downPaymentPercent').textContent = percent + '%';
}

// Property comparison feature
window.compareProperties = function(propertyIds) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-navy">Property Comparison</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-info">
                        <h6 class="alert-heading">Compare Properties Side by Side</h6>
                        <p class="mb-0">This feature helps you evaluate multiple properties to make the best decision for your needs.</p>
                    </div>
                    <div class="text-center">
                        <i class="fas fa-balance-scale fa-3x text-gold mb-3"></i>
                        <h6>Property Comparison Tool</h6>
                        <p>Contact our agents to set up a detailed property comparison with market analysis, neighborhood insights, and investment potential.</p>
                        <button class="btn btn-gold" onclick="document.querySelector('#contact').scrollIntoView({behavior: 'smooth'}); bootstrap.Modal.getInstance(this.closest('.modal')).hide();">
                            Request Comparison Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
};

// Virtual tour simulation
window.startVirtualTour = function(propertyId) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-navy">Virtual Property Tour</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <i class="fas fa-vr-cardboard fa-4x text-gold mb-4"></i>
                    <h4>360° Virtual Tour Available</h4>
                    <p>Experience this property from the comfort of your home with our immersive virtual tour technology.</p>
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="bg-light p-4 rounded">
                                <h6>Tour Features:</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-check text-gold me-2"></i>360° room views</li>
                                    <li><i class="fas fa-check text-gold me-2"></i>Interactive floor plans</li>
                                    <li><i class="fas fa-check text-gold me-2"></i>Detailed property information</li>
                                    <li><i class="fas fa-check text-gold me-2"></i>Neighborhood insights</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <button class="btn btn-gold me-2" onclick="alert('Virtual tour would launch here in a real application')">
                            Start Virtual Tour
                        </button>
                        <button class="btn btn-outline-navy" onclick="document.querySelector('#contact').scrollIntoView({behavior: 'smooth'}); bootstrap.Modal.getInstance(this.closest('.modal')).hide();">
                            Schedule Live Tour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
};
