import { useState } from 'react';

export default function CodePanel({ endpoint, customResponse }) {
  const [activeLang, setActiveLang] = useState('curl');

  const generateSnippet = () => {
    const fullUrl = `https://api-rsmanambai.ntbprov.go.id${endpoint.path}`;
    if (activeLang === 'curl') {
      return `curl -X ${endpoint.method} "${fullUrl}" \\\n  -H "Authorization: Bearer YOUR_API_KEY_HERE" \\\n  -H "Accept: application/json"`;
    }
    return `fetch("${fullUrl}", {\n  method: "${endpoint.method}",\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY_HERE",\n    "Accept": "application/json"\n  }\n});`;
  };

  return (
    <aside className="w-[480px] bg-slate-900 text-slate-100 flex flex-col shrink-0 border-l border-slate-800">
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
        <div className="flex bg-slate-800 p-1 rounded-lg space-x-1">
          {['curl', 'javascript'].map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition ${
                activeLang === lang ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-3 border-b border-slate-800">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Example Request</span>
        <pre className="bg-slate-950 p-4 rounded-xl text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed border border-slate-800">
          <code>{generateSnippet()}</code>
        </pre>
      </div>

      <div className="p-5 flex-1 space-y-3 flex flex-col">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Response Payload</span>
        <pre className="bg-slate-950 p-4 rounded-xl text-sm font-mono text-slate-300 overflow-x-auto flex-1 leading-relaxed border border-slate-800">
          <code>{JSON.stringify(customResponse || Object.values(endpoint.responses)[0], null, 2)}</code>
        </pre>
      </div>
    </aside>
  );
}