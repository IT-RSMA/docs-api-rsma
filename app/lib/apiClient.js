// app/lib/apiClient.js

export const BASE_URL = process.env.NEXT_PUBLIC_SIMRS_API_URL || 'http://127.0.0.1:8000/api';

// 1. Ambil token dari localStorage
export function getSavedToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('simrs_token') || '';
}

// 2. Simpan token ke localStorage
export function saveToken(token, clientName = '') {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('simrs_token', token);
    } else {
      localStorage.removeItem('simrs_token');
    }
    if (clientName) {
      localStorage.setItem('simrs_client_name', clientName);
    }
  }
}

// 3. Hapus token dari localStorage
export function removeSavedToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('simrs_token');
    localStorage.removeItem('simrs_client_name');
  }
}

// 4. Ambil nama client yang tersimpan
export function getSavedClientName() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('simrs_client_name') || '';
}

// 5. Eksekutor API Universal (GET / POST dsb dengan kalkulasi Latency)
export async function fetchSimrsApi({ endpoint, method = 'GET', body = null, token = null }) {
  const authToken = token !== null ? token : getSavedToken();
  const startTime = performance.now();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  // Normalisasi path endpoint jika diawali atau tanpa /api
  let cleanEndpoint = endpoint;
  if (!cleanEndpoint.startsWith('/')) {
    cleanEndpoint = `/${cleanEndpoint}`;
  }

  // Jika BASE_URL sudah berakhiran /api dan cleanEndpoint diawali /api, hindari duplikasi /api/api
  let requestUrl = `${BASE_URL}${cleanEndpoint}`;
  if (BASE_URL.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    requestUrl = `${BASE_URL.slice(0, -4)}${cleanEndpoint}`;
  }

  try {
    const response = await fetch(requestUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const duration = Math.round(performance.now() - startTime);
    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      status: response.status,
      duration,
      data,
    };
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    return {
      ok: false,
      status: 0,
      duration,
      data: { message: error.message || 'Koneksi ke server backend gagal / CORS error.' },
    };
  }
}

// 6. Login Kredensial Resmi via Backend Laravel (/login)
export async function loginUserApi(identifier, password) {
  const startTime = performance.now();
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: identifier,
        password: password,
      }),
    });

    const duration = Math.round(performance.now() - startTime);
    const data = await res.json().catch(() => ({}));

    if (res.ok && data?.data?.access_token) {
      saveToken(data.data.access_token, data.data.user?.name || identifier);
      if (typeof window !== 'undefined' && data.data.user) {
        localStorage.setItem('simrs_user', JSON.stringify(data.data.user));
      }
    }

    return {
      ok: res.ok,
      status: res.status,
      duration,
      data,
    };
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    return {
      ok: false,
      status: 0,
      duration,
      data: { message: error.message || 'Gagal menghubungi server auth backend.' },
    };
  }
}

// Alias untuk loginApi
export const loginApi = loginUserApi;

// 7. Ambil data profil user yang sedang login
export function getAuthUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('simrs_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

// 8. Logout User via Backend Laravel (/logout)
export async function logoutUserApi() {
  const token = getSavedToken();
  if (token) {
    try {
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (_) {
      // Abaikan error jaringan saat logout
    }
  }
  removeSavedToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('simrs_user');
  }
}

// Alias untuk logoutApi
export const logoutApi = logoutUserApi;

