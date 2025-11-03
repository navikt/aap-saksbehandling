'use client';

import { Box, Button, HGrid } from '@navikt/ds-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Delmal } from 'components/brevbygger/Delmal';
import {
  delmalErObligatorisk,
  finnParentIdForValgtAlternativ,
  mapDelmalerFraSanity,
} from 'components/brevbygger/brevmalMapping';
import { innvilgelse_brev } from 'components/brevbygger/innvilgelse';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';

// kladd -- disse vil komme fra gentypes
export type DelmalDto = {
  id: string;
};

export type FaktagrunnlagDto = {
  tekniskNavn: string;
  verdi: string;
};

export type PeriodeteksterDto = {
  id: string;
  faktagrunnlag: FaktagrunnlagDto[];
};

export type ValgDto = {
  id: string;
  key: string;
};

export type FritekstDto = {
  parentId: string;
  key: string;
  fritekst: string; // JSON
};

export type BetingetTekstDto = {
  id: string;
};
// <-- kladd slutt

// til/fra backend
export interface BrevdataDto {
  delmaler: DelmalDto[];
  faktagrunnlag: FaktagrunnlagDto[];
  periodetekster: PeriodeteksterDto[];
  valg: ValgDto[];
  betingetTekst: BetingetTekstDto[];
  fritekster: FritekstDto[];
}

export interface AlternativType {
  verdi: string;
}

export interface ValgFormField {
  noekkel: string;
  key: string;
  alternativer: AlternativType[];
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
  brevmal?: string | null;
  brevdata?: BrevdataDto;
}

export const Brevbygger = ({ brevmal, brevdata }: BrevbyggerProps) => {
  if (!brevmal) {
    // TODO bør stoppes før vi kommer hit, er kun aktuelt så lenge vi må støtte ny og gammel brevmodell
    return <div>Fant ingen brevmal...</div>;
  }

  const parsedBrevmal: BrevmalType = JSON.parse(brevmal);

  const { control, handleSubmit, watch } = useForm<BrevdataFormFields>({
    defaultValues: {
      delmaler: mapDelmalerFraSanity(parsedBrevmal.delmaler, brevdata),
    },
  });

  const { fields } = useFieldArray({ control, name: 'delmaler' });

  const onSubmit = (formData: BrevdataFormFields) => {
    const obligatoriskeDelmaler = formData.delmaler
      .filter((delmal) => delmalErObligatorisk(delmal.noekkel, parsedBrevmal))
      .map((delmal) => delmal.noekkel);

    const valgteDelmaler = formData.delmaler.filter((delmal) => delmal.valgt).map((delmal) => delmal.noekkel);
    const valgteValg = formData.delmaler
      .flatMap((delmal) => delmal.valg?.filter((v) => v.valgtAlternativ !== ''))
      .filter((v) => !!v)
      .map((valg) => ({
        id: finnParentIdForValgtAlternativ(valg.valgtAlternativ, parsedBrevmal),
        key: valg.valgtAlternativ,
      }));

    console.log({
      delmaler: [...obligatoriskeDelmaler, ...valgteDelmaler],
      valg: valgteValg,
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
          <Button>Oppdater forhåndsvisning</Button>
        </form>
      </Box>
      <Box padding={'2'} background={'bg-subtle'} shadow="medium">
        Her kommer preview av brev...
      </Box>
    </HGrid>
  );
};
