import React, { useState } from 'react';
import {
  Clock,
  Sun,
  CheckCircle2,
  Info,
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
            <Clock className="w-4 h-4" />
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
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
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
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Daily Aeration Window</span>
            </span>
            <div className="text-2xl font-black text-white font-mono">
              {primaryWindow.startHour} - {primaryWindow.endHour}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {primaryWindow.recommendedAction}
            </p>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Estimated Midday AQI
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              ~{primaryWindow.ambientEstimatedAQI}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              (vs {currentAQI} baseline)
            </span>
          </div>
        </div>
      )}

      {/* 24-Hour Visual Hourly Bar Matrix */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Click any hour to inspect atmospheric conditions:</span>
          <span className="font-mono text-emerald-400 font-semibold">
            Current Local Hour: {currentHour.toString().padStart(2, '0')}:00
          </span>
        </div>

        <div className="grid grid-cols-12 sm:grid-cols-24 gap-1">
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
                onClick={() => setSelectedHour(slot.hour)}
                title={`${slot.hour}:00 - ${slot.label} (Est AQI: ${slot.estimatedAqi})`}
                className={`h-12 rounded-lg flex flex-col items-center justify-between py-1 transition-all ${bgClass} ${
                  isSelected ? 'ring-2 ring-white scale-105 z-10' : 'opacity-80 hover:opacity-100'
                } ${isCurrent ? 'border-2 border-cyan-400' : ''}`}
              >
                <span className="text-[9px] font-mono font-bold text-white">
                  {slot.hour}
                </span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
                )}
                {slot.risk === 'optimal' ? (
                  <CheckCircle2 className="w-3 h-3 text-slate-950 stroke-[3]" />
                ) : (
                  <span className="text-[8px] font-mono text-white/80">
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
              {activeHourInfo.hour.toString().padStart(2, '0')}:00 - {(activeHourInfo.hour + 1).toString().padStart(2, '0')}:00
            </span>
            <span
              className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                activeHourInfo.risk === 'optimal'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : activeHourInfo.risk === 'moderate'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {activeHourInfo.risk} Condition
            </span>
          </div>
          <p className="text-slate-300">
            <strong>Atmospheric State: </strong>
            {activeHourInfo.label}
          </p>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="text-slate-400 block text-[10px]">Estimated Micro-Ambient AQI:</span>
          <span className="text-base font-bold font-mono text-white">
            {activeHourInfo.estimatedAqi}
          </span>
          <span className="text-[10px] text-slate-400 block">
            {activeHourInfo.risk === 'optimal'
              ? '✓ Safe for 15-min air change'
              : '✗ Keep all windows firmly latched'}
          </span>
        </div>
      </div>

      {/* Atmospheric Science Legend */}
      <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-2 text-xs text-slate-400">
        <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Why Thermal Inversion Determines Ventilation Safety:</span>
        </div>
        <p className="leading-relaxed">
          During winter nights, the Earth&apos;s surface cools rapidly via radiation, cooling the air immediately above it. A layer of warmer air traps this dense cold air beneath it like a lid (nocturnal temperature inversion). Pollutants emitted at ground level (vehicle exhaust, woodsmoke) cannot rise and accumulate to lethal concentrations. Only when mid-day solar heating warms the ground does the inversion layer break, creating vertical thermal mixing that dilutes surface pollutants by up to 50%.
        </p>
      </div>
    </div>
  );
};
