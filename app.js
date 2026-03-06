/* ═══════════════════════════════════════════════════════════════
   PULSE — Premium Website JavaScript
   Scroll animations, cycling headline, FAQ accordion, nav
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Scroll-triggered animations ────────────────────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.anim-in').forEach(el => observer.observe(el));

    // ─── Cycling Headline ───────────────────────────────────
    const WORDS = ['Train Smarter.', 'Eat Better.', 'Live Stronger.'];
    const cyclingEl = document.getElementById('cyclingWord');
    let wordIndex = 0;

    if (cyclingEl) {
        setInterval(() => {
            wordIndex = (wordIndex + 1) % WORDS.length;
            cyclingEl.style.opacity = '0';
            cyclingEl.style.transform = 'translateY(10px)';
            setTimeout(() => {
                cyclingEl.textContent = WORDS[wordIndex];
                cyclingEl.style.opacity = '1';
                cyclingEl.style.transform = 'translateY(0)';
            }, 300);
        }, 2500);
    }

    // ─── Counter animation ──────────────────────────────────
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                if (!target) return;
                const duration = 2000;
                const start = performance.now();

                const animate = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4);
                    el.textContent = Math.round(target * eased) + suffix;
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

    // ─── Navigation scroll effect ───────────────────────────
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // ─── Mobile menu toggle ─────────────────────────────────
    const toggle = document.getElementById('mobileToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
        });
        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
            });
        });
    }

    // ─── FAQ accordion ──────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isOpen = item.classList.contains('open');
            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            // Toggle clicked
            if (!isOpen) item.classList.add('open');
        });
    });

    // ─── Smooth scroll for anchor links ─────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
