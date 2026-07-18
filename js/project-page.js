// ===================== NAV SCROLL STATE =====================
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

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

// ===================== TERMINAL TYPING DEMO =====================
function typeText(el, text, totalDuration = 2200) {
  const chunk = Math.max(1, Math.floor(text.length / (totalDuration / 16)));
  let i = 0;
  el.textContent = '';
  el.classList.add('typing');
  function step() {
    i += chunk;
    el.textContent = text.slice(0, i);
    if (i < text.length) {
      requestAnimationFrame(step);
    } else {
      el.textContent = text;
      el.classList.remove('typing');
    }
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('.terminal-demo pre').forEach(pre => {
  const fullText = pre.textContent;
  pre.textContent = '';
  const demoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeText(pre, fullText);
        demoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  demoObserver.observe(pre);
});
