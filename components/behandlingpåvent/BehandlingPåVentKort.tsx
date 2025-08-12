'use client';

import React, { useState } from 'react';
import { Alert, BodyShort, Button, Label } from '@navikt/ds-react';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import { SettPåVentÅrsaker, VenteInformasjon } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgVentPåProsessering } from 'hooks/saksbehandling/LøsBehovOgVentPåProsessering';
import { useFlyt } from 'hooks/saksbehandling/FlytHook';

interface Props {
  behandlingVersjon: number;
  informasjon?: VenteInformasjon;
}

export const BehandlingPåVentKort = ({ informasjon }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { flyt } = useFlyt();
  const { løsBehovOgVentPåProsessering, isLoading, løsBehovError } = useLøsBehovOgVentPåProsessering();
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <SideProsessKort heading={'Behandling på vent'} icon={<HourglassBottomFilledIcon aria-hidden />}>
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

            <BodyShort as={'p'}>Behandlingen er på vent. Vil du åpne den igjen?</BodyShort>
            {løsBehovError && (
              <Alert variant={'error'} size={'small'}>
                {løsBehovError.message}
              </Alert>
            )}

            {errorMessage && (
              <Alert variant={'error'} size={'small'}>
                {errorMessage}
              </Alert>
            )}
            {informasjon.grunn !== 'VENTER_PÅ_UTENLANDSK_VIDEREFORING_AVKLARING' && (
              <Button
                size={'medium'}
                loading={isLoading}
                onClick={async () => {
                  setErrorMessage(undefined);
                  if (!flyt?.behandlingVersjon) {
                    setErrorMessage('Mangler behandlingsversjon');
                    return;
                  }

                  løsBehovOgVentPåProsessering({
                    behandlingVersjon: flyt.behandlingVersjon,
                    behov: {
                      behovstype: informasjon?.definisjon.kode,
                    },
                    referanse: behandlingsReferanse,
                  });
                }}
                className={'fit-content'}
              >
                Åpne behandling
              </Button>
            )}
          </>
        )}
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
    case 'VENTER_PÅ_MASKINELL_AVKLARING':
      return 'Venter på maskinell avklaring';
    case 'VENTER_PÅ_UTENLANDSK_VIDEREFORING_AVKLARING':
      return 'Venter på videreføring av sak til utenlandsk trygdemyndighet';
    case 'VENTER_PÅ_KLAGE_IMPLEMENTASJON':
      return 'Venter på klageimplementasjon';
    case 'VENTER_PÅ_SVAR_PÅ_FORHÅNDSVARSEL':
      return 'Venter på svar på forhåndsvarsel';
    case 'VENTER_PÅ_FUNKSJONALITET':
      return 'Venter på manglende funksjonalitet';
  }
}
