import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getActiveApiKey,
  setActiveApiKey,
  isKeyPersistedInLocalStorage,
  generatePersonalizedSmogPlan,
} from '../aiSmogService';
import { SmogContextInput } from '../../types/smog';

describe('aiSmogService & BYOK Security Architecture', () => {
  const mockSessionStorage: Record<string, string> = {};
  const mockLocalStorage: Record<string, string> = {};

  const makeStorage = (store: Record<string, string>): Storage => ({
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = String(v);
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k];
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
    length: Object.keys(store).length,
  });

  beforeEach(() => {
    for (const key of Object.keys(mockSessionStorage)) delete mockSessionStorage[key];
    for (const key of Object.keys(mockLocalStorage)) delete mockLocalStorage[key];

    vi.stubGlobal('sessionStorage', makeStorage(mockSessionStorage));
    vi.stubGlobal('localStorage', makeStorage(mockLocalStorage));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('API Key Storage & Retrieval (BYOK)', () => {
    it('returns null when no key is set', () => {
      expect(getActiveApiKey()).toBeNull();
      expect(isKeyPersistedInLocalStorage()).toBe(false);
    });

    it('stores key in sessionStorage by default (ephemeral session)', () => {
      setActiveApiKey('AIzaSy_test_session_key', false);
      expect(mockSessionStorage['aero_gemini_api_key']).toBe('AIzaSy_test_session_key');
      expect(mockLocalStorage['aero_gemini_api_key']).toBeUndefined();
      expect(getActiveApiKey()).toBe('AIzaSy_test_session_key');
      expect(isKeyPersistedInLocalStorage()).toBe(false);
    });

    it('stores key in localStorage when rememberInLocalStorage is true', () => {
      setActiveApiKey('AIzaSy_test_local_key', true);
      expect(mockLocalStorage['aero_gemini_api_key']).toBe('AIzaSy_test_local_key');
      expect(mockLocalStorage['aero_gemini_key_persist']).toBe('true');
      expect(mockSessionStorage['aero_gemini_api_key']).toBeUndefined();
      expect(getActiveApiKey()).toBe('AIzaSy_test_local_key');
      expect(isKeyPersistedInLocalStorage()).toBe(true);
    });

    it('clears key from both storage targets when null or empty is passed', () => {
      setActiveApiKey('AIzaSy_temp', true);
      expect(getActiveApiKey()).toBe('AIzaSy_temp');

      setActiveApiKey(null);
      expect(getActiveApiKey()).toBeNull();
      expect(mockSessionStorage['aero_gemini_api_key']).toBeUndefined();
      expect(mockLocalStorage['aero_gemini_api_key']).toBeUndefined();
      expect(mockLocalStorage['aero_gemini_key_persist']).toBeUndefined();
    });

    it('trims whitespace from entered keys', () => {
      setActiveApiKey('   AIzaSy_with_spaces   ', false);
      expect(getActiveApiKey()).toBe('AIzaSy_with_spaces');
    });
  });

  describe('Zero-Key Evaluation & Fallback Plan Generation', () => {
    const testContext: SmogContextInput = {
      persona: 'family_vulnerable',
      cityName: 'Delhi NCR',
      currentAQI: 420,
      temperatureCelsius: 8,
      hasThermalInversion: true,
      hasVulnerableMembers: true,
      ventilationType: 'natural_drafty',
      commuteMethod: 'walking_cycling',
      commuteDurationMinutes: 45,
      heatingMethod: 'biomass_wood_coal',
      cookingFuel: 'lpg',
      airPurifierStatus: 'none',
      proximityHazard: 'near_highway',
      householdMembersCount: 4,
    };

    it('returns calibrated fallback preset when no API key is provided', async () => {
      const result = await generatePersonalizedSmogPlan(testContext);

      expect(result.plan).toBeDefined();
      expect(result.plan.source).toBe('fallback_preset');
      expect(result.plan.context.currentAQI).toBe(420);
      expect(result.plan.deterministicAnalysis.exposureScore).toBeGreaterThan(70);
      expect(result.plan.routine.dailySchedule.length).toBeGreaterThan(0);
      expect(result.plan.iaq.diyHacks.length).toBeGreaterThan(0);
      expect(result.plan.impact.comparisons.length).toBeGreaterThan(0);
      expect(result.plan.crisis.crisisScenarios.length).toBeGreaterThan(0);
    });

    it('falls back gracefully to verified baseline when API call fails with invalid key', async () => {
      const result = await generatePersonalizedSmogPlan(testContext, 'invalid_fake_key_12345');

      expect(result.plan).toBeDefined();
      expect(result.plan.source).toBe('fallback_preset');
      expect(result.error).toBeDefined();
      expect(result.plan.deterministicAnalysis.baselineComparisonMultiple).toBeGreaterThan(1);
    });
  });
});
