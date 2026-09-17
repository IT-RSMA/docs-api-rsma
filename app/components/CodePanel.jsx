import { useState, useMemo, useCallback } from 'react';
import { BASE_URL, getSavedToken } from '../lib/apiClient';

export default function CodePanel({ endpoint, user, tanggalAwal, tanggalAkhir, apiResult }) {
  const [activeLang, setActiveLang] = useState('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [panelWidth, setPanelWidth] = useState(500);
  const [isResizing, setIsResizing] = useState(false);

  // Drag handle callback untuk resize panel dari kiri ke kanan
  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (moveEvent) => {
      const newWidth = window.innerWidth - moveEvent.clientX;
      const clampedWidth = Math.max(300, Math.min(newWidth, window.innerWidth - 350));
      setPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

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

  // Mock response fallback jika belum pernah execute request
  const displayPayload = apiResult ? apiResult.payload : Object.values(endpoint.responses)[0];

  return (
    <aside
      style={{ width: `${panelWidth}px` }}
      className={`relative bg-slate-900 text-slate-100 flex flex-col shrink-0 border-l border-slate-800 overflow-y-auto ${isResizing ? 'select-none transition-none' : 'transition-all duration-75'
        }`}
    >
      {/* Handle Tarik Kiri / Kanan untuk Resize Width Panel */}
      <div
        onMouseDown={startResizing}
        title="Geser ke kiri / kanan untuk memperbesar / memperkecil panel"
        className={`group absolute top-0 left-0 bottom-0 w-2.5 hover:w-3 cursor-col-resize z-30 flex items-center justify-center transition-all ${isResizing ? 'bg-emerald-500/30' : 'hover:bg-emerald-500/20'
          }`}
      >
        <div className={`w-1 h-10 rounded-full transition-colors ${isResizing ? 'bg-emerald-400' : 'bg-slate-700 group-hover:bg-emerald-400'
          }`} />
      </div>

      {/* 1. Header Tab Bahasa */}
      {/* <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center sticky top-0 z-10">
        <div className="flex bg-slate-800 p-1 rounded-xl space-x-1">
          {['curl', 'javascript'].map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition cursor-pointer ${
                activeLang === lang ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <button
          onClick={() => handleCopy(generateSnippet(), 'code')}
          className="text-xs text-slate-400 hover:text-emerald-400 font-medium px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer"
        >
          {copiedCode ? '✓ Copied' : '📋 Salin Snippet'}
        </button>
      </div> */}

      {/* 2. Example Snippet Code */}
      {/* <div className="p-4 border-b border-slate-800 space-y-2 bg-slate-900/50">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Example Request</span>
        <pre className="bg-slate-950 p-3.5 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed border border-slate-800">
          <code>{generateSnippet()}</code>
        </pre>
      </div> */}

      {/* 3. Response Payload & Output Viewer (Expected Response Schema / Live Server Response) */}
      <div className="p-4 flex-1 space-y-3 flex flex-col pl-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {apiResult ? 'Live Server Response' : ' Response'}
            </span>
            {apiResult && (
              <>
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-sky-400">
                  ⚡ {apiResult.duration} ms
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${apiResult.status >= 200 && apiResult.status < 300
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
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            {copiedJson ? '✓ Copied' : '📋 Copas JSON'}
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto flex-1 leading-relaxed border border-slate-800">
          <code>{JSON.stringify(displayPayload, null, 2)}</code>
        </pre>
      </div>
    </aside>
  );
}