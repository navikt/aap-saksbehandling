'use client';

import { Select } from '@navikt/ds-react';
import { Enhet } from 'lib/types/oppgaveTypes';
import { useState } from 'react';

interface Props {
  enheter: Enhet[];
  valgtEnhetListener?: (enhet: string) => void;
}
export const EnhetSelect = ({ enheter, valgtEnhetListener }: Props) => {
  const [aktivEnhet, setAktivEnhet] = useState<string | undefined>(enheter[0]?.enhetNr);
  return (
    <Select
      label="Velg enhet"
      size="small"
      value={aktivEnhet}
      onChange={(event) => {
        const enhet = event.target.value;
        if (enhet) {
          setAktivEnhet(enhet);
          valgtEnhetListener && valgtEnhetListener(enhet);
        }
      }}
    >
      {enheter.map((enhet) => {
        if (enhet) {
          return (
            <option key={enhet.enhetNr} value={enhet.enhetNr}>
              {enhet.navn}
            </option>
          );
        }
      })}
    </Select>
  );
};
