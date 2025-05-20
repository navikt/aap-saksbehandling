'use client';

import { OpprettRevurdering } from 'components/saksoversikt/opprettrevurdering/OpprettRevurdering';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Klageresultat, SaksInfo } from 'lib/types/types';
import { hjemmelMap, hjemmelÅrsakMapMap } from 'lib/utils/hjemmel';

export const OmgjøringVurdering = ({ sak, klageresultat }: { sak: SaksInfo; klageresultat: Klageresultat }) => {
  return (
    <VilkårsKort heading={'Omgjøring'} steg={'OMGJØRING'}>
      <OpprettRevurdering
        sak={sak}
        defaultBegrunnelse={konstruerBegrunnelse()}
        defaultÅrsaker={finnDefaultÅrsaker()}
        redirect={true}
      />
    </VilkårsKort>
  );

  function konstruerBegrunnelse() {
    return `Revurdering etter klage som tas til følge. Følgende vilkår omgjøres: ${vilkårSomSkalOmgjøres()}`;
  }

  function vilkårSomSkalOmgjøres() {
    if ('vilkårSomSkalOmgjøres' in klageresultat) {
      return klageresultat.vilkårSomSkalOmgjøres.map((v) => hjemmelMap[v]).join(', ');
    }
    return [];
  }

  function finnDefaultÅrsaker() {
    if ('vilkårSomSkalOmgjøres' in klageresultat) {
      return klageresultat.vilkårSomSkalOmgjøres.map((v) => hjemmelÅrsakMapMap[v]).filter((e) => e !== undefined);
    }
    return [];
  }
};
