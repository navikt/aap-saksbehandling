'use client';

import { Button, ErrorSummary, VStack } from '@navikt/ds-react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useBekreftVurderingerGrunnlag } from 'hooks/saksbehandling/BekrefteVurderingerHook';
import { BekreftVurderingerOppfølgingGrunnlag } from 'lib/types/types';
import { Behovstype, mapBehovskodeTilBehovstype } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import { byggVilkårskortLenke } from 'lib/utils/vilkårskort';

import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  initialGrunnlag: BekreftVurderingerOppfølgingGrunnlag;
}

export const BekreftVurderingerOppfølging = ({ behandlingVersjon, readOnly, initialGrunnlag }: Props) => {
  const { behandlingsreferanse, saksnummer } = useParamsMedType();
  const { løsAvklaringsbehovStatus, løsAvklaringsbehov, løsAvklaringsbehovIsLoading, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('BEKREFT_VURDERINGER_OPPFØLGING');
  const umamiStartTidspunkt = useUmamiStartTidspunkt('BEKREFT_VURDERINGER_OPPFØLGING');

  const { grunnlag } = useBekreftVurderingerGrunnlag(initialGrunnlag);

  return (
    <VilkårsKort heading={'Bekreft vurderinger'} steg={'BEKREFT_VURDERINGER_OPPFØLGING'} aktivMarkering={true}>
      {!readOnly && (
        <VStack gap={'space-16'}>
          {grunnlag?.mellomlagredeVurderinger.length != 0 && (
            <VStack gap={'space-16'}>
              <ErrorSummary
                size={'small'}
                heading={'Det finnes endringer som ikke er lagret. Bekreft eller avbryt disse før du kan fortsette.'}
              >
                {grunnlag?.mellomlagredeVurderinger.map((vurdering) => (
                  <ErrorSummary.Item
                    key={vurdering.avklaringsbehovKode}
                    href={byggVilkårskortLenke(
                      saksnummer,
                      behandlingsreferanse,
                      vurdering.avklaringsbehovKode as Behovstype
                    )}
                  >
                    {mapBehovskodeTilBehovstype(vurdering.avklaringsbehovKode)}
                  </ErrorSummary.Item>
                ))}
              </ErrorSummary>
            </VStack>
          )}

          <Button
            variant={'primary'}
            className="fit-content"
            disabled={grunnlag?.mellomlagredeVurderinger.length != 0}
            onClick={() =>
              løsAvklaringsbehov(
                {
                  behandlingVersjon: behandlingVersjon,
                  behov: {
                    behovstype: Behovstype.BEKREFT_VURDERINGER_OPPFØLGING,
                  },
                  referanse: behandlingsreferanse,
                },
                () => {
                  loggUmamiVarighet('STEG_BEKREFT_VURDERINGER_OPPFØLGING_VARIGHET', umamiStartTidspunkt, Date.now());
                }
              )
            }
            loading={løsAvklaringsbehovIsLoading}
          >
            Bekreft vurderinger og send videre
          </Button>
        </VStack>
      )}
      <LøsBehovOgGåTilNesteStegStatusAlert
        status={løsAvklaringsbehovStatus}
        løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      />
    </VilkårsKort>
  );
};
