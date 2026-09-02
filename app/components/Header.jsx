export default function Header({ searchQuery, setSearchQuery, user, onOpenLogin, onLogout, isDarkMode, onToggleDarkMode }) {
  return (
    <header className={`h-20 border-b flex items-center justify-between px-8 z-20 shrink-0 shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center space-x-4">
        <div className="bg-emerald-600 text-white p-2.5 rounded-xl font-black text-xl flex items-center justify-center w-12 h-12 shadow-md shadow-emerald-600/20">
          RS
        </div>
        <div>
          <div className="flex items-center space-x-2.5">
            <span className={`font-bold text-lg leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              API RSUD Manambai Abdul Kadir
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${isDarkMode ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
              v1.0.0
            </span>
          </div>
          <p className={`text-sm mt-1 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>https://api-rsmanambai.ntbprov.go.id</p>
        </div>
      </div>

      <div className="w-1/3 max-w-lg relative">
        <input
          type="text"
          placeholder="Cari endpoint (misal: 'ranap', 'kanker')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full text-sm px-4 py-2.5 rounded-xl border focus:outline-none focus:border-emerald-500 transition ${isDarkMode ? 'bg-slate-800 text-white border-slate-700 placeholder-slate-500' : 'bg-slate-100 text-slate-800 border-slate-200 placeholder-slate-400'}`}
        />
      </div>

      <div className="flex items-center space-x-3">
        {/* Tombol Dark/Light Mode */}
        <button
          onClick={onToggleDarkMode}
          className={`p-2.5 rounded-xl border text-sm font-semibold transition flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
          title="Ubah Tema"
        >
          {isDarkMode ? '🌙 Dark' : '☀️ Light'}
        </button>

        {user ? (
          <div className="flex items-center space-x-3">
            <span className={`text-xs font-semibold border px-3 py-2 rounded-xl ${isDarkMode ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
              👤 {user.name}
            </span>
            <button
              onClick={onLogout}
              className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl font-semibold transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition shadow-sm"
          >
            🔑 Login untuk Test API
          </button>
        )}
      </div>
    </header>
  );
}