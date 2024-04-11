'use client';

import { BodyShort, Button, Heading, HGrid, Label, Select } from '@navikt/ds-react';

export const Køvelger = () => {
  return (
    <section>
      <Heading level={'2'} size={'medium'} spacing>
        Oppgavekø
      </Heading>
      <HGrid columns="1fr 2fr" gap={'8'}>
        <div>
          <Select label={'Valgt oppgavekø'}>
            <option>NAY Nasjonal AAP-kø (1 429 saker)</option>
            <option>Studentsaker (218 saker)</option>
          </Select>
        </div>
        <div>
          <Label>Beskrivelse av køen</Label>
          <BodyShort>En kort beskrivelse av hva køen dekker. Oppdaterer seg når man bytter kø.</BodyShort>
        </div>
      </HGrid>
      <Button style={{ marginTop: '1rem' }}>Behandle neste sak</Button>
    </section>
  );
};
