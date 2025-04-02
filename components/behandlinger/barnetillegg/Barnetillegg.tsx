import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { BarnetilleggVurderingMedDataFetching } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurderingMedDataFetching';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { getStegSomSkalVises } from 'lib/utils/steg';

interface Props {
  behandlingsreferanse: string;
}

export const Barnetillegg = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);

  const stegSomSkalVises = getStegSomSkalVises('BARNETILLEGG', flyt);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <BarnetilleggVurderingMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          harAvklaringsbehov={stegSomSkalVises.includes('BARNETILLEGG')}
          behandlingsversjon={flyt.behandlingVersjon}
          readOnly={flyt.visning.saksbehandlerReadOnly}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
