import { Soningsvurdering } from './Soningsvurdering';
import { hentSoningsvurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingsversjon: number;
  readOnly: boolean;
}

export const SoningsvurderingMedDataFetching = async ({
  behandlingsreferanse,
  behandlingsversjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentSoningsvurdering(behandlingsreferanse);

  return (
    grunnlag.soningsforhold.length > 0 && (
      <Soningsvurdering behandlingsversjon={behandlingsversjon} grunnlag={grunnlag} readOnly={readOnly} />
    )
  );
};
