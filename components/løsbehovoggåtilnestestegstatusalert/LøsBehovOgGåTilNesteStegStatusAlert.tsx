'use client';

import { Alert, BodyShort } from '@navikt/ds-react';
import { useParams } from 'next/navigation';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';

interface Props {
  status?: LøsBehovOgGåTilNesteStegStatus;
  løsBehovOgGåTilNesteStegError?: ApiException;
}

export const LøsBehovOgGåTilNesteStegStatusAlert = ({ status, løsBehovOgGåTilNesteStegError }: Props) => {
  const { behandlingsreferanse, saksnummer } = useParams<{ behandlingsreferanse: string; saksnummer: string }>();
  return (
    <>
      {løsBehovOgGåTilNesteStegError && (
        <Alert variant="error">
          <BodyShort spacing style={{ whiteSpace: 'pre-wrap' }}>
            {løsBehovOgGåTilNesteStegError.message}
          </BodyShort>
          <BodyShort size={'small'}>
            <b>SakId:</b>
            {` ${saksnummer}`}
          </BodyShort>
          <BodyShort size={'small'}>
            <b>Behandlingsreferanse:</b>
            {` ${behandlingsreferanse}`}
          </BodyShort>
        </Alert>
      )}
      {status === 'ERROR' && (
        <Alert variant="error">
          <BodyShort spacing>Det tok for lang tid å hente neste steg fra baksystemet. Kom tilbake senere.</BodyShort>
          <BodyShort size={'small'}>
            <b>SakId:</b>
            {` ${saksnummer}`}
          </BodyShort>
          <BodyShort size={'small'}>
            <b>Behandlingsreferanse:</b>
            {` ${behandlingsreferanse}`}
          </BodyShort>
        </Alert>
      )}
      {status === 'POLLING' && (
        <Alert variant="info">
          <BodyShort spacing>Maskinen bruker litt lengre tid på å jobbe enn vanlig.</BodyShort>
          <BodyShort size={'small'}>
            <b>SakId:</b>
            {` ${saksnummer}`}
          </BodyShort>
          <BodyShort size={'small'}>
            <b>Behandlingsreferanse:</b>
            {` ${behandlingsreferanse}`}
          </BodyShort>
        </Alert>
      )}
    </>
  );
};
