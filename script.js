// Mobile Navigation Toggle
const menuButton = document.getElementById('menuButton');
const mainNav = document.getElementById('mainNav');
const bookingForm = document.getElementById('bookingForm');
const bookingModal = document.getElementById('bookingModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const scrollProgress = document.getElementById('scrollProgress');

if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link, .nav-btn-book').forEach((link) => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Scroll Progress Bar & Header Glass Effect
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight > 0 && scrollProgress) {
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
  }
});

// Scroll Reveal with Staggered Delays
function setupScrollReveal() {
  const revealItems = document.querySelectorAll(
    '.feature-card, .room-card, .gallery-item, .testimonial-card, .booking-form, .booking-intro, .section-header, .moving-badge'
  );

  revealItems.forEach((item, index) => {
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
    threshold: 0.12,
  });

  revealItems.forEach((item) => observer.observe(item));
}

// Interactive 3D Tilt Effect on Cards
function setupInteractiveTilt() {
  const tiltCards = document.querySelectorAll('.interactive-tilt');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

// Animated Stat Counters
function setupStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let started = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        statNumbers.forEach((counter) => {
          const target = +counter.getAttribute('data-target');
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * target);
            
            counter.innerText = currentVal;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }
}

// Pre-fill Suite Selection from Room Cards
window.selectRoom = function(roomName) {
  const roomSelect = document.getElementById('roomType');
  if (roomSelect) {
    for (let i = 0; i < roomSelect.options.length; i++) {
      if (roomSelect.options[i].text.includes(roomName) || roomSelect.options[i].value.includes(roomName)) {
        roomSelect.selectedIndex = i;
        break;
      }
    }
  }
};

// Booking Form Submission & Modal Confirmation
if (bookingForm) {
  // Set default dates (Today and +3 days)
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');

  if (checkinInput && checkoutInput) {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 3);

    checkinInput.value = today.toISOString().split('T')[0];
    checkoutInput.value = future.toISOString().split('T')[0];
  }

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitBtn = document.getElementById('submitBookingBtn');
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }

    const formData = new FormData(bookingForm);
    const name = formData.get('name') || 'Valued Guest';
    const checkin = formData.get('checkin');
    const checkout = formData.get('checkout');
    const guests = formData.get('guests');
    const roomType = formData.get('roomType');

    // Simulate brief luxury confirmation processing
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }

      // Populate and show custom confirmation modal
      document.getElementById('modalGuestName').textContent = name;
      document.getElementById('modalRoomType').textContent = roomType;
      document.getElementById('modalDates').textContent = `${checkin} to ${checkout}`;
      document.getElementById('modalGuests').textContent = guests;

      if (bookingModal) {
        bookingModal.classList.add('active');
        bookingModal.setAttribute('aria-hidden', 'false');
      }

      bookingForm.reset();
    }, 600);
  });
}

// Close Modal
if (modalCloseBtn && bookingModal) {
  modalCloseBtn.addEventListener('click', () => {
    bookingModal.classList.remove('active');
    bookingModal.setAttribute('aria-hidden', 'true');
  });

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      bookingModal.classList.remove('active');
      bookingModal.setAttribute('aria-hidden', 'true');
    }
  });
}

// Active Nav Link on Scroll
function setupActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  setupScrollReveal();
  setupInteractiveTilt();
  setupStatsCounter();
  setupActiveNavHighlight();
});
