import { LovvalgOgMedlemskapVedSKnadstidspunkt } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunkt';
import { hentLovvalgMedlemskapGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentLovvalgMedlemskapGrunnlag(behandlingsReferanse);

  console.log(grunnlag);
  return (
    <LovvalgOgMedlemskapVedSKnadstidspunkt
      behandlingVersjon={behandlingVersjon}
      grunnlag={grunnlag}
      readOnly={readOnly}
      overstyring={!!grunnlag?.vurdering?.overstyrt}
    />
  );
};
