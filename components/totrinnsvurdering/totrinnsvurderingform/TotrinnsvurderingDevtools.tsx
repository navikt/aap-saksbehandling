import { Box, Button, Heading, VStack } from '@navikt/ds-react';
import { UseFormReturn } from 'react-hook-form';
import { FormFieldsToTrinnsVurdering } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';
import { isLocal, isProd } from 'lib/utils/environment';
import { JaEllerNei } from 'lib/utils/form';

export const TotrinnsvurderingDevtools = ({ form }: { form: UseFormReturn<FormFieldsToTrinnsVurdering> }) => {
  if (isProd()) return null;

  function godkjennAlle() {
    if (isLocal()) {
      const vurderinger = form.getValues('totrinnsvurderinger');
      vurderinger.forEach((_, index) => {
        form.setValue(`totrinnsvurderinger.${index}.godkjent`, JaEllerNei.Ja);
      });
    }
  }

  function underkjennAlle() {
    if (isLocal()) {
      const vurderinger = form.getValues('totrinnsvurderinger');
      vurderinger.forEach((_, index) => {
        form.setValue(`totrinnsvurderinger.${index}.godkjent`, JaEllerNei.Nei);
        form.setValue(`totrinnsvurderinger.${index}.begrunnelse`, 'Underkjent av devtools');
        form.setValue(`totrinnsvurderinger.${index}.grunner`, ['ANNET']);
        form.setValue(`totrinnsvurderinger.${index}.årsakFritekst`, 'Fritekst fra devtools');
      });
    }
  }

  return (
    <Box padding="space-8" borderColor="neutral-subtle" borderWidth="1" background="danger-softA" borderRadius="8">
      <Heading size="xsmall" spacing>
        Utviklerverktøy
      </Heading>
      <VStack gap="space-8">
        <Button
          type={'button'}
          variant="secondary-neutral"
          size={'small'}
          className={'fit-content'}
          onClick={godkjennAlle}
        >
          ✅ Godkjenn alle
        </Button>
        <Button
          type={'submit'}
          variant="secondary-neutral"
          size={'small'}
          className={'fit-content'}
          onClick={godkjennAlle}
        >
          ✅ Godkjenn alle og bekreft
        </Button>
        <Button
          type={'submit'}
          variant="secondary-neutral"
          size={'small'}
          className={'fit-content'}
          onClick={underkjennAlle}
        >
          ❌ Underkjenn alle og bekreft
        </Button>
      </VStack>
    </Box>
  );
};
