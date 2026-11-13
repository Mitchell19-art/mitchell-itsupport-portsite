// ----- Tools marquee: duplicate the logos so the loop is seamless ----
const toolsList = document.querySelector('.tools-list');

if (toolsList)  {
    const items = Array.from(toolsList.children);

    items.forEach(function (item) {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        toolsList.appendChild(clone);
    });
}
// ----- 1. Mobile menu -----
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

function closeMenu() {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close with the Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
}
// ----- 2. Highlight the nav link of the section in view -----
const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav-links a');

if (sections.length && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (link) {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });
}
// ----- 3. Fade elements in as they scroll into view -----
const revealTargets = document.querySelectorAll(
  '.section-title, .card, .cta-banner, .project, .certification, .cv-card, .contact-content, .marquee'
);

revealTargets.forEach(function (el, index) {
  el.classList.add('reveal');
  // Small stagger so cards in the same row don't appear at once
  el.style.transitionDelay = (index % 2) * 0.1 + 's';
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);

        // Clean up afterwards so hover effects on cards still work
        setTimeout(function () {
          entry.target.classList.remove('reveal', 'visible');
          entry.target.style.transitionDelay = '';
        }, 1000);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(function (el) {
    revealObserver.observe(el);
  });
} else {
  // Old browsers: just show everything
  revealTargets.forEach(function (el) {
    el.classList.remove('reveal');
  });
}
// ----- 4. Click-to-enlarge screenshots -----
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
const lightboxClose = document.getElementById('lightbox-close');

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (lightbox && lightboxImg) {
  document.querySelectorAll('.project-shots img, .certificate-wrap img').forEach(function (img) {
    img.addEventListener('click', function () {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // stop the page scrolling behind
    });
  });

  lightbox.addEventListener('click', function (e) {
    // Close when clicking the dark background, not the image itself
    if (e.target !== lightboxImg) closeLightbox();
  });

  lightboxClose.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
}