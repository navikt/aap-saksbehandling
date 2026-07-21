'use client';

import { Box } from '@navikt/ds-react/Box';
import { Page } from '@navikt/ds-react/Page';
import { VStack } from '@navikt/ds-react/Stack';
import { Tabs } from '@navikt/ds-react/Tabs';
import { SakMedBehandlinger } from 'components/saksoversikt/SakMedBehandlinger';
import { RettighetsinfoDto, SaksInfo } from 'lib/types/types';
import { FileTextIcon, PersonIcon, TasklistIcon } from '@navikt/aksel-icons';
import { DokumentOversikt } from 'components/saksoversikt/dokumentoversikt/DokumentOversikt';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AktivitetspliktTrekk } from 'components/saksoversikt/aktivitetsplikttrekk/AktivitetspliktTrekk';
import { MeldekortOversikt } from 'components/saksoversikt/meldekortoversikt/MeldekortOversikt';
import { useFeatureFlag } from 'context/UnleashContext';
import { SakerResponse } from 'lib/services/apiinternservice/apiInternService';
import { ArenaSakerListe } from 'components/saksoversikt/ArenaSakerListe';

enum Tab {
  OVERSIKT = 'OVERSIKT',
  DOKUMENTER = 'DOKUMENTER',
  MELDEKORT = 'MELDEKORT',
  TREKK = 'TREKK',
}

export const SakOversiktContainer = ({
  sak,
  rettighetsinfo,
  arenaSaker,
}: {
  sak: SaksInfo;
  rettighetsinfo: RettighetsinfoDto | null;
  arenaSaker: SakerResponse | null;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState(searchParams.get('t') || Tab.OVERSIKT);

  const changeActiveTab = (newTab: Tab) => {
    setTab(newTab);
    router.replace(`?t=${newTab}`);
  };

  const visArenasakerOversikt = useFeatureFlag('VisArenasakerOversikt');

  return (
    <Page>
      <Page.Block width="2xl" style={{ padding: '0 var(--ax-space-32)' }}>
        <Tabs defaultValue={tab} onChange={(value) => changeActiveTab(value as Tab)}>
          <Tabs.List>
            <Tabs.Tab label="Oversikt" value={Tab.OVERSIKT} icon={<PersonIcon />} />
            <Tabs.Tab label="Dokumenter" value={Tab.DOKUMENTER} icon={<FileTextIcon />} />
            <Tabs.Tab label="Meldekort" value={Tab.MELDEKORT} icon={<TasklistIcon />} />
            <Tabs.Tab label="Aktivitetsplikt 11-9 trekk" value={Tab.TREKK} icon={<FileTextIcon />} />
          </Tabs.List>

          <Box marginBlock="space-32">
            <Tabs.Panel value={Tab.OVERSIKT}>
              <VStack gap="space-32">
                <SakMedBehandlinger sak={sak} rettighetsinfo={rettighetsinfo} />
                {visArenasakerOversikt && arenaSaker && <ArenaSakerListe arenaSaker={arenaSaker} />}
              </VStack>
            </Tabs.Panel>

            <Tabs.Panel value={Tab.DOKUMENTER}>
              <DokumentOversikt sak={sak} />
            </Tabs.Panel>

            <Tabs.Panel value={Tab.MELDEKORT}>
              <MeldekortOversikt sak={sak} />
            </Tabs.Panel>

            <Tabs.Panel value={Tab.TREKK}>
              <AktivitetspliktTrekk sak={sak} />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Page.Block>
    </Page>
  );
};
