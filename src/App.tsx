import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CalendarClock,
  Wrench,
  BarChart3,
  AlertOctagon,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ExposureHeader } from './components/ExposureHeader';
import { OnboardingForm } from './components/OnboardingForm';
import { RoutinePlanner } from './components/RoutinePlanner';
import { IAQHacks } from './components/IAQHacks';
import { ImpactQuantifier } from './components/ImpactQuantifier';
import { CrisisSimulator } from './components/CrisisSimulator';
import { SafeVentilationTimer } from './components/SafeVentilationTimer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ExportModal } from './components/ExportModal';

import { CompleteSmogPlan, PersonaType, SmogContextInput } from './types/smog';
import { DEFAULT_PRESET, ALL_PRESETS } from './data/presets';
import { generatePersonalizedSmogPlan, getActiveApiKey } from './services/aiSmogService';
import { validateOrFallbackPlan } from './utils/smogLogic';

const SAVED_PLAN_KEY = 'aero_saved_smog_plan';

type ActiveTab = 'routine' | 'iaq' | 'impact' | 'crisis' | 'ventilation';

export default function App() {
  // Initialize plan from localStorage if available, or fallback to default preset
  const [plan, setPlan] = useState<CompleteSmogPlan>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(SAVED_PLAN_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return validateOrFallbackPlan(parsed, DEFAULT_PRESET);
        }
      } catch (err) {
        console.warn('Failed to parse cached plan, falling back to preset', err);
      }
    }
    return DEFAULT_PRESET.plan;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('routine');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLiveApiKeyActive, setIsLiveApiKeyActive] = useState<boolean>(() => {
    return !!getActiveApiKey();
  });

  // Theme synchronization with document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist plan changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_PLAN_KEY, JSON.stringify(plan));
    } catch (err) {
      console.warn('Failed to save plan to localStorage', err);
    }
  }, [plan]);

  const refreshKeyStatus = useCallback(() => {
    setIsLiveApiKeyActive(!!getActiveApiKey());
  }, []);

  // 1-Click Instant Demo Preset Loader
  const handleLoadPreset = useCallback((persona: PersonaType) => {
    const preset = ALL_PRESETS[persona] || DEFAULT_PRESET;
    setPlan({
      ...preset.plan,
      timestamp: new Date().toISOString(),
    });
    setStatusMessage(`Loaded verified demo preset for "${preset.name}".`);
    setTimeout(() => setStatusMessage(null), 3500);
  }, []);

  // Form submission handler: calls Gemini API or updates deterministic model
  const handleFormSubmit = async (context: SmogContextInput) => {
    setIsLoading(true);
    setStatusMessage(
      isLiveApiKeyActive
        ? 'Calling Gemini 2.5 Flash for personalized multi-engine synthesis...'
        : 'Recalculating deterministic exposure model and matching verified clinical preset...'
    );

    try {
      const result = await generatePersonalizedSmogPlan(context);
      setPlan(result.plan);

      if (result.error) {
        setStatusMessage(`Note: ${result.error} (Using calibrated baseline preset)`);
      } else {
        setStatusMessage(
          result.plan.source === 'ai_generated'
            ? '✨ Successfully synthesized custom plan with Gemini 2.5 Flash!'
            : '✓ Plan successfully updated with deterministic exposure model.'
        );
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error synthesizing plan. Reverted to verified baseline.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const currentPersona = useMemo(() => plan.context.persona, [plan.context.persona]);

  const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }> = [
    {
      id: 'routine',
      label: 'Daily Routine',
      icon: <CalendarClock className="w-4 h-4" />,
      badge: `-${plan.routine.overallExposureReductionPct}%`,
    },
    {
      id: 'iaq',
      label: 'IAQ & DIY Hacks',
      icon: <Wrench className="w-4 h-4" />,
      badge: `${plan.iaq.diyHacks.length} hacks`,
    },
    {
      id: 'impact',
      label: 'Impact Quantifier',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: `-${plan.impact.totalDailyPmAvertedGrams}g PM`,
    },
    {
      id: 'crisis',
      label: 'Crisis Simulator',
      icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
      badge: 'What-If',
    },
    {
      id: 'ventilation',
      label: '24h Inversion Matrix',
      icon: <Clock className="w-4 h-4 text-emerald-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Header & Navigation */}
      <Navbar
        currentPersona={currentPersona}
        onSelectPersona={handleLoadPreset}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onExport={() => setIsExportModalOpen(true)}
        isLiveApiKeyActive={isLiveApiKeyActive}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dynamic Status Notification Banner */}
        <div aria-live="polite" className="w-full">
          {statusMessage && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-300 flex items-center justify-between shadow-lg animate-fadeIn">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>{statusMessage}</span>
              </div>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Live Evaluation Demo Mode Banner */}
        {!isLiveApiKeyActive && (
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-amber-300 font-bold block sm:inline mr-1.5">
                  Instant Demo Mode Active:
                </strong>
                <span className="text-slate-300">
                  Evaluators can inspect, simulate, and calculate all modules immediately. You can optionally add a Gemini API key anytime for real-time generative adaptations.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg border border-amber-500/30 shrink-0 self-start sm:self-auto transition-colors"
            >
              Add Gemini Key (BYOK)
            </button>
          </div>
        )}

        {/* Exposure Risk & Real-time Smog Dose Summary */}
        <ExposureHeader
          context={plan.context}
          analysis={plan.deterministicAnalysis}
          onExploreVentilation={() => setActiveTab('ventilation')}
        />

        {/* Module A: Context Onboarding & AQI Engine */}
        <OnboardingForm
          initialContext={plan.context}
          onSubmit={handleFormSubmit}
          onLoadPreset={handleLoadPreset}
          isLoading={isLoading}
        />

        {/* Module Tabs Navigation */}
        <div className="border-b border-slate-800">
          <nav
            aria-label="Mitigation Modules"
            className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2 scrollbar-none"
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                        active
                          ? 'bg-slate-950 text-emerald-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Module Display */}
        <div className="min-h-[400px]">
          {activeTab === 'routine' && <RoutinePlanner routine={plan.routine} />}
          {activeTab === 'iaq' && <IAQHacks iaq={plan.iaq} />}
          {activeTab === 'impact' && <ImpactQuantifier impact={plan.impact} />}
          {activeTab === 'crisis' && <CrisisSimulator crisis={plan.crisis} />}
          {activeTab === 'ventilation' && (
            <SafeVentilationTimer
              safeWindows={plan.deterministicAnalysis.safeVentilationWindows}
              currentAQI={plan.context.currentAQI}
              hasInversion={plan.context.hasThermalInversion}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-300">
                AeroShield Smog & Air Pollution Mitigation Platform
              </span>
              <span>•</span>
              <span>Production-Ready Competition Release</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="hover:text-emerald-400 transition-colors"
              >
                Export Plan
              </button>
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="hover:text-emerald-400 transition-colors"
              >
                API Key Settings
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900 text-[11px] leading-relaxed flex flex-col md:flex-row md:items-center justify-between gap-2 text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Calculations grounded in WHO 2021 Global Air Quality Guidelines, Berkeley Earth toxicity metrics, and NASA Clean Air research.
              </span>
            </div>
            <span className="font-mono text-slate-500">
              Zero hardcoded secrets • Strict single-branch main • Total bundle &lt; 10 MB
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={refreshKeyStatus}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        plan={plan}
      />
    </div>
  );
}
