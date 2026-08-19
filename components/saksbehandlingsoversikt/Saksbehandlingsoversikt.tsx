'use client';

import { Box, Button, HGrid, Label, Tabs, Tooltip, VStack } from '@navikt/ds-react';
import {
  ChevronLeftDoubleIcon,
  ChevronRightDoubleIcon,
  ClockDashedIcon,
  FolderIcon,
  PaperplaneIcon,
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
import { mapTypeBehandlingTilTekst } from 'lib/utils/oversettelser';
import { useFeatureFlag } from 'context/UnleashContext';
import { DialogMedBehandler } from 'components/dialogmedbehandler/DialogMedBehandler';

enum Tab {
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
  const [toggleGroupValue, setToggleGroupValue] = useState<Tab>(Tab.SAKSDOKUMENTER);
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
      tooltip: 'Informasjon om klagebehandling',
      label: 'Klage',
      tabName: Tab.KLAGEBEHANDLINGINFO,
      icon: <PersonGavelIcon aria-hidden />,
    },
    {
      tooltip: 'Åpne saksdokumenter',
      label: 'Saksdokumenter',
      tabName: Tab.SAKSDOKUMENTER,
      icon: <FolderIcon aria-hidden />,
    },
    {
      tooltip: 'Åpne be om opplysninger',
      label: 'Be om opplysninger',
      tabName: Tab.BE_OM_OPPLYSNINGER,
      icon: <PaperplaneIcon aria-hidden />,
    },
    {
      tooltip: 'Historikk',
      label: 'Historikk',
      tabName: Tab.HISTORIKK,
      icon: <ClockDashedIcon aria-hidden />,
    },
  ];

  const featureDialogMedBehandler = useFeatureFlag('DialogMedBehandler');

  return (
    <div className={`${styles.saksbehandlingsoversikt} ${expanded ? '' : styles.minimert}`}>
      {expanded && (
        <>
          <HGrid columns={'auto 1fr'} gap={'space-8'} align="center" className={styles.header}>
            <ToggleButton expanded={expanded} setExpanded={setExpanded} />
            <Box padding={'space-8'}>
              <Label as={'p'} size={'medium'}>
                {mapTypeBehandlingTilTekst(behandling.type)}
              </Label>
            </Box>
          </HGrid>
          <Behandlingsinfo behandling={behandling} sak={sak} klageresultat={klageresultat} />
          <Tabs
            defaultValue={toggleGroupValue}
            onChange={(value) => setToggleGroupValue(value as Tab)}
            value={toggleGroupValue}
            className={styles.tabs}
            size={'small'}
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
          <div className={styles.tabContent}>
            {toggleGroupValue === Tab.KLAGEBEHANDLINGINFO && (
              <KlageBehandlingInfo kabalKlageResultat={kabalKlageresultat} klageresultat={klageresultat} />
            )}
            {toggleGroupValue === Tab.SAKSDOKUMENTER && <Saksdokumenter />}
            {toggleGroupValue === Tab.BE_OM_OPPLYSNINGER && !featureDialogMedBehandler && <InnhentDokumentasjon />}
            {toggleGroupValue === Tab.BE_OM_OPPLYSNINGER && featureDialogMedBehandler && <DialogMedBehandler />}
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
