// ═══════════════════════════════════════════════════════
// DONARIA — Auth Guard
// Protects pages that require authentication
// ═══════════════════════════════════════════════════════

/**
 * Require login — redirect to login page if not authenticated
 * Usage: add <script src="js/auth.js"></script> to protected pages
 */
(function authGuard() {
  const publicPages = ['index.html', 'campaigns.html', 'campaign-detail.html', 'login.html', 'register.html', ''];
  const currentPage = window.location.pathname.split('/').pop() || '';
  const isInAdmin = window.location.pathname.includes('/admin/');
  
  // Skip if public page (only applies to non-admin pages)
  if (!isInAdmin && publicPages.includes(currentPage)) return;
  
  // Check if logged in — redirect to login with correct relative path
  if (!Auth.isLoggedIn()) {
    const pathPrefix = isInAdmin ? '../' : '';
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `${pathPrefix}login.html?redirect=${redirectUrl}`;
    return;
  }

  // Admin pages guard — non-admin users should not access admin
  if (isInAdmin) {
    if (!Auth.isAdmin()) {
      window.location.href = '../dashboard.html';
      return;
    }
  }
})();
