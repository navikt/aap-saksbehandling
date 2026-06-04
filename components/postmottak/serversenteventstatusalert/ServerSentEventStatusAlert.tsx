import { Alert } from '@navikt/ds-react';
import { ServerSentEventStatus } from 'app/postmottak/api/post/[behandlingsreferanse]/hent/[gruppe]/[steg]/nesteSteg/route';

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
