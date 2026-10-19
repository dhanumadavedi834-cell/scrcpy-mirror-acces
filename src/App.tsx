import React, { useState } from 'react';
import { ConnectionConfig } from './types';
import { Header } from './components/Header';
import { ConnectionConsole } from './components/ConnectionConsole';
import { SetupWizard } from './components/SetupWizard';
import { ScriptDownloader } from './components/ScriptDownloader';
import { LimitationsExplorer } from './components/LimitationsExplorer';
import { TroubleshootingMatrix } from './components/TroubleshootingMatrix';
import { ALL_SCRIPTS } from './data/scriptsData';
import JSZip from 'jszip';
import { ShieldCheck, Download, ExternalLink, Check, Smartphone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('console');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const [config, setConfig] = useState<ConnectionConfig>({
    phoneName: 'Pixel / Galaxy Phone',
    tailscaleIp: '',
    port: 5555,
    videoBitrate: '4M',
    maxFps: 30,
    maxSize: 1280,
    turnScreenOff: true,
    stayAwake: true,
    forwardAudio: true,
    videoCodec: 'h264',
    lowLatencyBuffer: true,
    customFlags: ''
  });

  const showToast = (message: string) => {
    setDownloadToast(message);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const handleDownloadSingleFile = (filename: string) => {
    const file = ALL_SCRIPTS.find(s => s.filename === filename);
    if (!file) return;

    const text = file.content(config);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename} successfully!`);
  };

  const handleDownloadFullZip = async () => {
    try {
      showToast('Compiling Windows Remote Suite ZIP...');
      const zip = new JSZip();
      const root = zip.folder('Remote-scrcpy-Suite');
      if (!root) return;

      ALL_SCRIPTS.forEach(file => {
        const text = file.content(config);
        root.file(file.path, text);
      });

      const scrcpyDir = root.folder('scrcpy-win64-v3.3.4');
      if (scrcpyDir) {
        scrcpyDir.file('EXTRACT_YOUR_OFFICIAL_SCRCPY_HERE.txt', 
          'Extract all contents from your official "scrcpy-win64-v3.3.4.zip" directly into this directory so that adb.exe and scrcpy.exe sit here.'
        );
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Remote-scrcpy-v3.3.4-Suite.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Complete Windows Remote Suite ZIP downloaded!');
    } catch (err) {
      console.error(err);
      showToast('Error generating ZIP archive.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Contract Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadPackage={handleDownloadFullZip}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'console' && (
          <ConnectionConsole
            config={config}
            setConfig={setConfig}
            onDownloadScript={handleDownloadSingleFile}
            onNavigateToWizard={() => setActiveTab('wizard')}
          />
        )}

        {activeTab === 'wizard' && (
          <SetupWizard
            config={config}
            onDownloadScript={handleDownloadSingleFile}
            onGoToConsole={() => setActiveTab('console')}
          />
        )}

        {activeTab === 'scripts' && (
          <ScriptDownloader config={config} />
        )}

        {activeTab === 'security' && (
          <LimitationsExplorer />
        )}

        {activeTab === 'troubleshoot' && (
          <TroubleshootingMatrix />
        )}
      </main>

      {/* Notification Toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Remote scrcpy Control Suite</span>
            <span aria-hidden="true">·</span>
            <span>Targeting official scrcpy-win64-v3.3.4</span>
            <span aria-hidden="true">·</span>
            <span>Tailscale WireGuard Mesh</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('security')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Persistence Matrix
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('scripts')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Browse Scripts
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('troubleshoot')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Troubleshooting
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
