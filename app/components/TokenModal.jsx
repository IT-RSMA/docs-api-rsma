'use client';

import React, { useState, useEffect } from 'react';
import { generateApiToken, saveToken, getSavedToken, getSavedClientName, removeSavedToken } from '../lib/apiClient';

export default function TokenModal({ isOpen, onClose, onTokenUpdated, isDarkMode }) {
  const [name, setName] = useState('');
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentToken, setCurrentToken] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentToken(getSavedToken());
      setCurrentName(getSavedClientName());
      setErrorMsg('');
      setSuccessMsg('');
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await generateApiToken(name, ipWhitelist);
    setLoading(false);

    if (res.ok && res.data?.data?.access_token) {
      const newToken = res.data.data.access_token;
      saveToken(newToken, name);
      setCurrentToken(newToken);
      setCurrentName(name);
      setSuccessMsg('Token berhasil dibuat dan disimpan otomatis!');
      setName('');
      setIpWhitelist('');
      if (onTokenUpdated) onTokenUpdated(newToken);
    } else {
      setErrorMsg(res.data?.message || 'Gagal membuat token. Pastikan backend Laravel aktif.');
    }
  };

  const handleRevoke = () => {
    removeSavedToken();
    setCurrentToken('');
    setCurrentName('');
    setSuccessMsg('');
    if (onTokenUpdated) onTokenUpdated('');
  };

  const handleCopy = () => {
    if (currentToken) {
      navigator.clipboard.writeText(currentToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className={`rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
        <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔑</span>
            <div>
              <h3 className="font-bold text-base leading-tight">Kelola Bearer Token</h3>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Laravel Sanctum Token Generator</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`font-bold text-sm ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
          >
            ✕
          </button>
        </div>

        {/* Status Token Saat Ini */}
        {currentToken ? (
          <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Token Aktif ({currentName || 'Client'})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {copied ? '✓ Tersalin' : '📋 Salin'}
                </button>
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
            <code className={`block text-[11px] font-mono break-all p-2 rounded border max-h-24 overflow-y-auto ${isDarkMode ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-white border-emerald-100 text-emerald-950'}`}>
              {currentToken}
            </code>
          </div>
        ) : (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${isDarkMode ? 'bg-amber-950/30 border-amber-800/50 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            <span>⚠️</span>
            <span>Belum ada token tersimpan. Masukkan nama client untuk membuat token.</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs p-2.5 rounded-xl font-medium">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs p-2.5 rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form Generate Token */}
        <form onSubmit={handleGenerate} className="space-y-3 pt-1">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Nama Client / Web Instansi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Diskominfotik / Web-Client"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              IP Whitelist (Opsional)
            </label>
            <input
              type="text"
              placeholder="Kosongkan jika semua IP diizinkan"
              value={ipWhitelist}
              onChange={(e) => setIpWhitelist(e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            >
              Tutup
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl disabled:opacity-50 transition shadow-sm"
            >
              {loading ? 'Membuat Token...' : 'Buat Token Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
