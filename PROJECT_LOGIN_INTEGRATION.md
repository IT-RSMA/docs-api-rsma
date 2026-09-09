# 🚀 PANDUAN PENYELARASAN LOGIN WEB DOCS NEXT.JS & BACKEND LARAVEL

Dokumen ini adalah panduan lengkap dan kode siap pakai untuk menyelaraskan sistem login di Website Next.js (`docs-api-rsma`) dengan backend Laravel SIMRS yang sudah aktif.

---

## 🎯 1. Informasi Kredensial Database Terkini

Akun yang sudah aktif di database backend SIMRS:

| Role / Instansi | Identifier (Input Email/Username) | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **IT Internal RSMA** | `IT` | `2025` | Administrator IT RSMA |
| **Diskominfotik Sumbawa** | `kominfo@sumbawakab.go.id` | `PasswordKominfo2026!` | Instansi Klien |

---

## 💻 2. Update File: `app/lib/apiClient.js`

Ganti atau sesuaikan fungsi otentikasi di `app/lib/apiClient.js` dengan kode di bawah ini. Kode ini sudah disesuaikan agar:
- Menerima username biasa (`IT`) maupun email.
- Menembak endpoint backend `/api/login`.
- Menyimpan Bearer Token Sanctum ke `localStorage`.
- Otomatis menyertakan Header `Authorization: Bearer <token>` di setiap pemanggilan endpoint.

```javascript
// Base URL backend Laravel
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/**
 * 1. FUNGSI LOGIN (Otentikasi ke Laravel Sanctum)
 * Endpoint: POST /api/login
 * Body: { email: string, password: string }
 */
export async function loginApi(emailOrUsername, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: emailOrUsername, // Backend menerima username atau email di kolom ini
        password: password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal login ke server SIMRS');
    }

    // Simpan token dan info user jika login berhasil
    if (result.status && result.data?.access_token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('simrs_token', result.data.access_token);
        localStorage.setItem('simrs_user', JSON.stringify(result.data.user));
      }
    }

    return result;
  } catch (error) {
    console.error('Error saat login:', error);
    throw error;
  }
}

/**
 * 2. FUNGSI LOGOUT (Revoke Sanctum Token)
 * Endpoint: POST /api/logout
 */
export async function logoutApi() {
  try {
    const token = getAuthToken();
    if (token) {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.warn('Logout API error:', error);
  } finally {
    // Selalu bersihkan storage lokal
    if (typeof window !== 'undefined') {
      localStorage.removeItem('simrs_token');
      localStorage.removeItem('simrs_user');
    }
  }
}

/**
 * 3. HELPER: Ambil Token Aktif
 */
export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('simrs_token') || '';
  }
  return '';
}

/**
 * 4. HELPER: Ambil Data User yang Sedang Login
 */
export function getAuthUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('simrs_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

/**
 * 5. FUNGSI FETCH REQUEST DENGAN BEARER TOKEN
 * Digunakan untuk tombol "Test Endpoint" / memanggil data SIMRS
 */
export async function fetchWithAuth(endpoint, options = {}) {
  const token = getAuthToken();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();
  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}
```

---

## 🎨 3. Update Komponen Modal / Form Login di Next.js

Jika Anda memiliki komponen Modal Login (misal `AuthModal.jsx` / `LoginModal.jsx`), pastikan hal berikut:

### A. Input Menggunakan `type="text"` (Bukan `type="email"`)
Agar form tidak memvalidasi tanda `@` saat user memasukkan `IT`:
```jsx
{/* Input Username / Email */}
<div>
  <label className="block text-sm font-medium mb-1">Username / Email</label>
  <input
    type="text"
    value={identifier}
    onChange={(e) => setIdentifier(e.target.value)}
    placeholder="Contoh: IT atau kominfo@sumbawakab.go.id"
    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    required
  />
</div>

{/* Input Password */}
<div className="mt-3">
  <label className="block text-sm font-medium mb-1">Password</label>
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    required
  />
</div>
```

### B. Tombol Quick-Fill / Pilihan Akun Cepat
Tambahkan tombol shortcut agar saat testing tidak perlu mengetik manual:
```jsx
<div className="flex gap-2 mt-4 text-xs">
  <button
    type="button"
    onClick={() => { setIdentifier('IT'); setPassword('2025'); }}
    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded border"
  >
    Login sbg IT (2025)
  </button>
  <button
    type="button"
    onClick={() => { setIdentifier('kominfo@sumbawakab.go.id'); setPassword('PasswordKominfo2026!'); }}
    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded border"
  >
    Login sbg Kominfo
  </button>
</div>
```

---

## 🌐 4. Pastikan `.env.local` di Next.js Tepat

Buka file `.env.local` pada project Next.js Anda dan pastikan URL mengarah ke Laravel:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## ✅ 5. Cara Pengujian
1. Jalankan backend Laravel di terminal:
   ```bash
   php artisan serve
   ```
2. Jalankan website Next.js di terminal:
   ```bash
   npm run dev
   ```
3. Buka browser di `http://localhost:3000`.
4. Buka dialog Login:
   - Masukkan ID: `IT`
   - Masukkan Password: `2025`
5. Klik **Login**.
   - Sistem akan sukses login, menyimpan token Bearer Sanctum, dan status indikator di navbar/header website Anda langsung berubah menjadi **"Terhubung / Login sebagai IT"**.
6. Uji coba panggil endpoint apapun (misal `GET /api/kunjungan-ralan`), data SIMRS akan langsung tersaji!
