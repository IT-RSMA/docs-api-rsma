'use client';

import { useState, useMemo, useEffect } from 'react';
import { API_DATA } from './data/apiData';
import { logoutUserApi, getSavedToken, getSavedClientName, getAuthUser, fetchSimrsApi } from './lib/apiClient';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import CodePanel from './components/CodePanel';
import LoginModal from './components/LoginModal';

export default function Home() {
  const [selectedEndpointId, setSelectedEndpointId] = useState('analytics-top-diseases');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State untuk Try It Out API Testing
  const [tanggalAwal, setTanggalAwal] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  // Cek token tersimpan & set tanggal default saat komponen di-mount di client
  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;
    setTanggalAwal(todayStr);
    setTanggalAkhir(todayStr);

    const token = getSavedToken();
    const authUser = getAuthUser();
    const name = authUser?.name || getSavedClientName();
    if (token) {
      setUser({ name: name || 'Instansi Terautentikasi', token, ...authUser });
    }
  }, []);

  const activeEndpoint = useMemo(() => {
    for (const cat of API_DATA) {
      const found = cat.endpoints.find((e) => e.id === selectedEndpointId);
      if (found) return found;
    }
    return API_DATA[0].endpoints[0];
  }, [selectedEndpointId]);

  // Reset live response saat ganti endpoint
  const handleSelectEndpoint = (id) => {
    setSelectedEndpointId(id);
    setApiResult(null);
  };

  const handleSendRequest = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    setLoading(true);
    setApiResult(null);

    try {
      let relativePath = activeEndpoint.path;
      const params = new URLSearchParams();
      if (tanggalAwal) params.append('tanggal_awal', tanggalAwal);
      if (tanggalAkhir) params.append('tanggal_akhir', tanggalAkhir);
      if (params.toString()) {
        relativePath += `?${params.toString()}`;
      }

      const res = await fetchSimrsApi({
        endpoint: relativePath,
        method: activeEndpoint.method,
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

  const filteredData = useMemo(() => {
    if (!searchQuery) return API_DATA;
    return API_DATA.map((cat) => ({
      ...cat,
      endpoints: cat.endpoints.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.path.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter((cat) => cat.endpoints.length > 0);
  }, [searchQuery]);

  const handleLogout = async () => {
    await logoutUserApi();
    setUser(null);
  };

  return (
    <div className={`flex flex-col h-screen font-sans overflow-hidden transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          data={filteredData}
          selectedId={selectedEndpointId}
          onSelect={handleSelectEndpoint}
          isDarkMode={isDarkMode}
        />
        <MainContent
          endpoint={activeEndpoint}
          isDarkMode={isDarkMode}
          user={user}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          tanggalAwal={tanggalAwal}
          setTanggalAwal={setTanggalAwal}
          tanggalAkhir={tanggalAkhir}
          setTanggalAkhir={setTanggalAkhir}
          loading={loading}
          handleSendRequest={handleSendRequest}
        />
        <CodePanel
          endpoint={activeEndpoint}
          user={user}
          tanggalAwal={tanggalAwal}
          tanggalAkhir={tanggalAkhir}
          apiResult={apiResult}
        />
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}