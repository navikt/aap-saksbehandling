import { Tag, TagProps } from '@navikt/ds-react';
import { HourglassTopFilledIcon, PadlockLockedFillIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';

import styles from './OppgaveStatus.module.css';

export interface OppgaveStatusType {
  status: 'PÅ_VENT' | 'RESERVERT' | 'TRUKKET';
  label: string;
}

interface Props {
  oppgaveStatus: OppgaveStatusType;
  size?: TagProps['size'];
  showLabel?: boolean;
}

export const OppgaveStatus = ({ oppgaveStatus, size = 'small', showLabel = true }: Props) => {
  switch (oppgaveStatus.status) {
    case 'PÅ_VENT':
      return (
        <Tag className={styles.tag} icon={<HourglassTopFilledIcon />} variant={'warning-moderate'} size={size}>
          {showLabel && oppgaveStatus.label}
        </Tag>
      );
    case 'RESERVERT':
      return (
        <Tag className={styles.tag} icon={<PadlockLockedFillIcon />} variant={'error-moderate'} size={size}>
          {showLabel && oppgaveStatus.label}
        </Tag>
      );
    case 'TRUKKET':
      return (
        <Tag variant={'neutral-moderate'} icon={<XMarkOctagonIcon />} size={size}>
          {showLabel && oppgaveStatus.label}
        </Tag>
      );
  }
};
