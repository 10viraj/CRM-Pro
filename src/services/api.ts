/**
 * CRM Pro Unified REST API Client
 * Connects frontend React components to Express.js + MongoDB backend with JWT authentication
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Retrieve stored JWT token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('crm_pro_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('crm_pro_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('crm_pro_token');
};

// Generic typed fetch wrapper with JWT and error handling
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string }> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error ${response.status}`
      };
    }

    return {
      success: true,
      data: data.data !== undefined ? data.data : data
    };
  } catch (err: any) {
    // If backend is unreachable or timed out
    return {
      success: false,
      error: err.name === 'AbortError' ? 'API request timed out' : 'Backend connection unavailable'
    };
  }
}

// ─────────────────────────────────────────────────────────────
// REST API ENDPOINTS
// ─────────────────────────────────────────────────────────────

export const api = {
  // System Health
  checkHealth: () => request<{ status: string; platform: string; database: any }>('/health'),

  // Authentication
  auth: {
    login: async (credentials: { email: string; password?: string }) => {
      const res = await request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },
    register: async (userData: any) => {
      const res = await request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },
    getMe: () => request<any>('/auth/me'),
    logout: () => {
      removeAuthToken();
    }
  },

  // Leads API
  leads: {
    getAll: () => request<any[]>('/leads'),
    getById: (id: string) => request<any>(`/leads/${id}`),
    create: (lead: any) => request<any>('/leads', { method: 'POST', body: JSON.stringify(lead) }),
    update: (id: string, lead: any) => request<any>(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(lead) }),
    delete: (id: string) => request<any>(`/leads/${id}`, { method: 'DELETE' }),
    bulkDelete: (ids: string[]) => request<any>('/leads/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) })
  },

  // Deals API
  deals: {
    getAll: () => request<any[]>('/deals'),
    getById: (id: string) => request<any>(`/deals/${id}`),
    create: (deal: any) => request<any>('/deals', { method: 'POST', body: JSON.stringify(deal) }),
    update: (id: string, deal: any) => request<any>(`/deals/${id}`, { method: 'PUT', body: JSON.stringify(deal) }),
    updateStage: (id: string, stage: string) => request<any>(`/deals/${id}/stage`, { method: 'PATCH', body: JSON.stringify({ stage }) }),
    delete: (id: string) => request<any>(`/deals/${id}`, { method: 'DELETE' })
  },

  // Contacts API
  contacts: {
    getAll: () => request<any[]>('/contacts'),
    create: (contact: any) => request<any>('/contacts', { method: 'POST', body: JSON.stringify(contact) }),
    update: (id: string, contact: any) => request<any>(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(contact) }),
    delete: (id: string) => request<any>(`/contacts/${id}`, { method: 'DELETE' })
  },

  // Companies API
  companies: {
    getAll: () => request<any[]>('/companies'),
    create: (company: any) => request<any>('/companies', { method: 'POST', body: JSON.stringify(company) }),
    update: (id: string, company: any) => request<any>(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(company) }),
    delete: (id: string) => request<any>(`/companies/${id}`, { method: 'DELETE' })
  },

  // Tasks API
  tasks: {
    getAll: () => request<any[]>('/tasks'),
    create: (task: any) => request<any>('/tasks', { method: 'POST', body: JSON.stringify(task) }),
    update: (id: string, task: any) => request<any>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
    delete: (id: string) => request<any>(`/tasks/${id}`, { method: 'DELETE' })
  },

  // Activities API
  activities: {
    getAll: () => request<any[]>('/activities'),
    create: (activity: any) => request<any>('/activities', { method: 'POST', body: JSON.stringify(activity) }),
    delete: (id: string) => request<any>(`/activities/${id}`, { method: 'DELETE' })
  },

  // Events Calendar API
  events: {
    getAll: () => request<any[]>('/events'),
    create: (event: any) => request<any>('/events', { method: 'POST', body: JSON.stringify(event) }),
    delete: (id: string) => request<any>(`/events/${id}`, { method: 'DELETE' })
  },

  // Analytics API
  analytics: {
    getSummary: (range = '30days') => request<any>(`/analytics/summary?range=${range}`)
  }
};

