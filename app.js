/* ═══════════════════════════════════════════════════════════════
   PULSE — Landing Page Scripts
   Particle system, animations, FAQ, waitlist
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── Particle System ──────────────────────────────────────
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 120 };
        let animFrame;

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.offsetWidth;
                this.y = Math.random() * canvas.offsetHeight;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
            }

            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                // Gentle drift
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction — push particles away
                if (mouse.x !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x += dx * force * 0.03;
                        this.y += dy * force * 0.03;
                    }
                }

                // Wrap around edges
                const w = canvas.offsetWidth;
                const h = canvas.offsetHeight;
                if (this.x < -20) this.x = w + 20;
                if (this.x > w + 20) this.x = -20;
                if (this.y < -20) this.y = h + 20;
                if (this.y > h + 20) this.y = -20;
            }
        }

        function createParticles() {
            const count = window.innerWidth < 768 ? 50 : 100;
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const opacity = (1 - dist / 120) * 0.08;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animFrame = requestAnimationFrame(animateParticles);
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });

        resizeCanvas();
        createParticles();
        animateParticles();
    }

    // ─── Cycling Word Animation ──────────────────────────────
    const cyclingEl = document.getElementById('cyclingWord');
    if (cyclingEl) {
        const words = ['Transform', 'Train', 'Eat', 'Track', 'Grow'];
        let idx = 0;

        setInterval(() => {
            idx = (idx + 1) % words.length;
            cyclingEl.style.opacity = '0';
            cyclingEl.style.transform = 'translateY(10px)';
            setTimeout(() => {
                cyclingEl.textContent = words[idx] + '.';
                cyclingEl.style.opacity = '1';
                cyclingEl.style.transform = 'translateY(0)';
            }, 300);
        }, 2200);

        // Add transition style
        cyclingEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        cyclingEl.textContent = words[0] + '.';
    }

    // ─── Scroll Animations (IntersectionObserver) ────────────
    const animateElements = document.querySelectorAll('.animate-in');
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Staggered delay for siblings
                    const parent = entry.target.parentElement;
                    const siblings = parent ? parent.querySelectorAll('.animate-in') : [];
                    let i = Array.from(siblings).indexOf(entry.target);
                    if (i < 0) i = 0;

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, i * 100);

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        animateElements.forEach(el => observer.observe(el));
    }

    // ─── Counter Animation ───────────────────────────────────
    function animateCounters() {
        const counters = document.querySelectorAll('[data-target]');
        counters.forEach(counter => {
            if (counter.dataset.animated) return;

            const target = parseInt(counter.dataset.target);
            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const start = performance.now();

            counter.dataset.animated = 'true';

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);
                counter.textContent = current + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
        });
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Observe hero stats and numbers section
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);

    const numbersSection = document.querySelector('.numbers-section');
    if (numbersSection) counterObserver.observe(numbersSection);

    // ─── Nav Scroll Effect ───────────────────────────────────
    const nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // ─── Smooth Scrolling ────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }

            // Close mobile menu
            const navLinks = document.getElementById('navLinks');
            if (navLinks) navLinks.classList.remove('open');
        });
    });

    // ─── Mobile Nav Toggle ───────────────────────────────────
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // ─── FAQ Accordion ───────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('open');
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // ─── Waitlist Form ───────────────────────────────────────
    const waitlistForm = document.getElementById('waitlistForm');
    const waitlistSuccess = document.getElementById('waitlistSuccess');
    const waitlistSubmit = document.getElementById('waitlistSubmit');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = waitlistSubmit;
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Joining...
            `;

            try {
                const formData = new FormData(waitlistForm);
                const response = await fetch(waitlistForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    waitlistForm.style.display = 'none';
                    waitlistSuccess.style.display = 'block';

                    // Update spots count
                    const spotsCount = document.querySelector('.waitlist-spots-count');
                    if (spotsCount) {
                        const current = parseInt(spotsCount.textContent) + 1;
                        spotsCount.textContent = current;
                        const fill = document.querySelector('.waitlist-spots-fill');
                        if (fill) fill.style.width = `${(current / 500) * 100}%`;
                    }
                } else {
                    throw new Error('Failed');
                }
            } catch (err) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                alert('Oops! Something went wrong. Please try again.');
            }
        });
    }

    // Add spin keyframes for loading
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg) } }`;
    document.head.appendChild(spinStyle);

})();
