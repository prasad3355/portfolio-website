/* ========================================
   BLOG.JS - Blog-Specific Functionality
   Handles blog page features and interactions
======================================== */

// ========================================
// BLOG POST NAVIGATION
// Handles blog listing and individual posts
// ========================================

/**
 * Get blog post ID from URL parameters
 * @returns {string|null} - Blog post ID or null
 */
function getBlogPostId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('post');
}

/**
 * Load blog post content dynamically
 * Fetches and displays blog post based on URL parameter
 */
function loadBlogPost() {
    const postId = getBlogPostId();
    
    if (!postId) {
        console.log('No blog post ID in URL');
        return;
    }
    
    console.log(`Loading blog post: ${postId}`);
    
    // Blog post data could be loaded from JSON or API
    // For now, posts are static HTML files
}

// ========================================
// BLOG CARD ANIMATIONS
// Enhanced hover effects for blog cards
// ========================================

/**
 * Add hover effects to blog cards
 * Creates smooth scale and glow effects
 */
function initBlogCardHovers() {
    const blogCards = document.querySelectorAll('.blog-card, .insight-card');
    
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', handleBlogCardHover);
        card.addEventListener('mouseleave', resetBlogCardHover);
    });
}

/**
 * Handle blog card hover effect
 * @param {MouseEvent} e - Mouse enter event
 */
function handleBlogCardHover(e) {
    const card = e.currentTarget;
    const image = card.querySelector('.blog-image img, .insight-image img');
    
    if (image) {
        image.style.transform = 'scale(1.05)';
    }
}

/**
 * Reset blog card hover effect
 * @param {MouseEvent} e - Mouse leave event
 */
function resetBlogCardHover(e) {
    const card = e.currentTarget;
    const image = card.querySelector('.blog-image img, .insight-image img');
    
    if (image) {
        image.style.transform = 'scale(1)';
    }
}

// ========================================
// READING TIME CALCULATOR
// Calculates estimated reading time
// ========================================

/**
 * Calculate reading time for blog posts
 * Based on average reading speed of 200 words/minute
 */
function calculateReadingTime() {
    const postContent = document.querySelector('.post-content');
    
    if (!postContent) return;
    
    const text = postContent.textContent || postContent.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    const readingTimeElement = document.querySelector('.reading-time');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} min read`;
    }
}

// ========================================
// BLOG POST PROGRESS BAR
// Shows reading progress in blog posts
// ========================================

/**
 * Update blog post reading progress
 * Creates progress bar at top of page
 */
function updateBlogProgress() {
    const postContent = document.querySelector('.post-content');
    
    if (!postContent) return;
    
    // Create progress bar if it doesn't exist
    let progressBar = document.getElementById('blogProgressBar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'blogProgressBar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }
    
    const windowHeight = postContent.offsetHeight + postContent.offsetTop;
    const currentScroll = window.scrollY + window.innerHeight;
    const scrollPercentage = (currentScroll / windowHeight) * 100;
    
    progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
}

// ========================================
// BLOG SEARCH FUNCTIONALITY
// Filters blog posts based on search query
// ========================================

/**
 * Filter blog posts by search query
 * @param {string} query - Search query
 */
function filterBlogPosts(query) {
    const blogCards = document.querySelectorAll('.blog-card, .insight-card');
    const normalizedQuery = query.toLowerCase().trim();
    
    let visibleCount = 0;
    
    blogCards.forEach(card => {
        const title = card.querySelector('h2, h3, .blog-card-title, .insight-title');
        const excerpt = card.querySelector('.blog-excerpt, .insight-excerpt');
        const category = card.querySelector('.blog-category, .insight-category');
        
        const titleText = title ? title.textContent.toLowerCase() : '';
        const excerptText = excerpt ? excerpt.textContent.toLowerCase() : '';
        const categoryText = category ? category.textContent.toLowerCase() : '';
        
        const matchesSearch = 
            titleText.includes(normalizedQuery) ||
            excerptText.includes(normalizedQuery) ||
            categoryText.includes(normalizedQuery);
        
        if (matchesSearch || normalizedQuery === '') {
            card.style.display = '';
            card.classList.add('fade-in');
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show "no results" message if needed
    showNoResultsMessage(visibleCount === 0);
}

/**
 * Show or hide "no results" message
 * @param {boolean} show - Whether to show the message
 */
function showNoResultsMessage(show) {
    let noResultsMsg = document.getElementById('noResultsMessage');
    
    if (show) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMessage';
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <p>No articles found matching your search.</p>
                <p>Try different keywords or <a href="#" onclick="clearBlogSearch()">clear search</a>.</p>
            `;
            
            const blogGrid = document.querySelector('.blog-grid, .insights-grid');
            if (blogGrid) {
                blogGrid.appendChild(noResultsMsg);
            }
        }
    } else {
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

/**
 * Clear blog search
 * Resets search input and shows all posts
 */
function clearBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (searchInput) {
        searchInput.value = '';
        filterBlogPosts('');
    }
}

/**
 * Initialize blog search
 * Sets up search input event listeners
 */
function initBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    
    if (!searchInput) return;
    
    // Real-time search as user types
    searchInput.addEventListener('input', (e) => {
        filterBlogPosts(e.target.value);
    });
    
    // Clear button functionality
    const clearBtn = document.getElementById('clearSearch');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearBlogSearch);
    }
}

// ========================================
// BLOG CATEGORY FILTER
// Filters blog posts by category
// ========================================

/**
 * Filter blog posts by category
 * @param {string} category - Category to filter by
 */
function filterByCategory(category) {
    const blogCards = document.querySelectorAll('.blog-card, .insight-card');
    
    blogCards.forEach(card => {
        const cardCategory = card.querySelector('.blog-category, .insight-category');
        const categoryText = cardCategory ? cardCategory.textContent.trim() : '';
        
        if (category === 'all' || categoryText === category) {
            card.style.display = '';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update active filter button
    updateActiveFilter(category);
}

/**
 * Update active filter button styling
 * @param {string} activeCategory - Currently active category
 */
function updateActiveFilter(activeCategory) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        if (btn.dataset.category === activeCategory) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Initialize category filters
 * Sets up filter button event listeners
 */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            filterByCategory(category);
        });
    });
}

// ========================================
// SOCIAL SHARING
// Enables sharing blog posts on social media
// ========================================

/**
 * Share blog post on social media
 * @param {string} platform - Social media platform
 */
function shareBlogPost(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    let shareUrl;
    
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
        default:
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

/**
 * Copy blog post URL to clipboard
 */
function copyBlogUrl() {
    const url = window.location.href;
    
    navigator.clipboard.writeText(url).then(() => {
        showCopyNotification('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

/**
 * Show notification after copying link
 * @param {string} message - Notification message
 */
function showCopyNotification(message) {
    let notification = document.getElementById('copyNotification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'copyNotification';
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 2000);
}

/**
 * Initialize social sharing buttons
 */
function initSocialSharing() {
    const shareButtons = document.querySelectorAll('[data-share]');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const platform = e.target.dataset.share;
            if (platform === 'copy') {
                copyBlogUrl();
            } else {
                shareBlogPost(platform);
            }
        });
    });
}

// ========================================
// RELATED POSTS
// Shows related blog posts at bottom of article
// ========================================

/**
 * Load related posts based on current post category
 */
function loadRelatedPosts() {
    const currentCategory = document.querySelector('.post-category');
    
    if (!currentCategory) return;
    
    const category = currentCategory.textContent.trim();
    
    // In a real implementation, this would fetch from an API or database
    console.log(`Loading related posts for category: ${category}`);
}

// ========================================
// BLOG POST METADATA
// Updates meta tags for SEO and social sharing
// ========================================

/**
 * Update meta tags for blog post
 * Improves SEO and social media preview
 */
function updateBlogMetaTags() {
    const title = document.querySelector('.post-title');
    const excerpt = document.querySelector('.post-content p');
    const image = document.querySelector('.post-featured-image img');
    
    if (title) {
        document.title = title.textContent + ' - Prasad Swain';
        updateMetaTag('og:title', title.textContent);
        updateMetaTag('twitter:title', title.textContent);
    }
    
    if (excerpt) {
        const description = excerpt.textContent.substring(0, 160);
        updateMetaTag('description', description);
        updateMetaTag('og:description', description);
        updateMetaTag('twitter:description', description);
    }
    
    if (image) {
        updateMetaTag('og:image', image.src);
        updateMetaTag('twitter:image', image.src);
    }
}

/**
 * Update specific meta tag
 * @param {string} name - Meta tag name or property
 * @param {string} content - Meta tag content
 */
function updateMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`) || 
               document.querySelector(`meta[property="${name}"]`);
    
    if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
            meta.setAttribute('property', name);
        } else {
            meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
}

// ========================================
// COMMENT SECTION (Optional)
// Placeholder for comment functionality
// ========================================

/**
 * Load comments for blog post
 * Placeholder for future implementation
 */
function loadComments() {
    console.log('Comments functionality - To be implemented');
    // Could integrate with Disqus, Commento, or custom solution
}

// ========================================
// TABLE OF CONTENTS (for long posts)
// Generates TOC from headings
// ========================================

/**
 * Generate table of contents from post headings
 */
function generateTableOfContents() {
    const postContent = document.querySelector('.post-content');
    const tocContainer = document.getElementById('tableOfContents');
    
    if (!postContent || !tocContainer) return;
    
    const headings = postContent.querySelectorAll('h2, h3');
    
    if (headings.length === 0) return;
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
        // Add ID to heading for anchor links
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const tocItem = document.createElement('li');
        tocItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
        
        const tocLink = document.createElement('a');
        tocLink.href = `#${heading.id}`;
        tocLink.textContent = heading.textContent;
        tocLink.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        
        tocItem.appendChild(tocLink);
        tocList.appendChild(tocItem);
    });
    
    tocContainer.appendChild(tocList);
}

// ========================================
// INITIALIZE BLOG FUNCTIONALITY
// ========================================

/**
 * Initialize all blog-specific features
 * Runs after DOM is fully loaded
 */
function initBlogFeatures() {
    console.log('✅ Blog features initialized');
    
    // Load blog post if on individual post page
    loadBlogPost();
    
    // Initialize blog card hovers
    initBlogCardHovers();
    
    // Calculate reading time
    calculateReadingTime();
    
    // Initialize search functionality
    initBlogSearch();
    
    // Initialize category filters
    initCategoryFilters();
    
    // Initialize social sharing
    initSocialSharing();
    
    // Generate table of contents
    generateTableOfContents();
    
    // Update meta tags
    updateBlogMetaTags();
    
    // Load related posts
    loadRelatedPosts();
    
    // Add scroll listener for progress bar
    if (document.querySelector('.post-content')) {
        window.addEventListener('scroll', updateBlogProgress);
    }
}

// Run initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogFeatures);
} else {
    initBlogFeatures();
}

// ========================================
// EXPORT (if using modules)
// ========================================

// Uncomment if using ES6 modules
/*
export {
    filterBlogPosts,
    filterByCategory,
    shareBlogPost,
    copyBlogUrl
};
*/
