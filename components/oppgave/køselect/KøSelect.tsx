'use client';

import { Select } from '@navikt/ds-react';

import { useState } from 'react';
import {Kø} from "lib/types/oppgaveTypes";

interface Props {
  køer: Kø[];
  valgtKøListener?: (kø: number) => void;
  defaultAktivKøId?: number;
  label?: string;
}
export const KøSelect = ({ køer, valgtKøListener, defaultAktivKøId, label }: Props) => {
  const defaultId = defaultAktivKøId ? defaultAktivKøId : (køer[0]?.id ?? 0);
  const [aktivKø, setAktivKø] = useState<number>(defaultId);
  return (
    <Select
      label={label || ''}
      size="small"
      value={aktivKø}
      onChange={(event) => {
        const køId = parseInt(event.target.value);
        setAktivKø(køId);
        valgtKøListener && valgtKøListener(køId);
      }}
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
