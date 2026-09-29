const menuButton = document.getElementById('menuButton');
const mainNav = document.getElementById('mainNav');
const bookingForm = document.getElementById('bookingForm');

if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav a').forEach((link) => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function setupScrollReveal() {
  const revealItems = document.querySelectorAll('.feature-card, .room-card, .gallery-item, .testimonial-card, .booking-form, .section-header');

  revealItems.forEach((item) => {
    item.classList.add('animated-item');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18,
  });

  revealItems.forEach((item) => observer.observe(item));
}

document.addEventListener('DOMContentLoaded', () => {
  setupScrollReveal();
});

if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const name = formData.get('name');
    const checkin = formData.get('checkin');
    const checkout = formData.get('checkout');
    const roomType = formData.get('roomType');

    alert(`Thank you, ${name}!\nYour ${roomType} reservation from ${checkin} to ${checkout} is being processed.`);
    bookingForm.reset();
  });
}
