'use client';

import { Alert, HStack, Link, Radio, VStack } from '@navikt/ds-react';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { UseFormReturn } from 'react-hook-form';
import React from 'react';
import { OvergangUforeForm } from 'components/behandlinger/sykdom/overgangufore/OvergangUforePeriodisert';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { JaEllerNei } from 'lib/utils/form';
import { Veiledning } from 'components/veiledning/Veiledning';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';

interface Props {
  index: number;
  form: UseFormReturn<OvergangUforeForm>;
  readonly: boolean;
}

export const OvergangUforeVurderingFormInput = ({ index, form, readonly }: Props) => {
  const vilkårsvurderingLabel = 'Vilkårsvurdering';
  const brukerSøktUføretrygdLabel = 'Har brukeren søkt om uføretrygd?';
  const brukerHarFaattVedtakOmUføretrygdLabel = 'Har brukeren fått vedtak på søknaden om uføretrygd?';
  const brukerrettPaaAAPLabel = 'Har brukeren rett på AAP under behandling av krav om uføretrygd etter § 11-18?';
  const virkningsdatoLabel = 'Vurderingen gjelder fra';

  const brukerHarSoktOmUforetrygd = form.watch(`vurderinger.${index}.brukerHarSøktUføretrygd`) === JaEllerNei.Ja;
  const brukerHarFattAvslagPaUforetrygd =
    form.watch(`vurderinger.${index}.brukerHarFåttVedtakOmUføretrygd`) === 'JA_AVSLAG';
  return (
    <VStack gap={'5'}>
      <Veiledning
        defaultOpen={false}
        tekst={
          <div>
            <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-18" target="_blank">
              Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-18
            </Link>
          </div>
        }
      />
      <HStack justify={'space-between'}>
        <DateInputWrapper
          name={`vurderinger.${index}.fraDato`}
          label={virkningsdatoLabel}
          control={form.control}
          rules={{
            required: 'Du må velge fra hvilken dato vurderingen gjelder fra',
          }}
          readOnly={readonly}
        />
      </HStack>
      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={form.control}
        label={vilkårsvurderingLabel}
        rules={{
          required: 'Du må fylle ut en vilkårsvurdering',
        }}
        readOnly={readonly}
        shouldUnregister
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.brukerHarSøktUføretrygd`}
        control={form.control}
        label={brukerSøktUføretrygdLabel}
        horisontal={true}
        rules={{ required: 'Du må svare på om brukeren har søkt om uføretrygd' }}
        readOnly={readonly}
        shouldUnregister
      />
      {brukerHarSoktOmUforetrygd && (
        <RadioGroupWrapper
          name={`vurderinger.${index}.brukerHarFåttVedtakOmUføretrygd`}
          control={form.control}
          label={brukerHarFaattVedtakOmUføretrygdLabel}
          rules={{ required: 'Du må svare på om brukeren har fått vedtak om uføretrygd' }}
          shouldUnregister
          readOnly={readonly}
          size={'small'}
        >
          <Radio value={'NEI'}>Nei</Radio>
          <Radio value={'JA_INNVILGET_FULL'}>Ja, brukeren har fått innvilget full uføretrygd</Radio>
          <Radio value={'JA_INNVILGET_GRADERT'}>Ja, brukeren har fått innvilget gradert uføretrygd</Radio>
          <Radio value={'JA_AVSLAG'}>Ja, brukeren har fått avslag på uføretrygd</Radio>
        </RadioGroupWrapper>
      )}
      {brukerHarFattAvslagPaUforetrygd && (
        <Alert variant="warning">
          Hvis bruker har fått avslag på uføretrygd på bakgrunn av § 12-5, så må § 11-6 vurderes til oppfylt fra dato på
          uføretrygdvedtaket.
        </Alert>
      )}
      {brukerHarSoktOmUforetrygd && form.watch(`vurderinger.${index}.brukerHarFåttVedtakOmUføretrygd`) === 'NEI' && (
        <RadioGroupJaNei
          name={`vurderinger.${index}.brukerRettPåAAP`}
          control={form.control}
          label={brukerrettPaaAAPLabel}
          horisontal={true}
          rules={{ required: 'Du må svare på om brukeren har krav på AAP etter vedtak om uføretrygd etter § 11-18' }}
          readOnly={readonly}
          shouldUnregister
        />
      )}
    </VStack>
  );
};
