import { hentBeregningsGrunnlag, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FastsettBeregningMedDataFeching } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregningMedDataFeching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { VisBeregning } from 'components/behandlinger/grunnlag/visberegning/VisBeregning';
import { YrkesskadeGrunnlagBeregningMedDataFetching } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregningMedDataFetching';

interface Props {
  behandlingsReferanse: string;
}

export const Grunnlag = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  const grunnlag = await hentBeregningsGrunnlag(behandlingsReferanse);

  const stegSomSkalVises = getStegSomSkalVises('GRUNNLAG', flyt);

  const readOnly = flyt.visning.saksbehandlerReadOnly;

  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      behandlingVersjon={behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
    >
      {stegSomSkalVises.includes('FASTSETT_BEREGNINGSTIDSPUNKT') && (
        <StegSuspense>
          <FastsettBeregningMedDataFeching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={readOnly}
            behandlingVersjon={behandlingVersjon}
          />
        </StegSuspense>
      )}

      {stegSomSkalVises.includes('FASTSETT_BEREGNINGSTIDSPUNKT') && (
        <StegSuspense>
          <YrkesskadeGrunnlagBeregningMedDataFetching
            readOnly={readOnly}
            behandlingVersjon={behandlingVersjon}
            behandlingsreferanse={behandlingsReferanse}
          />
        </StegSuspense>
      )}

      {grunnlag && <VisBeregning grunnlag={grunnlag} />}
    </GruppeSteg>
  );
};
