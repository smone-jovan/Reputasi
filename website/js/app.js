// ═══════════════════════════════════════════════════════
// DONARIA — App Shared Logic
// Common utilities and initializers for all pages
// ═══════════════════════════════════════════════════════

/**
 * Smooth scroll to anchor links
 */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

/**
 * Intersection Observer for scroll animations
 */
const observeAnimations = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-fade-in-up').forEach(el => {
    observer.observe(el);
  });
};

document.addEventListener('DOMContentLoaded', observeAnimations);

/**
 * Format number with thousand separators
 */
function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Debounce utility
 */
function debounce(func, wait = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Handle login redirect from URL params
 */
(function handleLoginRedirect() {
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'login.html' || currentPage === 'register.html') {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect && Auth.isLoggedIn()) {
      window.location.href = decodeURIComponent(redirect);
    }
  }
})();
