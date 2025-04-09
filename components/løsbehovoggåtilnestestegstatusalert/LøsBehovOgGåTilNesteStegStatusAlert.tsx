'use client';

import { Alert, BodyShort, Button } from '@navikt/ds-react';
import { useParams } from 'next/navigation';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { revalidateFlyt } from 'lib/actions/actions';
import { ApiException } from 'lib/services/apiFetch';

interface Props {
  status?: LøsBehovOgGåTilNesteStegStatus;
  løsBehovOgGåTilNesteStegError?: ApiException;
  resetStatus?: () => void;
}

export const LøsBehovOgGåTilNesteStegStatusAlert = ({ status, resetStatus, løsBehovOgGåTilNesteStegError }: Props) => {
  const { behandlingsReferanse, saksId } = useParams<{ behandlingsReferanse: string; saksId: string }>();
  return (
    <>
      {løsBehovOgGåTilNesteStegError && (
        <Alert variant="error">
          <BodyShort spacing>{løsBehovOgGåTilNesteStegError.message}</BodyShort>
          <BodyShort size={'small'}>
            <b>SakId:</b>
            {` ${saksId}`}
          </BodyShort>
          <BodyShort size={'small'}>
            <b>Behandlingsreferanse:</b>
            {` ${behandlingsReferanse}`}
          </BodyShort>
        </Alert>
      )}
      {status === 'ERROR' && (
        <Alert variant="error">
          <BodyShort spacing>Det tok for lang tid å hente neste steg fra baksystemet. Kom tilbake senere.</BodyShort>
          <BodyShort size={'small'}>
            <b>SakId:</b>
            {` ${saksId}`}
          </BodyShort>
          <BodyShort size={'small'}>
            <b>Behandlingsreferanse:</b>
            {` ${behandlingsReferanse}`}
          </BodyShort>
        </Alert>
      )}
      {status === 'POLLING' && (
        <Alert variant="info">
          <BodyShort spacing>Maskinen bruker litt lengre tid på å jobbe enn vanlig.</BodyShort>
          <BodyShort size={'small'}>
            <b>SakId:</b>
            {` ${saksId}`}
          </BodyShort>
          <BodyShort size={'small'}>
            <b>Behandlingsreferanse:</b>
            {` ${behandlingsReferanse}`}
          </BodyShort>
        </Alert>
      )}
      {status === 'CLIENT_CONFLICT' && (
        <Alert variant="error">
          <BodyShort spacing>Det ser ut til at noe har endret seg i behandlingen siden sist vi sjekket.</BodyShort>
          <Button
            type={'button'}
            onClick={async () => {
              await revalidateFlyt(behandlingsReferanse);
              resetStatus && resetStatus();
            }}
          >
            Oppdater
          </Button>
        </Alert>
      )}
    </>
  );
};
