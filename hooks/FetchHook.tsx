import { useState } from 'react';
import {
  clientBestillDialogmelding,
  clientOpprettAktivitetspliktBrudd,
  clientOpprettSak,
  clientPurrPåLegeerklæring,
} from 'lib/clientApi';
import { BestillLegeerklæring, OpprettAktivitetspliktBrudd, OpprettTestcase } from 'lib/types/types';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { FetchResponse, isError, isSuccess } from 'lib/utils/api';
import { postmottakEndreTemaClient, postmottakSettPåVentClient } from 'lib/postmottakClientApi';
import { SettPåVentRequest } from 'lib/types/postmottakTypes';

export function useFetch<FunctionParameters extends any[], ResponseBody>(
  fetchFunction: (...functionParameters: FunctionParameters) => Promise<ResponseBody>
): {
  method: (...functionParameters: FunctionParameters) => Promise<void>;
  isLoading: boolean;
  data?: ResponseBody;
  error?: string;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<ResponseBody>();

  async function method(...functionParameters: FunctionParameters) {
    setIsLoading(true);

    try {
      const dataFromFetch = await fetchFunction(...functionParameters);
      if (dataFromFetch) {
        setData(dataFromFetch);
      }
    } catch (error) {
      setError(getErrorMessage(error));
    }

    setIsLoading(false);
  }

  return { isLoading, error, data, method };
}
export function useFetchV2<FunctionParameters extends any[], ResponseBody>(
  fetchFunction: (...functionParameters: FunctionParameters) => Promise<FetchResponse<ResponseBody>>
): {
  method: (...functionParameters: FunctionParameters) => Promise<{ ok: boolean }>;
  isLoading: boolean;
  data?: ResponseBody;
  error?: string;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<ResponseBody>();

  async function method(...functionParameters: FunctionParameters) {
    setIsLoading(true);
    setError('');
    let ok = true;

    try {
      const dataFromFetch = await fetchFunction(...functionParameters);
      if (isError(dataFromFetch)) {
        setError(`${dataFromFetch.apiException.code}: ${dataFromFetch.apiException.message}`);
        ok = false;
      }
      if (isSuccess(dataFromFetch)) {
        setData(dataFromFetch.data);
      }
      setIsLoading(false);
      return { ok };
    } catch (error) {
      setError(getErrorMessage(error));
      setIsLoading(false);
      return { ok: false };
    }
  }

  return { isLoading, error, data, method };
}

export function useAktivitetsplikt(saksnummer: string): {
  opprettAktivitetsplikt: (aktivitet: OpprettAktivitetspliktBrudd) => Promise<{ ok: boolean }>;
  isLoading: boolean;
  error?: string;
} {
  const { method, error, isLoading } = useFetchV2(clientOpprettAktivitetspliktBrudd);

  async function opprettAktivitetsPlikt(aktivitet: OpprettAktivitetspliktBrudd) {
    return await method(saksnummer, aktivitet);
  }

  return { opprettAktivitetsplikt: opprettAktivitetsPlikt, isLoading, error };
}

export function useOpprettSak(): {
  opprettSak: (opprettTestCase: OpprettTestcase) => Promise<void>;
  isLoading: boolean;
} {
  const { method, isLoading } = useFetchV2(clientOpprettSak);

  async function opprettSakMethod(body: OpprettTestcase) {
    await method(body);
  }

  return { opprettSak: opprettSakMethod, isLoading };
}

export function useBestillDialogmelding(): {
  bestillDialogmelding: (bestilling: BestillLegeerklæring) => Promise<void>;
  isLoading: boolean;
  error?: string;
} {
  const { method, isLoading, error } = useFetch(clientBestillDialogmelding);

  async function bestill(body: BestillLegeerklæring) {
    await method(body);
  }

  return { bestillDialogmelding: bestill, isLoading, error };
}

export function usePurrPåDialogmelding(): {
  purrPåDialogmelding: (dialogmeldingUuid: string, behandlingsreferanse: string) => Promise<{ ok: boolean }>;
  isLoading: boolean;
  error?: string;
} {
  const { method, isLoading, error } = useFetchV2(clientPurrPåLegeerklæring);

  async function purr(dialogmeldingUuid: string, behandlingsreferanse: string) {
    return await method(dialogmeldingUuid, behandlingsreferanse);
  }

  return { purrPåDialogmelding: purr, isLoading, error };
}

export function usePostmottakSettPåVent(): {
  postmottakSettPåVent: (behandlingsreferanse: string, body: SettPåVentRequest) => Promise<{ ok: boolean }>;
  isLoading: boolean;
  error?: string;
} {
  const { method, isLoading, error } = useFetchV2(postmottakSettPåVentClient);

  async function settPåVent(behandlingsreferanse: string, body: SettPåVentRequest) {
    return await method(behandlingsreferanse, body);
  }

  return { postmottakSettPåVent: settPåVent, isLoading, error };
}

export function usePostmottakEndreTema(): {
  postmottakEndreTema: (behandlingsreferanse: string) => Promise<{ ok: boolean }>;
  isLoading: boolean;
  error?: string;
  data?: { redirectUrl: string };
} {
  const { method, isLoading, error, data } = useFetchV2(postmottakEndreTemaClient);

  async function endreTema(behandlingsreferanse: string) {
    return await method(behandlingsreferanse);
  }

  return { postmottakEndreTema: endreTema, isLoading, error, data };
}
