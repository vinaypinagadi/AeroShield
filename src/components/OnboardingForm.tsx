import React, { useState } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  Thermometer,
  Home,
  Flame,
  Utensils,
  Car,
  Wind,
  Shield,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import {
  AirPurifierStatus,
  CommuteMethod,
  CookingFuel,
  HeatingMethod,
  PersonaType,
  ProximityHazard,
  SmogContextInput,
  VentilationType,
} from '../types/smog';
import { ALL_PRESETS } from '../data/presets';

interface OnboardingFormProps {
  initialContext: SmogContextInput;
  onSubmit: (context: SmogContextInput) => void;
  onLoadPreset: (persona: PersonaType) => void;
  isLoading: boolean;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  initialContext,
  onSubmit,
  onLoadPreset,
  isLoading,
}) => {
  const [formData, setFormData] = useState<SmogContextInput>(initialContext);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync when initialContext changes externally (e.g. preset loaded from navbar)
  React.useEffect(() => {
    setFormData(initialContext);
  }, [initialContext]);

  const handleChange = <K extends keyof SmogContextInput>(
    field: K,
    value: SmogContextInput[K]
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-flag thermal inversion if temperature is cold (<= 12°C) and AQI is severe
      if (field === 'temperatureCelsius' || field === 'currentAQI') {
        const temp = field === 'temperatureCelsius' ? (value as number) : prev.temperatureCelsius;
        const aqi = field === 'currentAQI' ? (value as number) : prev.currentAQI;
        if (temp <= 12 && aqi >= 250) {
          next.hasThermalInversion = true;
        }
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const personaOptions: Array<{ id: PersonaType; label: string; desc: string }> = [
    {
      id: 'family_vulnerable',
      label: 'Family & Vulnerable Members',
      desc: 'Homes with toddlers, pregnant women, or elderly grandparents.',
    },
    {
      id: 'outdoor_commuter',
      label: 'Outdoor Commuter & Field Worker',
      desc: 'Active transit, two-wheeler riders, or logistics personnel.',
    },
    {
      id: 'community_admin',
      label: 'Community / School Administrator',
      desc: 'Managing school campuses, housing complexes, or civic zones.',
    },
    {
      id: 'respiratory_patient',
      label: 'Asthma / Respiratory Patient',
      desc: 'Airway hyperreactivity requiring strict particle containment.',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Module A: Context Onboarding & AQI Engine
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Personalize Your Winter Smog Exposure Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure ambient meteorological data and micro-environmental parameters to calculate precise inhaled dose.
          </p>
        </div>

        {/* 1-Click Instant Demo Presets Bar */}
        <div
          role="group"
          aria-label="Preset configurations"
          className="flex items-center flex-wrap gap-1.5"
        >
          <span className="text-[11px] font-semibold text-slate-400 mr-1 select-none">
            Load Demo Preset:
          </span>
          {(['family_vulnerable', 'outdoor_commuter', 'community_admin', 'respiratory_patient'] as PersonaType[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onLoadPreset(p)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-700 transition-all flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <span>{ALL_PRESETS[p]?.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
        {/* Persona Selection */}
        <fieldset>
          <legend className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            1. User Persona & Household Vulnerability
          </legend>
          <div
            role="radiogroup"
            aria-label="User Persona"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5"
          >
            {personaOptions.map((opt) => {
              const selected = formData.persona === opt.id;
              return (
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  key={opt.id}
                  onClick={() => handleChange('persona', opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    selected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {selected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Smog Severity & Meteorology */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl">
          {/* AQI Slider & Quick Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="aqi-slider" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>Ambient AQI</span>
              </label>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-800 rounded text-emerald-300">
                {formData.currentAQI}
              </span>
            </div>
            <input
              id="aqi-slider"
              type="range"
              min={30}
              max={550}
              step={5}
              value={formData.currentAQI}
              onChange={(e) => handleChange('currentAQI', Number(e.target.value))}
              aria-label="Ambient Air Quality Index"
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
              <span>50 (Good)</span>
              <span>300 (Severe)</span>
              <span>500+ (Hazardous)</span>
            </div>
          </div>

          {/* City / Location */}
          <div>
            <label htmlFor="city-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              City / Metropolitan Region
            </label>
            <input
              id="city-input"
              type="text"
              value={formData.cityName}
              onChange={(e) => handleChange('cityName', e.target.value)}
              placeholder="e.g., Delhi NCR, Lahore, Salt Lake Basin..."
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Topographic basins aggravate boundary layer smog stagnation.
            </p>
          </div>

          {/* Temperature & Inversion Trigger */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="temp-slider" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span>Surface Temperature</span>
              </label>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-800 rounded text-cyan-300">
                {formData.temperatureCelsius}°C
              </span>
            </div>
            <input
              id="temp-slider"
              type="range"
              min={-15}
              max={35}
              step={1}
              value={formData.temperatureCelsius}
              onChange={(e) => handleChange('temperatureCelsius', Number(e.target.value))}
              aria-label="Ambient surface temperature in Celsius"
              className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>-15°C (Sub-zero)</span>
              <span className="text-cyan-400">Cold pools trap smog</span>
              <span>35°C</span>
            </div>
          </div>
        </div>

        {/* Quick Toggles: Thermal Inversion & Vulnerable Members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center space-x-3 cursor-pointer hover:bg-slate-800/40 transition-colors">
            <input
              type="checkbox"
              checked={formData.hasThermalInversion}
              onChange={(e) => handleChange('hasThermalInversion', e.target.checked)}
              className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500"
            />
            <div className="text-xs">
              <strong className="text-slate-200 block">Thermal Boundary Inversion Active</strong>
              <span className="text-slate-400 text-[11px]">
                Atmospheric cold layer capping smoke below 150 meters (nocturnal peak)
              </span>
            </div>
          </label>

          <label className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center space-x-3 cursor-pointer hover:bg-slate-800/40 transition-colors">
            <input
              type="checkbox"
              checked={formData.hasVulnerableMembers}
              onChange={(e) => handleChange('hasVulnerableMembers', e.target.checked)}
              className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500"
            />
            <div className="text-xs">
              <strong className="text-slate-200 block">Infants / Elderly / Chronic Patients Present</strong>
              <span className="text-slate-400 text-[11px]">
                Applies stricter clinical exposure thresholds and alert protocols
              </span>
            </div>
          </label>
        </div>

        {/* Expandable Advanced Environmental Settings */}
        <div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls="advanced-environmental-settings"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 py-1 focus:outline-none focus:underline"
          >
            <span>{isExpanded ? 'Hide Advanced Micro-Environmental Parameters' : 'Show Advanced Micro-Environmental Parameters (Commute, Heating, Cooking, Purifier)'}</span>
            <span aria-hidden="true">{isExpanded ? '▲' : '▼'}</span>
          </button>

          {isExpanded && (
            <div
              id="advanced-environmental-settings"
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-950/70 border border-slate-800 rounded-xl animate-fadeIn"
            >
              {/* Commute Method */}
              <div>
                <label htmlFor="commute-select" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
                  <Car className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  <span>Commute Method</span>
                </label>
                <select
                  id="commute-select"
                  value={formData.commuteMethod}
                  onChange={(e) => handleChange('commuteMethod', e.target.value as CommuteMethod)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="walking_cycling">Walking / Cycling (High ventilation tidal dose)</option>
                  <option value="two_wheeler_motorcycle">Two-Wheeler / Motorcycle (Direct exhaust exposure)</option>
                  <option value="public_transit_bus_metro">Metro / Air-Filtered Public Bus</option>
                  <option value="private_car_ice">Private Car (Closed Windows, Recirculation Mode)</option>
                  <option value="carpool_ev">Electric Vehicle / Carpool</option>
                  <option value="work_from_home">Work From Home (Zero commute exposure)</option>
                </select>
              </div>

              {/* Commute Duration */}
              <div>
                <label htmlFor="commute-duration-input" className="block text-xs font-semibold text-slate-300 mb-1">
                  Daily Outdoor Commute Duration (mins)
                </label>
                <input
                  id="commute-duration-input"
                  type="number"
                  min={0}
                  max={240}
                  value={formData.commuteDurationMinutes}
                  onChange={(e) => handleChange('commuteDurationMinutes', Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              {/* Building Envelope Tightness */}
              <div>
                <label htmlFor="ventilation-select" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
                  <Home className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>Building Infiltration Tightness</span>
                </label>
                <select
                  id="ventilation-select"
                  value={formData.ventilationType}
                  onChange={(e) => handleChange('ventilationType', e.target.value as VentilationType)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="natural_drafty">Drafty Windows / Unsealed Gaps (75% penetration)</option>
                  <option value="moderately_sealed">Moderately Sealed Envelope (50% penetration)</option>
                  <option value="cross_ventilated">Cross-Ventilated Natural Aeration (85% penetration)</option>
                  <option value="tightly_sealed_hvac">Tightly Sealed & Weatherstripped HVAC (20% penetration)</option>
                </select>
              </div>

              {/* Space Heating Method */}
              <div>
                <label htmlFor="heating-select" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
                  <span>Indoor Space Heating</span>
                </label>
                <select
                  id="heating-select"
                  value={formData.heatingMethod}
                  onChange={(e) => handleChange('heatingMethod', e.target.value as HeatingMethod)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="biomass_wood_coal">Wood / Coal Fireplace (High internal PM2.5 spike)</option>
                  <option value="kerosene">Unvented Kerosene Heater (High VOCs + soot)</option>
                  <option value="lpg_cylinder">LPG Cylinder Space Heater</option>
                  <option value="piped_gas">Piped Natural Gas Radiator</option>
                  <option value="clean_electric_heatpump">Reverse-Cycle Heat Pump / Electric Radiator (Zero emissions)</option>
                  <option value="none_or_blankets">No Space Heating / Thermal Blankets</option>
                </select>
              </div>

              {/* Cooking Fuel */}
              <div>
                <label htmlFor="cooking-select" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
                  <Utensils className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>Kitchen Cooking Fuel</span>
                </label>
                <select
                  id="cooking-select"
                  value={formData.cookingFuel}
                  onChange={(e) => handleChange('cookingFuel', e.target.value as CookingFuel)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="lpg">LPG Cylinder / Bottled Gas</option>
                  <option value="piped_natural_gas">Piped Natural Gas (PNG)</option>
                  <option value="induction_electric">Clean Induction / Electric Stove (Zero combustion)</option>
                  <option value="biomass_firewood">Traditional Biomass Firewood / Chulha</option>
                </select>
              </div>

              {/* Air Purifier Status */}
              <div>
                <label htmlFor="purifier-select" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>Indoor Air Purifier Status</span>
                </label>
                <select
                  id="purifier-select"
                  value={formData.airPurifierStatus}
                  onChange={(e) => handleChange('airPurifierStatus', e.target.value as AirPurifierStatus)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="none">No Purifier Available</option>
                  <option value="diy_corsi_rosenthal">DIY Corsi-Rosenthal Box (4x MERV-13 Filters)</option>
                  <option value="standard_fan_filter">Single-Room Fan Filter</option>
                  <option value="hepa_commercial">Commercial True HEPA Unit</option>
                </select>
              </div>

              {/* Proximity Hazard */}
              <div>
                <label htmlFor="hazard-select" className="block text-xs font-semibold text-slate-300 mb-1">
                  Proximity to Severe Hazard Source
                </label>
                <select
                  id="hazard-select"
                  value={formData.proximityHazard}
                  onChange={(e) => handleChange('proximityHazard', e.target.value as ProximityHazard)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="near_highway">Major Highway / Diesel Truck Corridor (&lt; 200m)</option>
                  <option value="near_industrial">Industrial Chimneys / Brick Kilns (&lt; 1km)</option>
                  <option value="near_agricultural_burn">Direct Agricultural Biomass Stubble Plume</option>
                  <option value="dense_urban">Dense Urban Corridor / Commercial Center</option>
                  <option value="suburban">Suburban / Park-Adjacent Low-Density</option>
                </select>
              </div>

              {/* Household Size */}
              <div>
                <label htmlFor="members-input" className="block text-xs font-semibold text-slate-300 mb-1">
                  Total Household Residents
                </label>
                <input
                  id="members-input"
                  type="number"
                  min={1}
                  max={25}
                  value={formData.householdMembersCount}
                  onChange={(e) => handleChange('householdMembersCount', Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes-input" className="block text-xs font-semibold text-slate-300 mb-1">
                  Specific Health or Community Notes
                </label>
                <input
                  id="notes-input"
                  type="text"
                  maxLength={150}
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="e.g., asthmatic child, ground floor..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="text-[11px] text-slate-400">
            <span>Deterministic engine recalculates immediately. Gemini synthesizes personalized schedules when API key is active.</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setFormData(initialContext)}
              aria-label="Reset form changes"
              className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  <span>Synthesizing Mitigation Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Synthesize Custom Smog Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
