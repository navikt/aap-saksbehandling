import { useState } from 'react';
import { clientBestillDialogmelding, clientOpprettAktivitetspliktBrudd, clientOpprettSak } from 'lib/clientApi';
import { BestillLegeerklæring, OpprettAktivitetspliktBrudd, OpprettTestcase } from 'lib/types/types';

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
      setError(JSON.stringify(error));
    }

    setIsLoading(false);
  }

  return { isLoading, error, data, method };
}

export function useAktivitetsplikt(saksnummer: string): {
  opprettAktivitetsplikt: (aktivitet: OpprettAktivitetspliktBrudd) => Promise<void>;
  isLoading: boolean;
  error?: string;
} {
  const { method, error, isLoading } = useFetch(clientOpprettAktivitetspliktBrudd);

  async function opprettAktivitetsPlikt(aktivitet: OpprettAktivitetspliktBrudd) {
    await method(saksnummer, aktivitet);
  }

  return { opprettAktivitetsplikt: opprettAktivitetsPlikt, isLoading, error };
}

export function useOpprettSak(): {
  opprettSak: (opprettTestCase: OpprettTestcase) => Promise<void>;
  isLoading: boolean;
} {
  const { method, isLoading } = useFetch(clientOpprettSak);

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
