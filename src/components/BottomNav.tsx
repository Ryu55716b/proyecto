import React from 'react';
import { LayoutGrid, AlertTriangle, Sparkles } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  alertCount: number;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  alertCount,
  onSelectTab,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E1524]/95 backdrop-blur-lg border-t border-slate-800/80 pb-safe">
      <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-around py-2 px-3">
        {/* Tab 1: Panel */}
        <button
          type="button"
          onClick={() => onSelectTab('panel')}
          aria-label="Panel Principal"
          className={`flex flex-col items-center justify-center gap-1 w-20 py-1 transition-colors ${
            currentTab === 'panel'
              ? 'text-[#FF5252]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[11px] font-medium tracking-tight">Panel</span>
        </button>

        {/* Tab 2: Alertas */}
        <button
          type="button"
          onClick={() => onSelectTab('alertas')}
          aria-label="Alertas del Sistema"
          className={`flex flex-col items-center justify-center gap-1 w-20 py-1 relative transition-colors ${
            currentTab === 'alertas'
              ? 'text-[#FF5252]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <AlertTriangle className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {alertCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium tracking-tight">Alertas</span>
        </button>

        {/* Tab 3: Reportes IA */}
        <button
          type="button"
          onClick={() => onSelectTab('reportes')}
          aria-label="Reportes Inteligencia Artificial"
          className={`flex flex-col items-center justify-center gap-1 w-20 py-1 transition-colors ${
            currentTab === 'reportes'
              ? 'text-[#FF5252]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[11px] font-medium tracking-tight">Reportes IA</span>
        </button>
      </div>
    </nav>
  );
};
