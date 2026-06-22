'use client';

import { KravGrunnlag, KravVurdering, KravVurderingLøsning, MellomlagretVurdering } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { Button, VStack } from '@navikt/ds-react';

import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import React, { useState } from 'react';
import { KravTabell } from 'components/behandlinger/krav/KravTabell';
import { KravVurderingModal } from 'components/behandlinger/krav/KravVurderingModal';
import { kravVurderingTilLøsning } from 'components/behandlinger/krav/kravutils';
import { Behovstype } from 'lib/utils/form';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

type Props = {
  grunnlag?: KravGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const VurderKrav = ({ readOnly, grunnlag, behandlingVersjon }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('KRAV');

  const [endredeVedtatte, setEndredeVedtatte] = useState<Record<string, KravVurderingLøsning>>({});
  const [endredeNye, setEndredeNye] = useState<Record<string, KravVurderingLøsning>>({});
  const [valgtVurdering, setValgtVurdering] = useState<{ krav: KravVurdering; erVedtatt: boolean } | undefined>();

  const handleEndreKrav = (krav: KravVurdering, erVedtatt: boolean) => {
    setValgtVurdering({ krav, erVedtatt });
  };

  const handleLagre = (løsning: KravVurderingLøsning) => {
    if (!valgtVurdering) return;
    if (valgtVurdering.erVedtatt) {
      setEndredeVedtatte((prev) => ({ ...prev, [valgtVurdering.krav.referanse]: løsning }));
    } else {
      setEndredeNye((prev) => ({ ...prev, [valgtVurdering.krav.referanse]: løsning }));
    }
    setValgtVurdering(undefined);
  };

  const handleTilbakestill = () => {
    if (!valgtVurdering) return;
    if (valgtVurdering.erVedtatt) {
      setEndredeVedtatte((prev) => {
        const { [valgtVurdering.krav.referanse]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setEndredeNye((prev) => {
        const { [valgtVurdering.krav.referanse]: _, ...rest } = prev;
        return rest;
      });
    }
    setValgtVurdering(undefined);
  };

  const handleSubmit = () => {
    const nyeVurderingerLøsninger = (grunnlag?.nyeVurderinger ?? []).map(
      (vurdering) => endredeNye[vurdering.referanse] ?? kravVurderingTilLøsning(vurdering)
    );
    const endredeVedtatteVurderinger = Object.values(endredeVedtatte);

    console.log('Nye vurderinger: ', nyeVurderingerLøsninger);
    console.log('Endrede vurderinger: ', endredeVedtatteVurderinger);

    løsBehovOgGåTilNesteSteg({
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsreferanse,
      behov: {
        behovstype: Behovstype.VURDER_KRAV_KODE,
        kravVurderinger: [...nyeVurderingerLøsninger, ...endredeVedtatteVurderinger],
      },
    });
  };

  return (
    <VilkårsKort heading={'Vurder krav'} steg={'KRAV'}>
      <VStack gap={'space-16'}>
        <KravTabell
          grunnlag={grunnlag}
          endredeVedtatte={endredeVedtatte}
          endredeNye={endredeNye}
          readOnly={readOnly}
          onEndreKrav={handleEndreKrav}
        />
        {valgtVurdering && (
          <KravVurderingModal
            krav={valgtVurdering.krav}
            erVedtatt={valgtVurdering.erVedtatt}
            initialLøsning={
              valgtVurdering.erVedtatt
                ? endredeVedtatte[valgtVurdering.krav.referanse]
                : endredeNye[valgtVurdering.krav.referanse]
            }
            onLagre={handleLagre}
            onTilbakestill={handleTilbakestill}
            onAvbryt={() => setValgtVurdering(undefined)}
          />
        )}
        <LøsBehovOgGåTilNesteStegStatusAlert
          løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
          status={status}
        />
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit}
          disabled={readOnly}
          className={'fit-content'}
          loading={isLoading}
        >
          Bekreft
        </Button>
      </VStack>
    </VilkårsKort>
  );
};
