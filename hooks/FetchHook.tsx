import { useState } from 'react';
import { opprettAktivitetspliktBrudd } from 'lib/clientApi';
import { OpprettAktivitetspliktBrudd } from 'lib/types/types';

export function useFetch<RequestBody, ResponseBody>(
  fetchFunction: (body: RequestBody) => Promise<ResponseBody>
): {
  method: (body: RequestBody) => Promise<void>;
  isLoading: boolean;
  data?: ResponseBody;
  error?: string;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<ResponseBody>();

  async function method(body: RequestBody) {
    setIsLoading(true);

    try {
      const dataFromFetch = await fetchFunction(body);
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
  const { method, error, isLoading } = useFetch(opprettAktivitetspliktBrudd);

  async function opprettAktivitetsPlikt(aktivitet: OpprettAktivitetspliktBrudd) {
    await method({ saksnummer, aktivitet });
  }

  return { opprettAktivitetsplikt: opprettAktivitetsPlikt, isLoading, error };
}
