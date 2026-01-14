'use client';

import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { UseFormReturn } from 'react-hook-form';
import { ArbeidsopptrappingForm } from 'components/behandlinger/sykdom/arbeidsopptrapping/Arbeidsopptrapping';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { Alert, HStack, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { erDatoIPeriode, validerDato } from 'lib/validation/dateValidation';
import { parse } from 'date-fns';
import { Periode } from 'lib/types/types';
import { formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';

interface Props {
  index: number;
  form: UseFormReturn<ArbeidsopptrappingForm>;
  readonly: boolean;
  ikkeRelevantePerioder?: Periode[];
}
export const ArbeidsopptrappingVurderingFormInput = ({ index, readonly, form, ikkeRelevantePerioder }: Props) => {
  const rettPåAAPIOpptrapping = form.watch(`vurderinger.${index}.rettPaaAAPIOpptrapping`);

  return (
    <VStack gap={'5'}>
      <HStack justify={'space-between'}>
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
                  ? `Dato kan ikke være inne i perioden (${formaterDatoForFrontend(funnetIkkeRelevantPeriode.fom)} - ${formaterDatoForFrontend(funnetIkkeRelevantPeriode.tom)})`
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
        label="Vilkårsvurdering"
        rules={{
          required: 'Du må fylle ut en vilkårsvurdering',
        }}
        readOnly={readonly}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.reellMulighetTilOpptrapping`}
        control={form.control}
        label="Har brukeren en reell mulighet til å trappe opp til en 100% stilling?"
        horisontal={true}
        rules={{ required: 'Du må ta stilling til om brukeren har en reell mulighet til å trappe opp arbeid' }}
        readOnly={readonly}
      />

      <RadioGroupJaNei
        name={`vurderinger.${index}.rettPaaAAPIOpptrapping`}
        control={form.control}
        label="Har brukeren rett på AAP i arbeidsopptrapping etter § 11-23 6. ledd?"
        horisontal={true}
        rules={{ required: 'Du må ta stilling til om brukeren har rett på AAP i arbeidsopptrapping' }}
        readOnly={readonly}
      />
      {rettPåAAPIOpptrapping === JaEllerNei.Ja && (
        <HStack>
          <Alert size={'small'} variant={'info'}>
            Har du husket å lage en aktivitet for opptrappingen i aktivitetsplanen?
          </Alert>
        </HStack>
      )}
    </VStack>
  );
};
