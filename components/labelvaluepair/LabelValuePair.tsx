import React from 'react';
import { BodyShort, Label } from '@navikt/ds-react';

interface Props {
  label: string;
  value?: string | number;
}

export const LabelValuePair = ({ label, value }: Props) => {
  return (
    <div>
      <Label size={'small'}>{label}</Label>
      <BodyShort size={'small'}>{value}</BodyShort>
    </div>
  );
};
