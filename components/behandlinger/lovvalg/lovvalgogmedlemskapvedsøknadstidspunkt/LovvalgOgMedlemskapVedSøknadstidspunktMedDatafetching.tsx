import { LovvalgOgMedlemskapVedSKnadstidspunkt } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunkt';
import { LovvalgMedlemskapGrunnlag } from 'lib/types/types';

interface Props {
  behandlingVersjon: number;
  grunnlag: LovvalgMedlemskapGrunnlag;
  readOnly: boolean;
  erAktivtSteg: boolean;
}

export const LovvalgOgMedlemskapVedSKnadstidspunktMedDatafetching = async ({
  behandlingVersjon,
  grunnlag,
  erAktivtSteg,
  readOnly,
}: Props) => {
  return (
    <LovvalgOgMedlemskapVedSKnadstidspunkt
      erAktivtSteg={erAktivtSteg}
      behandlingVersjon={behandlingVersjon}
      grunnlag={grunnlag}
      readOnly={readOnly}
      overstyring={!!grunnlag?.vurdering?.overstyrt}
    />
  );
};
