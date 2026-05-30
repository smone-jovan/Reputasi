// ═══════════════════════════════════════════════════════
// DONARIA — Core API Module (Deep)
// ═══════════════════════════════════════════════════════

const CoreAPI = (function() {
  const BASE_URL = 'http://localhost:3000/api';

  async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...Auth.getAuthHeader(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          Auth.logout();
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

  return {
    get: (endpoint) => request(endpoint, { method: 'GET' }),
    post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),

    // Domain Methods
    campaigns: {
      getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return CoreAPI.get(`/campaigns?${query}`);
      },
      getById: (id) => CoreAPI.get(`/campaigns/${id}`),
    },
    donations: {
      create: (data) => CoreAPI.post('/donations', data),
      getMy: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return CoreAPI.get(`/donations?${query}`);
      },
    },
    squads: {
      create: (data) => CoreAPI.post('/squads', data),
      getByCode: (code) => CoreAPI.get(`/squads/code/${code}`),
      join: (code) => CoreAPI.post(`/squads/code/${code}/join`),
    }
  };
})();

window.API = CoreAPI;
