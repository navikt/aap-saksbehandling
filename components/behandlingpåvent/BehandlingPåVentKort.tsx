'use client';

import React from 'react';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { Behovstype } from 'lib/utils/form';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import { revalidateFlyt } from 'lib/actions/actions';
import { VenteInformasjon } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgVentPåProsessering } from 'hooks/LøsBehovOgVentPåProsessering';

interface Props {
  behandlingVersjon: number;
  informasjon?: VenteInformasjon;
}

export const BehandlingPåVentKort = ({ behandlingVersjon, informasjon }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgVentPåProsessering, isLoading } = useLøsBehovOgVentPåProsessering();

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
            <div>
              <Label>Frem til</Label>
              <BodyShort>{informasjon.grunn}</BodyShort>
            </div>
          </>
        )}

        <BodyShort as={'p'}>Behandlingen er på vent. Vil du åpne den igjen?</BodyShort>
        <Button
          size={'medium'}
          loading={isLoading}
          onClick={async () => {
            løsBehovOgVentPåProsessering({
              behandlingVersjon: behandlingVersjon,
              behov: {
                behovstype: Behovstype.MANUELT_SATT_PÅ_VENT_KODE,
              },
              referanse: behandlingsReferanse,
            });

            await revalidateFlyt(behandlingsReferanse);
          }}
          className={'fit-content-button'}
        >
          Åpne behandling
        </Button>
      </div>
    </SideProsessKort>
  );
};
