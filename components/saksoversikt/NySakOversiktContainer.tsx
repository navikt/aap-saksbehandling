'use client';

import { Box, ExpansionCard, HGrid, Page, Tabs, VStack } from '@navikt/ds-react';
import { SakPersoninfo, SaksInfo } from 'lib/types/types';
import { FileTextIcon, PersonIcon } from '@navikt/aksel-icons';
import { DokumentOversikt } from 'components/saksoversikt/dokumentoversikt/DokumentOversikt';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AktivitetspliktTrekk } from 'components/saksoversikt/aktivitetsplikttrekk/AktivitetspliktTrekk';
import { Rettighetsoversikt } from 'components/saksoversikt/rettighetsoversikt/Rettighetsoversikt';
import { NySakMedBehandlinger } from 'components/saksoversikt/NySakMedBehandlinger';
import { clientHentRettighetsdata } from 'lib/clientApi';
import { isError } from 'lib/utils/api';
import useSWR from 'swr';

import styles from 'components/saksoversikt/Saksoversikt.module.css';

enum Tab {
  OVERSIKT = 'OVERSIKT',
  DOKUMENTER = 'DOKUMENTER',
  TREKK = 'TREKK',
}

export const NySakOversiktContainer = ({
  sak,
  innloggetBrukerIdent,
}: {
  sak: SaksInfo;
  innloggetBrukerIdent: string | undefined;
  personInfo: SakPersoninfo;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState(searchParams.get('t') || Tab.OVERSIKT);

  const { data: rettighetData } = useSWR(`/api/sak/${sak.saksnummer}/rettighet`, () =>
    clientHentRettighetsdata(sak.saksnummer)
  );
  const rettighetListe = !isError(rettighetData) ? (rettighetData?.data ?? []) : [];
  const harRettigheter = rettighetListe.length > 0;

  const changeActiveTab = (newTab: Tab) => {
    setTab(newTab);
    router.replace(`?t=${newTab}`);
  };

  return (
    <Page>
      <Page.Block className={styles.saksoversiktSide}>
        <HGrid columns="6fr 2fr" gap={'4'}>
          <Tabs defaultValue={tab} onChange={(value) => changeActiveTab(value as Tab)}>
            <Tabs.List>
              <Tabs.Tab label="Oversikt" value={Tab.OVERSIKT} icon={<PersonIcon />} />
              <Tabs.Tab label="Dokumenter" value={Tab.DOKUMENTER} icon={<FileTextIcon />} />
              <Tabs.Tab label="Aktivitetsplikt 11-9 trekk" value={Tab.TREKK} icon={<FileTextIcon />} />
            </Tabs.List>

            <Box marginBlock="8">
              <Tabs.Panel value={Tab.OVERSIKT}>
                <VStack gap={'4'}>
                  <ExpansionCard open={true} aria-label="Kelvin" className={styles.saksoversiktSide__ExpansionCard}>
                    <ExpansionCard.Header>
                      <ExpansionCard.Title>Sak {sak.saksnummer}</ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                      <NySakMedBehandlinger sak={sak} innloggetBrukerIdent={innloggetBrukerIdent} />
                    </ExpansionCard.Content>
                  </ExpansionCard>
                </VStack>
              </Tabs.Panel>

              <Tabs.Panel value={Tab.DOKUMENTER}>
                <DokumentOversikt sak={sak} />
              </Tabs.Panel>
              <Tabs.Panel value={Tab.TREKK}>
                <AktivitetspliktTrekk sak={sak} />
              </Tabs.Panel>
            </Box>
          </Tabs>

          {harRettigheter && (
            <aside>
              <Box padding="space-20" borderWidth="1" borderRadius="large" borderColor="border-divider">
                <Rettighetsoversikt rettighetListe={rettighetListe} />
              </Box>
            </aside>
          )}
        </HGrid>
      </Page.Block>
    </Page>
  );
};
