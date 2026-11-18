import { describe, it, expect } from 'vitest';
import {
  ALL_PRESETS,
  DEFAULT_PRESET,
} from '../../data/presets';
import {
  convertAQIToPm25,
  getAQITier,
  getAQITierLabel,
  getAQIColorClasses,
  computeExposureAnalysis,
  validateOrFallbackPlan,
  getPresetByPersona,
} from '../smogLogic';
import { PersonaType, SmogContextInput } from '../../types/smog';

describe('AeroShield Scientific Presets & Multi-Engine Data Integrity', () => {
  const allPresetKeys: PersonaType[] = [
    'family_vulnerable',
    'outdoor_commuter',
    'community_admin',
    'respiratory_patient',
  ];

  it('contains complete verified data across all 4 personas', () => {
    for (const key of allPresetKeys) {
      const preset = ALL_PRESETS[key];
      expect(preset).toBeDefined();
      expect(preset.name).toBeTruthy();
      expect(preset.shortDesc).toBeTruthy();
      expect(preset.context.persona).toBe(key);

      // Verify Routine Engine (Module B)
      expect(preset.plan.routine.dailySchedule.length).toBeGreaterThanOrEqual(3);
      expect(preset.plan.routine.overallExposureReductionPct).toBeGreaterThan(0);
      expect(preset.plan.routine.optimalOutdoorWindow).toBeTruthy();

      // Verify IAQ Engine (Module C)
      expect(preset.plan.iaq.diyHacks.length).toBeGreaterThanOrEqual(1);
      expect(preset.plan.iaq.diyHacks[0].steps.length).toBeGreaterThanOrEqual(3);
      expect(preset.plan.iaq.diyHacks[0].materials.length).toBeGreaterThanOrEqual(2);
      expect(preset.plan.iaq.roomByRoomAssessment.length).toBeGreaterThanOrEqual(2);
      expect(preset.plan.iaq.plantRecommendations.length).toBeGreaterThanOrEqual(1);
      expect(preset.plan.iaq.criticalCookingProtocol).toBeTruthy();
      expect(preset.plan.iaq.inversionSealingGuide).toBeTruthy();

      // Verify Impact Engine (Module D)
      expect(preset.plan.impact.comparisons.length).toBeGreaterThanOrEqual(1);
      expect(preset.plan.impact.totalDailyPmAvertedGrams).toBeGreaterThan(0);
      expect(preset.plan.impact.totalMonthlyCo2eAvertedKg).toBeGreaterThan(0);
      expect(preset.plan.impact.annualHealthRiskDropPct).toBeGreaterThan(0);

      // Verify Crisis Engine (Module E)
      expect(preset.plan.crisis.communityPlaybook.length).toBeGreaterThanOrEqual(1);
      expect(preset.plan.crisis.crisisScenarios.length).toBeGreaterThanOrEqual(1);
      expect(preset.plan.crisis.crisisScenarios[0].communityAlertMessage).toBeTruthy();
    }
  });

  it('retrieves default preset safely for unmapped persona', () => {
    const fallback = getPresetByPersona('unknown_persona' as PersonaType);
    expect(fallback).toBe(DEFAULT_PRESET);
  });
});

describe('smogLogic Boundary and Extreme Edge Cases', () => {
  it('handles extreme AQI inputs gracefully', () => {
    // Zero / very low AQI
    expect(convertAQIToPm25(0)).toBe(0);
    expect(convertAQIToPm25(25)).toBe(6);
    expect(getAQITier(0)).toBe('good');
    expect(getAQITierLabel('good')).toBe('Good (0 - 50)');

    // Very high / off-the-charts AQI (500+)
    expect(convertAQIToPm25(500)).toBe(500);
    expect(convertAQIToPm25(800)).toBe(950);
    expect(getAQITier(500)).toBe('hazardous_emergency');
    expect(getAQITier(750)).toBe('hazardous_emergency');
    expect(getAQITierLabel('hazardous_emergency')).toContain('Hazardous');
  });

  it('returns valid color classes for all AQI tiers', () => {
    const goodClasses = getAQIColorClasses(30);
    expect(goodClasses.badge).toContain('emerald');

    const moderateClasses = getAQIColorClasses(75);
    expect(moderateClasses.badge).toContain('amber');

    const poorClasses = getAQIColorClasses(150);
    expect(poorClasses.badge).toContain('orange');

    const veryPoorClasses = getAQIColorClasses(250);
    expect(veryPoorClasses.badge).toContain('rose');

    const severeClasses = getAQIColorClasses(350);
    expect(severeClasses.badge).toContain('purple');

    const hazardousClasses = getAQIColorClasses(450);
    expect(hazardousClasses.badge).toContain('red');
  });

  it('correctly models all proximity hazard multipliers', () => {
    const baseContext: SmogContextInput = {
      persona: 'outdoor_commuter',
      cityName: 'Testville',
      currentAQI: 300,
      temperatureCelsius: 10,
      hasThermalInversion: true,
      hasVulnerableMembers: false,
      ventilationType: 'natural_drafty',
      commuteMethod: 'walking_cycling',
      commuteDurationMinutes: 60,
      heatingMethod: 'clean_electric_heatpump',
      cookingFuel: 'induction_electric',
      airPurifierStatus: 'none',
      proximityHazard: 'suburban',
      householdMembersCount: 2,
    };

    const parkAnalysis = computeExposureAnalysis(baseContext);

    const highwayAnalysis = computeExposureAnalysis({
      ...baseContext,
      proximityHazard: 'near_highway',
    });

    const stubbleAnalysis = computeExposureAnalysis({
      ...baseContext,
      proximityHazard: 'near_agricultural_burn',
    });

    const industrialAnalysis = computeExposureAnalysis({
      ...baseContext,
      proximityHazard: 'near_industrial',
    });

    expect(highwayAnalysis.estimatedPm25InhaledMicrogramsPerDay).toBeGreaterThan(
      parkAnalysis.estimatedPm25InhaledMicrogramsPerDay
    );
    expect(stubbleAnalysis.estimatedPm25InhaledMicrogramsPerDay).toBeGreaterThan(
      highwayAnalysis.estimatedPm25InhaledMicrogramsPerDay
    );
    expect(industrialAnalysis.estimatedPm25InhaledMicrogramsPerDay).toBeGreaterThan(
      parkAnalysis.estimatedPm25InhaledMicrogramsPerDay
    );
  });

  it('correctly factors air purifier statuses', () => {
    const baseContext: SmogContextInput = {
      persona: 'family_vulnerable',
      cityName: 'Urban Basin',
      currentAQI: 350,
      temperatureCelsius: 6,
      hasThermalInversion: true,
      hasVulnerableMembers: true,
      ventilationType: 'cross_ventilated',
      commuteMethod: 'work_from_home',
      commuteDurationMinutes: 0,
      heatingMethod: 'clean_electric_heatpump',
      cookingFuel: 'induction_electric',
      airPurifierStatus: 'none',
      proximityHazard: 'suburban',
      householdMembersCount: 4,
    };

    const noPurifier = computeExposureAnalysis({ ...baseContext, airPurifierStatus: 'none' });
    const diyPurifier = computeExposureAnalysis({ ...baseContext, airPurifierStatus: 'diy_corsi_rosenthal' });
    const fanFilter = computeExposureAnalysis({ ...baseContext, airPurifierStatus: 'standard_fan_filter' });
    const wholeHome = computeExposureAnalysis({ ...baseContext, airPurifierStatus: 'hepa_commercial' });

    expect(diyPurifier.estimatedPm25InhaledMicrogramsPerDay).toBeLessThan(
      noPurifier.estimatedPm25InhaledMicrogramsPerDay
    );
    expect(wholeHome.estimatedPm25InhaledMicrogramsPerDay).toBeLessThan(
      fanFilter.estimatedPm25InhaledMicrogramsPerDay
    );
  });

  it('generates clinical risk alerts for vulnerable members and extreme AQI', () => {
    const extremeContext: SmogContextInput = {
      persona: 'respiratory_patient',
      cityName: 'Basin Metro',
      currentAQI: 460,
      temperatureCelsius: 4,
      hasThermalInversion: true,
      hasVulnerableMembers: true,
      ventilationType: 'natural_drafty',
      commuteMethod: 'two_wheeler_motorcycle',
      commuteDurationMinutes: 60,
      heatingMethod: 'biomass_wood_coal',
      cookingFuel: 'biomass_firewood',
      airPurifierStatus: 'none',
      proximityHazard: 'near_agricultural_burn',
      householdMembersCount: 5,
    };

    const analysis = computeExposureAnalysis(extremeContext);
    expect(analysis.riskAlerts.length).toBeGreaterThan(0);
    const criticalAlerts = analysis.riskAlerts.filter((a) => a.severity === 'critical');
    expect(criticalAlerts.length).toBeGreaterThanOrEqual(1);
    expect(analysis.vulnerabilityLevel).toBe('extreme');
  });

  it('validates or falls back defensively against corrupted or invalid plan payloads', () => {
    // Null payload
    expect(validateOrFallbackPlan(null)).toBe(DEFAULT_PRESET.plan);

    // Non-object
    expect(validateOrFallbackPlan('invalid string')).toBe(DEFAULT_PRESET.plan);
    expect(validateOrFallbackPlan(12345)).toBe(DEFAULT_PRESET.plan);

    // Missing engines
    expect(validateOrFallbackPlan({ routine: {} })).toBe(DEFAULT_PRESET.plan);
    expect(validateOrFallbackPlan({ routine: { dailySchedule: [] } })).toBe(DEFAULT_PRESET.plan);

    // Valid partial with missing sub-fields
    const partialValid = {
      timestamp: '2026-11-18T10:00:00Z',
      routine: {
        dailySchedule: [
          {
            timeBlock: '07:00 - 08:00',
            originalActivity: 'Morning Jogging',
            optimizedActivity: 'Indoor Yoga',
          },
        ],
      },
      iaq: {
        diyHacks: [
          {
            title: 'Test Corsi-Rosenthal Box',
          },
        ],
      },
      impact: {
        comparisons: [
          {
            category: 'Heating',
            currentHabit: 'Wood fire',
            sustainableAlternative: 'Heat pump',
          },
        ],
      },
      crisis: {
        communityPlaybook: [],
        crisisScenarios: [],
      },
    };

    const sanitized = validateOrFallbackPlan(partialValid);
    expect(sanitized.routine.dailySchedule[0].optimizedActivity).toBe('Indoor Yoga');
    expect(sanitized.routine.dailySchedule[0].exposureReductionPct).toBe(35); // fallback default
    expect(sanitized.iaq.diyHacks[0].title).toBe('Test Corsi-Rosenthal Box');
    expect(sanitized.iaq.diyHacks[0].pmReductionEfficiencyPct).toBe(80); // fallback default
  });
});
