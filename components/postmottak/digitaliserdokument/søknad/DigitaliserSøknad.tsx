'use client';

import {
  JaNeiAbruttEllerIkkeOpgittOptions,
  JaNeiAvbruttIkkeOppgitt,
  JaNeiEllerIkkeOppgittOptions,
  JaEllerNei,
  JaNeiIkkeOppgitt,
  JaNeiVetIkke,
  stringToJaNeiAvbruttIkkeOppgitt,
  stringToJaNeiIkkeOppgitt,
  stringToJaNeiVetikke,
} from 'lib/postmottakForm';
import { Barnetillegg } from './Barnetillegg';
import { Medlemskap } from './Medlemskap';
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
import { formaterDatoForBackend, parseDatoFraDatePicker } from 'lib/utils/date';

export type Utenlandsopphold = {
  land: string;
  fraDato: string;
  tilDato: string;
  iArbeid: JaEllerNei;
  utenlandsId?: string;
};

export type Barn = {
  fnr?: string;
  fornavn: string;
  etternavn: string;
  fødselsdato: string;
  relasjon: 'FORELDER' | 'FOSTERFORELDER';
  checkboxList: string[];
};

export interface SøknadFormFields {
  søknadsDato: Date;
  yrkesSkade: JaNeiIkkeOppgitt;
  erStudent: JaNeiAvbruttIkkeOppgitt;
  studentKommeTilbake: JaNeiVetIkke;
  oppgitteBarn: Barn[];
  arbeidetUtenforNorgeFørSykdom: JaNeiIkkeOppgitt;
  harArbeidetINorgeSiste5År: JaNeiIkkeOppgitt;
  harBoddINorgeSiste5År: JaNeiIkkeOppgitt;
  iTilleggArbeidUtenforNorge: JaNeiIkkeOppgitt;
  utenlandsOpphold: Utenlandsopphold[];
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
    medlemskap: {
      arbeidetUtenforNorgeFørSykdom: data.arbeidetUtenforNorgeFørSykdom === JaNeiIkkeOppgitt.JA ? 'Ja' : 'Nei',
      harArbeidetINorgeSiste5År: data.harArbeidetINorgeSiste5År === JaNeiIkkeOppgitt.JA ? 'Ja' : 'Nei',
      harBoddINorgeSiste5År: data.harBoddINorgeSiste5År === JaNeiIkkeOppgitt.JA ? 'Ja' : 'Nei',
      iTilleggArbeidUtenforNorge: data.iTilleggArbeidUtenforNorge === JaNeiIkkeOppgitt.JA ? 'Ja' : 'Nei',
      utenlandsOpphold: data.utenlandsOpphold.map((u) => ({
        land: u.land,
        fraDato: formaterDatoForBackend(parse(u.fraDato, 'dd.MM.yyyy', new Date())),
        tilDato: formaterDatoForBackend(parse(u.tilDato, 'dd.MM.yyyy', new Date())),
        iArbeid: u.iArbeid,
        utenlandsId: u.utenlandsId || undefined,
      })),
    },
    oppgitteBarn: {
      identer: [],
      barn: data.oppgitteBarn.map((barn) => {
        return {
          fødselsdato: formaterDatoForBackend(parse(barn.fødselsdato, 'dd.MM.yyyy', new Date())),
          ident:
            barn.fnr && !barn.checkboxList.includes('manglerIdent')
              ? {
                  identifikator: barn.fnr,
                }
              : undefined,
          navn: barn.fornavn + ' ' + barn.etternavn,
          relasjon: barn.relasjon,
        };
      }),
    },
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
        rules: { required: 'Du må velge om brukeren har oppgitt en yrkesskade' },
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
        options: JaNeiEllerIkkeOppgittOptions,
        defaultValue: søknadGrunnlag.student?.kommeTilbake
          ? stringToJaNeiVetikke(søknadGrunnlag.student.kommeTilbake)
          : undefined,
      },
      oppgitteBarn: {
        type: 'fieldArray',
      },
      arbeidetUtenforNorgeFørSykdom: {
        type: 'radio',
        label: 'Arbeidet søker utenfor Norge de siste fem årene?',
        options: JaNeiEllerIkkeOppgittOptions,
        defaultValue: søknadGrunnlag.medlemskap?.arbeidetUtenforNorgeFørSykdom
          ? stringToJaNeiIkkeOppgitt(søknadGrunnlag.medlemskap.arbeidetUtenforNorgeFørSykdom)
          : undefined,
        rules: { required: 'Du må velge et alternativ.' },
      },
      harArbeidetINorgeSiste5År: {
        type: 'radio',
        label: 'Har søker arbeidet sammenhengende i Norge siste 5 år?',
        options: JaNeiEllerIkkeOppgittOptions,
        defaultValue: søknadGrunnlag.medlemskap?.harArbeidetINorgeSiste5År
          ? stringToJaNeiIkkeOppgitt(søknadGrunnlag.medlemskap.harArbeidetINorgeSiste5År)
          : undefined,
        rules: { required: 'Du må velge et alternativ.' },
      },
      harBoddINorgeSiste5År: {
        type: 'radio',
        label: 'Har søker bodd sammenhengende i Norge siste 5 år?',
        options: JaNeiEllerIkkeOppgittOptions,
        defaultValue: søknadGrunnlag.medlemskap?.harBoddINorgeSiste5År
          ? stringToJaNeiIkkeOppgitt(søknadGrunnlag.medlemskap.harBoddINorgeSiste5År)
          : undefined,
        rules: { required: 'Du må velge et alternativ.' },
      },
      iTilleggArbeidUtenforNorge: {
        type: 'radio',
        label: 'Har søker i tillegg jobbet utenfor Norge i de siste fem årene?',
        options: JaNeiEllerIkkeOppgittOptions,
        defaultValue: søknadGrunnlag.medlemskap?.iTilleggArbeidUtenforNorge
          ? stringToJaNeiIkkeOppgitt(søknadGrunnlag.medlemskap.iTilleggArbeidUtenforNorge)
          : undefined,
        rules: { required: 'Du må velge et alternativ.' },
      },
      utenlandsOpphold: {
        type: 'fieldArray',
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
          <Medlemskap form={form} formFields={formFields} readOnly={readOnly} />
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
