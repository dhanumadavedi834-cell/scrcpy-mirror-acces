import React, { useState } from 'react';
import { ALL_SCRIPTS } from '../data/scriptsData';
import { ConnectionConfig, ScriptFile } from '../types';
import { 
  FolderTree, 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Folder, 
  Terminal, 
  FileText, 
  Settings, 
  File, 
  PackageCheck,
  ShieldAlert
} from 'lucide-react';
import JSZip from 'jszip';

interface ScriptDownloaderProps {
  config: ConnectionConfig;
}

export const ScriptDownloader: React.FC<ScriptDownloaderProps> = ({ config }) => {
  const [selectedFile, setSelectedFile] = useState<ScriptFile>(ALL_SCRIPTS[0]);
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);

  const activeContent = selectedFile.content(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = (file: ScriptFile) => {
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
  };

  const handleDownloadFullZip = async () => {
    try {
      setZipping(true);
      const zip = new JSZip();
      
      // Root folder inside zip
      const root = zip.folder('Remote-scrcpy-Suite');
      if (!root) return;

      // Add scripts and config
      ALL_SCRIPTS.forEach(file => {
        const text = file.content(config);
        root.file(file.path, text);
      });

      // Add a placeholder notice in scrcpy folder
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
      link.download = `Remote-scrcpy-Suite-${config.phoneName.replace(/\s+/g, '_')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP package', err);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Full ZIP Downloader */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <PackageCheck className="w-4 h-4" />
            <span>Complete Windows Solution Package</span>
          </div>
          <h2 className="text-xl font-bold text-white">Production Scripts & Configurations</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Every file is pre-configured with your Tailscale IP ({config.tailscaleIp || '100.x.y.z'}) and tuned for scrcpy v3.3.4. Download individual scripts or the complete bundled suite.
          </p>
        </div>

        <button
          onClick={handleDownloadFullZip}
          disabled={zipping}
          className="px-5 py-3 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className={`w-4 h-4 ${zipping ? 'animate-bounce' : ''}`} />
          <span>{zipping ? 'Generating ZIP...' : 'Download Full Package (.ZIP)'}</span>
        </button>
      </div>

      {/* Main Explorer Layout: Left Tree + Right Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual File & Directory Explorer */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
            <span>Project Folder Architecture</span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            {/* Root folder entry */}
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold px-2 py-1">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span>Remote-scrcpy-Suite/</span>
            </div>

            {/* Existing scrcpy archive directory (reference) */}
            <div className="ml-4 pl-2 border-l border-slate-800 space-y-1 py-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Folder className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400">scrcpy-win64-v3.3.4/</span>
                <span className="text-[10px] text-slate-500 font-sans italic">(existing)</span>
              </div>
              <div className="ml-5 text-[11px] text-slate-500 space-y-0.5">
                <div>├── adb.exe</div>
                <div>├── scrcpy.exe</div>
                <div>├── scrcpy-server</div>
                <div>└── *.dll (SDL2, avcodec, etc.)</div>
              </div>
            </div>

            {/* Dynamic deliverables */}
            <div className="ml-4 pl-2 border-l border-slate-800 space-y-1">
              <div className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider pt-2 pb-1">
                Generated Solution Files:
              </div>

              {ALL_SCRIPTS.map(file => {
                const isSelected = selectedFile.filename === file.filename;
                return (
                  <button
                    key={file.filename}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                        : 'text-slate-300 hover:bg-slate-950 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {file.type === 'bat' ? (
                        <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : file.type === 'ps1' ? (
                        <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      ) : file.type === 'ini' ? (
                        <Settings className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      )}
                      <span className="truncate">{file.path}</span>
                    </div>

                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-sans uppercase ${
                      file.category === 'core'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : file.category === 'setup'
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : file.category === 'maintenance'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {file.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Code Viewer & Quick Actions */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          {/* Code Viewer Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white">{selectedFile.path}</span>
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                  {selectedFile.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedFile.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDownloadSingle(selectedFile)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save File</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto min-h-[460px] max-h-[620px] select-all leading-relaxed">
            <pre className="whitespace-pre">{activeContent}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
