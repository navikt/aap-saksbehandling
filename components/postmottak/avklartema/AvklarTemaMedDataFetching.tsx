import { AvklarTema } from './AvklarTema';
import { hentAvklarTemaGrunnlag, hentFlyt } from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}
export const AvklarTemaMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const [flyt, grunnlag] = await Promise.all([
    hentFlyt(behandlingsreferanse),
    hentAvklarTemaGrunnlag(behandlingsreferanse),
  ]);
  if (isError(flyt) || isError(grunnlag)) {
    return <ApiException apiResponses={[flyt, grunnlag]} />;
  }

  const isReadOnly: boolean = !!flyt.data.visning.readOnly;
  return (
    <AvklarTema
      behandlingsVersjon={flyt.data.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      grunnlag={grunnlag.data}
      readOnly={isReadOnly}
    />
  );
};
