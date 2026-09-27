import React, { useState } from 'react';
import { Shield, Ban, Lock, Server, RefreshCw, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { SecurityAlert } from '../types';

interface AlertsTabProps {
  alerts: SecurityAlert[];
  onConfirmBlock: (alertId: string, ip: string) => void;
  onToast: (msg: string, type?: 'success' | 'danger' | 'info') => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({
  alerts,
  onConfirmBlock,
  onToast,
}) => {
  const [autoProtection, setAutoProtection] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [blockingIds, setBlockingIds] = useState<Record<string, boolean>>({});

  const handleToggleProtection = (checked: boolean) => {
    setAutoProtection(checked);
    onToast(
      checked
        ? 'Defensa Heurística Automática ACTIVADA'
        : 'Defensa Automática DESACTIVADA (Atención: Modo pasivo)',
      checked ? 'success' : 'danger'
    );
  };

  const handleBlockClick = async (alert: SecurityAlert) => {
    setBlockingIds((prev) => ({ ...prev, [alert.id]: true }));
    setTimeout(() => {
      setBlockingIds((prev) => ({ ...prev, [alert.id]: false }));
      onConfirmBlock(alert.id, alert.origin);
      onToast(`IP ${alert.origin} aislada preventivamente del firewall`, 'danger');
    }, 800);
  };

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (activeFilter === 'all') return true;
    return alert.severity === activeFilter;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;
  const infoCount = alerts.filter((a) => a.severity === 'info').length;

  return (
    <div className="space-y-4">
      {/* Toggle Protection Mode Card */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-white leading-tight">
              Protección Automática Activa
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Mitigación heurística en milisegundos
            </p>
          </div>
        </div>

        {/* iOS Style Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={autoProtection}
            onChange={(e) => handleToggleProtection(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5252]"></div>
        </label>
      </section>

      {/* Severity Filter Tabs */}
      <section className="flex items-center space-x-2 overflow-x-auto hide-scrollbar py-0.5">
        {/* Todas */}
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40 border border-rose-500/50'
              : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700/80'
          }`}
        >
          <span>Todas</span>
          <span className="bg-rose-800/80 px-1.5 py-0.2 rounded-full text-[10px]">
            {alerts.length}
          </span>
        </button>

        {/* Críticas */}
        <button
          type="button"
          onClick={() => setActiveFilter('critical')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'critical'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40 border border-rose-500/50'
              : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700/80'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>Críticas</span>
          <span className="bg-slate-700 px-1.5 py-0.2 rounded-full text-[10px] text-slate-300">
            {criticalCount}
          </span>
        </button>

        {/* Advertencias */}
        <button
          type="button"
          onClick={() => setActiveFilter('warning')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'warning'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40 border border-rose-500/50'
              : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700/80'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>Advertencias</span>
          <span className="bg-slate-700 px-1.5 py-0.2 rounded-full text-[10px] text-slate-300">
            {warningCount}
          </span>
        </button>

        {/* Informativas */}
        <button
          type="button"
          onClick={() => setActiveFilter('info')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === 'info'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40 border border-rose-500/50'
              : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700/80'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
          <span>Info</span>
          <span className="bg-slate-700 px-1.5 py-0.2 rounded-full text-[10px] text-slate-300">
            {infoCount}
          </span>
        </button>
      </section>

      {/* Incident List Feed */}
      <main className="space-y-3 pb-8">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 bg-[#111827] rounded-2xl border border-slate-800">
            <p className="text-sm text-slate-400">No hay alertas en esta categoría</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            const isInfo = alert.severity === 'info';
            const isActionInProgress = blockingIds[alert.id];

            return (
              <article
                key={alert.id}
                className={`bg-[#111827] rounded-xl p-4 shadow-lg shadow-black/40 relative overflow-hidden transition-all duration-300 ${
                  isCritical
                    ? 'border border-rose-900/60'
                    : isWarning
                    ? 'border border-amber-900/60'
                    : 'border border-blue-900/60'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    {/* Severity Icon */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isCritical
                          ? 'bg-rose-950/80 border border-rose-600/40 text-rose-400'
                          : isWarning
                          ? 'bg-amber-950/80 border border-amber-600/40 text-amber-400'
                          : 'bg-blue-950/80 border border-blue-600/40 text-blue-400'
                      }`}
                    >
                      {alert.type === 'exfiltration' && <Ban className="w-4 h-4" />}
                      {alert.type === 'honeytoken' && <AlertTriangle className="w-4 h-4" />}
                      {alert.type === 'dns' && <Server className="w-4 h-4" />}
                      {alert.type === 'signatures' && <RefreshCw className="w-4 h-4" />}
                    </div>

                    <h2
                      className={`text-sm font-semibold tracking-wide leading-tight ${
                        isCritical
                          ? 'text-rose-400'
                          : isWarning
                          ? 'text-amber-400'
                          : 'text-blue-400'
                      }`}
                    >
                      {alert.title}
                    </h2>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {alert.timeAgo}
                  </span>
                </div>

                {/* Description Body */}
                <p className="text-xs text-slate-300 mb-2 leading-relaxed font-normal">
                  {alert.codeHighlight ? (
                    <>
                      Lectura del archivo{' '}
                      <code className="text-rose-300 bg-rose-950/50 px-1 py-0.5 rounded font-mono text-[11px]">
                        {alert.codeHighlight}
                      </code>
                      . Bloqueo preventivo activado.
                    </>
                  ) : (
                    alert.description
                  )}
                </p>

                {/* Metadata & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-slate-800/80 gap-3">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">Origen:</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">
                      {alert.origin}
                    </span>
                  </div>

                  {/* Actions depending on alert type */}
                  {isCritical && (
                    alert.isBlocked ? (
                      <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        IP Aislada ({alert.origin})
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBlockClick(alert)}
                        disabled={isActionInProgress}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-300 text-xs font-semibold tracking-wide shadow-sm active:scale-95 transition-all"
                      >
                        {isActionInProgress ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            Bloqueando...
                          </>
                        ) : (
                          <>
                            {alert.type === 'honeytoken' ? (
                              <Lock className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                            ) : (
                              <Ban className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                            )}
                            Confirmar Bloqueo
                          </>
                        )}
                      </button>
                    )
                  )}

                  {isWarning && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-950/60 text-amber-300 border border-amber-700/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse"></span>
                      {alert.statusBadge || 'En Monitoreo'}
                    </span>
                  )}

                  {isInfo && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] text-blue-300 font-medium">
                      {alert.statusBadge || 'Base de Datos v4.19'}
                    </span>
                  )}
                </div>
              </article>
            );
          })
        )}
      </main>
    </div>
  );
};
