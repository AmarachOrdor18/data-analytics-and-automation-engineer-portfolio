document.addEventListener('DOMContentLoaded', () => {
    // Project Carousel Logic
    class ProjectCarousel {
        constructor(carouselId) {
            this.track = document.getElementById(`${carouselId}-carousel`);
            this.container = this.track.closest('.carousel-container');
            // Store original length before cloning
            this.originalItems = Array.from(this.track.children);
            this.itemsLength = this.originalItems.length;

            this.prevBtn = this.container.querySelector('.prev');
            this.nextBtn = this.container.querySelector('.next');
            this.indicatorsContainer = this.container.querySelector('.carousel-indicators');

            this.currentIndex = 1; // Start at 1 because of the clone
            this.autoPlayInterval = null;
            this.isHovered = false;
            this.isTransitioning = false;

            this.init();
        }

        init() {
            // Create indicators based on original items
            this.originalItems.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('indicator');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index + 1));
                this.indicatorsContainer.appendChild(dot);
            });

            this.indicators = Array.from(this.indicatorsContainer.children);

            // Clone first and last items
            const firstClone = this.originalItems[0].cloneNode(true);
            const lastClone = this.originalItems[this.itemsLength - 1].cloneNode(true);

            firstClone.setAttribute('id', 'first-clone');
            lastClone.setAttribute('id', 'last-clone');

            this.track.appendChild(firstClone);
            this.track.insertBefore(lastClone, this.originalItems[0]);

            // Update items list to include clones
            this.items = Array.from(this.track.children);

            // Set initial position
            this.track.style.transform = `translateX(-${100}%)`;

            // Transition End Listener
            this.track.addEventListener('transitionend', () => {
                this.isTransitioning = false;
                if (this.items[this.currentIndex].id === 'last-clone') {
                    this.track.style.transition = 'none';
                    this.currentIndex = this.items.length - 2;
                    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
                } else if (this.items[this.currentIndex].id === 'first-clone') {
                    this.track.style.transition = 'none';
                    this.currentIndex = 1; // itemsLength - 2; was actually incorrect logic usually, wait. 
                    // If we are at first-clone (which is a clone of index 0), we want to jump to index 1 (original index 0)
                    // Wait, usually: [LastClone, 0, 1, 2, FirstClone]
                    // If at FirstClone (index 4), jump to 0 (index 1).
                    this.currentIndex = 1;
                    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
                }
            });

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
            this.track.style.transition = 'transform 0.5s ease-in-out';
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

            // Update items active state
            this.items.forEach((item, index) => {
                if (index === this.currentIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Update indicators - normalized index
            // If current is last-clone (index 0), then real index is last item
            // If current is first-clone (index N+1), then real index is first item
            // Otherwise real index is currentIndex - 1
            let realIndex = this.currentIndex - 1;
            if (this.currentIndex === 0) realIndex = this.itemsLength - 1;
            if (this.currentIndex === this.items.length - 1) realIndex = 0;

            this.indicators.forEach((dot, index) => {
                if (index === realIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        nextSlide() {
            if (this.isTransitioning) return;
            if (this.currentIndex >= this.items.length - 1) return;
            this.isTransitioning = true;
            this.currentIndex++;
            this.updateCarousel();
        }

        prevSlide() {
            if (this.isTransitioning) return;
            if (this.currentIndex <= 0) return;
            this.isTransitioning = true;
            this.currentIndex--;
            this.updateCarousel();
        }

        goToSlide(index) {
            if (this.isTransitioning) return;
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
