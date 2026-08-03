import { hentSaksnummerGittBehandling } from 'lib/services/oppgaveservice/oppgaveservice';
import {
  hentDigitaliseringGrunnlag,
  hentFlyt,
  hentJournalpostInfo,
} from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';

import { DigitaliserDokument } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}
export const DigitaliserDokumentMedDatafetching = async ({ behandlingsreferanse }: Props) => {
  const [flyt, grunnlag, journalpostInfo, saksnummer] = await Promise.all([
    hentFlyt(behandlingsreferanse),
    hentDigitaliseringGrunnlag(behandlingsreferanse),
    hentJournalpostInfo(behandlingsreferanse),
    hentSaksnummerGittBehandling(behandlingsreferanse),
  ]);
  if (isError(flyt) || isError(grunnlag) || isError(journalpostInfo) || isError(saksnummer)) {
    return <ApiException apiResponses={[flyt, grunnlag, journalpostInfo, saksnummer]} />;
  }

  const isReadOnly: boolean = flyt.data.visning.readOnly;
  return (
    <DigitaliserDokument
      behandlingsVersjon={flyt.data.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      registrertDato={journalpostInfo.data.registrertDato}
      grunnlag={grunnlag.data}
      saksnummer={saksnummer.data?.saksnummer}
      readOnly={isReadOnly}
    />
  );
};
