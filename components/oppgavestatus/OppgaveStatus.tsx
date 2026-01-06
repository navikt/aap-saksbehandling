import { Tag, TagProps } from '@navikt/ds-react';
import {
  HourglassBottomFilledIcon,
  HourglassTopFilledIcon,
  PadlockLockedFillIcon,
  XMarkOctagonIcon,
} from '@navikt/aksel-icons';

import styles from './OppgaveStatus.module.css';
import { toggles } from 'lib/utils/toggles';

export interface OppgaveStatusType {
  status: 'PÅ_VENT' | 'TILDELT' | 'TRUKKET' | 'AVBRUTT' | 'LEDIG' | 'TILDELT_INNLOGGET_BRUKER' | 'VENTEFRIST_UTLØPT';
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
    case 'VENTEFRIST_UTLØPT':
      return (
        toggles.featureUtløptVentefrist && (
          <Tag className={styles.tag} icon={<HourglassBottomFilledIcon />} variant={'error-moderate'} size={size}>
            {showLabel && oppgaveStatus.label}
          </Tag>
        )
      );
    case 'TILDELT':
      return (
        <Tag className={styles.tag} icon={<PadlockLockedFillIcon />} variant={'error-moderate'} size={size}>
          {showLabel && oppgaveStatus.label}
        </Tag>
      );
    case 'TILDELT_INNLOGGET_BRUKER':
      return (
        <Tag className={styles.tag} variant={'neutral-moderate'} size={size}>
          {showLabel && oppgaveStatus.label}
        </Tag>
      );
    case 'LEDIG':
      return (
        <Tag className={styles.tag} variant={'neutral-moderate'} size={size}>
          {showLabel && oppgaveStatus.label}
        </Tag>
      );
    case 'TRUKKET':
    case 'AVBRUTT':
      return (
        <Tag variant={'neutral-moderate'} icon={<XMarkOctagonIcon />} size={size}>
          {showLabel && oppgaveStatus.label}
        </Tag>
      );
  }
};
