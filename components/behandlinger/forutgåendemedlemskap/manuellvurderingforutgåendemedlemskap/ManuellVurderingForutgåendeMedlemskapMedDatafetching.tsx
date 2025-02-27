import { hentForutgåendeMedlemskapGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ManuellVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskap';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const ManuellVurderingForutgåendeMedlemskapMedDatafetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentForutgåendeMedlemskapGrunnlag(behandlingsReferanse);
  console.log('grunnlag');
  console.log(grunnlag.vurdering);
  return (
    <ManuellVurderingForutgåendeMedlemskap
      behandlingVersjon={behandlingVersjon}
      grunnlag={grunnlag}
      readOnly={readOnly}
      overstyring={!!grunnlag.vurdering?.overstyrt}
    />
  );
};
