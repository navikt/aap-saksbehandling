import { Heading, VStack } from '@navikt/ds-react';
import { MeldekortTabell } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/MeldekortTabell';
import { SaksInfo } from 'lib/types/types';
import { Alert } from 'components/alert/Alert';

export const MeldekortOversikt = ({ sak }: { sak: SaksInfo }) => {
  const finnesÅpenFørstegangsbehandling = sak.behandlinger.some(
    (behandling) =>
      behandling.typeBehandling === 'Førstegangsbehandling' && !['IVERKSETTES', 'AVSLUTTET'].includes(behandling.status)
  );

  return (
    <VStack gap={'space-16'}>
      <Heading size="medium">Meldekort</Heading>
      {finnesÅpenFørstegangsbehandling && (
        <Alert variant="info">
          Du kan ikke registrere eller endre meldekort på vegne av brukeren før saken er iverksatt.
        </Alert>
      )}
      <MeldekortTabell />
    </VStack>
  );
};
