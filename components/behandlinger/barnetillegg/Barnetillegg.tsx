import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { BarnetilleggVurderingMedDataFetching } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurderingMedDataFetching';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';

interface Props {
  behandlingsreferanse: string;
}

export const Barnetillegg = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const stegSomSkalVises = getStegSomSkalVises('BARNETILLEGG', flyt);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
    >
      {stegSomSkalVises.includes('BARNETILLEGG') && (
        <StegSuspense>
          <BarnetilleggVurderingMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingsversjon={flyt.behandlingVersjon}
            readOnly={flyt.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
