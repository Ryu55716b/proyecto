import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  Router,
  Laptop,
  Smartphone,
  Printer,
  AlertOctagon,
  Server,
  Activity,
  Copy,
  Ban,
  X,
  Radio,
} from 'lucide-react';
import { Device } from '../types';

interface DevicesScreenProps {
  devices: Device[];
  isScanning: boolean;
  onScan: () => void;
  onInspectTraffic: (device: Device) => void;
  onKillSwitch: (device: Device) => void;
  onToast: (msg: string, type?: 'success' | 'danger' | 'info') => void;
}

export const DevicesScreen: React.FC<DevicesScreenProps> = ({
  devices,
  isScanning,
  onScan,
  onInspectTraffic,
  onKillSwitch,
  onToast,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'LAN' | 'Wi-Fi' | 'Sospechosos'>('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Filter logic
  const filteredDevices = devices.filter((device) => {
    const matchesFilter = filter === 'all' || device.type === filter;
    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      device.name.toLowerCase().includes(q) ||
      device.ip.toLowerCase().includes(q) ||
      device.mac.toLowerCase().includes(q)
    );
  });

  const handleCopyIp = (device: Device) => {
    navigator.clipboard
      .writeText(device.ip)
      .then(() => {
        onToast(`IP ${device.ip} copiada al portapapeles`, 'success');
      })
      .catch(() => {
        onToast(`IP: ${device.ip}`, 'info');
      });
    setSelectedDevice(null);
  };

  const handleBlockConfirm = (device: Device) => {
    onKillSwitch(device);
    setSelectedDevice(null);
  };

  const getDeviceIcon = (iconType: string) => {
    switch (iconType) {
      case 'router':
        return <Router className="w-5 h-5 text-blue-400" />;
      case 'laptop':
        return <Laptop className="w-5 h-5 text-blue-400" />;
      case 'phone':
        return <Smartphone className="w-5 h-5 text-blue-400" />;
      case 'printer':
        return <Printer className="w-5 h-5 text-blue-400" />;
      case 'server':
        return <Server className="w-5 h-5 text-blue-400" />;
      case 'alert':
      default:
        return <AlertOctagon className="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <div className="space-y-3 pb-24">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por Nombre, IP o MAC..."
          className="w-full pl-9 pr-4 py-2 bg-slate-900/90 text-sm text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Segmented Category Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar pb-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold active:scale-95 transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Todos (42)
        </button>

        <button
          type="button"
          onClick={() => setFilter('LAN')}
          className={`px-3 py-1.5 rounded-lg active:scale-95 transition ${
            filter === 'LAN'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          LAN
        </button>

        <button
          type="button"
          onClick={() => setFilter('Wi-Fi')}
          className={`px-3 py-1.5 rounded-lg active:scale-95 transition ${
            filter === 'Wi-Fi'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Wi-Fi
        </button>

        <button
          type="button"
          onClick={() => setFilter('Sospechosos')}
          className={`px-3 py-1.5 rounded-lg active:scale-95 transition flex items-center gap-1.5 ${
            filter === 'Sospechosos'
              ? 'bg-rose-600 text-white font-semibold shadow-sm'
              : 'bg-red-950/40 border border-red-900/50 text-red-400 hover:text-red-300'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>Sospechosos</span>
        </button>
      </div>

      {/* Devices List Container */}
      <main className="space-y-2.5">
        {filteredDevices.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/80 rounded-2xl border border-slate-800">
            <p className="text-sm text-slate-400">
              No se encontraron dispositivos para los filtros seleccionados
            </p>
          </div>
        ) : (
          filteredDevices.map((device) => {
            const isUnknown = device.type === 'Sospechosos' || device.icon === 'alert';
            const isInactive = device.status === 'Inactivo';
            const isBlocked = device.isBlocked;

            return (
              <div
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className={`rounded-2xl p-3.5 flex items-center justify-between transition shadow-sm relative overflow-hidden cursor-pointer active:scale-[0.99] ${
                  isBlocked
                    ? 'bg-rose-950/40 border border-rose-900 opacity-60'
                    : isUnknown
                    ? 'bg-red-950/20 border border-red-900/40 hover:bg-red-900/30'
                    : 'bg-slate-900/80 border border-slate-800/90 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Device Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isUnknown
                        ? 'bg-red-950/80 border border-red-800/50 text-red-400'
                        : 'bg-blue-950/70 border border-blue-800/40 text-blue-400'
                    }`}
                  >
                    {getDeviceIcon(device.icon)}
                  </div>

                  {/* Device Info */}
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-semibold truncate ${
                          isUnknown ? 'text-red-200' : 'text-slate-100'
                        }`}
                      >
                        {device.name}
                      </h3>
                      {device.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${
                            isUnknown
                              ? 'bg-red-900/60 text-red-300 border-red-800'
                              : 'bg-blue-900/40 text-blue-300 border-blue-800/40'
                          }`}
                        >
                          {device.badge}
                        </span>
                      )}
                      {isBlocked && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-rose-900 text-rose-200 border border-rose-700">
                          Bloqueado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-mono">
                      <span>IP: {device.ip}</span>
                      <span>•</span>
                      <span className="text-[11px] text-slate-400">MAC: {device.mac}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1.5 mt-1">
                      {isBlocked ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          <span className="text-[11px] font-medium text-rose-400">
                            Aislado por Kill-Switch
                          </span>
                        </>
                      ) : isUnknown ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                          <span className="text-[11px] font-medium text-red-400">
                            {device.statusDetail || 'Tráfico No Autorizado'}
                          </span>
                        </>
                      ) : isInactive ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          <span className="text-[11px] font-medium text-amber-300">
                            {device.statusDetail || 'Inactivo (3 min)'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                          <span className="text-[11px] font-medium text-emerald-400">Activo</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Options Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDevice(device);
                  }}
                  aria-label={`Abrir opciones para ${device.name}`}
                  className="p-2 -mr-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            );
          })
        )}
      </main>

      {/* Floating Action Button (Escanear Red Ahora) */}
      <div className="fixed bottom-16 sm:bottom-6 left-0 right-0 max-w-md md:max-w-xl mx-auto px-4 z-30 pointer-events-none">
        <button
          type="button"
          onClick={onScan}
          disabled={isScanning}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-2xl shadow-xl shadow-blue-600/35 flex items-center justify-center space-x-2 transition duration-150 transform active:scale-[0.98] pointer-events-auto"
        >
          <Radio className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Escaneando subred...' : 'Escanear Red Ahora'}</span>
        </button>
      </div>

      {/* Device Context Modal Bottom Sheet */}
      {selectedDevice && (
        <div
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedDevice(null)}
        >
          <div
            className="w-full max-w-md bg-[#121927] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar on mobile */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-2 sm:hidden"></div>

            {/* Device Summary */}
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 font-bold">
                {getDeviceIcon(selectedDevice.icon)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{selectedDevice.name}</h4>
                <p className="text-xs text-slate-400 font-mono">
                  IP: {selectedDevice.ip} • MAC: {selectedDevice.mac}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDevice(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions list matching user screenshot */}
            <div className="space-y-2">
              {/* Option 1: Inspeccionar Tráfico */}
              <button
                type="button"
                onClick={() => {
                  onInspectTraffic(selectedDevice);
                  setSelectedDevice(null);
                }}
                className="w-full flex items-center space-x-3.5 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 active:scale-98 text-slate-200 transition text-left"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-medium block">Inspeccionar Tráfico</span>
                  <span className="text-[11px] text-slate-400 block">
                    Captura y análisis de paquetes en vivo
                  </span>
                </div>
              </button>

              {/* Option 2: Copiar IP */}
              <button
                type="button"
                onClick={() => handleCopyIp(selectedDevice)}
                className="w-full flex items-center space-x-3.5 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 active:scale-98 text-slate-200 transition text-left"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Copy className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-medium block">Copiar IP</span>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    {selectedDevice.ip}
                  </span>
                </div>
              </button>

              {/* Option 3: Bloquear (Kill-Switch) */}
              <button
                type="button"
                onClick={() => handleBlockConfirm(selectedDevice)}
                className="w-full flex items-center space-x-3.5 p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/60 active:scale-98 text-rose-300 transition text-left"
              >
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <Ban className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-rose-300 block">
                    {selectedDevice.isBlocked ? 'Desbloquear Acceso' : 'Bloquear (Kill-Switch)'}
                  </span>
                  <span className="text-[11px] text-rose-400/80 block">
                    {selectedDevice.isBlocked
                      ? 'Reanudar conectividad en el firewall'
                      : 'Revocar acceso de red de inmediato'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
