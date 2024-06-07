import { Tabs, Tooltip } from '@navikt/ds-react';
import { ClockDashedIcon, PersonGavelFillIcon } from '@navikt/aksel-icons';
import { Dispatch } from 'react';

interface Props {
  activeToggle: string;
  setToggleValue: Dispatch<string>;
  erKvalitetssikring: boolean;
}

export const ToTrinnsvurderingToggleGroup = ({ activeToggle, setToggleValue, erKvalitetssikring }: Props) => {
  return (
    <Tabs size={'small'} defaultValue={activeToggle} onChange={(value) => setToggleValue(value)} value={activeToggle}>
      <Tooltip content={'Totrinnsvurdering'}>
        <Tabs.Tab
          value="totrinnsvurdering"
          label={erKvalitetssikring ? 'Kvalitetssikrer' : 'Beslutter'}
          icon={<PersonGavelFillIcon aria-hidden />}
        />
      </Tooltip>
      <Tooltip content={'Historikk'}>
        <Tabs.Tab value="historikk" label={'Historikk'} icon={<ClockDashedIcon aria-hidden />} />
      </Tooltip>
    </Tabs>
  );
};
