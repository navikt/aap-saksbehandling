'use client';

import { StønadsperiodeGrunnlag } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { StønadsperiodeTabell } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodetabell/StønadsperiodeTabell';
import { StønadsperiodeBoks } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodeboks/StønadsperiodeBoks';
import { VStack } from '@navikt/ds-react';
import { useForm, useWatch } from 'react-hook-form';
import {
  byggInitielleStønadsperiodeVurderinger,
  finnStønadsperiodeVurderingByReferanse,
  hentOriginaleStønadsperiodeFormFelter,
  StønadsperiodeFormFields,
} from 'components/behandlinger/krav/utils/stønadsperiodeutils';

interface Props {
  behandlingVersjon: number;
  grunnlag: StønadsperiodeGrunnlag;
  readOnly: boolean;
}

export const Stønadsperiode = ({ grunnlag, readOnly }: Props) => {
  const form = useForm<StønadsperiodeFormFields>({
    defaultValues: {
      valgteKrav: [],
      vurderinger: byggInitielleStønadsperiodeVurderinger(grunnlag),
    },
  });
  const { control, setValue, getValues } = form;
  const valgteKrav = useWatch({ control, name: 'valgteKrav' }) ?? [];

  const lukkKrav = (referanse: string) => {
    const originaleFelter = hentOriginaleStønadsperiodeFormFelter(grunnlag, referanse);
    if (originaleFelter) {
      setValue(`vurderinger.${referanse}`, originaleFelter);
    }
    setValue(
      'valgteKrav',
      (getValues('valgteKrav') ?? []).filter((valgt) => valgt !== referanse)
    );
  };

  const toggleValgtKrav = (referanse: string) => {
    if (valgteKrav.includes(referanse)) {
      lukkKrav(referanse);
    } else {
      setValue('valgteKrav', [...(getValues('valgteKrav') ?? []), referanse]);
    }
  };

  return (
    <VilkårsKort heading={'Forskrift om AAP § 12. Ny stønadsperiode'} steg={'AVKLAR_STØNADSPERIODE'}>
      <VStack gap="space-16">
        <StønadsperiodeTabell
          grunnlag={grunnlag}
          readOnly={readOnly}
          valgteKrav={valgteKrav}
          onToggleValgtKrav={toggleValgtKrav}
        />

        {valgteKrav.map((referanse) => {
          const vurdering = finnStønadsperiodeVurderingByReferanse(grunnlag, referanse);
          return (
            vurdering && (
              <StønadsperiodeBoks
                key={referanse}
                vurdering={vurdering}
                form={form}
                onLukk={() => lukkKrav(referanse)}
              />
            )
          );
        })}
      </VStack>
    </VilkårsKort>
  );
};
