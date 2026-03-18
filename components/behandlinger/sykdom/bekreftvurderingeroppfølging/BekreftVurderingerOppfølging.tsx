'use client';

import { useBehandlingsReferanse, useSaksnummer } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { BodyShort, Button, List, VStack } from '@navikt/ds-react';
import { BekreftVurderingerOppfølgingGrunnlag } from 'lib/types/types';
import { mapBehovskodeTilBehovstype } from 'lib/utils/oversettelser';
import Link from 'next/link';
import { byggVilkårskortLenke } from 'lib/utils/vilkårskort';
import { useBekreftVurderingerGrunnlag } from 'hooks/saksbehandling/BekrefteVurderingerHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  initialGrunnlag: BekreftVurderingerOppfølgingGrunnlag;
}

export const BekreftVurderingerOppfølging = ({ behandlingVersjon, readOnly, initialGrunnlag }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const saksnummer = useSaksnummer();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    'BEKREFT_VURDERINGER_OPPFØLGING'
  );

  const { grunnlag } = useBekreftVurderingerGrunnlag(initialGrunnlag);

  return (
    <VilkårsKort heading={'Bekreft vurderinger'} steg={'BEKREFT_VURDERINGER_OPPFØLGING'} aktivMarkering={true}>
      {!readOnly && (
        <VStack gap={'4'}>
          {grunnlag?.mellomlagredeVurderinger.length != 0 && (
            <VStack gap={'1'}>
              <BodyShort size={'small'}>Det finnes mellomlagrede vurderinger for følgende vilkår:</BodyShort>
              <List size={'small'}>
                {grunnlag?.mellomlagredeVurderinger.map((vurdering) => (
                  <List.Item key={vurdering.avklaringsbehovKode}>
                    <Link
                      href={byggVilkårskortLenke(
                        saksnummer,
                        behandlingsReferanse,
                        vurdering.avklaringsbehovKode as Behovstype
                      )}
                    >
                      <BodyShort size={'small'}>{mapBehovskodeTilBehovstype(vurdering.avklaringsbehovKode)}</BodyShort>
                    </Link>
                  </List.Item>
                ))}
              </List>
              <BodyShort size={'small'} weight={'semibold'}>
                Du må sende inn eller avbryte vurderingene for komme deg videre.
              </BodyShort>
            </VStack>
          )}

          <Button
            variant={'primary'}
            className="fit-content"
            disabled={grunnlag?.mellomlagredeVurderinger.length != 0}
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
