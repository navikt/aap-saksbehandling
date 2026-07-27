import { BehandlingFlytOgTilstand, StegType } from 'lib/types/types';
import { getStegData } from 'lib/utils/steg';

import { VurderKravMedDataFetching } from 'components/behandlinger/krav/VurderKravMedDataFetching';
import { StønadsperiodeMedDataFetching } from 'components/behandlinger/krav/stønadsperiode/StønadsperiodeMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Krav = async ({ behandlingsreferanse, flyt }: Props) => {
  const stegSomSkalVises: StegType[] = ['KRAV', 'AVKLAR_STØNADSPERIODE'];
  const behandlingVersjon = flyt.behandlingVersjon;

  const aktivStegGruppe = 'KRAV';
  const stønadsperiodeSteg = getStegData(aktivStegGruppe, 'AVKLAR_STØNADSPERIODE', flyt);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('KRAV') && (
        <StegSuspense>
          <VurderKravMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('AVKLAR_STØNADSPERIODE') && (
        <StegSuspense>
          <StønadsperiodeMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={stønadsperiodeSteg} />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
