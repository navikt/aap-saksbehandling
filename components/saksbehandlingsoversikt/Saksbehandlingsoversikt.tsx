'use client';

import { Tabs, Tooltip } from '@navikt/ds-react';
import { ClockDashedIcon, FilesIcon, HddDownIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { Saksdokumenter } from 'components/saksdokumenter/Saksdokumenter';
import { InnhentDokumentasjon } from 'components/innhentdokumentasjon/InnhentDokumentasjon';

import styles from './Saksbehandlingsoversikt.module.css';

export const Saksbehandlingsoversikt = () => {
  const [toggleGroupValue, setToggleGroupValue] = useState<string>('saksdokumenter');

  return (
    <div className={'flex-column'}>
      <Tabs
        defaultValue={toggleGroupValue}
        onChange={(value) => setToggleGroupValue(value)}
        value={toggleGroupValue}
        className={styles.stretch}
        fill
      >
        <Tooltip content={'Åpne saksdokumenter'}>
          <Tabs.Tab value="saksdokumenter" label={'Saksdokumenter'} icon={<FilesIcon aria-hidden />} />
        </Tooltip>
        <Tooltip content={'Åpne hent opplysninger'}>
          <Tabs.Tab value="hent_opplysninger" label={'Hent opplysninger'} icon={<HddDownIcon aria-hidden />} />
        </Tooltip>
        <Tooltip content={'Åpne sakshistorikk'}>
          <Tabs.Tab value="sakshistorikk" label={'Sakshistorikk'} icon={<ClockDashedIcon aria-hidden />} />
        </Tooltip>
      </Tabs>

      {toggleGroupValue === 'saksdokumenter' && <Saksdokumenter />}
      {toggleGroupValue === 'hent_opplysninger' && <InnhentDokumentasjon />}
      {toggleGroupValue === 'sakshistorikk' && <div>Her kommer det sakshistorikk</div>}
    </div>
  );
};
