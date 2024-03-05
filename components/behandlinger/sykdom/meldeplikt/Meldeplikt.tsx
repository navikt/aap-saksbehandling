'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/form/Form';
import { BodyShort } from '@navikt/ds-react';
import { FigureIcon } from '@navikt/aksel-icons';

import style from './Meldeplikt.module.css';
import { FritakMeldepliktGrunnlag } from 'lib/types/types';
import { løsBehov } from 'lib/api';
import { format } from 'date-fns';

interface Props {
  behandlingsReferanse: string;
  grunnlag?: FritakMeldepliktGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  unntakFraMeldeplikt: string[];
  startDato?: Date;
  sluttDato?: Date;
}

export const Meldeplikt = ({ behandlingsReferanse, grunnlag }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      description: 'Begrunn vurderingen',
      label: 'Vurder om det vil være unødig tyngende for søker å overholde meldeplikten',
      rules: { required: 'Du må begrunne' },
      // TODO: Her må vi gjøre noe lurt dersom det er flere vurderinger
      defaultValue: grunnlag?.vurderinger[0]?.begrunnelse,
    },
    unntakFraMeldeplikt: {
      type: 'checkbox',
      label: 'Det vurderes at søker kan unntas fra meldeplikten',
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
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
    <VilkårsKort
      heading={'Unntak fra meldeplikt § 11-10'}
      steg="FRITAK_MELDEPLIKT"
      icon={<FigureIcon fontSize={'inherit'} />}
      erNav={true}
    >
      <Form
        onSubmit={form.handleSubmit(async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            fritaksvurdering: {
              begrunnelse: data.begrunnelse,
              harFritak: data.unntakFraMeldeplikt.includes('Unntak fra meldeplikten'),
              periode: {
                fom: data.startDato ? format(new Date(data.startDato), 'yyyy-MM-dd') : '',
                tom: data.sluttDato ? format(new Date(data.sluttDato), 'yyyy-MM-dd') : '',
              },
            },
            referanse: behandlingsReferanse,
          });
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
