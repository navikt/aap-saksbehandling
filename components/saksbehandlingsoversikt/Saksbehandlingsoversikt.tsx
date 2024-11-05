'use client';

import { Tabs, Tooltip } from '@navikt/ds-react';
import { ClockDashedIcon, FilesIcon, HddDownIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { Saksdokumenter } from 'components/saksdokumenter/Saksdokumenter';
import { DokumentInfo } from 'lib/types/types';
import { InnhentDokumentasjon } from 'components/innhentdokumentasjon/InnhentDokumentasjon';

interface Props {
  dokumenter?: DokumentInfo[];
}

export const Saksbehandlingsoversikt = ({ dokumenter }: Props) => {
  const [toggleGroupValue, setToggleGroupValue] = useState<string>('saksdokumenter');

  return (
    <div className={'flex-column'}>
      <Tabs
        size={'small'}
        defaultValue={toggleGroupValue}
        onChange={(value) => setToggleGroupValue(value)}
        value={toggleGroupValue}
      >
        <Tooltip content={'Åpne saksdokumenter'}>
          <Tabs.Tab value="saksdokumenter" label={'Saksdokumenter'} icon={<FilesIcon aria-hidden />} />
        </Tooltip>
        <Tooltip content={'Åpne innhent dokument'}>
          <Tabs.Tab value="innhent_dokument" label={'Innhent dokument'} icon={<HddDownIcon aria-hidden />} />
        </Tooltip>
        <Tooltip content={'Åpne sakshistorikk'}>
          <Tabs.Tab value="sakshistorikk" label={'Sakshistorikk'} icon={<ClockDashedIcon aria-hidden />} />
        </Tooltip>
      </Tabs>

      {toggleGroupValue === 'saksdokumenter' && <Saksdokumenter dokumenter={dokumenter} />}
      {toggleGroupValue === 'innhent_dokument' && <InnhentDokumentasjon />}
      {toggleGroupValue === 'sakshistorikk' && <div>Her kommer det sakshistorikk</div>}
    </div>
  );
};
