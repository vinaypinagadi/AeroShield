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
      // Auto-flag thermal inversion if temperature is cold (< 12°C) and AQI is severe
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
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Smart Context Onboarding & AQI Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic risk profiling and AI schedule synthesis tailored to your micro-environment
          </p>
        </div>

        {/* 1-Click Instant Demo Presets Bar */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 select-none">
            Load Demo Preset:
          </span>
          {(['family_vulnerable', 'outdoor_commuter', 'community_admin', 'respiratory_patient'] as PersonaType[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onLoadPreset(p)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-700 transition-all flex items-center space-x-1"
            >
              <span>{ALL_PRESETS[p]?.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
        {/* Persona Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            1. User Persona & Household Vulnerability
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {personaOptions.map((opt) => {
              const selected = formData.persona === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleChange('persona', opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {selected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Smog Severity & Meteorology */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl">
          {/* AQI Slider & Quick Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="aqi-slider" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
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
              onChange={(e) => handleChange('currentAQI', parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>50 (Good)</span>
              <span>200 (Poor)</span>
              <span>350 (Severe)</span>
              <span>500+ (Hazardous)</span>
            </div>
            {/* Quick Presets for AQI */}
            <div className="flex gap-1.5 mt-2">
              {[120, 260, 380, 480].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleChange('currentAQI', val)}
                  className={`text-[10px] px-2 py-0.5 rounded font-mono border transition-colors ${
                    formData.currentAQI === val
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Winter Temperature & Thermal Inversion */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="temp-slider" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Winter Temperature</span>
              </label>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-800 rounded text-cyan-300">
                {formData.temperatureCelsius}°C
              </span>
            </div>
            <input
              id="temp-slider"
              type="range"
              min={-15}
              max={25}
              step={1}
              value={formData.temperatureCelsius}
              onChange={(e) => handleChange('temperatureCelsius', parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex items-center space-x-2 mt-3">
              <input
                id="thermal-inversion-chk"
                type="checkbox"
                checked={formData.hasThermalInversion}
                onChange={(e) => handleChange('hasThermalInversion', e.target.checked)}
                className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500"
              />
              <label htmlFor="thermal-inversion-chk" className="text-xs text-slate-300 cursor-pointer select-none">
                Winter Boundary Inversion Active (Trap Smog)
              </label>
            </div>
          </div>

          {/* City / Micro-Environment */}
          <div>
            <label htmlFor="city-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Target City / Basin
            </label>
            <input
              id="city-input"
              type="text"
              value={formData.cityName}
              onChange={(e) => handleChange('cityName', e.target.value)}
              placeholder="e.g. Delhi NCR, Lahore, Salt Lake City..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="mt-2">
              <label htmlFor="proximity-select" className="block text-[11px] text-slate-400 mb-1">
                Proximity to Hazard Zone
              </label>
              <select
                id="proximity-select"
                value={formData.proximityHazard}
                onChange={(e) => handleChange('proximityHazard', e.target.value as ProximityHazard)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="near_highway">Near Highway / Arterial Ring Road (Diesel/BC)</option>
                <option value="near_industrial">Near Industrial Corridor / Brick Kilns</option>
                <option value="near_agricultural_burn">Near Agricultural Stubble Burning Area</option>
                <option value="dense_urban">Dense Urban Mixed-Use Core</option>
                <option value="suburban">Suburban Residential Valley</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Micro-Environment & Lifestyle Controls */}
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-3 bg-slate-950/40 hover:bg-slate-800/40 flex items-center justify-between text-xs font-bold text-slate-300 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Lifestyle Constraints: Commute, Heating, Cooking & Filtration</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {isExpanded ? 'Hide Details ▲' : 'Customize Lifestyle ▼'}
            </span>
          </button>

          {isExpanded && (
            <div className="p-4 bg-slate-950/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs border-t border-slate-800">
              {/* Commute Method & Duration */}
              <div>
                <label htmlFor="commute-select" className="font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                  <Car className="w-3.5 h-3.5 text-amber-400" />
                  <span>Daily Commute Mode</span>
                </label>
                <select
                  id="commute-select"
                  value={formData.commuteMethod}
                  onChange={(e) => handleChange('commuteMethod', e.target.value as CommuteMethod)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                >
                  <option value="walking_cycling">Walking / Cycling (High Inhalation)</option>
                  <option value="two_wheeler_motorcycle">Two-Wheeler / Motorcycle</option>
                  <option value="public_transit_bus_metro">Public Transit / Metro</option>
                  <option value="private_car_ice">Private Petrol / Diesel Car</option>
                  <option value="carpool_ev">Carpool / Electric Vehicle</option>
                  <option value="work_from_home">Work From Home (Zero Commute)</option>
                </select>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <label htmlFor="commute-mins-input">Duration:</label>
                  <input
                    id="commute-mins-input"
                    type="number"
                    min={0}
                    max={240}
                    value={formData.commuteDurationMinutes}
                    onChange={(e) => handleChange('commuteDurationMinutes', parseInt(e.target.value, 10) || 0)}
                    className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-slate-200"
                  />
                  <span>mins/day</span>
                </div>
              </div>

              {/* Heating Method */}
              <div>
                <label htmlFor="heating-select" className="font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Winter Space Heating</span>
                </label>
                <select
                  id="heating-select"
                  value={formData.heatingMethod}
                  onChange={(e) => handleChange('heatingMethod', e.target.value as HeatingMethod)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                >
                  <option value="clean_electric_heatpump">Clean Electric Inverter / Heat Pump</option>
                  <option value="piped_gas">Piped Natural Gas Radiator</option>
                  <option value="lpg_cylinder">LPG Cylinder Space Heater</option>
                  <option value="kerosene">Kerosene Heater (Soot & VOCs)</option>
                  <option value="biomass_wood_coal">Biomass Firewood / Coal Chulha</option>
                  <option value="none_or_blankets">None / Thermal Blankets Only</option>
                </select>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Combustion heaters emit toxic indoor CO & NO2
                </span>
              </div>

              {/* Cooking Fuel */}
              <div>
                <label htmlFor="cooking-select" className="font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                  <Utensils className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kitchen Cooking Fuel</span>
                </label>
                <select
                  id="cooking-select"
                  value={formData.cookingFuel}
                  onChange={(e) => handleChange('cookingFuel', e.target.value as CookingFuel)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                >
                  <option value="induction_electric">Induction Electric (Zero emissions)</option>
                  <option value="piped_natural_gas">Piped Natural Gas (PNG)</option>
                  <option value="lpg">LPG Cylinder</option>
                  <option value="biomass_firewood">Biomass Firewood / Dung</option>
                </select>
                <div className="mt-2">
                  <label htmlFor="ventilation-select" className="text-[11px] text-slate-400 block mb-0.5">
                    Building Infiltration Tightness
                  </label>
                  <select
                    id="ventilation-select"
                    value={formData.ventilationType}
                    onChange={(e) => handleChange('ventilationType', e.target.value as VentilationType)}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-xs"
                  >
                    <option value="natural_drafty">Drafty Windows (75% outdoor PM leaks in)</option>
                    <option value="moderately_sealed">Moderately Sealed (50% leak)</option>
                    <option value="tightly_sealed_hvac">Tightly Sealed HVAC (20% leak)</option>
                    <option value="cross_ventilated">Open Cross-Ventilated</option>
                  </select>
                </div>
              </div>

              {/* Air Purifier Status */}
              <div>
                <label htmlFor="purifier-select" className="font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Indoor Air Filtration</span>
                </label>
                <select
                  id="purifier-select"
                  value={formData.airPurifierStatus}
                  onChange={(e) => handleChange('airPurifierStatus', e.target.value as AirPurifierStatus)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                >
                  <option value="hepa_commercial">Commercial True HEPA Purifier</option>
                  <option value="diy_corsi_rosenthal">DIY Corsi-Rosenthal Air Cube</option>
                  <option value="standard_fan_filter">Standard Fan with Mesh Filter</option>
                  <option value="none">No Indoor Filtration Active</option>
                </select>
                <div className="mt-3 flex items-center space-x-2">
                  <input
                    id="vulnerable-chk"
                    type="checkbox"
                    checked={formData.hasVulnerableMembers}
                    onChange={(e) => handleChange('hasVulnerableMembers', e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-500 bg-slate-900 border-slate-700 rounded"
                  />
                  <label htmlFor="vulnerable-chk" className="text-[11px] text-slate-300 cursor-pointer select-none">
                    Toddlers / Elderly / Asthmatics Present
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setFormData(initialContext)}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Computing AI & Exposure Model...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Synthesize Personalized Smog Mitigation Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
