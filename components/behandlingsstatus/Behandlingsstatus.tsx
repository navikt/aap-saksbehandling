import { Behandlingsstatus as Status } from 'lib/types/types';
import { Tag } from '@navikt/ds-react';

interface Props {
  status?: Status;
}

export const Behandlingsstatus = ({ status }: Props) => {
  switch (status) {
    case 'UTREDES':
      return (
        <Tag data-color="info" size={'xsmall'} variant={'outline'}>
          Utredes
        </Tag>
      );
    case 'OPPRETTET':
      return (
        <Tag data-color="info" size={'xsmall'} variant={'outline'}>
          Opprettet
        </Tag>
      );
    case 'AVSLUTTET':
      return (
        <Tag data-color="neutral" size={'xsmall'} variant={'outline'}>
          Avsluttet
        </Tag>
      );
    case 'IVERKSETTES':
      return (
        <Tag data-color="success" size={'xsmall'} variant={'outline'}>
          Iverksettes
        </Tag>
      );
  }
};
