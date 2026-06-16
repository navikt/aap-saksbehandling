'use client';

import { KravGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { Button, VStack } from '@navikt/ds-react';

import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import React, { useState } from 'react';
import { KravTabell } from 'components/behandlinger/krav/KravTabell';
import { Behovstype } from 'lib/utils/form';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

type Props = {
  grunnlag?: KravGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const VurderKrav = ({ readOnly, grunnlag, initialMellomlagretVurdering, behandlingVersjon }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('KRAV');

  const [valgtRad, velgRad] = useState<string>();

  const handleSubmit = () => {
    løsBehovOgGåTilNesteSteg({
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsreferanse,
      behov: {
        behovstype: Behovstype.VURDER_KRAV_KODE,
        kravVurderinger: [],
      },
    });
  };

  return (
    <VilkårsKort heading={'Vurder krav'} steg={'KRAV'}>
      <VStack gap={'space-16'}>
        <KravTabell grunnlag={grunnlag} mellomlagredeVurderinger={[]} readOnly={readOnly} />
        {/*{valgtRad && (*/}
        {/*  <Mellomlagre11_9Modal valgtRad={valgtRad} lagre={mellomlagreVurdering} avbryt={() => velgRad(undefined)} />*/}
        {/*)}*/}
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
