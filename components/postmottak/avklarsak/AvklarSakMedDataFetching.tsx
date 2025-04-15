import { AvklarSak } from 'components/postmottak/avklarsak/AvklarSak';
import { hentFinnSakGrunnlag, hentFlyt } from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
interface Props {
  behandlingsreferanse: string;
}
export const AvklarSakMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const [flyt, grunnlag] = await Promise.all([
    hentFlyt(behandlingsreferanse),
    hentFinnSakGrunnlag(behandlingsreferanse),
  ]);
  if (isError(flyt) || isError(grunnlag)) {
    return <ApiException apiResponses={[flyt, grunnlag]} />;
  }

  const isReadOnly: boolean = !!flyt.data.visning.readOnly;
  return (
    <AvklarSak
      behandlingsVersjon={flyt.data.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      grunnlag={grunnlag.data}
      readOnly={isReadOnly}
    />
  );
};
