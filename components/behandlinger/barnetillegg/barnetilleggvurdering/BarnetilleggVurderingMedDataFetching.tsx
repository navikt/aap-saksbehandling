import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import {
  hentBarnetilleggGrunnlag,
  hentBehandlingPersoninfo,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';

type Props = {
  behandlingsreferanse: string;
  behandlingsversjon: number;
  harAvklaringsbehov: boolean;
  readOnly: boolean;
};

export const BarnetilleggVurderingMedDataFetching = async ({
  behandlingsreferanse,
  behandlingsversjon,
  readOnly,
  harAvklaringsbehov,
}: Props) => {
  const grunnlag = await hentBarnetilleggGrunnlag(behandlingsreferanse);
  const behandlingPersoninfo = await hentBehandlingPersoninfo(behandlingsreferanse);

  return (
    <BarnetilleggVurdering
      harAvklaringsbehov={harAvklaringsbehov}
      grunnlag={grunnlag}
      behandlingsversjon={behandlingsversjon}
      readOnly={readOnly}
      behandlingPersonInfo={behandlingPersoninfo}
    />
  );
};
