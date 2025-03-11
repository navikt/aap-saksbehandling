'use client';

import React, { useState } from 'react';
import { Alert, Button, HStack, Page, TextField } from '@navikt/ds-react';
import { postmottakOpprettBehandlingClient } from 'lib/postmottakClientApi';
import styles from './OpprettBehandling.module.css';

export const OpprettBehandling = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [journalpostId, setJournalpostId] = useState<number>(0);

  async function onClick() {
    setIsLoading(true);
    try {
      const res = await postmottakOpprettBehandlingClient(journalpostId);
      setMessage(`Behandlingsnummer: ${res?.referanse}`);
    } catch (err) {
      console.log(err);
      setMessage('Noe gikk galt');
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  return (
    <Page.Block width="xl" className={styles.stickyFooterWrapper}>
      <div className={styles.stickyFooter}>
        <HStack gap="4" align="end" marginBlock="4">
          <TextField
            inputMode="numeric"
            label={'Journalpost-id'}
            onChange={(event) => {
              setJournalpostId(parseInt(event.target.value));
            }}
          />
          <Button onClick={() => onClick()} loading={isLoading}>
            Opprett behandling
          </Button>

          {message && <Alert variant="info">{message}</Alert>}
        </HStack>
      </div>
    </Page.Block>
  );
};
