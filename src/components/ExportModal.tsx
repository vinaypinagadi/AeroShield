import React, { useState } from 'react';
import { Download, Copy, Check, X, FileText, FileCode } from 'lucide-react';
import { CompleteSmogPlan } from '../types/smog';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CompleteSmogPlan;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, plan }) => {
  const [copiedType, setCopiedType] = useState<'md' | 'json' | null>(null);

  if (!isOpen) return null;

  const generateMarkdown = (): string => {
    return `# AeroShield Severe Winter Smog & Urban Air Pollution Mitigation Plan
**Target City / Region:** ${plan.context.cityName}  
**Persona:** ${plan.context.persona}  
**Ambient AQI:** ${plan.context.currentAQI} | **Calculated Exposure Score:** ${plan.deterministicAnalysis.exposureScore}/100 (${plan.deterministicAnalysis.vulnerabilityLevel})  
**Inhaled PM2.5 Dose:** ${plan.deterministicAnalysis.estimatedPm25InhaledMicrogramsPerDay} µg/day (${plan.deterministicAnalysis.baselineComparisonMultiple}x WHO Limit)  
**Optimal Ventilation Window:** ${plan.routine.optimalOutdoorWindow}  
**Plan Generation Timestamp:** ${new Date(plan.timestamp).toLocaleString()}  
**Generation Source:** ${plan.source === 'ai_generated' ? 'Google Gemini 2.5 Flash Structured Inference' : 'Verified Clinical Presets'}

---

## 1. Low-Emission Daily Routine (Module B)
**Key Health Benefit:** ${plan.routine.keyHealthBenefit}  
**Overall Exposure Inhalation Drop:** -${plan.routine.overallExposureReductionPct}%

| Time Block | Category | High-Exposure Habit | Optimized Routine | Inhalation Reduction |
| :--- | :--- | :--- | :--- | :--- |
${plan.routine.dailySchedule
  .map(
    (item) =>
      `| ${item.timeBlock} | ${item.category} | ${item.originalActivity} | ${item.optimizedActivity} | -${item.exposureReductionPct}% |`
  )
  .join('\n')}

---

## 2. Indoor Air Quality (IAQ) & DIY Mitigation Hacks (Module C)
### DIY Air Purifiers
${plan.iaq.diyHacks
  .map(
    (h) => `### ${h.title} (${h.difficulty} | Cost: ${h.estimatedCost} | Efficiency: ${h.pmReductionEfficiencyPct}% CADR)
- **Build Time:** ${h.buildTimeMinutes} minutes
- **Materials:** ${h.materials.join(', ')}
- **Assembly Steps:**
${h.steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}
- **Scientific Rationale:** ${h.scientificRationale}
`
  )
  .join('\n')}

### Room-By-Room IAQ Assessment
${plan.iaq.roomByRoomAssessment
  .map(
    (r) => `- **${r.room}** (${r.vulnerabilityLevel} Risk): Source: ${r.mainHazardSource}. Ventilation: ${r.ventilationTimingAdvice}. Action: ${r.immediateAction}`
  )
  .join('\n')}

### Critical Protocols
- **Kitchen Cooking:** ${plan.iaq.criticalCookingProtocol}
- **Inversion Window Sealing:** ${plan.iaq.inversionSealingGuide}

---

## 3. Sustainable Alternatives & Impact Modeling (Module D)
- **Total Daily PM2.5 Averted:** ${plan.impact.totalDailyPmAvertedGrams} grams/day
- **Total Monthly CO2e Averted:** ${plan.impact.totalMonthlyCo2eAvertedKg} kg CO2e
- **Equivalent Cigarettes Averted:** ~${plan.impact.equivalentCigarettesAvertedMonthly} cigs/month
- **Annual Pulmonary Risk Reduction:** -${plan.impact.annualHealthRiskDropPct}%

### Habit Interventions:
${plan.impact.comparisons
  .map(
    (c) => `- **[${c.category}]** Replace: *"${c.currentHabit}"* → Alternative: *"${c.sustainableAlternative}"*
  - Daily PM2.5 Averted: ${c.dailyPm25AvertedGrams}g | Monthly CO2e: ${c.monthlyCo2eAvertedKg}kg | Cost: ${c.estimatedCostImpact}
  - Health Benefit: ${c.healthBenefitSummary}`
  )
  .join('\n')}

---

## 4. Community Playbook & Crisis Simulation (Module E)
### Community Action Protocols:
${plan.crisis.communityPlaybook
  .map(
    (cp) => `### ${cp.targetAudience} (Trigger: ${cp.triggerCondition})
${cp.immediateActionProtocol.map((p) => `- ${p}`).join('\n')}
- **Long-Term Step:** ${cp.longTermResilienceStep}
`
  )
  .join('\n')}

### Crisis Scenarios Simulated:
${plan.crisis.crisisScenarios
  .map(
    (cs) => `### ${cs.scenarioName} (AQI Spike: ${cs.aqiSpike}+)
- **Trigger:** ${cs.triggerDesc}
- **Family Directive:** ${cs.emergencyFamilyGuideline}
- **Urgent Protocols:**
${cs.urgentProtocols.map((p) => `  - ${p}`).join('\n')}
- **Community Alert Broadcast:** "${cs.communityAlertMessage}"
`
  )
  .join('\n')}
`;
  };

  const handleDownload = (format: 'md' | 'json') => {
    const filename = `aero-shield-smog-plan-${plan.context.cityName.toLowerCase().replace(/\s+/g, '-') || 'plan'}.${format}`;
    let content = '';
    let mimeType = '';

    if (format === 'md') {
      content = generateMarkdown();
      mimeType = 'text/markdown;charset=utf-8';
    } else {
      content = JSON.stringify(plan, null, 2);
      mimeType = 'application/json;charset=utf-8';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (format: 'md' | 'json') => {
    const text = format === 'md' ? generateMarkdown() : JSON.stringify(plan, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedType(format);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 id="export-modal-title" className="text-xl font-bold tracking-tight text-white">
              Export Mitigation Plan
            </h2>
            <p className="text-xs text-slate-400">
              Download or copy your personalized winter smog mitigation strategy
            </p>
          </div>
        </div>

        <div className="space-y-3.5 my-5">
          {/* Markdown Option */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-bold text-white block">Markdown Report (.md)</span>
                <span className="text-xs text-slate-400 leading-snug">
                  Comprehensive formatted document with routines, DIY guides, and crisis alerts.
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy('md')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy Markdown"
              >
                {copiedType === 'md' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDownload('md')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow"
              >
                Download
              </button>
            </div>
          </div>

          {/* JSON Option */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <FileCode className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-bold text-white block">Structured JSON (.json)</span>
                <span className="text-xs text-slate-400 leading-snug">
                  Machine-readable data for automated telemetry, IoT air filters, or API ingestion.
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy('json')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy JSON"
              >
                {copiedType === 'json' ? (
                  <Check className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDownload('json')}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow"
              >
                Download
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
