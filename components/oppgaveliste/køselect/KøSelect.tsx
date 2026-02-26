'use client';

import { Select } from '@navikt/ds-react';
import { Kø } from 'lib/types/oppgaveTypes';
import { UseFormReturn } from 'react-hook-form';
import { ALLE_OPPGAVER_ID } from 'components/oppgaveliste/filtrering/filtreringUtils';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaverny/MineOppgaverNy';

interface Props {
  køer: Kø[];
  setAktivKø: (kø: number) => void;
  aktivKøId?: number;
  label?: string;
  form: UseFormReturn<FormFieldsFilter>;
}

export const KøSelect = ({ køer, setAktivKø, aktivKøId, label, form }: Props) => {
  return (
    <Select
      label={label || ''}
      size="small"
      value={aktivKøId}
      onChange={(event) => {
        if (event.target.value != ALLE_OPPGAVER_ID.toString()) {
          form.reset({
            behandlingstyper: [],
            behandlingOpprettetTom: undefined,
            behandlingOpprettetFom: undefined,
            årsaker: [],
            avklaringsbehov: [],
            statuser: [],
          });
        }
        setAktivKø(parseInt(event.target.value));
      }}
    >
      {køer.map((kø) => (
        <option key={kø.id} value={`${kø.id}`}>
          {kø.navn}
        </option>
      ))}
    </Select>
  );
};
