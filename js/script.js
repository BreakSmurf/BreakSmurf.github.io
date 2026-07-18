// ===================== NAV: scroll state + mobile burger =====================
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  updateScrollProgress();
  updateActiveNavLink();
  toggleBackToTop();
});

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===================== SCROLL PROGRESS BAR =====================
const progressBar = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}

// ===================== ACTIVE NAV LINK ON SCROLL =====================
const sections = document.querySelectorAll('section[id]');
function updateActiveNavLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

// ===================== BACK TO TOP =====================
const backToTop = document.getElementById('backToTop');
function toggleBackToTop() {
  backToTop.classList.toggle('show', window.scrollY > 600);
}
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================== TYPING EFFECT (HERO) =====================
const typedEl = document.getElementById('typedText');
const phrases = [
  'Будущий специалист по кибербезопасности',
  'Изучаю сетевую безопасность и пентест',
  'Собираю портфолио, пока учусь',
  'Blue Team energy, White Hat mindset'
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    charIdx++;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIdx--;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

// ===================== MATRIX RAIN BACKGROUND =====================
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let width, height, columns, drops;
const chars = 'アイウエオカキクケコサシスセソ01アイウエオ$#@%&*<>/\\{}[]';

function resizeCanvas() {
  width = canvas.width = canvas.offsetWidth;
  height = canvas.height = canvas.offsetHeight;
  const fontSize = 15;
  columns = Math.floor(width / fontSize);
  drops = new Array(columns).fill(1);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawMatrix() {
  ctx.fillStyle = 'rgba(10,10,12,0.08)';
  ctx.fillRect(0, 0, width, height);

  ctx.font = '15px monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    const x = i * 15;
    const y = drops[i] * 15;

    const grad = Math.random() > 0.95 ? '#ff3b5c' : 'rgba(255,23,68,0.55)';
    ctx.fillStyle = grad;
    ctx.fillText(text, x, y);

    if (y > height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
let matrixInterval = setInterval(drawMatrix, 45);

// pause matrix rain when hero not visible (perf)
const heroSection = document.getElementById('home');
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!matrixInterval) matrixInterval = setInterval(drawMatrix, 45);
    } else {
      clearInterval(matrixInterval);
      matrixInterval = null;
    }
  });
});
heroObserver.observe(heroSection);

// ===================== SCROLL REVEAL =====================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ===================== HERO STAT COUNTERS =====================
const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;
function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;
  statNums.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  });
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) animateCounters(); });
}, { threshold: 0.5 });
const heroStatsEl = document.querySelector('.hero-stats');
if (heroStatsEl) statsObserver.observe(heroStatsEl);

// ===================== PROJECT FILTERS =====================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const cats = card.getAttribute('data-cat').split(' ');
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

// ===================== CLICKABLE PROJECT CARDS =====================
document.querySelectorAll('.project-card[data-href]').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // не дублировать переход, если кликнули по самой ссылке
    window.location.href = card.getAttribute('data-href');
  });
});

// ===================== FOOTER YEAR =====================
document.getElementById('year').textContent = new Date().getFullYear();
