import React from 'react';
import { BodyShort, Label, Tooltip } from '@navikt/ds-react';

interface Props {
  label: string;
  value?: string | number;
  tooltip?: string;
}

export const LabelValuePair = ({ label, value, tooltip }: Props) => {
  return (
    <div>
      {tooltip ? (
        <Tooltip content={tooltip}>
          <Label size={'small'}>{label}</Label>
        </Tooltip>
      ) : (
        <Label size={'small'}>{label}</Label>
      )}
      <BodyShort size={'small'}>{value}</BodyShort>
    </div>
  );
};
