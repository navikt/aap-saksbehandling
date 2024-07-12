'use client';

import { opprettSak } from 'lib/clientApi';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { Button } from '@navikt/ds-react';

import styles from './OpprettSak.module.css';
import { mutate } from 'swr';
import { formaterDatoForBackend } from 'lib/utils/date';
import { OpprettSakBarn } from 'components/opprettsak/OpprettSakBarn';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';

interface Barn {
  fodselsdato: string;
}

export interface OpprettSakFormFields {
  fødselsdato: Date;
  yrkesskade: string;
  student: string;
  barn?: Barn[];
  institusjon: ['fengsel', 'sykehus'];
}

export const OpprettSak = () => {
  const { formFields, form } = useConfigForm<OpprettSakFormFields>({
    fødselsdato: {
      type: 'date',
      defaultValue: new Date('2000-01-01'),
      label: 'Fødselsdato',
    },
    yrkesskade: {
      type: 'radio',
      label: 'Yrkesskade?',
      defaultValue: JaEllerNei.Ja,
      options: JaEllerNeiOptions,
    },
    student: {
      type: 'radio',
      label: 'Student?',
      defaultValue: JaEllerNei.Nei,
      options: JaEllerNeiOptions,
    },
    barn: {
      type: 'text', // Vi har ikke støtte for dynamiske skjemaer i useConfigForm. Konfigurasjonen brukes ikke til noe, men den må settes for å kunne angi en standardverdi.
      label: 'Ikke relevant', // Vi har ikke støtte for dynamiske skjemaer i useConfigForm. Konfigurasjonen brukes ikke til noe, men den må settes for å kunne angi en standardverdi.
      // @ts-ignore Vi har ikke støtte for dynamiske skjemaer i useConfigForm. Konfigurasjonen brukes ikke til noe, men den må settes for å kunne angi en standardverdi.
      defaultValue: [{ fodselsdato: '2015' }],
    },
    institusjon: {
      type: 'checkbox',
      label: 'Institujon',
      options: [
        { label: 'Er innlagt på sykehus', value: 'sykehus' },
        { label: 'Er i fengsel', value: 'fengsel' },
      ],
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        await opprettSak({
          ...data,
          fødselsdato: formaterDatoForBackend(data.fødselsdato),
          yrkesskade: data.yrkesskade === JaEllerNei.Ja,
          student: data.student === JaEllerNei.Ja,
          barn:
            data.barn?.map((barn) => {
              return { fodselsdato: formaterDatoForBackend(new Date(barn.fodselsdato)) };
            }) || [],
          institusjoner: {
            sykehus: data.institusjon.includes('sykehus'),
            fengsel: data.institusjon.includes('fengsel'),
          },
        });
        await mutate('api/sak/alle');
      })}
      className={styles.form}
    >
      <div className={'flex-column'}>
        <FormField form={form} formField={formFields.fødselsdato} />
        <FormField form={form} formField={formFields.yrkesskade} />
        <FormField form={form} formField={formFields.student} />
        <FormField form={form} formField={formFields.institusjon} />
      </div>
      <OpprettSakBarn form={form} />
      <Button className={'fit-content-button'}>Opprett test sak</Button>
    </form>
  );
};
