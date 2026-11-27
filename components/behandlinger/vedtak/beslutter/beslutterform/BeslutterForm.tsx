import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { ToTrinnsVurderingGrunn } from 'lib/types/types';
import { FormFieldType } from 'components/form/FormHook';
import { Bleed, Box, Button, HStack, VStack } from '@navikt/ds-react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, ValuePair } from 'components/form/FormField';
import { BeslutterFormFields } from 'components/behandlinger/vedtak/beslutter/Beslutter';

interface Props {
  form: UseFormReturn<BeslutterFormFields>;
  index: number;
  onBekreft: () => void;
  sendInnBeslutning: () => void;
}

const grunnOptions: ValuePair<ToTrinnsVurderingGrunn>[] = [
  { label: 'Mangler i utredning før vilkårsvurderingen', value: 'MANGLENDE_UTREDNING' },
  { label: 'Mangler i vilkårsvurderingen', value: 'MANGELFULL_BEGRUNNELSE' },
  { label: 'Feil resultat i vedtaket', value: 'FEIL_LOVANVENDELSE' },
  { label: 'Annen returårsak', value: 'ANNET' },
];

export const BeslutterForm = ({ form, index, onBekreft, sendInnBeslutning }: Props) => {
  const godkjentFormFieldValue = form.watch(`vurderinger.${index}.godkjent`);
  const vurderingErIkkeGodkjent = godkjentFormFieldValue === JaEllerNei.Nei;

  const godkjent: FormFieldType<BeslutterFormFields> = {
    type: 'radio',
    name: `vurderinger.${index}.godkjent`,
    label: 'Godkjenner du vilkårsvurderingen?',
    options: JaEllerNeiOptions,
  };

  const begrunnelse: FormFieldType<BeslutterFormFields> = {
    type: 'textarea',
    name: `vurderinger.${index}.begrunnelse`,
    label: 'Begrunnelse for retur',
    rules: {
      required: 'Du må gi en begrunnelse',
      validate: {
        ikkeKunWhitespace: (value) =>
          value && (value as string).trim().length === 0
            ? 'Begrunnelse kan ikke være tom eller kun inneholde mellomrom'
            : true,
      },
    },
  };
  const grunner: FormFieldType<BeslutterFormFields> = {
    type: 'checkbox',
    name: `vurderinger.${index}.grunner`,
    label: 'Returårsak',
    options: grunnOptions,
    rules: { required: 'Du må oppgi en årsak' },
  };

  return (
    <Bleed marginInline={'space-12'} marginBlock={'space-0 space-12'}>
      <Box background={'brand-blue-moderateA'} padding={'space-16'} borderRadius={'0 0 12 12'}>
        <VStack gap={'space-16'}>
          <FormField form={form} formField={godkjent} />
          {vurderingErIkkeGodkjent && (
            <>
              <FormField form={form} formField={begrunnelse} />
              <FormField form={form} formField={grunner} />
            </>
          )}

          <HStack gap={'space-16'}>
            <Button type="button" onClick={onBekreft}>
              Gå videre
            </Button>
            {vurderingErIkkeGodkjent && (
              <Button type="button" variant={'secondary'} onClick={sendInnBeslutning}>
                Bekreft og returner
              </Button>
            )}
          </HStack>
        </VStack>
      </Box>
    </Bleed>
  );
};
