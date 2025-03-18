import { Tabs, Tooltip } from '@navikt/ds-react';
import { ClockDashedIcon, PersonGavelFillIcon } from '@navikt/aksel-icons';
import { Dispatch } from 'react';

import styles from './ToTrinnsvurderingToggleGroup.module.css';

interface Props {
  activeToggle: string;
  setToggleValue: Dispatch<string>;
  erKvalitetssikring: boolean;
}

export const ToTrinnsvurderingToggleGroup = ({ activeToggle, setToggleValue, erKvalitetssikring }: Props) => {
  return (
    <Tabs
      defaultValue={activeToggle}
      onChange={(value) => setToggleValue(value)}
      value={activeToggle}
      size={'small'}
      className={styles.tabs}
      fill
    >
      <Tooltip content={'Åpne totrinnsvurdering'}>
        <Tabs.Tab
          value="totrinnsvurdering"
          label={erKvalitetssikring ? 'Kvalitetssikrer' : 'Beslutter'}
          icon={<PersonGavelFillIcon aria-hidden />}
        />
      </Tooltip>
      <Tooltip content={'Åpne historikk'}>
        <Tabs.Tab value="historikk" label={'Historikk'} icon={<ClockDashedIcon aria-hidden />} />
      </Tooltip>
    </Tabs>
  );
};
