document.addEventListener('DOMContentLoaded', () => {
    // Project Carousel Logic
    class ProjectCarousel {
        constructor(carouselId) {
            this.track = document.getElementById(`${carouselId}-carousel`);
            this.container = this.track.closest('.carousel-container');
            this.items = Array.from(this.track.children);
            this.prevBtn = this.container.querySelector('.prev');
            this.nextBtn = this.container.querySelector('.next');
            this.indicatorsContainer = this.container.querySelector('.carousel-indicators');

            this.currentIndex = 0;
            this.autoPlayInterval = null;
            this.isHovered = false;

            this.init();
        }

        init() {
            // Create indicators
            this.items.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('indicator');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.indicatorsContainer.appendChild(dot);
            });

            this.indicators = Array.from(this.indicatorsContainer.children);

            // Event listeners
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoPlay();
            });

            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });

            // Touch events for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            this.track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                this.stopAutoPlay();
            });

            this.track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
                this.startAutoPlay();
            });

            // Hover pause
            this.container.addEventListener('mouseenter', () => {
                this.isHovered = true;
                this.stopAutoPlay();
            });

            this.container.addEventListener('mouseleave', () => {
                this.isHovered = false;
                this.startAutoPlay();
            });

            // Start auto play
            this.startAutoPlay();
        }

        handleSwipe(start, end) {
            if (start - end > 50) this.nextSlide();
            if (end - start > 50) this.prevSlide();
        }

        updateCarousel() {
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

            // Update items active state
            this.items.forEach((item, index) => {
                if (index === this.currentIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Update indicators
            this.indicators.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.items.length;
            this.updateCarousel();
        }

        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
            this.updateCarousel();
        }

        goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
            this.resetAutoPlay();
        }

        startAutoPlay() {
            if (this.autoPlayInterval) return;
            this.autoPlayInterval = setInterval(() => {
                if (!this.isHovered) this.nextSlide();
            }, 5000);
        }

        stopAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }

        resetAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }

    // Initialize Project Carousels
    new ProjectCarousel('analytics');
    new ProjectCarousel('automation');

    // Skills Carousel Logic
    class SkillsCarousel {
        constructor() {
            this.track = document.getElementById('skills-track');
            this.categories = Array.from(this.track.children);
            this.prevBtn = document.getElementById('skills-prev');
            this.nextBtn = document.getElementById('skills-next');
            this.currentIndex = 0;

            this.init();
        }

        init() {
            // Event listeners
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());

            // Initial state
            this.updateCarousel();
        }

        updateCarousel() {
            // Remove active class from all
            this.categories.forEach(cat => cat.classList.remove('active'));

            // Add active class to current
            this.categories[this.currentIndex].classList.add('active');
        }

        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.categories.length;
            this.updateCarousel();
        }

        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.categories.length) % this.categories.length;
            this.updateCarousel();
        }
    }

    // Initialize Skills Carousel
    new SkillsCarousel();

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
