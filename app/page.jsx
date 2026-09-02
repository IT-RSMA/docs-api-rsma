'use client';

import { useState, useMemo } from 'react';
import { API_DATA } from './data/apiData';
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
  const [isDarkMode, setIsDarkMode] = useState(false); // State Dark Mode

  const activeEndpoint = useMemo(() => {
    for (const cat of API_DATA) {
      const found = cat.endpoints.find((e) => e.id === selectedEndpointId);
      if (found) return found;
    }
    return API_DATA[0].endpoints[0];
  }, [selectedEndpointId]);

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

  return (
    <div className={`flex flex-col h-screen font-sans overflow-hidden transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => setUser(null)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          data={filteredData}
          selectedId={selectedEndpointId}
          onSelect={(id) => setSelectedEndpointId(id)}
          isDarkMode={isDarkMode}
        />
        <MainContent
          endpoint={activeEndpoint}
          user={user}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          isDarkMode={isDarkMode}
        />
        <CodePanel endpoint={activeEndpoint} />
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