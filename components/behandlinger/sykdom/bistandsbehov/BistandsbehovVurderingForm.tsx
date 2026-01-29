'use client';

import { JaEllerNei } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { VStack } from '@navikt/ds-react';
import { UseFormReturn } from 'react-hook-form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { BistandForm } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovPeriodisert';
import { BistandsGrunnlag } from 'lib/types/types';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { HvordanLeggeTilSluttdatoReadMore } from 'components/hvordanleggetilsluttdatoreadmore/HvordanLeggeTilSluttdatoReadMore';
import React from 'react';

type Props = {
  form: UseFormReturn<BistandForm>;
  readOnly: boolean;
  index: number;
  grunnlag?: BistandsGrunnlag;
};
export const BistandsbehovVurderingForm = ({ form, index, readOnly }: Props) => {
  const vilkårsvurderingLabel = 'Vilkårsvurdering';
  const erBehovForAktivBehandlingLabel = 'a: Har brukeren behov for aktiv behandling?';
  const erBehovForArbeidsrettetTiltakLabel = 'b: Har brukeren behov for arbeidsrettet tiltak?';
  const erBehovForAnnenOppfølgingLabel =
    'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?';

  return (
    <VStack gap={'4'}>
      <DateInputWrapper
        name={`vurderinger.${index}.fraDato`}
        label="Vurderingen gjelder fra"
        control={form.control}
        rules={{
          required: 'Vennligst velg en dato for når vurderingen gjelder fra',
          validate: (value) => validerDato(value as string),
        }}
        readOnly={readOnly}
      />

      <HvordanLeggeTilSluttdatoReadMore />

      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={form.control}
        label={vilkårsvurderingLabel}
        rules={{
          required: 'Du må gi en begrunnelse om brukeren har behov for oppfølging',
        }}
        readOnly={readOnly}
        className={'begrunnelse'}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.erBehovForAktivBehandling`}
        control={form.control}
        label={erBehovForAktivBehandlingLabel}
        horisontal={true}
        rules={{ required: 'Du må svare på om brukeren har behov for aktiv behandling' }}
        readOnly={readOnly}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.erBehovForArbeidsrettetTiltak`}
        control={form.control}
        label={erBehovForArbeidsrettetTiltakLabel}
        horisontal={true}
        rules={{ required: 'Du må svare på om brukeren har behov for arbeidsrettet tiltak' }}
        readOnly={readOnly}
      />
      {form.watch(`vurderinger.${index}.erBehovForAktivBehandling`) !== JaEllerNei.Ja &&
        form.watch(`vurderinger.${index}.erBehovForArbeidsrettetTiltak`) !== JaEllerNei.Ja && (
          <RadioGroupJaNei
            name={`vurderinger.${index}.erBehovForAnnenOppfølging`}
            control={form.control}
            label={erBehovForAnnenOppfølgingLabel}
            horisontal={true}
            rules={{ required: 'Du må svare på om brukeren anses for å ha en viss mulighet til å komme i arbeid' }}
            readOnly={readOnly}
          />
        )}
    </VStack>
  );
};
