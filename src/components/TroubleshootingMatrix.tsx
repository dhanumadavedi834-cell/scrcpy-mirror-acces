import React, { useState } from 'react';
import { TROUBLESHOOTING_TOPICS } from '../data/troubleshootingData';
import { 
  AlertCircle, 
  Search, 
  Terminal, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Wrench,
  CheckCircle2
} from 'lucide-react';

export const TroubleshootingMatrix: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(TROUBLESHOOTING_TOPICS[0].id);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const filteredTopics = TROUBLESHOOTING_TOPICS.filter(t => 
    t.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.errorSnippet && t.errorSnippet.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              Diagnostic & Recovery Matrix
            </div>
            <h2 className="text-xl font-bold text-white">Beginner-Friendly Troubleshooting Guide</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select an error message below to view the exact root cause and step-by-step fix.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search error message..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
            No matching issues found for "{searchQuery}". Try searching for "unauthorized", "offline", "lag", or "refused".
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedId === topic.id;

            return (
              <div
                key={topic.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                  className="w-full text-left p-4.5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-semibold text-white truncate">
                        {topic.symptom}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">
                        {topic.rootCause}
                      </div>
                    </div>
                  </div>

                  <div className="text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 bg-slate-950/40">
                    {/* Error snippet if present */}
                    {topic.errorSnippet && (
                      <div>
                        <div className="text-[11px] font-mono text-slate-400 mb-1">Terminal Output / Error Log:</div>
                        <div className="bg-slate-950 border border-rose-950/80 p-3 rounded-lg font-mono text-xs text-rose-400/90 whitespace-pre-wrap">
                          {topic.errorSnippet}
                        </div>
                      </div>
                    )}

                    {/* Root Cause */}
                    <div>
                      <div className="text-xs font-semibold text-slate-300 mb-1">Why this happens:</div>
                      <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                        {topic.rootCause}
                      </p>
                    </div>

                    {/* Solution Steps */}
                    <div>
                      <div className="text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Step-by-Step Fix:</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {topic.solutionSteps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Diagnostic Quick Command */}
                    {topic.diagnosticCommand && (
                      <div className="pt-2">
                        <div className="text-[11px] font-mono text-slate-400 mb-1">Verification / Fix Command:</div>
                        <div className="flex items-center justify-between gap-3 bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-emerald-400">
                          <code className="truncate">{topic.diagnosticCommand}</code>
                          <button
                            onClick={() => handleCopy(topic.diagnosticCommand!)}
                            className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                            title="Copy command"
                          >
                            {copiedCmd === topic.diagnosticCommand ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
