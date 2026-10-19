import React from 'react';
import { PERSISTENCE_MATRIX, OS_BEHAVIOR_SCENARIOS } from '../data/limitationsData';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Wifi, 
  RotateCw, 
  BatteryCharging, 
  EyeOff,
  HelpCircle,
  FileKey
} from 'lucide-react';

export const LimitationsExplorer: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Android OS Security & Boundary Reality</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          What Genuinely Persists vs What Android Resets
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          As security engineers, we provide complete technical transparency. Android OS enforces strict hardware and kernel-level boundaries. Below is an authoritative breakdown of what stays permanently configured versus what requires unlocking or physical touch.
        </p>
      </div>

      {/* Real-World Scenarios Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Real-World Operational Scenarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OS_BEHAVIOR_SCENARIOS.map((sc, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{sc.title}</h4>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                  sc.badgeColor === 'emerald'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : sc.badgeColor === 'amber'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                }`}>
                  {sc.status}
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-200">OS Event: </span>
                {sc.whatHappens}
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-400">Resolution / Behavior: </span>
                  {sc.solution}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Persistence Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Full Feature Persistence Matrix</h3>
          </div>
          <span className="text-xs text-slate-400">Evaluated on Android 11 through Android 15</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Feature / Mechanism</th>
                <th className="py-3 px-4 text-center">Survives Reboot?</th>
                <th className="py-3 px-4 text-center">Physical Unlock Needed?</th>
                <th className="py-3 px-4">Technical Operating Detail</th>
                <th className="py-3 px-4">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {PERSISTENCE_MATRIX.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                    {item.feature}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {item.persistsAcrossReboot ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Yes (Permanent)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded">
                        <XCircle className="w-3.5 h-3.5" />
                        Resets on Reboot
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {item.requiresPhysicalAccess ? (
                      <span className="text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">
                        Yes
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                        No (Remote)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-sm leading-relaxed">
                    {item.behaviorDetails}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300/90 font-medium max-w-xs leading-relaxed">
                    {item.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Architectural Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <FileKey className="w-4 h-4 text-emerald-400" />
            <h4>Why Does Android Reset Port 5555 on Reboot?</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            In Android's Linux user-space, the ADB daemon (<code className="text-slate-200">adbd</code>) reads the system property <code className="text-slate-200">service.adb.tcp.port</code>. When you run <code className="text-slate-200">adb tcpip 5555</code> over USB, this property is written into volatile memory. 
            When Android shuts down, Android OS security purposely wipes this volatile property and returns to <code className="text-slate-200">-1</code> (USB-only). This is a core Android security policy designed to ensure that if a stolen phone is rebooted, unauthorized Wi-Fi debugging cannot be silently active.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <EyeOff className="w-4 h-4 text-cyan-400" />
            <h4>How Does Screen Capture Work Without Approval Prompts?</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Third-party screen recording apps must invoke Android's public <code className="text-slate-200">MediaProjectionManager</code> API, which displays a mandatory system security prompt ("Allow Screen Recording?"). 
            However, <span className="text-slate-200 font-semibold">scrcpy</span> executes its server component (<code className="text-slate-200">scrcpy-server.jar</code>) under the special <code className="text-slate-200">shell (UID 2000)</code> context via ADB. The shell user holds the privileged <code className="text-slate-200">PROJECT_MEDIA</code> permission, allowing it to directly create a virtual display encoder via private internal <code className="text-slate-200">SurfaceControl</code> APIs without any user prompt!
          </p>
        </div>
      </div>
    </div>
  );
};
