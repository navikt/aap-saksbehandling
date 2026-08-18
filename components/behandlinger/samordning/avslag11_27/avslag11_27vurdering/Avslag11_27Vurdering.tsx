'use client';

import { BodyShort, HStack, Radio, VStack } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';
import { storForbokstavOgMellomromForUnderstrek } from 'lib/utils/string';
import { UseFormReturn } from 'react-hook-form';

import { Avslag11_27FormFields } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';

interface Props {
  form: UseFormReturn<Avslag11_27FormFields>;
  kravIndex: number;
  readonly: boolean;
  brukersYtelseAlternativer: string[];
}

export const Avslag11_27Vurdering = ({ form, kravIndex, readonly, brukersYtelseAlternativer }: Props) => {
  const vurdering = form.watch(`avslag11_27vurderinger.${kravIndex}.vurdering`);
  const harAnnenFullYtelse = vurdering?.harAnnenFullYtelse;
  const visYtelseSpørsmål = harAnnenFullYtelse === JaEllerNei.Ja;
  const visSykepengegrunnlagSpørsmål = visYtelseSpørsmål && vurdering?.brukersYtelse === 'SYKEPENGER';
  const visAvslagsSpørsmål = harAnnenFullYtelse === JaEllerNei.Ja;
  const sykepengegrunnlagINumber = Number(vurdering?.sykepengegrunnlag);
  const visningsverdiSykepengegrunnlag = Number.isFinite(sykepengegrunnlagINumber) ? sykepengegrunnlagINumber : 0;

  return (
    <VStack gap={'space-16'}>
      <TextAreaWrapper
        name={`avslag11_27vurderinger.${kravIndex}.vurdering.begrunnelse`}
        control={form.control}
        label={'Vilkårsvurdering'}
        rules={{ required: 'Du må begrunne vurderingen din' }}
        readOnly={readonly}
      />
      <RadioGroupWrapper
        name={`avslag11_27vurderinger.${kravIndex}.vurdering.harAnnenFullYtelse`}
        control={form.control}
        label={'Har brukeren en annen ytelse som regnes som full ytelse fra folketrygden?'}
        rules={{ required: 'Du må svare om brukeren har en annen ytelse som regnes som full ytelse fra folketrygden.' }}
        readOnly={readonly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>
      {visYtelseSpørsmål && (
        <VStack gap="space-8" align="start">
          <SelectWrapper
            name={`avslag11_27vurderinger.${kravIndex}.vurdering.brukersYtelse`}
            control={form.control}
            label={'Hvilken ytelse har brukeren?'}
            rules={{ required: 'Du må velge hvilken ytelse brukeren har' }}
            readOnly={readonly}
          >
            <option value="">Velg ytelse</option>
            {brukersYtelseAlternativer.map((verdi) => (
              <option key={verdi} value={verdi}>
                {storForbokstavOgMellomromForUnderstrek(verdi)}
              </option>
            ))}
          </SelectWrapper>
        </VStack>
      )}
      {visYtelseSpørsmål && (
        <VStack gap="space-8" align="start">
          <DateInputWrapper
            name={`avslag11_27vurderinger.${kravIndex}.vurdering.brukersYtelseTom`}
            control={form.control}
            label={'Bruker har annen full ytelse til og med dato'}
            rules={{ required: 'Du må oppgi til og med dato for bruker annen full ytelse' }}
            readOnly={readonly}
          />
        </VStack>
      )}
      {visSykepengegrunnlagSpørsmål && (
        <HStack gap="space-8" align="end">
          <TextFieldWrapper
            label={'Brukerens sykepengegrunnlag (årssats)'}
            description={'Ved sykepengegrunnlag under 2 G kan det lønne seg for bruker å velge AAP'}
            name={`avslag11_27vurderinger.${kravIndex}.vurdering.sykepengegrunnlag`}
            control={form.control}
            rules={{ required: 'Du må svare om brukerens sykepengegrunnlag.' }}
            readOnly={readonly}
            type={'number'}
          />
          <BodyShort>{visningsverdiSykepengegrunnlag} G</BodyShort>
        </HStack>
      )}
      {visSykepengegrunnlagSpørsmål && (
        <VStack key={kravIndex} gap="space-8" align="start">
          <RadioGroupWrapper
            name={`avslag11_27vurderinger.${kravIndex}.vurdering.harArbeidsgiverSykepengerUtbetaling`}
            control={form.control}
            label={'Utbetaler arbeidsgiver sykepenger til bruker?'}
            description={
              'Hvis arbeidsgiver utbetaler sykepenger, må brukeren sende dokumentasjon på at de ikke lenger mottar sykepenger fra arbeidsgiver før de kan innvilges AAP'
            }
            rules={{ required: 'Du må svare om bruker får sykepenger fra arbeidsgiver' }}
            readOnly={readonly}
            horisontal
          >
            <Radio value={JaEllerNei.Ja}>Ja</Radio>
            <Radio value={JaEllerNei.Nei}>Nei</Radio>
          </RadioGroupWrapper>
        </VStack>
      )}
      {visAvslagsSpørsmål && (
        <RadioGroupWrapper
          name={`avslag11_27vurderinger.${kravIndex}.vurdering.skalAvslås1127`}
          control={form.control}
          label={
            'Skal søknaden avslås etter § 11-27 fordi det er for tidlig å vurdere vilkårene for AAP mens brukeren har en annen ytelse?'
          }
          rules={{ required: 'Du må svare om søknaden skal avslås etter § 11-27' }}
          readOnly={readonly}
          horisontal
        >
          <Radio value={JaEllerNei.Ja}>Ja</Radio>
          <Radio value={JaEllerNei.Nei}>Nei</Radio>
        </RadioGroupWrapper>
      )}
    </VStack>
  );
};
