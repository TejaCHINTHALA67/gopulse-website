/* ═══════════════════════════════════════════════════════════════
   PULSE — Website JS 2026
   GSAP animations, Supabase pre-registration, particles, confetti
   ═══════════════════════════════════════════════════════════════ */

// ─── Supabase ────────────────────────────────────────────────
const SB_URL = 'https://gqwjorjketqnpwrmcujd.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxd2pvcmprZXRxbnB3cm1jdWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTA2MDYsImV4cCI6MjA4NTY2NjYwNn0.LoModGE2IYzfxwgS-rW-1w9vvXn9rdvMYwsW6baQlDM';

let sb;
try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) { console.warn('Supabase init failed', e); }

// ─── Helpers ─────────────────────────────────────────────────
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ─── Elements ────────────────────────────────────────────────
const form = $('#preregForm');
const btn = $('#preregBtn');
const wrap = $('#preregWrap');
const success = $('#preregSuccess');
const emailInput = $('#preregEmail');
const counterEl = $('#counterNum');

// ─── Particle Background ────────────────────────────────────
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;

    function resize() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(60, Math.floor(w * h / 20000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
                o: Math.random() * 0.3 + 0.1,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6,182,212,${p.o})`;
            ctx.fill();
        });

        // Draw lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6,182,212,${0.04 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();
    window.addEventListener('resize', () => { resize(); createParticles(); });
}

// ─── GSAP Animations ─────────────────────────────────────────
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        // Fallback: just reveal everything
        $$('.reveal').forEach(el => el.classList.add('visible'));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Reveal on scroll
    $$('.reveal').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    // Feature cards stagger
    gsap.fromTo('.feature-card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
            opacity: 1, y: 0, scale: 1, duration: 0.7,
            stagger: 0.1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%',
            }
        }
    );

    // Step cards stagger
    gsap.fromTo('.step-card',
        { opacity: 0, y: 60 },
        {
            opacity: 1, y: 0, duration: 0.7,
            stagger: 0.15, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.steps-grid',
                start: 'top 80%',
            }
        }
    );

    // Why cards stagger
    gsap.fromTo('.why-card',
        { opacity: 0, y: 50, scale: 0.95 },
        {
            opacity: 1, y: 0, scale: 1, duration: 0.7,
            stagger: 0.12, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.why-grid',
                start: 'top 80%',
            }
        }
    );

    // Showcase cards stagger
    gsap.fromTo('.showcase-card',
        { opacity: 0, y: 80, scale: 0.9 },
        {
            opacity: 1, y: 0, scale: 1, duration: 0.8,
            stagger: 0.12, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.showcase-scroll',
                start: 'top 85%',
            }
        }
    );

    // Stat cards
    gsap.fromTo('.stat-card',
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0, duration: 0.6,
            stagger: 0.1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.stats-grid',
                start: 'top 85%',
            }
        }
    );

    // CTA card
    gsap.fromTo('.cta-card',
        { opacity: 0, y: 60, scale: 0.97 },
        {
            opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 80%',
            }
        }
    );

    // FAQ items stagger
    gsap.fromTo('.faq-item',
        { opacity: 0, x: -30 },
        {
            opacity: 1, x: 0, duration: 0.5,
            stagger: 0.08, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.faq-list',
                start: 'top 80%',
            }
        }
    );

    // Parallax glows
    gsap.to('.hero-glow--1', {
        y: 100, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.hero-glow--2', {
        y: -80, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
}

// ─── Stat Counter Animation ──────────────────────────────────
function initStatCounters() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const t = parseInt(el.dataset.target);
            const s = el.dataset.suffix || '';
            if (isNaN(t)) return;
            const dur = 1600, t0 = performance.now();
            (function tick(now) {
                const p = Math.min((now - t0) / dur, 1);
                el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))) + s;
                if (p < 1) requestAnimationFrame(tick);
            })(t0);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });
    $$('.stat-val[data-target]').forEach(el => observer.observe(el));
}

// ─── Hero Text Cycling ───────────────────────────────────────
function initHeroCycle() {
    const lines = [
        ['Train Smarter.', 'Eat Better.', 'Live Stronger.'],
        ['Build Muscle.', 'Burn Fat.', 'Feel Alive.'],
        ['Track Macros.', 'Hit Goals.', 'Level Up.'],
    ];
    let cycle = 0;
    const el1 = $('#heroLine1');
    const el2 = $('#heroLine2');
    const el3 = $('#heroLine3');
    if (!el1 || !el2 || !el3) return;

    setInterval(() => {
        cycle = (cycle + 1) % lines.length;
        [el1, el2, el3].forEach((el, i) => {
            el.style.transition = 'opacity 0.3s, transform 0.3s';
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            setTimeout(() => {
                el.textContent = lines[cycle][i];
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                // Re-apply gradient to accent line
                if (i === 1) {
                    el.classList.add('hero-line--accent');
                }
            }, 300 + i * 80);
        });
    }, 4000);
}

// ─── Load Count ──────────────────────────────────────────────
async function loadCount() {
    if (!sb) return;
    try {
        const { count } = await sb.from('preregistrations').select('*', { count: 'exact', head: true });
        if (count !== null) animateNum(counterEl, count);
    } catch (e) { /* silent */ }
}

function animateNum(el, target) {
    if (!el) return;
    const from = parseInt(el.textContent) || 0;
    const dur = 1200;
    const t0 = performance.now();
    (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
    })(t0);
}

// ─── Form Submit ─────────────────────────────────────────────
if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    if (!email) return;

    btn.classList.add('loading');
    btn.disabled = true;

    try {
        if (!sb) throw new Error('no sb');

        const { data: dup } = await sb.from('preregistrations').select('id').eq('email', email).maybeSingle();
        if (dup) { showSuccess(); return; }

        const { error } = await sb.from('preregistrations').insert({
            email,
            source: document.referrer || 'direct',
            user_agent: navigator.userAgent.substring(0, 200),
        });
        if (error) throw error;

        showSuccess();
        confetti();

        const { count } = await sb.from('preregistrations').select('*', { count: 'exact', head: true });
        if (count !== null) animateNum(counterEl, count);

    } catch (err) {
        if (err.code === '23505') { showSuccess(); return; }
        btn.classList.remove('loading');
        btn.disabled = false;
        alert('Something went wrong — please try again.');
    }
});

function showSuccess() {
    if (wrap) wrap.style.display = 'none';
    if (success) success.style.display = 'block';
    const txt = encodeURIComponent("Just pre-registered for Pulse — an AI fitness & nutrition coach 🔥 https://gopulse.health");
    const x = $('#shareX');
    if (x) x.href = `https://twitter.com/intent/tweet?text=${txt}`;
}

const copyBtn = $('#shareCopy');
if (copyBtn) copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('https://gopulse.health').then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy Link', 2000);
    });
});

// ─── Confetti ────────────────────────────────────────────────
function confetti() {
    const c = document.getElementById('confettiCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    c.width = innerWidth; c.height = innerHeight;

    const cols = ['#06b6d4','#8b5cf6','#22c55e','#f59e0b','#ef4444','#ec4899','#fff'];
    const p = Array.from({ length: 150 }, () => ({
        x: c.width / 2 + (Math.random() - 0.5) * 300,
        y: c.height * 0.4,
        vx: (Math.random() - 0.5) * 20,
        vy: -Math.random() * 18 - 6,
        w: Math.random() * 8 + 4,
        h: Math.random() * 5 + 3,
        col: cols[Math.random() * cols.length | 0],
        rot: Math.random() * 360,
        rs: (Math.random() - 0.5) * 14,
        g: 0.35 + Math.random() * 0.2,
        o: 1,
    }));

    let f = 0;
    (function draw() {
        ctx.clearRect(0, 0, c.width, c.height);
        let alive = false;
        p.forEach(i => {
            i.vy += i.g; i.x += i.vx; i.y += i.vy; i.rot += i.rs; i.vx *= 0.99;
            if (f > 35) i.o -= 0.014;
            if (i.o <= 0) return;
            alive = true;
            ctx.save();
            ctx.translate(i.x, i.y);
            ctx.rotate(i.rot * Math.PI / 180);
            ctx.globalAlpha = Math.max(0, i.o);
            ctx.fillStyle = i.col;
            ctx.fillRect(-i.w / 2, -i.h / 2, i.w, i.h);
            ctx.restore();
        });
        f++;
        if (alive && f < 160) requestAnimationFrame(draw);
        else ctx.clearRect(0, 0, c.width, c.height);
    })();
}

// ─── Nav Scroll ──────────────────────────────────────────────
const nav = document.getElementById('nav');
addEventListener('scroll', () => { if (nav) nav.classList.toggle('scrolled', scrollY > 60); });

// ─── Mobile Menu ─────────────────────────────────────────────
const hb = document.getElementById('hamburger');
const nl = document.getElementById('navLinks');
if (hb && nl) {
    hb.addEventListener('click', () => nl.classList.toggle('open'));
    nl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nl.classList.remove('open')));
}

// ─── FAQ ─────────────────────────────────────────────────────
$$('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        $$('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    });
});

// ─── Smooth Scroll ───────────────────────────────────────────
$$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initStatCounters();
    initHeroCycle();
    loadCount();

    // Wait for GSAP to load (it's deferred)
    if (typeof gsap !== 'undefined') {
        initGSAP();
    } else {
        // GSAP loads deferred — wait a bit
        const checkGSAP = setInterval(() => {
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                clearInterval(checkGSAP);
                initGSAP();
            }
        }, 100);
        // Timeout fallback: just reveal everything
        setTimeout(() => {
            clearInterval(checkGSAP);
            if (typeof gsap === 'undefined') {
                $$('.reveal').forEach(el => el.classList.add('visible'));
            }
        }, 3000);
    }
});
