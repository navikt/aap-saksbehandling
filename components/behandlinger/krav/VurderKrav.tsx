'use client';

import { BodyShort, Box, VStack } from '@navikt/ds-react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { KravGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';

import { KravTabell } from 'components/behandlinger/krav/KravTabell';
import { KravVurderingModal } from 'components/behandlinger/krav/KravVurderingModal';
import { LeggTilKravModal } from 'components/behandlinger/krav/LeggTilKravModal';
import { useKravVurderingerState } from 'components/behandlinger/krav/useKravVurderingerState';
import { VilkårskortMedMellomlagring } from 'components/vilkårskort/vilkårskortmedmellomlagring/VilkårskortMedMellomlagring';

type Props = {
  grunnlag?: KravGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const VurderKrav = ({ readOnly, grunnlag, behandlingVersjon, initialMellomlagretVurdering }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('KRAV');

  const {
    endredeVedtatte,
    endredeNye,
    slettedeNyeReferanser,
    lokaleNyeKrav,
    valgtVurdering,
    valgtLokalNyKey,
    visLeggTilModal,
    lukkVurderingModal,
    lukkLeggTilModal,
    handleEndreKrav,
    handleLagre,
    handleTilbakestill,
    handleSlettNyVurdering,
    handleLeggTilNy,
    handleLagreNy,
    handleEndreLokalNy,
    handleSlettLokalNy,
    mellomlagretVurdering,
    nullstill,
    slettMellomlagring,
    byggKravVurderinger,
  } = useKravVurderingerState({ grunnlag, initialMellomlagretVurdering });

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(readOnly, 'KRAV', mellomlagretVurdering);

  const handleBekreft = () => {
    løsBehovOgGåTilNesteSteg(
      {
        behandlingVersjon,
        referanse: behandlingsreferanse,
        behov: { behovstype: Behovstype.VURDER_KRAV_KODE, kravVurderinger: byggKravVurderinger() },
      },
      () => {
        visningActions.onBekreftClick();
        slettMellomlagring();
      }
    );
  };

  return (
    <VilkårskortMedMellomlagring
      heading="Vurder krav"
      steg="KRAV"
      vilkårTilhørerNavKontor={false}
      onBekreft={handleBekreft}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      mellomlagretVurdering={mellomlagretVurdering}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring();
        nullstill();
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      onNullstill={nullstill}
    >
      <VStack gap="space-16">
        {grunnlag?.søknaderUtenKravvurdering && grunnlag.søknaderUtenKravvurdering.length > 0 && (
          <Box>
            <BodyShort>Søknader som mangler vurdering: </BodyShort>
            {grunnlag?.søknaderUtenKravvurdering.map((søknad) => (
              <BodyShort key={søknad.journalpostId.identifikator}>
                {søknad.journalpostId.identifikator}: {formaterDatoForFrontend(søknad.mottattTidspunkt)}{' '}
              </BodyShort>
            ))}
          </Box>
        )}
        <KravTabell
          grunnlag={grunnlag}
          endredeVedtatte={endredeVedtatte}
          endredeNye={endredeNye}
          slettedeNyeReferanser={slettedeNyeReferanser}
          lokaleNyeKrav={lokaleNyeKrav}
          readOnly={formReadOnly}
          onEndreKrav={handleEndreKrav}
          onSlettNyVurdering={handleSlettNyVurdering}
          onEndreLokalNy={handleEndreLokalNy}
          onSlettLokalNy={handleSlettLokalNy}
          onLeggTilNy={handleLeggTilNy}
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
            søknaderUtenKravvurdering={
              !valgtVurdering.erVedtatt ? (grunnlag?.søknaderUtenKravvurdering ?? []) : undefined
            }
            onLagre={handleLagre}
            onTilbakestill={handleTilbakestill}
            onAvbryt={lukkVurderingModal}
          />
        )}
        {visLeggTilModal && (
          <LeggTilKravModal
            søknaderUtenKravvurdering={grunnlag?.søknaderUtenKravvurdering ?? []}
            initialLøsning={valgtLokalNyKey ? lokaleNyeKrav[valgtLokalNyKey] : undefined}
            onLagre={handleLagreNy}
            onAvbryt={lukkLeggTilModal}
          />
        )}
      </VStack>
    </VilkårskortMedMellomlagring>
  );
};
