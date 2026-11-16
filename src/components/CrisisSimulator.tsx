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
        return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case 'Apartment Complexes':
        return <Building className="w-4 h-4 text-cyan-400" />;
      case 'Neighborhoods':
        return <Home className="w-4 h-4 text-emerald-400" />;
      case 'Workplaces':
        return <Briefcase className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <section aria-labelledby="crisis-heading" className="space-y-6">
      {/* Title & Interactive "What-If" Crisis Simulator Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <AlertOctagon className="w-4 h-4" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {crisis.crisisScenarios.map((sc) => {
              const isSelected = selectedScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 text-white ring-1 ring-rose-500/50'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
                    {sc.id.includes('outage') ? (
                      <ZapOff className="w-4 h-4" />
                    ) : sc.id.includes('stubble') ? (
                      <Flame className="w-4 h-4" />
                    ) : (
                      <Wind className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-white">
                        {sc.scenarioName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-400 block mt-0.5">
                      Simulated AQI Spike: {sc.aqiSpike}+
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Scenario Simulation Output */}
        {activeScenario && (
          <div className="bg-slate-950/80 border border-rose-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  Simulated Impact Analysis
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {activeScenario.scenarioName}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  <strong className="text-slate-400">Trigger Conditions: </strong>
                  {activeScenario.triggerDesc}
                </p>
              </div>

              <div className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-center self-start sm:self-auto shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Crisis AQI
                </span>
                <span className="text-xl font-black text-rose-400 font-mono">
                  {activeScenario.aqiSpike}+
                </span>
              </div>
            </div>

            {/* Immediate Emergency Action Protocols */}
            <div>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Immediate Emergency Family Protocols:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeScenario.urgentProtocols.map((protocol, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start space-x-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{protocol}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Family Health Guideline */}
            <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 leading-relaxed">
              <strong className="text-amber-300 block mb-0.5">
                Vulnerable Family Clinical Directive:
              </strong>
              {activeScenario.emergencyFamilyGuideline}
            </div>

            {/* Broadcastable Community Alert Message */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>Ready-to-Broadcast SMS / WhatsApp Community Alert:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyAlert(activeScenario.communityAlertMessage)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                >
                  {copiedAlert ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              </div>
              <p className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-200 select-all leading-relaxed">
                {activeScenario.communityAlertMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Community Response Playbook (Schools, Apartments, Neighborhoods) */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
            <Building className="w-4 h-4 text-cyan-400" />
            <span>Community Response Playbooks</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Standard operating procedures during severe winter smog clampdowns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crisis.communityPlaybook.map((playbook) => (
            <div
              key={playbook.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center space-x-1.5 text-sm font-bold text-white">
                    {getAudienceIcon(playbook.targetAudience)}
                    <span>{playbook.targetAudience}</span>
                  </span>
                  <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-bold">
                    Trigger: {playbook.triggerCondition}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Immediate Civic Action Protocol
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {playbook.immediateActionProtocol.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                <strong className="text-emerald-400 block mb-0.5">
                  Long-Term Resilience Step:
                </strong>
                <span className="text-slate-400">{playbook.longTermResilienceStep}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
