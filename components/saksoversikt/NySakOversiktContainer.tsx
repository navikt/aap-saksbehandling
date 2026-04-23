'use client';

import { Box, ExpansionCard, Page, Tabs, VStack } from '@navikt/ds-react';
import { RettighetsinfoDto, SaksInfo } from 'lib/types/types';
import { SakerResponse } from 'lib/services/apiinternservice/apiInternService';
import { FileTextIcon, PersonIcon } from '@navikt/aksel-icons';
import { DokumentOversikt } from 'components/saksoversikt/dokumentoversikt/DokumentOversikt';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AktivitetspliktTrekk } from 'components/saksoversikt/aktivitetsplikttrekk/AktivitetspliktTrekk';
import { NySakMedBehandlinger } from 'components/saksoversikt/NySakMedBehandlinger';
import { ArenaSakKort } from 'components/saksoversikt/ArenaSakKort';

import styles from 'components/saksoversikt/Saksoversikt.module.css';

enum Tab {
  OVERSIKT = 'OVERSIKT',
  DOKUMENTER = 'DOKUMENTER',
  TREKK = 'TREKK',
}

export const NySakOversiktContainer = ({
  sak,
  innloggetBrukerIdent,
  rettighetsinfo,
  arenaSaker,
}: {
  sak: SaksInfo;
  innloggetBrukerIdent: string | undefined;
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

  return (
    <Page>
      <Page.Block className={styles.saksoversiktSide}>
        <Tabs defaultValue={tab} onChange={(value) => changeActiveTab(value as Tab)}>
          <Tabs.List>
            <Tabs.Tab label="Oversikt" value={Tab.OVERSIKT} icon={<PersonIcon />} />
            <Tabs.Tab label="Dokumenter" value={Tab.DOKUMENTER} icon={<FileTextIcon />} />
            <Tabs.Tab label="Aktivitetsplikt 11-9 trekk" value={Tab.TREKK} icon={<FileTextIcon />} />
          </Tabs.List>

          <Box marginBlock="8">
            <Tabs.Panel value={Tab.OVERSIKT}>
              <VStack gap={'8'}>
                <ExpansionCard defaultOpen aria-label="Kelvin" className={styles.saksoversiktSide__ExpansionCard}>
                  <ExpansionCard.Header>
                    <ExpansionCard.Title>Sak {sak.saksnummer}</ExpansionCard.Title>
                  </ExpansionCard.Header>
                  <ExpansionCard.Content>
                    <NySakMedBehandlinger
                      sak={sak}
                      innloggetBrukerIdent={innloggetBrukerIdent}
                      rettighetsinfo={rettighetsinfo}
                    />
                  </ExpansionCard.Content>
                </ExpansionCard>
                {arenaSaker && arenaSaker.saker.length > 0 && (
                  <VStack gap="4">
                    {arenaSaker.saker.map((arenaSak) => (
                      <ArenaSakKort key={`${arenaSak.sakId}-${arenaSak.lopenummer}`} sak={arenaSak} />
                    ))}
                  </VStack>
                )}
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
      </Page.Block>
    </Page>
  );
};
