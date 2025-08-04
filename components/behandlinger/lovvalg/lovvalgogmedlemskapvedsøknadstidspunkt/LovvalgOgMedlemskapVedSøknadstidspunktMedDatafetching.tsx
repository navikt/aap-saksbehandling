import { LovvalgOgMedlemskapVedSKnadstidspunkt } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunkt';
import { LovvalgMedlemskapGrunnlag } from 'lib/types/types';

interface Props {
  behandlingVersjon: number;
  grunnlag: LovvalgMedlemskapGrunnlag;
  readOnly: boolean;
}

export const LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching = async ({
  behandlingVersjon,
  grunnlag,
  readOnly,
}: Props) => {
  return (
    <LovvalgOgMedlemskapVedSKnadstidspunkt
      behandlingVersjon={behandlingVersjon}
      grunnlag={grunnlag}
      readOnly={readOnly || !grunnlag.harTilgangTilÅSaksbehandle}
      overstyring={!!grunnlag?.vurdering?.overstyrt}
    />
  );
};
