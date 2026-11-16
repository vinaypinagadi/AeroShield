/**
 * Deterministic Environmental Health & AQI Exposure Calculation Engine
 * Pure functions, zero side-effects, unit-testable.
 */

import {
  AQITier,
  CommuteMethod,
  CompleteSmogPlan,
  DeterministicExposureAnalysis,
  HeatingMethod,
  PersonaType,
  ProximityHazard,
  RiskAlert,
  SafeVentilationWindow,
  SmogContextInput,
  VentilationType,
} from '../types/smog';
import { ALL_PRESETS, DEFAULT_PRESET } from '../data/presets';

/**
 * Maps AQI value to standardized tier
 */
export function getAQITier(aqi: number): AQITier {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 200) return 'poor';
  if (aqi <= 300) return 'very_poor';
  if (aqi <= 400) return 'severe';
  return 'hazardous_emergency';
}

/**
 * Returns human-readable label for AQI tier
 */
export function getAQITierLabel(tier: AQITier): string {
  switch (tier) {
    case 'good':
      return 'Good (0 - 50)';
    case 'moderate':
      return 'Moderate (51 - 100)';
    case 'poor':
      return 'Poor (101 - 200)';
    case 'very_poor':
      return 'Very Poor (201 - 300)';
    case 'severe':
      return 'Severe (301 - 400)';
    case 'hazardous_emergency':
      return 'Hazardous / Emergency (401+)';
  }
}

/**
 * Color classes for UI badges & alerts
 */
export function getAQIColorClasses(aqi: number): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  if (aqi <= 50) {
    return {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500 text-slate-950',
    };
  }
  if (aqi <= 100) {
    return {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      badge: 'bg-amber-500 text-slate-950',
    };
  }
  if (aqi <= 200) {
    return {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      badge: 'bg-orange-500 text-slate-950',
    };
  }
  if (aqi <= 300) {
    return {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      badge: 'bg-rose-500 text-white',
    };
  }
  if (aqi <= 400) {
    return {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      badge: 'bg-purple-600 text-white',
    };
  }
  // Hazardous 401+
  return {
    bg: 'bg-red-950/40',
    text: 'text-red-400',
    border: 'border-red-600/50',
    badge: 'bg-red-700 text-white animate-pulse',
  };
}

/**
 * Estimates PM2.5 concentration in µg/m³ from an AQI number
 * Using standard US EPA / CPCB breakpoint linear approximations
 */
export function convertAQIToPm25(aqi: number): number {
  if (aqi <= 50) return Math.round((aqi / 50) * 12);
  if (aqi <= 100) return Math.round(12.1 + ((aqi - 50) / 50) * (35.4 - 12.1));
  if (aqi <= 150) return Math.round(35.5 + ((aqi - 100) / 50) * (55.4 - 35.5));
  if (aqi <= 200) return Math.round(55.5 + ((aqi - 150) / 50) * (150.4 - 55.5));
  if (aqi <= 300) return Math.round(150.5 + ((aqi - 200) / 100) * (250.4 - 150.5));
  if (aqi <= 400) return Math.round(250.5 + ((aqi - 300) / 100) * (350.4 - 250.5));
  if (aqi <= 500) return Math.round(350.5 + ((aqi - 400) / 100) * (500 - 350.5));
  // Beyond 500 emergency scale
  return Math.round(500 + (aqi - 500) * 1.5);
}

/**
 * Commute Inhalation Multipliers based on ventilation, direct exhaust exposure, and breathing rate
 */
export function getCommuteExposureWeight(method: CommuteMethod): number {
  switch (method) {
    case 'walking_cycling':
      return 1.8; // High tidal volume, heavy physical exertion right beside exhaust
    case 'two_wheeler_motorcycle':
      return 1.6; // Direct exposure to tailpipes, low physical exertion
    case 'public_transit_bus_metro':
      return 0.8; // Shared cabin, intermittent door openings
    case 'private_car_ice':
      return 1.0; // Moderate infiltration, depends on recirculate setting
    case 'carpool_ev':
      return 0.65; // Modern cabin filters, zero direct exhaust tailpipe
    case 'work_from_home':
      return 0.15; // Minimal outdoor transit exposure
  }
}

/**
 * Indoor infiltration factor based on building envelope tightness
 */
export function getInfiltrationFactor(ventilation: VentilationType): number {
  switch (ventilation) {
    case 'natural_drafty':
      return 0.75; // 75% of outdoor PM penetrates indoors
    case 'moderately_sealed':
      return 0.50; // 50% penetration
    case 'cross_ventilated':
      return 0.85; // 85% penetration if opened
    case 'tightly_sealed_hvac':
      return 0.20; // 20% penetration
  }
}

/**
 * Internal indoor emission load in µg/m³
 */
export function getIndoorHeatingEmissionLoad(heating: HeatingMethod): number {
  switch (heating) {
    case 'clean_electric_heatpump':
      return 0;
    case 'piped_gas':
      return 15; // Small NO2/ultrafine
    case 'lpg_cylinder':
      return 25; // NO2 + unvented combustion
    case 'kerosene':
      return 85; // Heavy VOCs and fine soot
    case 'biomass_wood_coal':
      return 180; // High PM2.5 and carbon monoxide
    case 'none_or_blankets':
      return 0;
  }
}

/**
 * Proximity factor multiplier
 */
export function getProximityMultiplier(hazard: ProximityHazard): number {
  switch (hazard) {
    case 'near_highway':
      return 1.35; // Black carbon & heavy diesel trucks
    case 'near_industrial':
      return 1.40; // Heavy metals, sulfur, VOCs
    case 'near_agricultural_burn':
      return 1.50; // Severe organic carbon stubble smoke
    case 'dense_urban':
      return 1.15; // High ambient baseline
    case 'suburban':
      return 1.0;
  }
}

/**
 * Calculates WHO baseline comparison and equivalent cigarettes
 * Berkeley Earth approximation: ~22 µg/m³ PM2.5 per 24 hours ≈ 1 cigarette
 */
export function calculateEquivalentCigarettes(pm25MicrogramsInhaled: number): number {
  // Average human inhales ~15 m³ of air per day
  // Concentration = pm25MicrogramsInhaled / 15
  const dailyAvgConcentration = pm25MicrogramsInhaled / 15;
  const cigarettes = dailyAvgConcentration / 22;
  return Math.max(0, Math.round(cigarettes * 10) / 10);
}

/**
 * Computes deterministic safe ventilation windows based on thermal inversion
 */
export function computeSafeVentilationWindows(
  currentAQI: number,
  temperatureCelsius: number,
  hasThermalInversion: boolean
): SafeVentilationWindow[] {
  // Thermal inversions usually trap cold air close to the ground until solar heating breaks the cap
  if (hasThermalInversion || temperatureCelsius < 14) {
    const middayDilutionAQI = Math.max(50, Math.round(currentAQI * 0.65));
    return [
      {
        startHour: '12:30',
        endHour: '15:00',
        recommendedAction: 'Rapid 15-minute cross-ventilation through courtyard/leeward windows only',
        reason: 'Maximum solar surface warming breaks nocturnal inversion boundary layer, temporary 35% particulate dilution',
        ambientEstimatedAQI: middayDilutionAQI,
      },
    ];
  }

  // Without strong inversion
  return [
    {
      startHour: '13:00',
      endHour: '16:00',
      recommendedAction: 'Controlled 20-minute window aeration with particulate screen',
      reason: 'Midday wind velocity typically peaks, dispersing stagnant ground emissions',
      ambientEstimatedAQI: Math.max(45, Math.round(currentAQI * 0.75)),
    },
  ];
}

/**
 * Core Deterministic Exposure Calculation Engine
 */
export function computeExposureAnalysis(
  input: SmogContextInput
): DeterministicExposureAnalysis {
  const outdoorPm25 = convertAQIToPm25(input.currentAQI);
  const proximityMul = getProximityMultiplier(input.proximityHazard);
  const effectiveOutdoorPm25 = outdoorPm25 * proximityMul;

  // Infiltration factor
  let infiltration = getInfiltrationFactor(input.ventilationType);
  if (input.airPurifierStatus === 'hepa_commercial') {
    infiltration *= 0.25; // 75% indoor scrubbing
  } else if (input.airPurifierStatus === 'diy_corsi_rosenthal') {
    infiltration *= 0.30; // 70% indoor scrubbing
  } else if (input.airPurifierStatus === 'standard_fan_filter') {
    infiltration *= 0.65;
  }

  // Indoor sources
  const indoorHeatingPm = getIndoorHeatingEmissionLoad(input.heatingMethod);
  const cookingPm = input.cookingFuel === 'biomass_firewood' ? 60 : input.cookingFuel === 'lpg' ? 12 : 3;

  const estimatedIndoorPm25 = effectiveOutdoorPm25 * infiltration + indoorHeatingPm + cookingPm;

  // Commute exposure
  const commuteWeight = getCommuteExposureWeight(input.commuteMethod);
  const commuteHours = Math.min(4, input.commuteDurationMinutes / 60);
  const indoorHours = Math.max(0, 24 - commuteHours);

  // Typical ventilation rate: ~0.6 m³/hour at rest, ~1.8 m³/hour during active commute
  const commuteBreathingVolume = commuteHours * (input.commuteMethod === 'walking_cycling' ? 1.8 : 1.0);
  const indoorBreathingVolume = indoorHours * 0.6;

  const inhaledMicrogramsOutdoor = effectiveOutdoorPm25 * commuteBreathingVolume * commuteWeight;
  const inhaledMicrogramsIndoor = estimatedIndoorPm25 * indoorBreathingVolume;
  const totalInhaledMicrograms = Math.round(inhaledMicrogramsOutdoor + inhaledMicrogramsIndoor);

  // WHO 24-hour guideline is 15 µg/m³. For 14 m³ breathing = 210 µg total limit.
  const whoDailyLimitMicrograms = 15 * 14;
  const baselineMultiple = Math.round((totalInhaledMicrograms / whoDailyLimitMicrograms) * 10) / 10;

  // Normalized Exposure Score (0 to 100)
  // 0 - 50: safe/acceptable
  // 51 - 70: elevated
  // 71 - 85: high
  // 86 - 100: critical / extreme
  let rawScore = (input.currentAQI / 500) * 50 + (totalInhaledMicrograms / 600) * 35;
  if (input.hasVulnerableMembers || input.persona === 'respiratory_patient') {
    rawScore += 12;
  }
  if (input.hasThermalInversion) {
    rawScore += 8;
  }
  const exposureScore = Math.min(100, Math.max(5, Math.round(rawScore)));

  // Vulnerability Level
  let vulnerabilityLevel: 'low' | 'moderate' | 'high' | 'extreme' = 'moderate';
  if (exposureScore < 40) vulnerabilityLevel = 'low';
  else if (exposureScore < 65) vulnerabilityLevel = 'moderate';
  else if (exposureScore < 85) vulnerabilityLevel = 'high';
  else vulnerabilityLevel = 'extreme';

  // Peak Exposure Hours
  const peakHours: string[] = [
    '06:00 - 09:30 (Morning Thermal Boundary Layer Compression & Heavy Truck Inflow)',
    '18:30 - 22:30 (Nocturnal Radiational Inversion & Surface Stagnation)',
  ];

  // Automated Risk Alerts
  const riskAlerts: RiskAlert[] = [];

  if (input.currentAQI >= 350) {
    riskAlerts.push({
      id: 'alert-aqi-crit',
      severity: 'critical',
      title: 'Emergency Level Ambient Smog Alert',
      message: `AQI of ${input.currentAQI} poses immediate acute pulmonary and cardiac threats to all demographics.`,
      mitigation: 'Mandate certified N95 respirators outdoors; seal all non-essential building envelope cracks.',
    });
  } else if (input.currentAQI >= 200) {
    riskAlerts.push({
      id: 'alert-aqi-warn',
      severity: 'warning',
      title: 'Very Poor Air Quality Advisory',
      message: `Prolonged exposure at AQI ${input.currentAQI} causes respiratory tract irritation and reduced lung capacity.`,
      mitigation: 'Shift outdoor workouts indoors; avoid strenuous physical exertion outdoors.',
    });
  }

  if (input.heatingMethod === 'biomass_wood_coal' || input.heatingMethod === 'kerosene') {
    riskAlerts.push({
      id: 'alert-solid-fuel',
      severity: 'critical',
      title: 'Hazardous Indoor Combustion Byproducts Detected',
      message: 'Solid biomass or kerosene heating releases high concentrations of fine carbon soot and toxic carbon monoxide.',
      mitigation: 'Transition urgently to radiant electric heating, hot water blankets, or sealed heating pumps.',
    });
  }

  if (input.hasThermalInversion && input.temperatureCelsius <= 10) {
    riskAlerts.push({
      id: 'alert-inversion',
      severity: 'warning',
      title: 'Active Winter Thermal Inversion Trap',
      message: 'Cold ground air trapped under warmer atmospheric cap is suppressing vertical air dispersion.',
      mitigation: 'Never open windows between 06:00-09:30 or after sunset; aerate only during peak solar dilution.',
    });
  }

  if (input.persona === 'respiratory_patient' || input.hasVulnerableMembers) {
    riskAlerts.push({
      id: 'alert-vulnerable-pulmonary',
      severity: 'critical',
      title: 'High Vulnerability Airway Hyperreactivity Protocol',
      message: 'Pediatric, geriatric, or asthmatic airways experience microvascular inflammation at this exposure level.',
      mitigation: 'Verify 14-day supply of bronchodilators/inhalers; monitor resting oxygen saturation and peak flow.',
    });
  }

  // Safe Ventilation Windows
  const safeWindows = computeSafeVentilationWindows(
    input.currentAQI,
    input.temperatureCelsius,
    input.hasThermalInversion
  );

  return {
    exposureScore,
    vulnerabilityLevel,
    estimatedPm25InhaledMicrogramsPerDay: totalInhaledMicrograms,
    baselineComparisonMultiple: baselineMultiple,
    peakExposureRiskHours: peakHours,
    safeVentilationWindows: safeWindows,
    riskAlerts,
  };
}

/**
 * Validates an AI-generated or parsed object and guarantees a complete, typed plan
 */
export function validateOrFallbackPlan(
  data: unknown,
  fallbackPreset = DEFAULT_PRESET
): CompleteSmogPlan {
  if (!data || typeof data !== 'object') {
    return fallbackPreset.plan;
  }

  const obj = data as Partial<CompleteSmogPlan>;

  // Check if essential engines are present
  if (!obj.routine?.dailySchedule || !Array.isArray(obj.routine.dailySchedule)) {
    return fallbackPreset.plan;
  }

  if (!obj.iaq?.diyHacks || !Array.isArray(obj.iaq.diyHacks)) {
    return fallbackPreset.plan;
  }

  if (!obj.impact?.comparisons || !Array.isArray(obj.impact.comparisons)) {
    return fallbackPreset.plan;
  }

  if (!obj.crisis?.communityPlaybook || !Array.isArray(obj.crisis.communityPlaybook)) {
    return fallbackPreset.plan;
  }

  return {
    timestamp: obj.timestamp || new Date().toISOString(),
    context: obj.context || fallbackPreset.context,
    deterministicAnalysis:
      obj.deterministicAnalysis || computeExposureAnalysis(fallbackPreset.context),
    routine: {
      dailySchedule: obj.routine.dailySchedule.map((item, index) => ({
        id: item.id || `routine-${index}`,
        timeBlock: item.timeBlock || '08:00 - 09:00',
        originalActivity: item.originalActivity || 'Outdoor routine',
        optimizedActivity: item.optimizedActivity || 'Indoor low-emission routine',
        category: item.category || 'Transport',
        exposureReductionPct: typeof item.exposureReductionPct === 'number' ? item.exposureReductionPct : 35,
        explanation: item.explanation || 'Avoids peak winter pollution hours.',
        actionableTip: item.actionableTip || 'Wear a certified N95 respirator.',
      })),
      overallExposureReductionPct:
        typeof obj.routine.overallExposureReductionPct === 'number'
          ? obj.routine.overallExposureReductionPct
          : 45,
      keyHealthBenefit:
        obj.routine.keyHealthBenefit || 'Reduces peak respiratory exposure significantly.',
      optimalOutdoorWindow: obj.routine.optimalOutdoorWindow || '13:00 - 15:00',
    },
    iaq: {
      diyHacks: obj.iaq.diyHacks.map((hack, index) => ({
        id: hack.id || `hack-${index}`,
        title: hack.title || 'DIY Air Filtration Solution',
        difficulty: hack.difficulty || 'Easy',
        estimatedCost: hack.estimatedCost || '$25',
        pmReductionEfficiencyPct:
          typeof hack.pmReductionEfficiencyPct === 'number' ? hack.pmReductionEfficiencyPct : 80,
        buildTimeMinutes: typeof hack.buildTimeMinutes === 'number' ? hack.buildTimeMinutes : 30,
        materials: Array.isArray(hack.materials) ? hack.materials : ['MERV 13 Filter', 'Box Fan'],
        steps: Array.isArray(hack.steps) ? hack.steps : ['Assemble filter to fan', 'Seal edges'],
        scientificRationale: hack.scientificRationale || 'Provides high CADR with low backpressure.',
      })),
      roomByRoomAssessment: Array.isArray(obj.iaq.roomByRoomAssessment)
        ? obj.iaq.roomByRoomAssessment
        : fallbackPreset.plan.iaq.roomByRoomAssessment,
      plantRecommendations: Array.isArray(obj.iaq.plantRecommendations)
        ? obj.iaq.plantRecommendations
        : fallbackPreset.plan.iaq.plantRecommendations,
      criticalCookingProtocol:
        obj.iaq.criticalCookingProtocol ||
        'Run exhaust fans with external dampers; avoid unvented stir-frying.',
      inversionSealingGuide:
        obj.iaq.inversionSealingGuide ||
        'Tape window perimeter seams with removable foam weatherstripping.',
    },
    impact: {
      comparisons: obj.impact.comparisons.map((c, index) => ({
        id: c.id || `impact-${index}`,
        category: c.category || 'Heating',
        currentHabit: c.currentHabit || 'Traditional method',
        sustainableAlternative: c.sustainableAlternative || 'Clean energy alternative',
        dailyPm25AvertedGrams: typeof c.dailyPm25AvertedGrams === 'number' ? c.dailyPm25AvertedGrams : 40,
        monthlyCo2eAvertedKg: typeof c.monthlyCo2eAvertedKg === 'number' ? c.monthlyCo2eAvertedKg : 60,
        estimatedCostImpact: c.estimatedCostImpact || 'Net positive savings',
        healthBenefitSummary: c.healthBenefitSummary || 'Lowers cardiovascular and pulmonary risks.',
      })),
      totalDailyPmAvertedGrams:
        typeof obj.impact.totalDailyPmAvertedGrams === 'number'
          ? obj.impact.totalDailyPmAvertedGrams
          : 120,
      totalMonthlyCo2eAvertedKg:
        typeof obj.impact.totalMonthlyCo2eAvertedKg === 'number'
          ? obj.impact.totalMonthlyCo2eAvertedKg
          : 150,
      annualHealthRiskDropPct:
        typeof obj.impact.annualHealthRiskDropPct === 'number'
          ? obj.impact.annualHealthRiskDropPct
          : 38,
      equivalentCigarettesAvertedMonthly:
        typeof obj.impact.equivalentCigarettesAvertedMonthly === 'number'
          ? obj.impact.equivalentCigarettesAvertedMonthly
          : 45,
    },
    crisis: {
      communityPlaybook: Array.isArray(obj.crisis.communityPlaybook)
        ? obj.crisis.communityPlaybook
        : fallbackPreset.plan.crisis.communityPlaybook,
      crisisScenarios: Array.isArray(obj.crisis.crisisScenarios)
        ? obj.crisis.crisisScenarios
        : fallbackPreset.plan.crisis.crisisScenarios,
    },
    source: obj.source || 'fallback_preset',
  };
}

/**
 * Retrieves the matching preset by persona, or default
 */
export function getPresetByPersona(persona: PersonaType) {
  return ALL_PRESETS[persona] || DEFAULT_PRESET;
}
