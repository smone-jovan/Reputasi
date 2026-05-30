// ═══════════════════════════════════════════════════════
// DONARIA — API Helper
// Handles all REST API calls to backend
// ═══════════════════════════════════════════════════════

const API_BASE_URL = 'http://localhost:3000/api';

// ── Auth Token Management ──
const Auth = {
  getToken() {
    return localStorage.getItem('donaria_token');
  },
  setToken(token) {
    localStorage.setItem('donaria_token', token);
  },
  setUser(user) {
    localStorage.setItem('donaria_user', JSON.stringify(user));
  },
  getUser() {
    const user = localStorage.getItem('donaria_user');
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
    localStorage.removeItem('donaria_token');
    localStorage.removeItem('donaria_user');
    // Detect if we're in admin subfolder and use correct relative path
    const isInAdmin = window.location.pathname.includes('/admin/');
    window.location.href = isInAdmin ? '../login.html' : 'login.html';
  },
};

// ── API Fetch Wrapper ──
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = Auth.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Clear auth data without forcing redirect (let the page handle it)
        localStorage.removeItem('donaria_token');
        localStorage.removeItem('donaria_user');
        const isInAdmin = window.location.pathname.includes('/admin/');
        window.location.href = isInAdmin ? '../login.html' : 'login.html';
        return;
      }
      throw new Error(data.message || 'Terjadi kesalahan');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ── API Methods ──
const API = {
  // Auth
  async register(name, email, password, phone) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    });
    if (data?.data?.token) {
      Auth.setToken(data.data.token);
      Auth.setUser(data.data.user);
    }
    return data;
  },

  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data?.data?.token) {
      Auth.setToken(data.data.token);
      Auth.setUser(data.data.user);
    }
    return data;
  },

  async getProfile() {
    return apiFetch('/auth/me');
  },

  // Categories
  async getCategories() {
    return apiFetch('/categories');
  },

  // Campaigns
  async getCampaigns(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/campaigns?${query}`);
  },

  async getCampaignById(id) {
    return apiFetch(`/campaigns/${id}`);
  },

  async createCampaign(data) {
    return apiFetch('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCampaign(id, data) {
    return apiFetch(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCampaign(id) {
    return apiFetch(`/campaigns/${id}`, { method: 'DELETE' });
  },

  async submitCampaign(data) {
    return apiFetch('/campaigns/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyCampaigns(params = {}) {
    return apiFetch(`/campaigns/my?${new URLSearchParams(params)}`);
  },

  async approveCampaign(id) {
    return apiFetch(`/campaigns/${id}/approve`, { method: 'PUT' });
  },

  async rejectCampaign(id) {
    return apiFetch(`/campaigns/${id}/reject`, { method: 'PUT' });
  },

  // Donations
  async createDonation(data) {
    return apiFetch('/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyDonations(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/donations?${query}`);
  },

  async getDonationById(id) {
    return apiFetch(`/donations/${id}`);
  },

  async getRecentDonations() {
    return apiFetch('/donations/recent');
  },

  // Transactions
  async checkPaymentStatus(orderId) {
    return apiFetch(`/transactions/check/${orderId}`);
  },

  // Stats
  async getStats() {
    return apiFetch('/stats');
  },

  // Test Mode (admin)
  async getTestModeStatus() {
    return apiFetch('/admin/test-mode');
  },

  async toggleTestMode() {
    return apiFetch('/admin/test-mode', { method: 'POST' });
  },

  // Notifications
  async getNotifications() {
    return apiFetch('/notifications');
  },

  async markNotificationRead(id) {
    return apiFetch(`/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllNotificationsRead() {
    return apiFetch('/notifications/read-all', { method: 'PUT' });
  },

  // Squads
  async createSquad(data) {
    return apiFetch('/squads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getSquadByCode(code) {
    return apiFetch(`/squads/code/${code}`);
  },

  async joinSquad(code) {
    return apiFetch(`/squads/code/${code}/join`, { method: 'POST' });
  },

  async getSquadsByCampaign(campaignId) {
    return apiFetch(`/squads/campaign/${campaignId}`);
  },

  async getMySquads() {
    return apiFetch('/squads/my');
  },

  async getSquadById(id) {
    return apiFetch(`/squads/${id}`);
  },
};

// ── Utility Functions ──
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompactCurrency(amount) {
  if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)} M`;
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
  if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(0)} Rb`;
  return `Rp ${amount}`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return formatDate(dateString);
}

function calculateProgress(current, target) {
  return Math.min(Math.round((current / target) * 100), 100);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function calculateDaysLeft(deadline) {
  if (!deadline) return null;
  const now = new Date();
  const end = new Date(deadline);
  const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }

  const iconSvg = {
    success: '<svg class="icon-md" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
    error: '<svg class="icon-md" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    info: '<svg class="icon-md" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span>${iconSvg[type] || iconSvg.info}</span>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ── Lucide Icons Refresh ──
function refreshIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ── Navbar scroll effect ──
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Mobile toggle
  const toggle = document.querySelector('.navbar-toggle');
  const nav = document.querySelector('.navbar-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Update auth buttons
  updateAuthUI();

  // Initialize Lucide icons
  refreshIcons();
}

function updateAuthUI() {
  const desktopAuth = document.querySelector('.navbar-actions');
  const mobileAuth = document.querySelector('.mobile-auth');
  
  if (Auth.isLoggedIn()) {
    const user = Auth.getUser();
    
    // Jika user admin, arahkan ke admin/index.html 
    const dashHref = user?.role === 'admin' ? 'admin/index.html' : 'dashboard.html';
    // Fix path untuk admin pages vs public pages
    const pathPrefix = window.location.pathname.includes('/admin/') ? '../' : '';

    const badge = user?.role === 'admin' ? '<span class="badge badge-primary" style="margin-right: 8px;">Admin</span>' : '';

    const html = `
      ${badge}
      <a href="${pathPrefix}${dashHref}" class="btn btn-sm btn-outline"><i data-lucide="bar-chart-3" class="icon-sm"></i> Dashboard</a>
      <button class="btn btn-sm btn-primary" onclick="Auth.logout()">Keluar</button>
    `;
    if (desktopAuth) desktopAuth.innerHTML = html;
    if (mobileAuth) mobileAuth.innerHTML = html;
  } else {
    const pathPrefix = window.location.pathname.includes('/admin/') ? '../' : '';
    const html = `
      <a href="${pathPrefix}login.html" class="btn btn-sm btn-outline">Masuk</a>
      <a href="${pathPrefix}register.html" class="btn btn-sm btn-primary">Daftar</a>
    `;
    if (desktopAuth) desktopAuth.innerHTML = html;
    if (mobileAuth) mobileAuth.innerHTML = html;
  }

  refreshIcons();
}

// ── Campaign Card Generator ──
function createCampaignCard(campaign) {
  const progress = calculateProgress(campaign.current_amount, campaign.target_amount);
  const daysLeft = calculateDaysLeft(campaign.deadline);
  const categoryName = campaign.category?.name || 'Umum';
  const categoryIcon = campaign.category?.icon || '<i data-lucide="clipboard-list" class="icon-sm"></i>';

  // If category icon is still an emoji, wrap it; otherwise use as-is
  const iconHtml = categoryIcon.includes('data-lucide') ? categoryIcon : `<span>${escapeHTML(categoryIcon)}</span>`;
  const safeTitle = escapeHTML(campaign.title);
  const safeCatName = escapeHTML(categoryName);
  // URL sanitize for banner_image
  const safeBanner = campaign.banner_image ? encodeURI(campaign.banner_image) : 'https://placehold.co/400x200/10B981/white?text=Donaria';

  return `
    <div class="campaign-card animate-fade-in-up">
      <div class="card-image">
        <img src="${safeBanner}"
             alt="${safeTitle}"
             loading="lazy"
             onerror="this.src='https://placehold.co/400x200/10B981/white?text=Donaria'">
        <span class="campaign-category">${iconHtml} ${safeCatName}</span>
      </div>
      <div class="card-body">
        <h4 class="campaign-title">
          <a href="campaign-detail.html?id=${campaign.id}">${safeTitle}</a>
        </h4>
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="progress-stats">
            <span class="amount">${formatCompactCurrency(campaign.current_amount)}</span>
            <span class="percentage">${progress}%</span>
          </div>
          <div class="progress-stats">
            <span class="target">dari ${formatCompactCurrency(campaign.target_amount)}</span>
          </div>
        </div>
        <div class="campaign-meta">
          <span><i data-lucide="users" class="icon-sm"></i> ${campaign.donations?.length || 0} donatur</span>
          ${daysLeft !== null ? `<span><i data-lucide="clock" class="icon-sm"></i> ${daysLeft} hari lagi</span>` : ''}
        </div>
        <a href="donate.html?id=${campaign.id}" class="btn btn-primary btn-block mt-2" style="font-size:0.85rem">
          <i data-lucide="heart" class="icon-sm"></i> Donasi Sekarang
        </a>
      </div>
    </div>
  `;
}

// Init on load
document.addEventListener('DOMContentLoaded', initNavbar);
