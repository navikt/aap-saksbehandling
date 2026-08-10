import { ReturStatus } from 'lib/types/oppgaveTypes';
import { exhaustiveCheck } from 'lib/utils/typescript';

export function returStatusTilTekst(status: ReturStatus): string {
  switch (status) {
    case 'RETUR_FRA_BESLUTTER':
      return 'Retur fra beslutter';
    case 'RETUR_FRA_KVALITETSSIKRER':
      return 'Retur fra kvalitetssikrer';
    case 'RETUR_FRA_SAKSBEHANDLER':
      return 'Retur fra saksbehandler';
    case 'RETUR_FRA_VEILEDER':
      return 'Retur fra veileder';
    default:
      exhaustiveCheck(status);
  }
}
