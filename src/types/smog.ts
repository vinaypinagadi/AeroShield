/**
 * Strict TypeScript Interfaces for Severe Winter Smog & Urban Air Pollution Mitigation Assistant
 * Zero 'any' types permitted across all modules.
 */

export type PersonaType =
  | 'family_vulnerable'
  | 'outdoor_commuter'
  | 'community_admin'
  | 'respiratory_patient';

export type AQITier =
  | 'good' // 0-50
  | 'moderate' // 51-100
  | 'poor' // 101-200
  | 'very_poor' // 201-300
  | 'severe' // 301-400
  | 'hazardous_emergency'; // 401+

export type VentilationType =
  | 'natural_drafty'
  | 'moderately_sealed'
  | 'tightly_sealed_hvac'
  | 'cross_ventilated';

export type ProximityHazard =
  | 'near_highway'
  | 'near_industrial'
  | 'near_agricultural_burn'
  | 'dense_urban'
  | 'suburban';

export type CommuteMethod =
  | 'walking_cycling'
  | 'two_wheeler_motorcycle'
  | 'public_transit_bus_metro'
  | 'private_car_ice'
  | 'carpool_ev'
  | 'work_from_home';

export type HeatingMethod =
  | 'clean_electric_heatpump'
  | 'piped_gas'
  | 'lpg_cylinder'
  | 'kerosene'
  | 'biomass_wood_coal'
  | 'none_or_blankets';

export type CookingFuel =
  | 'induction_electric'
  | 'piped_natural_gas'
  | 'lpg'
  | 'biomass_firewood';

export type AirPurifierStatus =
  | 'hepa_commercial'
  | 'diy_corsi_rosenthal'
  | 'none'
  | 'standard_fan_filter';

export interface SmogContextInput {
  persona: PersonaType;
  cityName: string;
  currentAQI: number;
  temperatureCelsius: number;
  hasThermalInversion: boolean;
  ventilationType: VentilationType;
  proximityHazard: ProximityHazard;
  commuteMethod: CommuteMethod;
  commuteDurationMinutes: number;
  heatingMethod: HeatingMethod;
  cookingFuel: CookingFuel;
  airPurifierStatus: AirPurifierStatus;
  householdMembersCount: number;
  hasVulnerableMembers: boolean;
  notes?: string;
}

export interface RiskAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  mitigation: string;
}

export interface SafeVentilationWindow {
  startHour: string;
  endHour: string;
  recommendedAction: string;
  reason: string;
  ambientEstimatedAQI: number;
}

export interface DeterministicExposureAnalysis {
  exposureScore: number; // 0 - 100
  vulnerabilityLevel: 'low' | 'moderate' | 'high' | 'extreme';
  estimatedPm25InhaledMicrogramsPerDay: number;
  baselineComparisonMultiple: number; // e.g. 8.4x WHO daily limit
  peakExposureRiskHours: string[];
  safeVentilationWindows: SafeVentilationWindow[];
  riskAlerts: RiskAlert[];
}

export interface RoutineItem {
  id: string;
  timeBlock: string;
  originalActivity: string;
  optimizedActivity: string;
  category: 'Transport' | 'Energy/Heating' | 'Community Action' | 'Indoor Health';
  exposureReductionPct: number;
  explanation: string;
  actionableTip: string;
}

export interface RoutineEngineResult {
  dailySchedule: RoutineItem[];
  overallExposureReductionPct: number;
  keyHealthBenefit: string;
  optimalOutdoorWindow: string;
}

export interface DIYPurifierHack {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  estimatedCost: string;
  pmReductionEfficiencyPct: number;
  buildTimeMinutes: number;
  materials: string[];
  steps: string[];
  scientificRationale: string;
}

export interface RoomIAQAssessment {
  room: string;
  vulnerabilityLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  mainHazardSource: string;
  ventilationTimingAdvice: string;
  immediateAction: string;
}

export interface AirPurifyingPlant {
  name: string;
  scientificName: string;
  targetedPollutants: string[];
  maintenanceEffort: 'Low' | 'Medium';
  placementTip: string;
}

export interface IAQEngineResult {
  diyHacks: DIYPurifierHack[];
  roomByRoomAssessment: RoomIAQAssessment[];
  plantRecommendations: AirPurifyingPlant[];
  criticalCookingProtocol: string;
  inversionSealingGuide: string;
}

export interface ImpactComparisonItem {
  id: string;
  category: 'Heating' | 'Transport' | 'Cooking' | 'Waste/Community';
  currentHabit: string;
  sustainableAlternative: string;
  dailyPm25AvertedGrams: number;
  monthlyCo2eAvertedKg: number;
  estimatedCostImpact: string;
  healthBenefitSummary: string;
}

export interface ImpactEngineResult {
  comparisons: ImpactComparisonItem[];
  totalDailyPmAvertedGrams: number;
  totalMonthlyCo2eAvertedKg: number;
  annualHealthRiskDropPct: number;
  equivalentCigarettesAvertedMonthly: number;
}

export interface CommunityPlaybookItem {
  id: string;
  targetAudience: 'Schools' | 'Apartment Complexes' | 'Neighborhoods' | 'Workplaces';
  triggerCondition: string;
  immediateActionProtocol: string[];
  longTermResilienceStep: string;
}

export interface CrisisScenario {
  id: string;
  scenarioName: string;
  aqiSpike: number;
  triggerDesc: string;
  urgentProtocols: string[];
  emergencyFamilyGuideline: string;
  communityAlertMessage: string;
}

export interface CrisisEngineResult {
  communityPlaybook: CommunityPlaybookItem[];
  crisisScenarios: CrisisScenario[];
}

export interface CompleteSmogPlan {
  timestamp: string;
  context: SmogContextInput;
  deterministicAnalysis: DeterministicExposureAnalysis;
  routine: RoutineEngineResult;
  iaq: IAQEngineResult;
  impact: ImpactEngineResult;
  crisis: CrisisEngineResult;
  source: 'ai_generated' | 'fallback_preset';
}
