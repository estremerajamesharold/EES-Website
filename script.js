// script.js - Updated with centralized data management

// Centralized data using localStorage
function getSiteData() {
  const saved = localStorage.getItem('eliteview_siteData');
  if (saved) return JSON.parse(saved);
  return { 
    heroSlides: [
        { 
        image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", 
        title: "Advanced Security Solutions", 
        subtitle: "Protect what matters most with our cutting-edge surveillance technology" 
        },
        { 
            image: "https://images.unsplash.com/photo-1581093458799-ef0e5c86665f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", 
            title: "Smart Home Security", 
            subtitle: "Integrate IoT devices for comprehensive home protection" 
        },
        { 
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", 
            title: "Commercial Security Solutions", 
            subtitle: "Enterprise-grade security systems for businesses of all sizes" 
        }
    ],
    products: [], 
    news: [], 
    team: [], 
    media: [] 
    };
}

function saveSiteData(newData) {
  try {
    localStorage.setItem('eliteview_siteData', JSON.stringify(newData));
  } catch (e) {
    console.error('Failed to save ', e);
    alert('Could not save data. Your browser may be in private mode.');
  }
}

// DOM Elements
const carouselSlides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const backToTopBtn = document.getElementById('backToTop');
const mobileToggle = document.querySelector('.mobile-toggle');
const navbar = document.querySelector('.navbar ul');
const adminLogin = document.getElementById('adminLogin');
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('loginMessage');
const successSound = document.getElementById('successSound');
const errorSound = document.getElementById('errorSound');
const inquiryForm = document.getElementById('inquiryForm');
const contentModal = document.getElementById('contentModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close');

let currentSlide = 0;
const slideCount = carouselSlides.length;
let keySequence = '';
const DAHUA_SEQUENCE = 'DAHUA';

// Initialize carousel
function initCarousel() {
    if (carouselSlides.length === 0) return;
    
    // Set first slide as active
    carouselSlides[0].classList.add('active');
    dots[0].classList.add('active');
    
    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Go to specific slide
function goToSlide(slideIndex) {
    if (carouselSlides.length === 0) return;
    
    // Remove active class from all slides and dots
    carouselSlides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    carouselSlides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
    
    currentSlide = slideIndex;
}

// Next slide
function nextSlide() {
    if (carouselSlides.length === 0) return;
    
    let nextIndex = (currentSlide + 1) % slideCount;
    goToSlide(nextIndex);
}

// Previous slide
function prevSlide() {
    if (carouselSlides.length === 0) return;
    
    let prevIndex = (currentSlide - 1 + slideCount) % slideCount;
    goToSlide(prevIndex);
}

// Dot click handler
function dotClick(e) {
    if (carouselSlides.length === 0) return;
    
    const slideIndex = parseInt(e.target.getAttribute('data-slide'));
    goToSlide(slideIndex);
}

// Back to top button functionality
function handleScroll() {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    navbar.classList.toggle('active');
    
    // Toggle icon
    const icon = mobileToggle.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Admin login functionality
function handleAdminLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Check credentials (dahua something)
    if (username === 'dahua' && password === 'dahua123') {
        loginMessage.textContent = 'Login successful!';
        loginMessage.className = 'success';
        successSound.play();
        
        // Redirect after success
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1500);
    } else {
        loginMessage.textContent = 'Invalid credentials. Please try again.';
        loginMessage.className = 'error';
        errorSound.play();
        
        // Clear inputs
        usernameInput.value = '';
        passwordInput.value = '';
    }
}

// Key sequence detection for admin login
function handleKeyDown(e) {
    // Add pressed key to sequence
    keySequence += e.key.toUpperCase();
    
    // Keep only last 5 characters (length of "DAHUA")
    if (keySequence.length > DAHUA_SEQUENCE.length) {
        keySequence = keySequence.slice(-DAHUA_SEQUENCE.length);
    }
    
    // Check if sequence matches
    if (keySequence === DAHUA_SEQUENCE) {
        adminLogin.classList.remove('hidden');
        keySequence = ''; // Reset sequence
    }
}

// Close modal when clicking outside
function closeAdminLogin(e) {
    if (e.target === adminLogin) {
        adminLogin.classList.add('hidden');
        usernameInput.value = '';
        passwordInput.value = '';
        loginMessage.textContent = '';
    }
}

// Handle inquiry form submission
function handleInquirySubmit(e) {
    e.preventDefault();
    const email = document.getElementById('senderEmail').value;
    const message = document.getElementById('inquiryContent').value;
    
    // In a real application, this would send to a server
    alert(`Thank you for your inquiry! We'll contact you at ${email} shortly.`);
    inquiryForm.reset();
}

// Open content modal
function openContentModal(contentType, id) {
    let contentHTML = '';
    const data = getSiteData();
    
    if (contentType === 'product') {
        const product = data.products.find(p => p.id == id);
        if (product) {
            contentHTML = `
                <div class="modal-product">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-details">
                        <h2>${product.name}</h2>
                        <div class="price">$${product.price.toFixed(2)}</div>
                        <p>${product.description}</p>
                        <h3>Specifications:</h3>
                        <ul>
                            ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
                        </ul>
                        <button class="btn-primary" style="margin-top: 20px;">Add to Cart</button>
                    </div>
                </div>
            `;
        }
    } else if (contentType === 'news') {
        const news = data.news.find(n => n.id == id);
        if (news) {
            contentHTML = `
                <div class="modal-news">
                    <h2>${news.title}</h2>
                    <div class="news-date">${new Date(news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    <div class="news-content">
                        ${news.content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                </div>
            `;
        }
    } else if (contentType === 'news') {
        const news = data.news.find(n => n.id == id);
        if (news) {
            let imageHTML = '';
            if (news.image) {
            imageHTML = `<img src="${news.image}" alt="${news.title}" style="max-width:100%; height:auto; margin: 15px 0;">`;
            }
            contentHTML = `
            <div class="modal-news">
                ${imageHTML}
                <h2>${news.title}</h2>
                <div class="news-date">${new Date(news.date).toLocaleDateString()}</div>
                <div class="news-content">
                ${news.content.split('\n').map(p => `<p>${p}</p>`).join('')}
                </div>
            </div>
            `;
        }
    }
    
    if (contentHTML) {
        modalContent.innerHTML = contentHTML;
        contentModal.classList.remove('hidden');
    }
}

// Close content modal
function closeContentModal() {
    contentModal.classList.add('hidden');
}

// Universal modal opener for admin pages
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Universal modal closer
function closeModalHandler(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Close modal when clicking outside
function closeAnyModal(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    
    // Carousel navigation
    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', dotClick);
    });
    
    // Back to top
    window.addEventListener('scroll', handleScroll);
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }

    // Disable logo link on all admin-related pages
    const logoLink = document.querySelector('.logo-link');

    if (document.body.classList.contains('admin-page') && logoLink) {
    logoLink.addEventListener('click', e => e.preventDefault());
    }
    
    // Mobile menu
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking a link
    if (navbar) {
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    const icon = document.querySelector('.mobile-toggle i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }
    
    // Admin login
    if (loginBtn) {
        loginBtn.addEventListener('click', handleAdminLogin);
    }
    if (adminLogin) {
        adminLogin.addEventListener('click', closeAdminLogin);
    }
    
    // Key sequence detection
    document.addEventListener('keydown', handleKeyDown);
    
    // Inquiry form
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquirySubmit);
    }
    
    // Read more buttons
    document.addEventListener('click', function(e) {
    if (e.target.classList.contains('read-more-btn')) {
        const parent = e.target.closest('.product-card, .news-card');
        if (!parent) return;
        const id = parent.dataset.productId || parent.dataset.newsId;
        const type = parent.classList.contains('product-card') ? 'product' : 'news';
        openContentModal(type, id);
    }
    });
    
    // Modal close
    if (closeModal) {
        closeModal.addEventListener('click', closeContentModal);
    }
    window.addEventListener('click', function(event) {
        if (event.target === contentModal) {
            closeContentModal();
        }
    });
    
    // Universal modal handlers
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.dataset.modal;
            openModal(modalId);
        });
    });
    
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    window.addEventListener('click', closeAnyModal);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Expose for admin-script.js
window.getSiteData = getSiteData;
window.saveSiteData = saveSiteData;