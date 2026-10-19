import React, { useState } from 'react';
import { SETUP_PHASES } from '../data/guideData';
import { ConnectionConfig } from '../types';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  Check, 
  AlertTriangle, 
  Lightbulb, 
  Terminal, 
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';

interface SetupWizardProps {
  config: ConnectionConfig;
  onDownloadScript: (filename: string) => void;
  onGoToConsole: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({
  config,
  onDownloadScript,
  onGoToConsole
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentPhase = SETUP_PHASES[currentPhaseIndex];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const markPhaseComplete = (phaseId: number) => {
    if (!completedPhases.includes(phaseId)) {
      setCompletedPhases([...completedPhases, phaseId]);
    }
    if (currentPhaseIndex < SETUP_PHASES.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wizard Header & Progress Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              Setup & Pairing Protocol
            </div>
            <h2 className="text-xl font-bold text-white">
              Step-by-Step Remote Android Access Wizard
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Follow these 4 phases once. After Phase 3 is completed, no USB cable is ever required again.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>Overall Progress:</span>
            <span className="font-semibold text-emerald-400">
              {completedPhases.length} of {SETUP_PHASES.length} Phases Done
            </span>
          </div>
        </div>

        {/* Phase Timeline Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SETUP_PHASES.map((phase, idx) => {
            const isCurrent = idx === currentPhaseIndex;
            const isDone = completedPhases.includes(phase.id);

            return (
              <button
                key={phase.id}
                onClick={() => setCurrentPhaseIndex(idx)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'bg-slate-800 border-emerald-500 shadow-sm'
                    : isDone
                    ? 'bg-slate-950/80 border-slate-700/60 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                    isCurrent ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    Phase {phase.id}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] text-slate-500">{phase.timeEstimate}</span>
                  )}
                </div>
                <div className="text-xs font-bold text-white truncate">{phase.title}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{phase.tagline}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Phase Content Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Phase {currentPhase.id}
              </span>
              <h3 className="text-lg font-bold text-white">{currentPhase.title}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">{currentPhase.tagline}</p>
          </div>

          <div className="flex items-center gap-2">
            {currentPhase.id === 3 && (
              <button
                onClick={() => onDownloadScript('01_initial_usb_setup.bat')}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Get 01_initial_usb_setup.bat</span>
              </button>
            )}
            {currentPhase.id === 4 && (
              <button
                onClick={() => onDownloadScript('start-remote.bat')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get start-remote.bat</span>
              </button>
            )}
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {currentPhase.steps.map((step, sIdx) => (
            <div key={sIdx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  {sIdx + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>

                  {/* Terminal Code Snippet if applicable */}
                  {step.code && (
                    <div className="relative group bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-400">
                      <pre className="overflow-x-auto whitespace-pre-wrap">{step.code}</pre>
                      <button
                        onClick={() => handleCopy(step.code!)}
                        className="absolute right-2 top-2 p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy code snippet"
                      >
                        {copiedCode === step.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Helpful Tip Box */}
                  {step.tip && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-[11px] text-emerald-300 leading-relaxed">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step.tip}</span>
                    </div>
                  )}

                  {/* Warning Box */}
                  {step.warning && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-300 leading-relaxed">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{step.warning}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wizard Bottom Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentPhaseIndex(Math.max(0, currentPhaseIndex - 1))}
            disabled={currentPhaseIndex === 0}
            className={`px-4 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 border transition-colors cursor-pointer ${
              currentPhaseIndex === 0
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Phase</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => markPhaseComplete(currentPhase.id)}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Phase {currentPhase.id} Complete</span>
            </button>

            {currentPhaseIndex < SETUP_PHASES.length - 1 ? (
              <button
                onClick={() => setCurrentPhaseIndex(currentPhaseIndex + 1)}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Next Phase</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onGoToConsole}
                className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Launch in Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
