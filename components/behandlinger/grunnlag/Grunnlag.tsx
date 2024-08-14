import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FastsettBeregningMedDataFeching } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregningMedDataFeching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { VisBeregning } from 'components/behandlinger/grunnlag/visberegning/VisBeregning';
import { Beregningsgrunnlag } from 'lib/types/types';

interface Props {
  behandlingsReferanse: string;
}

const grunnlag: Beregningsgrunnlag = {
  beregningstype: 'STANDARD',
  grunnlag1119: {
    inntekter: [
      { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: 6 },
      { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: 6 },
      { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: 6 },
    ],
    grunnlag: 6,
    gjennomsnittligInntektSiste3år: 6,
    inntektSisteÅr: { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: 6 },
  },
  yrkesskadeGrunnlag: {
    gjennomsnittligInntektSiste3år: 6,
    grunnlag: 6,
    inntektSisteÅr: { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: 6 },
    inntekter: [
      { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: 6 },
      { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: 6 },
      { år: '2021', inntektIG: 6, inntektIKroner: 1000000, justertTilMaks6G: 6 },
    ],
    standardBeregning: {
      inntektIG: 6,
      JustertTilMaks6G: true,
      prosentVekting: 50,
    },
    yrkesskadeGrunnlag: 6,
    yrkesskadeInntekt: {
      antattÅrligInntektIGYrkesskadeTidspunktet: 6,
      antattÅrligInntektIKronerYrkesskadeTidspunktet: 1000000,
      justertTilMaks6G: 6,
      prosentVekting: 50,
    },
  },
  uføreGrunnlag: {
    inntekter: [
      { år: '2004', inntektIKroner: 600000, inntektIG: 5.4, justertTilMaks6G: 5.4 },
      { år: '2005', inntektIKroner: 600000, inntektIG: 5.4, justertTilMaks6G: 5.4 },
      { år: '2006', inntektIKroner: 600000, inntektIG: 5.4, justertTilMaks6G: 5.4 },
    ],
    uføreInntekter: [
      {
        år: '2020',
        inntektIKroner: 600000,
        inntektIG: 5.4,
        justertTilMaks6G: 5.4,
        uføreGrad: 50,
        justertForUføreGrad: 12000000,
      },
      {
        år: '2021',
        inntektIKroner: 600000,
        inntektIG: 5.4,
        justertTilMaks6G: 5.4,
        uføreGrad: 50,
        justertForUføreGrad: 12000000,
      },
      {
        år: '2022',
        inntektIKroner: 600000,
        inntektIG: 5.4,
        justertTilMaks6G: 5.4,
        uføreGrad: 50,
        justertForUføreGrad: 12000000,
      },
    ],
    gjennomsnittligInntektSiste3årUfør: 6,
    inntektSisteÅr: { år: '2006', inntektIKroner: 600000, inntektIG: 5.4, justertTilMaks6G: 5.4 },
    inntektSisteÅrUfør: {
      år: '2022',
      inntektIKroner: 600000,
      inntektIG: 5.4,
      justertTilMaks6G: 5.4,
      uføreGrad: 50,
      justertForUføreGrad: 12000000,
    },
    gjennomsnittligInntektSiste3år: 6,
    grunnlag: 6,
  },
};

export const Grunnlag = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  // const grunnlag = await hentBeregningsGrunnlag(behandlingsReferanse);

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
