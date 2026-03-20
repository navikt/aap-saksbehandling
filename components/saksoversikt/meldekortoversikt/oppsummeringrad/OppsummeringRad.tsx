import styles from './OppsummeringRad.module.css';
import { BodyShort, HStack } from '@navikt/ds-react';

interface Props {
  label: string;
  value: string;
}

export const OppsummeringRad = ({ label, value }: Props) => {
  return (
    <HStack className={styles.oppsummering} justify={'space-between'}>
      <BodyShort size={'small'} weight={'semibold'}>
        {label}
      </BodyShort>
      <BodyShort size={'small'}>{value}</BodyShort>
    </HStack>
  );
};
