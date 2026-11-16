/**
 * AI Service for Severe Winter Smog & Urban Air Pollution Mitigation Assistant
 * Integrates Google Gemini 2.5 Flash with strict JSON Schema outputs.
 * Supports Bring Your Own Key (BYOK) and graceful zero-key Demo Fallbacks.
 */

import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';
import { CompleteSmogPlan, SmogContextInput } from '../types/smog';
import {
  computeExposureAnalysis,
  getPresetByPersona,
  validateOrFallbackPlan,
} from '../utils/smogLogic';

const STORAGE_KEY = 'aero_gemini_api_key';
const STORAGE_PREFERENCE = 'aero_gemini_key_persist';

/**
 * Retrieves the active API key from sessionStorage, localStorage, or Vite environment variables.
 */
export function getActiveApiKey(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Session Storage (higher priority for secure ephemeral sessions)
  const sessionKey = window.sessionStorage.getItem(STORAGE_KEY);
  if (sessionKey && sessionKey.trim().length > 0) {
    return sessionKey.trim();
  }

  // 2. Local Storage (user explicitly chose to remember key)
  const localKey = window.localStorage.getItem(STORAGE_KEY);
  if (localKey && localKey.trim().length > 0) {
    return localKey.trim();
  }

  // 3. Environment Variable (from .env.local or build environment)
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }

  return null;
}

/**
 * Saves or clears API key in client storage
 */
export function setActiveApiKey(key: string | null, rememberInLocalStorage = false): void {
  if (typeof window === 'undefined') return;

  if (!key || key.trim().length === 0) {
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STORAGE_PREFERENCE);
    return;
  }

  const cleanKey = key.trim();
  if (rememberInLocalStorage) {
    window.localStorage.setItem(STORAGE_KEY, cleanKey);
    window.localStorage.setItem(STORAGE_PREFERENCE, 'true');
    window.sessionStorage.removeItem(STORAGE_KEY);
  } else {
    window.sessionStorage.setItem(STORAGE_KEY, cleanKey);
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STORAGE_PREFERENCE);
  }
}

/**
 * Checks if key storage preference is local
 */
export function isKeyPersistedInLocalStorage(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_PREFERENCE) === 'true';
}

/**
 * Sanitizes input text against prompt injection or malicious escape sequences
 */
function sanitizeText(input: string, maxLength = 300): string {
  if (!input) return '';
  return input
    .replace(/[<>{}[\\]]/g, '') // remove brackets/tags
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Complete Structured JSON Schema for Gemini 2.5 Flash
 */
const planResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    routine: {
      type: SchemaType.OBJECT,
      properties: {
        dailySchedule: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              timeBlock: { type: SchemaType.STRING },
              originalActivity: { type: SchemaType.STRING },
              optimizedActivity: { type: SchemaType.STRING },
              category: {
                type: SchemaType.STRING,
                description: 'One of: Transport, Energy/Heating, Community Action, Indoor Health',
              },
              exposureReductionPct: { type: SchemaType.NUMBER },
              explanation: { type: SchemaType.STRING },
              actionableTip: { type: SchemaType.STRING },
            },
            required: [
              'timeBlock',
              'originalActivity',
              'optimizedActivity',
              'category',
              'exposureReductionPct',
              'explanation',
              'actionableTip',
            ],
          },
        },
        overallExposureReductionPct: { type: SchemaType.NUMBER },
        keyHealthBenefit: { type: SchemaType.STRING },
        optimalOutdoorWindow: { type: SchemaType.STRING },
      },
      required: [
        'dailySchedule',
        'overallExposureReductionPct',
        'keyHealthBenefit',
        'optimalOutdoorWindow',
      ],
    },
    iaq: {
      type: SchemaType.OBJECT,
      properties: {
        diyHacks: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              title: { type: SchemaType.STRING },
              difficulty: { type: SchemaType.STRING },
              estimatedCost: { type: SchemaType.STRING },
              pmReductionEfficiencyPct: { type: SchemaType.NUMBER },
              buildTimeMinutes: { type: SchemaType.NUMBER },
              materials: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              steps: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              scientificRationale: { type: SchemaType.STRING },
            },
            required: [
              'title',
              'difficulty',
              'estimatedCost',
              'pmReductionEfficiencyPct',
              'buildTimeMinutes',
              'materials',
              'steps',
              'scientificRationale',
            ],
          },
        },
        roomByRoomAssessment: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              room: { type: SchemaType.STRING },
              vulnerabilityLevel: { type: SchemaType.STRING },
              mainHazardSource: { type: SchemaType.STRING },
              ventilationTimingAdvice: { type: SchemaType.STRING },
              immediateAction: { type: SchemaType.STRING },
            },
            required: [
              'room',
              'vulnerabilityLevel',
              'mainHazardSource',
              'ventilationTimingAdvice',
              'immediateAction',
            ],
          },
        },
        plantRecommendations: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING },
              scientificName: { type: SchemaType.STRING },
              targetedPollutants: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              maintenanceEffort: { type: SchemaType.STRING },
              placementTip: { type: SchemaType.STRING },
            },
            required: ['name', 'scientificName', 'targetedPollutants', 'maintenanceEffort', 'placementTip'],
          },
        },
        criticalCookingProtocol: { type: SchemaType.STRING },
        inversionSealingGuide: { type: SchemaType.STRING },
      },
      required: [
        'diyHacks',
        'roomByRoomAssessment',
        'plantRecommendations',
        'criticalCookingProtocol',
        'inversionSealingGuide',
      ],
    },
    impact: {
      type: SchemaType.OBJECT,
      properties: {
        comparisons: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              category: { type: SchemaType.STRING },
              currentHabit: { type: SchemaType.STRING },
              sustainableAlternative: { type: SchemaType.STRING },
              dailyPm25AvertedGrams: { type: SchemaType.NUMBER },
              monthlyCo2eAvertedKg: { type: SchemaType.NUMBER },
              estimatedCostImpact: { type: SchemaType.STRING },
              healthBenefitSummary: { type: SchemaType.STRING },
            },
            required: [
              'category',
              'currentHabit',
              'sustainableAlternative',
              'dailyPm25AvertedGrams',
              'monthlyCo2eAvertedKg',
              'estimatedCostImpact',
              'healthBenefitSummary',
            ],
          },
        },
        totalDailyPmAvertedGrams: { type: SchemaType.NUMBER },
        totalMonthlyCo2eAvertedKg: { type: SchemaType.NUMBER },
        annualHealthRiskDropPct: { type: SchemaType.NUMBER },
        equivalentCigarettesAvertedMonthly: { type: SchemaType.NUMBER },
      },
      required: [
        'comparisons',
        'totalDailyPmAvertedGrams',
        'totalMonthlyCo2eAvertedKg',
        'annualHealthRiskDropPct',
        'equivalentCigarettesAvertedMonthly',
      ],
    },
    crisis: {
      type: SchemaType.OBJECT,
      properties: {
        communityPlaybook: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              targetAudience: { type: SchemaType.STRING },
              triggerCondition: { type: SchemaType.STRING },
              immediateActionProtocol: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              longTermResilienceStep: { type: SchemaType.STRING },
            },
            required: [
              'targetAudience',
              'triggerCondition',
              'immediateActionProtocol',
              'longTermResilienceStep',
            ],
          },
        },
        crisisScenarios: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              scenarioName: { type: SchemaType.STRING },
              aqiSpike: { type: SchemaType.NUMBER },
              triggerDesc: { type: SchemaType.STRING },
              urgentProtocols: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              emergencyFamilyGuideline: { type: SchemaType.STRING },
              communityAlertMessage: { type: SchemaType.STRING },
            },
            required: [
              'scenarioName',
              'aqiSpike',
              'triggerDesc',
              'urgentProtocols',
              'emergencyFamilyGuideline',
              'communityAlertMessage',
            ],
          },
        },
      },
      required: ['communityPlaybook', 'crisisScenarios'],
    },
  },
  required: ['routine', 'iaq', 'impact', 'crisis'],
};

/**
 * Main AI Generation Routine with Fallback Presets
 */
export async function generatePersonalizedSmogPlan(
  context: SmogContextInput,
  apiKeyOverride?: string
): Promise<{ plan: CompleteSmogPlan; error?: string }> {
  // Always compute deterministic baseline first (exposure score, WHO comparison, safe windows)
  const deterministicAnalysis = computeExposureAnalysis(context);
  const matchedPreset = getPresetByPersona(context.persona);

  const activeKey = apiKeyOverride || getActiveApiKey();

  // If no API key provided, return rich preset tailored with the live deterministic calculation
  if (!activeKey) {
    return {
      plan: {
        ...matchedPreset.plan,
        timestamp: new Date().toISOString(),
        context,
        deterministicAnalysis,
        source: 'fallback_preset',
      },
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(activeKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: planResponseSchema,
        temperature: 0.2, // low temperature for consistent, scientifically grounded output
      },
    });

    const sanitizedCity = sanitizeText(context.cityName);
    const sanitizedNotes = sanitizeText(context.notes || '');

    const prompt = `
You are an expert Environmental Health Technologist and Winter Smog Mitigation Specialist.
Synthesize a comprehensive, high-precision mitigation plan for severe winter smog and urban air pollution.

USER CONTEXT:
- Persona: ${context.persona}
- City / Region: ${sanitizedCity || 'Metropolitan Urban Area'}
- Ambient AQI: ${context.currentAQI}
- Temperature: ${context.temperatureCelsius}°C
- Thermal Inversion Active: ${context.hasThermalInversion ? 'YES (stagnant boundary layer trap)' : 'NO'}
- Building Ventilation: ${context.ventilationType}
- Proximity to Hazard: ${context.proximityHazard}
- Commute Method: ${context.commuteMethod} (${context.commuteDurationMinutes} mins/day)
- Space Heating Method: ${context.heatingMethod}
- Cooking Fuel: ${context.cookingFuel}
- Indoor Air Purifier: ${context.airPurifierStatus}
- Household Members: ${context.householdMembersCount} (Vulnerable Members: ${context.hasVulnerableMembers ? 'YES' : 'NO'})
- Additional Notes: ${sanitizedNotes || 'None'}

DETERMINISTIC EXPOSURE BASELINE:
- Calculated Exposure Score: ${deterministicAnalysis.exposureScore}/100 (${deterministicAnalysis.vulnerabilityLevel})
- Estimated Inhaled PM2.5: ${deterministicAnalysis.estimatedPm25InhaledMicrogramsPerDay} µg/day (${deterministicAnalysis.baselineComparisonMultiple}x WHO Limit)
- Primary Safe Ventilation Window: ${deterministicAnalysis.safeVentilationWindows[0]?.startHour || '13:00'} - ${deterministicAnalysis.safeVentilationWindows[0]?.endHour || '15:00'}

CRITICAL INSTRUCTIONS:
1. Low-Emission Daily Routine: Reschedule activities away from morning/evening boundary layer inversions (06:00-09:30 and 18:30-22:30). Explain the exact health benefit for each item.
2. IAQ & DIY Mitigation Hacks: Include step-by-step DIY purification (e.g. Corsi-Rosenthal box), room-by-room risk evaluations, window inversion sealing, and natural plant transpiration recommendations.
3. Sustainable Alternatives & Impact: Quantify daily PM2.5 grams averted and monthly CO2e kg averted by replacing dirty heating and commute habits with clean alternatives.
4. Community Playbook & Crisis Simulation: Provide concrete school/apartment emergency protocols and simulate high-spike emergency scenarios (e.g. AQI 500+ stubble surge or freezing power grid outage).

Generate strict JSON matching the schema.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    const validPlan = validateOrFallbackPlan(
      {
        timestamp: new Date().toISOString(),
        context,
        deterministicAnalysis,
        ...parsedData,
        source: 'ai_generated',
      },
      matchedPreset
    );

    return { plan: validPlan };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : 'Failed to generate plan via Gemini API. Switched to verified preset.';

    console.warn('[Gemini AI Service Error]', errorMsg);

    return {
      plan: {
        ...matchedPreset.plan,
        timestamp: new Date().toISOString(),
        context,
        deterministicAnalysis,
        source: 'fallback_preset',
      },
      error: errorMsg,
    };
  }
}
