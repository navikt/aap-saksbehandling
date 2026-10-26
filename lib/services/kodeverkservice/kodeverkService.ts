import 'server-only';

import { apiFetch } from 'lib/services/apiFetch';
import { FetchResponse } from 'lib/utils/api';
import { KodeverkResponse } from 'lib/types/kodeverk';

const kodeverkApiBaseUrl = process.env.KODEVERK_API_BASE_URL;
const kodeverkApiScope = process.env.KODEVERK_API_SCOPE ?? '';

type Kodeverknavn = 'Postnummer' | 'LandkoderISO2';

const hentKodeverkBetydninger = async (kodeverkNavn: Kodeverknavn): Promise<FetchResponse<KodeverkResponse>> => {
  const url = `${kodeverkApiBaseUrl}/api/v1/kodeverk/${kodeverkNavn}/koder/betydninger`;
  return await apiFetch<KodeverkResponse>(url, kodeverkApiScope, 'GET', undefined, {
    revalidate: 86400, // 1 dag
    tags: [`kodeverk-${kodeverkNavn}`],
  });
};

export const hentPostnummerKodeverk = async (): Promise<FetchResponse<KodeverkResponse>> =>
  hentKodeverkBetydninger('Postnummer');

export const hentLandkoderIso2Kodeverk = async (): Promise<FetchResponse<KodeverkResponse>> =>
  hentKodeverkBetydninger('LandkoderISO2');
