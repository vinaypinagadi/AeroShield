import React from 'react';
import {
  AlertTriangle,
  Flame,
  Wind,
  ShieldCheck,
  Cigarette,
  Clock,
  ThermometerSnowflake,
  ChevronRight,
} from 'lucide-react';
import { DeterministicExposureAnalysis, SmogContextInput } from '../types/smog';
import {
  getAQIColorClasses,
  getAQITier,
  getAQITierLabel,
  calculateEquivalentCigarettes,
} from '../utils/smogLogic';

interface ExposureHeaderProps {
  context: SmogContextInput;
  analysis: DeterministicExposureAnalysis;
  onExploreVentilation: () => void;
}

export const ExposureHeader: React.FC<ExposureHeaderProps> = ({
  context,
  analysis,
  onExploreVentilation,
}) => {
  const tier = getAQITier(context.currentAQI);
  const tierLabel = getAQITierLabel(tier);
  const colorClasses = getAQIColorClasses(context.currentAQI);
  const equivCigarettes = calculateEquivalentCigarettes(
    analysis.estimatedPm25InhaledMicrogramsPerDay
  );

  return (
    <section
      aria-label="Exposure and Health Risk Summary"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm"
    >
      {/* Background ambient glow according to AQI severity */}
      <div
        aria-hidden="true"
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none ${
          context.currentAQI >= 400
            ? 'bg-red-600'
            : context.currentAQI >= 300
            ? 'bg-purple-600'
            : context.currentAQI >= 200
            ? 'bg-rose-500'
            : 'bg-amber-500'
        }`}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: AQI & Location Badge */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
              <span>{context.cityName || 'Target Micro-Environment'}</span>
              <span>•</span>
              <span className="capitalize">{context.proximityHazard.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex items-baseline space-x-3">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono">
                {context.currentAQI}
              </span>
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                  Air Quality Index
                </span>
                <span
                  className={`inline-block px-2.5 py-0.5 mt-1 rounded-full text-xs font-bold ${colorClasses.badge}`}
                >
                  {tierLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Thermal Inversion Status */}
          {context.hasThermalInversion ? (
            <div className="flex items-center space-x-2 px-3 py-2 bg-slate-950/60 border border-red-500/30 rounded-xl text-xs text-red-300">
              <ThermometerSnowflake className="w-4 h-4 text-red-400 flex-shrink-0 animate-pulse" aria-hidden="true" />
              <span>
                <strong>Winter Thermal Inversion Active:</strong> Ground cold pool traps particulate smoke below 150m.
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs text-slate-400">
              <Wind className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Normal atmospheric vertical mixing</span>
            </div>
          )}
        </div>

        {/* Middle Column: Health Impact & Dose Metrics */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Exposure Score */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Exposure Index
            </span>
            <div className="my-1.5">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-white font-mono">
                  {analysis.exposureScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    analysis.exposureScore >= 80
                      ? 'bg-red-500'
                      : analysis.exposureScore >= 60
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${analysis.exposureScore}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase">
              Vulnerability: <span className="text-red-400">{analysis.vulnerabilityLevel}</span>
            </span>
          </div>

          {/* Inhaled PM2.5 Micrograms */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Daily PM2.5 Dose
            </span>
            <div className="my-1.5">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-black text-white font-mono">
                  {analysis.estimatedPm25InhaledMicrogramsPerDay}
                </span>
                <span className="text-xs text-slate-400">µg</span>
              </div>
              <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">
                {analysis.baselineComparisonMultiple}x WHO Limit
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              WHO 24h cap: 15 µg/m³
            </span>
          </div>

          {/* Cigarette Toxicity Equivalence */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 col-span-2 sm:col-span-1 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Cigarette className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
              <span>Toxic Equiv.</span>
            </span>
            <div className="my-1.5">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-black text-rose-400 font-mono">
                  ~{equivCigarettes}
                </span>
                <span className="text-xs text-slate-400">cigs/day</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Particulate toxicity index
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Berkeley Earth model
            </span>
          </div>
        </div>

        {/* Right Column: Safe Ventilation Window */}
        <div className="lg:col-span-3 bg-gradient-to-br from-emerald-950/40 to-slate-950/80 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Aeration Window</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono font-semibold">
              Today
            </span>
          </div>

          {analysis.safeVentilationWindows.length > 0 ? (
            <div>
              <div className="text-xl font-black text-white font-mono mb-1">
                {analysis.safeVentilationWindows[0].startHour} - {analysis.safeVentilationWindows[0].endHour}
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                {analysis.safeVentilationWindows[0].recommendedAction}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Keep windows sealed 24 hours.</p>
          )}

          <button
            type="button"
            onClick={onExploreVentilation}
            className="w-full inline-flex items-center justify-center space-x-1 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 py-1.5 px-2.5 rounded-lg border border-emerald-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <span>View 24h Ventilation Guide</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Critical & Warning Risk Alerts Banner */}
      {analysis.riskAlerts.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
          {analysis.riskAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border text-xs gap-2 ${
                alert.severity === 'critical'
                  ? 'bg-rose-950/30 border-rose-600/40 text-rose-200'
                  : 'bg-amber-950/30 border-amber-600/40 text-amber-200'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                {alert.severity === 'critical' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <Flame className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                )}
                <div>
                  <strong className="font-bold block sm:inline mr-2">
                    {alert.title}:
                  </strong>
                  <span className="opacity-90">{alert.message}</span>
                </div>
              </div>
              <div className="sm:text-right flex items-center space-x-1.5 text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span className="text-[11px] font-medium">{alert.mitigation}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
