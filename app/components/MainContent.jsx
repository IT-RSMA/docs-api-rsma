import { useState } from 'react';
import { BASE_URL } from '../lib/apiClient';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date(dateStr);
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
};

const formatLocalDate = (date) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function MainContent({
  endpoint,
  isDarkMode,
  user,
  onOpenLogin,
  tanggalAwal,
  setTanggalAwal,
  tanggalAkhir,
  setTanggalAkhir,
  loading,
  handleSendRequest
}) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Merekap URL Endpoint
  const getFullUrl = () => {
    let cleanPath = endpoint.path || '';
    if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;

    let base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    if (base.endsWith('/api') && cleanPath.startsWith('/api/')) {
      cleanPath = cleanPath.replace('/api', '');
    }

    return `${base}${cleanPath}`;
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(getFullUrl());
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <main className={`flex-1 overflow-y-auto p-10 space-y-8 transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Informational Callout (Periode Default) */}
      <div className={`border rounded-2xl p-4 text-xs space-y-1.5 ${isDarkMode ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-slate-700'}`}>
        <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <span>📅 Catatan Periode Default Data</span>
        </div>
        <p className="leading-relaxed">
          Jika parameter tanggal tidak diisi, sistem SIMRS secara otomatis memproses data pada rentang <strong>tanggal 5 bulan berjalan s/d tanggal 4 bulan berikutnya</strong>.
        </p>
      </div>

      {/* Header Endpoint Terpadu (Clean Title + Interactive URL Bar) */}
      <div className={`border-b pb-7 space-y-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
            <span className={`text-xs font-bold px-3 py-1 rounded-lg border uppercase shrink-0 ${
              endpoint.method === 'GET' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-blue-100 text-blue-800 border-blue-300'
            }`}>
              {endpoint.method}
            </span>
            <div className={`font-mono text-xs font-semibold px-3 py-1.5 rounded-xl border truncate flex-1 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-emerald-400' : 'bg-white border-slate-200 text-emerald-700'
            }`}>
              {getFullUrl()}
            </div>
          </div>
          <button
            onClick={handleCopyUrl}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm shrink-0 cursor-pointer"
          >
            {copiedUrl ? '✓ URL Disalin' : '📋 Copas URL'}
          </button>
        </div>

        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{endpoint.title}</h1>
          <p className={`text-sm mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{endpoint.description}</p>
        </div>
      </div>

      {/* Table Parameters (DI-COMMENT) */}
      {/* 
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Query Parameters</h3>
          <span className="text-[11px] text-slate-400">Parameter yang didukung oleh endpoint ini</span>
        </div>

        <div className={`rounded-2xl border overflow-hidden shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-semibold ${isDarkMode ? 'bg-slate-800/60 border-slate-800 text-slate-300' : 'bg-slate-100/80 border-slate-200 text-slate-700'}`}>
                <th className="py-3 px-5">Parameter</th>
                <th className="py-3 px-5">Tipe</th>
                <th className="py-3 px-5">Sifat</th>
                <th className="py-3 px-5">Keterangan</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {endpoint.params.map((p, i) => (
                <tr key={i} className={`transition ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}>
                  <td className="py-3.5 px-5 font-mono font-bold text-emerald-500">{p.name}</td>
                  <td className="py-3.5 px-5 text-slate-400 font-mono">{p.type}</td>
                  <td className="py-3.5 px-5">
                    {p.required ? (
                      <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded text-[11px]">Wajib</span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[11px] ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>Opsional</span>
                    )}
                  </td>
                  <td className={`py-3.5 px-5 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      */}

      {/* Try It Out (Testing API) Panel */}
      <div className={`rounded-2xl border p-6 space-y-4 transition ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
              Try It Out (Testing API)
            </h3>
          </div>
          {user ? (
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              ✓ Akun: {user.name}
            </span>
          ) : (
            <span className="text-xs text-amber-500 font-semibold flex items-center gap-1">
              🔒 Perlu Login
            </span>
          )}
        </div>

        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Klik tombol di bawah ini untuk menguji endpoint secara live dan hasilnya akan langsung muncul pada panel kanan.
        </p>

        {/* Inputs Parameter Tanggal (DI-COMMENT) */}
        {/*
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Tanggal Awal
            </label>
            <DatePicker
              selected={parseLocalDate(tanggalAwal)}
              onChange={(date) => setTanggalAwal(formatLocalDate(date))}
              dateFormat="dd/MM/yyyy"
              placeholderText="Pilih tanggal awal"
              className={`w-full text-xs rounded-xl px-3.5 py-2.5 border transition focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Tanggal Akhir
            </label>
            <DatePicker
              selected={parseLocalDate(tanggalAkhir)}
              onChange={(date) => setTanggalAkhir(formatLocalDate(date))}
              dateFormat="dd/MM/yyyy"
              placeholderText="Pilih tanggal akhir"
              className={`w-full text-xs rounded-xl px-3.5 py-2.5 border transition focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>
        </div>
        */}

        {/* Tombol Send / Login Trigger */}
        <div className="pt-2">
          {user ? (
            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs py-3 rounded-xl transition disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses ke Server RS...</span>
                </>
              ) : (
                <>
                  <span>▶</span>
                  <span>Kirim Request ke Endpoint</span>
                </>
              )}
            </button>
          ) : (
            <button onClick={onOpenLogin} className="Btn Btn-full">
              <span>Login</span>
              <svg className="svgIcon" viewBox="0 0 512 512">
                <path d="M336 0c-88.4 0-160 71.6-160 160c0 20.2 3.7 39.6 10.6 57.5L9.4 394.5c-6 6-9.4 14.1-9.4 22.6V480c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V448h32c17.7 0 32-14.3 32-32V384h32c8.5 0 16.6-3.4 22.6-9.4l43-43c17.9 6.8 37.3 10.5 57.5 10.5c88.4 0 160-71.6 160-160S424.4 0 336 0zM384 144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Keamanan & Otorisasi Notice */}
      <div className={`border rounded-2xl p-5 space-y-2 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>🔒 Standar Otorisasi</span>
        </h4>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Endpoint ini memerlukan header <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-emerald-500">Authorization: Bearer &lt;token&gt;</code>. Untuk menguji request secara live dengan database SIMRS, silakan gunakan panel <strong>Try It Out</strong> di atas setelah masuk dengan akun instansi.
        </p>
      </div>

    </main>
  );
}