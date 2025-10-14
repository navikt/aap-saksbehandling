'use client';

import { Alert, Search, VStack } from '@navikt/ds-react';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { clientSøkPåSaksbehandler } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';

interface Props {
  oppgaver: number[];
  setSaksbehandlere: Dispatch<
    SetStateAction<
      {
        navIdent: string;
        navn?: string | null;
      }[]
    >
  >;
  søketekst: string;
  setSøketekst: Dispatch<SetStateAction<string>>;
  setInfomelding: Dispatch<SetStateAction<string | undefined>>;
  setPageState: Dispatch<SetStateAction<number>>;
  søkefeltError: string | undefined;
  setSøkefeltError: Dispatch<SetStateAction<string | undefined>>;
}

export const SaksbehandlerSøk = ({
  oppgaver,
  setSaksbehandlere,
  søketekst,
  setSøketekst,
  setInfomelding,
  setPageState,
  søkefeltError,
  setSøkefeltError,
}: Props) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaksbehandlerSøk = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setInfomelding(undefined);
    setError(undefined);
    setSøkefeltError(undefined);

    if (!søketekst || søketekst.trim() === '') {
      setSøkefeltError('Du må fylle ut søkefeltet');
      setIsLoading(false);
      return;
    }

    const res = await clientSøkPåSaksbehandler(oppgaver, søketekst);
    if (isSuccess(res)) {
      setSaksbehandlere(res.data.saksbehandlere);
      if (res.data.saksbehandlere.length == 0) {
        setInfomelding('Fant ingen veiledere eller saksbehandlere.');
      }
    } else {
      setError(res.apiException.message);
    }
    setPageState(1);
    setIsLoading(false);
  };

  return (
    <VStack gap={'2'}>
      <form id={'saksbehandlerSøk'} onSubmit={handleSaksbehandlerSøk}>
        <Search
          label={'Søk etter veileder/saksbehandler'}
          hideLabel={false}
          value={søketekst}
          onChange={setSøketekst}
          id={'saksbehandlerSøkefelt'}
          error={søkefeltError}
        >
          <Search.Button loading={isLoading} />
        </Search>
      </form>
      {error && <Alert variant={'error'}>{error}</Alert>}
    </VStack>
  );
};
