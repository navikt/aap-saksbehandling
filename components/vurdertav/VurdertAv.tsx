'use client';

import { VurdertAvAnsatt } from 'lib/types/types';
import { Detail, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  vurdertAv?: VurdertAvAnsatt;
}

export const VurdertAv = ({ vurdertAv }: Props) => {
  if (!vurdertAv) return null;
  return (
    <VStack align="end">
      <Detail>{`Vurdert av ${vurdertAv?.ansattnavn || vurdertAv?.ident}, ${vurdertAv?.dato ? formaterDatoForFrontend(vurdertAv.dato) : ''}`}</Detail>
    </VStack>
  );
};
