'use client';

import { Detail, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

export type VurdertAvShape = {
  ansattnavn: string | null | undefined;
  ident: string | null | undefined;
  dato: string | null | undefined;
};

interface Props {
  vurdertAv: VurdertAvShape | undefined;
}

export const VurdertAv = ({ vurdertAv }: Props) => {
  if (!vurdertAv) return null;
  return (
    <VStack align="end">
      <Detail>{`Vurdert av ${vurdertAv?.ansattnavn || vurdertAv?.ident}, ${vurdertAv?.dato ? formaterDatoForFrontend(vurdertAv.dato) : ''}`}</Detail>
    </VStack>
  );
};
