import { useState, useCallback } from 'react';

export default function Sidebar({ data, selectedId, onSelect, isDarkMode }) {
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (moveEvent) => {
      const newWidth = moveEvent.clientX;
      const clampedWidth = Math.max(200, Math.min(newWidth, 550));
      setSidebarWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  const getBadgeStyle = (method) => {
    switch (method) {
      case 'GET': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'POST': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <aside 
      style={{ width: `${sidebarWidth}px` }}
      className={`relative border-r flex flex-col overflow-y-auto shrink-0 transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } ${isResizing ? 'select-none transition-none' : 'transition-all duration-75'}`}
    >
      {/* Handle Tarik Kanan / Kiri untuk Resize Width Sidebar */}
      <div
        onMouseDown={startResizing}
        title="Geser ke kiri / kanan untuk memperbesar / memperkecil sidebar"
        className={`group absolute top-0 right-0 bottom-0 w-2.5 hover:w-3 cursor-col-resize z-30 flex items-center justify-center transition-all ${
          isResizing ? 'bg-emerald-500/30' : 'hover:bg-emerald-500/20'
        }`}
      >
        <div className={`w-1 h-10 rounded-full transition-colors ${
          isResizing ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-emerald-400'
        }`} />
      </div>

      <div className="p-5 space-y-7 pr-4">
        {data.map((cat, idx) => (
          <div key={idx} className="space-y-2.5">
            <h2 className={`text-xs font-bold uppercase tracking-wider px-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {cat.category}
            </h2>
            <div className="space-y-1.5">
              {cat.endpoints.map((ep) => {
                const isActive = ep.id === selectedId;
                return (
                  <button
                    key={ep.id}
                    onClick={() => onSelect(ep.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                      isActive
                        ? isDarkMode
                          ? 'bg-emerald-950/60 text-emerald-400 font-semibold border-l-4 border-emerald-500 shadow-sm'
                          : 'bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-600 shadow-sm'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate pr-2">{ep.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${getBadgeStyle(ep.method)}`}>
                      {ep.method}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}