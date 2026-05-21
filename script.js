/* ============================================
   BENCHMARK EXPERIENCES — Landing Page Script
   Parallax · Dramatic Text Animations · Scroll Reveals
   ============================================ */

(function () {
    'use strict';

    // ── DOM References ──
    const preloader = document.getElementById('preloader');
    const heroSection = document.getElementById('hero');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const heroContent = document.querySelector('.hero-content');
    const wordReframe = document.getElementById('word-reframe');
    const wordRebuild = document.getElementById('word-rebuild');
    const wordRise = document.getElementById('word-rise');
    const sep1 = document.getElementById('sep-1');
    const sep2 = document.getElementById('sep-2');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const particlesContainer = document.getElementById('particles');

    // ── State ──
    let targetScrollY = 0;
    let currentScrollY = 0;
    let heroAnimationStarted = false;

    // ============================================
    // PRELOADER
    // ============================================
    function hidePreloader() {
        return new Promise((resolve) => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                setTimeout(resolve, 800);
            }, 1200);
        });
    }

    // ============================================
    // PARTICLES
    // ============================================
    function createParticles() {
        const count = 30;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = (60 + Math.random() * 40) + '%';
            particle.style.width = (1 + Math.random() * 2.5) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (6 + Math.random() * 10) + 's';
            particle.style.animationDelay = (Math.random() * 8) + 's';
            particle.style.opacity = 0;
            particlesContainer.appendChild(particle);
        }
    }

    // ============================================
    // HERO TEXT ANIMATION SEQUENCE
    // ============================================
    async function playHeroAnimation() {
        if (heroAnimationStarted) return;
        heroAnimationStarted = true;

        // Small pause after preloader fade
        await delay(200);

        // Single class triggers the entire staggered CSS cascade
        heroSection.classList.add('hero-active');

        // After the entrance completes (~2.7s), transition to idle breathing
        await delay(2700);
        wordReframe.classList.add('idle-breath-1');
        wordRebuild.classList.add('idle-breath-2');
        wordRise.classList.add('idle-breath-3');
    }

    // ============================================
    // PARALLAX SCROLL
    // ============================================
    function updateParallax(scrollYVal) {
        parallaxLayers.forEach((layer) => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0.3;
            const yOffset = scrollYVal * speed;
            layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        });

        // Fade hero content on scroll
        const heroHeight = heroSection.offsetHeight;
        const fadeStart = heroHeight * 0.15;
        const fadeEnd = heroHeight * 0.65;

        if (scrollYVal > fadeStart) {
            const progress = Math.min((scrollYVal - fadeStart) / (fadeEnd - fadeStart), 1);
            heroContent.style.opacity = 1 - progress;
            heroContent.style.transform = `translateY(${progress * -50}px)`;
        } else {
            heroContent.style.opacity = 1;
            heroContent.style.transform = 'translateY(0)';
        }

        // Fade scroll indicator
        if (scrollIndicator) {
            if (scrollYVal > 80) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = (0.6 * (1 - scrollYVal / 80)).toString();
            }
        }
    }

    // ============================================
    // SCROLL REVEAL
    // ============================================
    const revealElements = [];

    function initScrollReveal() {
        document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
            revealElements.push(el);
        });
    }

    function checkReveals() {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.85;

        revealElements.forEach((el) => {
            if (el.classList.contains('revealed')) return;

            const rect = el.getBoundingClientRect();
            if (rect.top < triggerPoint) {
                const delayAttr = el.getAttribute('data-delay');
                const delayMs = delayAttr ? parseInt(delayAttr, 10) : 0;

                setTimeout(() => {
                    el.classList.add('revealed');
                }, delayMs);
            }
        });
    }



    // ============================================
    // LERP ANIMATION TICK
    // ============================================
    function tick() {
        const ease = 0.08;
        currentScrollY += (targetScrollY - currentScrollY) * ease;

        if (Math.abs(targetScrollY - currentScrollY) < 0.1) {
            currentScrollY = targetScrollY;
        }

        updateParallax(currentScrollY);
        checkReveals();

        requestAnimationFrame(tick);
    }

    // ============================================
    // SCROLL HANDLER
    // ============================================
    function onScroll() {
        targetScrollY = window.pageYOffset || document.documentElement.scrollTop;
    }

    // ============================================
    // UTILITY
    // ============================================
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // ============================================
    // LIGHTBOX SYSTEM
    // ============================================
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');

        if (!lightbox || !lightboxImg) return;

        // Select all images in both grids
        const gridImages = document.querySelectorAll('.deliverable-img-wrap img, .process-img-wrap img');

        gridImages.forEach((img) => {
            // Make wrapper clickable
            const parent = img.parentElement;
            parent.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                // Disable background scrolling when modal is open
                document.body.style.overflow = 'hidden';
            });
        });

        // Close lightbox function
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            // Clear image source after animation to prevent flashing next time
            setTimeout(() => {
                lightboxImg.src = '';
            }, 400);
        };

        // Close on clicking backdrop
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                closeLightbox();
            }
        });

        // Close on clicking 'X'
        if (lightboxClose) {
            lightboxClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeLightbox();
            });
        }

        // Close on Escape key press
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // ============================================
    // SMOOTH ANCHOR SCROLLING (if needed)
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ============================================
    // RESIZE HANDLER
    // ============================================
    let resizeTimeout;
    function onResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateParallax(targetScrollY);
            checkReveals();
        }, 150);
    }

    // ============================================
    // INITIALIZE
    // ============================================
    async function init() {
        createParticles();
        initScrollReveal();
        initSmoothScroll();
        initLightbox();

        // Bind events
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        // Initial check
        onScroll();
        currentScrollY = targetScrollY;
        
        // Start continuous smooth ticking loop
        requestAnimationFrame(tick);

        // Wait for preloader to finish, then animate hero
        await hidePreloader();
        await playHeroAnimation();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
