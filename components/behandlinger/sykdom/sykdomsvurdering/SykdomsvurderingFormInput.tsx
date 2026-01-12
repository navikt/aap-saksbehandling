'use client';

import { HStack, Link, VStack } from '@navikt/ds-react';
import { erDatoIPeriode, validerDato } from 'lib/validation/dateValidation';
import { parse } from 'date-fns';
import { stringToDate } from 'lib/utils/date';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { UseFormReturn } from 'react-hook-form';
import { Periode, TypeBehandling } from 'lib/types/types';
import type { SykdomsvurderingerForm } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingPeriodisert';
import { JaEllerNei } from 'lib/utils/form';
import { Sak } from 'context/saksbehandling/SakContext';
import { SykdomsvurderingFørstegangsbehandling } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingFørstegangsbehandling';
import { SykdomsvurderingRevurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingRevurdering';
import { SykdomsvurderingDiagnosesøk } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingDiagnosesøk';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';

interface Props {
  index: number;
  form: UseFormReturn<SykdomsvurderingerForm>;
  readonly: boolean;
  ikkeRelevantePerioder?: Periode[];
  typeBehandling: TypeBehandling;
  sak: Sak;
  skalVurdereYrkesskade: boolean;
  erÅrsakssammenhengYrkesskade: boolean;
  erRevurderingAvFørstegangsbehandling: boolean;
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
  typeBehandling,
  index,
  form,
  readonly,
  ikkeRelevantePerioder,
  erRevurderingAvFørstegangsbehandling,
}: Props) => {
  const behandlingErRevurdering = typeBehandling === 'Revurdering';
  const behandlingErFørstegangsbehandling = typeBehandling === 'Førstegangsbehandling';

  return (
    <VStack gap={'5'}>
      <Link href="https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_7-1" target="_blank">
        Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-5 (lovdata.no)
      </Link>
      <HStack justify={'space-between'}>
        <DateInputWrapper
          name={`vurderinger.${index}.fraDato`}
          label="Vurderingen gjelder fra"
          control={form.control}
          rules={{
            required: 'Du må velge fra hvilken dato vurderingen gjelder fra',
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
      </HStack>
      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={form.control}
        label={vilkårsvurderingLabel}
        rules={{
          required: 'Du må gjøre en vilkårsvurdering',
        }}
        readOnly={readonly}
        shouldUnregister
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.harSkadeSykdomEllerLyte`}
        control={form.control}
        label={harSkadeSykdomEllerLyteLabel}
        horisontal={true}
        rules={{ required: 'Du må svare på om brukeren har sykdom, skade eller lyte' }}
        readOnly={readonly}
        shouldUnregister
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
            shouldUnregister
          />
          {(behandlingErFørstegangsbehandling || erRevurderingAvFørstegangsbehandling) && (
            <SykdomsvurderingFørstegangsbehandling
              index={index}
              form={form}
              readonly={readonly}
              skalVurdereYrkesskade={skalVurdereYrkesskade}
            />
          )}
          {behandlingErRevurdering && !erRevurderingAvFørstegangsbehandling && (
            <SykdomsvurderingRevurdering
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
