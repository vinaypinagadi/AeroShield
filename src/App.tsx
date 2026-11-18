import React, { useState, useMemo, useRef } from 'react';
import {
  CalendarClock,
  Wrench,
  BarChart3,
  AlertOctagon,
  Clock,
  Sparkles,
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

import { useTheme } from './hooks/useTheme';
import { useApiKey } from './hooks/useApiKey';
import { useSmogPlan } from './hooks/useSmogPlan';

export type ActiveTab = 'routine' | 'iaq' | 'impact' | 'crisis' | 'ventilation';

interface TabDefinition {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    isApiKeyModalOpen,
    isLiveApiKeyActive,
    openApiKeyModal,
    closeApiKeyModal,
    refreshKeyStatus,
  } = useApiKey();

  const {
    plan,
    isLoading,
    statusMessage,
    clearStatusMessage,
    handleLoadPreset,
    handleFormSubmit,
  } = useSmogPlan(isLiveApiKeyActive);

  const [activeTab, setActiveTab] = useState<ActiveTab>('routine');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const currentPersona = useMemo(() => plan.context.persona, [plan.context.persona]);

  const tabs: TabDefinition[] = useMemo(
    () => [
      {
        id: 'routine',
        label: 'Daily Routine',
        icon: <CalendarClock className="w-4 h-4" aria-hidden="true" />,
        badge: `-${plan.routine.overallExposureReductionPct}%`,
      },
      {
        id: 'iaq',
        label: 'IAQ & DIY Hacks',
        icon: <Wrench className="w-4 h-4" aria-hidden="true" />,
        badge: `${plan.iaq.diyHacks.length} hacks`,
      },
      {
        id: 'impact',
        label: 'Impact Quantifier',
        icon: <BarChart3 className="w-4 h-4" aria-hidden="true" />,
        badge: `-${plan.impact.totalDailyPmAvertedGrams}g PM`,
      },
      {
        id: 'crisis',
        label: 'Crisis Simulator',
        icon: <AlertOctagon className="w-4 h-4 text-rose-400" aria-hidden="true" />,
        badge: 'What-If',
      },
      {
        id: 'ventilation',
        label: '24h Inversion Matrix',
        icon: <Clock className="w-4 h-4 text-emerald-400" aria-hidden="true" />,
      },
    ],
    [
      plan.routine.overallExposureReductionPct,
      plan.iaq.diyHacks.length,
      plan.impact.totalDailyPmAvertedGrams,
    ]
  );

  // WAI-ARIA arrow key navigation for tabs
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let targetIndex = -1;
    if (e.key === 'ArrowRight') {
      targetIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      targetIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      targetIndex = 0;
    } else if (e.key === 'End') {
      targetIndex = tabs.length - 1;
    }

    if (targetIndex >= 0) {
      e.preventDefault();
      const nextTab = tabs[targetIndex];
      setActiveTab(nextTab.id);
      tabRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Skip Link for Keyboard Accessibility (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-emerald-500 focus:text-slate-950 focus:font-black focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Header & Navigation */}
      <Navbar
        currentPersona={currentPersona}
        onSelectPersona={handleLoadPreset}
        onOpenApiKeyModal={openApiKeyModal}
        onExport={() => setIsExportModalOpen(true)}
        isLiveApiKeyActive={isLiveApiKeyActive}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 outline-none"
      >
        {/* Dynamic Status Notification Banner */}
        <div aria-live="polite" aria-atomic="true" className="w-full">
          {statusMessage && (
            <div
              role="status"
              className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-300 flex items-center justify-between shadow-lg animate-fadeIn"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" aria-hidden="true" />
                <span>{statusMessage}</span>
              </div>
              <button
                type="button"
                onClick={clearStatusMessage}
                aria-label="Dismiss notification"
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Live Evaluation Demo Mode Banner */}
        {!isLiveApiKeyActive && (
          <aside
            aria-label="Evaluation mode notification"
            className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl shrink-0">
                <Zap className="w-4 h-4" aria-hidden="true" />
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
              type="button"
              onClick={openApiKeyModal}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg border border-amber-500/30 shrink-0 self-start sm:self-auto transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Add Gemini Key (BYOK)
            </button>
          </aside>
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

        {/* Module Tabs Navigation (WAI-ARIA compliant) */}
        <div className="border-b border-slate-800">
          <nav
            role="tablist"
            aria-label="Mitigation Modules"
            className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2 scrollbar-none"
          >
            {tabs.map((tab, idx) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={active}
                  aria-controls={`tabpanel-${tab.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                        active
                          ? 'bg-slate-950/30 text-slate-900'
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

        {/* Tab Panels */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          className="focus:outline-none"
        >
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
      <footer className="border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500 space-y-1">
        <p>
          AeroShield • Severe Winter Smog & Urban Air Pollution Mitigation Assistant
        </p>
        <p className="text-[11px] text-slate-600">
          Powered by WHO 2021 & Berkeley Earth particulate benchmarks + Google Gemini 2.5 Flash structured generative AI.
        </p>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={closeApiKeyModal}
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
