'use client';

import { Tabs, Tooltip } from '@navikt/ds-react';
import { ClockDashedIcon, FilesIcon, HddDownIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { Saksdokumenter } from 'components/saksdokumenter/Saksdokumenter';
import { InnhentDokumentasjon } from 'components/innhentdokumentasjon/InnhentDokumentasjon';

import styles from './Saksbehandlingsoversikt.module.css';
import { SaksHistorikk } from 'components/sakshistorikk/SaksHistorikk';

enum Tab {
  SAKSDOKUMENTER = 'SAKSDOKUMENTER',
  BE_OM_OPPLYSNINGER = 'BE_OM_OPPLYSNINGER',
  HISTORIKK = 'HISTORIKK',
}

export const Saksbehandlingsoversikt = () => {
  const [toggleGroupValue, setToggleGroupValue] = useState<Tab>(Tab.SAKSDOKUMENTER);

  return (
    <div className={styles.saksbehandlingsoversikt}>
      <Tabs
        defaultValue={toggleGroupValue}
        onChange={(value) => setToggleGroupValue(value as Tab)}
        value={toggleGroupValue}
        className={styles.stretch}
        size={'small'}
        fill
      >
        <Tabs.List>
          <Tooltip content={'Åpne saksdokumenter'}>
            <Tabs.Tab value={Tab.SAKSDOKUMENTER} label={'Saksdokumenter'} icon={<FilesIcon aria-hidden />} />
          </Tooltip>
          <Tooltip content={'Åpne be om opplysninger'}>
            <Tabs.Tab value={Tab.BE_OM_OPPLYSNINGER} label={'Be om opplysninger'} icon={<HddDownIcon aria-hidden />} />
          </Tooltip>
          <Tooltip content={'Historikk'}>
            <Tabs.Tab value={Tab.HISTORIKK} label={'Historikk'} icon={<ClockDashedIcon aria-hidden />} />
          </Tooltip>
        </Tabs.List>
      </Tabs>
      <div className={styles.tabContent}>
        {toggleGroupValue === Tab.SAKSDOKUMENTER && <Saksdokumenter />}
        {toggleGroupValue === Tab.BE_OM_OPPLYSNINGER && <InnhentDokumentasjon />}
        {toggleGroupValue === Tab.HISTORIKK && <SaksHistorikk />}
      </div>
    </div>
  );
};
