import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { BekreftVurderingerOppfølging } from 'components/behandlinger/sykdom/bekreftvurderingeroppfølging/BekreftVurderingerOppfølging';
import { hentBekreftVurderingerOppfølgingGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const BekreftVurderingerOppfølgingMedDataFetching = async ({
  behandlingsreferanse,
  readOnly,
  behandlingVersjon,
}: Props) => {
  const grunnlag = await hentBekreftVurderingerOppfølgingGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <BekreftVurderingerOppfølging grunnlag={grunnlag.data} readOnly={readOnly} behandlingVersjon={behandlingVersjon} />
  );
};
