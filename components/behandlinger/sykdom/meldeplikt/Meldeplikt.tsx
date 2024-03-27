'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/form/Form';
import { Alert, BodyShort, List } from '@navikt/ds-react';
import { FigureIcon } from '@navikt/aksel-icons';

import style from './Meldeplikt.module.css';
import { FritakMeldepliktGrunnlag } from 'lib/types/types';
import { løsBehov } from 'lib/api';
import { Behovstype, handleSubmitWithCallback } from 'lib/utils/form';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { Vilkårsveildening } from 'components/vilkårsveiledning/Vilkårsveiledning';
import { formaterDatoForBackend } from 'lib/utils/date';

interface Props {
  behandlingsReferanse: string;
  grunnlag?: FritakMeldepliktGrunnlag;
}

interface FormFields {
  dokumenterBruktIVurderingen: string[];
  begrunnelse: string;
  unntakFraMeldeplikt: string[];
  startDato?: Date;
  sluttDato?: Date;
}

export const Meldeplikt = ({ behandlingsReferanse, grunnlag }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    dokumenterBruktIVurderingen: {
      type: 'checkbox_nested',
      label: 'Dokumenter funnet som er relevant for vurdering av §11-10',
      description: 'Tilknytt minst ett dokument til §11-10',
    },
    begrunnelse: {
      type: 'textarea',
      description: 'Begrunn vurderingen',
      label: 'Vurder om det vil være unødig tyngende for søker å overholde meldeplikten',
      rules: { required: 'Du må begrunne' },
      defaultValue: grunnlag?.vurderinger?.[0]?.begrunnelse,
    },
    unntakFraMeldeplikt: {
      type: 'checkbox',
      label: 'Det vurderes at søker kan unntas fra meldeplikten',
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
      options: ['Unntak fra meldeplikten'],
    },
    startDato: {
      type: 'date',
      toDate: new Date(),
      label: 'Startdato for fritak fra meldeplikt',
    },
    sluttDato: {
      type: 'date',
      fromDate: new Date(),
      label: 'Sluttdato for fritak fra meldeplikt',
    },
  });

  return (
    <VilkårsKort
      heading={'Unntak fra meldeplikt § 11-10'}
      steg="FRITAK_MELDEPLIKT"
      icon={<FigureIcon fontSize={'inherit'} />}
      erNav={true}
      defaultOpen={false}
    >
      <Form
        onSubmit={handleSubmitWithCallback(form, async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              behovstype: Behovstype.FRITAK_MELDEPLIKT_KODE,
              vurdering: {
                begrunnelse: data.begrunnelse,
                harFritak: data.unntakFraMeldeplikt.includes('Unntak fra meldeplikten'),
                periode: {
                  fom: data.startDato ? formaterDatoForBackend(data.startDato) : '',
                  tom: data.sluttDato ? formaterDatoForBackend(data.sluttDato) : '',
                },
              },
            },
            referanse: behandlingsReferanse,
          });
        })}
        steg={'BARNETILLEGG'}
      >
        <Alert variant={'info'} size={'small'}>
          <BodyShort size={'small'}>Unntak fra meldeplikten skal kun vurderes dersom saksbehandler:</BodyShort>
          <List as={'ol'} size={'small'}>
            <List.Item>
              <BodyShort size={'small'}>
                Vurderer at det vil være unødig tyngende for søker å overholde meldeplikten
              </BodyShort>
            </List.Item>
            <List.Item>
              <BodyShort size={'small'}>
                Er usikker på om det vil være unødig tyngende for søker å overholde meldeplikten
              </BodyShort>
            </List.Item>
          </List>
        </Alert>

        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>

        <Vilkårsveildening />

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
