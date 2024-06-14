'use client';

import React from 'react';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { Behovstype } from 'lib/utils/form';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import { revalidateFlyt } from 'lib/actions/actions';
import { SettPåVentÅrsaker, VenteInformasjon } from 'lib/types/types';
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
              <Label>Årsak</Label>
              <BodyShort>{mapÅrsakerTilString(informasjon.grunn)}</BodyShort>
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

function mapÅrsakerTilString(årsak: SettPåVentÅrsaker): string {
  switch (årsak) {
    case 'VENTER_PÅ_VURDERING_AV_ROL':
      return 'Venter på vurdering av rådgivende overlege';
    case 'VENTER_PÅ_MEDISINSKE_OPPLYSNINGER':
      return 'Venter på medisinske opplysninger';
    case 'VENTER_PÅ_OPPLYSNINGER':
      return 'Venter på opplysninger';
    case 'VENTER_PÅ_SVAR_FRA_BRUKER':
      return 'Venter på svar fra bruker';
    case 'VENTER_PÅ_OPPLYSNINGER_FRA_UTENLANDSKE_MYNDIGHETER':
      return 'Venter på opplysninger fra utenlandske myndigheter';
  }
}
