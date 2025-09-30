import { LovvalgOgMedlemskapVedSøknadstidspunktNyVisning } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunktNyVisning';
import { LovvalgMedlemskapGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { LovvalgOgMedlemskapVedSøknadstidspunktGammelVising } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunktGammelVising';
import { isDev } from 'lib/utils/environment';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: LovvalgMedlemskapGrunnlag;
  overstyring: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export const LovvalgOgMedlemskapVedSøknadstidspunkt = ({
  behandlingVersjon,
  readOnly,
  overstyring,
  initialMellomlagretVurdering,
  grunnlag,
}: Props) => {
  return isDev() ? (
    <LovvalgOgMedlemskapVedSøknadstidspunktNyVisning
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      overstyring={overstyring}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      grunnlag={grunnlag}
    />
  ) : (
    <LovvalgOgMedlemskapVedSøknadstidspunktGammelVising
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      overstyring={overstyring}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      grunnlag={grunnlag}
    />
  );
};
