import {
  LovvalgVedSøknadstidspunkt
} from "components/behandlinger/lovvalg/lovvalgvedsøknadstidspunkt/LovvalgVedSøknadstidspunkt";

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const LovvalgVedSøknadstidspunktMedDatafetching = ({ behandlingVersjon, readOnly}: Props) => {
  return (<LovvalgVedSøknadstidspunkt behandlingVersjon={behandlingVersjon} readOnly={readOnly} />);
}