import {
  hentDigitaliseringGrunnlag,
  hentFlyt,
  hentJournalpostInfo,
} from 'lib/services/postmottakservice/postmottakservice';
import { DigitaliserDokument } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}
export const DigitaliserDokumentMedDatafetching = async ({ behandlingsreferanse }: Props) => {
  const [flyt, grunnlag, journalpostInfo] = await Promise.all([
    hentFlyt(behandlingsreferanse),
    hentDigitaliseringGrunnlag(behandlingsreferanse),
    hentJournalpostInfo(behandlingsreferanse),
  ]);
  if (isError(flyt) || isError(grunnlag) || isError(journalpostInfo)) {
    return <ApiException apiResponses={[flyt, grunnlag]} />;
  }

  const isReadOnly: boolean = !!flyt.data.visning.readOnly;
  return (
    <DigitaliserDokument
      behandlingsVersjon={flyt.data.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      registrertDato={journalpostInfo.data.registrertDato}
      grunnlag={grunnlag.data}
      readOnly={isReadOnly}
    />
  );
};
