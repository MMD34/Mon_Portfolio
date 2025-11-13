/**
 * Comments Management System for Portfolio
 * Handles comment submission, display, and ratings
 */

const API_BASE_URL = 'http://localhost:3000/api';

class CommentsManager {
    constructor() {
        this.currentProject = null;
        this.init();
    }

    init() {
        // Auto-detect project ID from URL
        this.detectProject();

        // Initialize event listeners
        this.initEventListeners();
    }

    detectProject() {
        const path = window.location.pathname;
        const projectMap = {
            'portfolio-site-restaurant.html': 'restaurant',
            'portfolio-application-mobile-machina.html': 'machina',
            'portfolio-zephyr-password-manager.html': 'zephyr',
            'portfolio-mbello-encryption.html': 'encryption'
        };

        const fileName = path.split('/').pop();
        this.currentProject = projectMap[fileName] || null;

        if (this.currentProject) {
            this.loadComments();
            this.loadStats();
        }
    }

    initEventListeners() {
        // Star rating hover effects
        this.initStarRating();

        // Comment form submission
        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => this.submitComment(e));
        }
    }

    initStarRating() {
        const starContainer = document.getElementById('star-rating');
        if (!starContainer) return;

        const stars = starContainer.querySelectorAll('.star');
        let selectedRating = 0;

        stars.forEach((star, index) => {
            // Hover effect
            star.addEventListener('mouseenter', () => {
                this.highlightStars(stars, index + 1);
            });

            // Click to select
            star.addEventListener('click', () => {
                selectedRating = index + 1;
                this.setStarRating(stars, selectedRating);
                document.getElementById('rating-value').value = selectedRating;
            });
        });

        // Reset on mouse leave
        starContainer.addEventListener('mouseleave', () => {
            if (selectedRating > 0) {
                this.setStarRating(stars, selectedRating);
            } else {
                this.highlightStars(stars, 0);
            }
        });
    }

    highlightStars(stars, count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('active');
                star.classList.remove('text-gray-300', 'dark:text-gray-600');
                star.classList.add('text-yellow-400');
            } else {
                star.classList.remove('active', 'text-yellow-400');
                star.classList.add('text-gray-300', 'dark:text-gray-600');
            }
        });
    }

    setStarRating(stars, count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('active', 'text-yellow-400');
                star.classList.remove('text-gray-300', 'dark:text-gray-600');
            } else {
                star.classList.remove('active', 'text-yellow-400');
                star.classList.add('text-gray-300', 'dark:text-gray-600');
            }
        });
    }

    async submitComment(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        const formData = {
            project_id: this.currentProject,
            author_name: form.querySelector('#author-name').value.trim(),
            author_email: form.querySelector('#author-email').value.trim(),
            comment: form.querySelector('#comment-text').value.trim(),
            rating: parseInt(form.querySelector('#rating-value').value)
        };

        // Validation
        if (!formData.rating || formData.rating < 1) {
            this.showNotification('Veuillez sélectionner une note', 'error');
            return;
        }

        if (formData.comment.length < 10) {
            this.showNotification('Le commentaire doit contenir au moins 10 caractères', 'error');
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Envoi...';

        try {
            const response = await fetch(`${API_BASE_URL}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('Commentaire ajouté avec succès !', 'success');
                form.reset();

                // Reset star rating
                const stars = document.querySelectorAll('#star-rating .star');
                this.highlightStars(stars, 0);

                // Reload comments and stats
                setTimeout(() => {
                    this.loadComments();
                    this.loadStats();
                }, 500);
            } else {
                this.showNotification(result.error || 'Erreur lors de l\'ajout du commentaire', 'error');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            this.showNotification('Erreur de connexion au serveur', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async loadComments(limit = 10, offset = 0) {
        if (!this.currentProject) return;

        const container = document.getElementById('comments-list');
        if (!container) return;

        try {
            const response = await fetch(`${API_BASE_URL}/comments/${this.currentProject}?limit=${limit}&offset=${offset}`);
            const result = await response.json();

            if (result.success && result.comments.length > 0) {
                container.innerHTML = result.comments.map(comment => this.createCommentHTML(comment)).join('');
            } else {
                container.innerHTML = `
                    <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <i class="fas fa-comments text-4xl mb-4 opacity-50"></i>
                        <p>Aucun commentaire pour le moment. Soyez le premier à laisser un avis !</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading comments:', error);
            container.innerHTML = `
                <div class="text-center py-8 text-red-500">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <p>Erreur lors du chargement des commentaires</p>
                </div>
            `;
        }
    }

    async loadStats() {
        if (!this.currentProject) return;

        const statsContainer = document.getElementById('project-stats');
        if (!statsContainer) return;

        try {
            const response = await fetch(`${API_BASE_URL}/stats/${this.currentProject}`);
            const result = await response.json();

            if (result.success) {
                const stats = result.stats;
                statsContainer.innerHTML = `
                    <div class="flex items-center gap-6 flex-wrap">
                        <div class="flex items-center gap-2">
                            <div class="flex">
                                ${this.createStarsHTML(stats.average_rating)}
                            </div>
                            <span class="text-lg font-semibold">${stats.average_rating.toFixed(1)}</span>
                            <span class="text-gray-500 dark:text-gray-400">(${stats.total_ratings} avis)</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <i class="fas fa-comments"></i>
                            <span>${stats.total_comments} commentaire${stats.total_comments > 1 ? 's' : ''}</span>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    createCommentHTML(comment) {
        const date = new Date(comment.created_at);
        const formattedDate = date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="bg-white dark:bg-dark-background p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h4 class="font-semibold text-lg">${this.escapeHtml(comment.author_name)}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${formattedDate}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        ${this.createStarsHTML(comment.rating)}
                        ${comment.is_featured ? '<span class="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">Populaire</span>' : ''}
                    </div>
                </div>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${this.escapeHtml(comment.comment)}</p>
            </div>
        `;
    }

    createStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let html = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            html += '<i class="fas fa-star text-yellow-400"></i>';
        }

        // Half star
        if (hasHalfStar) {
            html += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            html += '<i class="far fa-star text-gray-300 dark:text-gray-600"></i>';
        }

        return html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Featured Comments Carousel for Homepage
class FeaturedCommentsCarousel {
    constructor() {
        this.comments = [];
        this.currentIndex = 0;
        this.autoScrollInterval = null;
        this.init();
    }

    async init() {
        await this.loadFeaturedComments();
        if (this.comments.length > 0) {
            this.renderCarousel();
            this.startAutoScroll();
        }
    }

    async loadFeaturedComments() {
        try {
            const response = await fetch(`${API_BASE_URL}/comments/featured/all?limit=20`);
            const result = await response.json();

            if (result.success && result.comments.length > 0) {
                this.comments = result.comments;
            }
        } catch (error) {
            console.error('Error loading featured comments:', error);
        }
    }

    renderCarousel() {
        const container = document.getElementById('featured-comments-carousel');
        if (!container) return;

        container.innerHTML = `
            <div class="relative overflow-hidden">
                <div class="carousel-track flex transition-transform duration-500 ease-in-out">
                    ${this.comments.map((comment, index) => this.createCarouselItemHTML(comment, index)).join('')}
                </div>
                ${this.comments.length > 1 ? `
                    <button class="carousel-btn carousel-prev absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-dark-background-secondary p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-dark-background transition-colors z-10">
                        <i class="fas fa-chevron-left text-gray-600 dark:text-gray-400"></i>
                    </button>
                    <button class="carousel-btn carousel-next absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-dark-background-secondary p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-dark-background transition-colors z-10">
                        <i class="fas fa-chevron-right text-gray-600 dark:text-gray-400"></i>
                    </button>
                ` : ''}
            </div>
        `;

        // Add event listeners for navigation buttons
        if (this.comments.length > 1) {
            container.querySelector('.carousel-prev')?.addEventListener('click', () => this.prev());
            container.querySelector('.carousel-next')?.addEventListener('click', () => this.next());
        }
    }

    createCarouselItemHTML(comment, index) {
        const projectNames = {
            'restaurant': 'Site Restaurant',
            'machina': 'Application Machina',
            'zephyr': 'Zephyr Password Manager',
            'encryption': "M'Bello Encryption"
        };

        return `
            <div class="carousel-item flex-shrink-0 w-full px-4" data-index="${index}">
                <div class="bg-gradient-to-br from-white to-gray-50 dark:from-dark-background dark:to-dark-background-secondary p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                            ${comment.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-lg">${this.escapeHtml(comment.author_name)}</h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${projectNames[comment.project_id] || comment.project_id}</p>
                        </div>
                        <div class="flex">
                            ${this.createStarsHTML(comment.rating)}
                        </div>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed italic">"${this.escapeHtml(comment.comment)}"</p>
                </div>
            </div>
        `;
    }

    createStarsHTML(rating) {
        let html = '';
        for (let i = 0; i < 5; i++) {
            html += i < rating
                ? '<i class="fas fa-star text-yellow-400"></i>'
                : '<i class="far fa-star text-gray-300 dark:text-gray-600"></i>';
        }
        return html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.comments.length;
        this.updateCarousel();
        this.resetAutoScroll();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.comments.length) % this.comments.length;
        this.updateCarousel();
        this.resetAutoScroll();
    }

    updateCarousel() {
        const track = document.querySelector('.carousel-track');
        if (track) {
            track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }
    }

    startAutoScroll() {
        this.autoScrollInterval = setInterval(() => {
            this.next();
        }, 5000); // Change slide every 5 seconds
    }

    resetAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.startAutoScroll();
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize comments manager for project pages
    if (document.getElementById('comment-form')) {
        new CommentsManager();
    }

    // Initialize featured comments carousel for homepage
    if (document.getElementById('featured-comments-carousel')) {
        new FeaturedCommentsCarousel();
    }
});
