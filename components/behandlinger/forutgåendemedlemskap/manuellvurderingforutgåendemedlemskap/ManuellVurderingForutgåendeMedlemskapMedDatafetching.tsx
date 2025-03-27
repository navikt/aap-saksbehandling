import { ManuellVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskap';
import { ForutgåendeMedlemskapGrunnlag } from 'lib/types/types';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: ForutgåendeMedlemskapGrunnlag;
}

export const ManuellVurderingForutgåendeMedlemskapMedDatafetching = async ({
  behandlingVersjon,
  readOnly,
  grunnlag,
}: Props) => {
  return (
    <ManuellVurderingForutgåendeMedlemskap
      behandlingVersjon={behandlingVersjon}
      grunnlag={grunnlag}
      readOnly={readOnly}
      overstyring={!!grunnlag.vurdering?.overstyrt}
    />
  );
};
