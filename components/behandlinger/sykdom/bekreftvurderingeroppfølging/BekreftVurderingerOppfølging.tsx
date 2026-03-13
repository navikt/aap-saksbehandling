'use client';

import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { Alert, Button, HStack, Tag, VStack } from '@navikt/ds-react';
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
        <VStack gap={'4'}>
          {grunnlag.mellomlagredeVurderinger.length != 0 && (
            <Alert variant="warning" size="small">
              <p>Det finnes mellomlagrede vurderinger for følgende vilkår:</p>
              <HStack gap={'2'}>
                {grunnlag.mellomlagredeVurderinger.map((vurdering) => (
                  <Tag size={'small'} variant="info" key={vurdering.avklaringsbehovKode}>
                    {mapBehovskodeTilBehovstype(vurdering.avklaringsbehovKode)}
                  </Tag>
                ))}
              </HStack>
              <p>Du må sende inn eller avbryte vurderingene for komme deg videre.</p>
            </Alert>
          )}
          <Button
            variant={'primary'}
            className="fit-content"
            disabled={grunnlag.mellomlagredeVurderinger.length != 0}
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
        </VStack>
      )}

      <LøsBehovOgGåTilNesteStegStatusAlert
        status={status}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      />
    </VilkårsKort>
  );
};
