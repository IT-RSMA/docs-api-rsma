import { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, isDarkMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLoginSuccess({ username: 'admin', name: 'User Terautentikasi' });
      setError('');
      onClose();
    } else {
      setError('Username atau password salah! (Coba: admin / admin123)');
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
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Username</label>
            <input
              type="text"
              placeholder="Masukkan username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Password</label>
            <input
              type="password"
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2.5 rounded-xl transition shadow-sm mt-2"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}