'use client';

import { ChildHairEyesIcon } from '@navikt/aksel-icons';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { ManueltBarn } from 'components/barn/manueltbarn/ManueltBarn';
import { RegistrertBarn } from 'components/barn/registrertbarn/RegistrertBarn';

interface FormFields {
  dokumenterBruktIVurderingen: string[];
}

export const BarnetilleggVurdering = () => {
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
      <div className={'flex-column'}>
        <form id={'dokument-form'} onSubmit={form.handleSubmit(() => console.log('Her skal det skje noe!'))}>
          <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
            <DokumentTabell />
          </FormField>
        </form>
        <TilknyttedeDokumenter dokumenter={form.watch('dokumenterBruktIVurderingen')} />

        <div>
          <Label size={'small'}>Følgende barn er oppgitt av søker og må vurderes for barnetillegg</Label>
          <BodyShort size={'small'}>
            Les dokumentene og tilknytt relevante dokumenter til vurdering om det skal beregnes barnetillegg
          </BodyShort>
        </div>
        <ManueltBarn manueltBarn={{ navn: 'Kjell T Ringen', ident: '12345678910', rolle: 'FOSTERBARN' }} />

        <Label size={'small'}>Følgende barn er funnet i folkeregisteret og vil gi grunnlag for barnetillegg</Label>
        <RegistrertBarn
          registrertBarn={{ navn: 'Anna Nass', ident: '98765432121', forsørgerPeriode: { fom: '2020-03-04' } }}
        />

        <Button className={'fit-content-button'} form="dokument-form">
          Bekreft
        </Button>
      </div>
    </VilkårsKort>
  );
};
