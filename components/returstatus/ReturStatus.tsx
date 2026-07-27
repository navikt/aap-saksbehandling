import { NoNavAapOppgaveReturInformasjonDtoStatus } from '@navikt/aap-oppgave-typescript-types';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';
import { exhaustiveCheck } from 'lib/utils/typescript';

interface Props {
  returStatus: NoNavAapOppgaveReturInformasjonDtoStatus;
}

export const ReturStatus = ({ returStatus }: Props) => {
  return (
    <Tag data-color="meta-purple" icon={<ArrowsSquarepathIcon />} variant={'moderate'} size={'small'}>
      {returStatusTilTekst(returStatus)}
    </Tag>
  );
};

function returStatusTilTekst(status: NoNavAapOppgaveReturInformasjonDtoStatus): string {
  switch (status) {
    case NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_BESLUTTER:
      return 'Retur fra beslutter';
    case NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_KVALITETSSIKRER:
      return 'Retur fra kvalitetssikrer';
    case NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_SAKSBEHANDLER:
      return 'Retur fra saksbehandler';
    case NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_VEILEDER:
      return 'Retur fra veileder';
    default:
      exhaustiveCheck(status);
  }
}
