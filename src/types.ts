export type TabType = 'panel' | 'alertas' | 'reportes' | 'dispositivos';

export type TrafficMode = 'inbound' | 'outbound';

export interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: 'LAN' | 'Wi-Fi' | 'Sospechosos';
  status: 'Activo' | 'Inactivo' | 'Tráfico No Autorizado';
  icon: 'router' | 'laptop' | 'phone' | 'printer' | 'alert' | 'server';
  badge?: string;
  statusDetail?: string;
  isBlocked?: boolean;
  bandwidthUsage?: string;
  trafficRate?: string;
}

export interface SecurityAlert {
  id: string;
  title: string;
  type: 'exfiltration' | 'honeytoken' | 'dns' | 'signatures';
  severity: 'critical' | 'warning' | 'info';
  timeAgo: string;
  description: string;
  origin: string;
  codeHighlight?: string;
  isBlocked?: boolean;
  statusBadge?: string;
}

export interface Finding {
  id: number;
  label: string;
  text: string;
  isWarning?: boolean;
  code?: string;
}

export interface ForensicReport {
  id: string;
  title: string;
  date: string;
  engine: string;
  score: number;
  summary: string;
  findings: Finding[];
  recommendation: string;
}

export interface PacketFlow {
  id: string;
  time: string;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  destination: string;
  size: string;
  status: 'Normal' | 'Análisis Heurístico' | 'Bloqueado';
}
