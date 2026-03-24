'use client';

import { Select } from '@navikt/ds-react';
import { Kø } from 'lib/types/oppgaveTypes';
import { AktivKø } from 'hooks/oppgave/aktivkøHook';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  køer: Kø[];
  oppdaterKø: (kø: AktivKø) => void;
  aktivKø: AktivKø;
  label?: string;
  form: UseFormReturn<FormFieldsFilter>;
}

export const KøSelect = ({ køer, oppdaterKø, aktivKø, label, form }: Props) => {
  const bruker = useInnloggetBruker();

  return (
    <Select
      label={label || ''}
      size="small"
      value={`${aktivKø.id}`}
      onChange={(event) => {
        const selectedKø = køer.find((kø) => kø.id === parseInt(event.target.value));
        if (selectedKø && selectedKø.id != null) {
          const alleOppgaverKø = køer.find((kø) => kø.type === 'ALLE_OPPGAVER');
          if (alleOppgaverKø?.id != null && event.target.value !== alleOppgaverKø.id.toString()) {
            form.reset({
              behandlingstyper: [],
              behandlingOpprettetTom: undefined,
              behandlingOpprettetFom: undefined,
              årsaker: [],
              avklaringsbehov: [],
              statuser: [],
            });
          }
          oppdaterKø({
            id: selectedKø.id,
            type: selectedKø.type,
            timestamp: new Date().getTime(),
            user: bruker.NAVident,
          });
        }
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
