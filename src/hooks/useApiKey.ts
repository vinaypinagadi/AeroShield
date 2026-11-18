import { useState, useCallback, useEffect } from 'react';
import { getActiveApiKey } from '../services/aiSmogService';

/**
 * Custom hook for Bring Your Own Key (BYOK) modal and state synchronization.
 */
export function useApiKey() {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isLiveApiKeyActive, setIsLiveApiKeyActive] = useState<boolean>(() => {
    return !!getActiveApiKey();
  });

  const refreshKeyStatus = useCallback(() => {
    setIsLiveApiKeyActive(!!getActiveApiKey());
  }, []);

  const openApiKeyModal = useCallback(() => {
    setIsApiKeyModalOpen(true);
  }, []);

  const closeApiKeyModal = useCallback(() => {
    setIsApiKeyModalOpen(false);
    refreshKeyStatus();
  }, [refreshKeyStatus]);

  useEffect(() => {
    refreshKeyStatus();
  }, [refreshKeyStatus]);

  return {
    isApiKeyModalOpen,
    isLiveApiKeyActive,
    openApiKeyModal,
    closeApiKeyModal,
    refreshKeyStatus,
  };
}
