import { useState, useEffect } from 'react';
import { WebCustomizationConfig } from '../types/webConfig';
import { webConfigStorage } from '../services/webConfigStorage';
import { syncDocumentBrand } from '../utils/brandSync';

export const useWebConfig = () => {
  const [config, setConfig] = useState<WebCustomizationConfig>(webConfigStorage.getConfig());

  useEffect(() => {
    // Initial sync
    syncDocumentBrand(config);

    const unsubscribe = webConfigStorage.subscribe((newConfig) => {
      setConfig(newConfig);
      syncDocumentBrand(newConfig);
    });
    return unsubscribe;
  }, []);

  const updateConfig = (updater: Partial<WebCustomizationConfig> | ((prev: WebCustomizationConfig) => WebCustomizationConfig)) => {
    const current = webConfigStorage.getConfig();
    const updated = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    webConfigStorage.saveConfig(updated);
  };

  const resetConfig = () => {
    return webConfigStorage.resetToDefault();
  };

  return { config, updateConfig, resetConfig };
};
