// Progylm static interactions: loader, welcome modal, mobile navigation, reveal animation, and contact form feedback.
const loader = document.querySelector('.loader');
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const welcome = document.querySelector('[data-welcome]');
const welcomeClose = document.querySelector('[data-welcome-close]');
const welcomeStart = document.querySelector('[data-welcome-start]');
const contactForm = document.querySelector('[data-contact-form]');
const formNote = document.querySelector('[data-form-note]');
const welcomeKey = 'progylm-preview-redesign-welcome-v2';

function closeWelcome() {
  if (!welcome) return;
  welcome.classList.remove('show');
  welcome.setAttribute('aria-hidden', 'true');
  localStorage.setItem(welcomeKey, 'true');
}

window.addEventListener('load', () => {
  setTimeout(() => loader?.classList.add('hidden'), 260);
  if (welcome && !localStorage.getItem(welcomeKey)) {
    setTimeout(() => {
      welcome.classList.add('show');
      welcome.setAttribute('aria-hidden', 'false');
    }, 650);
  }
});

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('nav-open', isOpen);
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  });
});

welcomeClose?.addEventListener('click', closeWelcome);
welcomeStart?.addEventListener('click', closeWelcome);
welcome?.addEventListener('click', (event) => {
  if (event.target === welcome) closeWelcome();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && welcome?.classList.contains('show')) closeWelcome();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  contactForm.reset();
  if (formNote) {
    formNote.textContent = 'Thank you. This static form is ready; connect it to your preferred email/form service before launch.';
  }
});


// Basic static-site protection deterrents. This discourages casual right-click/download/source shortcuts,
// but a browser-rendered HTML/CSS/JS website cannot be truly encrypted on the client side.
document.body.classList.add('content-guard');
document.addEventListener('contextmenu', (event) => event.preventDefault());
document.addEventListener('dragstart', (event) => {
  if (event.target.closest('img, .protected-brand')) event.preventDefault();
});
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const blocked =
    event.key === 'F12' ||
    (event.ctrlKey && ['s', 'u', 'p'].includes(key)) ||
    (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key));
  if (blocked) {
    event.preventDefault();
    event.stopPropagation();
  }
});

// Year-wise NEET table filter. Works without React and keeps all data in the static HTML.
const yearFilterButtons = document.querySelectorAll('[data-year-filter]');
const yearCells = document.querySelectorAll('[data-year-cell]');
yearFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedYear = button.dataset.yearFilter;
    yearFilterButtons.forEach((item) => item.classList.toggle('active', item === button));
    yearCells.forEach((cell) => {
      const shouldHide = selectedYear !== 'all' && cell.dataset.yearCell !== selectedYear;
      cell.classList.toggle('year-hidden', shouldHide);
    });
  });
});
