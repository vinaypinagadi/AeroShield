import React, { useState } from 'react';
import {
  Clock,
  Sun,
  CheckCircle2,
} from 'lucide-react';
import { SafeVentilationWindow } from '../types/smog';

interface SafeVentilationTimerProps {
  safeWindows: SafeVentilationWindow[];
  currentAQI: number;
  hasInversion: boolean;
  onClose?: () => void;
}

export const SafeVentilationTimer: React.FC<SafeVentilationTimerProps> = ({
  safeWindows,
  currentAQI,
  hasInversion,
  onClose,
}) => {
  const currentHour = new Date().getHours();
  const [selectedHour, setSelectedHour] = useState<number>(currentHour);

  // 24-hour meteorological inversion profile
  // In severe winter, morning 06:00-09:30 and evening 18:30-22:30 are peak stagnant hours
  const hourlyData = Array.from({ length: 24 }, (_, h) => {
    let risk: 'hazardous' | 'severe' | 'moderate' | 'optimal';
    let label = '';
    let estimatedAqi = currentAQI;

    if (h >= 6 && h <= 9) {
      risk = 'hazardous';
      label = 'Dawn Boundary Layer Trap';
      estimatedAqi = Math.round(currentAQI * 1.25);
    } else if (h >= 18 && h <= 22) {
      risk = 'hazardous';
      label = 'Evening Inversion & Vehicle Smoke';
      estimatedAqi = Math.round(currentAQI * 1.2);
    } else if (h >= 12 && h <= 15) {
      risk = 'optimal';
      label = 'Solar Convective Dilution Window';
      estimatedAqi = Math.max(50, Math.round(currentAQI * 0.65));
    } else if (h >= 10 && h <= 11) {
      risk = 'moderate';
      label = 'Thermal Lift Transition';
      estimatedAqi = Math.round(currentAQI * 0.85);
    } else if (h >= 16 && h <= 17) {
      risk = 'moderate';
      label = 'Sunset Cooling Transition';
      estimatedAqi = Math.round(currentAQI * 0.95);
    } else {
      risk = 'severe';
      label = 'Nighttime Cold Stagnation';
      estimatedAqi = Math.round(currentAQI * 1.1);
    }

    return { hour: h, risk, label, estimatedAqi };
  });

  const activeHourInfo = hourlyData[selectedHour];
  const primaryWindow = safeWindows[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>Atmospheric Inversion Dynamics & Hourly Ventilation Matrix</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>24-Hour Thermal Boundary Layer & Aeration Timing</span>
            {hasInversion && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                Inversion Capped
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Never open windows during morning/night inversion peaks. Ventilate only during solar convective lifts.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss ventilation timer"
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Dismiss
          </button>
        )}
      </div>

      {/* Recommended Aeration Window Highlight Card */}
      {primaryWindow && (
        <div className="p-4 bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Recommended Daily Aeration Window</span>
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                {primaryWindow.startHour} - {primaryWindow.endHour}
              </span>
              <span className="text-xs text-emerald-300 font-medium">
                (Solar Convection Lift Window)
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              {primaryWindow.reason}
            </p>
          </div>

          <div className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl shrink-0 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Max Cross-Vent Duration
            </span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              15 Minutes
            </span>
            <span className="text-[10px] text-slate-400 block">
              with purifier on turbo
            </span>
          </div>
        </div>
      )}

      {/* 24-Hour Interactive Diurnal Inversion Matrix */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
          <span className="font-bold uppercase tracking-wider text-[11px]">
            Diurnal Inversion Stability Matrix (Click Any Hour to Inspect):
          </span>
          <span className="font-mono text-emerald-400 font-semibold">
            Current Local Hour: {currentHour.toString().padStart(2, '0')}:00
          </span>
        </div>

        <div
          role="group"
          aria-label="24-hour diurnal inversion stability slots"
          className="grid grid-cols-12 sm:grid-cols-24 gap-1"
        >
          {hourlyData.map((slot) => {
            const isCurrent = slot.hour === currentHour;
            const isSelected = slot.hour === selectedHour;

            let bgClass = 'bg-slate-800';
            if (slot.risk === 'optimal') bgClass = 'bg-emerald-500 hover:bg-emerald-400';
            else if (slot.risk === 'moderate') bgClass = 'bg-amber-500/70 hover:bg-amber-500';
            else if (slot.risk === 'severe') bgClass = 'bg-rose-600/70 hover:bg-rose-600';
            else bgClass = 'bg-red-950 border border-red-600/80 hover:bg-red-800';

            return (
              <button
                key={slot.hour}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${slot.hour}:00 to ${(slot.hour + 1) % 24}:00. ${slot.label}. Est AQI: ${slot.estimatedAqi}. Risk: ${slot.risk}`}
                onClick={() => setSelectedHour(slot.hour)}
                title={`${slot.hour}:00 - ${slot.label} (Est AQI: ${slot.estimatedAqi})`}
                className={`h-12 rounded-lg flex flex-col items-center justify-between py-1 transition-all focus:outline-none focus:ring-2 focus:ring-white ${bgClass} ${
                  isSelected ? 'ring-2 ring-white scale-105 z-10' : 'opacity-80 hover:opacity-100'
                } ${isCurrent ? 'border-2 border-cyan-400' : ''}`}
              >
                <span className="text-[9px] font-mono font-bold text-white">
                  {slot.hour}
                </span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" aria-hidden="true" />
                )}
                {slot.risk === 'optimal' ? (
                  <CheckCircle2 className="w-3 h-3 text-slate-950 stroke-[3]" aria-hidden="true" />
                ) : (
                  <span className="text-[8px] font-mono text-white/80" aria-hidden="true">
                    {slot.risk === 'hazardous' ? '!' : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>00:00 (Midnight)</span>
          <span>06:00 (Morning Trap)</span>
          <span className="text-emerald-400 font-bold">13:00 (Safe Window)</span>
          <span>19:00 (Evening Trap)</span>
          <span>23:00</span>
        </div>
      </div>

      {/* Selected Hour Details */}
      <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 font-mono font-bold text-white">
              {activeHourInfo.hour.toString().padStart(2, '0')}:00 - {((activeHourInfo.hour + 1) % 24).toString().padStart(2, '0')}:00
            </span>
            <span
              className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                activeHourInfo.risk === 'optimal'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : activeHourInfo.risk === 'moderate'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {activeHourInfo.risk.toUpperCase()} ATMOSPHERIC STAGNATION
            </span>
          </div>
          <p className="text-slate-300 font-medium">
            <strong>Condition:</strong> {activeHourInfo.label}
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Estimated In-Situ AQI
            </span>
            <span className="text-lg font-mono font-black text-white">
              ~{activeHourInfo.estimatedAqi}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] max-w-xs">
            {activeHourInfo.risk === 'optimal' ? (
              <span className="text-emerald-300 font-semibold">
                ✓ Permitted window for 15-minute cross-ventilation.
              </span>
            ) : (
              <span className="text-rose-300 font-semibold">
                ✗ Keep windows sealed. Recirculate filtered air only.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
