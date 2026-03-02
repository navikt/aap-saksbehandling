'use client';

import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}

export const BekreftVurderingerOppfølging = ({ behandlingVersjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    'BEKREFT_VURDERINGER_OPPFØLGING'
  );

  return (
    <VilkårsKort heading={'Bekreft vurderinger'} steg={'BEKREFT_VURDERINGER_OPPFØLGING'}>
      {!readOnly && (
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
      )}

      <LøsBehovOgGåTilNesteStegStatusAlert
        status={status}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      />
    </VilkårsKort>
  );
};

  const behandlingsReferanse = useBehandlingsReferanse();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    'BEKREFT_VURDERINGER_OPPFØLGING'
  );

  const { visningActions, visningModus } = useVilkårskortVisning(readOnly, 'BEKREFT_VURDERINGER_OPPFØLGING', undefined);

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'Bekreft vurderinger'}
      steg={'BEKREFT_VURDERINGER_OPPFØLGING'}
      vilkårTilhørerNavKontor={false}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.BEKREFT_VURDERINGER_OPPFØLGING,
          },
          referanse: behandlingsReferanse,
        });
      }}
      knappTekst={'Bekreft vurderinger og send videre'}
      mellomlagretVurdering={undefined}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {}}
      onDeleteMellomlagringClick={undefined}
      onLagreMellomLagringClick={undefined}
    >
      <LøsBehovOgGåTilNesteStegStatusAlert
        status={status}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      />
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};
