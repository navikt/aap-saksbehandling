import { isProd } from 'lib/utils/environment';

/**
 * Samle release toggles på ett sted - slik at man får en enkel oversikt over hvilke toggles som faktisk er i bruk
 */

// Deprecated: Om mulig bruk heller feature-toggles fra unleash. Disse ligger in "lib/services/unleash/unleashToggles.ts"
export const toggles = {
  featureSimulering: !isProd(),
  featurePostmottakBehandlingerPåVent: !isProd(),
};
