import { Tag } from '@navikt/ds-react';
import styles from 'components/oppgavestatus/OppgaveStatus.module.css';
import { MarkeringType } from 'lib/types/oppgaveTypes';
import { ikonForMarkeringType, variantFraType } from 'components/markeringinfoboks/MarkeringInfoboks';

interface Props {
  markeringType: MarkeringType;
}

export const MarkeringStatus = ({ markeringType }: Props) => {
  return (
    <Tag
      className={styles.tag}
      icon={ikonForMarkeringType(markeringType)}
      variant={variantFraType(markeringType)}
      size={'xsmall'}
    >
      {' '}
    </Tag>
  );
};
