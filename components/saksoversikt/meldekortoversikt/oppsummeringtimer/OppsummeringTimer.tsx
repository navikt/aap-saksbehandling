import { BodyShort, HStack } from '@navikt/ds-react';
import styles from './OppsummeringTimer.module.css';

interface Props {
  timer: number;
}

export const OppsummeringTimer = ({ timer }: Props) => {
  return (
    <HStack className={styles.oppsummering} justify={'space-between'}>
      <BodyShort size={'small'} weight={'semibold'}>
        Sammenlagt for perioden
      </BodyShort>
      <BodyShort size={'small'}>{timer} timer</BodyShort>
    </HStack>
  );
};
