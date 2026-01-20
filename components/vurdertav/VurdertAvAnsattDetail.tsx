'use client';

import { Detail, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { VurdertAvAnsatt } from 'lib/types/types';

interface Props {
  variant: 'KVALITETSSIKRER' | 'VURDERING' | 'BESLUTTER';
  vurdertAv?: VurdertAvAnsatt;
}

export const VurdertAvAnsattDetail = ({ vurdertAv, variant }: Props) => {
  if (!vurdertAv) return null;

  return (
    <VStack align="end">
      {variant == 'VURDERING' && (
        <Detail>{`Vurdert av ${utledVurdertAv(vurdertAv)}, ${vurdertAv?.dato ? formaterDatoForFrontend(vurdertAv.dato) : ''}`}</Detail>
      )}
      {variant == 'KVALITETSSIKRER' && (
        <Detail>{`Kvalitetssikret av ${utledVurdertAv(vurdertAv)}, ${vurdertAv?.dato ? formaterDatoForFrontend(vurdertAv.dato) : ''}`}</Detail>
      )}
      {variant == 'BESLUTTER' && (
        <Detail>{`Besluttet av ${utledVurdertAv(vurdertAv)}, ${vurdertAv?.dato ? formaterDatoForFrontend(vurdertAv.dato) : ''}`}</Detail>
      )}
    </VStack>
  );
};

function utledVurdertAv(vurdertAvAnsatt: VurdertAvAnsatt): string {
  return vurdertAvAnsatt.ansattnavn ? vurdertAvAnsatt.ansattnavn : vurdertAvAnsatt.ident;
}
