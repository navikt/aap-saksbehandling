import { NoNavAapOppgaveReturInformasjonDtoStatus as ReturStatus } from '@navikt/aap-oppgave-typescript-types';
import { exhaustiveCheck } from 'lib/utils/typescript';

export function returStatusTilTekst(status: ReturStatus): string {
  switch (status) {
    case ReturStatus.RETUR_FRA_BESLUTTER:
      return 'Retur fra beslutter';
    case ReturStatus.RETUR_FRA_KVALITETSSIKRER:
      return 'Retur fra kvalitetssikrer';
    case ReturStatus.RETUR_FRA_SAKSBEHANDLER:
      return 'Retur fra saksbehandler';
    case ReturStatus.RETUR_FRA_VEILEDER:
      return 'Retur fra veileder';
    default:
      exhaustiveCheck(status);
  }
}
