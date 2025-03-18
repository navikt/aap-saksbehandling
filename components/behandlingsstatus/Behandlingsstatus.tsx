import { Behandlingsstatus as Status } from 'lib/types/types';
import { Tag } from '@navikt/ds-react';

interface Props {
  status: Status;
}

export const Behandlingsstatus = ({ status }: Props) => {
  switch (status) {
    case 'UTREDES':
      return (
        <Tag size={'xsmall'} variant={'info'}>
          Utredes
        </Tag>
      );
    case 'OPPRETTET':
      return (
        <Tag size={'xsmall'} variant={'info'}>
          Opprettet
        </Tag>
      );
    case 'AVSLUTTET':
      return (
        <Tag size={'xsmall'} variant={'neutral'}>
          Avsluttet
        </Tag>
      );
    case 'IVERKSETTES':
      return (
        <Tag size={'xsmall'} variant={'success'}>
          Iverksettes
        </Tag>
      );
  }
};
