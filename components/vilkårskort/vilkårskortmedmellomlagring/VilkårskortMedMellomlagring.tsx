'use client';

import { Button, Detail, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { MellomlagretVurdering, StegType, VurderingerMeta } from 'lib/types/types';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';

import styles from 'components/vilkårskort/Vilkårskort.module.css';
import { useFlyt } from 'hooks/saksbehandling/FlytHook';
import { ReactNode } from 'react';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';
import { VisningActions, VisningModus } from 'lib/types/visningTypes';
import { VurdertAvAnsattDetail } from 'components/vurdertav/VurdertAvAnsattDetail';

export interface VilkårskortMedMellomlagringProps {
  heading: string;
  steg: StegType;
  children: ReactNode;
  onBekreft: () => void;
  isLoading: boolean;
  status: LøsBehovOgGåTilNesteStegStatus;
  løsBehovOgGåTilNesteStegError: ApiException | undefined;
  knappTekst?: string;
  defaultOpen?: boolean;
  vilkårTilhørerNavKontor: boolean;
  vurderingerMeta?: VurderingerMeta;
  visningModus: VisningModus;
  visningActions: VisningActions;
  onDeleteMellomlagringClick: () => void;
  mellomlagretVurdering: MellomlagretVurdering | undefined;
  onNullstill: () => void;
}

export const VilkårskortMedMellomlagring = ({
  heading,
  steg,
  children,
  onBekreft,
  isLoading,
  status,
  løsBehovOgGåTilNesteStegError,
  vilkårTilhørerNavKontor,
  knappTekst = 'Bekreft',
  defaultOpen = true,
  vurderingerMeta,
  onDeleteMellomlagringClick,
  mellomlagretVurdering,
  visningModus,
  visningActions,
  onNullstill,
}: VilkårskortMedMellomlagringProps) => {
  const classNameBasertPåEnhet = vilkårTilhørerNavKontor ? styles.vilkårsKortNAV : styles.vilkårsKortNAY;
  const { flyt } = useFlyt();
  const erAktivtSteg = flyt?.aktivtSteg === steg || visningModus === 'AKTIV_MED_AVBRYT';

  const readOnly = visningModus === 'LÅST_MED_ENDRE' || visningModus === 'LÅST_UTEN_ENDRE';

  return (
    <ExpansionCard
      aria-label={heading}
      className={erAktivtSteg ? classNameBasertPåEnhet : styles.vilkårsKort}
      size="small"
      defaultOpen={defaultOpen}
      id={steg}
    >
      <ExpansionCard.Header className={styles.header}>
        <div className={styles.title}>
          <ExpansionCard.Title size="small" data-testid="vilkår-heading">
            {heading}
          </ExpansionCard.Title>
        </div>
      </ExpansionCard.Header>
      <ExpansionCard.Content className={styles.content}>
        <VStack gap="space-16">
          {children}

          <LøsBehovOgGåTilNesteStegStatusAlert
            løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
            status={status}
          />

          <HStack justify="space-between" align="end">
            <VStack gap="space-16">
              <HStack gap="space-16">
                {visningModus === 'AKTIV_UTEN_AVBRYT' && (
                  <Button type="button" loading={isLoading} onClick={onBekreft}>
                    {knappTekst}
                  </Button>
                )}

                {visningModus === 'AKTIV_MED_AVBRYT' && (
                  <>
                    <Button type="button" loading={isLoading} onClick={onBekreft}>
                      {knappTekst}
                    </Button>
                    {visningActions && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          visningActions.avbrytEndringClick();
                          if (mellomlagretVurdering) onDeleteMellomlagringClick();
                          onNullstill();
                        }}
                      >
                        Avbryt
                      </Button>
                    )}
                  </>
                )}

                {visningModus === 'LÅST_MED_ENDRE' && (
                  <Button
                    type="button"
                    variant="secondary"
                    data-color="accent"
                    onClick={visningActions.onEndreClick}
                    loading={isLoading}
                  >
                    Endre
                  </Button>
                )}

                {visningModus === 'LÅST_UTEN_ENDRE' && null}
              </HStack>

              {!readOnly && mellomlagretVurdering && (
                <HStack align="baseline">
                  <Detail>
                    {`Utkast lagret ${formaterDatoMedTidspunktForFrontend(
                      mellomlagretVurdering.vurdertDato
                    )} (${mellomlagretVurdering.vurdertAv})`}
                  </Detail>
                  <Button type="button" size="small" variant="tertiary" onClick={onDeleteMellomlagringClick}>
                    Slett utkast
                  </Button>
                </HStack>
              )}
            </VStack>

            <VStack align="end">
              {vurderingerMeta?.vurdertAutomatisk && <Detail>Vurdert automatisk</Detail>}
              <VurdertAvAnsattDetail vurdertAv={vurderingerMeta?.vurdertAv} variant={'VURDERING'} />
              <VurdertAvAnsattDetail vurdertAv={vurderingerMeta?.kvalitetssikretAv} variant={'KVALITETSSIKRER'} />
              <VurdertAvAnsattDetail vurdertAv={vurderingerMeta?.besluttetAv} variant={'BESLUTTER'} />
              <VurdertAvAnsattDetail vurdertAv={vurderingerMeta?.trukketAv} variant={'TRUKKET'} />
            </VStack>
          </HStack>
        </VStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
