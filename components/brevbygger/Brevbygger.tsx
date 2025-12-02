'use client';

import { Box, Button, HGrid } from '@navikt/ds-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Delmal } from 'components/brevbygger/Delmal';
import {
  delmalErObligatorisk,
  finnParentIdForValgtAlternativ,
  mapDelmalerFraSanity,
} from 'components/brevbygger/brevmalMapping';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { BrevdataDto } from 'lib/types/types';
import { ForhåndsvisBrev } from 'components/brevbygger/ForhåndsvisBrev';
import { clientOppdaterBrevdata } from 'lib/clientApi';

export interface AlternativFormField {
  verdi: string;
}

export interface ValgFormField {
  noekkel: string;
  key: string;
  alternativer: AlternativFormField[];
  valgtAlternativ: string;
}

export interface DelmalFormField {
  noekkel: string;
  valgt: boolean;
  valg?: ValgFormField[];
}

export interface BrevdataFormFields {
  delmaler: DelmalFormField[];
}

interface BrevbyggerProps {
  referanse: string;
  brevmal?: string | null;
  brevdata?: BrevdataDto;
}

export const Brevbygger = ({ referanse, brevmal, brevdata }: BrevbyggerProps) => {
  const parsedBrevmal: BrevmalType = JSON.parse(brevmal || '');
  const { control, handleSubmit, watch } = useForm<BrevdataFormFields>({
    defaultValues: {
      delmaler: mapDelmalerFraSanity(parsedBrevmal.delmaler, brevdata),
    },
  });

  const { fields } = useFieldArray({ control, name: 'delmaler' });

  const onSubmit = async (formData: BrevdataFormFields) => {
    const obligatoriskeDelmaler = formData.delmaler
      .filter((delmal) => delmalErObligatorisk(delmal.noekkel, parsedBrevmal))
      .map((delmal) => ({
        id: delmal.noekkel,
      }));

    const valgteDelmaler = formData.delmaler.filter((delmal) => delmal.valgt).map((delmal) => ({ id: delmal.noekkel }));
    const valgteValg = formData.delmaler
      .flatMap((delmal) => delmal.valg?.filter((v) => v.valgtAlternativ !== ''))
      .filter((v) => !!v)
      .map((valg) => ({
        id: finnParentIdForValgtAlternativ(valg.valgtAlternativ, parsedBrevmal),
        key: valg.valgtAlternativ,
      }));

    await clientOppdaterBrevdata(referanse, {
      delmaler: [...obligatoriskeDelmaler, ...valgteDelmaler],
      valg: valgteValg,
      betingetTekst: [],
      faktagrunnlag: [],
      fritekster: [],
      periodetekster: [],
    });
  };

  return (
    <HGrid columns={2} gap={'2'} minWidth={'1280px'}>
      <Box>
        <h1>{parsedBrevmal.overskrift}</h1>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
          })}
        >
          {fields.map((feltet, index) => (
            <Delmal
              delmalFelt={feltet}
              index={index}
              control={control}
              key={feltet.id}
              watch={watch}
              brevmal={parsedBrevmal}
            />
          ))}
          <Button>Oppdater brevdata</Button>
        </form>
      </Box>
      <ForhåndsvisBrev referanse={referanse} />
    </HGrid>
  );
};
