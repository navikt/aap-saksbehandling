'use client';

import { ChildHairEyesIcon } from '@navikt/aksel-icons';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { BodyShort, Label } from '@navikt/ds-react';

interface FormFields {
  dokumenterBruktIVurderingen: string[];
}

export const Barn = () => {
  const { isLoading, status } = useLøsBehovOgGåTilNesteSteg('BARNETILLEGG');
  const { form, formFields } = useConfigForm<FormFields>({
    dokumenterBruktIVurderingen: {
      type: 'checkbox_nested',
      label: 'Dokumenter funnet som er relevante for vurdering av barnetillegg §11-20',
      description: 'Les dokumentene og tilknytt eventuelle dokumenter benyttet til 11-20 vurderingen',
    },
  });

  return (
    <VilkårsKort
      heading={'Barnetillegg § 11-20 tredje og fjerde ledd'}
      icon={<ChildHairEyesIcon title="barnetilleg-ikon" fontSize="1.5rem" />}
      steg={'BARNETILLEGG'}
    >
      <Form steg={'BARNETILLEGG'} onSubmit={() => console.log('hello')} isLoading={isLoading} status={status}>
        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>
        <TilknyttedeDokumenter dokumenter={form.watch('dokumenterBruktIVurderingen')} />

        <div>
          <Label size={'small'}>Følgende barn er oppgitt av søker og må vurderes for barnetillegg</Label>
          <BodyShort size={'small'}>
            Les dokumentene og tilknytt relevante dokumenter til vurdering om det skal beregnes barnetillegg
          </BodyShort>
        </div>
      </Form>
    </VilkårsKort>
  );
};
