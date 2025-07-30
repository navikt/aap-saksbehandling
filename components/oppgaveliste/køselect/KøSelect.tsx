'use client';

import { Select } from '@navikt/ds-react';
import { Kø } from 'lib/types/oppgaveTypes';

interface Props {
  køer: Kø[];
  setAktivKø: (kø: number) => void;
  aktivKøId?: number;
  label?: string;
}

export const KøSelect = ({ køer, setAktivKø, aktivKøId, label }: Props) => {
  return (
    <Select
      label={label || ''}
      size="small"
      value={aktivKøId}
      onChange={(event) => setAktivKø(parseInt(event.target.value))}
    >
      {køer.map((kø) => (
        <option key={kø.id} value={`${kø.id}`}>
          {kø.navn}
        </option>
      ))}
    </Select>
  );
};
