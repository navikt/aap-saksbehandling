'use server'

import { cookies } from 'next/headers';
import { evaluateFlags, flagsClient, getDefinitions } from '@unleash/nextjs';
import { FeatureToggle } from './featureToggle';
import { logError } from '../../serverutlis/logger';

export const erFeatureAktivert = async (toggleNavn: FeatureToggle) => {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('unleash-session-id')?.value || `${Math.floor(Math.random() * 1_000_000_000)}`;

    const definisjoner = await getDefinitions({
      fetchOptions: {
        next: { revalidate: 15 },
      }
    });

    const { toggles } = evaluateFlags(definisjoner, {
      sessionId
    });

    const flagg = flagsClient(toggles);
    return flagg.isEnabled(toggleNavn);
  } catch (error) {
    logError(`/lip/services/unleash`, error);
    return false;
  }
};
