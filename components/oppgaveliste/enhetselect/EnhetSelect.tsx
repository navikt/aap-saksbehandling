'use client';

import { Select } from '@navikt/ds-react';
import { Enhet } from 'lib/types/oppgaveTypes';

interface Props {
  enheter: Enhet[];
  aktivEnhet: string;
  valgtEnhetListener: (enhet: string) => void;
}

export const EnhetSelect = ({ enheter, aktivEnhet, valgtEnhetListener }: Props) => {
  return (
    <Select
      label="Velg enhet"
      size="small"
      value={aktivEnhet}
      onChange={(event) => {
        const enhet = event.target.value;
        if (enhet) {
          valgtEnhetListener(enhet);
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
