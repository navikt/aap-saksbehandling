'use client';

import { Select } from '@navikt/ds-react';
import { Enhet } from 'lib/types/oppgaveTypes';

interface Props {
  enheter: Enhet[];
  aktivEnhet: string;
  setAktivEnhet: (enhet: string) => void;
}

export const EnhetSelect = ({ enheter, aktivEnhet, setAktivEnhet }: Props) => {
  return (
    <Select
      label="Velg enhet"
      size="small"
      value={aktivEnhet}
      onChange={(event) => {
        setAktivEnhet(event.target.value);
      }}
    >
      {enheter.map((enhet) => (
        <option key={enhet.enhetNr} value={enhet.enhetNr}>
          {enhet.navn}
        </option>
      ))}
    </Select>
  );
};
