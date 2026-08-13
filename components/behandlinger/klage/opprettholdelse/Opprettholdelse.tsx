import { hentKlageresultat } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hjemmelMap } from 'lib/utils/hjemmel';
import { BehandlingFlytOgTilstand, Klageresultat } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { BodyShort } from '@navikt/ds-react';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Opprettholdelse = async ({ behandlingsreferanse, flyt }: Props) => {
  const behandlingVersjon = flyt.behandlingVersjon;
  const klageresultat = await hentKlageresultat(behandlingsreferanse);
  if (isError(klageresultat)) {
    return <ApiException apiResponses={[klageresultat]} />;
  }

  const skalViseOpprettholdelsesInfo =
    klageresultat.data.type === 'DELVIS_OMGJØRES' || klageresultat.data.type === 'OPPRETTHOLDES';
  /**
   * Alle klagesaker har OPPRETTHOLDELSE som siste steg, men det er kun de som har opprettholdelse eller
   * delvis omgjøring hvor dette er relevant og således aktuelt å vise frem
   */
  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        {skalViseOpprettholdelsesInfo ? (
          <VilkårsKort steg={'OPPRETTHOLDELSE'} heading={'Opprettholdelse'}>
            <BodyShort>{utledTekst(flyt)}</BodyShort>
            <BodyShort>Følgende vilkår skal opprettholdes:</BodyShort>
            <BodyShort>{vilkårSomSkalOpprettholdes(klageresultat.data)}</BodyShort>
          </VilkårsKort>
        ) : (
          <BodyShort>Velg fane for å se innhold i klagesaken</BodyShort>
        )}
      </StegSuspense>
    </GruppeSteg>
  );

  function utledTekst(flyt: BehandlingFlytOgTilstand) {
    if (flyt.aktivtSteg === 'OPPRETTHOLDELSE') {
      if (flyt.prosessering.status === 'JOBBER') {
        return 'Sender klagen til Nav Klageinstans...';
      } else if (flyt.prosessering.status === 'FERDIG') {
        return 'Klagen er sendt til Nav Klageinstans.';
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
