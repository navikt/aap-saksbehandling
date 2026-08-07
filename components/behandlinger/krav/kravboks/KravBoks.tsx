import { KravVurdering } from 'lib/types/types';
import { finnOverstyrMuligRettFra, finnSøknadsdato, formaterKravtype } from 'components/behandlinger/krav/kravutils';
import { Box, Button, HStack, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

export const KravBoks = ({ krav, onLukk }: { krav: KravVurdering; onLukk: () => void }) => {
  const søknadsdato = finnSøknadsdato(krav);
  const overstyrMuligRettFra = finnOverstyrMuligRettFra(krav);

  return (
    <Box padding="space-16" borderWidth="1" borderRadius="12" borderColor="neutral-subtle">
      <VStack gap="space-8">
        <HStack justify="space-between">
          <strong>{formaterKravtype(krav.type)}</strong>
          <Button type="button" size="small" variant="tertiary" onClick={onLukk}>
            Lukk
          </Button>
        </HStack>
        <div>JournalpostId: {krav.journalpostId.identifikator}</div>
        <div>Begrunnelse: {krav.begrunnelse}</div>
        {søknadsdato && <div>Søknadsdato: {formaterDatoForFrontend(søknadsdato.dato)}</div>}
        {overstyrMuligRettFra && <div>Mulig rett fra: {formaterDatoForFrontend(overstyrMuligRettFra.dato)}</div>}
        <div>Vurdert av: {krav.vurdertAv}</div>
      </VStack>
    </Box>
  );
};
