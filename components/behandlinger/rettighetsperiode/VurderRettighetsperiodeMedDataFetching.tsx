import { FetchResponse, isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { VurderRettighetsperiode } from './VurderRettighetsperiode';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const VurderRettighetsperiodeMedDataFetching = ({
  readOnly,
  behandlingVersjon,
  behandlingsreferanse,
}: Props) => {
  console.log('Rettighetsperiode med behandlingsreferanse', behandlingsreferanse);
  // TODO: await hentRettighetsperiodeGrunnlag(behandlingsreferanse);
  const rettighetsperiodeGrunnlag: FetchResponse<any> = {
    data: { begrunnelse: '', dato: '' },
    type: 'SUCCESS',
    status: 200,
  };
  if (isError(rettighetsperiodeGrunnlag)) {
    return <ApiException apiResponses={[rettighetsperiodeGrunnlag]} />;
  }

  return (
    <VurderRettighetsperiode
      grunnlag={rettighetsperiodeGrunnlag.data}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
