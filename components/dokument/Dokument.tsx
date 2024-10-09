'use client';

import { Tabs, Tooltip } from '@navikt/ds-react';
import { ClockDashedIcon, FilesIcon, HddDownIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { Saksdokumenter } from 'components/saksdokumenter/Saksdokumenter';

export const Dokument = () => {
  const [toggleGroupValue, setToggleGroupValue] = useState<string>('saksdokumenter');

  return (
    <div className={'flex-column'}>
      <Tabs
        size={'small'}
        defaultValue={toggleGroupValue}
        onChange={(value) => setToggleGroupValue(value)}
        value={toggleGroupValue}
      >
        <Tooltip content={'saksdokumenter'}>
          <Tabs.Tab value="saksdokumenter" label={'Saksdokumenter'} icon={<FilesIcon aria-hidden />} />
        </Tooltip>
        <Tooltip content={'innhent_dokument'}>
          <Tabs.Tab value="innhent_dokument" label={'Innhent dokument'} icon={<HddDownIcon aria-hidden />} />
        </Tooltip>
        <Tooltip content={'sakshistorikk'}>
          <Tabs.Tab value="sakshistorikk" label={'Sakshistorikk'} icon={<ClockDashedIcon aria-hidden />} />
        </Tooltip>
      </Tabs>

      {toggleGroupValue === 'saksdokumenter' && <Saksdokumenter />}
      {toggleGroupValue === 'innhent_dokument' && <div>Her kommer det innhenting av dokumenter</div>}
      {toggleGroupValue === 'sakshistorikk' && <div>Her kommer det sakshistorikk</div>}
    </div>
  );
};
