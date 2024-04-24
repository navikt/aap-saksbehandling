import { ToggleGroup } from '@navikt/ds-react';
import { ClockDashedIcon, PersonGavelFillIcon } from '@navikt/aksel-icons';
import { Dispatch } from 'react';

interface Props {
  activeToggle: string;
  setToggleValue: Dispatch<string>;
}

export const ToTrinnsvurderingToggleGroup = ({ activeToggle, setToggleValue }: Props) => {
  return (
    <ToggleGroup size={'small'} defaultValue="lest" onChange={(value) => setToggleValue(value)} value={activeToggle}>
      <ToggleGroup.Item value="totrinnsvurdering">
        <PersonGavelFillIcon aria-hidden />
        Totrinn
      </ToggleGroup.Item>
      <ToggleGroup.Item value="historikk">
        <ClockDashedIcon aria-hidden />
        Historikk
      </ToggleGroup.Item>
    </ToggleGroup>
  );
};
