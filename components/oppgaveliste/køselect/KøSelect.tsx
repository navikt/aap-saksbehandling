'use client';

import { Select } from '@navikt/ds-react';
import { Kø } from 'lib/types/oppgaveTypes';

interface Props {
  køer: Kø[];
  valgtKøListener?: (kø: number) => void;
  aktivKøId?: number;
  label?: string;
}

export const KøSelect = ({ køer, valgtKøListener, aktivKøId, label }: Props) => {
  return (
    <Select
      label={label || ''}
      size="small"
      value={aktivKøId}
      onChange={(event) => valgtKøListener?.(parseInt(event.target.value))}
    >
      {køer.map((kø) => {
        if (kø) {
          return (
            <option key={kø.id} value={`${kø.id}`}>
              {kø.navn}
            </option>
          );
        }
      })}
    </Select>
  );
};
