'use client';

import { Box, Page, Tabs } from '@navikt/ds-react';
import { SakMedBehandlinger } from 'components/saksoversikt/SakMedBehandlinger';
import { SaksInfo } from 'lib/types/types';
import { FileTextIcon, PersonIcon } from '@navikt/aksel-icons';
import { DokumentOversikt } from 'components/saksoversikt/dokumentoversikt/DokumentOversikt';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AktivitetspliktTrekk } from 'components/saksoversikt/aktivitetsplikttrekk/AktivitetspliktTrekk';
import { Rettighetsoversikt } from 'components/saksoversikt/rettighetsoversikt/Rettighetsoversikt';
import { useFeatureFlag } from 'context/UnleashContext';
import { clientHentRettighetsdata } from 'lib/clientApi';
import { isError } from 'lib/utils/api';
import useSWR from 'swr';

enum Tab {
  OVERSIKT = 'OVERSIKT',
  DOKUMENTER = 'DOKUMENTER',
  TREKK = 'TREKK',
}

export const SakOversiktContainer = ({
  sak,
  innloggetBrukerIdent,
}: {
  sak: SaksInfo;
  innloggetBrukerIdent: string | undefined;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVisRettigheterForVedtakEnabled = useFeatureFlag('VisRettigheterForVedtak');

  const [tab, setTab] = useState(searchParams.get('t') || Tab.OVERSIKT);

  const { data: rettighetData } = useSWR(
    isVisRettigheterForVedtakEnabled ? `/api/sak/${sak.saksnummer}/rettighet` : null,
    () => clientHentRettighetsdata(sak.saksnummer)
  );
  const rettighetListe = !isError(rettighetData) ? (rettighetData?.data ?? []) : [];

  const changeActiveTab = (newTab: Tab) => {
    setTab(newTab);
    router.replace(`?t=${newTab}`);
  };

  return (
    <Page>
      <Page.Block width="2xl" style={{ padding: '0 var(--a-spacing-8)' }}>
        <Tabs defaultValue={tab} onChange={(value) => changeActiveTab(value as Tab)}>
          <Tabs.List>
            <Tabs.Tab label="Oversikt" value={Tab.OVERSIKT} icon={<PersonIcon />} />
            <Tabs.Tab label="Dokumenter" value={Tab.DOKUMENTER} icon={<FileTextIcon />} />
            <Tabs.Tab label="Aktivitetsplikt 11-9 trekk" value={Tab.TREKK} icon={<FileTextIcon />} />
          </Tabs.List>

          <Box marginBlock="8">
            <Tabs.Panel value={Tab.OVERSIKT}>
              {isVisRettigheterForVedtakEnabled && <Rettighetsoversikt rettighetListe={rettighetListe} />}
              <SakMedBehandlinger sak={sak} innloggetBrukerIdent={innloggetBrukerIdent} />
            </Tabs.Panel>

            <Tabs.Panel value={Tab.DOKUMENTER}>
              <DokumentOversikt sak={sak} />
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
