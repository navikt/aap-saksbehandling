'use client';

import { Alert, BodyShort } from '@navikt/ds-react';
import { useParams } from 'next/navigation';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';

interface Props {
  status?: LøsBehovOgGåTilNesteStegStatus;
  løsBehovOgGåTilNesteStegError?: ApiException;
}

export const LøsBehovOgGåTilNesteStegStatusAlert = ({ status, løsBehovOgGåTilNesteStegError }: Props) => {
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
    </>
  );
};
