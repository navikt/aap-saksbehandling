'use client';

import { Tabs } from '@navikt/ds-react';

import { DevtoolWrapper } from 'components/devtools/DevtoolWrapper';

import { SimulerJournalpostHendelse } from './SimulerJournalpostHendelse';
import { OpprettSakLocal } from './OpprettSakLocal';

export const UtviklerverktoyTabs = () => (
  <DevtoolWrapper title="Utviklerverktøy">
    <Tabs defaultValue="opprett-sak">
      <Tabs.List>
        <Tabs.Tab value="opprett-sak" label="Opprett sak" />
        <Tabs.Tab value="simuler-journalpost-hendelse" label="Simuler journalpost-hendelse" />
      </Tabs.List>
      <Tabs.Panel value="opprett-sak">
        <OpprettSakLocal />
      </Tabs.Panel>
      <Tabs.Panel value="simuler-journalpost-hendelse">
        <SimulerJournalpostHendelse />
      </Tabs.Panel>
    </Tabs>
  </DevtoolWrapper>
);
