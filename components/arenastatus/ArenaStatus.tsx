import { Tag } from '@navikt/ds-react';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import styles from './ArenaStatus.module.css';

export const ArenaStatus = () => {
  return (
    <Tag
      data-color="info"
      icon={<ClockDashedIcon />}
      variant={"moderate"}
      size={'small'}
      className={styles.tag}>Arenahistorikk
          </Tag>
  );
};
