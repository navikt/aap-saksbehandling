'use client';

import { Box, Page, Tabs } from '@navikt/ds-react';
import { SakMedBehandlinger } from 'components/saksoversikt/SakMedBehandlinger';
import { SaksInfo } from 'lib/types/types';
import { FileTextIcon, PersonIcon } from '@navikt/aksel-icons';
import { DokumentOversikt } from 'components/saksoversikt/dokumentoversikt/DokumentOversikt';

enum Tab {
  OVERSIKT = 'OVERSIKT',
  DOKUMENTER = 'DOKUMENTER',
}

export const SakOversiktContainer = ({ sak }: { sak: SaksInfo }) => {
  return (
    <Page>
      <Page.Block width="2xl">
        <Tabs defaultValue={Tab.OVERSIKT}>
          <Tabs.List>
            <Tabs.Tab label="Oversikt" value={Tab.OVERSIKT} icon={<PersonIcon />} />
            <Tabs.Tab label="Dokumenter" value={Tab.DOKUMENTER} icon={<FileTextIcon />} />
          </Tabs.List>

          <Box marginBlock="8">
            <Tabs.Panel value={Tab.OVERSIKT}>
              <SakMedBehandlinger sak={sak} />
            </Tabs.Panel>

            <Tabs.Panel value={Tab.DOKUMENTER}>
              <DokumentOversikt bruker={sak.ident} />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Page.Block>
    </Page>
  );
};
