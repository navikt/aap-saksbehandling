import { Tag } from '@navikt/ds-react';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import styles from './ArenaStatus.module.css';

export const ArenaStatus = () => {
  return (
    <Tag icon={<ClockDashedIcon />} variant={'info-moderate'} size={'small'} className={styles.tag}>
      Arenahistorikk
    </Tag>
  );
};
