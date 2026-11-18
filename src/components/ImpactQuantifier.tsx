import React, { useState } from 'react';
import {
  BarChart3,
  TrendingDown,
  Cigarette,
  HeartPulse,
  Leaf,
  ArrowRight,
} from 'lucide-react';
import { ImpactEngineResult } from '../types/smog';

interface ImpactQuantifierProps {
  impact: ImpactEngineResult;
}

export const ImpactQuantifier: React.FC<ImpactQuantifierProps> = ({ impact }) => {
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1); // 1 household, 50 households (apartment), 300 (neighborhood)

  return (
    <section aria-labelledby="impact-heading" className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              <span id="impact-heading">Module D: Sustainable Alternatives & Impact Quantifier</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Emissions Averted & Cardiovascular Health Benefit Modeling
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Replacing dirty heating and solo fossil commutes directly averts alveolar toxic deposition and regional greenhouse emissions.
            </p>
          </div>

          {/* Scale Multiplier Slider (Household to Society level) */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span className="font-semibold text-slate-400 uppercase text-[10px]">Model Scope:</span>
              <span className="font-bold text-emerald-400 font-mono">
                {scaleMultiplier === 1
                  ? 'Single Household'
                  : scaleMultiplier === 50
                  ? 'Apartment Society (50 Homes)'
                  : 'Neighborhood (300 Homes)'}
              </span>
            </div>
            <div
              role="group"
              aria-label="Community scale multiplier"
              className="flex gap-1.5"
            >
              {[1, 50, 300].map((num) => (
                <button
                  key={num}
                  type="button"
                  aria-pressed={scaleMultiplier === num}
                  onClick={() => setScaleMultiplier(num)}
                  aria-label={`Scale model to ${num === 1 ? '1 household' : `${num} households`}`}
                  className={`text-xs px-2.5 py-1 rounded font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    scaleMultiplier === num
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {num === 1 ? '1x' : `${num}x`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quantified Impact Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Daily PM2.5 Averted */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>Daily PM2.5 Averted</span>
            </span>
            <div className="my-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {(impact.totalDailyPmAvertedGrams * scaleMultiplier).toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">grams/day</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Micro-particulate load kept out of neighborhood air
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300">
              ≈ {((impact.totalDailyPmAvertedGrams * scaleMultiplier * 30) / 1000).toFixed(1)} kg/month
            </span>
          </div>

          {/* Monthly CO2e Averted */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Leaf className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
              <span>Monthly CO2e Averted</span>
            </span>
            <div className="my-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                  {(impact.totalMonthlyCo2eAvertedKg * scaleMultiplier).toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">kg CO2e</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Climate mitigation from clean heating & EV/transit
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300">
              ≈ {((impact.totalMonthlyCo2eAvertedKg * scaleMultiplier * 12) / 1000).toFixed(1)} tons/year
            </span>
          </div>

          {/* Cigarettes Equivalent Averted */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Cigarette className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Cigarettes Averted</span>
            </span>
            <div className="my-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {(impact.equivalentCigarettesAvertedMonthly * scaleMultiplier).toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">cigs/month</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Based on Berkeley Earth PM2.5 inhalation equivalence
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-300">
              ~{Math.round((impact.equivalentCigarettesAvertedMonthly * scaleMultiplier) / 30)} cigs/day saved
            </span>
          </div>

          {/* Health Risk Drop */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
              <span>Pulmonary Risk Drop</span>
            </span>
            <div className="my-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                  -{impact.annualHealthRiskDropPct}%
                </span>
                <span className="text-xs text-slate-400">risk reduction</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Acute respiratory exacerbations avoided
              </span>
            </div>
            <span className="text-[10px] font-mono text-rose-300">
              Validated clinical threshold
            </span>
          </div>
        </div>
      </div>

      {/* Sustainable Habit Replacements List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
          Targeted Habit Interventions & Sustainable Replacements
        </h4>
        {impact.comparisons.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left: Comparison */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {item.estimatedCostImpact}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                    Current Polluting Habit:
                  </span>
                  <span className="text-slate-300 font-medium">{item.currentHabit}</span>
                </div>

                <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 hidden sm:block" aria-hidden="true" />

                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Sustainable Clean Alternative:
                  </span>
                  <span className="text-emerald-200 font-bold">{item.sustainableAlternative}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {item.healthBenefitSummary}
              </p>
            </div>

            {/* Right: Quantified Numbers */}
            <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4 text-right">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 block">
                  -{(item.dailyPm25AvertedGrams * scaleMultiplier).toLocaleString()}g PM2.5/day
                </span>
                <span className="text-[10px] text-slate-400">
                  -{(item.monthlyCo2eAvertedKg * scaleMultiplier).toLocaleString()} kg CO2e/mo
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
