'use client';

import { Alert, Radio, VStack } from '@navikt/ds-react';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { UseFormReturn } from 'react-hook-form';
import React from 'react';
import { OvergangUforeForm } from 'components/behandlinger/sykdom/overgangufore/OvergangUforePeriodisert';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { JaEllerNei } from 'lib/utils/form';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { useFeatureFlag } from 'context/UnleashContext';
import { formaterDatoForFrontend } from 'lib/utils/date';
interface Props {
  index: number;
  form: UseFormReturn<OvergangUforeForm>;
  readonly: boolean;
  søknadsdatoUføretrygd: string | undefined;
}

export const OvergangUforeVurderingFormInput = ({ index, form, readonly, søknadsdatoUføretrygd }: Props) => {
  const skalViseUføreSøknadInfo = useFeatureFlag('hentUforesoknadsdata');
  const vilkårsvurderingLabel = 'Vilkårsvurdering';
  const brukerSøktUføretrygdLabel = 'Har brukeren søkt om uføretrygd?';
  const brukerHarFaattVedtakOmUføretrygdLabel = 'Har brukeren fått vedtak på søknaden om uføretrygd?';
  const brukerrettPaaAAPLabel = 'Har brukeren rett på AAP under behandling av krav om uføretrygd etter § 11-18?';
  const virkningsdatoLabel = 'Vurderingen gjelder fra';

  const brukerHarSoktOmUforetrygd = form.watch(`vurderinger.${index}.brukerHarSøktUføretrygd`) === JaEllerNei.Ja;
  const brukerHarFattAvslagPaUforetrygd =
    form.watch(`vurderinger.${index}.brukerHarFåttVedtakOmUføretrygd`) === 'JA_AVSLAG';

  const harUforeVedtakEtterSoknad =
    form.watch(`vurderinger.${index}.brukerHarSøktUføretrygd`) === JaEllerNei.Ja &&
    (form.watch(`vurderinger.${index}.brukerHarFåttVedtakOmUføretrygd`) === 'JA_AVSLAG' ||
      form.watch(`vurderinger.${index}.brukerHarFåttVedtakOmUføretrygd`) === 'JA_INNVILGET_FULL' ||
      form.watch(`vurderinger.${index}.brukerHarFåttVedtakOmUføretrygd`) === 'JA_INNVILGET_GRADERT');

  const venterPaUforeVedtakMenHarAAP =
    form.watch(`vurderinger.${index}.brukerHarSøktUføretrygd`) === JaEllerNei.Ja &&
    form.watch(`vurderinger.${index}.brukerHarFåttVedtakOmUføretrygd`) === 'NEI' &&
    form.watch(`vurderinger.${index}.brukerRettPåAAP`) === JaEllerNei.Ja;

  return (
    <VStack gap={'5'}>
      <DateInputWrapper
        name={`vurderinger.${index}.fraDato`}
        label={virkningsdatoLabel}
        control={form.control}
        rules={{
          required: 'Du må velge fra hvilken dato vurderingen gjelder fra',
        }}
        readOnly={readonly}
      />

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
      {skalViseUføreSøknadInfo && (
        <Alert variant={'info'} size={'small'}>
          {søknadsdatoUføretrygd
            ? `Brukeren har søkt om uføretrygd ${formaterDatoForFrontend(søknadsdatoUføretrygd)}`
            : 'Ingen uføresøknad funnet på brukeren'}
        </Alert>
      )}
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
        <Alert variant="warning" size={'small'}>
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

      {harUforeVedtakEtterSoknad && (
        <Alert variant={'info'} size={'small'}>
          Hovedregelen er at datoen vurderingen gjelder fra er virkningstidspunktet for uføretrygd. Sjekk
          posteringsgrunnlaget og Kelvin-rutinen for mer informasjon.
        </Alert>
      )}

      {venterPaUforeVedtakMenHarAAP && (
        <Alert variant={'info'} size={'small'}>
          Pass på at datoen vurderingen gjelder fra er samme som søknadsdato om uføretrygd.
        </Alert>
      )}
    </VStack>
  );
};
