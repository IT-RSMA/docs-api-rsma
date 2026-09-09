# 🚀 Panduan & File Kode Implementasi Next.js (`docs-api-rsma`)

Salin dan tempatkan file-file berikut ke dalam folder proyek Next.js Anda di `f:\Website\docs-api-rsma\`:

---

### 1. File `.env.local`
Buat file `.env.local` di root folder Next.js Anda (`f:\Website\docs-api-rsma\.env.local`):

```env
NEXT_PUBLIC_SIMRS_API_URL=http://127.0.0.1:8000/api
```

---

### 2. File `app/lib/apiClient.js`
Buat folder `app/lib` jika belum ada, lalu buat file `apiClient.js`.  
Fungsi ini menangani request ke Laravel, otomatis membaca/menyimpan token di `localStorage`, serta mengukur waktu latency (ms).

```javascript
// app/lib/apiClient.js

const BASE_URL = process.env.NEXT_PUBLIC_SIMRS_API_URL || 'http://127.0.0.1:8000/api';

// Helper Ambil Token
export function getSavedToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('simrs_token') || '';
}

// Helper Simpan Token
export function saveToken(token, clientName = '') {
  if (typeof window !== 'undefined') {
    localStorage.setItem('simrs_token', token);
    if (clientName) localStorage.setItem('simrs_client_name', clientName);
  }
}

// Helper Hapus Token
export function removeSavedToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('simrs_token');
    localStorage.removeItem('simrs_client_name');
  }
}

// Helper Nama Client
export function getSavedClientName() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('simrs_client_name') || '';
}

/**
 * Eksekutor API Universal
 */
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

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
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
```

---

### 3. File `app/components/TokenModal.jsx` (Modal Generator Token)
Komponen popup modal untuk men-generate token Sanctum baru langsung dari Header.

```jsx
// app/components/TokenModal.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { fetchSimrsApi, saveToken, getSavedToken, getSavedClientName, removeSavedToken } from '../lib/apiClient';

export default function TokenModal({ isOpen, onClose, onTokenUpdated }) {
  const [name, setName] = useState('');
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentToken, setCurrentToken] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentToken(getSavedToken());
      setCurrentName(getSavedClientName());
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await fetchSimrsApi({
      endpoint: '/auth/token',
      method: 'POST',
      body: {
        name,
        ip_whitelist: ipWhitelist || null,
      },
      token: '', // Tanpa auth
    });

    setLoading(false);

    if (res.ok && res.data?.data?.access_token) {
      const newToken = res.data.data.access_token;
      saveToken(newToken, name);
      setCurrentToken(newToken);
      setCurrentName(name);
      setName('');
      setIpWhitelist('');
      if (onTokenUpdated) onTokenUpdated(newToken);
    } else {
      setErrorMsg(res.data?.message || 'Gagal generate token.');
    }
  };

  const handleRevoke = () => {
    removeSavedToken();
    setCurrentToken('');
    setCurrentName('');
    if (onTokenUpdated) onTokenUpdated('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-1">🔑 Kelola API Bearer Token</h3>
        <p className="text-xs text-gray-500 mb-4">
          Token ini akan otomatis digunakan saat Anda mencoba endpoint di website ini.
        </p>

        {/* Status Token Saat Ini */}
        {currentToken ? (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-emerald-800">
                🟢 Token Aktif ({currentName || 'Client'})
              </span>
              <button
                onClick={handleRevoke}
                className="text-xs text-red-600 hover:underline font-medium"
              >
                Hapus Token
              </button>
            </div>
            <code className="block text-[11px] font-mono break-all text-emerald-950 bg-white p-2 rounded border border-emerald-100">
              {currentToken}
            </code>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            ⚠️ Belum ada token tersimpan. Silakan generate di bawah.
          </div>
        )}

        {/* Form Generate */}
        <form onSubmit={handleGenerate} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama Client / Web</label>
            <input
              type="text"
              required
              placeholder="Contoh: Web-Docs-Tester"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">IP Whitelist (Opsional)</label>
            <input
              type="text"
              placeholder="Kosongkan jika bebas IP"
              value={ipWhitelist}
              onChange={(e) => setIpWhitelist(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{errorMsg}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Tutup
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
            >
              {loading ? 'Membuat...' : 'Buat Token Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

### 4. Integrasi ke `app/components/Header.jsx`
Tambahkan tombol status token dan modal ke dalam `Header.jsx`:

```jsx
// Tambahkan di Header.jsx
'use client';

import React, { useState, useEffect } from 'react';
import TokenModal from './TokenModal';
import { getSavedToken } from '../lib/apiClient';

export default function Header() {
  const [hasToken, setHasToken] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setHasToken(!!getSavedToken());
  }, []);

  return (
    <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-900">SIMRS API Docs</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Tombol Status Token */}
        <button
          onClick={() => setModalOpen(true)}
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
            hasToken
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${hasToken ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          {hasToken ? 'Token Aktif' : 'Atur Token'}
        </button>
      </div>

      {/* Modal Popup */}
      <TokenModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onTokenUpdated={(token) => setHasToken(!!token)}
      />
    </header>
  );
}
```

---

### 5. Komponen Interactive API Tester (`app/components/ApiTester.jsx`)
Komponen ini diletakkan di setiap blok dokumentasi endpoint (misal di halaman `/kunjungan-ralan`, `/penyakit`, dll):

```jsx
// app/components/ApiTester.jsx
'use client';

import React, { useState } from 'react';
import { fetchSimrsApi, getSavedToken } from '../lib/apiClient';

export default function ApiTester({ endpoint, method = 'GET', title }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSend = async () => {
    setLoading(true);
    setResult(null);

    const res = await fetchSimrsApi({ endpoint, method });
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="my-4 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Bar Request mirip Postman */}
      <div className="p-3 bg-gray-50 border-b flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-xs overflow-hidden">
          <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
            {method}
          </span>
          <span className="text-gray-800 font-semibold truncate">{endpoint}</span>
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1 shrink-0"
        >
          {loading ? 'Mengirim...' : '🚀 Send Request'}
        </button>
      </div>

      {/* Area Response */}
      {result && (
        <div className="p-4 bg-gray-950 text-gray-100">
          <div className="flex items-center justify-between text-xs pb-2 mb-2 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <span>Status: <strong className={result.ok ? 'text-emerald-400' : 'text-red-400'}>{result.status}</strong></span>
              <span>Waktu: <strong className="text-sky-400">{result.duration} ms</strong></span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(result.data, null, 2))}
              className="text-[11px] text-gray-400 hover:text-white"
            >
              📋 Copy JSON
            </button>
          </div>

          <pre className="font-mono text-xs overflow-auto max-h-72 text-emerald-400 leading-relaxed">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```
