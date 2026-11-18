import { useState, useEffect, useCallback } from 'react';
import { CompleteSmogPlan, PersonaType, SmogContextInput } from '../types/smog';
import { DEFAULT_PRESET, ALL_PRESETS } from '../data/presets';
import { generatePersonalizedSmogPlan } from '../services/aiSmogService';
import { validateOrFallbackPlan } from '../utils/smogLogic';

const SAVED_PLAN_KEY = 'aero_saved_smog_plan';

/**
 * Custom hook encapsulating plan state, localStorage caching, preset loading,
 * and deterministic/generative API synthesis.
 */
export function useSmogPlan(isLiveApiKeyActive: boolean) {
  const [plan, setPlan] = useState<CompleteSmogPlan>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(SAVED_PLAN_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return validateOrFallbackPlan(parsed, DEFAULT_PRESET);
        }
      } catch (err) {
        console.warn('[useSmogPlan] Failed to parse cached plan, falling back to preset', err);
      }
    }
    return DEFAULT_PRESET.plan;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Persist plan changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_PLAN_KEY, JSON.stringify(plan));
    } catch (err) {
      console.warn('[useSmogPlan] Failed to save plan to localStorage', err);
    }
  }, [plan]);

  // 1-Click Instant Demo Preset Loader
  const handleLoadPreset = useCallback((persona: PersonaType) => {
    const preset = ALL_PRESETS[persona] || DEFAULT_PRESET;
    setPlan({
      ...preset.plan,
      timestamp: new Date().toISOString(),
    });
    setStatusMessage(`Loaded verified demo preset for "${preset.name}".`);
    setTimeout(() => setStatusMessage(null), 3500);
  }, []);

  // Form submission handler: calls Gemini API or updates deterministic model
  const handleFormSubmit = useCallback(
    async (context: SmogContextInput) => {
      setIsLoading(true);
      setStatusMessage(
        isLiveApiKeyActive
          ? 'Calling Gemini 2.5 Flash for personalized multi-engine synthesis...'
          : 'Recalculating deterministic exposure model and matching verified clinical preset...'
      );

      try {
        const result = await generatePersonalizedSmogPlan(context);
        setPlan(result.plan);

        if (result.error) {
          setStatusMessage(`Note: ${result.error} (Using calibrated baseline preset)`);
        } else {
          setStatusMessage(
            result.plan.source === 'ai_generated'
              ? '✨ Successfully synthesized custom plan with Gemini 2.5 Flash!'
              : '✓ Plan successfully updated with deterministic exposure model.'
          );
        }
      } catch (err) {
        console.error('[useSmogPlan] Error synthesizing plan:', err);
        setStatusMessage('Error synthesizing plan. Reverted to verified baseline.');
      } finally {
        setIsLoading(false);
        setTimeout(() => setStatusMessage(null), 5000);
      }
    },
    [isLiveApiKeyActive]
  );

  const clearStatusMessage = useCallback(() => {
    setStatusMessage(null);
  }, []);

  return {
    plan,
    setPlan,
    isLoading,
    statusMessage,
    clearStatusMessage,
    handleLoadPreset,
    handleFormSubmit,
  };
}
