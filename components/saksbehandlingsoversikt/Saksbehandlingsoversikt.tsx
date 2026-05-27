'use client';

import { Button, Tabs, Tooltip, VStack } from '@navikt/ds-react';
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

interface Props {
  behandling: DetaljertBehandling;
  sak: SaksInfo;
  klageresultat?: Klageresultat;
  kabalKlageresultat: FetchResponse<KabalKlageResultat>;
}

export const Saksbehandlingsoversikt = ({ behandling, sak, klageresultat, kabalKlageresultat }: Props) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [toggleGroupValue, setToggleGroupValue] = useState<Tab>(Tab.BEHANDLINGSINFO);

  const visKlagebehandlingFane =
    isError(kabalKlageresultat) || (klageresultat && ['OPPRETTHOLDES', 'DELVIS_OMGJØRES'].includes(klageresultat.type));

  const expandAndSwitch = (tab: Tab) => {
    setExpanded(!expanded);
    setToggleGroupValue(tab);
  };

  return (
    <div className={`${styles.saksbehandlingsoversikt} ${expanded ? '' : styles.hidden}`}>
      <Button
        size="small"
        variant={'tertiary'}
        type={'button'}
        icon={
          expanded ? <ChevronRightDoubleIcon title="Skjul kolonne" /> : <ChevronLeftDoubleIcon title="Vis kolonne" />
        }
        onClick={() => setExpanded(!expanded)}
      />
      {expanded && (
        <>
          <Tabs
            defaultValue={toggleGroupValue}
            onChange={(value) => setToggleGroupValue(value as Tab)}
            value={toggleGroupValue}
            className={styles.stretch}
            size={'small'}
            fill
          >
            <Tabs.List className={expanded ? '' : styles.hidden}>
              <Tooltip content={'Informasjon om behandlingen'}>
                <Tabs.Tab value={Tab.BEHANDLINGSINFO} label={'Behandling'} icon={<FolderFileIcon aria-hidden />} />
              </Tooltip>
              {visKlagebehandlingFane && (
                <Tooltip content={'Informasjon om klagebehandling'}>
                  <Tabs.Tab value={Tab.KLAGEBEHANDLINGINFO} label={'Klage'} icon={<PersonGavelIcon aria-hidden />} />
                </Tooltip>
              )}
              <Tooltip content={'Åpne saksdokumenter'}>
                <Tabs.Tab value={Tab.SAKSDOKUMENTER} label={'Saksdokumenter'} icon={<FilesIcon aria-hidden />} />
              </Tooltip>
              <Tooltip content={'Åpne be om opplysninger'}>
                <Tabs.Tab
                  value={Tab.BE_OM_OPPLYSNINGER}
                  label={'Be om opplysninger'}
                  icon={<HddDownIcon aria-hidden />}
                />
              </Tooltip>
              <Tooltip content={'Historikk'}>
                <Tabs.Tab value={Tab.HISTORIKK} label={'Historikk'} icon={<ClockDashedIcon aria-hidden />} />
              </Tooltip>
            </Tabs.List>
          </Tabs>
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
        <VStack>
          <Button
            size={'small'}
            variant={'tertiary'}
            type={'button'}
            icon={<FolderFileIcon aria-hidden />}
            onClick={() => expandAndSwitch(Tab.BEHANDLINGSINFO)}
          />
          {visKlagebehandlingFane && (
            <Button
              size={'small'}
              variant={'tertiary'}
              type={'button'}
              icon={<PersonGavelIcon aria-hidden />}
              onClick={() => expandAndSwitch(Tab.KLAGEBEHANDLINGINFO)}
            />
          )}
          <Button
            size={'small'}
            variant={'tertiary'}
            type={'button'}
            icon={<FilesIcon aria-hidden />}
            onClick={() => expandAndSwitch(Tab.SAKSDOKUMENTER)}
          />
          <Button
            size={'small'}
            variant={'tertiary'}
            type={'button'}
            icon={<HddDownIcon aria-hidden />}
            onClick={() => expandAndSwitch(Tab.BE_OM_OPPLYSNINGER)}
          />
          <Button
            size={'small'}
            variant={'tertiary'}
            type={'button'}
            icon={<ClockDashedIcon aria-hidden />}
            onClick={() => expandAndSwitch(Tab.HISTORIKK)}
          />
        </VStack>
      )}
    </div>
  );
};
