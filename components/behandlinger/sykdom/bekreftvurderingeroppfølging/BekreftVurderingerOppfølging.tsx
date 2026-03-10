'use client';

import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { Alert, Button } from '@navikt/ds-react';
import { BekreftVurderingerOppfølgingGrunnlag } from 'lib/types/types';
import { mapBehovskodeTilBehovstype } from 'lib/utils/oversettelser';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: BekreftVurderingerOppfølgingGrunnlag;
}

export const BekreftVurderingerOppfølging = ({ behandlingVersjon, readOnly, grunnlag }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    'BEKREFT_VURDERINGER_OPPFØLGING'
  );

  return (
    <VilkårsKort heading={'Bekreft vurderinger'} steg={'BEKREFT_VURDERINGER_OPPFØLGING'}>
      {!readOnly && (
        <>
          {grunnlag.mellomlagredeVurderinger.length != 0 && (
            <Alert variant="warning" size="small">
              <p>
                {`Det finnes mellomlagrede vurderinger for følgende vilkår: ${grunnlag.mellomlagredeVurderinger.map((vurdering) => mapBehovskodeTilBehovstype(vurdering.avklaringsbehovKode))}`}
              </p>
              <p>Du må sende inn eller avbryte vurderingene for komme deg videre.</p>
            </Alert>
          )}
          <Button
            variant={'primary'}
            onClick={() =>
              løsBehovOgGåTilNesteSteg({
                behandlingVersjon: behandlingVersjon,
                behov: {
                  behovstype: Behovstype.BEKREFT_VURDERINGER_OPPFØLGING,
                },
                referanse: behandlingsReferanse,
              })
            }
            loading={isLoading}
          >
            Bekreft vurderinger og send videre
          </Button>
        </>
      )}

      <LøsBehovOgGåTilNesteStegStatusAlert
        status={status}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      />
    </VilkårsKort>
  );
};
