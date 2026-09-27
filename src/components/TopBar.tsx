import React from 'react';
import { ArrowLeft, Bell, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import { TabType } from '../types';

interface TopBarProps {
  currentTab: TabType;
  deviceCount: number;
  isScanning: boolean;
  viewMode: 'desktop' | 'mobile';
  onTabChange: (tab: TabType) => void;
  onScan: () => void;
  onToggleViewMode: () => void;
  onNotificationsClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  deviceCount,
  isScanning,
  viewMode,
  onTabChange,
  onScan,
  onToggleViewMode,
  onNotificationsClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B111E]/90 backdrop-blur-md px-4 sm:px-6 pt-safe pt-3 pb-3 border-b border-slate-800/80 flex items-center justify-between">
      {/* Dynamic Left & Title Section */}
      {currentTab === 'dispositivos' ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onTabChange('panel')}
            className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 active:scale-95 transition"
            aria-label="Volver al panel"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white">Dispositivos Activos</h1>
            <span className="text-xs font-semibold text-blue-400 bg-blue-950/70 border border-blue-800/50 px-2 py-0.5 rounded-full">
              {deviceCount}
            </span>
          </div>
        </div>
      ) : currentTab === 'alertas' ? (
        <div>
          <span className="text-[11px] uppercase tracking-wider text-rose-500 font-bold block mb-0.5">
            IDS / IPS SENSOR
          </span>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Centro de Seguridad
          </h1>
        </div>
      ) : currentTab === 'reportes' ? (
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Centro de Seguridad
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Análisis Forense con IA (Qwen 2.5)
          </p>
        </div>
      ) : (
        /* Default Dashboard / Panel */
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse"></div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
            Analizador de Tráfico IA
          </h1>
        </div>
      )}

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-2">
        {/* Device Mode Switcher (Desktop Fullscreen vs Mobile Phone Frame) */}
        <button
          type="button"
          onClick={onToggleViewMode}
          title={viewMode === 'mobile' ? 'Cambiar a Vista Escritorio Completa' : 'Cambiar a Vista Móvil Nativa'}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
        >
          {viewMode === 'mobile' ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-blue-400" />
              <span>Escritorio</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#00E676]" />
              <span>Móvil</span>
            </>
          )}
        </button>

        {currentTab === 'dispositivos' ? (
          <button
            type="button"
            onClick={onScan}
            disabled={isScanning}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 active:scale-95 transition hover:text-white"
            title="Escanear red"
            aria-label="Escanear red"
          >
            <RefreshCw className={`w-4 h-4 text-blue-400 ${isScanning ? 'animate-spin' : ''}`} />
          </button>
        ) : currentTab === 'alertas' ? (
          <div className="flex items-center space-x-1.5 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium text-[11px]">En Vivo</span>
          </div>
        ) : currentTab === 'reportes' ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Activo
            </span>
          </div>
        ) : (
          /* Panel Tab Notification Icon */
          <button
            type="button"
            onClick={onNotificationsClick}
            aria-label="Ver notificaciones y alertas"
            className="relative p-2 rounded-xl bg-[#111928] text-slate-300 hover:text-white border border-slate-800 active:scale-95 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF5252] rounded-full ring-2 ring-[#0B111E]"></span>
          </button>
        )}
      </div>
    </header>
  );
};
