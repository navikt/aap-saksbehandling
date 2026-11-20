'use client';

import { Tag } from '@navikt/ds-react';
import { EtableringFase } from './EtableringAvEgenVirksomhetNy';

interface Props {
  fase?: EtableringFase | null;
}

export const VirksomhetFaseTag = ({ fase }: Props) => {
  if (!fase) {
    return null;
  }

  return (
    <Tag size="xsmall" data-color={'neutral'} variant='neutral-moderate'>
      {mapFaseToFaseTekst(fase)}
    </Tag>
  );
};


function mapFaseToFaseTekst(fase: EtableringFase): string | undefined {
  switch (fase) {
    case 'UTVIKLING':
      return 'Utvikling';
    case 'OPPSTART':
      return 'Oppstart';
  }
}
