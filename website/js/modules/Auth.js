// ═══════════════════════════════════════════════════════
// DONARIA — Core Auth Module (Deep)
// ═══════════════════════════════════════════════════════

const CoreAuth = (function() {
  const STORAGE_KEYS = {
    TOKEN: 'donaria_token',
    USER: 'donaria_user'
  };

  return {
    getToken() {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },
    setSession(token, user) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },
    getUser() {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    },
    isLoggedIn() {
      return !!this.getToken();
    },
    isAdmin() {
      const user = this.getUser();
      return user && user.role === 'admin';
    },
    logout() {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      const isInAdmin = window.location.pathname.includes('/admin/');
      window.location.href = isInAdmin ? '../login.html' : 'login.html';
    },
    getAuthHeader() {
      const token = this.getToken();
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
  };
})();

window.Auth = CoreAuth;
