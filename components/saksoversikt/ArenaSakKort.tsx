'use client';

import { Alert, ExpansionCard, VStack } from '@navikt/ds-react';
import { ArenaSakOppsummeringKontrakt } from 'lib/services/apiinternservice/apiInternService';

export function ArenaSakKort({ sak }: { sak: ArenaSakOppsummeringKontrakt }) {
  return (
    <ExpansionCard aria-label={`Arena-sak ${sak.sakId}`} defaultOpen>
      <ExpansionCard.Header>
        <ExpansionCard.Title>
          Arena {sak.aar} {sak.sakId}{' '}
          <span style={{ fontWeight: 400 }}>
            {sak.sakstype} - {sak.antallVedtak} vedtak
          </span>
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VStack gap="4">
          <Alert variant="info" size="small">
            Saken ligger i Arena. Ev behandling må foreløpig gjøres der.
          </Alert>
        </VStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
