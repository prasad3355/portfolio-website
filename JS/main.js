/* ========================================
   MAIN.JS - Core Website Functionality
   Handles navigation, scroll effects, animations
======================================== */

// ========================================
// GLOBAL VARIABLES & DOM ELEMENTS
// ========================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// ========================================
// MOBILE MENU TOGGLE
// Opens and closes the mobile navigation menu
// ========================================

/**
 * Toggle mobile navigation menu
 * Adds/removes 'active' class to hamburger and nav menu
 * Prevents body scroll when menu is open
 */
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * Close mobile menu when clicking outside
 * @param {Event} e - Click event
 */
function closeMobileMenuOnClickOutside(e) {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

/**
 * Close mobile menu when nav link is clicked
 * Ensures smooth UX when navigating to sections
 */
function closeMobileMenuOnNavClick() {
    if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
}

// Event Listeners for Mobile Menu
if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
}

document.addEventListener('click', closeMobileMenuOnClickOutside);

navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenuOnNavClick);
});

// ========================================
// NAVBAR SCROLL BEHAVIOR
// Adds shadow and background on scroll
// ========================================

/**
 * Handle navbar appearance on scroll
 * Adds 'scrolled' class when user scrolls down
 * Creates floating effect with shadow and blur
 */
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Throttle scroll event for performance
let lastScrollTime = 0;
const scrollThrottle = 100; // ms

window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime >= scrollThrottle) {
        handleNavbarScroll();
        lastScrollTime = now;
    }
});

// ========================================
// ACTIVE SECTION HIGHLIGHTING
// Highlights nav link based on current section
// ========================================

/**
 * Update active nav link based on scroll position
 * Uses Intersection Observer for accurate detection
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 200; // Offset for better UX

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));

            // Add active class to current section link
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Update active link on scroll
window.addEventListener('scroll', () => {
    updateActiveNavLink();
});

// ========================================
// SMOOTH SCROLLING
// Enables smooth scroll to sections on click
// ========================================

/**
 * Smooth scroll to section when clicking nav links
 * @param {Event} e - Click event
 */
function smoothScrollToSection(e) {
    const href = e.currentTarget.getAttribute('href');

    // Only handle internal anchor links
    if (href && href.startsWith('#')) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Add smooth scroll to all nav links
navLinks.forEach(link => {
    link.addEventListener('click', smoothScrollToSection);
});

// Smooth scroll for all internal anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========================================
// SCROLL REVEAL ANIMATIONS
// Animates elements when they enter viewport
// ========================================

/**
 * Intersection Observer for scroll animations
 * Adds 'visible' class when elements enter viewport
 */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of element is visible
};

/**
 * Callback function for Intersection Observer
 * @param {Array} entries - Array of observed elements
 */
function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optionally unobserve after animation
            // observer.unobserve(entry.target);
        }
    });
}

// Create observer instance
const observer = new IntersectionObserver(handleIntersection, observerOptions);

// Observe all elements with fade-in classes
const animatedElements = document.querySelectorAll(
    '.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .glass-card, .timeline-item'
);

animatedElements.forEach(element => {
    observer.observe(element);
});

// ========================================
// HOVER INTERACTIONS
// Enhanced hover effects for interactive elements
// ========================================

/**
 * Add tilt effect to project cards on hover
 * Creates subtle 3D tilt based on mouse position
 */
const projectCards = document.querySelectorAll('.project-card, .blog-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', handleCardTilt);
    card.addEventListener('mouseleave', resetCardTilt);
});

/**
 * Apply tilt effect based on mouse position
 * @param {MouseEvent} e - Mouse move event
 */
function handleCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
}

/**
 * Reset card tilt effect
 * @param {MouseEvent} e - Mouse leave event
 */
function resetCardTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
}

// ========================================
// ANIMATED GRADIENT ORBS
// Creates floating animation for background orbs
// ========================================

/**
 * Animate gradient orbs in hero section
 * Creates organic floating movement
 */
function animateGradientOrbs() {
    const orbs = document.querySelectorAll('.gradient-orb');

    orbs.forEach((orb, index) => {
        const speed = 20 + (index * 5); // Different speeds for each orb
        const delay = index * 5; // Stagger animation start

        orb.style.animationDuration = `${speed}s`;
        orb.style.animationDelay = `${delay}s`;
    });
}

// Initialize orb animations
document.addEventListener('DOMContentLoaded', animateGradientOrbs);

// ========================================
// TYPING EFFECT
// Creates typing animation for hero subtitle
// ========================================

/**
 * Typing effect for hero subtitle
 * Simulates text being typed character by character
 */
function initTypingEffect() {
    const typingElement = document.querySelector('.hero-subtitle');

    if (!typingElement) return;

    const originalText = typingElement.textContent;
    typingElement.textContent = '';
    typingElement.style.opacity = '1';

    let charIndex = 0;
    const typingSpeed = 50; // ms per character

    function typeCharacter() {
        if (charIndex < originalText.length) {
            typingElement.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeCharacter, typingSpeed);
        }
    }

    // Start typing after page load
    setTimeout(typeCharacter, 1000);
}

// Uncomment to enable typing effect
// window.addEventListener('load', initTypingEffect);

// ========================================
// CODE WINDOW TYPING ANIMATION
// Animates code appearing in hero section
// ========================================

/**
 * Animate code appearing in code window
 * Creates terminal-like typing effect with syntax highlighting
 */
function initHeroCodeAnimation() {
    const codeDisplay = document.getElementById('hero-code-display');
    if (!codeDisplay) return;

    // Code content with syntax highlighting classes
    const codeData = [
        [
            { text: "import", class: "code-keyword" },
            { text: " tensorflow", class: "code-module" },
            { text: " as", class: "code-keyword" },
            { text: " tf", class: "" }
        ],
        [
            { text: "from", class: "code-keyword" },
            { text: " sklearn", class: "code-module" },
            { text: " import", class: "code-keyword" },
            { text: " model_selection", class: "" }
        ],
        [], // Empty line
        [
            { text: "class", class: "code-keyword" },
            { text: " AIEngineer", class: "code-class" },
            { text: ":", class: "" }
        ],
        [
            { text: "    def", class: "code-keyword" },
            { text: " __init__", class: "code-function" },
            { text: "(", class: "" },
            { text: "self", class: "code-param" },
            { text: "):", class: "" }
        ],
        [
            { text: "        self", class: "code-param" },
            { text: ".", class: "" },
            { text: "name", class: "" },
            { text: " = ", class: "" },
            { text: "\"Prasad Swain\"", class: "code-string" }
        ],
        [
            { text: "        self", class: "code-param" },
            { text: ".", class: "" },
            { text: "skills", class: "" },
            { text: " = [", class: "" },
            { text: "\"ML\"", class: "code-string" },
            { text: ", ", class: "" },
            { text: "\"AI\"", class: "code-string" },
            { text: ", ", class: "" },
            { text: "\"Web Dev\"", class: "code-string" },
            { text: "]", class: "" }
        ],
        [], // Empty line
        [
            { text: "    def", class: "code-keyword" },
            { text: " build_future", class: "code-function" },
            { text: "(", class: "" },
            { text: "self", class: "code-param" },
            { text: "):", class: "" }
        ],
        [
            { text: "        return", class: "code-keyword" },
            { text: " \"Innovation\"", class: "code-string" },
            { text: " 🚀", class: "" }
        ]
    ];

    let lineIndex = 0;
    let tokenIndex = 0;
    let charIndex = 0;
    let currentLineElement = null;
    let currentTokenSpan = null;
    let isTyping = false;

    function createCursor() {
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        return cursor;
    }

    let cursorElement = createCursor();

    function updateCursorPosition() {
        // Remove cursor from wherever it is
        if (cursorElement.parentNode) {
            cursorElement.parentNode.removeChild(cursorElement);
        }

        // Append to the end of the current line or the display
        if (currentLineElement) {
            currentLineElement.appendChild(cursorElement);
        } else {
            codeDisplay.appendChild(cursorElement);
        }
    }

    function typeNextChar() {
        if (lineIndex >= codeData.length) {
            // Finished typing
            setTimeout(restartAnimation, 3000); // Wait 3s then restart
            return;
        }

        // Initialize line if needed
        if (!currentLineElement) {
            currentLineElement = document.createElement('div');
            codeDisplay.appendChild(currentLineElement);
            updateCursorPosition();

            // Handle empty lines
            if (codeData[lineIndex].length === 0) {
                lineIndex++;
                currentTokenSpan = null;
                currentLineElement = null; // Reset for next line
                setTimeout(typeNextChar, 100); // Slight delay for new line
                return;
            }
        }

        const currentLineData = codeData[lineIndex];
        const currentTokenData = currentLineData[tokenIndex];

        // Initialize token span if needed
        if (!currentTokenSpan) {
            currentTokenSpan = document.createElement('span');
            if (currentTokenData.class) {
                currentTokenSpan.className = currentTokenData.class;
            }
            // Insert before cursor
            if (cursorElement.parentNode === currentLineElement) {
                currentLineElement.insertBefore(currentTokenSpan, cursorElement);
            } else {
                currentLineElement.appendChild(currentTokenSpan);
                updateCursorPosition();
            }
        }

        // Type character
        if (charIndex < currentTokenData.text.length) {
            currentTokenSpan.textContent += currentTokenData.text[charIndex];
            charIndex++;
            setTimeout(typeNextChar, 30 + Math.random() * 40); // Random typing speed (30-70ms)
        } else {
            // Move to next token
            charIndex = 0;
            tokenIndex++;
            currentTokenSpan = null;

            if (tokenIndex >= currentLineData.length) {
                // Move to next line
                tokenIndex = 0;
                lineIndex++;
                currentLineElement = null;
                setTimeout(typeNextChar, 150); // Delay between lines
            } else {
                typeNextChar();
            }
        }
    }

    function restartAnimation() {
        // Clear content
        codeDisplay.innerHTML = '';
        lineIndex = 0;
        tokenIndex = 0;
        charIndex = 0;
        currentLineElement = null;
        currentTokenSpan = null;

        // Add cursor back
        codeDisplay.appendChild(cursorElement);

        // Start typing
        setTimeout(typeNextChar, 500);
    }

    // Start initial animation
    setTimeout(restartAnimation, 1000);
}

// Initialize code animation
window.addEventListener('load', initHeroCodeAnimation);

// ========================================
// NAME TYPING ANIMATION
// Animates the user name "Prasad Swain"
// ========================================

/**
 * Animate name typing with specific styling
 * types "Prasad " then "Swain" with gradient class
 */
function initNameAnimation() {
    const nameDisplay = document.getElementById('hero-name-display');
    if (!nameDisplay) return;

    const nameData = [
        { text: "Prasad ", class: "" },
        { text: "Swain", class: "gradient-text" }
    ];

    let tokenIndex = 0;
    let charIndex = 0;
    let currentTokenSpan = null;
    let isDeleting = false;

    // Create a specific cursor for the H1
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    // Adjust cursor size for H1
    cursor.style.height = '1em';
    cursor.style.width = '0.1em';

    function updateCursor() {
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        nameDisplay.appendChild(cursor);
    }

    function type() {
        if (tokenIndex < nameData.length) {
            if (!currentTokenSpan) {
                currentTokenSpan = document.createElement('span');
                if (nameData[tokenIndex].class) {
                    currentTokenSpan.className = nameData[tokenIndex].class;
                }
                nameDisplay.appendChild(currentTokenSpan);
                updateCursor();
            }

            const currentText = nameData[tokenIndex].text;

            if (!isDeleting) {
                // Typing
                if (charIndex < currentText.length) {
                    currentTokenSpan.textContent += currentText[charIndex];
                    charIndex++;
                    setTimeout(type, 100);
                } else {
                    // Finished this token
                    tokenIndex++;
                    charIndex = 0;
                    currentTokenSpan = null;
                    setTimeout(type, 100);
                }
            }
        } else {
            // Finished entire name
            if (!isDeleting) {
                // Wait before deleting
                isDeleting = true;
                setTimeout(type, 2000);
            } else {
                // Deleting logic (Backspacing entire name)
                const spans = nameDisplay.querySelectorAll('span:not(.cursor)');
                if (spans.length > 0) {
                    const lastSpan = spans[spans.length - 1];
                    const text = lastSpan.textContent;
                    if (text.length > 0) {
                        lastSpan.textContent = text.substring(0, text.length - 1);
                        setTimeout(type, 50);
                    } else {
                        // Span empty, remove it
                        nameDisplay.removeChild(lastSpan);
                        updateCursor();
                        // If all spans gone, reset
                        if (nameDisplay.querySelectorAll('span:not(.cursor)').length === 0) {
                            tokenIndex = 0;
                            charIndex = 0;
                            isDeleting = false;
                            currentTokenSpan = null;
                            setTimeout(type, 500);
                        } else {
                            setTimeout(type, 50);
                        }
                    }
                } else {
                    // Safety reset
                    tokenIndex = 0;
                    charIndex = 0;
                    isDeleting = false;
                    setTimeout(type, 500);
                }
            }
        }
    }

    // Start
    nameDisplay.appendChild(cursor);
    setTimeout(type, 500);
}

// Initialize name animation
window.addEventListener('load', initNameAnimation);

// ========================================
// SCROLL PROGRESS INDICATOR
// Shows reading progress at top of page
// ========================================

/**
 * Update scroll progress bar
 * Shows how much of page has been scrolled
 */
function updateScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');

    if (!progressBar) return;

    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;

    progressBar.style.width = `${scrolled}%`;
}

// Add scroll progress bar to page if element exists
window.addEventListener('scroll', updateScrollProgress);

// ========================================
// FORM VALIDATION (if contact form exists)
// Validates form inputs before submission
// ========================================

/**
 * Validate contact form
 * @param {Event} e - Form submit event
 */
function validateContactForm(e) {
    const form = e.target;
    const email = form.querySelector('input[type="email"]');
    const message = form.querySelector('textarea');

    let isValid = true;

    // Email validation
    if (email && !validateEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }

    // Message validation
    if (message && message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters');
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
    }
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show error message for form field
 * @param {HTMLElement} field - Form field element
 * @param {string} message - Error message to display
 */
function showError(field, message) {
    field.classList.add('error');

    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and append error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

// Add form validation if form exists
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', validateContactForm);
}

// ========================================
// LAZY LOADING IMAGES
// Loads images only when they enter viewport
// ========================================

/**
 * Lazy load images for better performance
 * Uses Intersection Observer API
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// ========================================
// BACK TO TOP BUTTON
// Shows button when scrolled down
// ========================================

/**
 * Show/hide back to top button based on scroll position
 */
function handleBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

/**
 * Scroll to top of page smoothly
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Event listeners for back to top
window.addEventListener('scroll', handleBackToTopButton);

const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', scrollToTop);
}

// ========================================
// THEME TOGGLE (Optional)
// Switches between dark and light mode
// ========================================

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Load saved theme preference
 */
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
}

// Load theme on page load
document.addEventListener('DOMContentLoaded', loadThemePreference);

// Theme toggle button
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// ========================================
// KEYBOARD NAVIGATION
// Enhances accessibility with keyboard shortcuts
// ========================================

/**
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardShortcuts(e) {
    // ESC key - Close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }

    // Ctrl/Cmd + K - Focus search (if exists)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search');
        if (searchInput) searchInput.focus();
    }
}

document.addEventListener('keydown', handleKeyboardShortcuts);

// ========================================
// PERFORMANCE MONITORING
// Logs performance metrics for optimization
// ========================================

/**
 * Log performance metrics
 * Helps identify bottlenecks and slow loading
 */
function logPerformanceMetrics() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];

            console.log('Performance Metrics:');
            console.log(`DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
            console.log(`Page Load Time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            console.log(`Total Load Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        });
    }
}

// Uncomment to enable performance logging
// logPerformanceMetrics();

// ========================================
// INITIALIZE ALL FUNCTIONS ON LOAD
// ========================================

/**
 * Initialize all interactive features
 * Runs after DOM is fully loaded
 */
function initializeWebsite() {
    console.log('✅ Website initialized successfully');

    // Set initial navbar state
    handleNavbarScroll();

    // Set initial active nav link
    updateActiveNavLink();

    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
}

// Run initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}

// ========================================
// ERROR HANDLING
// Global error handler for debugging
// ========================================

/**
 * Handle JavaScript errors gracefully
 * @param {ErrorEvent} event - Error event
 */
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    // In production, you might want to send this to an error tracking service
});

/**
 * Handle unhandled promise rejections
 * @param {PromiseRejectionEvent} event - Promise rejection event
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// ========================================
// EXPORT (if using modules)
// ========================================

// Uncomment if using ES6 modules
/*
export {
    toggleMobileMenu,
    smoothScrollToSection,
    updateActiveNavLink,
    handleNavbarScroll
};
*/
