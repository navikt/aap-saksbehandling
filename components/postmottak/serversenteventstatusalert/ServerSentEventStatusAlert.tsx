import { ServerSentEventStatus } from 'app/postmottak/api/post/[behandlingsreferanse]/hent/[gruppe]/[steg]/nesteSteg/route';
import { KelvinAlert } from 'components/alert/KelvinAlert';

interface Props {
  status?: ServerSentEventStatus;
}

export const ServerSentEventStatusAlert = ({ status }: Props) => {
  return (
    <>
      {status === 'ERROR' && (
        <KelvinAlert variant="error">
          Det tok for lang tid å hente neste steg fra baksystemet. Kom tilbake senere..️
        </KelvinAlert>
      )}
      {status === 'POLLING' && (
        <KelvinAlert variant="info">
          Maskinen bruker litt lengre tid på å jobbe enn vanlig. Ta deg en kopp kaffe.
        </KelvinAlert>
      )}
    </>
  );
};
