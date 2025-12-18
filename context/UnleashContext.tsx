'use client';

import { createContext, useContext } from 'react';
import { FlagNames, Flags } from 'lib/services/unleash';

const FeatureFlagContext = createContext<Flags | null>(null);

export function FeatureFlagProvider({ flags, children }: { flags: Flags; children: React.ReactNode }) {
  return <FeatureFlagContext.Provider value={flags}>{children}</FeatureFlagContext.Provider>;
}

export function useFeatureFlag(featureToggleName: FlagNames): boolean {
  const featureContext = useContext(FeatureFlagContext);
  if (!featureContext) throw new Error('FeatureFlagProvider missing');
  return featureContext[featureToggleName];
}
