import { Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { MeldekortTabell } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/MeldekortTabell';
import { SaksInfo } from 'lib/types/types';
import { Alert } from 'components/alert/Alert';
import { RegistrerMeldedatoModal } from 'components/saksoversikt/meldekortoversikt/registrermeldedatomodal/RegistrerMeldedatoModal';

export const MeldekortOversikt = ({ sak }: { sak: SaksInfo }) => {
  const [erRegistrerMeldedatoModalÅpen, setErRegistrerMeldedatoModalÅpen] = useState(false);

  const finnesÅpenFørstegangsbehandling = sak.behandlinger.some(
    (behandling) =>
      behandling.typeBehandling === 'Førstegangsbehandling' && !['IVERKSETTES', 'AVSLUTTET'].includes(behandling.status)
  );

  return (
    <VStack gap={'space-16'}>
      <HStack justify={'space-between'} align={'center'}>
        <Heading size="medium">Meldekort</Heading>
        {!finnesÅpenFørstegangsbehandling && (
          <Button
            variant={'tertiary'}
            size={'small'}
            disabled={finnesÅpenFørstegangsbehandling}
            onClick={() => setErRegistrerMeldedatoModalÅpen(true)}
          >
            Brukeren har meldt seg på annet vis enn meldekort
          </Button>
        )}
      </HStack>
      {finnesÅpenFørstegangsbehandling && (
        <Alert variant="info">
          Du kan ikke registrere eller endre meldekort på vegne av brukeren før saken er iverksatt.
        </Alert>
      )}
      <MeldekortTabell />
      <RegistrerMeldedatoModal isOpen={erRegistrerMeldedatoModalÅpen} setIsOpen={setErRegistrerMeldedatoModalÅpen} />
    </VStack>
  );
};
