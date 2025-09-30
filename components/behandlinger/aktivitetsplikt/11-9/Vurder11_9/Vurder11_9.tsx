'use client';
import React, { useState } from 'react';
import { Button, Heading, VStack } from '@navikt/ds-react';
import {
  BruddRad,
  Registrer11_9BruddTabell,
} from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Registrer11_9BruddTabell';
import {
  Vurder11_9Grunnlag,
  Vurdering11_9,
} from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { PlusIcon } from '@navikt/aksel-icons';
import { Mellomlagre11_9Modal } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Mellomlagre11_9Modal';
import { BruddStatus } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/utils';
import { isEqual, omit } from 'lodash';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { MellomlagretVurdering } from 'lib/types/types';

type Props = {
  grunnlag?: Vurder11_9Grunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const Vurder11_9 = ({ readOnly, grunnlag, initialMellomlagretVurdering }: Props) => {
  const tidligereVurderinger = grunnlag?.tidligereVurderinger ?? [];
  const vurderingerSendtTilBeslutter = grunnlag?.ikkeIverksatteVurderinger ?? [];

  const {
    valgtRad,
    velgRad,
    lagre,
    fjernRad,
    angreFjerning,
    mellomlagredeVurderinger,
    vurderingerSendtTilBeslutterSomSkalSlettes,
  } = useBruddRader(tidligereVurderinger, vurderingerSendtTilBeslutter, initialMellomlagretVurdering);

  const handleSubmit = () => {
    console.log('Submitter mellomlagrede vurderinger', mellomlagredeVurderinger);
  };

  return (
    <VilkårsKort
      heading={'§ 11-9 Reduksjon av AAP etter brudd på aktivitetsplikt'}
      steg={'VURDER_AKTIVITETSPLIKT_11_9'}
    >
      <VStack gap={'4'}>
        <Heading level={'3'} size={'xsmall'}>
          Brudd på aktivitetsplikten § 11-9
        </Heading>
        <VStack gap={'10'}>
          <Registrer11_9BruddTabell
            tidligereVurderinger={tidligereVurderinger}
            vurderingerSendtTilBeslutter={vurderingerSendtTilBeslutter}
            vurderingerSendtTilBeslutterSomSkalSlettes={vurderingerSendtTilBeslutterSomSkalSlettes}
            angreFjerning={angreFjerning}
            mellomlagredeVurderinger={mellomlagredeVurderinger}
            valgtRad={valgtRad}
            velgRad={velgRad}
            fjernRad={fjernRad}
            readOnly={readOnly}
          ></Registrer11_9BruddTabell>
          {valgtRad && <Mellomlagre11_9Modal valgtRad={valgtRad} lagre={lagre} avbryt={() => velgRad(undefined)} />}
          {!valgtRad && !readOnly && (
            <>
              <Button
                type="button"
                variant="tertiary"
                className="fit-content"
                icon={<PlusIcon aria-hidden />}
                onClick={() =>
                  velgRad({
                    id: '',
                    dato: '',
                    brudd: undefined,
                    grunn: '',
                    status: BruddStatus.NY,
                    begrunnelse: '',
                  })
                }
              >
                Legg til brudd
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmit}
                disabled={readOnly}
                className={'fit-content'}
              >
                Bekreft
              </Button>
            </>
          )}
        </VStack>
      </VStack>
    </VilkårsKort>
  );
};

interface MellomlagretData {
  mellomlagredeVurderinger: Vurdering11_9[];
  vurderingerSendtTilBeslutterSomSkalSlettes: string[];
}

function useBruddRader(
  tidligereVurderinger: Vurdering11_9[],
  vurderingerSendtTilBeslutter: Vurdering11_9[],
  initialMellomlagretVurdering?: MellomlagretVurdering
) {
  const { mellomlagretVurdering, lagreMellomlagring } = useMellomlagring(
    Behovstype.VURDER_BRUDD_11_9_KODE,
    initialMellomlagretVurdering
  );

  const { mellomlagredeVurderinger, vurderingerSendtTilBeslutterSomSkalSlettes }: MellomlagretData =
    mellomlagretVurdering?.data
      ? JSON.parse(mellomlagretVurdering.data)
      : { mellomlagredeVurderinger: [], vurderingerSendtTilBeslutterSomSkalSlettes: [] };

  const [valgtRad, velgRad] = useState<BruddRad>();

  const lagre = (vurdering: Vurdering11_9) => {
    velgRad(undefined);
    const duplikat = [...tidligereVurderinger, ...vurderingerSendtTilBeslutter].find((eksisterende) =>
      isEqual(omit(eksisterende, 'id'), omit(vurdering, 'id'))
    );
    if (duplikat) {
      return;
    }
    lagreMellomlagring({
      mellomlagredeVurderinger: [...mellomlagredeVurderinger.filter((v) => v.dato !== vurdering.dato), vurdering],
      vurderingerSendtTilBeslutterSomSkalSlettes: vurderingerSendtTilBeslutterSomSkalSlettes,
    });
  };

  const fjernRad = (rad: BruddRad) => {
    if (rad.status === BruddStatus.SENDT_TIL_BESLUTTER) {
      lagreMellomlagring({
        mellomlagredeVurderinger: mellomlagredeVurderinger,
        vurderingerSendtTilBeslutterSomSkalSlettes: [...vurderingerSendtTilBeslutterSomSkalSlettes, rad.id],
      });
    } else {
      lagreMellomlagring({
        mellomlagredeVurderinger: mellomlagredeVurderinger.filter((v) => v.dato !== rad.dato),
        vurderingerSendtTilBeslutterSomSkalSlettes: vurderingerSendtTilBeslutterSomSkalSlettes,
      });
    }
  };

  const angreFjerning = (id: string) => {
    lagreMellomlagring({
      mellomlagredeVurderinger: mellomlagredeVurderinger,
      vurderingerSendtTilBeslutterSomSkalSlettes: vurderingerSendtTilBeslutterSomSkalSlettes.filter(
        (slettetId) => slettetId !== id
      ),
    });
  };

  return {
    valgtRad,
    velgRad,
    lagre,
    fjernRad,
    angreFjerning,
    mellomlagredeVurderinger,
    vurderingerSendtTilBeslutterSomSkalSlettes,
  };
}
