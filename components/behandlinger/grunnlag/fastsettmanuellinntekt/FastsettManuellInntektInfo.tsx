'use client';

import { BodyShort, Button } from '@navikt/ds-react';
import { useState } from 'react';
import { ManuellInntektGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { FastsettManuellInntektNy } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektNy';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';

interface Props {
  behandlingsversjon: number;
  grunnlag: ManuellInntektGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export const FastsettManuellInntektInfo = ({
  behandlingsversjon,
  grunnlag,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const [overstyringAvManuellInntekt, setOverstyringAvManuellInntekt] = useState<boolean>(false);
  const heading = 'Manglende pensjonsgivende inntekter / EØS inntekter';

  if (overstyringAvManuellInntekt) {
    return (
      <FastsettManuellInntektNy
        heading={heading}
        behandlingsversjon={behandlingsversjon}
        grunnlag={grunnlag}
        readOnly={readOnly}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
      />
    );
  }

  return (
    <VilkårsKort heading={heading} steg={'MANGLENDE_LIGNING'}>
      <BodyShort spacing>
        Hvis det mangler pensjonsgivende inntekt for noen av beregningsårene, eller brukerens inntekt skal beregnes med
        inntekter i EØS, så kan brukerens inntekt for relevante år overstyres. Inntekter skal ikke G-justeres, da det
        gjøres automatisk av systemet.
      </BodyShort>
      <Button variant={'secondary'} onClick={() => setOverstyringAvManuellInntekt(true)}>
        Overstyr
      </Button>
    </VilkårsKort>
  );
};
