import { Tag } from '@navikt/ds-react';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import styles from './ArenaStatus.module.css';

export const ArenaStatus = () => {
  return (
    <Tag icon={<ClockDashedIcon />} variant={'info'} size={'xsmall'} className={styles.tag}>
      Arenahistorikk
    </Tag>
  );
};
