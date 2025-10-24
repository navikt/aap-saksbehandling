import { isProd } from 'lib/utils/environment';

/**
 * Samle release toggles på ett sted - slik at man får en enkel oversikt over hvilke toggles som faktisk er i bruk
 */
export const toggles = {
  featureSimulering: !isProd(),
  featureOpprettAktivitetsplikt11_9: !isProd(),
  featureRevurderingVurderingsbehov: !isProd(),
  featureAktivitetspliktMedTrekkVisning: !isProd(),
  featureOvergangArbeid: !isProd(),
  featureFerieISykepengeperiode: !isProd(), // Finnes ikke i unleash - kun frontend-toggle
};
