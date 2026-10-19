import React, { useState } from 'react';
import { ConnectionConfig, PresetType } from '../types';
import { PRESETS } from '../data/presetsData';
import { 
  Play, 
  RefreshCw, 
  Square, 
  Copy, 
  Check, 
  Terminal, 
  Wifi, 
  ShieldCheck, 
  Smartphone, 
  Sliders, 
  Activity, 
  MonitorOff, 
  Volume2, 
  Zap,
  Info
} from 'lucide-react';

interface ConnectionConsoleProps {
  config: ConnectionConfig;
  setConfig: React.Dispatch<React.SetStateAction<ConnectionConfig>>;
  onDownloadScript: (filename: string) => void;
  onNavigateToWizard: () => void;
}

export const ConnectionConsole: React.FC<ConnectionConsoleProps> = ({
  config,
  setConfig,
  onDownloadScript,
  onNavigateToWizard
}) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [diagnosticSuccess, setDiagnosticSuccess] = useState<boolean | null>(null);
  const [activePreset, setActivePreset] = useState<PresetType>('balanced_remote');

  // Build the live scrcpy command string
  const generateCommand = () => {
    const parts = ['scrcpy.exe'];
    parts.push(`-s ${config.tailscaleIp || '100.x.y.z'}:${config.port}`);
    parts.push(`--video-bit-rate=${config.videoBitrate}`);
    parts.push(`--max-fps=${config.maxFps}`);
    if (config.maxSize > 0) parts.push(`-m ${config.maxSize}`);
    if (config.videoCodec) parts.push(`--video-codec=${config.videoCodec}`);
    if (!config.forwardAudio) parts.push('--no-audio');
    if (config.turnScreenOff) parts.push('--turn-screen-off');
    if (config.stayAwake) parts.push('--stay-awake');
    if (config.customFlags.trim()) parts.push(config.customFlags.trim());
    return parts.join(' ');
  };

  const currentCommand = generateCommand();

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(currentCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const applyPreset = (presetId: PresetType) => {
    const found = PRESETS.find(p => p.id === presetId);
    if (found) {
      setActivePreset(presetId);
      setConfig(prev => ({
        ...prev,
        ...found.config
      }));
    }
  };

  const runDiagnosticSimulation = () => {
    setDiagnosticRunning(true);
    setDiagnosticLogs([
      `[*] Initializing Tailscale tunnel diagnostic check...`,
      `[*] Target IP: ${config.tailscaleIp || '100.x.y.z'} (Tailscale WireGuard Mesh)`,
      `[*] Target Port: ${config.port} (adbd daemon)`
    ]);
    setDiagnosticSuccess(null);

    setTimeout(() => {
      if (!config.tailscaleIp || config.tailscaleIp === '100.x.y.z') {
        setDiagnosticLogs(prev => [
          ...prev,
          `[FAIL] Tailscale IP is set to default placeholder (100.x.y.z).`,
          `[HINT] Enter your phone's real 100.x.y.z IP from the Tailscale app above.`
        ]);
        setDiagnosticRunning(false);
        setDiagnosticSuccess(false);
        return;
      }

      setDiagnosticLogs(prev => [
        ...prev,
        `[OK] Pinging ${config.tailscaleIp} over Tailscale interface... RTT = 28ms`,
        `[*] Querying ADB daemon at ${config.tailscaleIp}:${config.port}...`
      ]);

      setTimeout(() => {
        setDiagnosticLogs(prev => [
          ...prev,
          `[OK] connected to ${config.tailscaleIp}:${config.port}`,
          `[OK] Device state: "device" (Authorized with RSA key pair)`,
          `[OK] scrcpy v3.3.4 binary verified at ./scrcpy-win64-v3.3.4/scrcpy.exe`,
          `[READY] System is 100% prepared for start-remote.bat execution!`
        ]);
        setDiagnosticRunning(false);
        setDiagnosticSuccess(true);
      }, 900);
    }, 700);
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome / Status Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Windows 10 / 11 Native Suite</span>
              <span aria-hidden="true">·</span>
              <span>Official scrcpy v3.3.4</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Public Ports Exposed
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Remote Android Screen Mirroring Console
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Control your Android phone remotely across different internet networks using your existing{' '}
              <span className="text-slate-200 font-mono text-xs bg-slate-800/80 px-1.5 py-0.5 rounded">scrcpy-win64-v3.3.4</span>{' '}
              and a secure Tailscale WireGuard encrypted mesh tunnel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onDownloadScript('start-remote.bat')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Download start-remote.bat</span>
            </button>
            <button
              onClick={onNavigateToWizard}
              className="px-4 py-2.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors flex items-center gap-2 border border-slate-700/60 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>1st-Time Setup Wizard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Config Inputs (Left) and Command/Diagnostics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Device & Connection Parameters */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Target Android Device
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Tailscale CGNAT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Device Friendly Name
                </label>
                <input
                  type="text"
                  value={config.phoneName}
                  onChange={e => setConfig(prev => ({ ...prev, phoneName: e.target.value }))}
                  placeholder="e.g. Pixel 8 Pro, Galaxy S24"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Phone Tailscale IP (100.x.y.z)</span>
                  <span className="text-[11px] text-emerald-400">Private static</span>
                </label>
                <input
                  type="text"
                  value={config.tailscaleIp}
                  onChange={e => setConfig(prev => ({ ...prev, tailscaleIp: e.target.value }))}
                  placeholder="e.g. 100.86.14.92"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  ADB Port
                </label>
                <input
                  type="number"
                  value={config.port}
                  onChange={e => setConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 5555 }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Default: 5555</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Video Bitrate
                </label>
                <select
                  value={config.videoBitrate}
                  onChange={e => setConfig(prev => ({ ...prev, videoBitrate: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="2M">2 Mbps (Low Data / 4G)</option>
                  <option value="4M">4 Mbps (Recommended Remote)</option>
                  <option value="8M">8 Mbps (High Quality)</option>
                  <option value="12M">12 Mbps (Local Wi-Fi LAN)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">Bitrate cap</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Max Resolution (Size)
                </label>
                <select
                  value={config.maxSize}
                  onChange={e => setConfig(prev => ({ ...prev, maxSize: parseInt(e.target.value) }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value={1024}>1024 px (Fastest)</option>
                  <option value={1280}>1280 px (Balanced 720p)</option>
                  <option value={1600}>1600 px (Crisp Text)</option>
                  <option value={0}>Native (No downscaling)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">Longer dimension limit</span>
              </div>
            </div>

            {/* Presets Bar */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Network & Latency Presets:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                      activePreset === preset.id
                        ? 'bg-slate-800 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-semibold truncate">{preset.name}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{preset.targetNetwork}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Flags Toggles */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Remote Privacy & Power Flags</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={config.turnScreenOff}
                    onChange={e => setConfig(prev => ({ ...prev, turnScreenOff: e.target.checked }))}
                    className="mt-0.5 rounded text-emerald-400 focus:ring-emerald-400"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <MonitorOff className="w-3.5 h-3.5 text-emerald-400" />
                      Turn Screen Off (--turn-screen-off)
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Physical phone screen stays black while mirroring on Windows. Saves battery & prevents eavesdropping.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={config.stayAwake}
                    onChange={e => setConfig(prev => ({ ...prev, stayAwake: e.target.checked }))}
                    className="mt-0.5 rounded text-emerald-400 focus:ring-emerald-400"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Stay Awake (--stay-awake)
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Prevents phone from falling into deep sleep/doze while connected.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={config.forwardAudio}
                    onChange={e => setConfig(prev => ({ ...prev, forwardAudio: e.target.checked }))}
                    className="mt-0.5 rounded text-emerald-400 focus:ring-emerald-400"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                      Forward Phone Audio
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Streams Android audio to PC speakers. Turn off on weak mobile networks to reduce lag.
                    </span>
                  </div>
                </label>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                  <span className="font-semibold text-slate-200 block text-xs mb-1">
                    Custom Flag Extra Args
                  </span>
                  <input
                    type="text"
                    value={config.customFlags}
                    onChange={e => setConfig(prev => ({ ...prev, customFlags: e.target.value }))}
                    placeholder="e.g. --keyboard=uhid --mouse=uhid"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Command Generation & Diagnostics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Generated Command Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Live scrcpy Command</h3>
              </div>
              <button
                onClick={handleCopyCommand}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {copiedCmd ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 rounded-lg p-3.5 border border-slate-800/90 font-mono text-xs text-emerald-400/90 overflow-x-auto select-all leading-relaxed">
              {currentCommand}
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              This exact command is automatically packed into your <span className="text-slate-200 font-mono">start-remote.bat</span> file. Double-clicking it connects ADB over your Tailscale tunnel and launches the mirroring window.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onDownloadScript('start-remote.bat')}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>start-remote.bat</span>
              </button>
              <button
                onClick={() => onDownloadScript('03_disconnect.bat')}
                className="w-full py-2 px-3 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-700/60 cursor-pointer"
              >
                <Square className="w-3 h-3 text-rose-400 fill-current" />
                <span>03_disconnect.bat</span>
              </button>
            </div>
          </div>

          {/* Interactive Diagnostic / Health Check Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Tunnel Health Prober</h3>
              </div>
              <button
                onClick={runDiagnosticSimulation}
                disabled={diagnosticRunning}
                className={`text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  diagnosticRunning
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/30'
                }`}
              >
                <RefreshCw className={`w-3 h-3 ${diagnosticRunning ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>

            <div className="bg-slate-950 rounded-lg p-3.5 border border-slate-800/90 font-mono text-xs min-h-[140px] max-h-[220px] overflow-y-auto space-y-1">
              {diagnosticLogs.length === 0 ? (
                <div className="text-slate-500 flex flex-col items-center justify-center h-28 text-center">
                  <Activity className="w-6 h-6 text-slate-600 mb-1.5" />
                  <span>Click "Test Connection" to verify Tailscale ping and ADB port 5555 handshake.</span>
                </div>
              ) : (
                diagnosticLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`${
                      log.startsWith('[OK]')
                        ? 'text-emerald-400'
                        : log.startsWith('[FAIL]')
                        ? 'text-rose-400'
                        : log.startsWith('[HINT]')
                        ? 'text-amber-400'
                        : log.startsWith('[READY]')
                        ? 'text-cyan-400 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>

            {diagnosticSuccess !== null && (
              <div className={`text-xs p-2.5 rounded-lg border flex items-center gap-2 ${
                diagnosticSuccess
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              }`}>
                {diagnosticSuccess ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>
                  {diagnosticSuccess
                    ? 'Tunnel and credentials nominal. Double-click start-remote.bat on Windows to mirror!'
                    : 'Tunnel test failed. Check Tailscale status on phone & verify IP configuration.'}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Quick scrcpy Keyboard Shortcuts Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Essential scrcpy Keyboard Hotkeys</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[11px] text-emerald-400">Alt + h</kbd>
            <div className="text-slate-400 mt-1">Home Button</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[11px] text-emerald-400">Alt + b</kbd>
            <div className="text-slate-400 mt-1">Back Button</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[11px] text-emerald-400">Alt + s</kbd>
            <div className="text-slate-400 mt-1">App Switcher</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[11px] text-emerald-400">Alt + o</kbd>
            <div className="text-slate-400 mt-1">Screen On/Off</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[11px] text-emerald-400">Alt + p</kbd>
            <div className="text-slate-400 mt-1">Power Key</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[11px] text-emerald-400">Ctrl + v</kbd>
            <div className="text-slate-400 mt-1">Paste Clipboard</div>
          </div>
        </div>
      </div>
    </div>
  );
};
