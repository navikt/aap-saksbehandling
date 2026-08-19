import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { VedtakslengdeMedDataFetching } from 'components/behandlinger/vedtakslengde/VedtakslengdeMedDataFetching';
import { ForeslåVedtakVedtakslengdeMedDataFetching } from 'components/behandlinger/vedtakslengde/foreslåvedtakvedtakslengde/ForeslåVedtakVedtakslengdeMedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Vedtakslengde = async ({ behandlingsreferanse, flyt }: Props) => {
  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <VedtakslengdeMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.behandlingVersjon}
          readOnly={flyt.visning.saksbehandlerReadOnly}
        />
      </StegSuspense>
      <StegSuspense>
        <ForeslåVedtakVedtakslengdeMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.behandlingVersjon}
          readonly={flyt.visning.saksbehandlerReadOnly}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
