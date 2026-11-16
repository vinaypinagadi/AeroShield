import React, { useState } from 'react';
import {
  BarChart3,
  TrendingDown,
  Cigarette,
  DollarSign,
  HeartPulse,
  Leaf,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ImpactEngineResult } from '../types/smog';

interface ImpactQuantifierProps {
  impact: ImpactEngineResult;
}

export const ImpactQuantifier: React.FC<ImpactQuantifierProps> = ({ impact }) => {
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1); // 1 household, 50 households (apartment), 500 (neighborhood)

  return (
    <section aria-labelledby="impact-heading" className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
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
            <div className="flex gap-1.5">
              {[1, 50, 300].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setScaleMultiplier(num)}
                  className={`text-xs px-2.5 py-1 rounded font-semibold transition-all ${
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
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
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
              ≈ {(impact.totalDailyPmAvertedGrams * scaleMultiplier * 30 / 1000).toFixed(1)} kg/month
            </span>
          </div>

          {/* Monthly CO2e Averted */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Leaf className="w-3.5 h-3.5 text-cyan-400" />
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
                Direct greenhouse mitigation
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300">
              ≈ {((impact.totalMonthlyCo2eAvertedKg * scaleMultiplier * 12) / 1000).toFixed(1)} metric tons/yr
            </span>
          </div>

          {/* Toxic Cigarette Equivalence Averted */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Cigarette className="w-3.5 h-3.5 text-rose-400" />
              <span>Cigarettes Averted</span>
            </span>
            <div className="my-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                  ~{(impact.equivalentCigarettesAvertedMonthly * scaleMultiplier).toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">cigs/mo</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Cumulative particulate toxicity avoided
              </span>
            </div>
            <span className="text-[10px] font-mono text-rose-300">
              Protects bronchial cilia & alveolar walls
            </span>
          </div>

          {/* Annual Health Risk Drop */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-amber-400" />
              <span>Pulmonary Risk Drop</span>
            </span>
            <div className="my-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  -{impact.annualHealthRiskDropPct}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Decrease in acute respiratory symptoms & ER risk
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-300">
              Epidemiologically calibrated
            </span>
          </div>
        </div>
      </div>

      {/* Sustainable Alternatives Comparison Cards */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Tailored Alternative Interventions</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {impact.comparisons.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded-full text-[11px] font-semibold border border-slate-700">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    -{(item.dailyPm25AvertedGrams * scaleMultiplier).toLocaleString()}g PM2.5 / day
                  </span>
                </div>

                {/* Habit Comparison */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5">
                      Conventional High-Emission Habit:
                    </span>
                    <p className="text-slate-300">{item.currentHabit}</p>
                  </div>

                  <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/30">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5 flex items-center space-x-1">
                      <ArrowRight className="w-3 h-3" />
                      <span>Sustainable Clean Alternative:</span>
                    </span>
                    <p className="text-white font-medium">{item.sustainableAlternative}</p>
                  </div>
                </div>
              </div>

              {/* Cost & Health Impact */}
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-start space-x-1.5 text-slate-300">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Economic Impact: </strong>
                    <span className="text-slate-400">{item.estimatedCostImpact}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-1.5 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-300">Health Advantage: </strong>
                    <span className="text-slate-300">{item.healthBenefitSummary}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
