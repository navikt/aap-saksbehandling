import { TasklistIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Detail, HStack, Radio, VStack } from '@navikt/ds-react';
import { StønadsperiodeVurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { UseFormReturn } from 'react-hook-form';
import { StønadsperiodeFormFields } from 'components/behandlinger/krav/utils/stønadsperiodeutils';
import { JaEllerNeiOptions } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';

interface Props {
  vurdering: StønadsperiodeVurdering;
  onLukk: () => void;
  form: UseFormReturn<StønadsperiodeFormFields>;
}

export const StønadsperiodeBoks = ({ vurdering, onLukk, form }: Props) => {
  return (
    <Box
      role="group"
      aria-label={`Vurder krav ${vurdering.referanse}`}
      borderWidth="1"
      borderRadius="12"
      borderColor="neutral-subtle"
    >
      <Box padding="space-8" background="neutral-moderate" borderRadius="12 12 0 0">
        <HStack align="center" justify="space-between" gap="space-12" padding="space-8">
          <HStack align="center" gap="space-12">
            <TasklistIcon aria-hidden fontSize="2rem" />
            <VStack>
              <Detail>Søknadsdato: {formaterDatoForFrontend(vurdering.startDato)}</Detail>
              <BodyShort weight="semibold" size="small">
                Vurder krav {vurdering.referanse}
              </BodyShort>
            </VStack>
          </HStack>
        </HStack>
      </Box>
      <Box padding="space-16">
        <VStack gap="space-16">
          <HStack justify="end">
            <Button type="button" size="small" variant="tertiary" onClick={onLukk}>
              Lukk
            </Button>
          </HStack>
          <TextAreaWrapper
            name={`vurderinger.${vurdering.referanse}.begrunnelse`}
            control={form.control}
            label={'Begrunnelse'}
            rules={{ required: 'Du må skrive en begrunnelse.' }}
          />
          <RadioGroupWrapper
            name={`vurderinger.${vurdering.referanse}.brukerenHarHattOrdinærAAPInnen52Uker`}
            control={form.control}
            size={'small'}
            label={'Har brukeren hatt ordinær AAP innen 52 uker?'}
            rules={{ required: 'Du må svare på om brukeren har hatt ordinær AAP innen 52 uker.' }}
          >
            {JaEllerNeiOptions.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </RadioGroupWrapper>

          <RadioGroupWrapper
            name={`vurderinger.${vurdering.referanse}.harGjenværendeKvote`}
            control={form.control}
            size={'small'}
            label={'Har brukeren gjenværende kvote?'}
            rules={{ required: 'Du må svare på om brukeren har gjenværende kvote.' }}
          >
            {JaEllerNeiOptions.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </RadioGroupWrapper>

          <DateInputWrapper
            name={`vurderinger.${vurdering.referanse}.datoKravetSkalVurderesFra`}
            control={form.control}
            size={'small'}
            label={'Dato kravet skal vurderes fra'}
            rules={{
              required: 'Du må sette en dato kravet skal vurderes fra.',
              validate: (value) => validerDato(value as string),
            }}
          />
        </VStack>
      </Box>
    </Box>
  );
};
