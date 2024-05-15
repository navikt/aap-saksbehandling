'use client';

import React from 'react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Button } from '@navikt/ds-react';
import { løsBehov } from 'lib/clientApi';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
}

export const BehandlingPåVentKort = ({ behandlingsreferanse }: Props) => {
  return (
    <VilkårsKort heading={'Behandling på vent'} steg={'START_BEHANDLING'}>
      Behandlingen er på vent. Vil du åpne den igjen?
      <Button
        size={'small'}
        onClick={() => {
          løsBehov({
            behandlingVersjon: 0,
            behov: {
              behovstype: Behovstype.MANUELT_SATT_PÅ_VENT_KODE,
            },
            referanse: behandlingsreferanse,
          });
        }}
      >
        Åpne behandling
      </Button>
    </VilkårsKort>
  );
};
