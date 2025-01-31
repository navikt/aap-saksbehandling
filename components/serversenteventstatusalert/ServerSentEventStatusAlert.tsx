import { ServerSentEventStatus } from 'app/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import { Alert, BodyShort } from '@navikt/ds-react';
import { useParams } from 'next/navigation';

interface Props {
  status?: ServerSentEventStatus;
}

export const ServerSentEventStatusAlert = ({ status }: Props) => {
  const { behandlingsReferanse, saksId } = useParams<{ behandlingsReferanse: string; saksId: string }>();
  return (
    <>
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
          <BodyShort spacing>Maskinen bruker litt lengre tid på å jobbe enn vanlig. Ta deg en kopp kaffe.</BodyShort>
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
