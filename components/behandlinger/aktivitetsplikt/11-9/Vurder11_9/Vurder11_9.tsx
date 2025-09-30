'use client';
import React from 'react';
import { Button, Heading, VStack } from '@navikt/ds-react';
import { Registrer11_9BruddTabell } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Registrer11_9BruddTabell';
import { Vurder11_9Grunnlag } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { PlusIcon } from '@navikt/aksel-icons';
import { Mellomlagre11_9Modal } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Mellomlagre11_9Modal';
import { MellomlagretVurdering } from 'lib/types/types';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { defaultRad, useMellomlagre11_9 } from './Mellomlagre11_9Hook';
import { Behovstype } from 'lib/utils/form';

type Props = {
  grunnlag?: Vurder11_9Grunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const Vurder11_9 = ({ readOnly, grunnlag, initialMellomlagretVurdering, behandlingVersjon }: Props) => {
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
    nullstillMellomlagretVurdering,
  } = useMellomlagre11_9(tidligereVurderinger, vurderingerSendtTilBeslutter, initialMellomlagretVurdering);

  const handleSubmit = () => {
    løsBehovOgGåTilNesteSteg(
      {
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.VURDER_BRUDD_11_9_KODE,
          // @ts-ignore TODO: Implementer backend
          aktivitetsplikt11_9Vurdering: {
            mellomlagredeVurderinger: mellomlagredeVurderinger,
            vurderingerSendtTilBeslutterSomSkalSlettes: vurderingerSendtTilBeslutterSomSkalSlettes,
          },
        },
      },
      () => nullstillMellomlagretVurdering()
    );
  };

  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_AKTIVITETSPLIKT_11_9');

  return (
    <VilkårsKort
      heading={'§ 11-9 Reduksjon av AAP etter brudd på aktivitetsplikt'}
      steg={'VURDER_AKTIVITETSPLIKT_11_9'}
    >
      <Heading level={'3'} size={'xsmall'}>
        Brudd på aktivitetsplikten § 11-9
      </Heading>
      <VStack gap={'4'}>
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
        <Button
          type="button"
          variant="tertiary"
          className="fit-content"
          icon={<PlusIcon aria-hidden />}
          onClick={() => velgRad(defaultRad)}
          disabled={readOnly}
        >
          Legg til brudd
        </Button>
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
