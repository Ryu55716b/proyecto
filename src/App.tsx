import React, { useState } from 'react';
import { TabType, Device, SecurityAlert, ForensicReport } from './types';
import { INITIAL_DEVICES, INITIAL_ALERTS, INITIAL_REPORTS } from './data/mockData';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { PanelTab } from './components/PanelTab';
import { AlertsTab } from './components/AlertsTab';
import { ReportsTab } from './components/ReportsTab';
import { DevicesScreen } from './components/DevicesScreen';
import { TrafficInspectionModal } from './components/TrafficInspectionModal';
import { DatePickerModal } from './components/DatePickerModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('panel');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('mobile');
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [reports] = useState<ForensicReport[]>(INITIAL_REPORTS);
  const [inspectingDevice, setInspectingDevice] = useState<Device | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-25');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 2800);
  };

  const handleScanNetwork = () => {
    setIsScanning(true);
    showToast('Escaneando subred 192.168.1.0/24...', 'info');
    setTimeout(() => {
      setIsScanning(false);
      showToast('Escaneo completado. 42 activos detectados.', 'success');
    }, 1800);
  };

  const handleKillSwitch = (device: Device) => {
    const updatedBlockedState = !device.isBlocked;
    setDevices((prev) =>
      prev.map((d) => (d.id === device.id ? { ...d, isBlocked: updatedBlockedState } : d))
    );

    if (updatedBlockedState) {
      showToast(`Kill-Switch activado: ${device.name} (${device.ip}) aislado`, 'danger');
    } else {
      showToast(`Conectividad reanudada para ${device.name}`, 'success');
    }
  };

  const handleConfirmAlertBlock = (alertId: string, ip: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isBlocked: true } : a))
    );
    // Also block the associated device if present
    setDevices((prev) =>
      prev.map((d) => (d.ip === ip ? { ...d, isBlocked: true } : d))
    );
  };

  const activeAlertsCount = alerts.filter((a) => a.severity === 'critical' && !a.isBlocked).length;

  return (
    <div className="min-h-screen bg-[#080d17] text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-rose-500/30 selection:text-white">
      {/* Toast Notification */}
      <Toast
        message={toast?.message || null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Main Container: Mobile phone mockup or Full desktop canvas */}
      <div
        className={`w-full min-h-screen flex flex-col transition-all duration-300 relative ${
          viewMode === 'mobile'
            ? 'max-w-[420px] bg-[#0B111E] shadow-2xl border-x border-slate-800/60 pb-20'
            : 'max-w-6xl bg-[#0B111E] border-x border-slate-800/40 pb-24'
        }`}
      >
        {/* Top Header */}
        <TopBar
          currentTab={currentTab}
          deviceCount={42}
          isScanning={isScanning}
          viewMode={viewMode}
          onTabChange={setCurrentTab}
          onScan={handleScanNetwork}
          onToggleViewMode={() => setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile')}
          onNotificationsClick={() => {
            setCurrentTab('alertas');
            showToast('Mostrando Centro de Seguridad y Alertas');
          }}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-5 space-y-4">
          {currentTab === 'panel' && (
            <PanelTab
              deviceCount={42}
              devices={devices}
              onOpenDevices={() => setCurrentTab('dispositivos')}
              onOpenDatePicker={() => setIsDatePickerOpen(true)}
              onInspectDevice={(device) => setInspectingDevice(device)}
            />
          )}

          {currentTab === 'alertas' && (
            <AlertsTab
              alerts={alerts}
              onConfirmBlock={handleConfirmAlertBlock}
              onToast={showToast}
            />
          )}

          {currentTab === 'reportes' && (
            <ReportsTab
              reports={reports}
              onToast={showToast}
            />
          )}

          {currentTab === 'dispositivos' && (
            <DevicesScreen
              devices={devices}
              isScanning={isScanning}
              onScan={handleScanNetwork}
              onInspectTraffic={(device) => setInspectingDevice(device)}
              onKillSwitch={handleKillSwitch}
              onToast={showToast}
            />
          )}
        </main>

        {/* Bottom Navigation Bar (Shown on Panel, Alertas, and Reportes tabs) */}
        {currentTab !== 'dispositivos' && (
          <BottomNav
            currentTab={currentTab}
            alertCount={activeAlertsCount}
            onSelectTab={setCurrentTab}
          />
        )}
      </div>

      {/* Traffic Inspection Modal / Bottom Sheet */}
      {inspectingDevice && (
        <TrafficInspectionModal
          device={inspectingDevice}
          onClose={() => setInspectingDevice(null)}
          onKillSwitch={handleKillSwitch}
          onToast={showToast}
        />
      )}

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        selectedDate={selectedDate}
        onClose={() => setIsDatePickerOpen(false)}
        onSelectDate={(date) => {
          setSelectedDate(date);
          showToast(`Fecha de telemetría seleccionada: ${date}`);
        }}
      />
    </div>
  );
}
