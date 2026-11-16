import React, { useState } from 'react';
import {
  Wrench,
  Sparkles,
  Shield,
  Clock,
  DollarSign,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Leaf,
  Layers,
  ChefHat,
  Wind,
} from 'lucide-react';
import { IAQEngineResult } from '../types/smog';

interface IAQHacksProps {
  iaq: IAQEngineResult;
}

export const IAQHacks: React.FC<IAQHacksProps> = ({ iaq }) => {
  const [activeTab, setActiveTab] = useState<'diy' | 'rooms' | 'plants' | 'protocols'>('diy');
  const [expandedHackId, setExpandedHackId] = useState<string | null>(
    iaq.diyHacks[0]?.id || null
  );

  return (
    <section aria-labelledby="iaq-heading" className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            <span id="iaq-heading">Module C: Indoor Air Quality (IAQ) & DIY Mitigation Hacks</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Clean Air Haven & DIY Particulate Mitigation Vault
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Engineered low-cost filtration, building envelope isolation, and room-specific ventilation management.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('diy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'diy'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            DIY Purifiers
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'rooms'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Room Audits
          </button>
          <button
            onClick={() => setActiveTab('plants')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'plants'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Botanical Filters
          </button>
          <button
            onClick={() => setActiveTab('protocols')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'protocols'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kitchen & Inversion
          </button>
        </div>
      </div>

      {/* Tab 1: DIY Purifiers (Corsi-Rosenthal Box, Window Seal, etc.) */}
      {activeTab === 'diy' && (
        <div className="space-y-4">
          {iaq.diyHacks.map((hack) => {
            const isExpanded = expandedHackId === hack.id;
            return (
              <div
                key={hack.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedHackId(isExpanded ? null : hack.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-sm sm:text-base font-bold text-white">
                        {hack.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {hack.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        {hack.pmReductionEfficiencyPct}% PM2.5 Scrub Rate
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{hack.buildTimeMinutes} mins build time</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-300 font-semibold">{hack.estimatedCost}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 space-y-4 text-xs">
                    {/* Scientific Rationale */}
                    <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-cyan-200 leading-relaxed flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-cyan-300">Aerosol Science: </strong>
                        {hack.scientificRationale}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Materials List */}
                      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                        <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5 text-[11px]">
                          <Layers className="w-3.5 h-3.5 text-amber-400" />
                          <span>Required Materials & Hardware</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {hack.materials.map((mat, i) => (
                            <li key={i} className="flex items-start space-x-2 text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              <span>{mat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Step by Step Guide */}
                      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                        <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5 text-[11px]">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Assembly & Sealing Protocol</span>
                        </h4>
                        <ol className="space-y-2">
                          {hack.steps.map((step, i) => (
                            <li key={i} className="flex items-start space-x-2 text-slate-300">
                              <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Room by Room IAQ Assessment */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {iaq.roomByRoomAssessment.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{item.room}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.vulnerabilityLevel === 'Severe'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : item.vulnerabilityLevel === 'High'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {item.vulnerabilityLevel} Risk
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Main Hazard Source
                    </span>
                    <p className="text-slate-300">{item.mainHazardSource}</p>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Ventilation Advice
                    </span>
                    <p className="text-slate-300">{item.ventilationTimingAdvice}</p>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-slate-200">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5 flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Immediate Action</span>
                </span>
                <p className="text-emerald-100 font-medium">{item.immediateAction}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Air Purifying Plants */}
      {activeTab === 'plants' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">NASA Clean Air Study Guidance:</strong> While indoor plants provide modest VOC reduction (formaldehyde, benzene) and natural transpirational humidification to ease smog-parched respiratory mucous membranes, mechanical HEPA/MERV-13 filtration is still strictly mandatory for high particulate PM2.5 removal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {iaq.plantRecommendations.map((plant, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                        <Leaf className="w-4 h-4 text-emerald-400" />
                        <span>{plant.name}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 italic font-mono mt-0.5">
                        {plant.scientificName}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-bold">
                      {plant.maintenanceEffort} Care
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Targeted Toxins
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {plant.targetedPollutants.map((tox, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-950 text-cyan-300 border border-slate-800 rounded-full text-[10px]"
                        >
                          {tox}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
                  <strong className="text-emerald-400">Placement Tip: </strong>
                  {plant.placementTip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Kitchen Protocols & Inversion Sealing */}
      {activeTab === 'protocols' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ChefHat className="w-4 h-4" />
              <span>Critical Kitchen Emission Protocol</span>
            </div>
            <h4 className="text-base font-bold text-white">
              Preventing Ultrafine Spike from Culinary Combustion
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {iaq.criticalCookingProtocol}
            </p>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="font-semibold text-white">Three Golden Kitchen Rules:</div>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>Ignite exhaust 1 minute before turning on the burner.</li>
                <li>Cook with lids tightly on to reduce energy consumption and oil aerosolization.</li>
                <li>Isolate living quarters by keeping kitchen door latched during and 15 mins after cooking.</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Wind className="w-4 h-4" />
              <span>Winter Inversion Sealing Guide</span>
            </div>
            <h4 className="text-base font-bold text-white">
              Stop Cold-Air Stack Effect Envelope Leaks
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {iaq.inversionSealingGuide}
            </p>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="font-semibold text-white">Perimeter Sealing Checklist:</div>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>Install dense foam weatherstripping tape along sliding window tracks.</li>
                <li>Slide twin-cylinder draft excluders under front doors.</li>
                <li>Close exhaust damper flap when hood or exhaust fan is not actively running.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
