'use client';

import { HGrid } from '@navikt/ds-react/HGrid';
import { ReactNode, useState } from 'react';
import { Saksbehandlingsoversikt } from 'components/saksbehandlingsoversikt/Saksbehandlingsoversikt';
import { FetchResponse } from 'lib/utils/api';
import { DetaljertBehandling, KabalKlageResultat, Klageresultat, SaksInfo } from 'lib/types/types';

interface Props {
  hovedkolonneInnhold: ReactNode;
  visTotrinnsvurdering: boolean;
  toTrinnsvurdering?: ReactNode;
  behandling: DetaljertBehandling;
  sak: SaksInfo;
  klageresultat?: Klageresultat;
  kabalKlageresultat: FetchResponse<KabalKlageResultat>;
}

export const Kolonnelayout = ({
  hovedkolonneInnhold,
  visTotrinnsvurdering,
  toTrinnsvurdering,
  behandling,
  sak,
  klageresultat,
  kabalKlageresultat,
}: Props) => {
  const [erSaksbehandlingsoversiktExpanded, setErSaksbehandlingsoversiktExpanded] = useState(true);

  const columns = !visTotrinnsvurdering && !erSaksbehandlingsoversiktExpanded ? '12fr 1fr' : '4fr 2fr';

  return (
    <HGrid
      columns={columns}
      padding={'space-16'}
      gap={'space-16'}
      maxWidth={'1680px'}
      marginInline={'auto'}
      marginBlock={'space-0'}
    >
      {hovedkolonneInnhold}
      <aside className={'flex-column'}>
        {toTrinnsvurdering}
        <Saksbehandlingsoversikt
          behandling={behandling}
          sak={sak}
          klageresultat={klageresultat}
          kabalKlageresultat={kabalKlageresultat}
          expanded={erSaksbehandlingsoversiktExpanded}
          onExpandedChange={setErSaksbehandlingsoversiktExpanded}
        />
      </aside>
    </HGrid>
  );
};
