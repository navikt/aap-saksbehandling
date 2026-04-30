import { Tag, TagProps } from '@navikt/ds-react';
import {
  HourglassBottomFilledIcon,
  HourglassTopFilledIcon,
  PadlockLockedFillIcon,
  XMarkOctagonIcon,
} from '@navikt/aksel-icons';

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
  const label = showLabel ? oppgaveStatus.label : '';

  switch (oppgaveStatus.status) {
    case 'PÅ_VENT':
      return (
        <Tag data-color="warning" icon={<HourglassTopFilledIcon />} variant={'moderate'} size={size}>
          {label}
        </Tag>
      );
    case 'VENTEFRIST_UTLØPT':
      return (
        <Tag data-color="danger" icon={<HourglassBottomFilledIcon />} variant={'moderate'} size={size}>
          {label}
        </Tag>
      );
    case 'TILDELT':
      return (
        <Tag data-color="danger" icon={<PadlockLockedFillIcon />} variant={'moderate'} size={size}>
          {label}
        </Tag>
      );
    case 'TILDELT_INNLOGGET_BRUKER':
      return (
        <Tag data-color="neutral" variant={'moderate'} size={size}>
          {label}
        </Tag>
      );
    case 'LEDIG':
      return (
        <Tag data-color="neutral" variant={'moderate'} size={size}>
          {label}
        </Tag>
      );
    case 'TRUKKET':
    case 'AVBRUTT':
      return (
        <Tag data-color="neutral" variant={'moderate'} icon={<XMarkOctagonIcon />} size={size}>
          {label}
        </Tag>
      );
  }
};
