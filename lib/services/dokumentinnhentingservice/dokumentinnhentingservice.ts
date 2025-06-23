import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import {
  KnyttTilAnnenSakRequest,
  KnyttTilAnnenSakResponse,
} from 'components/saksoversikt/dokumentoversikt/KnyttTilSakModal';
import { apiFetch, apiFetchPdf } from 'lib/services/apiFetch';
import { Journalpost } from 'lib/types/journalpost';
import { isLocal } from 'lib/utils/environment';
import { FetchResponse } from 'lib/utils/api';

const dokumentinnhentingApiBaseUrl = process.env.DOKUMENTINNHENTING_API_BASE_URL;
const dokumentinnhentingApiScope = process.env.DOKUMENTINNHENTING_API_SCOPE ?? '';

export const hentAlleDokumenterPåSak = async (saksnummer: string) => {
  if (isLocal()) {
    const response: FetchResponse<RelevantDokumentType[]> = {
      type: 'SUCCESS',
      data: [
        {
          tema: 'AAP',
          dokumentInfoId: '987654321',
          journalpostId: '123456789',
          brevkode: 'NAV 11-13.05',
          tittel: 'Søknad om Arbeidsavklaringspenger',
          erUtgående: false,
          datoOpprettet: '2025-03-25T14:25:09',
          variantformat: 'ARKIV',
        },
      ],
    };

    return response;
  }
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/sak/${saksnummer}`;
  return await apiFetch<RelevantDokumentType[]>(url, dokumentinnhentingApiScope, 'GET');
};

export const hentAlleDokumenterPåBruker = async (brukerId: any) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/bruker`;
  return await apiFetch<Journalpost[]>(url, dokumentinnhentingApiScope, 'POST', brukerId);
};

export async function hentHelsedokumenterPåBruker(request: any) {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/bruker/helsedokumenter`;
  return await apiFetch<RelevantDokumentType[]>(url, dokumentinnhentingApiScope, 'POST', request);
}

export const hentDokument = async (journalPostId: string, dokumentInfoId: string) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/${journalPostId}/${dokumentInfoId}`;
  return await apiFetchPdf(url, dokumentinnhentingApiScope);
};

export const knyttTilAnnenSak = async (journalpostId: string, request: KnyttTilAnnenSakRequest) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/${journalpostId}/knyttTilAnnenSak`;

  return await apiFetch<KnyttTilAnnenSakResponse>(url, dokumentinnhentingApiScope, 'POST', request);
};

export const feilregistrerSakstilknytning = async (journalpostId: string) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/${journalpostId}/feilregistrer/feilregistrerSakstilknytning`;

  return await apiFetch<void>(url, dokumentinnhentingApiScope, 'POST');
};

export const opphevFeilregistrertSakstilknytning = async (journalpostId: string) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/${journalpostId}/feilregistrer/opphevFeilregistrertSakstilknytning`;

  return await apiFetch<void>(url, dokumentinnhentingApiScope, 'POST');
};

export async function hentBehandleroppslag(body: object) {
  const url = `${dokumentinnhentingApiBaseUrl}/syfo/behandleroppslag/search`;
  return await apiFetch<Behandler[]>(url, dokumentinnhentingApiScope, 'POST', body);
}
