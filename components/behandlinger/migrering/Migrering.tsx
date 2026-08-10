import { BehandlingFlytOgTilstand, StegType } from 'lib/types/types';
import { getStegData } from 'lib/utils/steg';

import { VurderKravMedDataFetching } from 'components/behandlinger/krav/VurderKravMedDataFetching';
import { StønadsperiodeMedDataFetching } from 'components/behandlinger/krav/stønadsperiode/StønadsperiodeMedDataFetching';
import { MigreringstidspunktMedDataFetching } from 'components/behandlinger/migrering/MigreringstidspunktMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Migrering = async ({ behandlingsreferanse, flyt }: Props) => {
  const aktivStegGruppe = 'MIGRERING';
  const avklaringMigreringsdatoSteg = getStegData(aktivStegGruppe, 'AVKLAR_MIGRERINGSDATO', flyt);
  const avklarKvoteSteg = getStegData(aktivStegGruppe, 'AVKLAR_RESTKVOTE_MIGRERING', flyt);

  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      {avklaringMigreringsdatoSteg.skalViseSteg && (
        <StegSuspense>
          <MigreringstidspunktMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={avklaringMigreringsdatoSteg}
          />
        </StegSuspense>
      )}

      {avklarKvoteSteg.skalViseSteg && (
        <StegSuspense>
          <p>Skal vise avklar kvote steg</p>
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
