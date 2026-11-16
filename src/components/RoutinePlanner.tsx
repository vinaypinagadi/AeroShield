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
        return <Car className="w-3.5 h-3.5 text-amber-400" />;
      case 'Energy/Heating':
        return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'Community Action':
        return <Users className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Indoor Health':
        return <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <section aria-labelledby="routine-heading" className="space-y-6">
      {/* Top Banner / Key Health Benefit */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarClock className="w-4 h-4" />
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
              <TrendingDown className="w-4 h-4" />
              <span>-{routine.overallExposureReductionPct}%</span>
            </div>
            <span className="text-[10px] text-slate-400">vs unmitigated routine</span>
          </div>

          {/* Optimal Window */}
          <div className="bg-slate-950/80 border border-emerald-500/30 p-3 rounded-xl min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center space-x-1 mb-0.5">
              <Sun className="w-3 h-3 text-amber-400" />
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
        <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Activities' : cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredSchedule.length} scheduled time blocks
        </span>
      </div>

      {/* Schedule Cards */}
      <div className="space-y-3.5">
        {filteredSchedule.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800/90 hover:border-slate-700/90 rounded-2xl p-4 sm:p-5 shadow-lg transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-white font-mono text-xs font-bold rounded-lg">
                  {item.timeBlock}
                </span>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded-full text-[11px] font-medium border border-slate-700">
                  {getCategoryIcon(item.category)}
                  <span>{item.category}</span>
                </span>
              </div>

              {/* Exposure Reduction Pill */}
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold self-start sm:self-auto">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>-{item.exposureReductionPct}% PM2.5 / VOC Inhalation</span>
              </div>
            </div>

            {/* Before vs After Activity Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                  High-Exposure Habit
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.originalActivity}
                </p>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1 flex items-center space-x-1">
                  <ArrowRight className="w-3 h-3" />
                  <span>Optimized Routine</span>
                </span>
                <p className="text-xs text-white font-medium leading-relaxed">
                  {item.optimizedActivity}
                </p>
              </div>
            </div>

            {/* Scientific Explanation & Actionable Tip */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 text-xs">
              <div className="md:col-span-7 text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Environmental Mechanism: </strong>
                {item.explanation}
              </div>
              <div className="md:col-span-5 bg-slate-950/50 p-2 rounded-lg border border-slate-800 text-slate-300 flex items-start space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-emerald-300">Action Tip: </strong>
                  {item.actionableTip}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
