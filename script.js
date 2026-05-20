// Shared Progylm interactions: loading state, first-visit welcome, theme, navigation, reveal animations, and contact form UI.
const html = document.documentElement;
const header = document.querySelector("[data-header]");
const loader = document.querySelector(".loader");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeIcon = document.querySelector(".theme-icon");
const welcome = document.querySelector("[data-welcome]");
const welcomeClose = document.querySelector("[data-welcome-close]");
const welcomeStart = document.querySelector("[data-welcome-start]");
const welcomeStorageKey = "progylm-welcome-seen-v2";

const savedTheme = localStorage.getItem("progylm-theme");
if (savedTheme) {
  html.setAttribute("data-theme", savedTheme);
}

function syncThemeIcon() {
  if (themeIcon) {
    themeIcon.textContent = html.getAttribute("data-theme") === "light" ? "☀" : "☾";
  }
}

function closeWelcome() {
  if (!welcome) return;
  welcome.classList.remove("show");
  welcome.setAttribute("aria-hidden", "true");
  localStorage.setItem(welcomeStorageKey, "true");
}

syncThemeIcon();

window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("hidden"), 280);

  if (welcome && !localStorage.getItem(welcomeStorageKey)) {
    setTimeout(() => {
      welcome.classList.add("show");
      welcome.setAttribute("aria-hidden", "false");
    }, 650);
  }
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 12);
});

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  });
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", nextTheme);
  localStorage.setItem("progylm-theme", nextTheme);
  syncThemeIcon();
});

welcomeClose?.addEventListener("click", closeWelcome);
welcomeStart?.addEventListener("click", closeWelcome);
welcome?.addEventListener("click", (event) => {
  if (event.target === welcome) closeWelcome();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && welcome?.classList.contains("show")) {
    closeWelcome();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();
  if (formNote) {
    formNote.textContent = "Thank you. The form interface is working; connect it to email when the site goes live.";
  }
});
