import { AvklarSak } from 'components/postmottak/avklarsak/AvklarSak';
import { hentFinnSakGrunnlag, hentFlyt, hentJournalpostInfo } from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}

export const AvklarSakMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const [flyt, grunnlag, journalpostInfo] = await Promise.all([
    hentFlyt(behandlingsreferanse),
    hentFinnSakGrunnlag(behandlingsreferanse),
    hentJournalpostInfo(behandlingsreferanse),
  ]);
  if (isError(flyt) || isError(grunnlag) || isError(journalpostInfo)) {
    return <ApiException apiResponses={[flyt, grunnlag, journalpostInfo]} />;
  }

  const isReadOnly: boolean = flyt.data.visning.readOnly;
  return (
    <AvklarSak
      behandlingsVersjon={flyt.data.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      grunnlag={grunnlag.data}
      readOnly={isReadOnly}
      søker={journalpostInfo.data.søker}
    />
  );
};
