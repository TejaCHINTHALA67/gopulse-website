/* ═══════════════════════════════════════════════════════════════
   PULSE — Premium Landing Page JS 2026
   GSAP scroll animations · Hero cycling · Stats · FAQ
   No Supabase — app is live, CTAs link to App Store
   ═══════════════════════════════════════════════════════════════ */

// ── Helpers ─────────────────────────────────────────────────
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ── Reduced Motion Check ────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ═══════════════════════════════════════════════════════════════
// GSAP Animations
// ═══════════════════════════════════════════════════════════════
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) {
        $$('.reveal').forEach(el => el.classList.add('visible'));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ── Global reveal on scroll ─────────────────────────────
    $$('.reveal').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    // ── Feature cards stagger ───────────────────────────────
    gsap.fromTo('.feature-card',
        { opacity: 0, y: 50, scale: 0.97 },
        {
            opacity: 1, y: 0, scale: 1, duration: 0.8,
            stagger: 0.07, ease: 'power3.out',
            scrollTrigger: { trigger: '.features-grid', start: 'top 82%' }
        }
    );

    // ── Problem cards stagger ───────────────────────────────
    gsap.fromTo('.problem-grid .glass-card--light',
        { opacity: 0, y: 40, scale: 0.97 },
        {
            opacity: 1, y: 0, scale: 1, duration: 0.8,
            stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '.problem-grid', start: 'top 82%' }
        }
    );

    // ── Showcase images — scale + fade ──────────────────────
    $$('.showcase-img, .showcase-bento, .showcase-triple').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 60, scale: 0.92 },
            {
                opacity: 1, y: 0, scale: 1, duration: 1.1,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%' }
            }
        );
    });

    // ── Showcase text — slide in ────────────────────────────
    $$('.showcase-text').forEach(txt => {
        gsap.fromTo(txt,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: { trigger: txt, start: 'top 85%' }
            }
        );
    });

    // ── Stats ───────────────────────────────────────────────
    gsap.fromTo('.stat-card',
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0, duration: 0.7,
            stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '.stats-grid', start: 'top 85%' }
        }
    );

    // ── CTA card ────────────────────────────────────────────
    gsap.fromTo('.cta-card',
        { opacity: 0, y: 50, scale: 0.96 },
        {
            opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.section--cta', start: 'top 80%' }
        }
    );

    // ── Pricing card ────────────────────────────────────────
    gsap.fromTo('.pricing-card',
        { opacity: 0, y: 40, scale: 0.96 },
        {
            opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '#pricing', start: 'top 80%' }
        }
    );

    // ── FAQ items ───────────────────────────────────────────
    gsap.fromTo('.faq-item',
        { opacity: 0, x: -20 },
        {
            opacity: 1, x: 0, duration: 0.5,
            stagger: 0.06, ease: 'power3.out',
            scrollTrigger: { trigger: '.faq-list', start: 'top 82%' }
        }
    );

    // ── Story section parallax text ─────────────────────────
    const storyContent = $('.story-content');
    if (storyContent) {
        gsap.fromTo(storyContent,
            { y: 60 },
            {
                y: -40,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.section--story',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                }
            }
        );
    }

    // ── Trust row ───────────────────────────────────────────
    gsap.fromTo('.trust-item',
        { opacity: 0, y: 20 },
        {
            opacity: 1, y: 0, duration: 0.6,
            stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '.trust-row', start: 'top 88%' }
        }
    );
}

// ═══════════════════════════════════════════════════════════════
// Stat Counter Animation
// ═══════════════════════════════════════════════════════════════
function initStatCounters() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = parseInt(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            if (isNaN(target)) return;

            const duration = 2000;
            const startTime = performance.now();

            (function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                el.textContent = Math.round(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            })(startTime);

            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    $$('.stat-val[data-target]').forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════════════════════════
// Hero Text Cycling
// ═══════════════════════════════════════════════════════════════
function initHeroCycle() {
    const phrases = [
        'Watches You Work Out.',
        'Scans Your Meals.',
        'Adapts Your Plan.',
        'Coaches Your Form.',
        'Counts Your Reps.',
    ];

    let current = 0;
    const el = $('#heroTyped');
    if (!el) return;

    setInterval(() => {
        current = (current + 1) % phrases.length;

        // Fade out
        el.style.transition = 'opacity 0.35s, transform 0.35s';
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';

        setTimeout(() => {
            el.textContent = phrases[current];
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 350);
    }, 3500);
}

// ═══════════════════════════════════════════════════════════════
// Navigation
// ═══════════════════════════════════════════════════════════════
function initNav() {
    const nav = $('#nav');
    const hamburger = $('#hamburger');
    const navLinks = $('#navLinks');

    // Scroll glass effect
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    // Mobile menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');
            hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });

        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// FAQ Accordion
// ═══════════════════════════════════════════════════════════════
function initFAQ() {
    $$('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.closest('.faq-item');
            const wasOpen = item.classList.contains('open');
            const expanded = !wasOpen;

            // Close all
            $$('.faq-item').forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (if it was closed)
            if (!wasOpen) {
                item.classList.add('open');
                q.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// Smooth Scroll
// ═══════════════════════════════════════════════════════════════
function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// Init
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initStatCounters();
    initHeroCycle();
    initFAQ();
    initSmoothScroll();

    // Initialize GSAP when loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initGSAP();
    } else {
        // Wait for deferred scripts
        const check = setInterval(() => {
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                clearInterval(check);
                initGSAP();
            }
        }, 100);

        // Fallback: show everything after 3s
        setTimeout(() => {
            clearInterval(check);
            if (typeof gsap === 'undefined') {
                $$('.reveal').forEach(el => el.classList.add('visible'));
            }
        }, 3000);
    }
});
