'use client';

import React from 'react';
import { BodyShort, Button } from '@navikt/ds-react';
import { løsBehov } from 'lib/clientApi';
import { Behovstype } from 'lib/utils/form';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';

interface Props {
  behandlingsreferanse: string;
}

export const BehandlingPåVentKort = ({ behandlingsreferanse }: Props) => {
  return (
    <SideProsessKort heading={'Behandling på vent'} icon={<HourglassBottomFilledIcon />}>
      <div className={'flex-column'}>
        <BodyShort as={'p'}>Behandlingen er på vent. Vil du åpne den igjen?</BodyShort>
        <Button
          size={'medium'}
          onClick={() => {
            løsBehov({
              behandlingVersjon: 0,
              behov: {
                behovstype: Behovstype.MANUELT_SATT_PÅ_VENT_KODE,
              },
              referanse: behandlingsreferanse,
            });
          }}
          className={'fit-content-button'}
        >
          Åpne behandling
        </Button>
      </div>
    </SideProsessKort>
  );
};
