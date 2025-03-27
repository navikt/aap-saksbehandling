'use client';

import {
  JaNeiAvbruttIkkeOppgitt,
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

export const DigitaliserSøknad = ({ grunnlag, readOnly, submit, isLoading }: Props) => {
  const søknadGrunnlag = grunnlag.vurdering?.strukturertDokumentJson
    ? JSON.parse(grunnlag.vurdering?.strukturertDokumentJson)
    : {};
  const søknadsdato = grunnlag.vurdering?.søknadsdato;
  const { form, formFields } = useConfigForm<SøknadFormFields>(
    {
      søknadsDato: {
        type: 'date',
        label: 'Søknadsdato',
        defaultValue: søknadsdato ? new Date(søknadsdato) : undefined,
        rules: { required: 'Du må oppgi søknadsdato' },
      },
      yrkesSkade: {
        type: 'radio',
        label: 'Har søker yrkesskade?',
        options: [JaNeiIkkeOppgitt.JA, JaNeiIkkeOppgitt.NEI, JaNeiIkkeOppgitt.IKKE_OPPGITT],
        defaultValue: søknadGrunnlag.yrkesskade ? stringToJaNeiIkkeOppgitt(søknadGrunnlag.yrkesskade) : undefined,
        rules: { required: 'Du må velge om bruker har oppgitt en yrkesskade' },
      },
      erStudent: {
        type: 'radio',
        label: 'Er søkeren student?',
        options: [
          JaNeiAvbruttIkkeOppgitt.JA,
          JaNeiAvbruttIkkeOppgitt.NEI,
          JaNeiAvbruttIkkeOppgitt.AVBRUTT,
          JaNeiAvbruttIkkeOppgitt.IKKE_OPPGITT,
        ],
        defaultValue: søknadGrunnlag.student?.erStudent
          ? stringToJaNeiAvbruttIkkeOppgitt(søknadGrunnlag.student.erStudent)
          : undefined,
        rules: { required: 'Du må velge et alternativ om brukers student-status' },
      },
      studentKommeTilbake: {
        type: 'radio',
        label: 'Skal søkeren tilbake til studiet?',
        options: [JaNeiVetIkke.JA, JaNeiVetIkke.NEI, JaNeiVetIkke.VET_IKKE],
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

  return (
    <VilkårsKort heading={'Søknad'}>
      <form onSubmit={form.handleSubmit((data) => submit('SØKNAD', mapTilSøknadKontrakt(data), data.søknadsDato))}>
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
          <Button loading={isLoading} className={'fit-content'}>
            Neste
          </Button>
        </VStack>
      </form>
    </VilkårsKort>
  );
};
