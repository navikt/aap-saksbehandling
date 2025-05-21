import { hentFlyt, hentKlageresultat } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hjemmelMap } from 'lib/utils/hjemmel';
import { Klageresultat } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';

interface Props {
  saksnummer: string;
  behandlingsreferanse: string;
}

export const Omgjøring = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const behandlingVersjon = flyt.data.behandlingVersjon;
  const klageresultat = await hentKlageresultat(behandlingsreferanse);
  if (isError(klageresultat)) {
    return <ApiException apiResponses={[klageresultat]} />;
  }

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <StegSuspense>
        <VilkårsKort steg={'OMGJØRING'} heading={'Omgjøring'}>
          <p>Det er blitt opprettet en revurdering for følgende vilkår:</p>
          <p>{vilkårSomSkalOmgjøres(klageresultat.data)}</p>
        </VilkårsKort>
      </StegSuspense>
    </GruppeSteg>
  );

  function vilkårSomSkalOmgjøres(klageResultat: Klageresultat) {
    if ('vilkårSomSkalOmgjøres' in klageResultat) {
      return klageResultat.vilkårSomSkalOmgjøres.map((v) => hjemmelMap[v]).join(', ');
    }
    return [];
  }
};
