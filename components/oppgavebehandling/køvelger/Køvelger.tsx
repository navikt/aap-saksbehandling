'use client';

import { BodyShort, Button, Heading, HGrid, Label, Select } from '@navikt/ds-react';
import { useContext } from 'react';
import { defaultKø, KøContext } from 'components/oppgavebehandling/KøContext';
import { skjulPrototype } from 'lib/utils/skjulPrototype';

export const Køvelger = () => {
  const køContext = useContext(KøContext);

  if (skjulPrototype()) {
    return null;
  }

  const settKø = (køId: string) => {
    const kø = køContext.køliste.find((kø) => kø.id === køId);
    køContext.oppdaterValgtKø(kø ?? defaultKø);
  };

  return (
    <section>
      <Heading level={'2'} size={'medium'} spacing>
        Oppgavekø
      </Heading>
      <HGrid columns="1fr 2fr" gap={'8'}>
        <div>
          <Select
            label={'Valgt oppgavekø'}
            onChange={(event) => settKø(event.target.value)}
            value={køContext.valgtKø.id}
          >
            {køContext.køliste.map((kø) => (
              <option key={kø.id} value={kø.id}>
                {kø.navn}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Beskrivelse av køen</Label>
          <BodyShort>{køContext.valgtKø.beskrivelse}</BodyShort>
        </div>
      </HGrid>
      <Button style={{ marginTop: '1rem' }}>Behandle neste sak</Button>
    </section>
  );
};
