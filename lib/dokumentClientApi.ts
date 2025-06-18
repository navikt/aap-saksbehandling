import { KnyttTilAnnenSakRequest } from 'components/saksoversikt/dokumentoversikt/KnyttTilSak';
import { clientFetch } from 'lib/clientApi';
import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import { Journalpost } from 'lib/types/journalpost';

const BASE_URL = '/saksbehandling';

export function clientHentAlleDokumenterPåSak(saksnummer: string) {
  return clientFetch<RelevantDokumentType[]>(`${BASE_URL}/api/dokumenter/sak/${saksnummer}`, 'GET');
}

export function clientHentAlleDokumenterPåBruker(personIdent: string) {
  return clientFetch<Journalpost[]>(`${BASE_URL}/api/dokumenter/bruker`, 'POST', { personIdent });
}

export function clientKnyttTilAnnenSak(journalpostId: string, request: KnyttTilAnnenSakRequest) {
  return clientFetch<Journalpost[]>(`${BASE_URL}/api/dokumenter/${journalpostId}/knytttilannensak`, 'POST', request);
}

export function feilregistrerSakstilknytning(journalpostId: string) {
  return clientFetch<void>(
    `${BASE_URL}/api/dokumenter/${journalpostId}/feilregistrer/feilregistrersakstilknytning`,
    'POST'
  );
}

export function opphevFeilregistrertSakstilknytning(journalpostId: string) {
  return clientFetch<void>(
    `${BASE_URL}/api/dokumenter/${journalpostId}/feilregistrer/opphevfeilregistrertsakstilknytning`,
    'POST'
  );
}

export function clientHentRelevanteDokumenter(saksnummer: string, personIdent: string) {
  return clientFetch<RelevantDokumentType[]>(`${BASE_URL}/api/dokumenter/bruker/helsedokumenter`, 'POST', {
    saksnummer,
    personIdent,
  });
}
