import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { ForeslåVedtakMedDataFetching } from 'components/behandlinger/vedtak/foreslaavedtak/ForeslåVedtakMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { BehandlingFlytOgTilstand } from 'lib/types/types';
import { BeslutterMedDataFetching } from 'components/behandlinger/vedtak/beslutter/BeslutterMedDataFetching';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Vedtak = async ({ behandlingsreferanse, flyt }: Props) => {
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      behandlingVersjon={behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <ForeslåVedtakMedDataFetching
          behandlingVersjon={behandlingVersjon}
          behandlingsreferanse={behandlingsreferanse}
          readonly={flyt.visning.saksbehandlerReadOnly}
        />
      </StegSuspense>
      <StegSuspense>
        <BeslutterMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          readOnly={flyt.visning.beslutterReadOnly}
          behandlingsversjon={behandlingVersjon}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
