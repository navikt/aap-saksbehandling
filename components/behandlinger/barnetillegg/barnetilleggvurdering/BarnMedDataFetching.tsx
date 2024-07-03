import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { hentBarnetilleggGrunnlag, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';

type Props = {
  behandlingsreferanse: string;
};

export const BarnMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const grunnlag = await hentBarnetilleggGrunnlag(behandlingsreferanse);
  const stegSomSkalVises = getStegSomSkalVises('BARNETILLEGG', flyt);

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
    >
      {stegSomSkalVises.map((steg) => {
        if (steg === 'BARNETILLEGG') {
          return (
            <StegSuspense key={steg}>
              <BarnetilleggVurdering grunnlag={grunnlag} />
            </StegSuspense>
          );
        }
      })}
    </GruppeSteg>
  );
};
