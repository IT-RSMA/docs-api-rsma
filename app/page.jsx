'use client';

import { useState, useMemo, useEffect } from 'react';
import { API_DATA } from './data/apiData';
import { logoutUserApi, getSavedToken, getSavedClientName, getAuthUser } from './lib/apiClient';
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

  // Cek token tersimpan saat halaman dibuka ulang
  useEffect(() => {
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
    setLiveResponse(null);
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
        />
        <CodePanel
          endpoint={activeEndpoint}
          user={user}
          onOpenLogin={() => setIsLoginModalOpen(true)}
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