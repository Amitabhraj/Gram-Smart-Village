const API_BASE = 'http://127.0.0.1:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('officer_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['X-Officer-Token'] = token;
  }
  return headers;
};

export const api = {
  // Officer Authentication
  officerLogin: async (officerId, password) => {
    const res = await fetch(`${API_BASE}/officer/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officer_id: officerId, password }),
    });
    return await res.json();
  },

  // Search Places / Gram Panchayats
  searchPlaces: async (query = '') => {
    try {
      const url = query ? `${API_BASE}/places/?search=${encodeURIComponent(query)}` : `${API_BASE}/places/`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load places');
      return await res.json();
    } catch (e) {
      console.warn("Falling back to local places index", e);
      return [
        { id: 1, name: 'Pipariya', full_name: 'Pipariya Gram Panchayat, Sohagpur, Narmadapuram, Madhya Pradesh', tehsil: 'Sohagpur', district: 'Narmadapuram', state: 'Madhya Pradesh', pincode: '461775', lat: 22.7553, lng: 78.3551, population: 8450 },
        { id: 2, name: 'Rampur', full_name: 'Rampur Gram Panchayat, Babai, Narmadapuram, Madhya Pradesh', tehsil: 'Babai', district: 'Narmadapuram', state: 'Madhya Pradesh', pincode: '461661', lat: 22.7121, lng: 77.9234, population: 6120 },
        { id: 3, name: 'Khedi', full_name: 'Khedi Gram Panchayat, Sehore, Madhya Pradesh', tehsil: 'Sehore', district: 'Sehore', state: 'Madhya Pradesh', pincode: '466001', lat: 23.2011, lng: 77.0854, population: 4900 },
        { id: 4, name: 'Semri Harchand', full_name: 'Semri Harchand Gram Panchayat, Sohagpur, Narmadapuram, Madhya Pradesh', tehsil: 'Sohagpur', district: 'Narmadapuram', state: 'Madhya Pradesh', pincode: '461668', lat: 22.7833, lng: 78.2167, population: 7300 },
        { id: 5, name: 'Mandla Rural', full_name: 'Bamhani Gram Panchayat, Nainpur, Mandla, Madhya Pradesh', tehsil: 'Nainpur', district: 'Mandla', state: 'Madhya Pradesh', pincode: '481771', lat: 22.6000, lng: 80.3700, population: 5200 },
      ];
    }
  },

  // Officer summary
  getOfficerSummary: async (village = 'ALL') => {
    try {
      const url = village && village !== 'ALL' 
        ? `${API_BASE}/officer-summary/?village=${encodeURIComponent(village)}`
        : `${API_BASE}/officer-summary/`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn("Backend offline or loading fallback", e);
      return null;
    }
  },

  // Grievances
  getGrievances: async (village = '') => {
    try {
      const url = village && village !== 'ALL'
        ? `${API_BASE}/grievances/?village=${encodeURIComponent(village)}`
        : `${API_BASE}/grievances/`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn(e);
      return [];
    }
  },

  trackGrievance: async (ticketId) => {
    const res = await fetch(`${API_BASE}/grievances/track/?ticket_id=${encodeURIComponent(ticketId)}`, {
      headers: getHeaders()
    });
    return await res.json();
  },

  createGrievance: async (data) => {
    const res = await fetch(`${API_BASE}/grievances/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  updateGrievanceAction: async (id, data) => {
    const res = await fetch(`${API_BASE}/grievances/${id}/quick_action/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // Services
  getServices: async () => {
    try {
      const res = await fetch(`${API_BASE}/services/`, { headers: getHeaders() });
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
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  updateServiceDecision: async (id, data) => {
    const res = await fetch(`${API_BASE}/services/${id}/quick_decision/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  trackServiceToken: async (query) => {
    const res = await fetch(`${API_BASE}/services/track_token/?query=${encodeURIComponent(query)}`, {
      headers: getHeaders()
    });
    return await res.json();
  },

  // Mandi & Fertilizer
  getMandiRates: async () => {
    try {
      const res = await fetch(`${API_BASE}/mandi-rates/`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  getFertilizers: async () => {
    try {
      const res = await fetch(`${API_BASE}/fertilizers/`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  // Notices & Health
  getNotices: async () => {
    try {
      const res = await fetch(`${API_BASE}/notices/`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  createNotice: async (data) => {
    const res = await fetch(`${API_BASE}/notices/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  getHealthSchedules: async () => {
    try {
      const res = await fetch(`${API_BASE}/health-schedules/`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return [];
    }
  }
};
