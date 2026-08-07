import { KravVurdering } from 'lib/types/types';
import { finnOverstyrMuligRettFra, finnSøknadsdato, formaterKravtype } from 'components/behandlinger/krav/kravutils';
import { BodyShort, Box, Button, Detail, HStack, Label, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { TasklistIcon } from '@navikt/aksel-icons';

export const KravBoks = ({ krav, onLukk }: { krav: KravVurdering; onLukk: () => void }) => {
  const søknadsdato = finnSøknadsdato(krav);
  const overstyrMuligRettFra = finnOverstyrMuligRettFra(krav);

  console.log(krav);
  return (
    <Box borderWidth="1" borderRadius="12" borderColor="neutral-subtle">
      <Box padding="space-8" background="neutral-moderate" borderRadius="12 12 0 0">
        <HStack align={'center'} gap={'space-12'} padding={'space-8'}>
          <TasklistIcon title="a11y-title" fontSize="2rem" />
          <VStack>
            <Detail>Søknadsdato: {søknadsdato ? formaterDatoForFrontend(søknadsdato.dato) : '-'}</Detail>
            <BodyShort weight={'semibold'} size={'small'}>
              Vurder krav {krav.referanse}
            </BodyShort>
          </VStack>
        </HStack>
      </Box>
      <Box padding="space-16">
        <VStack gap="space-8">
          <HStack justify="space-between">
            <BodyShort weight={'semibold'}>{formaterKravtype(krav.type)}</BodyShort>
            <Button type="button" size="small" variant="tertiary" onClick={onLukk}>
              Lukk
            </Button>
          </HStack>
          <LabelValueMedKnapp
            label={'Type krav'}
            value={formaterKravtype(krav.type)}
            buttonTekst={'Vurder om krav er relevant'}
            onClick={() => console.log('Ikke implementert enda')}
          />
          <LabelValueMedKnapp
            label={'Søknadsdato'}
            value={søknadsdato ? formaterDatoForFrontend(søknadsdato.dato) : '-'}
            buttonTekst={'Vurder §22-13 5.ledd'}
            onClick={() => console.log('Ikke implementert enda')}
          />
          <LabelValueMedKnapp
            label={'Mulig rett fra'}
            value={'Hvor henter vi den?'}
            buttonTekst={'Vurder §22-13 7.ledd'}
            onClick={() => console.log('Ikke implementert enda')}
          />
          {overstyrMuligRettFra && <div>Mulig rett fra: {formaterDatoForFrontend(overstyrMuligRettFra.dato)}</div>}
        </VStack>
      </Box>
    </Box>
  );
};

function LabelValueMedKnapp({
  label,
  value,
  onClick,
  buttonTekst,
}: {
  label: string;
  value: string;
  buttonTekst: string;
  onClick: () => void;
}) {
  return (
    <VStack>
      <Label size={'small'}>{label}</Label>
      <HStack align={'center'} gap={'space-4'}>
        <BodyShort size={'small'}>{value}</BodyShort>
        <Button size={'small'} variant={'tertiary'} onClick={onClick}>
          {buttonTekst}
        </Button>
      </HStack>
    </VStack>
  );
}
