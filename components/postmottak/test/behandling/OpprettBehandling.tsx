'use client';

import React, { useState } from 'react';
import { BodyShort, Button, TextField } from '@navikt/ds-react';
import { opprettBehandling } from 'lib/postmottakClientApi';

export const OpprettBehandling = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [journalpostId, setJournalpostId] = useState<number>(0);

  async function onClick() {
    setIsLoading(true);
    try {
      const res = await opprettBehandling(journalpostId);
      setMessage(`Behandlingsnummer: ${res?.referanse}`);
    } catch (err) {
      console.log(err);
      setMessage('Noe gikk galt');
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <TextField
        inputMode="numeric"
        label={'Journalpost-id'}
        size={'small'}
        onChange={(event) => {
          setJournalpostId(parseInt(event.target.value));
        }}
      />
      <Button onClick={() => onClick()} loading={isLoading}>
        Opprett behandling
      </Button>
      {message && <BodyShort>{message}</BodyShort>}
    </div>
  );
};
