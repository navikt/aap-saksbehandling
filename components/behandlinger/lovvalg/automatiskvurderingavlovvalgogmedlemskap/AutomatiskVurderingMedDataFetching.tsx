import {
  AutomatiskVurderingAvLovvalgOgMedlemskap
} from "components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/AutomatiskVurderingAvLovvalgOgMedlemskap";

interface Props {
  behandlingsReferanse: string;
}
const dummygrunnlag = {
  tilhørighetTilNorge: [
    {
      kilde: 'SP',
      opplysning: 'Mottar sykepenger',
      resultat: 'JA'
    },
    {
      kilde: 'AA-registeret',
      opplysning: 'Arbeid i Norge',
      resultat: 'JA'
    },
    {
      kilde: 'A-inntekt',
      opplysning: 'Inntekt i Norge',
      resultat: 'JA'
    },
    {
      kilde: 'MEDL',
      opplysning: 'Vedtak om pliktig eller frivillig medlemskap finnes i MEDL',
      resultat: 'JA'
    }
  ]
}
export const AutomatiskVurderingMedDataFetching = ({behandlingsReferanse}: Props) => {
  console.log(behandlingsReferanse);
  return <AutomatiskVurderingAvLovvalgOgMedlemskap grunnlag={dummygrunnlag} />
}
