import { describe, it, expect } from 'vitest';
import {
  getAQITier,
  getAQITierLabel,
  convertAQIToPm25,
  getCommuteExposureWeight,
  getInfiltrationFactor,
  getIndoorHeatingEmissionLoad,
  calculateEquivalentCigarettes,
  computeSafeVentilationWindows,
  computeExposureAnalysis,
  validateOrFallbackPlan,
} from '../smogLogic';
import { SmogContextInput } from '../../types/smog';
import { PRESET_FAMILY_VULNERABLE } from '../../data/presets';

describe('smogLogic deterministic calculations', () => {
  describe('getAQITier', () => {
    it('classifies AQI into correct tiers across breakpoints', () => {
      expect(getAQITier(35)).toBe('good');
      expect(getAQITier(50)).toBe('good');
      expect(getAQITier(51)).toBe('moderate');
      expect(getAQITier(100)).toBe('moderate');
      expect(getAQITier(150)).toBe('poor');
      expect(getAQITier(250)).toBe('very_poor');
      expect(getAQITier(350)).toBe('severe');
      expect(getAQITier(450)).toBe('hazardous_emergency');
    });

    it('returns human-readable labels', () => {
      expect(getAQITierLabel('good')).toContain('Good');
      expect(getAQITierLabel('hazardous_emergency')).toContain('Hazardous');
    });
  });

  describe('convertAQIToPm25', () => {
    it('calculates PM2.5 concentrations realistically', () => {
      expect(convertAQIToPm25(50)).toBe(12);
      expect(convertAQIToPm25(100)).toBe(35);
      expect(convertAQIToPm25(300)).toBe(250);
      expect(convertAQIToPm25(400)).toBe(350);
      expect(convertAQIToPm25(500)).toBe(500);
      expect(convertAQIToPm25(600)).toBeGreaterThan(500);
    });
  });

  describe('Commute and Infiltration exposure weights', () => {
    it('weights walking and two-wheeler higher than EV carpool or WFH', () => {
      const walkWeight = getCommuteExposureWeight('walking_cycling');
      const bikeWeight = getCommuteExposureWeight('two_wheeler_motorcycle');
      const evWeight = getCommuteExposureWeight('carpool_ev');
      const wfhWeight = getCommuteExposureWeight('work_from_home');

      expect(walkWeight).toBeGreaterThan(bikeWeight);
      expect(bikeWeight).toBeGreaterThan(evWeight);
      expect(evWeight).toBeGreaterThan(wfhWeight);
    });

    it('calculates lower infiltration factor for tightly sealed HVAC vs natural drafty', () => {
      const sealed = getInfiltrationFactor('tightly_sealed_hvac');
      const drafty = getInfiltrationFactor('natural_drafty');
      expect(sealed).toBeLessThan(drafty);
      expect(sealed).toBe(0.20);
      expect(drafty).toBe(0.75);
    });

    it('identifies biomass heating as having highest indoor emission load', () => {
      const biomass = getIndoorHeatingEmissionLoad('biomass_wood_coal');
      const electric = getIndoorHeatingEmissionLoad('clean_electric_heatpump');
      const kerosene = getIndoorHeatingEmissionLoad('kerosene');

      expect(biomass).toBeGreaterThan(kerosene);
      expect(kerosene).toBeGreaterThan(electric);
      expect(electric).toBe(0);
    });
  });

  describe('calculateEquivalentCigarettes', () => {
    it('calculates equivalent cigarettes proportionally to inhaled micrograms', () => {
      const lowExposure = calculateEquivalentCigarettes(150);
      const highExposure = calculateEquivalentCigarettes(660);
      expect(highExposure).toBeGreaterThan(lowExposure);
      expect(calculateEquivalentCigarettes(0)).toBe(0);
    });
  });

  describe('computeSafeVentilationWindows', () => {
    it('restricts ventilation to midday solar dilution window during thermal inversion', () => {
      const windowsInversion = computeSafeVentilationWindows(420, 8, true);
      expect(windowsInversion.length).toBeGreaterThan(0);
      expect(windowsInversion[0].startHour).toBe('12:30');
      expect(windowsInversion[0].endHour).toBe('15:00');
      expect(windowsInversion[0].ambientEstimatedAQI).toBeLessThan(420);
    });
  });

  describe('computeExposureAnalysis', () => {
    const testContext: SmogContextInput = {
      persona: 'family_vulnerable',
      cityName: 'Delhi NCR',
      currentAQI: 420,
      temperatureCelsius: 8,
      hasThermalInversion: true,
      ventilationType: 'natural_drafty',
      proximityHazard: 'near_highway',
      commuteMethod: 'two_wheeler_motorcycle',
      commuteDurationMinutes: 60,
      heatingMethod: 'biomass_wood_coal',
      cookingFuel: 'biomass_firewood',
      airPurifierStatus: 'none',
      householdMembersCount: 4,
      hasVulnerableMembers: true,
    };

    it('computes extreme vulnerability and high exposure score under severe conditions', () => {
      const result = computeExposureAnalysis(testContext);
      expect(result.exposureScore).toBeGreaterThanOrEqual(85);
      expect(result.vulnerabilityLevel).toBe('extreme');
      expect(result.estimatedPm25InhaledMicrogramsPerDay).toBeGreaterThan(300);
      expect(result.baselineComparisonMultiple).toBeGreaterThan(15);
      expect(result.riskAlerts.length).toBeGreaterThanOrEqual(3);
    });

    it('generates specific alerts for biomass combustion and inversion', () => {
      const result = computeExposureAnalysis(testContext);
      const alertIds = result.riskAlerts.map((a) => a.id);
      expect(alertIds).toContain('alert-solid-fuel');
      expect(alertIds).toContain('alert-inversion');
      expect(alertIds).toContain('alert-vulnerable-pulmonary');
    });

    it('produces lower exposure scores for protected indoor conditions', () => {
      const safeContext: SmogContextInput = {
        ...testContext,
        currentAQI: 80,
        temperatureCelsius: 18,
        hasThermalInversion: false,
        ventilationType: 'tightly_sealed_hvac',
        proximityHazard: 'suburban',
        commuteMethod: 'work_from_home',
        commuteDurationMinutes: 0,
        heatingMethod: 'clean_electric_heatpump',
        cookingFuel: 'induction_electric',
        airPurifierStatus: 'hepa_commercial',
        hasVulnerableMembers: false,
      };
      const result = computeExposureAnalysis(safeContext);
      expect(result.exposureScore).toBeLessThan(45);
      expect(result.vulnerabilityLevel).toBe('low');
    });
  });

  describe('validateOrFallbackPlan (Schema Fallback Resilience)', () => {
    it('falls back safely when input is null, undefined, or empty object', () => {
      const fallbackResult = validateOrFallbackPlan(null);
      expect(fallbackResult).toBeDefined();
      expect(fallbackResult.routine.dailySchedule.length).toBeGreaterThan(0);
      expect(fallbackResult.iaq.diyHacks.length).toBeGreaterThan(0);
      expect(fallbackResult.impact.comparisons.length).toBeGreaterThan(0);
      expect(fallbackResult.crisis.communityPlaybook.length).toBeGreaterThan(0);
    });

    it('preserves valid parsed AI plan while sanitizing missing properties', () => {
      const partialData = {
        timestamp: '2026-11-16T19:00:00Z',
        routine: {
          dailySchedule: [
            {
              id: 'custom-1',
              timeBlock: '08:00 - 09:00',
              originalActivity: 'Cycling in heavy smog',
              optimizedActivity: 'Metro train with N95 mask',
              category: 'Transport',
              exposureReductionPct: 60,
              explanation: 'Avoids breathing particulate plume',
              actionableTip: 'Press nose clip firmly',
            },
          ],
          overallExposureReductionPct: 58,
          keyHealthBenefit: 'Protects respiratory system',
          optimalOutdoorWindow: '13:00 - 15:00',
        },
        iaq: {
          diyHacks: [
            {
              id: 'h-1',
              title: 'Corsi-Rosenthal Box',
              difficulty: 'Easy',
              estimatedCost: '$30',
              pmReductionEfficiencyPct: 85,
              buildTimeMinutes: 25,
              materials: ['Box fan', 'MERV 13 filters'],
              steps: ['Tape together', 'Power on'],
              scientificRationale: 'High clean air delivery rate',
            },
          ],
        },
        impact: {
          comparisons: [
            {
              id: 'imp-1',
              category: 'Transport',
              currentHabit: 'Petrol car',
              sustainableAlternative: 'Metro rail',
              dailyPm25AvertedGrams: 40,
              monthlyCo2eAvertedKg: 90,
              estimatedCostImpact: 'Save $50/mo',
              healthBenefitSummary: 'Lowers particulate inhalation',
            },
          ],
        },
        crisis: {
          communityPlaybook: [
            {
              id: 'cp-1',
              targetAudience: 'Schools',
              triggerCondition: 'AQI > 300',
              immediateActionProtocol: ['Cancel outdoor games'],
              longTermResilienceStep: 'Install classroom scrubbers',
            },
          ],
        },
      };

      const result = validateOrFallbackPlan(partialData, PRESET_FAMILY_VULNERABLE);
      expect(result.routine.dailySchedule[0].id).toBe('custom-1');
      expect(result.iaq.diyHacks[0].title).toBe('Corsi-Rosenthal Box');
      expect(result.impact.comparisons[0].category).toBe('Transport');
      expect(result.crisis.communityPlaybook[0].targetAudience).toBe('Schools');
    });
  });
});
