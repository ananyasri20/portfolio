/* ============================================
   ANANYA SRIVASTAVA — PORTFOLIO
   script.js — All interactivity
   ============================================ */

/* ── THEME TOGGLE ── */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ── STICKY NAVBAR ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── MOBILE HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  // Animate hamburger to X
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── TYPING ANIMATION ── */
const typingEl = document.getElementById('typingText');
const roles = [
  'Full Stack Developer',
  'MERN Stack Engineer',
  'React Developer',
  'Problem Solver',
  'CS Final Year Student',
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingPaused = false;

function type() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    typingEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      typingPaused = true;
      setTimeout(() => { typingPaused = false; isDeleting = true; requestAnimationFrame(tick); }, 1800);
      return;
    }
  } else {
    typingEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  if (!typingPaused) {
    const speed = isDeleting ? 50 : 90;
    setTimeout(type, speed);
  }
}

// Start typing after hero animation
setTimeout(type, 1200);

function tick() { type(); }

/* ── SCROLL REVEAL ── */
// Add js-loaded to body so reveal CSS kicks in only when JS is running
document.body.classList.add('js-loaded');

const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const selfIndex = siblings.indexOf(entry.target);
        const delay = Math.min(selfIndex * 80, 300);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
);

reveals.forEach(el => revealObserver.observe(el));

// Fallback: if elements still invisible after 1.5s, force reveal all
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    el.classList.add('visible');
  });
}, 1500);

/* ── PROJECT FILTER ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const tags = card.getAttribute('data-tags') || '';
      const match = filter === 'all' || tags.includes(filter);

      if (match) {
        card.classList.remove('hidden');
        // Trigger re-reveal
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          setTimeout(() => {
            card.style.opacity = '';
            card.style.transform = '';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          }, 50);
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── BACK TO TOP ── */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── CONTACT FORM VALIDATION ── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function getVal(id) {
  return document.getElementById(id).value.trim();
}
function setError(field, errId, msg) {
  const input = document.getElementById(field);
  const errEl = document.getElementById(errId);
  if (msg) {
    input.classList.add('error');
    errEl.textContent = msg;
    return false;
  } else {
    input.classList.remove('error');
    errEl.textContent = '';
    return true;
  }
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  let valid = true;

  const name = getVal('name');
  const email = getVal('email');
  const subject = getVal('subject');
  const message = getVal('message');

  valid = setError('name', 'nameError', name.length < 2 ? 'Please enter your name.' : '') && valid;
  valid = setError('email', 'emailError', !isValidEmail(email) ? 'Please enter a valid email.' : '') && valid;
  valid = setError('subject', 'subjectError', subject.length < 3 ? 'Please enter a subject.' : '') && valid;
  valid = setError('message', 'messageError', message.length < 10 ? 'Message must be at least 10 characters.' : '') && valid;

  return valid;
}

// Live validation
['name', 'email', 'subject', 'message'].forEach(fieldId => {
  document.getElementById(fieldId).addEventListener('input', () => {
    validateForm();
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.querySelector('span').textContent = 'Sending...';

  // Simulate send (replace with real endpoint if needed)
  setTimeout(() => {
    form.reset();
    submitBtn.disabled = false;
    submitBtn.querySelector('span').textContent = 'Send Message';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 4000);
  }, 1200);
});

/* ── SMOOTH ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinksAll.forEach(a => a.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--accent)';
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => activeObserver.observe(s));
