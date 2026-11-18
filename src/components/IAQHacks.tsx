import React, { useState } from 'react';
import {
  Wrench,
  Shield,
  ChevronDown,
  ChevronUp,
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
            <Wrench className="w-4 h-4" aria-hidden="true" />
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
        <div
          role="tablist"
          aria-label="IAQ Mitigation categories"
          className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto"
        >
          <button
            type="button"
            role="tab"
            id="tab-iaq-diy"
            aria-selected={activeTab === 'diy'}
            aria-controls="panel-iaq-diy"
            onClick={() => setActiveTab('diy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              activeTab === 'diy'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            DIY Purifiers
          </button>
          <button
            type="button"
            role="tab"
            id="tab-iaq-rooms"
            aria-selected={activeTab === 'rooms'}
            aria-controls="panel-iaq-rooms"
            onClick={() => setActiveTab('rooms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              activeTab === 'rooms'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Room Audits
          </button>
          <button
            type="button"
            role="tab"
            id="tab-iaq-plants"
            aria-selected={activeTab === 'plants'}
            aria-controls="panel-iaq-plants"
            onClick={() => setActiveTab('plants')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              activeTab === 'plants'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Botanical Filters
          </button>
          <button
            type="button"
            role="tab"
            id="tab-iaq-protocols"
            aria-selected={activeTab === 'protocols'}
            aria-controls="panel-iaq-protocols"
            onClick={() => setActiveTab('protocols')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
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
        <div
          role="tabpanel"
          id="panel-iaq-diy"
          aria-labelledby="tab-iaq-diy"
          className="space-y-4 focus:outline-none"
        >
          {iaq.diyHacks.map((hack) => {
            const isExpanded = expandedHackId === hack.id;
            return (
              <div
                key={hack.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
              >
                {/* Hack Header Card */}
                <button
                  type="button"
                  onClick={() => setExpandedHackId(isExpanded ? null : hack.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`hack-details-${hack.id}`}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl shrink-0">
                      <Wind className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {hack.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {hack.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 max-w-xl line-clamp-1">
                        {hack.scientificRationale}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-mono font-bold text-cyan-400 block">
                        {hack.pmReductionEfficiencyPct}% CADR Scrub
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {hack.estimatedCost} • ~{hack.buildTimeMinutes}m build
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-4 h-4" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Step-by-Step Blueprint */}
                {isExpanded && (
                  <div
                    id={`hack-details-${hack.id}`}
                    className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4 animate-fadeIn"
                  >
                    {/* Science Rationale & Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Efficiency Rating
                        </span>
                        <span className="text-lg font-mono font-bold text-cyan-400">
                          {hack.pmReductionEfficiencyPct}% PM2.5 Removal
                        </span>
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Estimated Material Cost
                        </span>
                        <span className="text-lg font-mono font-bold text-emerald-400">
                          {hack.estimatedCost}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Assembly Time
                        </span>
                        <span className="text-lg font-mono font-bold text-amber-400">
                          ~{hack.buildTimeMinutes} Minutes
                        </span>
                      </div>
                    </div>

                    {/* Scientific Rationale Banner */}
                    <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-cyan-200">
                      <strong className="text-cyan-300 block mb-0.5">Scientific Rationale:</strong>
                      {hack.scientificRationale}
                    </div>

                    {/* Bill of Materials */}
                    <div>
                      <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Required Materials & Hardware
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {hack.materials.map((mat, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200"
                          >
                            ✓ {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div>
                      <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Assembly Instructions
                      </h5>
                      <ol className="space-y-2 text-xs text-slate-300">
                        {hack.steps.map((step, idx) => (
                          <li
                            key={idx}
                            className="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-900/70 border border-slate-800"
                          >
                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Room-By-Room IAQ Assessment */}
      {activeTab === 'rooms' && (
        <div
          role="tabpanel"
          id="panel-iaq-rooms"
          aria-labelledby="tab-iaq-rooms"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 focus:outline-none"
        >
          {iaq.roomByRoomAssessment.map((room, idx) => {
            let riskBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            if (room.vulnerabilityLevel.toLowerCase().includes('high')) {
              riskBadgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            } else if (room.vulnerabilityLevel.toLowerCase().includes('moderate')) {
              riskBadgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            }

            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                    <span>{room.room}</span>
                  </h4>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${riskBadgeClass}`}
                  >
                    {room.vulnerabilityLevel} Risk
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Primary Infiltration Hazard
                    </span>
                    <p className="text-slate-300 font-medium">{room.mainHazardSource}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Ventilation Timing Advice
                    </span>
                    <p className="text-slate-300">{room.ventilationTimingAdvice}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      Immediate Priority Action
                    </span>
                    <p className="text-slate-200 font-semibold">{room.immediateAction}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Botanical Filters */}
      {activeTab === 'plants' && (
        <div
          role="tabpanel"
          id="panel-iaq-plants"
          aria-labelledby="tab-iaq-plants"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 focus:outline-none"
        >
          {iaq.plantRecommendations.map((plant, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <Leaf className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>{plant.name}</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 italic font-serif block">
                      {plant.scientificName}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-medium">
                    {plant.maintenanceEffort} Care
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Targeted Indoor Pollutants
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {plant.targetedPollutants.map((pol, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-mono text-emerald-300"
                        >
                          {pol}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
                <strong className="text-slate-400 text-[10px] uppercase tracking-wider block">
                  Placement Recommendation
                </strong>
                <p className="mt-0.5 leading-snug">{plant.placementTip}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Critical Kitchen & Inversion Protocols */}
      {activeTab === 'protocols' && (
        <div
          role="tabpanel"
          id="panel-iaq-protocols"
          aria-labelledby="tab-iaq-protocols"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 focus:outline-none"
        >
          {/* Cooking Protocol */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <ChefHat className="w-5 h-5" aria-hidden="true" />
              <h4 className="text-sm font-bold text-white">
                Kitchen Cooking & Combustion Protocol
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {iaq.criticalCookingProtocol}
            </p>
            <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-xs text-amber-300">
              <strong>Critical Caution:</strong> In winter thermal inversions, opening kitchen windows while frying traps backdraft smoke indoors. Use ducted exhaust or boil/steam methods.
            </div>
          </div>

          {/* Window Sealing Guide */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Shield className="w-5 h-5" aria-hidden="true" />
              <h4 className="text-sm font-bold text-white">
                Thermal Inversion Window Weatherstripping
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {iaq.inversionSealingGuide}
            </p>
            <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-xs text-cyan-300">
              <strong>Envelope Sealing Rationale:</strong> Cold air density differential draws outdoor toxic particulates inward through perimeter sash cracks. Removable foam weatherstripping drops infiltration by up to 55%.
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
