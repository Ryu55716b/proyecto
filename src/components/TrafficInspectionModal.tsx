import React, { useState, useEffect } from 'react';
import { X, PauseCircle, PlayCircle, Download, Ban, Activity, Radio, Terminal } from 'lucide-react';
import { Device, PacketFlow } from '../types';
import { INITIAL_PACKETS } from '../data/mockData';

interface TrafficInspectionModalProps {
  device: Device | null;
  onClose: () => void;
  onKillSwitch: (device: Device) => void;
  onToast: (msg: string, type?: 'success' | 'danger' | 'info') => void;
}

export const TrafficInspectionModal: React.FC<TrafficInspectionModalProps> = ({
  device,
  onClose,
  onKillSwitch,
  onToast,
}) => {
  const [isCapturing, setIsCapturing] = useState<boolean>(true);
  const [packets, setPackets] = useState<PacketFlow[]>(INITIAL_PACKETS);
  const [rate, setRate] = useState<number>(4.8);
  const [pps, setPps] = useState<number>(1240);

  // Live packet stream simulation when active
  useEffect(() => {
    if (!isCapturing || !device) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      const randomEndpoints = [
        '142.250.190.46:443',
        '104.26.12.31:443',
        '1.1.1.1:53 (DNS)',
        '194.26.29.112:8080',
        '52.96.166.130:443',
        '8.8.8.8:53 (DNS)',
        '185.220.101.5:22',
      ];
      const randomDest = randomEndpoints[Math.floor(Math.random() * randomEndpoints.length)];
      const isHeuristic = randomDest.includes('194.26') || randomDest.includes('185.220');
      const isDns = randomDest.includes('53');
      const proto = isDns ? 'UDP' : 'TCP';
      const sizeNum = (Math.random() * 3 + 0.2).toFixed(1);

      const newPacket: PacketFlow = {
        id: `pkt-${Date.now()}`,
        time: timeStr,
        protocol: proto as 'TCP' | 'UDP',
        destination: randomDest,
        size: `${sizeNum} KB`,
        status: isHeuristic ? 'Análisis Heurístico' : 'Normal',
      };

      setPackets((prev) => [newPacket, ...prev.slice(0, 15)]);
      setRate(parseFloat((4.2 + Math.random() * 1.2).toFixed(1)));
      setPps(Math.floor(1180 + Math.random() * 140));
    }, 1800);

    return () => clearInterval(interval);
  }, [isCapturing, device]);

  if (!device) return null;

  const handleExportPcap = () => {
    const pcapHeader = `PCAP-DUMP-v2.4\nTarget: ${device.name} (${device.ip})\nMAC: ${device.mac}\nTimestamp: ${new Date().toISOString()}\nTotal Captured Packets: ${packets.length}\n\n`;
    const pcapBody = packets
      .map(
        (p) =>
          `[${p.time}] PROTO: ${p.protocol} | DST: ${p.destination} | SIZE: ${p.size} | STATUS: ${p.status}`
      )
      .join('\n');
    const blob = new Blob([pcapHeader + pcapBody], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `capture_${device.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pcap`;
    link.click();
    URL.revokeObjectURL(url);
    onToast(`Archivo PCAP descargado (${packets.length} tramas)`);
  };

  const handleToggleCapture = () => {
    setIsCapturing(!isCapturing);
    onToast(isCapturing ? 'Captura de paquetes pausada' : 'Captura de paquetes reanudada en vivo');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#0F172A] border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle on mobile */}
        <div className="w-full pt-3 pb-1 flex justify-center items-center sm:hidden flex-shrink-0">
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="px-5 pt-2 pb-3 border-b border-slate-800/80 flex items-start justify-between flex-shrink-0 bg-[#0d1322]">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                isCapturing 
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' 
                  : 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                {isCapturing ? 'Capturando Paquetes (En Vivo)' : 'Captura en Pausa'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-900/40 text-blue-300 border border-blue-800/40 rounded font-mono font-medium">
                {device.type}
              </span>
            </div>

            <h2 className="text-base font-bold text-white flex items-center gap-2 truncate">
              <span>Inspección de Tráfico</span>
              <span className="text-slate-500 font-normal text-xs">|</span>
              <span className="text-blue-400 text-sm font-semibold truncate">{device.name}</span>
            </h2>

            <p className="text-xs text-slate-400 font-mono mt-0.5">
              IP: <span className="text-slate-200 font-medium">{device.ip}</span> • MAC:{' '}
              <span className="text-slate-300 font-medium">{device.mac}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar inspección"
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition flex-shrink-0 mt-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 text-slate-100 flex-1 hide-scrollbar">
          {/* Realtime Traffic Metrics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Métricas en Tiempo Real
              </span>
              <span className="text-[11px] font-mono text-blue-400 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" /> 24 ms latencia
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <p className="text-[10px] text-slate-400 uppercase font-medium">Tasa Actual</p>
                <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{rate} MB/s</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">▲ 1.2 • ▼ 3.6 MB/s</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <p className="text-[10px] text-slate-400 uppercase font-medium">Paquetes / Seg</p>
                <p className="text-sm font-bold text-blue-300 font-mono mt-0.5">
                  {pps} <span className="text-[10px] text-slate-400 font-normal">pkts</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">0 drops (0%)</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <p className="text-[10px] text-slate-400 uppercase font-medium">Conexiones</p>
                <p className="text-sm font-bold text-amber-300 font-mono mt-0.5">
                  18 <span className="text-[10px] text-slate-400 font-normal">sockets</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">TCP/UDP activos</p>
              </div>
            </div>
          </div>

          {/* Active Ports & Protocol Distribution */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" /> Puertos y Protocolos Activos
              </span>
              <span className="text-[10px] text-slate-400 font-mono">3 puertos escuchando</span>
            </div>

            {/* Distribution Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
              <div className="bg-blue-500 h-full" style={{ width: '85%' }} title="HTTPS (85%)"></div>
              <div className="bg-emerald-400 h-full" style={{ width: '10%' }} title="HTTP (10%)"></div>
              <div className="bg-amber-400 h-full" style={{ width: '5%' }} title="DNS (5%)"></div>
            </div>

            {/* Legend List */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between bg-slate-950/50 px-2.5 py-1.5 rounded-lg border border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="font-mono font-medium text-slate-200">Puerto 443 / HTTPS</span>
                  <span className="text-[10px] px-1 py-0.2 bg-blue-900/40 text-blue-300 rounded font-mono">TCP</span>
                </div>
                <span className="font-semibold text-blue-300 font-mono text-[11px]">85% (3.8 MB/s)</span>
              </div>

              <div className="flex items-center justify-between bg-slate-950/50 px-2.5 py-1.5 rounded-lg border border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-mono font-medium text-slate-200">Puerto 80 / HTTP</span>
                  <span className="text-[10px] px-1 py-0.2 bg-emerald-950 text-emerald-400 rounded font-mono">TCP</span>
                </div>
                <span className="font-semibold text-emerald-400 font-mono text-[11px]">10% (480 KB/s)</span>
              </div>

              <div className="flex items-center justify-between bg-slate-950/50 px-2.5 py-1.5 rounded-lg border border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="font-mono font-medium text-slate-200">Puerto 53 / DNS</span>
                  <span className="text-[10px] px-1 py-0.2 bg-amber-950/70 text-amber-300 rounded font-mono">UDP</span>
                </div>
                <span className="font-semibold text-amber-300 font-mono text-[11px]">5% (240 KB/s)</span>
              </div>
            </div>
          </div>

          {/* Packet Stream Log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Registro de Flujos de Paquetes
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isCapturing
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 animate-pulse'
                  : 'text-slate-400 bg-slate-800 border-slate-700'
              }`}>
                {isCapturing ? 'STREAM ON' : 'PAUSADO'}
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-[11px] space-y-1.5 shadow-inner max-h-40 overflow-y-auto hide-scrollbar">
              {packets.map((pkt) => {
                const isHeuristic = pkt.status === 'Análisis Heurístico';
                return (
                  <div
                    key={pkt.id}
                    className={`flex items-center justify-between p-1 rounded transition ${
                      isHeuristic
                        ? 'bg-rose-950/30 text-rose-200 border border-rose-900/40'
                        : 'text-slate-300 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-slate-500 text-[10px]">{pkt.time}</span>
                      <span
                        className={`font-semibold text-[10px] ${
                          pkt.protocol === 'TCP' ? 'text-blue-400' : 'text-amber-400'
                        }`}
                      >
                        {pkt.protocol}
                      </span>
                      <span className="text-slate-300 truncate">{pkt.destination}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-1">
                      <span className="text-slate-400 text-[10px]">{pkt.size}</span>
                      {isHeuristic ? (
                        <span className="text-[9px] px-1 bg-rose-900/60 text-rose-300 rounded border border-rose-800">
                          Análisis Heurístico
                        </span>
                      ) : (
                        <span className="text-[9px] px-1 bg-emerald-950 text-emerald-300 rounded border border-emerald-800/50">
                          Normal
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-[#0d1322] border-t border-slate-800/80 space-y-2.5 flex-shrink-0">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleToggleCapture}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-850 text-slate-200 font-medium text-xs rounded-xl border border-slate-700/80 flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              {isCapturing ? (
                <>
                  <PauseCircle className="w-4 h-4 text-slate-400" />
                  <span>Pausar Captura</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 text-emerald-400" />
                  <span>Reanudar Captura</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleExportPcap}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-850 text-blue-300 font-medium text-xs rounded-xl border border-slate-700/80 flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Exportar PCAP</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onKillSwitch(device);
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-rose-950/60 hover:bg-rose-900/60 active:bg-rose-900/80 border border-rose-800/80 text-rose-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99]"
          >
            <Ban className="w-4 h-4 text-rose-400" />
            <span>Bloquear con Kill-Switch ({device.ip})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
