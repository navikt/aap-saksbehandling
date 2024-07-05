import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import {
  hentBeregningsGrunnlag,
  hentBeregningsVurdering,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { BeregningsGrunnlag } from 'lib/types/types';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const vurdering = await hentBeregningsVurdering(behandlingsReferanse);
  const grunnlag = await hentBeregningsGrunnlag(behandlingsReferanse);

  console.log(beregningsGrunnlag);
  return (
    <FastsettBeregning
      readOnly={readOnly}
      vurdering={vurdering}
      behandlingVersjon={behandlingVersjon}
      grunnlag={grunnlag}
    />
  );
};

const beregningsGrunnlag: BeregningsGrunnlag = {
  // @ts-ignore
  faktagrunnlag: { verdi: 0 },
  grunnlag: { verdi: 0 },
  grunnlag11_19: {
    er6GBegrenset: false,
    erGjennomsnitt: false,
    grunnlaget: 0,
    inntekter: { '1999': 0, '2000': 0, '2001': 0 },
  },
  grunnlagUføre: {
    er6GBegrenset: false,
    erGjennomsnitt: false,
    grunnlag: {
      er6GBegrenset: false,
      erGjennomsnitt: false,
      inntekter: { '2021': 300000, '2022': 300000, '2023': 300000 },
      grunnlaget: 0,
    },
    grunnlagYtterligereNedsatt: {
      er6GBegrenset: true,
      grunnlaget: 0,
      inntekter: {},
      erGjennomsnitt: true,
    },
    grunnlaget: 0,
    type: '',
    uføreInntektIKroner: 0,
    uføreInntekterFraForegåendeÅr: {},
    uføreYtterligereNedsattArbeidsevneÅr: 0,
    uføregrad: 0,
  },
  grunnlagYrkesskade: {
    andelSomIkkeSkyldesYrkesskade: 0,
    andelSomSkyldesYrkesskade: 0,
    andelYrkesskade: 0,
    antattÅrligInntektYrkesskadeTidspunktet: 0,
    benyttetAndelForYrkesskade: 0,
    beregningsgrunnlag: { erGjennomsnitt: true, grunnlaget: 0, inntekter: {}, er6GBegrenset: true },
    er6GBegrenset: false,
    erGjennomsnitt: false,
    grunnlagEtterYrkesskadeFordel: 0,
    grunnlagForBeregningAvYrkesskadeandel: 0,
    grunnlaget: 0,
    terskelverdiForYrkesskade: 0,
    yrkesskadeTidspunkt: 0,
    yrkesskadeinntektIG: 0,
  },
};
