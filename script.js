// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initLoadingSpinner();
    initContactForm();
    initPortfolioImages();
    initHeroBackground();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (hamburger.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset hamburger animation
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add animation styles to elements
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .about-image');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for statistics (if needed)
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        observer.observe(counter);
        counter.addEventListener('intersect', function() {
            animateCounter(counter);
        });
    });
}

// Loading spinner
function initLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    
    // Show spinner on page transitions
    function showSpinner() {
        spinner.classList.add('active');
    }
    
    function hideSpinner() {
        spinner.classList.remove('active');
    }

    // Hide spinner when page loads
    window.addEventListener('load', hideSpinner);

    // Show spinner for external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', showSpinner);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading spinner
            const spinner = document.getElementById('loadingSpinner');
            spinner.classList.add('active');
            
            // Simulate form submission
            setTimeout(() => {
                spinner.classList.remove('active');
                showNotification('メッセージが送信されました！', 'success');
                contactForm.reset();
            }, 2000);
        });

        // Form validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });
    }
}

// Form validation functions
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styles
    field.classList.remove('error');
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'この項目は必須です');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, '有効なメールアドレスを入力してください');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.style.borderColor = '#e74c3c';
    
    // Remove error styling after 3 seconds
    setTimeout(() => {
        field.classList.remove('error');
        field.style.borderColor = '';
    }, 3000);
}

function clearErrors(e) {
    const field = e.target;
    field.classList.remove('error');
    field.style.borderColor = '';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Portfolio images with placeholder handling
function initPortfolioImages() {
    const portfolioImages = document.querySelectorAll('.portfolio-img');
    const aboutImage = document.getElementById('about-img');
    
    // Create placeholder images
    const placeholderImages = {
        'portfolio-1.jpg': createPlaceholderImage(400, 300, 'ECサイト\nデザイン', '#3498db'),
        'portfolio-2.jpg': createPlaceholderImage(400, 300, 'コーポレート\nサイト', '#e74c3c'),
        'portfolio-3.jpg': createPlaceholderImage(400, 300, 'モバイルアプリ\nUI', '#2ecc71'),
        'about-image.jpg': createPlaceholderImage(600, 400, 'デザインチーム', '#9b59b6')
    };

    // Set placeholder images
    portfolioImages.forEach(img => {
        const filename = img.src.split('/').pop();
        if (placeholderImages[filename]) {
            img.src = placeholderImages[filename];
        }
    });

    if (aboutImage && placeholderImages['about-image.jpg']) {
        aboutImage.src = placeholderImages['about-image.jpg'];
    }

    // Add lazy loading effect
    portfolioImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            setTimeout(() => {
                this.style.transition = 'opacity 0.3s ease';
                this.style.opacity = '1';
            }, 100);
        });
    });
}

// Hero background initialization
function initHeroBackground() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroImage = createOfficeImage(1920, 1080);
        hero.style.backgroundImage = `url(${heroImage})`;
        hero.style.backgroundSize = 'cover';
        hero.style.backgroundPosition = 'center';
        hero.style.backgroundRepeat = 'no-repeat';
    }
}

// Create office background image
function createOfficeImage(width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // Create gradient background (office lighting)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(0.3, '#e9ecef');
    gradient.addColorStop(0.7, '#dee2e6');
    gradient.addColorStop(1, '#ced4da');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add office elements (desks, windows, plants)
    drawOfficeElements(ctx, width, height);
    
    // Add subtle overlay for text readability
    ctx.fillStyle = 'rgba(44, 62, 80, 0.3)';
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL();
}

// Draw office elements
function drawOfficeElements(ctx, width, height) {
    // Draw windows (background)
    drawWindows(ctx, width, height);
    
    // Draw desks and workstations
    drawDesks(ctx, width, height);
    
    // Draw plants and decorative elements
    drawPlants(ctx, width, height);
    
    // Draw subtle geometric patterns
    drawGeometricPattern(ctx, width, height);
}

// Draw windows
function drawWindows(ctx, width, height) {
    const windowWidth = width * 0.15;
    const windowHeight = height * 0.6;
    const windowY = height * 0.2;
    
    // Left windows
    for (let i = 0; i < 3; i++) {
        const x = width * 0.05 + i * (windowWidth + 20);
        
        // Window frame
        ctx.fillStyle = '#34495e';
        ctx.fillRect(x, windowY, windowWidth, windowHeight);
        
        // Window glass with gradient
        const windowGradient = ctx.createLinearGradient(x, windowY, x + windowWidth, windowY + windowHeight);
        windowGradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)');
        windowGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        ctx.fillStyle = windowGradient;
        ctx.fillRect(x + 5, windowY + 5, windowWidth - 10, windowHeight - 10);
    }
}

// Draw desks and workstations
function drawDesks(ctx, width, height) {
    const deskCount = 4;
    const deskWidth = width * 0.12;
    const deskHeight = height * 0.08;
    const deskY = height * 0.7;
    
    for (let i = 0; i < deskCount; i++) {
        const x = width * 0.3 + i * (deskWidth + 30);
        
        // Desk surface
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x, deskY, deskWidth, deskHeight);
        
        // Desk legs
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 5, deskY + deskHeight, 8, height * 0.15);
        ctx.fillRect(x + deskWidth - 13, deskY + deskHeight, 8, height * 0.15);
        
        // Computer/laptop on desk
        if (i % 2 === 0) {
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(x + deskWidth * 0.2, deskY - 15, deskWidth * 0.6, 12);
        }
        
        // Chair
        ctx.fillStyle = '#34495e';
        ctx.beginPath();
        ctx.arc(x + deskWidth / 2, deskY + deskHeight + 40, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw plants and decorative elements
function drawPlants(ctx, width, height) {
    // Floor plants
    const plantPositions = [
        { x: width * 0.1, y: height * 0.8 },
        { x: width * 0.85, y: height * 0.75 }
    ];
    
    plantPositions.forEach(pos => {
        // Pot
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(pos.x, pos.y, 30, 40);
        
        // Plant leaves
        ctx.fillStyle = '#228b22';
        for (let i = 0; i < 5; i++) {
            const leafX = pos.x + 15 + Math.cos(i * Math.PI / 2.5) * 20;
            const leafY = pos.y - 10 + Math.sin(i * Math.PI / 2.5) * 15;
            ctx.beginPath();
            ctx.ellipse(leafX, leafY, 8, 15, i * Math.PI / 5, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Draw geometric pattern overlay
function drawGeometricPattern(ctx, width, height) {
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    
    // Draw subtle grid pattern
    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
}

// Create placeholder image
function createPlaceholderImage(width, height, text, color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // Background
    ctx.fillStyle = color || '#95a5a6';
    ctx.fillRect(0, 0, width, height);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lines = text.split('\n');
    const lineHeight = 30;
    const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    
    return canvas.toDataURL();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#2ecc71' : '#3498db',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to top button (if needed)
function addScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    
    Object.assign(scrollButton.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: 'none',
        background: '#3498db',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        opacity: '0',
        transform: 'scale(0)',
        transition: 'all 0.3s ease',
        zIndex: '1000'
    });
    
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 500) {
            scrollButton.style.opacity = '1';
            scrollButton.style.transform = 'scale(1)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.transform = 'scale(0)';
        }
    }, 100));
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}