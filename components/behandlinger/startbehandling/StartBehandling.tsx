import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentBehandlingPåVentInformasjon } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StartBehandlingRedirectRiktigGruppe } from './StartBehandlingRedirectRiktigGruppe';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

const VENTESTATUSER_SOM_SKAL_KUNNE_GJENÅPNES = ['VENTER_PÅ_KLAGE_IMPLEMENTASJON'];

/**
 * Noen ganger settes saker på vent før saken er startet fordi man venter på at noe er implementert før det gir mening
 * å starte på behandlingen er saken i Kelvin. Eksempelvis satte vi et par klage-behandlinger på vent mens vi implementerte
 * flyten for behandling av klager. Dette steget kan da brukes for å la bruker gjenåpne saken når funksjonaliteten er implementert.
 *
 * For å være sikker på at man ikke kan gjenåpne statuser som ikke er klare for det, er VENTESTATUSER_SOM_SKAL_KUNNE_GJENÅPNES
 * en whitelsit med grunner som man får lov til å gjenåpne her.
 */
export const StartBehandling = async ({ behandlingsreferanse, flyt }: Props) => {
  const venteInformasjon = await hentBehandlingPåVentInformasjon(behandlingsreferanse);

  if (isError(venteInformasjon)) {
    return <ApiException apiResponses={[venteInformasjon]} />;
  }

  if (
    !VENTESTATUSER_SOM_SKAL_KUNNE_GJENÅPNES.includes(venteInformasjon?.data?.grunn) ||
    !flyt.visning.visVentekort
  ) {
    return <StartBehandlingRedirectRiktigGruppe flyt={flyt} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <></>
    </GruppeSteg>
  );
};
