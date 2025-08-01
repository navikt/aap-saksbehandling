import { hentSykdomsvurderingBrevGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { SykdomsvurderingBrev } from 'components/behandlinger/sykdom/sykdomsvurderingbrev/SykdomsvurderingBrev';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const SykdomsvurderingBrevMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentSykdomsvurderingBrevGrunnlag(behandlingsReferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <SykdomsvurderingBrev
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.kanSaksbehandle}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
