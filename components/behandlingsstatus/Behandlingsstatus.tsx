import { Behandlingsstatus as Status } from 'lib/types/types';
import { Tag } from '@navikt/ds-react';

import styles from './Behandlingsstatus.module.css';

interface Props {
  status?: Status;
}

export const Behandlingsstatus = ({ status }: Props) => {
  switch (status) {
    case 'UTREDES':
      return (
        <Tag
          data-color="info"
          className={styles.tag}
          size={'xsmall'}
          variant={"outline"}>Utredes
                  </Tag>
      );
    case 'OPPRETTET':
      return (
        <Tag
          data-color="info"
          className={styles.tag}
          size={'xsmall'}
          variant={"outline"}>Opprettet
                  </Tag>
      );
    case 'AVSLUTTET':
      return (
        <Tag
          data-color="neutral"
          className={styles.tag}
          size={'xsmall'}
          variant={"outline"}>Avsluttet
                  </Tag>
      );
    case 'IVERKSETTES':
      return (
        <Tag
          data-color="success"
          className={styles.tag}
          size={'xsmall'}
          variant={"outline"}>Iverksettes
                  </Tag>
      );
  }
};
