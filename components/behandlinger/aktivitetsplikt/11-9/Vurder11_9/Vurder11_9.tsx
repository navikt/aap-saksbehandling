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

type Props = {
  grunnlag?: Vurder11_9Grunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const Vurder11_9 = ({ readOnly, grunnlag }: Props) => {
  const tidligereVurderinger = grunnlag?.tidligereVurderinger ?? [];
  const vurderingerSendtTilBeslutter = grunnlag?.ikkeIverksatteVurderinger ?? [];

  const {
    valgtRad,
    velgRad,
    lagre,
    fjernRad,
    angreFjerning,
    mellomlagredeVurderinger,
    ikkeVedtatteVurrderingerSomSkalSlettes,
  } = useBruddRader(tidligereVurderinger, vurderingerSendtTilBeslutter);

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
            ikkeIverksatteVurderingerSomSkalSlettes={ikkeVedtatteVurrderingerSomSkalSlettes}
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

function useBruddRader(tidligereVurderinger: Vurdering11_9[], vurderingerSendtTilBeslutter: Vurdering11_9[]) {
  const [mellomlagredeVurderinger, setMellomlagredeVurderinger] = useState<Vurdering11_9[]>([]);
  const [ikkeVedtatteVurrderingerSomSkalSlettes, setIkkeVedtatteVurderingerSomSkalSlettes] = useState<string[]>([]);

  const [valgtRad, velgRad] = useState<BruddRad>();

  const lagre = (vurdering: Vurdering11_9) => {
    velgRad(undefined);
    const duplikat = [...tidligereVurderinger, ...vurderingerSendtTilBeslutter].find((eksisterende) =>
      isEqual(omit(eksisterende, 'id'), omit(vurdering, 'id'))
    );
    if (duplikat) {
      return;
    }
    setMellomlagredeVurderinger([...mellomlagredeVurderinger.filter((v) => v.dato !== vurdering.dato), vurdering]);
  };

  const fjernRad = (rad: BruddRad) => {
    if (rad.status === BruddStatus.SENDT_TIL_BESLUTTER) {
      setIkkeVedtatteVurderingerSomSkalSlettes([...ikkeVedtatteVurrderingerSomSkalSlettes, rad.id]);
    } else {
      setMellomlagredeVurderinger(mellomlagredeVurderinger.filter((v) => v.dato !== rad.dato));
    }
  };

  const angreFjerning = (id: string) => {
    setIkkeVedtatteVurderingerSomSkalSlettes(
      ikkeVedtatteVurrderingerSomSkalSlettes.filter((slettetId) => slettetId !== id)
    );
  };

  return {
    valgtRad,
    velgRad,
    lagre,
    fjernRad,
    angreFjerning,
    mellomlagredeVurderinger,
    ikkeVedtatteVurrderingerSomSkalSlettes,
  };
}
