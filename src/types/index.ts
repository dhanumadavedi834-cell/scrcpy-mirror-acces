export interface ConnectionConfig {
  phoneName: string;
  tailscaleIp: string;
  port: number;
  videoBitrate: string; // e.g., '4M', '2M', '8M'
  maxFps: number; // 30 or 60
  maxSize: number; // 1080, 1280, 1440, 0 (native)
  turnScreenOff: boolean;
  stayAwake: boolean;
  forwardAudio: boolean;
  videoCodec: 'h264' | 'h265';
  lowLatencyBuffer: boolean;
  customFlags: string;
}

export type PresetType = 'mobile_4g' | 'balanced_remote' | 'high_speed_wifi' | 'view_only_presentation';

export interface Preset {
  id: PresetType;
  name: string;
  description: string;
  targetNetwork: string;
  config: Partial<ConnectionConfig>;
}

export interface ScriptFile {
  filename: string;
  path: string;
  description: string;
  type: 'bat' | 'ps1' | 'ini' | 'md' | 'vbs';
  category: 'core' | 'setup' | 'maintenance' | 'docs';
  content: (config: ConnectionConfig) => string;
}

export interface TroubleshootingTopic {
  id: string;
  symptom: string;
  errorSnippet?: string;
  rootCause: string;
  solutionSteps: string[];
  diagnosticCommand?: string;
}

export interface SecurityMatrixItem {
  feature: string;
  persistsAcrossReboot: boolean;
  requiresPhysicalAccess: boolean;
  behaviorDetails: string;
  recommendation: string;
}
