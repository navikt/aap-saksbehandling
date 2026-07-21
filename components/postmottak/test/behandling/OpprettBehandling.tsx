'use client';

import React, { useState } from 'react';
import { Button } from '@navikt/ds-react/Button';
import { Page } from '@navikt/ds-react/Page';
import { HStack } from '@navikt/ds-react/Stack';
import { TextField } from '@navikt/ds-react/TextField';
import { postmottakOpprettBehandlingClient } from 'lib/postmottakClientApi';
import styles from './OpprettBehandling.module.css';
import { isSuccess } from 'lib/utils/api';
import { Alert } from 'components/alert/Alert';
import { DevtoolWrapper } from 'components/devtools/DevtoolWrapper';

export const OpprettBehandling = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [journalpostId, setJournalpostId] = useState<number>(0);

  async function opprettBehandling() {
    setIsLoading(true);
    try {
      const res = await postmottakOpprettBehandlingClient(journalpostId);
      if (isSuccess(res)) {
        setMessage(`Behandlingsnummer: ${res.data.referanse}`);
      } else {
        setMessage('Noe gikk galt');
      }
    } catch {
      setMessage('Noe gikk galt');
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  return (
    <Page.Block width="xl" className={styles.stickyFooterWrapper}>
      <div className={styles.stickyFooter}>
        <DevtoolWrapper hideTitle>
          <HStack gap="space-16" align="end">
            <TextField
              hideLabel
              inputMode="numeric"
              label="JournalpostID"
              placeholder="JournalpostID"
              onChange={(event) => setJournalpostId(parseInt(event.target.value))}
            />
            <Button onClick={opprettBehandling} loading={isLoading}>
              Opprett behandling
            </Button>

            {message && <Alert variant="info">{message}</Alert>}
          </HStack>
        </DevtoolWrapper>
      </div>
    </Page.Block>
  );
};
