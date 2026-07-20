'use client';
import React from 'react';
import { Button } from '@navikt/ds-react/Button';
import { VStack } from '@navikt/ds-react/Stack';
import { Heading } from '@navikt/ds-react/Typography';
import { Registrer11_9BruddTabell } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Registrer11_9BruddTabell';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { PlusIcon } from '@navikt/aksel-icons';
import { Mellomlagre11_9Modal } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Mellomlagre11_9Modal';
import { Aktivitetsplikt11_9Grunnlag, Aktivitetsplikt11_9Løsning, MellomlagretVurdering } from 'lib/types/types';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { defaultRad, useMellomlagre11_9 } from './Mellomlagre11_9Hook';
import { Behovstype } from 'lib/utils/form';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { Vurdering11_9 } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import { omit } from 'lodash';

type Props = {
  grunnlag?: Aktivitetsplikt11_9Grunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const Vurder11_9 = ({ readOnly, grunnlag, initialMellomlagretVurdering, behandlingVersjon }: Props) => {
  const vedtatteGjeldendeVurderinger: Vurdering11_9[] =
    grunnlag?.vedtatteVurderinger.map((v) => ({
      ...v,
      id: crypto.randomUUID(),
    })) ?? [];
  const vurderingerSendtTilBeslutter =
    grunnlag?.vurderinger.map((v) => ({
      ...v,
      id: v.dato,
    })) ?? [];
  const { behandlingsreferanse } = useParamsMedType();

  const { valgtRad, velgRad, mellomlagreVurdering, fjernRad, mellomlagredeVurderinger } = useMellomlagre11_9(
    vurderingerSendtTilBeslutter,
    initialMellomlagretVurdering
  );

  const handleSubmit = () => {
    const vurderingerSomSendesInn: Aktivitetsplikt11_9Løsning[] = mellomlagredeVurderinger.map((vurdering) => ({
      ...omit(vurdering, 'id'),
    }));

    løsBehovOgGåTilNesteSteg({
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsreferanse,
      behov: {
        behovstype: Behovstype.VURDER_BRUDD_11_9_KODE,
        aktivitetsplikt11_9Vurderinger: vurderingerSomSendesInn,
      },
    });
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
      <VStack gap={'space-16'}>
        <Registrer11_9BruddTabell
          tidligereVurderinger={vedtatteGjeldendeVurderinger}
          mellomlagredeVurderinger={mellomlagredeVurderinger}
          valgtRad={valgtRad}
          velgRad={velgRad}
          fjernRad={fjernRad}
          readOnly={readOnly}
        />
        {valgtRad && (
          <Mellomlagre11_9Modal valgtRad={valgtRad} lagre={mellomlagreVurdering} avbryt={() => velgRad(undefined)} />
        )}
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
