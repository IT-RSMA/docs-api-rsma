import { useState, useMemo } from 'react';
import { BASE_URL, getSavedToken, fetchSimrsApi } from '../lib/apiClient';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CodePanel({ endpoint, user, onOpenLogin }) {
  const [activeLang, setActiveLang] = useState('curl');
  // const [tanggalAwal, setTanggalAwal] = useState('');
  // const [tanggalAkhir, setTanggalAkhir] = useState('');

  const [tanggalAwal, setTanggalAwal] = useState(new Date());
  const [tanggalAkhir, setTanggalAkhir] = useState(new Date());
  
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Kalkulasi URL Penuh dengan query parameter tanggal
  const fullUrl = useMemo(() => {
    let cleanPath = endpoint.path || '';
    if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;

    let base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    if (base.endsWith('/api') && cleanPath.startsWith('/api/')) {
      cleanPath = cleanPath.replace('/api', '');
    }

    let url = `${base}${cleanPath}`;
    const params = new URLSearchParams();
    if (tanggalAwal) params.append('tanggal_awal', tanggalAwal);
    if (tanggalAkhir) params.append('tanggal_akhir', tanggalAkhir);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return url;
  }, [endpoint.path, tanggalAwal, tanggalAkhir]);

  const tokenDisplay = getSavedToken() ? `${getSavedToken().slice(0, 12)}...` : 'YOUR_BEARER_TOKEN';

  const generateSnippet = () => {
    if (activeLang === 'curl') {
      return `curl -X ${endpoint.method} "${fullUrl}" \\\n  -H "Authorization: Bearer ${tokenDisplay}" \\\n  -H "Accept: application/json"`;
    }
    return `fetch("${fullUrl}", {\n  method: "${endpoint.method}",\n  headers: {\n    "Authorization": "Bearer ${tokenDisplay}",\n    "Accept": "application/json"\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`;
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const handleSendRequest = async () => {
    if (!user) {
      onOpenLogin();
      return;
    }

    setLoading(true);
    setApiResult(null);

    try {
      let relativePath = endpoint.path;
      const params = new URLSearchParams();
      if (tanggalAwal) params.append('tanggal_awal', tanggalAwal);
      if (tanggalAkhir) params.append('tanggal_akhir', tanggalAkhir);
      if (params.toString()) {
        relativePath += `?${params.toString()}`;
      }

      const res = await fetchSimrsApi({
        endpoint: relativePath,
        method: endpoint.method,
      });

      setApiResult({
        status: res.status,
        duration: res.duration,
        payload: res.data,
      });
    } catch (err) {
      setApiResult({
        status: 'ERROR',
        error: 'Koneksi gagal',
        payload: { message: err.message },
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock response fallback jika belum pernah execute request
  const displayPayload = apiResult ? apiResult.payload : Object.values(endpoint.responses)[0];

  return (
    <aside className="w-[500px] bg-slate-900 text-slate-100 flex flex-col shrink-0 border-l border-slate-800 overflow-y-auto">
      {/* 1. Header Tab Bahasa */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center sticky top-0 z-10">
        <div className="flex bg-slate-800 p-1 rounded-xl space-x-1">
          {['curl', 'javascript'].map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                activeLang === lang ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <button
          onClick={() => handleCopy(generateSnippet(), 'code')}
          className="text-xs text-slate-400 hover:text-emerald-400 font-medium px-2 py-1 rounded transition flex items-center gap-1"
        >
          {copiedCode ? '✓ Copied' : '📋 Salin Snippet'}
        </button>
      </div>

      {/* 2. Example Snippet Code */}
      <div className="p-4 border-b border-slate-800 space-y-2 bg-slate-900/50">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Example Request</span>
        <pre className="bg-slate-950 p-3.5 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed border border-slate-800">
          <code>{generateSnippet()}</code>
        </pre>
      </div>

      {/* 3. Try It Out (Interactive Console) */}
      <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Try It Out (Testing API)
          </span>
          {user ? (
            <span className="text-[11px] text-emerald-400 font-medium">✓ Akun: {user.name}</span>
          ) : (
            <span className="text-[11px] text-amber-400 font-medium">🔒 Perlu Login</span>
          )}
        </div>

            {/* Inputs Parameter Tanggal */}
    <div className="grid grid-cols-2 gap-2.5">
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">
          Tanggal Awal
        </label>

        <DatePicker
          selected={tanggalAwal ? new Date(tanggalAwal) : null}
          onChange={(date) => setTanggalAwal(date ? date.toISOString().split('T')[0] : '')}
          dateFormat="dd/MM/yyyy"
          placeholderText="Pilih tanggal"
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-[11px] text-slate-400 mb-1">
          Tanggal Akhir
        </label>

        <DatePicker
          selected={tanggalAkhir ? new Date(tanggalAkhir) : null}
          onChange={(date) => setTanggalAkhir(date ? date.toISOString().split('T')[0] : '')}
          dateFormat="dd/MM/yyyy"
          placeholderText="Pilih tanggal"
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>

        {/* Tombol Send / Login Trigger */}
        {user ? (
          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl transition disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          <button
            onClick={onOpenLogin}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-semibold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>🔑</span>
            <span>Login Instansi untuk Menguji API</span>
          </button>
        )}
      </div>

      {/* 4. Response Payload & Output Viewer */}
      <div className="p-4 flex-1 space-y-2 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {apiResult ? 'Live Server Response' : 'Expected Response Schema'}
            </span>
            {apiResult && (
              <>
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-sky-400">
                  ⚡ {apiResult.duration} ms
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  apiResult.status >= 200 && apiResult.status < 300
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border-rose-800'
                }`}>
                  Status: {apiResult.status}
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => handleCopy(JSON.stringify(displayPayload, null, 2), 'json')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition"
          >
            {copiedJson ? '✓ Copied' : '📋 Copas JSON'}
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto flex-1 leading-relaxed border border-slate-800 max-h-[380px]">
          <code>{JSON.stringify(displayPayload, null, 2)}</code>
        </pre>
      </div>
    </aside>
  );
}