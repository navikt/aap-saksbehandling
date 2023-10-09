'use client';

import { useConfigForm } from 'hooks/FormHook';
import { BehovsType, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { stringToDate } from 'lib/utils/date';
import { YrkesskadeGrunnlag } from 'lib/types/types';
import { FormField } from 'components/input/formfield/FormField';
import { løsBehov } from 'lib/api';
import { format } from 'date-fns';
import { Buldings2Icon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { Alert, BodyShort, Label } from '@navikt/ds-react';

interface Props {
  behandlingsReferanse: string;
  grunnlag: YrkesskadeGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  årssakssammenheng: string;
  dato: Date;
}

export const Yrkesskade = ({ grunnlag, behandlingsReferanse }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder om yrkesskaden er medvirkende årsak til den nedsatte arbeidsevnen',
      description: 'Se eksempel på vilkårsvurderingstekst',
      defaultValue: grunnlag?.yrkesskadevurdering?.begrunnelse,
      rules: { required: 'Du må begrunne' },
    },
    årssakssammenheng: {
      type: 'radio',
      label: 'Er vilkåret (årssakssammenheng) i 11.22 oppfylt?',
      defaultValue: getJaNeiEllerUndefined(grunnlag.yrkesskadevurdering?.erÅrsakssammenheng),
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
    },
    dato: {
      type: 'date',
      label: 'Dato for skadetidspunkt for yrkesskaden',
      defaultValue: stringToDate(grunnlag?.yrkesskadevurdering?.skadetidspunkt),
      rules: {
        validate: {
          required: (value, formValues) => {
            if (!value && formValues.årssakssammenheng === JaEllerNei.Ja) {
              return 'Du må sette en dato for skadetidspunktet';
            }
          },
        },
      },
    },
  });

  return (
    <VilkårsKort heading={'Yrkesskade - årsakssammenheng § 11-22'} icon={<Buldings2Icon />}>
      <Form
        onSubmit={form.handleSubmit(async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            referanse: behandlingsReferanse,
            behov: {
              // @ts-ignore
              '@type': BehovsType.YRKESSKADE,
              // @ts-ignore
              yrkesskadevurdering: {
                // @ts-ignore
                begrunnelse: data.begrunnelse,
                // @ts-ignore
                dokumenterBruktIVurdering: [],
                // @ts-ignore
                erÅrsakssammenheng: data.årssakssammenheng === JaEllerNei.Ja,
                // @ts-ignore
                skadetidspunkt: data.dato ? format(data.dato, 'yyyy-MM-dd') : undefined,
              },
            },
          });
        })}
        steg={'AVKLAR_YRKESSKADE'}
      >
        <Alert variant="warning">Vi har funnet en eller flere registrerte yrkesskader</Alert>
        <div>
          <Label as="p">Har søker oppgitt at de har en yrkesskade i søknaden?</Label>
          <BodyShort>{grunnlag?.opplysninger.oppgittYrkesskadeISøknad ? 'Ja' : 'Nei'}</BodyShort>
        </div>
        <div>
          <Label as="p">Saksopplysninger</Label>
          {grunnlag?.opplysninger.innhentedeYrkesskader.map((innhentetYrkesskade) => (
            <div key={innhentetYrkesskade.ref}>
              <BodyShort spacing>{innhentetYrkesskade.kilde}</BodyShort>
              <Label as="p" spacing>
                Periode
              </Label>
              <BodyShort spacing>Fra: {format(new Date(innhentetYrkesskade.periode.fom), 'dd.MM.yyyy')}</BodyShort>
              <BodyShort spacing>Til: {format(new Date(innhentetYrkesskade.periode.tom), 'dd.MM.yyyy')}</BodyShort>
            </div>
          ))}
          {grunnlag?.opplysninger.innhentedeYrkesskader.length === 0 && (
            <BodyShort>Ingen innhentede yrkesskader</BodyShort>
          )}
        </div>
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.årssakssammenheng} />
        {form.watch('årssakssammenheng') === JaEllerNei.Ja && <FormField form={form} formField={formFields.dato} />}
      </Form>
    </VilkårsKort>
  );
};
