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
    
    // Create clean modern background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.4, '#f8f9fb');
    gradient.addColorStop(0.8, '#f0f2f5');
    gradient.addColorStop(1, '#e8ecf0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add modern office elements
    drawModernOfficeElements(ctx, width, height);
    
    // Add subtle overlay for text readability
    ctx.fillStyle = 'rgba(44, 62, 80, 0.4)';
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL();
}

// Draw modern office elements
function drawModernOfficeElements(ctx, width, height) {
    // Draw large windows with city view
    drawModernWindows(ctx, width, height);
    
    // Draw sleek workstations
    drawModernWorkstations(ctx, width, height);
    
    // Draw modern furniture and decor
    drawModernFurniture(ctx, width, height);
    
    // Draw architectural elements
    drawArchitecturalElements(ctx, width, height);
}

// Draw modern windows
function drawModernWindows(ctx, width, height) {
    // Large floor-to-ceiling windows
    const windowWidth = width * 0.25;
    const windowHeight = height * 0.8;
    const windowY = height * 0.1;
    
    // Background windows spanning most of the left side
    for (let i = 0; i < 2; i++) {
        const x = width * 0.02 + i * (windowWidth + 10);
        
        // Minimal window frame
        ctx.fillStyle = '#e8ecf0';
        ctx.fillRect(x, windowY, windowWidth, windowHeight);
        
        // City view gradient through window
        const cityGradient = ctx.createLinearGradient(x, windowY, x + windowWidth, windowY + windowHeight);
        cityGradient.addColorStop(0, 'rgba(173, 216, 230, 0.2)');
        cityGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
        cityGradient.addColorStop(0.7, 'rgba(220, 220, 220, 0.2)');
        cityGradient.addColorStop(1, 'rgba(190, 190, 190, 0.1)');
        ctx.fillStyle = cityGradient;
        ctx.fillRect(x + 2, windowY + 2, windowWidth - 4, windowHeight - 4);
        
        // Subtle building silhouettes
        ctx.fillStyle = 'rgba(180, 180, 180, 0.15)';
        for (let j = 0; j < 5; j++) {
            const buildingX = x + (windowWidth / 5) * j;
            const buildingHeight = Math.random() * windowHeight * 0.4 + windowHeight * 0.2;
            ctx.fillRect(buildingX, windowY + windowHeight - buildingHeight, windowWidth / 6, buildingHeight);
        }
    }
}

// Draw modern workstations
function drawModernWorkstations(ctx, width, height) {
    const workstationCount = 3;
    const workstationWidth = width * 0.15;
    const workstationHeight = height * 0.06;
    const workstationY = height * 0.65;
    
    for (let i = 0; i < workstationCount; i++) {
        const x = width * 0.55 + i * (workstationWidth + 40);
        
        // Modern white desk surface
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, workstationY, workstationWidth, workstationHeight);
        
        // Subtle desk shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(x + 2, workstationY + 2, workstationWidth, workstationHeight);
        
        // Minimalist desk legs (barely visible)
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(x + 10, workstationY + workstationHeight, 4, height * 0.2);
        ctx.fillRect(x + workstationWidth - 14, workstationY + workstationHeight, 4, height * 0.2);
        
        // Modern monitors/laptops
        if (i % 2 === 0) {
            // Thin monitor
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(x + workstationWidth * 0.25, workstationY - 25, workstationWidth * 0.5, 20);
            ctx.fillStyle = '#34495e';
            ctx.fillRect(x + workstationWidth * 0.3, workstationY - 20, workstationWidth * 0.4, 15);
        } else {
            // Laptop
            ctx.fillStyle = '#95a5a6';
            ctx.fillRect(x + workstationWidth * 0.2, workstationY - 8, workstationWidth * 0.6, 6);
        }
        
        // Modern ergonomic chair
        ctx.fillStyle = '#ecf0f1';
        drawModernChair(ctx, x + workstationWidth / 2, workstationY + workstationHeight + 30);
    }
}

// Draw modern chair
function drawModernChair(ctx, centerX, centerY) {
    // Chair seat
    ctx.fillStyle = '#ecf0f1';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 25, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Chair back
    ctx.fillStyle = '#d5dbdb';
    ctx.fillRect(centerX - 20, centerY - 35, 40, 25);
    
    // Chair base
    ctx.fillStyle = '#bdc3c7';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 25, 3, 0, Math.PI * 2);
    ctx.fill();
}

// Draw modern furniture
function drawModernFurniture(ctx, width, height) {
    // Modern planters with minimalist plants
    drawModernPlanters(ctx, width, height);
    
    // Conference table in background
    drawConferenceTable(ctx, width, height);
    
    // Modern lighting fixtures
    drawModernLighting(ctx, width, height);
}

// Draw modern planters
function drawModernPlanters(ctx, width, height) {
    const planterPositions = [
        { x: width * 0.92, y: height * 0.7 },
        { x: width * 0.05, y: height * 0.85 }
    ];
    
    planterPositions.forEach(pos => {
        // Modern white rectangular planter
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(pos.x, pos.y, 35, 45);
        
        // Planter shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(pos.x + 2, pos.y + 2, 35, 45);
        
        // Minimalist plant (simple geometric shapes)
        ctx.fillStyle = '#27ae60';
        // Stem
        ctx.fillRect(pos.x + 15, pos.y - 20, 3, 25);
        
        // Modern leaves (geometric)
        for (let i = 0; i < 3; i++) {
            const leafY = pos.y - 15 + i * 8;
            ctx.beginPath();
            ctx.ellipse(pos.x + 17 + i * 5, leafY, 8, 4, i * Math.PI / 6, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Draw conference table
function drawConferenceTable(ctx, width, height) {
    const tableX = width * 0.3;
    const tableY = height * 0.4;
    const tableWidth = width * 0.2;
    const tableHeight = height * 0.12;
    
    // Table surface
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tableX, tableY, tableWidth, tableHeight);
    
    // Table shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(tableX + 3, tableY + 3, tableWidth, tableHeight);
    
    // Table legs (minimalist)
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(tableX + 20, tableY + tableHeight, 6, height * 0.15);
    ctx.fillRect(tableX + tableWidth - 26, tableY + tableHeight, 6, height * 0.15);
}

// Draw modern lighting
function drawModernLighting(ctx, width, height) {
    // Pendant lighting
    const lightPositions = [
        { x: width * 0.4, y: height * 0.05 },
        { x: width * 0.7, y: height * 0.08 }
    ];
    
    lightPositions.forEach(pos => {
        // Light fixture (minimalist)
        ctx.fillStyle = '#f8f9fa';
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, 15, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Light glow effect
        const glowGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 40);
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 40, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw architectural elements
function drawArchitecturalElements(ctx, width, height) {
    // Modern ceiling details
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0, 0, width, height * 0.15);
    
    // Subtle floor texture
    ctx.fillStyle = 'rgba(245, 245, 245, 0.5)';
    ctx.fillRect(0, height * 0.8, width, height * 0.2);
    
    // Modern architectural lines
    ctx.strokeStyle = 'rgba(220, 220, 220, 0.3)';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    
    // Horizontal lines
    for (let i = 1; i < 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Vertical lines
    for (let i = 1; i < 6; i++) {
        const x = (width / 6) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
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