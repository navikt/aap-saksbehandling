import { Behandlingsstatus as Status } from 'lib/types/types';
import { Tag } from '@navikt/ds-react';

import styles from './Behandlingsstatus.module.css';

interface Props {
  status: Status;
}

export const Behandlingsstatus = ({ status }: Props) => {
  switch (status) {
    case 'UTREDES':
      return (
        <Tag className={styles.tag} size={'xsmall'} variant={'info'}>
          Utredes
        </Tag>
      );
    case 'OPPRETTET':
      return (
        <Tag className={styles.tag} size={'xsmall'} variant={'info'}>
          Opprettet
        </Tag>
      );
    case 'AVSLUTTET':
      return (
        <Tag className={styles.tag} size={'xsmall'} variant={'neutral'}>
          Avsluttet
        </Tag>
      );
    case 'IVERKSETTES':
      return (
        <Tag className={styles.tag} size={'xsmall'} variant={'success'}>
          Iverksettes
        </Tag>
      );
  }
};
