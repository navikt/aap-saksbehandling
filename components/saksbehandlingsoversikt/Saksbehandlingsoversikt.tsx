'use client';

import { Button, HGrid, Tabs, Tooltip, VStack } from '@navikt/ds-react';
import {
  ChevronLeftDoubleIcon,
  ChevronRightDoubleIcon,
  ClockDashedIcon,
  FilesIcon,
  FolderFileIcon,
  HddDownIcon,
  PersonGavelIcon,
} from '@navikt/aksel-icons';
import { useState } from 'react';
import { Saksdokumenter } from 'components/saksdokumenter/Saksdokumenter';
import { InnhentDokumentasjon } from 'components/innhentdokumentasjon/InnhentDokumentasjon';

import styles from './Saksbehandlingsoversikt.module.css';
import { SaksHistorikk } from 'components/sakshistorikk/SaksHistorikk';
import { DetaljertBehandling, KabalKlageResultat, Klageresultat, SaksInfo } from 'lib/types/types';
import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { FetchResponse, isError } from 'lib/utils/api';
import { KlageBehandlingInfo } from 'components/behandlingsinfo/KlageBehandlingInfo';

enum Tab {
  BEHANDLINGSINFO = 'BEHANDLINGSINFO',
  KLAGEBEHANDLINGINFO = 'KLAGEBEHANDLINGINFO',
  SAKSDOKUMENTER = 'SAKSDOKUMENTER',
  BE_OM_OPPLYSNINGER = 'BE_OM_OPPLYSNINGER',
  HISTORIKK = 'HISTORIKK',
}

const ToggleButton = ({ expanded, setExpanded }: { expanded: boolean; setExpanded: (e: boolean) => void }) => (
  <div className={expanded ? styles.utvidetWrapper : styles.skjultWrapper}>
    <Button
      size="small"
      variant={'tertiary'}
      type={'button'}
      icon={expanded ? <ChevronRightDoubleIcon title="Skjul kolonne" /> : <ChevronLeftDoubleIcon title="Vis kolonne" />}
      onClick={() => setExpanded(!expanded)}
    />
  </div>
);

interface Props {
  behandling: DetaljertBehandling;
  sak: SaksInfo;
  klageresultat?: Klageresultat;
  kabalKlageresultat: FetchResponse<KabalKlageResultat>;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export const Saksbehandlingsoversikt = ({
  behandling,
  sak,
  klageresultat,
  kabalKlageresultat,
  expanded: expandedProp,
  onExpandedChange,
}: Props) => {
  const [expandedState, setExpandedState] = useState<boolean>(true);
  const [toggleGroupValue, setToggleGroupValue] = useState<Tab>(Tab.BEHANDLINGSINFO);
  const expanded = expandedProp ?? expandedState;

  const visKlagebehandlingFane =
    isError(kabalKlageresultat) || (klageresultat && ['OPPRETTHOLDES', 'DELVIS_OMGJØRES'].includes(klageresultat.type));

  const setExpanded = (nextExpanded: boolean) => {
    onExpandedChange(nextExpanded);
    if (expandedProp === undefined) {
      setExpandedState(nextExpanded);
    }
  };

  const expandAndSwitch = (tab: Tab) => {
    setExpanded(!expanded);
    setToggleGroupValue(tab);
  };

  const tabs = [
    {
      tooltip: 'Informasjon om behandlingen',
      label: 'Behandling',
      tabName: Tab.BEHANDLINGSINFO,
      icon: <FolderFileIcon aria-hidden />,
    },
    {
      tooltip: 'Informasjon om klagebehandling',
      label: 'Klage',
      tabName: Tab.KLAGEBEHANDLINGINFO,
      icon: <PersonGavelIcon aria-hidden />,
    },
    {
      tooltip: 'Åpne saksdokumenter',
      label: 'Saksdokumenter',
      tabName: Tab.SAKSDOKUMENTER,
      icon: <FilesIcon aria-hidden />,
    },
    {
      tooltip: 'Åpne be om opplysninger',
      label: 'Be om opplysninger',
      tabName: Tab.BE_OM_OPPLYSNINGER,
      icon: <HddDownIcon aria-hidden />,
    },
    {
      tooltip: 'Historikk',
      label: 'Historikk',
      tabName: Tab.HISTORIKK,
      icon: <ClockDashedIcon aria-hidden />,
    },
  ];

  return (
    <div className={`${styles.saksbehandlingsoversikt} ${expanded ? '' : styles.minimert}`}>
      {expanded && (
        <>
          <HGrid columns={'1fr auto'}>
            <ToggleButton expanded={expanded} setExpanded={setExpanded} />
            <Tabs
              defaultValue={toggleGroupValue}
              onChange={(value) => setToggleGroupValue(value as Tab)}
              value={toggleGroupValue}
              className={styles.stretch}
              size={'small'}
              fill
            >
              <Tabs.List className={expanded ? '' : styles.hidden}>
                {tabs
                  .filter((tab) => (!visKlagebehandlingFane ? tab.tabName !== Tab.KLAGEBEHANDLINGINFO : true))
                  .map((tab) => (
                    <Tooltip content={tab.tooltip} key={tab.tabName}>
                      <Tabs.Tab value={tab.tabName} icon={tab.icon} label={tab.label} />
                    </Tooltip>
                  ))}
              </Tabs.List>
            </Tabs>
          </HGrid>
          <div className={styles.tabContent}>
            {toggleGroupValue === Tab.BEHANDLINGSINFO && (
              <Behandlingsinfo behandling={behandling} sak={sak} klageresultat={klageresultat} />
            )}
            {toggleGroupValue === Tab.KLAGEBEHANDLINGINFO && (
              <KlageBehandlingInfo kabalKlageResultat={kabalKlageresultat} klageresultat={klageresultat} />
            )}
            {toggleGroupValue === Tab.SAKSDOKUMENTER && <Saksdokumenter />}
            {toggleGroupValue === Tab.BE_OM_OPPLYSNINGER && <InnhentDokumentasjon />}
            {toggleGroupValue === Tab.HISTORIKK && <SaksHistorikk />}
          </div>
        </>
      )}
      {!expanded && (
        <VStack gap={'space-8'} paddingBlock={'space-8'}>
          <ToggleButton expanded={expanded} setExpanded={setExpanded} />
          {tabs
            .filter((tab) => (!visKlagebehandlingFane ? tab.tabName !== Tab.KLAGEBEHANDLINGINFO : true))
            .map((tab) => (
              <Button
                className={styles.minimertKnapp}
                key={tab.tabName}
                size={'small'}
                variant={'tertiary'}
                type={'button'}
                icon={tab.icon}
                title={tab.label}
                onClick={() => expandAndSwitch(tab.tabName)}
              />
            ))}
        </VStack>
      )}
    </div>
  );
};
