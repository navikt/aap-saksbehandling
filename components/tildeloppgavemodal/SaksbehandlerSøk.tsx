'use client';

import { Label, Search, VStack } from '@navikt/ds-react';
import { Dispatch, SetStateAction } from 'react';
import { clientSøkPåSaksbehandler } from 'lib/clientApi';

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
  søketekst: string,
  setSøketekst: Dispatch<SetStateAction<string>>
}

export const SaksbehandlerSøk = ({ oppgaver, setSaksbehandlere, søketekst, setSøketekst }: Props) => {

  const handleSaksbehandlerSøk = async () => {
    const res = await clientSøkPåSaksbehandler(oppgaver, søketekst);
    if (res.type == 'SUCCESS') {
      setSaksbehandlere(res.data.saksbehandlere);
    }
  };

  return (
    <VStack>
      <Label as="p" size={'medium'}>
        Søk etter saksbehandler:
      </Label>
    <Search
      label={'Søk etter saksbehandler'}
      value={søketekst}
      onChange={setSøketekst}
      onSearchClick={handleSaksbehandlerSøk}
      id={'saksbehandlerSøkefelt'}
    />
    </VStack>
  );
};
