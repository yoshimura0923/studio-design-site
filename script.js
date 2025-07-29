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
    
    // Create warm, collaborative office background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f7f8fa');
    gradient.addColorStop(0.3, '#f0f1f3');
    gradient.addColorStop(0.7, '#e8eaed');
    gradient.addColorStop(1, '#dde0e4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add collaborative office elements
    drawCollaborativeOfficeElements(ctx, width, height);
    
    // Add subtle overlay for text readability
    ctx.fillStyle = 'rgba(44, 62, 80, 0.35)';
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL();
}

// Draw collaborative office elements
function drawCollaborativeOfficeElements(ctx, width, height) {
    // Draw shared workspace table
    drawSharedWorkspace(ctx, width, height);
    
    // Draw team members working on laptops
    drawTeamMembers(ctx, width, height);
    
    // Draw office environment
    drawOfficeEnvironment(ctx, width, height);
    
    // Draw collaborative tools and atmosphere
    drawCollaborativeAtmosphere(ctx, width, height);
}

// Draw shared workspace
function drawSharedWorkspace(ctx, width, height) {
    // Large collaborative table
    const tableX = width * 0.15;
    const tableY = height * 0.5;
    const tableWidth = width * 0.7;
    const tableHeight = height * 0.25;
    
    // Table surface with wood texture
    ctx.fillStyle = '#f5f1eb';
    ctx.fillRect(tableX, tableY, tableWidth, tableHeight);
    
    // Table shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(tableX + 3, tableY + 3, tableWidth, tableHeight);
    
    // Wood grain effect
    ctx.strokeStyle = 'rgba(210, 180, 140, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
        const y = tableY + (tableHeight / 10) * i;
        ctx.beginPath();
        ctx.moveTo(tableX, y);
        ctx.lineTo(tableX + tableWidth, y);
        ctx.stroke();
    }
    
    // Table legs
    ctx.fillStyle = '#d4c4a8';
    const legWidth = 15;
    ctx.fillRect(tableX + 30, tableY + tableHeight, legWidth, height * 0.15);
    ctx.fillRect(tableX + tableWidth - 45, tableY + tableHeight, legWidth, height * 0.15);
}

// Draw team members
function drawTeamMembers(ctx, width, height) {
    const tableX = width * 0.15;
    const tableY = height * 0.5;
    const tableWidth = width * 0.7;
    
    // Team member positions around the table
    const memberPositions = [
        { x: tableX + tableWidth * 0.2, y: tableY + 30, angle: 0 },
        { x: tableX + tableWidth * 0.5, y: tableY + 30, angle: 0 },
        { x: tableX + tableWidth * 0.8, y: tableY + 30, angle: 0 },
        { x: tableX + tableWidth * 0.35, y: tableY + 30, angle: 0 }
    ];
    
    memberPositions.forEach((pos, index) => {
        // Draw person silhouette (simplified)
        drawPersonSilhouette(ctx, pos.x, pos.y - 80, index);
        
        // Draw laptop in front of each person
        drawLaptop(ctx, pos.x - 25, pos.y - 20, index);
        
        // Draw chair
        drawCollaborativeChair(ctx, pos.x, pos.y + 20);
    });
}

// Draw person silhouette
function drawPersonSilhouette(ctx, x, y, personIndex) {
    const colors = ['#8e9aaf', '#a8b5c8', '#9ca8ba', '#b2bcc9'];
    
    // Head
    ctx.fillStyle = colors[personIndex % colors.length];
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Shoulders/torso
    ctx.fillStyle = colors[personIndex % colors.length];
    ctx.fillRect(x - 25, y + 15, 50, 60);
    
    // Arms (simplified)
    ctx.fillRect(x - 35, y + 25, 15, 40);
    ctx.fillRect(x + 20, y + 25, 15, 40);
}

// Draw laptop
function drawLaptop(ctx, x, y, laptopIndex) {
    const laptopColors = ['#2c3e50', '#34495e', '#525761', '#6c737f'];
    
    // Laptop base
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(x, y, 50, 35);
    
    // Laptop screen
    ctx.fillStyle = laptopColors[laptopIndex % laptopColors.length];
    ctx.fillRect(x + 2, y - 25, 46, 30);
    
    // Screen content (glow)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(x + 4, y - 23, 42, 26);
    
    // Keyboard detail
    ctx.fillStyle = '#95a5a6';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            ctx.fillRect(x + 5 + j * 5, y + 5 + i * 8, 4, 6);
        }
    }
}

// Draw collaborative chair
function drawCollaborativeChair(ctx, centerX, centerY) {
    // Chair seat
    ctx.fillStyle = '#d6dae0';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 22, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Chair back
    ctx.fillStyle = '#c2c8d0';
    ctx.fillRect(centerX - 18, centerY - 30, 36, 22);
    
    // Chair legs (simplified)
    ctx.fillStyle = '#a8b0ba';
    ctx.fillRect(centerX - 2, centerY + 16, 4, 20);
}

// Draw office environment
function drawOfficeEnvironment(ctx, width, height) {
    // Office windows with natural light
    drawOfficeWindows(ctx, width, height);
    
    // Background office elements
    drawBackgroundOffice(ctx, width, height);
    
    // Office plants and decor
    drawOfficeDecor(ctx, width, height);
}

// Draw office windows
function drawOfficeWindows(ctx, width, height) {
    // Large window on the left
    const windowX = width * 0.02;
    const windowY = height * 0.1;
    const windowWidth = width * 0.12;
    const windowHeight = height * 0.6;
    
    // Window frame
    ctx.fillStyle = '#e8eaed';
    ctx.fillRect(windowX, windowY, windowWidth, windowHeight);
    
    // Natural light through window
    const lightGradient = ctx.createLinearGradient(windowX, windowY, windowX + windowWidth, windowY + windowHeight);
    lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    lightGradient.addColorStop(0.5, 'rgba(245, 248, 250, 0.3)');
    lightGradient.addColorStop(1, 'rgba(230, 235, 240, 0.2)');
    ctx.fillStyle = lightGradient;
    ctx.fillRect(windowX + 2, windowY + 2, windowWidth - 4, windowHeight - 4);
}

// Draw background office
function drawBackgroundOffice(ctx, width, height) {
    // Bookshelves or storage in background
    ctx.fillStyle = '#dde0e4';
    ctx.fillRect(width * 0.88, height * 0.2, width * 0.1, height * 0.5);
    
    // Books/files on shelves
    ctx.fillStyle = '#b8bcc2';
    for (let i = 0; i < 4; i++) {
        const shelfY = height * 0.25 + i * height * 0.1;
        ctx.fillRect(width * 0.89, shelfY, width * 0.08, height * 0.05);
    }
}

// Draw office decor
function drawOfficeDecor(ctx, width, height) {
    // Small plant on table
    const plantX = width * 0.8;
    const plantY = height * 0.48;
    
    // Pot
    ctx.fillStyle = '#c8d0d8';
    ctx.fillRect(plantX, plantY, 20, 25);
    
    // Plant
    ctx.fillStyle = '#4a7c59';
    for (let i = 0; i < 4; i++) {
        const leafX = plantX + 10 + Math.cos(i * Math.PI / 2) * 8;
        const leafY = plantY - 5 + Math.sin(i * Math.PI / 2) * 6;
        ctx.beginPath();
        ctx.ellipse(leafX, leafY, 6, 10, i * Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw collaborative atmosphere
function drawCollaborativeAtmosphere(ctx, width, height) {
    // Collaboration indicators (documents, notes, etc.)
    drawCollaborativeItems(ctx, width, height);
    
    // Ambient office lighting
    drawAmbientLighting(ctx, width, height);
}

// Draw collaborative items
function drawCollaborativeItems(ctx, width, height) {
    const tableX = width * 0.15;
    const tableY = height * 0.5;
    const tableWidth = width * 0.7;
    
    // Papers/documents on table
    const docPositions = [
        { x: tableX + tableWidth * 0.1, y: tableY + 10 },
        { x: tableX + tableWidth * 0.6, y: tableY + 15 },
        { x: tableX + tableWidth * 0.85, y: tableY + 8 }
    ];
    
    docPositions.forEach(pos => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(pos.x, pos.y, 25, 35);
        
        // Text lines on documents
        ctx.fillStyle = '#bdc3c7';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(pos.x + 3, pos.y + 5 + i * 6, 19, 2);
        }
    });
    
    // Coffee cups
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.arc(tableX + tableWidth * 0.25, tableY + 20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(tableX + tableWidth * 0.75, tableY + 18, 8, 0, Math.PI * 2);
    ctx.fill();
}

// Draw ambient lighting
function drawAmbientLighting(ctx, width, height) {
    // Soft overhead lighting effect
    const lightGradient = ctx.createRadialGradient(width / 2, height * 0.2, 0, width / 2, height * 0.2, width * 0.6);
    lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    lightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, width, height * 0.8);
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