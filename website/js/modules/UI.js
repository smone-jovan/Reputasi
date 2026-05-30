// ═══════════════════════════════════════════════════════
// DONARIA — UI Adapters (Deep)
// ═══════════════════════════════════════════════════════

const UI = {
  toast(message, type = 'success') {
    let container = document.querySelector('.toast-container') || this._createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  renderList(containerId, items, templateFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(templateFn).join('');
  },

  _createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }
};

window.UI = UI;
