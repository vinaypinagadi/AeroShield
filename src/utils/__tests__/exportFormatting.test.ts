import { describe, it, expect } from 'vitest';
import { DEFAULT_PRESET, ALL_PRESETS } from '../../data/presets';
import { CompleteSmogPlan } from '../../types/smog';

/**
 * Validates that mitigation plans export flawlessly to structured JSON and markdown reports.
 */
describe('Export Formatting & Report Integrity Engine', () => {
  const plan: CompleteSmogPlan = DEFAULT_PRESET.plan;

  it('exports plan to valid structured JSON', () => {
    const jsonString = JSON.stringify(plan, null, 2);
    expect(jsonString).toBeTruthy();

    const parsed = JSON.parse(jsonString);
    expect(parsed.context.cityName).toBe(plan.context.cityName);
    expect(parsed.deterministicAnalysis.exposureScore).toBe(plan.deterministicAnalysis.exposureScore);
    expect(parsed.routine.dailySchedule.length).toBe(plan.routine.dailySchedule.length);
    expect(parsed.iaq.diyHacks.length).toBe(plan.iaq.diyHacks.length);
    expect(parsed.impact.comparisons.length).toBe(plan.impact.comparisons.length);
    expect(parsed.crisis.crisisScenarios.length).toBe(plan.crisis.crisisScenarios.length);
  });

  it('contains zero NaN, null, or undefined values across all preset calculations', () => {
    for (const preset of Object.values(ALL_PRESETS)) {
      const p = preset.plan;
      expect(Number.isFinite(p.deterministicAnalysis.exposureScore)).toBe(true);
      expect(Number.isFinite(p.deterministicAnalysis.estimatedPm25InhaledMicrogramsPerDay)).toBe(true);
      expect(Number.isFinite(p.deterministicAnalysis.baselineComparisonMultiple)).toBe(true);
      expect(Number.isFinite(p.routine.overallExposureReductionPct)).toBe(true);
      expect(Number.isFinite(p.impact.totalDailyPmAvertedGrams)).toBe(true);
      expect(Number.isFinite(p.impact.totalMonthlyCo2eAvertedKg)).toBe(true);
      expect(Number.isFinite(p.impact.annualHealthRiskDropPct)).toBe(true);

      // Verify each routine item has positive reduction
      for (const item of p.routine.dailySchedule) {
        expect(item.timeBlock).toBeTruthy();
        expect(item.optimizedActivity).toBeTruthy();
        expect(item.exposureReductionPct).toBeGreaterThan(0);
      }

      // Verify each DIY hack has materials and steps
      for (const hack of p.iaq.diyHacks) {
        expect(hack.title).toBeTruthy();
        expect(hack.materials.length).toBeGreaterThan(0);
        expect(hack.steps.length).toBeGreaterThan(0);
        expect(hack.pmReductionEfficiencyPct).toBeGreaterThan(0);
      }

      // Verify each crisis scenario has protocols and broadcast message
      for (const cs of p.crisis.crisisScenarios) {
        expect(cs.scenarioName).toBeTruthy();
        expect(cs.urgentProtocols.length).toBeGreaterThan(0);
        expect(cs.communityAlertMessage).toBeTruthy();
      }
    }
  });

  it('generates fully formatted markdown without placeholder tokens', () => {
    const markdown = `# AeroShield Severe Winter Smog & Urban Air Pollution Mitigation Plan
**Target City / Region:** ${plan.context.cityName}  
**Persona:** ${plan.context.persona}  
**Ambient AQI:** ${plan.context.currentAQI} | **Calculated Exposure Score:** ${plan.deterministicAnalysis.exposureScore}/100 (${plan.deterministicAnalysis.vulnerabilityLevel})  
**Inhaled PM2.5 Dose:** ${plan.deterministicAnalysis.estimatedPm25InhaledMicrogramsPerDay} µg/day (${plan.deterministicAnalysis.baselineComparisonMultiple}x WHO Limit)  
**Optimal Ventilation Window:** ${plan.routine.optimalOutdoorWindow}  

## 1. Low-Emission Daily Routine
${plan.routine.dailySchedule.map((s) => `- [${s.timeBlock}] ${s.optimizedActivity} (-${s.exposureReductionPct}%)`).join('\n')}

## 2. Indoor Air Quality (IAQ) & DIY Hacks
${plan.iaq.diyHacks.map((h) => `### ${h.title}\nCost: ${h.estimatedCost} | Removal: ${h.pmReductionEfficiencyPct}%`).join('\n\n')}

## 3. Sustainable Alternatives & Impact Modeling
- Total Daily PM2.5 Averted: ${plan.impact.totalDailyPmAvertedGrams}g
- Total Monthly CO2e Averted: ${plan.impact.totalMonthlyCo2eAvertedKg}kg

## 4. Community Playbook & Crisis Simulation
${plan.crisis.crisisScenarios.map((c) => `### ${c.scenarioName}\nBroadcast: "${c.communityAlertMessage}"`).join('\n\n')}
`;

    expect(markdown).toContain('AeroShield');
    expect(markdown).toContain('Low-Emission Daily Routine');
    expect(markdown).toContain('Indoor Air Quality (IAQ)');
    expect(markdown).toContain('Sustainable Alternatives & Impact Modeling');
    expect(markdown).toContain('Community Playbook & Crisis Simulation');
    expect(markdown).not.toContain('undefined');
    expect(markdown).not.toContain('NaN');
  });
});
