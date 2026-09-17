'use client';

import { BASE_URL } from '../lib/apiClient';

export default function Header({ searchQuery, setSearchQuery, user, onOpenLogin, onLogout, isDarkMode, onToggleDarkMode }) {

  return (
    <header className={`h-20 border-b flex items-center justify-between px-8 z-20 shrink-0 shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center space-x-4">
        <img
          src="/logo-rsma.png"
          alt="Logo RSMA"
          className="w-11 h-11 object-contain drop-shadow-sm"
        />
        <div>
          <div className="flex items-center space-x-2.5">
            <span className={`font-bold text-lg leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              API RS H.L Manambai AbdulKadir
            </span>
            {/* <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${isDarkMode ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
              v1.0.0
            </span> */}
          </div>
          <p className={`text-sm mt-1 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{BASE_URL}</p>
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
        {/* Tombol Dark/Light Mode (Uiverse Switch) */}
        <label htmlFor="theme" className="theme" title={isDarkMode ? 'Mode Gelap' : 'Mode Terang'}>
          <span className="theme__toggle-wrap">
            <input
              id="theme"
              className="theme__toggle"
              type="checkbox"
              role="switch"
              name="theme"
              value="dark"
              checked={isDarkMode}
              onChange={onToggleDarkMode}
            />
            <span className="theme__icon">
              <span className="theme__icon-part"></span>
              <span className="theme__icon-part"></span>
              <span className="theme__icon-part"></span>
              <span className="theme__icon-part"></span>
              <span className="theme__icon-part"></span>
              <span className="theme__icon-part"></span>
              <span className="theme__icon-part"></span>
              <span className="theme__icon-part"></span>
              <span className="theme__icon-part"></span>
            </span>
          </span>
        </label>

        {user ? (
          <div className="flex items-center space-x-2.5">
            <div className={`flex items-center gap-2 text-xs font-semibold border px-3 py-2 rounded-xl ${isDarkMode ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{user.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl font-semibold transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button onClick={onOpenLogin} className="Btn">
            <span>Login</span>
            <svg className="svgIcon" viewBox="0 0 512 512">
              <path d="M336 0c-88.4 0-160 71.6-160 160c0 20.2 3.7 39.6 10.6 57.5L9.4 394.5c-6 6-9.4 14.1-9.4 22.6V480c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V448h32c17.7 0 32-14.3 32-32V384h32c8.5 0 16.6-3.4 22.6-9.4l43-43c17.9 6.8 37.3 10.5 57.5 10.5c88.4 0 160-71.6 160-160S424.4 0 336 0zM384 144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}