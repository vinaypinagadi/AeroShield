import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, X, FileText, FileCode } from 'lucide-react';
import { CompleteSmogPlan } from '../types/smog';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CompleteSmogPlan;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, plan }) => {
  const [copiedType, setCopiedType] = useState<'md' | 'json' | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
          type="button"
          onClick={onClose}
          aria-label="Close export dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Download className="w-6 h-6" aria-hidden="true" />
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

        <div className="space-y-4 my-6">
          {/* Markdown Option */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-800 text-slate-200 rounded-lg">
                <FileText className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              </div>
              <div>
                <strong className="text-sm font-semibold text-white block">
                  Markdown Report (.md)
                </strong>
                <span className="text-xs text-slate-400">
                  Formatted for noticeboards, school memos, or documentation
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy('md')}
                aria-label="Copy Markdown to clipboard"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {copiedType === 'md' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDownload('md')}
                aria-label="Download Markdown file"
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* JSON Option */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-800 text-slate-200 rounded-lg">
                <FileCode className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              </div>
              <div>
                <strong className="text-sm font-semibold text-white block">
                  Structured JSON Data (.json)
                </strong>
                <span className="text-xs text-slate-400">
                  Machine-readable for data integration, IoT gateways, and backups
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy('json')}
                aria-label="Copy JSON to clipboard"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {copiedType === 'json' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDownload('json')}
                aria-label="Download JSON file"
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
