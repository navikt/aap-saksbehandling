'use client';

import { StønadsperiodeGrunnlag } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { StønadsperiodeTabell } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodetabell/StønadsperiodeTabell';
import { StønadsperiodeBoks } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodeboks/StønadsperiodeBoks';
import { VStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  behandlingVersjon: number;
  grunnlag: StønadsperiodeGrunnlag;
  readOnly: boolean;
}

export const Stønadsperiode = ({ grunnlag, readOnly }: Props) => {
  const [valgteKrav, setValgteKrav] = useState<string[]>([]);
  const vurderinger = [...grunnlag.nyeVurderinger, ...grunnlag.vedtatteVurderinger];

  const lukkKrav = (referanse: string) => {
    setValgteKrav((gjeldende) => gjeldende.filter((valgt) => valgt !== referanse));
  };

  const toggleValgtKrav = (referanse: string) => {
    setValgteKrav((gjeldende) =>
      gjeldende.includes(referanse) ? gjeldende.filter((valgt) => valgt !== referanse) : [...gjeldende, referanse]
    );
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
          const vurdering = vurderinger.find((vurdering) => vurdering.referanse === referanse);
          return (
            vurdering && <StønadsperiodeBoks key={referanse} vurdering={vurdering} onLukk={() => lukkKrav(referanse)} />
          );
        })}
      </VStack>
    </VilkårsKort>
  );
};
