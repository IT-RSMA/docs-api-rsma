import { useState } from 'react';

export default function MainContent({ endpoint, user, onOpenLogin, isDarkMode }) {
  const [tanggalAwal, setTanggalAwal] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');
  const [apiKey, setApiKey] = useState('');
  
  // State untuk perolehan token
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isGettingToken, setIsGettingToken] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  // Fungsi khusus untuk meminta Bearer Token
  const handleGetToken = async () => {
    if (!clientId || !clientSecret) {
      alert('Harap isi Client ID dan Client Secret terlebih dahulu!');
      return;
    }

    setIsGettingToken(true);
    try {
      const response = await fetch('https://api-rsmanambai.ntbprov.go.id/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret
        })
      });
      const data = await response.json();
      
      if (data?.data?.access_token) {
        setApiKey(data.data.access_token);
        setApiResult({ status: response.status, payload: data });
      } else {
        setApiResult({ status: response.status, payload: data });
      }
    } catch (error) {
      setApiResult({ status: 'ERROR', error: 'Gagal mendapatkan token', details: error.message });
    } finally {
      setIsGettingToken(false);
    }
  };

  const handleRealApiTest = async () => {
    if (!user) return;

    setLoading(true);
    setApiResult(null);

    let url = `https://api-rsmanambai.ntbprov.go.id${endpoint.path}`;
    const queryParams = new URLSearchParams();
    
    if (tanggalAwal) queryParams.append('tanggal_awal', tanggalAwal);
    if (tanggalAkhir) queryParams.append('tanggal_akhir', tanggalAkhir);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    try {
      const response = await fetch(url, {
        method: endpoint.method,
        headers: {
          'Authorization': `Bearer ${apiKey || 'YOUR_API_KEY_HERE'}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setApiResult({ status: response.status, payload: data });
    } catch (error) {
      setApiResult({ status: 'ERROR', error: 'Gagal terhubung ke server API RS', details: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`flex-1 overflow-y-auto p-10 space-y-8 transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Informational Banner */}
      <div className={`border rounded-2xl p-5 text-sm space-y-2 ${isDarkMode ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-200' : 'bg-emerald-900/5 border-emerald-200 text-slate-700'}`}>
        <div className="font-bold text-emerald-400 text-base flex items-center gap-2">
          <span>📅 Informasi Periode Default Tanggal</span>
        </div>
        <p className="leading-relaxed">
          Jika parameter <code className="bg-emerald-900/40 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-semibold">tanggal_awal</code> dan <code className="bg-emerald-900/40 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-semibold">tanggal_akhir</code> tidak dikirim, sistem otomatis memproses data periode <strong>tanggal 5 bulan berjalan hingga tanggal 4 bulan depan</strong>[cite: 1].
        </p>
      </div>

      {/* Header Endpoint */}
      <div className={`border-b pb-8 space-y-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-bold px-3.5 py-1 rounded-lg border uppercase bg-emerald-100 text-emerald-800 border-emerald-300">
            {endpoint.method}
          </span>
          <span className={`font-mono text-base font-semibold px-3.5 py-1 rounded-lg ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/70 text-slate-700'}`}>
            https://api-rsmanambai.ntbprov.go.id{endpoint.path}
          </span>
        </div>
        <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{endpoint.title}</h1>
        <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{endpoint.description}</p>
      </div>

      {/* Table Parameters */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-emerald-500 uppercase tracking-wider">Query Parameters</h3>
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className={`border-b font-semibold ${isDarkMode ? 'bg-slate-800/60 border-slate-800 text-slate-300' : 'bg-slate-100/80 border-slate-200 text-slate-700'}`}>
                <th className="py-3.5 px-5">Parameter</th>
                <th className="py-3.5 px-5">Lokasi</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Keterangan</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {endpoint.params.map((p, i) => (
                <tr key={i} className={`transition ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}>
                  <td className="py-4 px-5 font-mono font-semibold text-emerald-500">{p.name}</td>
                  <td className="py-4 px-5 text-slate-400 font-mono">{p.type}</td>
                  <td className="py-4 px-5">
                    {p.required ? (
                      <span className="bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-md text-xs">Wajib</span>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-md text-xs ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>Opsional</span>
                    )}
                  </td>
                  <td className={`py-4 px-5 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Console Pengujian & Perolehan Token TERPROTEKSI */}
      <div className={`border rounded-2xl p-6 space-y-6 shadow-sm relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h4 className={`text-sm font-bold uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>⚡ Console Pengujian & Autentikasi API</h4>
        
        {user ? (
          <>
            {/* Form Generate Token */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-500 uppercase">1. Ambil Bearer Token</span>
                <span className="text-[11px] text-slate-400">Gunakan Client ID & Secret dari Tim IT</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Client ID..."
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className={`border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                />
                <input
                  type="password"
                  placeholder="Client Secret..."
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className={`border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                />
              </div>
              <button
                onClick={handleGetToken}
                disabled={isGettingToken}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs px-4 py-2 rounded-xl border border-slate-700 transition disabled:opacity-50 w-full"
              >
                {isGettingToken ? 'Meminta Token...' : '🔑 Generate Bearer Token'}
              </button>
            </div>

            {/* Form Test Endpoint */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-500 uppercase">2. Kirim Request Endpoint</span>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Active Bearer Token</label>
                  <input
                    type="password"
                    placeholder="Token akan terisi otomatis..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-mono ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Tanggal Awal</label>
                  <input
                    type="date"
                    value={tanggalAwal}
                    onChange={(e) => setTanggalAwal(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Tanggal Akhir</label>
                  <input
                    type="date"
                    value={tanggalAkhir}
                    onChange={(e) => setTanggalAkhir(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>
              </div>

              <button
                onClick={handleRealApiTest}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-50 shadow-sm w-full"
              >
                {loading ? 'Menghubungi Server RSUD Manambai...' : 'Kirim Request ke Endpoint'}
              </button>
            </div>
          </>
        ) : (
          <div className={`border border-dashed rounded-xl p-8 text-center space-y-3 ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
            <div className="text-2xl">🔒</div>
            <h5 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Fitur Kirim Request Dibatasi</h5>
            <p className={`text-xs max-w-md mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Anda perlu masuk terlebih dahulu untuk menggunakan konsol perolehan token dan pengujian API.
            </p>
            <button
              onClick={onOpenLogin}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-sm"
            >
              Login Sekarang
            </button>
          </div>
        )}
      </div>

      {/* Output Respon Real */}
      {user && apiResult && (
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Hasil Response Server Real-time:</span>
            <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-amber-300">
              HTTP Status: {apiResult.status}
            </span>
          </div>
          <pre className="text-sm font-mono overflow-x-auto text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl">
            <code>{JSON.stringify(apiResult.payload || apiResult, null, 2)}</code>
          </pre>
        </div>
      )}
    </main>
  );
}