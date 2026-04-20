import { Tag } from '@navikt/ds-react';
import { MarkeringType } from 'lib/types/oppgaveTypes';
import { ikonForMarkeringType, variantFraType } from 'components/markeringinfoboks/MarkeringInfoboks';

interface Props {
  markeringType: MarkeringType;
}

export const MarkeringStatus = ({ markeringType }: Props) => {
  return (
    <Tag icon={ikonForMarkeringType(markeringType)} variant={variantFraType(markeringType)} size={'xsmall'}>
      {' '}
    </Tag>
  );
};
