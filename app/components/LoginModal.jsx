import { useState } from 'react';
import { loginUserApi } from '../lib/apiClient';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, isDarkMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await loginUserApi(username, password);
    setLoading(false);

    if (res.ok && res.data?.data?.access_token) {
      onLoginSuccess({
        username: username,
        name: res.data.data.user?.name || username,
        token: res.data.data.access_token,
      });
      setError('');
      onClose();
    } else {
      setError(res.data?.message || 'Login gagal! Periksa username/email & password atau server backend.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className={`rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5 border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
        <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <h3 className="text-lg font-bold">Login User API</h3>
          <button 
            onClick={onClose}
            className={`font-bold text-sm ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Username / Email
            </label>
            <input
              type="text"
              placeholder="Contoh: IT atau kominfo@sumbawakab.go.id"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              required
            />
          </div>

          {/* Quick-Fill Testing Helper */}
          <div>
            <span className={`block text-[11px] font-semibold mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Akun Cepat (Testing / Demo):
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setUsername('IT');
                  setPassword('2025');
                }}
                className={`text-[11px] px-2.5 py-1.5 rounded-lg border font-medium transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
              >
                ⚡ IT RSMA (2025)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('kominfo@sumbawakab.go.id');
                  setPassword('PasswordKominfo2026!');
                }}
                className={`text-[11px] px-2.5 py-1.5 rounded-lg border font-medium transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
              >
                ⚡ Kominfo
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="Btn Btn-full mt-2 disabled:opacity-50"
          >
            <span>{loading ? 'Memverifikasi...' : 'Login'}</span>
            <svg className="svgIcon" viewBox="0 0 512 512">
              <path d="M336 0c-88.4 0-160 71.6-160 160c0 20.2 3.7 39.6 10.6 57.5L9.4 394.5c-6 6-9.4 14.1-9.4 22.6V480c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V448h32c17.7 0 32-14.3 32-32V384h32c8.5 0 16.6-3.4 22.6-9.4l43-43c17.9 6.8 37.3 10.5 57.5 10.5c88.4 0 160-71.6 160-160S424.4 0 336 0zM384 144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}