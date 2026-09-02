export default function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-20 shrink-0 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="bg-emerald-600 text-white p-2.5 rounded-xl font-black text-xl flex items-center justify-center w-12 h-12 shadow-md shadow-emerald-600/20">
          RS
        </div>
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="font-bold text-slate-900 text-lg leading-none">
              API RSUD Manambai Abdul Kadir
            </span>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              v1.0.0
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-mono">https://api-rsmanambai.ntbprov.go.id</p>
        </div>
      </div>

      <div className="w-1/3 max-w-lg relative">
        <input
          type="text"
          placeholder="Cari endpoint (misal: 'ranap', 'kanker')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
        />
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-xl font-medium">
          🔒 Bearer Token + IP Whitelist
        </span>
      </div>
    </header>
  );
}