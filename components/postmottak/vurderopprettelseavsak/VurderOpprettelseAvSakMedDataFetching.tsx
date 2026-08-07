import { subMonths, subWeeks } from 'date-fns';
import { hentFlyt, hentJournalpostInfo } from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import {
  ANTALL_MÅNEDER_TILBAKE_SYKEPENGER,
  ANTALL_UKER_TILBAKE_FORELDREPENGER,
  VurderOpprettelseAvSak,
} from 'components/postmottak/vurderopprettelseavsak/VurderOpprettelseAvSak';
import { hentManuellFordelingsgrunnlag } from 'lib/services/apiinternservice/apiInternService';
import {
  hentForeldrepengeperioder,
  hentSykepengeperioder,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { YtelseoppslagRequest } from 'lib/types/types';
import { formaterDatoForBackend } from 'lib/utils/date';
import { Alert } from 'components/alert/Alert';

interface Props {
  behandlingsreferanse: string;
}

export const VurderOpprettelseAvSakMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  /**
   * Hent flyt og journalpostinfo fra postmottak. Journalpostinfoen gir oss søkers ident,
   * som vi trenger for oppslagene mot behandlingsflyt og api-intern.
   */
  const [flyt, journalpostInfo] = await Promise.all([
    hentFlyt(behandlingsreferanse),
    hentJournalpostInfo(behandlingsreferanse),
  ]);

  if (isError(flyt) || isError(journalpostInfo)) {
    return <ApiException apiResponses={[flyt, journalpostInfo]} />;
  }

  const personident = journalpostInfo.data.søker?.ident;

  if (!personident) {
    return (
      <Alert variant={'warning'}>
        Fant ikke ident på søker for denne journalposten, og kan derfor ikke hente arenadata og ytelser.
      </Alert>
    );
  }

  const iDag = new Date();
  const foreldrepengerRequest: YtelseoppslagRequest = {
    personident,
    fom: formaterDatoForBackend(subWeeks(iDag, ANTALL_UKER_TILBAKE_FORELDREPENGER)),
    tom: formaterDatoForBackend(iDag),
  };
  const sykepengerRequest: YtelseoppslagRequest = {
    personident,
    fom: formaterDatoForBackend(subMonths(iDag, ANTALL_MÅNEDER_TILBAKE_SYKEPENGER)),
    tom: formaterDatoForBackend(iDag),
  };

  /**
   * hent ytelser fra behandlingsflyt
   * - foreldrepenger - sykepenger
   * hent arenadata fra api-intern -> arenaoppslag
   */
  const [arenaFordelingsGrunnlag, foreldrepengeperioder, sykepengeperioder] = await Promise.all([
    hentManuellFordelingsgrunnlag(personident),
    hentForeldrepengeperioder(foreldrepengerRequest),
    hentSykepengeperioder(sykepengerRequest),
  ]);

  if (isError(arenaFordelingsGrunnlag) || isError(foreldrepengeperioder) || isError(sykepengeperioder)) {
    return <ApiException apiResponses={[arenaFordelingsGrunnlag, foreldrepengeperioder, sykepengeperioder]} />;
  }

  return (
    <VurderOpprettelseAvSak
      behandlingsVersjon={flyt.data.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      arenagrunnlag={arenaFordelingsGrunnlag.data}
      foreldrepengeperioder={foreldrepengeperioder.data}
      sykepengeperioder={sykepengeperioder.data}
      readOnly={flyt.data.visning.readOnly}
    />
  );
};
