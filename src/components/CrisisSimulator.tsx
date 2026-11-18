import React, { useState } from 'react';
import {
  AlertOctagon,
  Copy,
  Check,
  Building,
  GraduationCap,
  Home,
  Briefcase,
  Flame,
  ZapOff,
  Wind,
  ShieldAlert,
  Radio,
} from 'lucide-react';
import { CommunityPlaybookItem, CrisisEngineResult, CrisisScenario } from '../types/smog';

interface CrisisSimulatorProps {
  crisis: CrisisEngineResult;
}

export const CrisisSimulator: React.FC<CrisisSimulatorProps> = ({ crisis }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    crisis.crisisScenarios[0]?.id || ''
  );
  const [copiedAlert, setCopiedAlert] = useState<boolean>(false);

  const activeScenario: CrisisScenario | undefined =
    crisis.crisisScenarios.find((s) => s.id === selectedScenarioId) ||
    crisis.crisisScenarios[0];

  const handleCopyAlert = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 2000);
  };

  const getAudienceIcon = (aud: CommunityPlaybookItem['targetAudience']) => {
    switch (aud) {
      case 'Schools':
        return <GraduationCap className="w-4 h-4 text-amber-400" aria-hidden="true" />;
      case 'Apartment Complexes':
        return <Building className="w-4 h-4 text-cyan-400" aria-hidden="true" />;
      case 'Neighborhoods':
        return <Home className="w-4 h-4 text-emerald-400" aria-hidden="true" />;
      case 'Workplaces':
        return <Briefcase className="w-4 h-4 text-purple-400" aria-hidden="true" />;
    }
  };

  return (
    <section aria-labelledby="crisis-heading" className="space-y-6">
      {/* Title & Interactive "What-If" Crisis Simulator Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <AlertOctagon className="w-4 h-4" aria-hidden="true" />
            <span id="crisis-heading">Module E: Crisis Simulator & Community Co-Pilot</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            &quot;What-If&quot; Smog Crisis Simulator
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Test and adapt household & civic resilience under sudden emergency triggers: agricultural burning surges, power outages, and persistent thermal inversions.
          </p>
        </div>

        {/* Scenario Selection Chips */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Crisis Scenario to Simulate:
          </label>
          <div
            role="radiogroup"
            aria-label="Select Crisis Scenario to Simulate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
          >
            {crisis.crisisScenarios.map((sc) => {
              const isSelected = selectedScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 text-white ring-1 ring-rose-500/50'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
                    {sc.id.includes('outage') ? (
                      <ZapOff className="w-4 h-4" aria-hidden="true" />
                    ) : sc.id.includes('stubble') ? (
                      <Flame className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Wind className="w-4 h-4" aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-white">
                        {sc.scenarioName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-rose-400 font-bold block mt-0.5">
                      AQI Spike: {sc.aqiSpike}+
                    </span>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                      {sc.triggerDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Scenario Simulation Playbook */}
        {activeScenario && (
          <div className="p-5 bg-gradient-to-r from-rose-950/30 via-slate-950 to-slate-950 border border-rose-500/30 rounded-2xl space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                  Emergency Simulation Active
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                  {activeScenario.scenarioName}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  <strong>Trigger:</strong> {activeScenario.triggerDesc}
                </p>
              </div>

              <div className="px-3.5 py-1.5 bg-rose-950 border border-rose-600/50 rounded-xl text-center shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Simulated Peak AQI
                </span>
                <span className="text-xl font-mono font-black text-rose-400">
                  {activeScenario.aqiSpike}+
                </span>
              </div>
            </div>

            {/* Emergency Action Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Urgent Protocols */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
                  <span>Immediate Life-Safety Protocols</span>
                </h5>
                <ul className="space-y-2 text-xs text-slate-300">
                  {activeScenario.urgentProtocols.map((protocol, i) => (
                    <li
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        !
                      </span>
                      <span>{protocol}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Family Directive & Community Broadcast SMS */}
              <div className="space-y-3 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Family / Resident Directive
                  </h5>
                  <p className="text-xs text-slate-200 bg-slate-900 border border-slate-800 p-3 rounded-xl leading-relaxed">
                    {activeScenario.emergencyFamilyGuideline}
                  </p>
                </div>

                {/* Broadcast-Ready SMS / WhatsApp Template */}
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1">
                      <Radio className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                      <span>Ready-to-Send Community Alert (WhatsApp/SMS)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAlert(activeScenario.communityAlertMessage)}
                      aria-label="Copy emergency alert to clipboard"
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center space-x-1 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      {copiedAlert ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" aria-hidden="true" />
                          <span>Copy Alert</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed select-all">
                    {activeScenario.communityAlertMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Community Action Playbook Sections */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
          Civic & Institutional Mitigation Protocols
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crisis.communityPlaybook.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      {getAudienceIcon(item.targetAudience)}
                    </div>
                    <h5 className="text-sm font-bold text-white">
                      {item.targetAudience}
                    </h5>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                    Trigger: {item.triggerCondition}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    Mandatory Action Protocols
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {item.immediateActionProtocol.map((act, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-emerald-400 font-bold">›</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800 text-xs">
                <strong className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Institutional Resilience Step
                </strong>
                <p className="text-slate-300 mt-0.5 leading-snug">
                  {item.longTermResilienceStep}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
