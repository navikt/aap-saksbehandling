import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/form/Form';
import { BodyShort } from '@navikt/ds-react';
import { FigureIcon } from '@navikt/aksel-icons';

import style from './Meldeplikt.module.css';

interface FormFields {
  begrunnelse: string;
  unntakFraMeldeplikt: string[];
  startDato: Date;
  sluttDato: Date;
}

export const Meldeplikt = () => {
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      description: 'Begrunn vurderingen',
      label: 'Vurder om det vil være unødig tyngende for søker å overholde meldeplikten',
    },
    unntakFraMeldeplikt: {
      type: 'checkbox',
      label: 'Det vurderes at søker kan unntas fra meldeplikten',
      options: ['Unntak fra meldeplikten'],
    },
    startDato: {
      type: 'date',
      label: 'Startdato for fritak fra meldeplikt',
    },
    sluttDato: {
      type: 'date',
      label: 'Sluttdato for fritak fra meldeplikt',
    },
  });

  return (
    <VilkårsKort heading={'Unntak fra meldeplikt § 11-10'} icon={<FigureIcon fontSize={'inherit'} />}>
      <Form
        onSubmit={form.handleSubmit((data) => {
          console.log({ data });
        })}
        steg={'BARNETILLEGG'}
      >
        <div>
          <BodyShort>Unntak fra meldeplikten skal kun vurderes dersom saksbehandler:</BodyShort>
          <BodyShort>a) vurderer at det vil være unødig tyngende for søker å overholde meldeplikten</BodyShort>
          <BodyShort>b) er usikker på om det vil være unødig tyngende for søker å overholde meldeplikten</BodyShort>
        </div>

        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.unntakFraMeldeplikt} />

        {form.watch('unntakFraMeldeplikt') && form.watch('unntakFraMeldeplikt').includes('Unntak fra meldeplikten') && (
          <div className={style.datofelter}>
            <FormField form={form} formField={formFields.startDato} />
            <FormField form={form} formField={formFields.sluttDato} />
          </div>
        )}
      </Form>
    </VilkårsKort>
  );
};
