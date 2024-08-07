import { hentBeregningsGrunnlag, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FastsettBeregningMedDataFeching } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregningMedDataFeching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { VisBeregning } from 'components/behandlinger/grunnlag/visberegning/VisBeregning';

interface Props {
  behandlingsReferanse: string;
}

export const Grunnlag = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  const grunnlag = await hentBeregningsGrunnlag(behandlingsReferanse);

  const stegSomSkalVises = getStegSomSkalVises('GRUNNLAG', flyt);

  const readOnly = flyt.visning.saksbehandlerReadOnly;

  const behandlingVersjon = flyt.behandlingVersjon;

  console.log('GRUNNLAG STEG SOM SKAL VISES', stegSomSkalVises);

  return (
    <GruppeSteg
      behandlingVersjon={behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
    >
      {stegSomSkalVises.map((steg) => {
        if (steg === 'FASTSETT_BEREGNINGSTIDSPUNKT') {
          return (
            <StegSuspense key={steg}>
              <FastsettBeregningMedDataFeching
                behandlingsReferanse={behandlingsReferanse}
                readOnly={readOnly}
                behandlingVersjon={behandlingVersjon}
              />
            </StegSuspense>
          );
        }
      })}

      {grunnlag && <VisBeregning grunnlag={grunnlag} />}
    </GruppeSteg>
  );
};
