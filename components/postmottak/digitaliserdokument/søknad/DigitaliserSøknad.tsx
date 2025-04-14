'use client';

import {
  JaNeiAbruttEllerIkkeOpgittOptions,
  JaNeiAvbruttIkkeOppgitt,
  JaNeiEllerIkkeOppgittOptions,
  JaNeiEllerVetIkkeOptions,
  JaNeiIkkeOppgitt,
  JaNeiVetIkke,
  stringToJaNeiAvbruttIkkeOppgitt,
  stringToJaNeiIkkeOppgitt,
  stringToJaNeiVetikke,
} from 'lib/postmottakForm';
import { Barnetillegg } from './Barnetillegg';
import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';
import { Student } from './Student';
import { Button, VStack } from '@navikt/ds-react';
import { Søknad } from 'lib/types/types';
import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { isBefore, parse, startOfDay } from 'date-fns';
import { validerDato } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';
import { parseDatoFraDatePicker } from 'lib/utils/date';

export type Barn = {
  fnr?: string;
  fornavn?: string;
  etternavn?: string;
  relasjon?: 'FORELDER' | 'FOSTERFORELDER';
};

export interface SøknadFormFields {
  søknadsDato: Date;
  yrkesSkade: JaNeiIkkeOppgitt;
  erStudent: JaNeiAvbruttIkkeOppgitt;
  studentKommeTilbake: JaNeiVetIkke;
  oppgitteBarn: Barn[];
}

interface Props extends Submittable {
  grunnlag: DigitaliseringsGrunnlag;
  registrertDato?: string | null;
  readOnly: boolean;
  isLoading: boolean;
}

function mapTilSøknadKontrakt(data: SøknadFormFields) {
  const søknad: Søknad = {
    student:
      data.erStudent === JaNeiAvbruttIkkeOppgitt.IKKE_OPPGITT
        ? undefined
        : {
            erStudent: data.erStudent,
            kommeTilbake: data.studentKommeTilbake || null,
          },
    yrkesskade: data.yrkesSkade,
    oppgitteBarn: data.oppgitteBarn?.length
      ? { identer: data.oppgitteBarn.map((barn) => ({ identifikator: barn.fnr! })) }
      : undefined,
  };
  return JSON.stringify(søknad);
}

export const DigitaliserSøknad = ({ grunnlag, registrertDato, readOnly, submit, isLoading }: Props) => {
  const søknadGrunnlag = grunnlag.vurdering?.strukturertDokumentJson
    ? JSON.parse(grunnlag.vurdering?.strukturertDokumentJson)
    : {};
  const søknadsdato = grunnlag.vurdering?.søknadsdato;
  const { form, formFields } = useConfigForm<SøknadFormFields>(
    {
      søknadsDato: {
        type: 'date_input',
        label: 'Søknadsdato',
        defaultValue: søknadsdato === null ? '' : søknadsdato,
        rules: {
          validate: (value) => {
            const valideringsresultat = validerDato(value as string);
            if (valideringsresultat) {
              return valideringsresultat;
            }

            const søknadsDato = startOfDay(parse(value as string, 'dd.MM.yyyy', new Date()));
            const registrertDate = registrertDato ? startOfDay(new Date(registrertDato)) : null;

            if (registrertDate && isBefore(registrertDate, søknadsDato)) {
              return `Søknadsdato kan ikke være etter registrert dato`;
            }
          },
        },
      },
      yrkesSkade: {
        type: 'radio',
        label: 'Har søker yrkesskade?',
        options: JaNeiEllerIkkeOppgittOptions,
        defaultValue: søknadGrunnlag.yrkesskade ? stringToJaNeiIkkeOppgitt(søknadGrunnlag.yrkesskade) : undefined,
        rules: { required: 'Du må velge om bruker har oppgitt en yrkesskade' },
      },
      erStudent: {
        type: 'radio',
        label: 'Er søkeren student?',
        options: JaNeiAbruttEllerIkkeOpgittOptions,
        defaultValue: søknadGrunnlag.student?.erStudent
          ? stringToJaNeiAvbruttIkkeOppgitt(søknadGrunnlag.student.erStudent)
          : undefined,
        rules: { required: 'Du må velge et alternativ om brukers student-status' },
      },
      studentKommeTilbake: {
        type: 'radio',
        label: 'Skal søkeren tilbake til studiet?',
        options: JaNeiEllerVetIkkeOptions,
        defaultValue: søknadGrunnlag.student?.kommeTilbake
          ? stringToJaNeiVetikke(søknadGrunnlag.student.kommeTilbake)
          : undefined,
      },
      oppgitteBarn: {
        type: 'fieldArray',
        defaultValue:
          søknadGrunnlag.oppgitteBarn?.identer?.map((barn: { identifikator: string }) => ({
            fnr: barn.identifikator,
          })) || [],
      },
    },
    { readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) =>
      submit('SØKNAD', mapTilSøknadKontrakt(data), parseDatoFraDatePicker(data.søknadsDato)!)
    )(event);
  };
  return (
    <VilkårsKort heading={'Søknad'}>
      <form onSubmit={handleSubmit}>
        <VStack gap={'6'}>
          <VStack gap={'3'}>
            {grunnlag.erPapir && <p>Papirsøknader skal justeres for postgang</p>}
            <FormField form={form} formField={formFields.søknadsDato} />
          </VStack>
          <div>
            <FormField form={form} formField={formFields.yrkesSkade} />
          </div>
          <Barnetillegg form={form} readOnly={readOnly} />
          <Student form={form} formFields={formFields} />
          {!readOnly && (
            <Button loading={isLoading} className={'fit-content'}>
              Neste
            </Button>
          )}
        </VStack>
      </form>
    </VilkårsKort>
  );
};
