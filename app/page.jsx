'use client';

import { useState, useMemo } from 'react';
import { API_DATA } from './data/apiData';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import CodePanel from './components/CodePanel';

export default function Home() {
  const [selectedEndpointId, setSelectedEndpointId] = useState('analytics-top-diseases');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [customResponse, setCustomResponse] = useState(null);

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

  const handleSimulateRequest = () => {
    setIsSimulating(true);
    setCustomResponse(null);
    setTimeout(() => {
      setIsSimulating(false);
      setCustomResponse(Object.values(activeEndpoint.responses)[0]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          data={filteredData}
          selectedId={selectedEndpointId}
          onSelect={(id) => {
            setSelectedEndpointId(id);
            setCustomResponse(null);
          }}
        />
        <MainContent
          endpoint={activeEndpoint}
          onSimulate={handleSimulateRequest}
          isSimulating={isSimulating}
        />
        <CodePanel endpoint={activeEndpoint} customResponse={customResponse} />
      </div>
    </div>
  );
}