import { hentEffektuerAvvistPåFormkravGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { EffektuerAvvistPåFormkrav } from 'components/behandlinger/klage/effektuerklageavvistpåformkrav/EffektuerAvvistPåFormkrav';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const EffektuerAvvistPåFormkravMedDatafetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentEffektuerAvvistPåFormkravGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <EffektuerAvvistPåFormkrav grunnlag={grunnlag.data} readOnly={readOnly} behandlingVersjon={behandlingVersjon} />
  );
};
