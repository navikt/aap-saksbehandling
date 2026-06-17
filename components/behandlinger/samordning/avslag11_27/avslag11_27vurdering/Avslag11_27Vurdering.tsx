'use client';

import { Radio, VStack } from '@navikt/ds-react';
import { UseFormReturn } from 'react-hook-form';
import { JaEllerNei } from 'lib/utils/form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { Avslag11_27FormFields } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';
import { Avslag11_27BrukersYtelse } from 'lib/types/types';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';

interface Props {
  form: UseFormReturn<Avslag11_27FormFields>;
  kravIndex: number;
  readonly: boolean;
}

const brukersYtelseOptions: { value: NonNullable<Avslag11_27BrukersYtelse>; label: string }[] = [
  { value: 'SYKEPENGER', label: 'Sykepenger' },
  { value: 'FORELDREPENGER', label: 'Foreldrepenger' },
  { value: 'PLEIEPENGER', label: 'Pleiepenger' },
  { value: 'OMSORGSPENGER', label: 'Omsorgspenger' },
  { value: 'OPPLÆRINGSPENGER', label: 'Opplæringspenger' },
  { value: 'SVANGERSKAPSPENGER', label: 'Svangerskapspenger' },
  { value: 'FERIE_I_SYKEPENGEPERIODE', label: 'Ferie i sykepengeperiode' },
];

export const Avslag11_27Vurdering = ({ form, kravIndex, readonly }: Props) => {
  const vurdering = form.watch(`avslag11_27vurderinger.${kravIndex}.vurdering`);
  const visYtelseSpørsmål = vurdering?.harAnnenFullYtelse === JaEllerNei.Ja;
  const visSykepengegrunnlagSpørsmål = visYtelseSpørsmål && vurdering?.brukersYtelse === 'SYKEPENGER';

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
        rules={{ required: 'Du må svare på dette spørsmålet' }}
        readOnly={readonly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>
      {visYtelseSpørsmål && (
        <VStack key={kravIndex} gap="space-8" align="start">
          <SelectWrapper
            name={`avslag11_27vurderinger.${kravIndex}.vurdering.brukersYtelse`}
            control={form.control}
            label={'Hvilken ytelse har brukeren?'}
            rules={{ required: 'Du må velge hvilken ytelse brukeren har' }}
            readOnly={readonly}
          >
            <option value="">Velg ytelse</option>
            {brukersYtelseOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectWrapper>
        </VStack>
      )}
      {visSykepengegrunnlagSpørsmål && (
        <RadioGroupWrapper
          name={`avslag11_27vurderinger.${kravIndex}.vurdering.harSykepengegrunnlagOver2G`}
          control={form.control}
          label={'Har brukeren sykepengegrunnlag større enn 2G?'}
          rules={{ required: 'Du må svare på dette spørsmålet' }}
          readOnly={readonly}
          horisontal
        >
          <Radio value={JaEllerNei.Ja}>Ja</Radio>
          <Radio value={JaEllerNei.Nei}>Nei</Radio>
        </RadioGroupWrapper>
      )}
      <RadioGroupWrapper
        name={`avslag11_27vurderinger.${kravIndex}.vurdering.skalAvslås1127`}
        control={form.control}
        label={
          'Skal søknaden avslås etter § 11-27 fordi det er for tidlig å vurdere vilkårene for AAP mens brukeren har en annen ytelse?'
        }
        rules={{ required: 'Du må svare på dette spørsmålet' }}
        readOnly={readonly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>
    </VStack>
  );
};
