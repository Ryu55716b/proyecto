import React, { useState } from 'react';
import { ShieldCheck, Wifi, ArrowDown, ArrowUp, Calendar, Laptop, Server, ChevronRight } from 'lucide-react';
import { Device, TrafficMode } from '../types';

interface PanelTabProps {
  deviceCount: number;
  devices: Device[];
  onOpenDevices: () => void;
  onOpenDatePicker: () => void;
  onInspectDevice: (device: Device) => void;
}

export const PanelTab: React.FC<PanelTabProps> = ({
  deviceCount,
  devices,
  onOpenDevices,
  onOpenDatePicker,
  onInspectDevice,
}) => {
  const [trafficMode, setTrafficMode] = useState<TrafficMode>('inbound');

  // SVG coordinates matching user's original HTML code:
  // Inbound: Green curve with peak at 12:00 (x: 210, y: 50)
  const inboundLineD =
    'M 0,118 L 15,116 L 38,110 L 60,114 L 85,122 L 105,115 L 130,118 L 150,110 L 175,108 L 188,114 L 210,50 L 240,120 L 260,114 L 285,116 L 305,108 L 330,112 L 350,118';
  const inboundAreaD =
    'M 0,118 L 15,116 L 38,110 L 60,114 L 85,122 L 105,115 L 130,118 L 150,110 L 175,108 L 188,114 L 210,50 L 240,120 L 260,114 L 285,116 L 305,108 L 330,112 L 350,118 L 350,135 L 0,135 Z';

  // Outbound: Blue curve with peak at ~11:00 (x: 158, y: 42)
  const outboundLineD =
    'M 0,122 L 20,120 L 45,116 L 70,115 L 90,124 L 115,116 L 130,122 L 158,42 L 175,86 L 195,114 L 225,110 L 245,112 L 260,110 L 285,122 L 305,116 L 335,114 L 350,120';
  const outboundAreaD =
    'M 0,122 L 20,120 L 45,116 L 70,115 L 90,124 L 115,116 L 130,122 L 158,42 L 175,86 L 195,114 L 225,110 L 245,112 L 260,110 L 285,122 L 305,116 L 335,114 L 350,120 L 350,135 L 0,135 Z';

  const isGreen = trafficMode === 'inbound';
  const chartStroke = isGreen ? '#00E676' : '#2979FF';
  const chartLinePath = isGreen ? inboundLineD : outboundLineD;
  const chartAreaPath = isGreen ? inboundAreaD : outboundAreaD;
  const peakDotX = isGreen ? 210 : 158;
  const peakDotY = isGreen ? 50 : 42;

  // Recent activity devices
  const workstationDev = devices.find((d) => d.name.includes('Workstation')) || devices[1];
  const gatewayEdge = devices.find((d) => d.name.includes('Gateway')) || devices[0];

  return (
    <div className="space-y-4">
      {/* Network Status Card */}
      <section className="bg-[#111928] rounded-2xl p-4 border border-slate-800 shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
            Estado de la Red
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-wide text-[#00E676]">Protegida</span>
            <ShieldCheck className="w-5 h-5 text-[#00E676]" />
          </div>
        </div>

        {/* Coral badge button linking to Active Devices */}
        <button
          type="button"
          onClick={onOpenDevices}
          aria-label={`Ver ${deviceCount} dispositivos activos`}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF5252] hover:bg-[#ff3b3b] text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-900/30 active:scale-95 transition"
        >
          <Wifi className="w-4 h-4" />
          <span>{deviceCount} Activos</span>
        </button>
      </section>

      {/* Metrics Tabs (Entrada / Salida) */}
      <section className="grid grid-cols-2 gap-3">
        {/* Entrada */}
        <button
          type="button"
          onClick={() => setTrafficMode('inbound')}
          className={`text-left rounded-2xl p-4 bg-[#111928] transition-all duration-200 active:scale-[0.98] relative overflow-hidden ${
            isGreen
              ? 'border-2 border-[#00E676] glow-green'
              : 'border border-slate-800 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-[#00E676]/10 flex items-center justify-center text-[#00E676]">
              <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-medium text-slate-400">Entrada</span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-white font-mono">1.2 GB</p>
          {isGreen && (
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#00E676]"></div>
          )}
        </button>

        {/* Salida */}
        <button
          type="button"
          onClick={() => setTrafficMode('outbound')}
          className={`text-left rounded-2xl p-4 bg-[#111928] transition-all duration-200 active:scale-[0.98] relative overflow-hidden ${
            !isGreen
              ? 'border-2 border-[#2979FF] glow-blue'
              : 'border border-slate-800 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-[#2979FF]/10 flex items-center justify-center text-[#2979FF]">
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-medium text-slate-400">Salida</span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-white font-mono">350 MB</p>
          {!isGreen && (
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#2979FF]"></div>
          )}
        </button>
      </section>

      {/* Traffic Graph Section */}
      <section className="bg-[#111928] rounded-2xl p-4 border border-slate-800 relative flex flex-col justify-between shadow-lg">
        {/* Graph Header with Calendar Button */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">
              {isGreen ? 'Tráfico Entrante (24 hrs)' : 'Tráfico Saliente (24 hrs)'}
            </h2>
            <p className="text-[11px] text-slate-400">Datos en tiempo real (Hoy)</p>
          </div>

          <button
            type="button"
            onClick={onOpenDatePicker}
            title="Seleccionar Fecha"
            className="p-2 rounded-lg bg-[#152136] text-[#FF5252] hover:text-white border border-slate-800 active:scale-95 transition-colors"
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>

        {/* SVG Curve Chart */}
        <div className="relative w-full h-44 mt-2">
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 350 140"
          >
            <defs>
              <linearGradient id="gradient-inbound" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#00E676" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#00E676" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#00E676" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="gradient-outbound" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#2979FF" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#2979FF" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#2979FF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line
              x1="0"
              x2="350"
              y1="35"
              y2="35"
              stroke="#1E293B"
              strokeWidth="0.8"
              strokeDasharray="3 3"
            />
            <line
              x1="0"
              x2="350"
              y1="75"
              y2="75"
              stroke="#1E293B"
              strokeWidth="0.8"
              strokeDasharray="3 3"
            />
            <line
              x1="0"
              x2="350"
              y1="115"
              y2="115"
              stroke="#1E293B"
              strokeWidth="0.8"
              strokeDasharray="3 3"
            />

            {/* Area fill */}
            <path
              d={chartAreaPath}
              fill={isGreen ? 'url(#gradient-inbound)' : 'url(#gradient-outbound)'}
              className="transition-all duration-500 ease-in-out"
            />

            {/* Stroke path */}
            <path
              d={chartLinePath}
              fill="none"
              stroke={chartStroke}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500 ease-in-out"
            />

            {/* Peak point indicator */}
            <circle
              cx={peakDotX}
              cy={peakDotY}
              r="3.5"
              fill={chartStroke}
              stroke="#0B111E"
              strokeWidth="2"
              className="animate-pulse transition-all duration-500"
            />
          </svg>
        </div>

        {/* 24h Axis Labels */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
          <span>00:00</span>
          <span>06:00</span>
          <span className="text-slate-200 font-semibold">12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
      </section>

      {/* Recent Activity List */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Actividad Reciente
          </h3>
          <span className="text-[11px] text-[#00E676] flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-ping"></span>
            En Vivo
          </span>
        </div>

        {/* Device Row 1: Workstation-Dev-04 */}
        <article
          onClick={() => onInspectDevice(workstationDev)}
          className="bg-[#111928] rounded-xl p-3 border border-slate-800 flex items-center justify-between hover:bg-slate-850 hover:border-slate-700 cursor-pointer active:scale-[0.99] transition shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-[#00E676] flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{workstationDev.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">
                {workstationDev.ip} • TLS 1.3
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#00E676] font-mono">
              {workstationDev.trafficRate || '+24.8 MB/s'}
            </span>
            <p className="text-[9px] text-slate-400">Analizado por IA</p>
          </div>
        </article>

        {/* Device Row 2: Gateway-Edge-Primary */}
        <article
          onClick={() => onInspectDevice(gatewayEdge)}
          className="bg-[#111928] rounded-xl p-3 border border-slate-800 flex items-center justify-between hover:bg-slate-850 hover:border-slate-700 cursor-pointer active:scale-[0.99] transition shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#2979FF] flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{gatewayEdge.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">
                {gatewayEdge.ip} • DNS Filter
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#2979FF] font-mono">
              {gatewayEdge.trafficRate || '12.1 MB/s'}
            </span>
            <p className="text-[9px] text-emerald-400">Sin Amenazas</p>
          </div>
        </article>

        {/* Quick button to view all devices */}
        <button
          type="button"
          onClick={onOpenDevices}
          className="w-full py-2 px-3 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition"
        >
          <span>Ver todos los {deviceCount} dispositivos activos</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};
