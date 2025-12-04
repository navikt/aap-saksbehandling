import { isProd } from 'lib/utils/environment';

/**
 * Samle release toggles på ett sted - slik at man får en enkel oversikt over hvilke toggles som faktisk er i bruk
 */
export const toggles = {
  featureSimulering: !isProd(),
  featureRevurderingVurderingsbehov: !isProd(),
  featureOvergangArbeid: !isProd(),
  featureFerieISykepengeperiode: !isProd(), // Finnes ikke i unleash - kun frontend-toggle
  featurePostmottakBehandlingerPåVent: !isProd(),
  featureVisAvslagsårsaker: !isProd(),
  featureManglendePGIOgEøsInntekter: !isProd(),
  featurePeriodiserteValgfrieKort: !isProd(),
  featureVisArenahistorikkKnapp: !isProd(),
};
