const API_BASE = 'http://127.0.0.1:8000/api';

export const api = {
  // Officer summary
  getOfficerSummary: async () => {
    try {
      const res = await fetch(`${API_BASE}/officer-summary/`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn("Backend offline or loading fallback", e);
      return null;
    }
  },

  // Grievances
  getGrievances: async () => {
    try {
      const res = await fetch(`${API_BASE}/grievances/`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn(e);
      return [];
    }
  },

  createGrievance: async (data) => {
    const res = await fetch(`${API_BASE}/grievances/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  updateGrievanceAction: async (id, data) => {
    const res = await fetch(`${API_BASE}/grievances/${id}/quick_action/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // Services
  getServices: async () => {
    try {
      const res = await fetch(`${API_BASE}/services/`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn(e);
      return [];
    }
  },

  createService: async (data) => {
    const res = await fetch(`${API_BASE}/services/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  updateServiceDecision: async (id, data) => {
    const res = await fetch(`${API_BASE}/services/${id}/quick_decision/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  trackServiceToken: async (query) => {
    const res = await fetch(`${API_BASE}/services/track_token/?query=${encodeURIComponent(query)}`);
    return await res.json();
  },

  // Mandi & Fertilizer
  getMandiRates: async () => {
    try {
      const res = await fetch(`${API_BASE}/mandi-rates/`);
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  getFertilizers: async () => {
    try {
      const res = await fetch(`${API_BASE}/fertilizers/`);
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  // Notices & Health
  getNotices: async () => {
    try {
      const res = await fetch(`${API_BASE}/notices/`);
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  createNotice: async (data) => {
    const res = await fetch(`${API_BASE}/notices/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  getHealthSchedules: async () => {
    try {
      const res = await fetch(`${API_BASE}/health-schedules/`);
      return await res.json();
    } catch (e) {
      return [];
    }
  }
};
