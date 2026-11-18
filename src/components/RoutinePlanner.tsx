import React, { useState } from 'react';
import {
  CalendarClock,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Car,
  Flame,
  Users,
  HeartPulse,
  Sun,
  Filter,
} from 'lucide-react';
import { RoutineEngineResult, RoutineItem } from '../types/smog';

interface RoutinePlannerProps {
  routine: RoutineEngineResult;
}

export const RoutinePlanner: React.FC<RoutinePlannerProps> = ({ routine }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Transport', 'Energy/Heating', 'Community Action', 'Indoor Health'];

  const filteredSchedule = routine.dailySchedule.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const getCategoryIcon = (category: RoutineItem['category']) => {
    switch (category) {
      case 'Transport':
        return <Car className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />;
      case 'Energy/Heating':
        return <Flame className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />;
      case 'Community Action':
        return <Users className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />;
      case 'Indoor Health':
        return <HeartPulse className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />;
    }
  };

  return (
    <section aria-labelledby="routine-heading" className="space-y-6">
      {/* Top Banner / Key Health Benefit */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarClock className="w-4 h-4" aria-hidden="true" />
            <span id="routine-heading">Module B: Low-Emission Daily Routine Engine</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Peak Inversion Inhalation Avoidance Schedule
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {routine.keyHealthBenefit}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Overall Reduction Stat */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center min-w-[120px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Inhalation Cut
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono flex items-center justify-center space-x-1">
              <TrendingDown className="w-4 h-4" aria-hidden="true" />
              <span>-{routine.overallExposureReductionPct}%</span>
            </div>
            <span className="text-[10px] text-slate-400">vs unmitigated routine</span>
          </div>

          {/* Optimal Window */}
          <div className="bg-slate-950/80 border border-emerald-500/30 p-3 rounded-xl min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center space-x-1 mb-0.5">
              <Sun className="w-3 h-3 text-amber-400" aria-hidden="true" />
              <span>Optimal Window</span>
            </span>
            <span className="text-xs font-bold text-white block font-mono">
              {routine.optimalOutdoorWindow}
            </span>
            <span className="text-[10px] text-slate-400">Solar convective mixing</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div
          role="group"
          aria-label="Filter schedule by category"
          className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800"
        >
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" aria-hidden="true" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Activities' : cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredSchedule.length} of {routine.dailySchedule.length} intervention slots
        </span>
      </div>

      {/* Daily Timeline Cards */}
      <div className="space-y-3">
        {filteredSchedule.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left: Time and Category */}
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl shrink-0 text-center min-w-[80px]">
                <span className="text-xs font-mono font-bold text-white block">
                  {item.timeBlock}
                </span>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  {getCategoryIcon(item.category)}
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Middle: Shift Activity */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="line-through text-slate-400">
                    {item.originalActivity}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="font-bold text-emerald-300">
                    {item.optimizedActivity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.explanation}
                </p>
                {item.actionableTip && (
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-950/60 border border-slate-800 rounded-lg text-[11px] text-slate-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                    <span>
                      <strong className="text-emerald-400">Action Tip:</strong> {item.actionableTip}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Reduction Badge */}
            <div className="shrink-0 self-end md:self-auto text-right">
              <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl inline-flex items-center space-x-1 text-emerald-400 font-mono font-bold text-xs">
                <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
                <span>-{item.exposureReductionPct}% Exposure</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
