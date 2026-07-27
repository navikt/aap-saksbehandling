import {
  hentDigitaliseringGrunnlag,
  hentFlyt,
  hentJournalpostInfo,
} from 'lib/services/postmottakservice/postmottakservice';
import { DigitaliserDokument } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentOppgave } from 'lib/services/oppgaveservice/oppgaveservice';

interface Props {
  behandlingsreferanse: string;
}
export const DigitaliserDokumentMedDatafetching = async ({ behandlingsreferanse }: Props) => {
  const [flyt, grunnlag, journalpostInfo, oppgave] = await Promise.all([
    hentFlyt(behandlingsreferanse),
    hentDigitaliseringGrunnlag(behandlingsreferanse),
    hentJournalpostInfo(behandlingsreferanse),
    hentOppgave(behandlingsreferanse),
  ]);
  if (isError(flyt) || isError(grunnlag) || isError(journalpostInfo) || isError(oppgave)) {
    return <ApiException apiResponses={[flyt, grunnlag]} />;
  }

  const isReadOnly: boolean = flyt.data.visning.readOnly;
  return (
    <DigitaliserDokument
      behandlingsVersjon={flyt.data.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      registrertDato={journalpostInfo.data.registrertDato}
      grunnlag={grunnlag.data}
      oppgave={oppgave.data}
      readOnly={isReadOnly}
    />
  );
};
