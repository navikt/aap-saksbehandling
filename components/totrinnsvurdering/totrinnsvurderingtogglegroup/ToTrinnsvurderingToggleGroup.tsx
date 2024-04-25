import { ToggleGroup, Tooltip } from '@navikt/ds-react';
import { ClockDashedIcon, PersonGavelFillIcon } from '@navikt/aksel-icons';
import { Dispatch } from 'react';

interface Props {
  activeToggle: string;
  setToggleValue: Dispatch<string>;
}

export const ToTrinnsvurderingToggleGroup = ({ activeToggle, setToggleValue }: Props) => {
  return (
    <ToggleGroup
      size={'small'}
      defaultValue={activeToggle}
      onChange={(value) => setToggleValue(value)}
      value={activeToggle}
    >
      <Tooltip content={'Totrinnsvurdering'}>
        <ToggleGroup.Item value="totrinnsvurdering">
          <PersonGavelFillIcon aria-hidden />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content={'Historikk'}>
        <ToggleGroup.Item value="historikk">
          <ClockDashedIcon aria-hidden />
        </ToggleGroup.Item>
      </Tooltip>
    </ToggleGroup>
  );
};
