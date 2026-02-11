'use client';

import { VStack } from '@navikt/ds-react';
import { erDatoIPeriode, validerDato } from 'lib/validation/dateValidation';
import { parse } from 'date-fns';
import { parseDatoFraDatePicker, stringToDate } from 'lib/utils/date';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { UseFormReturn } from 'react-hook-form';
import { Periode } from 'lib/types/types';
import type { SykdomsvurderingerForm } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingPeriodisert';
import { JaEllerNei } from 'lib/utils/form';
import { Sak } from 'context/saksbehandling/SakContext';
import { SykdomsvurderingMedVissVarighet } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedVissVarighet';
import { SykdomsvurderingUtenVissVarighet } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingUtenVissVarighet';
import { SykdomsvurderingDiagnosesøk } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingDiagnosesøk';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { HvordanLeggeTilSluttdatoReadMore } from 'components/hvordanleggetilsluttdatoreadmore/HvordanLeggeTilSluttdatoReadMore';
import React from 'react';
import { skalVurdereVissVarighetSjekk } from 'components/behandlinger/sykdom/sykdomsvurdering/sykdomsvurdering-utils';

interface Props {
  index: number;
  form: UseFormReturn<SykdomsvurderingerForm>;
  readonly: boolean;
  ikkeRelevantePerioder?: Periode[];
  sak: Sak;
  skalVurdereYrkesskade: boolean;
  erÅrsakssammenhengYrkesskade: boolean;
  rettighetsperiodeStartdato: Date;
}

export const vilkårsvurderingLabel = 'Vilkårsvurdering';
export const harSkadeSykdomEllerLyteLabel = 'Har brukeren sykdom, skade eller lyte?';
export const erArbeidsevnenNedsattLabel = 'Har brukeren nedsatt arbeidsevne?';
export const erNedsettelseIArbeidsevneMerEnnHalvpartenLabel = 'Er arbeidsevnen nedsatt med minst halvparten?';
export const erSkadeSykdomEllerLyteVesentligdelLabel =
  'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?';
export const erNedsettelseIArbeidsevneAvEnVissVarighetLabel = 'Er den nedsatte arbeidsevnen av en viss varighet?';

export const SykdomsvurderingFormInput = ({
  erÅrsakssammenhengYrkesskade,
  skalVurdereYrkesskade,
  index,
  form,
  readonly,
  ikkeRelevantePerioder,
  rettighetsperiodeStartdato,
}: Props) => {
  const valgtDato = parseDatoFraDatePicker(form.watch(`vurderinger.${index}.fraDato`));
  const skalVurdereVissVarighet = skalVurdereVissVarighetSjekk(valgtDato, rettighetsperiodeStartdato);

  return (
    <VStack gap={'5'}>
      <DateInputWrapper
        name={`vurderinger.${index}.fraDato`}
        label="Vurderingen gjelder fra"
        control={form.control}
        rules={{
          required: 'Vennligst velg en dato for når vurderingen gjelder fra',
          validate: {
            validerDato: (value) => validerDato(value as string),
            validerIkkeRelevantPeriode: (value) => {
              const parsedInputDato = new Date(parse(value as string, 'dd.MM.yyyy', new Date()));
              const funnetIkkeRelevantPeriode = ikkeRelevantePerioder?.find((periode) => {
                const fom = stringToDate(periode.fom);
                const tom = stringToDate(periode.tom);
                if (!fom || !tom) return false;
                return erDatoIPeriode(parsedInputDato, fom, tom);
              });

              return funnetIkkeRelevantPeriode
                ? `Dato kan ikke være inne i perioden (${funnetIkkeRelevantPeriode.fom} - ${funnetIkkeRelevantPeriode.tom})`
                : true;
            },
          },
        }}
        readOnly={readonly}
      />

      <HvordanLeggeTilSluttdatoReadMore />

      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={form.control}
        label={vilkårsvurderingLabel}
        rules={{
          required: 'Du må gjøre en vilkårsvurdering',
        }}
        readOnly={readonly}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.harSkadeSykdomEllerLyte`}
        control={form.control}
        label={harSkadeSykdomEllerLyteLabel}
        horisontal={true}
        rules={{ required: 'Du må svare på om brukeren har sykdom, skade eller lyte' }}
        readOnly={readonly}
      />
      {form.watch(`vurderinger.${index}.harSkadeSykdomEllerLyte`) === JaEllerNei.Ja && (
        <>
          <SykdomsvurderingDiagnosesøk index={index} form={form} readOnly={readonly} />
          <RadioGroupJaNei
            name={`vurderinger.${index}.erArbeidsevnenNedsatt`}
            control={form.control}
            label={erArbeidsevnenNedsattLabel}
            horisontal={true}
            rules={{ required: 'Du må svare på om brukeren har nedsatt arbeidsevne' }}
            readOnly={readonly}
          />
          {skalVurdereVissVarighet && (
            <SykdomsvurderingMedVissVarighet
              index={index}
              form={form}
              readonly={readonly}
              skalVurdereYrkesskade={skalVurdereYrkesskade}
            />
          )}
          {!skalVurdereVissVarighet && (
            <SykdomsvurderingUtenVissVarighet
              index={index}
              form={form}
              readonly={readonly}
              erÅrsakssammenhengYrkesskade={erÅrsakssammenhengYrkesskade}
            />
          )}
        </>
      )}
    </VStack>
  );
};
