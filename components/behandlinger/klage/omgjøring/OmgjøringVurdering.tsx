'use client';

import { OpprettRevurdering } from 'components/saksoversikt/opprettrevurdering/OpprettRevurdering';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { SaksInfo } from 'lib/types/types';

export const OmgjøringVurdering = ({ sak }: { sak: SaksInfo }) => {
  return (
    <VilkårsKort heading={'Omgjøring'} steg={'OMGJØRING'}>
      <OpprettRevurdering sak={sak} defaultBegrunnelse={konstruerBegrunnelse()} redirect={true} />
    </VilkårsKort>
  );

  function konstruerBegrunnelse() {
    return 'Revurdering grunnet omgjøring av klage med følgende vilkår: \n';
  }
};
