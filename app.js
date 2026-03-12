/* ═══════════════════════════════════════════════════════════════
   PULSE — Website JS
   Supabase pre-registration, confetti, animations
   ═══════════════════════════════════════════════════════════════ */

// ─── Supabase ────────────────────────────────────────────────
const SB_URL = 'https://gqwjorjketqnpwrmcujd.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxd2pvcmprZXRxbnB3cm1jdWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTA2MDYsImV4cCI6MjA4NTY2NjYwNn0.LoModGE2IYzfxwgS-rW-1w9vvXn9rdvMYwsW6baQlDM';

let sb;
try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) { console.warn('Supabase init failed', e); }

// ─── Elements ────────────────────────────────────────────────
const $ = (s) => document.querySelector(s);
const form = $('#preregForm');
const btn = $('#preregBtn');
const wrap = $('#preregWrap');
const success = $('#preregSuccess');
const emailInput = $('#preregEmail');
const counterEl = $('#counterNum');

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
    const dur = 1000;
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

    const cols = ['#0a0a0a','#444','#888','#3B82F6','#22C55E','#F59E0B','#EF4444','#8B5CF6'];
    const p = Array.from({ length: 140 }, () => ({
        x: c.width / 2 + (Math.random() - 0.5) * 200,
        y: c.height * 0.35,
        vx: (Math.random() - 0.5) * 18,
        vy: -Math.random() * 16 - 6,
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

// ─── Cycling Headline ────────────────────────────────────────
const words = ['Train Smarter.', 'Eat Better.', 'Live Stronger.'];
let wi = 0;
const wEl = document.getElementById('cycleWord');
if (wEl) setInterval(() => {
    wi = (wi + 1) % words.length;
    wEl.style.opacity = '0';
    wEl.style.transform = 'translateY(12px)';
    setTimeout(() => {
        wEl.textContent = words[wi];
        wEl.style.opacity = '1';
        wEl.style.transform = 'translateY(0)';
    }, 250);
}, 2500);

// ─── Reveal on Scroll ────────────────────────────────────────
const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

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
document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    });
});

// ─── Stat Counters ───────────────────────────────────────────
const so = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const t = parseInt(el.dataset.target);
        const s = el.dataset.suffix || '';
        if (isNaN(t)) return;
        const dur = 1400, t0 = performance.now();
        (function tick(now) {
            const p = Math.min((now - t0) / dur, 1);
            el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))) + s;
            if (p < 1) requestAnimationFrame(tick);
        })(t0);
        so.unobserve(el);
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-val[data-target]').forEach(el => so.observe(el));

// ─── Init ────────────────────────────────────────────────────
loadCount();
