import React from 'react';
import {
  ShieldAlert,
  Key,
  Download,
  Users,
  Bike,
  Building2,
  HeartPulse,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { PersonaType } from '../types/smog';
import { ALL_PRESETS } from '../data/presets';

interface NavbarProps {
  currentPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
  onOpenApiKeyModal: () => void;
  onExport: () => void;
  isLiveApiKeyActive: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPersona,
  onSelectPersona,
  onOpenApiKeyModal,
  onExport,
  isLiveApiKeyActive,
  isDarkMode,
  onToggleTheme,
}) => {
  const personas: Array<{ id: PersonaType; label: string; icon: React.ReactNode }> = [
    {
      id: 'family_vulnerable',
      label: 'Family & Kids',
      icon: <Users className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    {
      id: 'outdoor_commuter',
      label: 'Commuter',
      icon: <Bike className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    {
      id: 'community_admin',
      label: 'School / Complex',
      icon: <Building2 className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    {
      id: 'respiratory_patient',
      label: 'Asthma / Patient',
      icon: <HeartPulse className="w-3.5 h-3.5" aria-hidden="true" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 shadow-lg shadow-emerald-500/20">
              <ShieldAlert className="w-6 h-6 text-slate-950 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-white flex items-center">
                  Aero<span className="text-emerald-400">Shield</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Smog AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Severe Winter Smog & Urban Air Pollution Mitigation Assistant
              </p>
            </div>
          </div>

          {/* Persona Demo Quick-Switch Bar */}
          <nav
            aria-label="Persona Presets Quick Selector"
            className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800"
          >
            <span className="text-[11px] font-semibold text-slate-400 px-2 select-none">
              Presets:
            </span>
            {personas.map((p) => {
              const active = currentPersona === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectPersona(p.id)}
                  aria-pressed={active}
                  title={ALL_PRESETS[p.id]?.shortDesc || p.label}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    active
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Utilities (BYOK Key, Export, Theme) */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              title={isLiveApiKeyActive ? 'Gemini API Key Active' : 'Configure Gemini API Key or Use Demo Mode'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                isLiveApiKeyActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-700/70'
              }`}
            >
              <Key className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">
                {isLiveApiKeyActive ? 'Gemini 2.5 Active' : 'BYOK / Demo Mode'}
              </span>
              {isLiveApiKeyActive && (
                <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse hidden sm:inline" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={onExport}
              title="Export Plan as JSON or Markdown"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Export Plan"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              title="Toggle Dark or Light Theme"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Toggle Dark/Light Mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-300" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
