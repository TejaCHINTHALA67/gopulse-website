/* ═══════════════════════════════════════════════════════════════
   PULSE — Website JavaScript
   Pre-registration, Supabase, Confetti, Animations
   ═══════════════════════════════════════════════════════════════ */

// ─── Supabase Config ─────────────────────────────────────────
const SUPABASE_URL = 'https://gqwjorjketqnpwrmcujd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxd2pvcmprZXRxbnB3cm1jdWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTA2MDYsImV4cCI6MjA4NTY2NjYwNn0.LoModGE2IYzfxwgS-rW-1w9vvXn9rdvMYwsW6baQlDM';

let supabase;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
    console.warn('Supabase client failed to init:', e);
}

// ─── Pre-Registration ────────────────────────────────────────
const preregForm = document.getElementById('preregForm');
const preregBtn = document.getElementById('preregBtn');
const preregWrap = document.getElementById('preregWrap');
const preregSuccess = document.getElementById('preregSuccess');
const preregEmail = document.getElementById('preregEmail');
const counterNum = document.getElementById('counterNum');

// Load signup count on page load
async function loadSignupCount() {
    if (!supabase) return;
    try {
        const { count, error } = await supabase
            .from('preregistrations')
            .select('*', { count: 'exact', head: true });
        if (!error && count !== null) {
            animateCounter(count);
        }
    } catch (e) {
        console.warn('Count fetch failed:', e);
    }
}

function animateCounter(target) {
    const el = counterNum;
    if (!el) return;
    const start = parseInt(el.textContent) || 0;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + (target - start) * eased);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// Handle form submission
if (preregForm) {
    preregForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = preregEmail.value.trim().toLowerCase();
        if (!email) return;

        // Show loading
        preregBtn.classList.add('loading');
        preregBtn.disabled = true;

        try {
            if (!supabase) throw new Error('No supabase');

            // Check for duplicate
            const { data: existing } = await supabase
                .from('preregistrations')
                .select('id')
                .eq('email', email)
                .maybeSingle();

            if (existing) {
                // Already registered
                showSuccess();
                return;
            }

            // Insert new registration
            const { error } = await supabase
                .from('preregistrations')
                .insert({
                    email: email,
                    source: document.referrer || 'direct',
                    user_agent: navigator.userAgent.substring(0, 200),
                });

            if (error) throw error;

            showSuccess();
            fireConfetti();

            // Update counter
            const { count } = await supabase
                .from('preregistrations')
                .select('*', { count: 'exact', head: true });
            if (count !== null) animateCounter(count);

        } catch (err) {
            console.error('Registration error:', err);
            // Show success anyway if it's a constraint violation (duplicate)
            if (err.code === '23505') {
                showSuccess();
            } else {
                preregBtn.classList.remove('loading');
                preregBtn.disabled = false;
                alert('Something went wrong. Please try again.');
            }
        }
    });
}

function showSuccess() {
    if (preregWrap) preregWrap.style.display = 'none';
    if (preregSuccess) preregSuccess.style.display = 'block';

    // Set up share links
    const shareText = encodeURIComponent("I just pre-registered for Pulse — an AI fitness & nutrition coach that looks insane 🔥 Check it out: https://gopulse.health");
    const shareTwitter = document.getElementById('shareTwitter');
    if (shareTwitter) {
        shareTwitter.href = `https://twitter.com/intent/tweet?text=${shareText}`;
    }
}

// Copy link button
const shareCopy = document.getElementById('shareCopy');
if (shareCopy) {
    shareCopy.addEventListener('click', () => {
        navigator.clipboard.writeText('https://gopulse.health').then(() => {
            shareCopy.textContent = '✓ Copied!';
            setTimeout(() => { shareCopy.textContent = 'Copy Link'; }, 2000);
        });
    });
}

// ─── Confetti ────────────────────────────────────────────────
function fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#111111', '#333333', '#666666', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];
    const particles = [];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height * 0.4,
            vx: (Math.random() - 0.5) * 20,
            vy: -Math.random() * 18 - 5,
            w: Math.random() * 8 + 4,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 15,
            gravity: 0.4 + Math.random() * 0.2,
            opacity: 1,
        });
    }

    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        particles.forEach(p => {
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            p.vx *= 0.99;

            if (frame > 40) p.opacity -= 0.015;
            if (p.opacity <= 0) return;

            alive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        frame++;
        if (alive && frame < 180) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    requestAnimationFrame(draw);
}

// ─── Cycling Headline ────────────────────────────────────────
const HERO_WORDS = ['Train Smarter.', 'Eat Better.', 'Live Stronger.'];
let wordIdx = 0;
const wordEl = document.getElementById('cyclingWord');

if (wordEl) {
    setInterval(() => {
        wordIdx = (wordIdx + 1) % HERO_WORDS.length;
        wordEl.style.opacity = '0';
        wordEl.style.transform = 'translateY(10px)';
        setTimeout(() => {
            wordEl.textContent = HERO_WORDS[wordIdx];
            wordEl.style.opacity = '1';
            wordEl.style.transform = 'translateY(0)';
        }, 300);
    }, 2500);
}

// ─── Scroll Animations ──────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.anim-in').forEach(el => observer.observe(el));

// ─── Nav Scroll ──────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// ─── Mobile Menu ─────────────────────────────────────────────
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// ─── FAQ Accordion ───────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        // Toggle
        if (!wasOpen) item.classList.add('open');
    });
});

// ─── Stat Counter Animation ──────────────────────────────────
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            if (isNaN(target)) return;

            const duration = 1500;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value[data-target]').forEach(el => statObserver.observe(el));

// ─── Init ────────────────────────────────────────────────────
loadSignupCount();
