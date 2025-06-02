import { hentFlyt, hentKlageresultat } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hjemmelMap } from 'lib/utils/hjemmel';
import { BehandlingFlytOgTilstand, Klageresultat } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';

interface Props {
  behandlingsreferanse: string;
}

export const Opprettholdelse = async ({ behandlingsreferanse }: Props) => {
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
        <VilkårsKort steg={'OPPRETTHOLDELSE'} heading={'Opprettholdelse'}>
          <p>{utledTekst(flyt.data)}</p>
          <p>Følgende vilkår skal opprettholdes:</p>
          <p>{vilkårSomSkalOpprettholdes(klageresultat.data)}</p>
        </VilkårsKort>
      </StegSuspense>
    </GruppeSteg>
  );

  function utledTekst(flyt: BehandlingFlytOgTilstand) {
    if (flyt.aktivtSteg === 'OPPRETTHOLDELSE') {
      if (flyt.prosessering.status === 'JOBBER') {
        return 'Sender klagen til Nav Klageinstans...';
      } else {
        return '';
      }
    } else {
      return 'Klagen er sendt til Nav Klageinstans.';
    }
  }

  function vilkårSomSkalOpprettholdes(klageResultat: Klageresultat) {
    if ('vilkårSomSkalOpprettholdes' in klageResultat) {
      return klageResultat.vilkårSomSkalOpprettholdes.map((v) => hjemmelMap[v]).join(', ');
    }
    return [];
  }
};
