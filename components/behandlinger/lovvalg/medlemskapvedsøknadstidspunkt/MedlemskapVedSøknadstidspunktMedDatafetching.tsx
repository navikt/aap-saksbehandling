import {
  MedlemskapVedSøknadstidspunkt
} from "components/behandlinger/lovvalg/medlemskapvedsøknadstidspunkt/MedlemskapVedSøknadstidspunkt";

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}
export const MedlemskapVedSøknadstidspunktMedDatafetching = ({ behandlingVersjon, readOnly}: Props) => {
  return (<MedlemskapVedSøknadstidspunkt behandlingVersjon={behandlingVersjon} readOnly={readOnly} />);
}