import { hentFlyt, hentOverleveringGrunnlag } from 'lib/services/postmottakservice/postmottakservice';
import { Overlevering } from './Overlevering';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}

export const OverleveringMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const [flyt, grunnlag] = await Promise.all([
    hentFlyt(behandlingsreferanse),
    hentOverleveringGrunnlag(behandlingsreferanse),
  ]);
  if (isError(flyt) || isError(grunnlag)) {
    return <ApiException apiResponses={[flyt, grunnlag]} />;
  }

  const isReadOnly: boolean = !!flyt.data.visning.readOnly;
  return (
    <Overlevering
      behandlingsVersjon={flyt.data.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      grunnlag={grunnlag.data}
      readOnly={isReadOnly}
    />
  );
};
