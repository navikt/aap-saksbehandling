'use client';

import { BodyShort } from '@navikt/ds-react';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { KelvinAlert } from 'components/alert/KelvinAlert';

interface Props {
  status?: LøsBehovOgGåTilNesteStegStatus;
  løsBehovOgGåTilNesteStegError?: ApiException;
}

export const LøsBehovOgGåTilNesteStegStatusAlert = ({ status, løsBehovOgGåTilNesteStegError }: Props) => {
  const { behandlingsreferanse, saksnummer } = useParamsMedType();
  return (
    <>
      {løsBehovOgGåTilNesteStegError && (
        <KelvinAlert variant="error">
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
        </KelvinAlert>
      )}
      {status === 'ERROR' && (
        <KelvinAlert variant="error">
          <BodyShort spacing>Det tok for lang tid å hente neste steg fra baksystemet. Kom tilbake senere.</BodyShort>
          <BodyShort size={'small'}>
            <b>SakId:</b>
            {` ${saksnummer}`}
          </BodyShort>
          <BodyShort size={'small'}>
            <b>Behandlingsreferanse:</b>
            {` ${behandlingsreferanse}`}
          </BodyShort>
        </KelvinAlert>
      )}
      {status === 'POLLING' && (
        <KelvinAlert variant="info">
          <BodyShort spacing>Maskinen bruker litt lengre tid på å jobbe enn vanlig.</BodyShort>
          <BodyShort size={'small'}>
            <b>SakId:</b>
            {` ${saksnummer}`}
          </BodyShort>
          <BodyShort size={'small'}>
            <b>Behandlingsreferanse:</b>
            {` ${behandlingsreferanse}`}
          </BodyShort>
        </KelvinAlert>
      )}
    </>
  );
};
