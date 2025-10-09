import { ForutgåendeMedlemskapGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { isProd } from 'lib/utils/environment';
import { ManuellVurderingForutgåendeMedlemskapNyVisning } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskapNyVisning';
import { ManuellVurderingForutgåendeMedlemskapGammelVisning } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskapGammelVisning';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: ForutgåendeMedlemskapGrunnlag;
  overstyring: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export const ManuellVurderingForutgåendeMedlemskap = ({
  grunnlag,
  readOnly,
  behandlingVersjon,
  overstyring,
  initialMellomlagretVurdering,
}: Props) => {
  return !isProd() ? (
    <ManuellVurderingForutgåendeMedlemskapNyVisning
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      overstyring={overstyring}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      grunnlag={grunnlag}
    />
  ) : (
    <ManuellVurderingForutgåendeMedlemskapGammelVisning
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      overstyring={overstyring}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      grunnlag={grunnlag}
    />
  );
};
