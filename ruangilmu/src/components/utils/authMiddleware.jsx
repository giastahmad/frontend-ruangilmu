// Function to refresh the authentication token
const refreshAccessToken = async () => {
  try {
    const response = await fetch('http://ruangilmu.up.railway.app/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();

    localStorage.setItem('accessToken', data.accessToken);

    return data.accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);

    localStorage.removeItem('accessToken');

    // // Optional: redirect to login
    // window.location.href = '/login';

    throw error;
  }
};

let isRefreshing = false;

let refreshSubscribers = [];

const subscribeToTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

export const authenticatedFetch = async (url, options = {}) => {
  const headers = {
    ...options.headers,
    'Content-Type': options.headers?.['Content-Type'] || 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && !url.includes('/auth/refresh-token')) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        headers.Authorization = `Bearer ${newToken}`;

        onTokenRefreshed(newToken);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    } else {
      const newToken = await new Promise(resolve => {
        subscribeToTokenRefresh(token => {
          resolve(token);
        });
      });

      headers.Authorization = `Bearer ${newToken}`;
    }

    response = await fetch(url, { ...options, headers });
  }

  return response;
};

export const useAuthenticatedFetch = () => {
  return authenticatedFetch;
};

export const apiService = {
  get: async (url) => {
    return authenticatedFetch(url, { method: 'GET' });
  },

  post: async (url, data) => {
    return authenticatedFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  put: async (url, data) => {
    return authenticatedFetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  delete: async (url) => {
    return authenticatedFetch(url, { method: 'DELETE' });
  }
};