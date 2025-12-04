'use client';

import { VStack } from '@navikt/ds-react';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { BistandVurderingResponse } from 'lib/types/types';
import { getJaNeiEllerUndefined } from 'lib/utils/form';

interface Props {
  vurdering: BistandVurderingResponse;
}

export const BistandsbehovTidligereVurdering = ({ vurdering }: Props) => {
  return (
    <VStack gap="5">
      <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra" svar={formaterDatoForFrontend(vurdering.fom)} />
      <SpørsmålOgSvar spørsmål="Vilkårsvurdering" svar={vurdering.begrunnelse} />
      <SpørsmålOgSvar
        spørsmål="a: Har brukeren behov for aktiv behandling?"
        svar={getJaNeiEllerUndefined(vurdering.erBehovForAktivBehandling)!}
      />
      <SpørsmålOgSvar
        spørsmål="b: Har brukeren behov for arbeidsrettet tiltak?"
        svar={getJaNeiEllerUndefined(vurdering.erBehovForArbeidsrettetTiltak)!}
      />
      {vurdering.erBehovForAnnenOppfølging === true ||
        (vurdering.erBehovForAnnenOppfølging === false && (
          <SpørsmålOgSvar
            spørsmål="c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?"
            svar={getJaNeiEllerUndefined(vurdering.erBehovForAnnenOppfølging)!}
          />
        ))}
    </VStack>
  );
};
