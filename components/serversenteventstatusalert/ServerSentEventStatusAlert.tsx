import { ServerSentEventStatus } from 'app/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import { Alert } from '@navikt/ds-react';

interface Props {
  status?: ServerSentEventStatus;
}

export const ServerSentEventStatusAlert = ({ status }: Props) => {
  return (
    <>
      {status === 'ERROR' && (
        <Alert variant="error">Det tok for lang tid å hente neste steg fra baksystemet. Kom tilbake senere..️</Alert>
      )}
      {status === 'POLLING' && (
        <Alert variant="info">Maskinen bruker litt lengre tid på å jobbe enn vanlig. Ta deg en kopp kaffe.</Alert>
      )}
    </>
  );
};
