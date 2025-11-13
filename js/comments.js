/**
 * Comments Management System for Portfolio - HTML/CSS Version
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
                star.style.color = '#fbbf24';
            } else {
                star.classList.remove('active');
                star.style.color = '#d1d5db';
            }
        });
    }

    setStarRating(stars, count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('active');
                star.style.color = '#fbbf24';
            } else {
                star.classList.remove('active');
                star.style.color = '#d1d5db';
            }
        });
    }

    async submitComment(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

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
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

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
            submitBtn.innerHTML = originalText;
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
                    <div style="text-align: center; padding: 3rem 1rem; color: #9ca3af;">
                        <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>Aucun commentaire pour le moment. Soyez le premier à laisser un avis !</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading comments:', error);
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem 1rem; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
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
                    <div style="display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="display: flex; gap: 0.25rem;">
                                ${this.createStarsHTML(stats.average_rating)}
                            </div>
                            <span style="font-size: 1.125rem; font-weight: 600;">${stats.average_rating.toFixed(1)}</span>
                            <span style="color: #6b7280;">(${stats.total_ratings} avis)</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #6b7280;">
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
            <div class="comment-card" style="background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; margin-bottom: 1.5rem; transition: all 0.3s ease;">
                <div style="display: flex; align-items: start; justify-content: space-between; margin-bottom: 1rem;">
                    <div>
                        <h4 style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.25rem;">${this.escapeHtml(comment.author_name)}</h4>
                        <p style="font-size: 0.875rem; color: #6b7280;">${formattedDate}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        ${this.createStarsHTML(comment.rating)}
                        ${comment.is_featured ? '<span style="margin-left: 0.5rem; padding: 0.25rem 0.5rem; background: rgba(216, 149, 132, 0.1); color: #D89584; font-size: 0.75rem; font-weight: 600; border-radius: 4px;">Populaire</span>' : ''}
                    </div>
                </div>
                <p style="color: #374151; line-height: 1.625;">${this.escapeHtml(comment.comment)}</p>
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
            html += '<i class="fas fa-star" style="color: #fbbf24;"></i>';
        }

        // Half star
        if (hasHalfStar) {
            html += '<i class="fas fa-star-half-alt" style="color: #fbbf24;"></i>';
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            html += '<i class="far fa-star" style="color: #d1d5db;"></i>';
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
        const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';

        notification.style.cssText = `
            position: fixed;
            top: 6rem;
            right: 1rem;
            z-index: 9999;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
            background: ${bgColor};
            color: white;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
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
            <div style="position: relative; overflow: hidden; border-radius: 16px;">
                <div class="carousel-track" style="display: flex; transition: transform 0.5s ease;">
                    ${this.comments.map((comment, index) => this.createCarouselItemHTML(comment, index)).join('')}
                </div>
                ${this.comments.length > 1 ? `
                    <button class="carousel-prev" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); background: white; padding: 1rem; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: none; cursor: pointer; z-index: 10; transition: all 0.3s ease;">
                        <i class="fas fa-chevron-left" style="color: #6b7280;"></i>
                    </button>
                    <button class="carousel-next" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: white; padding: 1rem; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: none; cursor: pointer; z-index: 10; transition: all 0.3s ease;">
                        <i class="fas fa-chevron-right" style="color: #6b7280;"></i>
                    </button>
                ` : ''}
            </div>
        `;

        // Add event listeners for navigation buttons
        if (this.comments.length > 1) {
            container.querySelector('.carousel-prev')?.addEventListener('click', () => this.prev());
            container.querySelector('.carousel-next')?.addEventListener('click', () => this.next());

            // Hover effects
            const buttons = container.querySelectorAll('.carousel-prev, .carousel-next');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'translateY(-50%) scale(1.1)';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translateY(-50%) scale(1)';
                });
            });
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
            <div style="flex-shrink: 0; width: 100%; padding: 0 1rem;">
                <div style="background: linear-gradient(135deg, #fff 0%, #f9fafb 100%); padding: 2rem; border-radius: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 3rem; height: 3rem; background: linear-gradient(135deg, #D89584 0%, #7928ca 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.25rem;">
                            ${comment.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div style="flex: 1;">
                            <h4 style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.25rem;">${this.escapeHtml(comment.author_name)}</h4>
                            <p style="font-size: 0.875rem; color: #6b7280;">${projectNames[comment.project_id] || comment.project_id}</p>
                        </div>
                        <div style="display: flex; gap: 0.25rem;">
                            ${this.createStarsHTML(comment.rating)}
                        </div>
                    </div>
                    <p style="color: #374151; line-height: 1.625; font-style: italic;">"${this.escapeHtml(comment.comment)}"</p>
                </div>
            </div>
        `;
    }

    createStarsHTML(rating) {
        let html = '';
        for (let i = 0; i < 5; i++) {
            html += i < rating
                ? '<i class="fas fa-star" style="color: #fbbf24;"></i>'
                : '<i class="far fa-star" style="color: #d1d5db;"></i>';
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
