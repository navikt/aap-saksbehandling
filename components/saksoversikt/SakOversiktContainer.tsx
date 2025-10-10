'use client';

import { Box, Page, Tabs } from '@navikt/ds-react';
import { SakMedBehandlinger } from 'components/saksoversikt/SakMedBehandlinger';
import { SaksInfo } from 'lib/types/types';
import { FileTextIcon, PersonIcon, ReceiptIcon } from '@navikt/aksel-icons';
import { DokumentOversikt } from 'components/saksoversikt/dokumentoversikt/DokumentOversikt';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TrekkOversikt } from 'components/saksoversikt/trekkoversikt/TrekkOversikt';

enum Tab {
  OVERSIKT = 'OVERSIKT',
  DOKUMENTER = 'DOKUMENTER',
  TREKK = 'TREKK',
}

export const SakOversiktContainer = ({ sak }: { sak: SaksInfo }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState(searchParams.get('t') || Tab.OVERSIKT);

  const changeActiveTab = (newTab: Tab) => {
    setTab(newTab);
    router.replace(`?t=${newTab}`);
  };

  return (
    <Page>
      <Page.Block width="2xl">
        <Tabs defaultValue={tab} onChange={(value) => changeActiveTab(value as Tab)}>
          <Tabs.List>
            <Tabs.Tab label="Oversikt" value={Tab.OVERSIKT} icon={<PersonIcon />} />
            <Tabs.Tab label="Dokumenter" value={Tab.DOKUMENTER} icon={<FileTextIcon />} />
            <Tabs.Tab label="Trekk" value={Tab.TREKK} icon={<ReceiptIcon />} />
          </Tabs.List>

          <Box marginBlock="8">
            <Tabs.Panel value={Tab.OVERSIKT}>
              <SakMedBehandlinger sak={sak} />
            </Tabs.Panel>

            <Tabs.Panel value={Tab.DOKUMENTER}>
              <DokumentOversikt sak={sak} />
            </Tabs.Panel>

            <Tabs.Panel value={Tab.TREKK}>
              <TrekkOversikt sak={sak} />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Page.Block>
    </Page>
  );
};
