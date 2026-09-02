import { useState } from 'react';

export default function MainContent({ endpoint }) {
  const [tanggalAwal, setTanggalAwal] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  const handleRealApiTest = async () => {
    setLoading(true);
    setApiResult(null);

    // Memakai Base URL Resmi RSUD Manambai
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
    <main className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50">
      {/* Informational Banner */}
      <div className="bg-emerald-900/5 border border-emerald-200 rounded-2xl p-5 text-sm space-y-2">
        <div className="font-bold text-emerald-900 text-base flex items-center gap-2">
          <span>📅 Informasi Periode Default Tanggal</span>
        </div>
        <p className="text-slate-700 leading-relaxed">
          Jika parameter <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold">tanggal_awal</code> dan <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold">tanggal_akhir</code> tidak dikirim, sistem otomatis memproses data periode <strong>tanggal 5 bulan berjalan hingga tanggal 4 bulan depan</strong>[cite: 1].
        </p>
      </div>

      {/* Header Endpoint */}
      <div className="border-b border-slate-200 pb-8 space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-bold px-3.5 py-1 rounded-lg border uppercase bg-emerald-100 text-emerald-800 border-emerald-300">
            {endpoint.method}
          </span>
          <span className="font-mono text-base text-slate-700 font-semibold bg-slate-200/70 px-3.5 py-1 rounded-lg">
            https://api-rsmanambai.ntbprov.go.id{endpoint.path}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{endpoint.title}</h1>
        <p className="text-slate-600 text-base leading-relaxed">{endpoint.description}</p>
      </div>

      {/* Table Parameters */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-emerald-900 uppercase tracking-wider">Query Parameters</h3>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3.5 px-5">Parameter</th>
                <th className="py-3.5 px-5">Lokasi</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {endpoint.params.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-5 font-mono font-semibold text-emerald-600">{p.name}</td>
                  <td className="py-4 px-5 text-slate-500 font-mono">{p.type}</td>
                  <td className="py-4 px-5">
                    {p.required ? (
                      <span className="bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-md text-xs">Wajib</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs">Opsional</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-slate-700 leading-relaxed">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Input Parameter & Testing Console */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 uppercase">⚡ Console Pengujian API Real-Time</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">API Key / Bearer Token</label>
            <input
              type="password"
              placeholder="Masukkan Token Rahasia..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Awal</label>
            <input
              type="date"
              value={tanggalAwal}
              onChange={(e) => setTanggalAwal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Akhir</label>
            <input
              type="date"
              value={tanggalAkhir}
              onChange={(e) => setTanggalAkhir(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          onClick={handleRealApiTest}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-50 shadow-sm w-full"
        >
          {loading ? 'Menghubungi Server RSUD Manambai...' : 'Kirim Request ke https://api-rsmanambai.ntbprov.go.id'}
        </button>
      </div>

      {/* Output Respon Real */}
      {apiResult && (
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