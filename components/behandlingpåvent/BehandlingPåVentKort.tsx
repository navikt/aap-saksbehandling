'use client';

import React from 'react';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { løsBehov } from 'lib/clientApi';
import { Behovstype } from 'lib/utils/form';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import { revalidateFlyt } from 'lib/actions/actions';
import { VenteInformasjon } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  informasjon?: VenteInformasjon;
}

export const BehandlingPåVentKort = ({ behandlingsreferanse, behandlingVersjon, informasjon }: Props) => {
  return (
    <SideProsessKort heading={'Behandling på vent'} icon={<HourglassBottomFilledIcon />}>
      <div className={'flex-column'}>
        {informasjon && (
          <>
            <div>
              <Label>Begrunnelse</Label>
              <BodyShort>{informasjon?.begrunnelse}</BodyShort>
            </div>
            <div>
              <Label>Frem til</Label>
              <BodyShort>{formaterDatoForFrontend(informasjon?.frist)}</BodyShort>
            </div>
          </>
        )}

        <BodyShort as={'p'}>Behandlingen er på vent. Vil du åpne den igjen?</BodyShort>
        <Button
          size={'medium'}
          onClick={async () => {
            await løsBehov({
              behandlingVersjon: behandlingVersjon,
              behov: {
                behovstype: Behovstype.MANUELT_SATT_PÅ_VENT_KODE,
              },
              referanse: behandlingsreferanse,
            });

            await revalidateFlyt(behandlingsreferanse);
          }}
          className={'fit-content-button'}
        >
          Åpne behandling
        </Button>
      </div>
    </SideProsessKort>
  );
};
