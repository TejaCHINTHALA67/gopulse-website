/* ═══════════════════════════════════════════════════════════════
   PULSE — Website JS 2026
   GSAP scroll animations, Supabase pre-registration
   Apple-style clean, purposeful motion
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

// ─── GSAP Animations ─────────────────────────────────────────
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        $$('.reveal').forEach(el => el.classList.add('visible'));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Gentle reveal on scroll — Apple-style subtlety
    $$('.reveal').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 1,
                ease: 'power2.out',
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
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0, duration: 0.8,
            stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: '.features-grid', start: 'top 82%' }
        }
    );

    // Step cards stagger
    gsap.fromTo('.step-card',
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0, duration: 0.8,
            stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '.steps-grid', start: 'top 82%' }
        }
    );

    // Showcase images — fade + scale up cleanly
    $$('.showcase-image').forEach(img => {
        gsap.fromTo(img,
            { opacity: 0, y: 60, scale: 0.92 },
            {
                opacity: 1, y: 0, scale: 1, duration: 1.1,
                ease: 'power2.out',
                scrollTrigger: { trigger: img, start: 'top 85%' }
            }
        );
    });

    // Showcase text — subtle slide
    $$('.showcase-text').forEach(txt => {
        gsap.fromTo(txt,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.9,
                ease: 'power2.out',
                scrollTrigger: { trigger: txt, start: 'top 85%' }
            }
        );
    });

    // Stat cards
    gsap.fromTo('.stat-card',
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0, duration: 0.7,
            stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.stats-grid', start: 'top 85%' }
        }
    );

    // CTA card
    gsap.fromTo('.cta-card',
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: '.cta-section', start: 'top 80%' }
        }
    );

    // FAQ items
    gsap.fromTo('.faq-item',
        { opacity: 0, x: -20 },
        {
            opacity: 1, x: 0, duration: 0.5,
            stagger: 0.06, ease: 'power2.out',
            scrollTrigger: { trigger: '.faq-list', start: 'top 82%' }
        }
    );
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
            const dur = 1800, t0 = performance.now();
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
            el.style.transition = 'opacity 0.4s, transform 0.4s';
            el.style.opacity = '0';
            el.style.transform = 'translateY(8px)';
            setTimeout(() => {
                el.textContent = lines[cycle][i];
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 350 + i * 60);
        });
    }, 4500);
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

// ─── Confetti (monochrome) ───────────────────────────────────
function confetti() {
    const c = document.getElementById('confettiCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    c.width = innerWidth; c.height = innerHeight;

    const cols = ['#000','#333','#666','#999','#ccc','#fff'];
    const p = Array.from({ length: 120 }, () => ({
        x: c.width / 2 + (Math.random() - 0.5) * 300,
        y: c.height * 0.4,
        vx: (Math.random() - 0.5) * 18,
        vy: -Math.random() * 16 - 5,
        w: Math.random() * 7 + 3,
        h: Math.random() * 4 + 2,
        col: cols[Math.random() * cols.length | 0],
        rot: Math.random() * 360,
        rs: (Math.random() - 0.5) * 12,
        g: 0.35 + Math.random() * 0.2,
        o: 1,
    }));

    let f = 0;
    (function draw() {
        ctx.clearRect(0, 0, c.width, c.height);
        let alive = false;
        p.forEach(i => {
            i.vy += i.g; i.x += i.vx; i.y += i.vy; i.rot += i.rs; i.vx *= 0.99;
            if (f > 30) i.o -= 0.016;
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
        if (alive && f < 150) requestAnimationFrame(draw);
        else ctx.clearRect(0, 0, c.width, c.height);
    })();
}

// ─── Nav Scroll ──────────────────────────────────────────────
const nav = document.getElementById('nav');
addEventListener('scroll', () => { if (nav) nav.classList.toggle('scrolled', scrollY > 40); });

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
    initStatCounters();
    initHeroCycle();
    loadCount();

    if (typeof gsap !== 'undefined') {
        initGSAP();
    } else {
        const checkGSAP = setInterval(() => {
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                clearInterval(checkGSAP);
                initGSAP();
            }
        }, 100);
        setTimeout(() => {
            clearInterval(checkGSAP);
            if (typeof gsap === 'undefined') {
                $$('.reveal').forEach(el => el.classList.add('visible'));
            }
        }, 3000);
    }
});
