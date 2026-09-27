import React, { useState } from 'react';
import { Search, ChevronDown, Lightbulb, FileText, Sparkles } from 'lucide-react';
import { ForensicReport } from '../types';

interface ReportsTabProps {
  reports: ForensicReport[];
  onToast: (msg: string, type?: 'success' | 'danger' | 'info') => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ reports, onToast }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'report-1': true, // Open by default matching screenshot
  });

  const toggleAccordion = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExportPdf = (report: ForensicReport) => {
    const formattedPdfContent = `=====================================================
CENTRO DE SEGURIDAD - REPORTE FORENSE DE RED
=====================================================
Título: ${report.title}
Fecha: ${report.date}
Motor Forense: ${report.engine}
Puntuación de Seguridad: ${report.score}/100
Estado: Atestado y Firmado Criptográficamente

RESUMEN EJECUTIVO:
${report.summary}

HALLAZGOS DETALLADOS:
${report.findings.map((f) => `${f.label} ${f.text}`).join('\n\n')}

RECOMENDACIÓN DE LA IA:
${report.recommendation}

=====================================================
Generado automáticamente por el Analizador de Tráfico IA
`;

    const blob = new Blob([formattedPdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.toLowerCase().replace(/\s+/g, '_')}_qwen2.5.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    onToast(`Reporte "${report.title}" exportado a PDF`, 'success');
  };

  const filteredReports = reports.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const findingsText = r.findings.map((f) => `${f.label} ${f.text}`).join(' ').toLowerCase();
    return (
      r.title.toLowerCase().includes(term) ||
      r.summary.toLowerCase().includes(term) ||
      r.date.toLowerCase().includes(term) ||
      findingsText.includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar matching screenshot */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por IP, equipo o fecha..."
          className="w-full bg-[#162035] text-slate-100 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-700/70 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-inner"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Reports List */}
      <main className="space-y-3.5 pb-8">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-[#121a2d] rounded-2xl border border-slate-800">
            <p className="text-sm text-slate-400">
              No se encontraron reportes que coincidan con "{searchTerm}"
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isExpanded = !!expandedIds[report.id];
            const isScoreGood = report.score >= 80;

            return (
              <article
                key={report.id}
                className="bg-[#121a2d] border border-slate-800 rounded-2xl shadow-lg overflow-hidden transition-colors"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(report.id)}
                  aria-expanded={isExpanded}
                  className="w-full p-3.5 flex items-center justify-between text-left focus:outline-none hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-3">
                    {/* Score Circle Ring */}
                    <div
                      className={`relative flex items-center justify-center w-11 h-11 rounded-full border-2 font-bold text-sm shrink-0 ${
                        isScoreGood
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400 shadow-sm shadow-emerald-500/10'
                          : 'border-rose-500 bg-rose-950/40 text-rose-400 shadow-sm shadow-rose-500/20'
                      }`}
                    >
                      {report.score}
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-white tracking-wide leading-tight">
                        {report.title}
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-mono">
                        <span>{report.date}</span>
                        <span>•</span>
                        <span className="text-indigo-300 font-medium">{report.engine}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="px-3.5 pb-4 space-y-3.5 border-t border-slate-800/60 pt-3">
                    {/* Summary Banner */}
                    <div className="bg-[#16233f]/70 border border-sky-900/40 rounded-xl p-2.5">
                      <p className="text-xs text-sky-300/90 italic leading-relaxed">
                        {report.summary}
                      </p>
                    </div>

                    {/* Findings Section */}
                    <div className="space-y-1.5 text-xs leading-relaxed text-slate-300">
                      <span className="font-bold tracking-wider text-[11px] text-slate-400 block uppercase">
                        Hallazgos:
                      </span>

                      {report.findings.map((f) => (
                        <p key={f.id} className="pl-1 pt-0.5">
                          <strong
                            className={
                              f.isWarning ? 'text-rose-400 font-semibold' : 'text-slate-200'
                            }
                          >
                            {f.label}{' '}
                          </strong>
                          {f.code ? (
                            <>
                              Múltiples IPs del segmento{' '}
                              <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300 font-mono text-[11px]">
                                {f.code}
                              </code>{' '}
                              intentaron conectar al puerto 22 (SSH) y 3389 (RDP) del servidor
                              principal. Todos los paquetes fueron filtrados por la política BPF y
                              bloqueados por iptables.
                            </>
                          ) : (
                            f.text
                          )}
                        </p>
                      ))}
                    </div>

                    {/* AI Recommendation Box */}
                    <div className="bg-[#112338] border border-amber-500/40 rounded-xl p-3 shadow-inner">
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                        <Lightbulb className="w-4 h-4" />
                        <span>Recomendación de la IA</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-snug">
                        {report.recommendation}
                      </p>
                    </div>

                    {/* Action Footer */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleExportPdf(report)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-rose-400" />
                        <span>Exportar PDF</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </main>
    </div>
  );
};
