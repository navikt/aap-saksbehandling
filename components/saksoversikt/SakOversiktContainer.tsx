'use client';

import { Box, Page, Tabs } from '@navikt/ds-react';
import { SakMedBehandlinger } from 'components/saksoversikt/SakMedBehandlinger';
import { SaksInfo } from 'lib/types/types';
import { FileTextIcon, PersonIcon } from '@navikt/aksel-icons';
import { DokumentOversikt } from 'components/saksoversikt/dokumentoversikt/DokumentOversikt';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AktivitetspliktTrekk } from 'components/saksoversikt/aktivitetsplikttrekk/AktivitetspliktTrekk';
import { isDev, isLocal } from 'lib/utils/environment';

enum Tab {
  OVERSIKT = 'OVERSIKT',
  DOKUMENTER = 'DOKUMENTER',
  TREKK = 'TREKK',
}

export const aktivitetspliktMedTrekkVisningFeature = () => isLocal() || isDev();

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
            {aktivitetspliktMedTrekkVisningFeature() && (
              <Tabs.Tab label="Aktivitetsplikt 11-9 trekk" value={Tab.TREKK} icon={<FileTextIcon />} />
            )}
          </Tabs.List>

          <Box marginBlock="8">
            <Tabs.Panel value={Tab.OVERSIKT}>
              <SakMedBehandlinger sak={sak} />
            </Tabs.Panel>

            <Tabs.Panel value={Tab.DOKUMENTER}>
              <DokumentOversikt sak={sak} />
            </Tabs.Panel>
            {aktivitetspliktMedTrekkVisningFeature() && (
              <Tabs.Panel value={Tab.TREKK}>
                <AktivitetspliktTrekk sak={sak} />
              </Tabs.Panel>
            )}
          </Box>
        </Tabs>
      </Page.Block>
    </Page>
  );
};
