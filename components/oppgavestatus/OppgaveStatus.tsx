import { Tag } from '@navikt/ds-react';
import { HourglassTopFilledIcon, PadlockLockedFillIcon } from '@navikt/aksel-icons';

import styles from './OppgaveStatus.module.css';

export interface OppgaveStatusType {
  status: 'PÅ_VENT' | 'RESERVERT';
  label: string;
}

interface Props {
  oppgaveStatus: OppgaveStatusType;
}

export const OppgaveStatus = ({ oppgaveStatus }: Props) => {
  switch (oppgaveStatus.status) {
    case 'PÅ_VENT':
      return (
        <Tag className={styles.tag} icon={<HourglassTopFilledIcon />} variant={'warning-moderate'} size={'small'}>
          {oppgaveStatus.label}
        </Tag>
      );
    case 'RESERVERT':
      return (
        <Tag className={styles.tag} icon={<PadlockLockedFillIcon />} variant={'error'} size={'small'}>
          {oppgaveStatus.label}
        </Tag>
      );
  }
};
