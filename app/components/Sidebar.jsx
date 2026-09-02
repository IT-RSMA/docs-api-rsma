export default function Sidebar({ data, selectedId, onSelect }) {
  const getBadgeStyle = (method) => {
    switch (method) {
      case 'GET': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'POST': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0">
      <div className="p-5 space-y-7">
        {data.map((cat, idx) => (
          <div key={idx} className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
              {cat.category}
            </h2>
            <div className="space-y-1.5">
              {cat.endpoints.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => onSelect(ep.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                    ep.id === selectedId
                      ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate pr-2">{ep.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${getBadgeStyle(ep.method)}`}>
                    {ep.method}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}