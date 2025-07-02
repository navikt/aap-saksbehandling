'use server';

import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentBehandlingPåVentInformasjon, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StartBehandlingRedirectRiktigGruppe } from './StartBehandlingRedirectRiktigGruppe';

interface Props {
  behandlingsReferanse: string;
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
export const StartBehandling = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  const venteInformasjon = await hentBehandlingPåVentInformasjon(behandlingsReferanse);

  if (isError(flyt) || isError(venteInformasjon)) {
    return <ApiException apiResponses={[flyt, venteInformasjon]} />;
  }

  if (
    !VENTESTATUSER_SOM_SKAL_KUNNE_GJENÅPNES.includes(venteInformasjon?.data?.grunn) ||
    !flyt.data.visning.visVentekort
  ) {
    return <StartBehandlingRedirectRiktigGruppe flyt={flyt.data} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <></>
    </GruppeSteg>
  );
};
