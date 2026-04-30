'use client';

import { Button, Detail, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { MellomlagretVurdering, StegType, VurdertAvAnsatt } from 'lib/types/types';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';

import styles from 'components/vilkårskort/Vilkårskort.module.css';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { FormEvent, ReactNode } from 'react';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';
import { VisningActions, VisningModus } from 'lib/types/visningTypes';
import { VurdertAvAnsattDetail } from 'components/vurdertav/VurdertAvAnsattDetail';

export interface VilkårsKortMedFormOgMellomlagringProps {
  heading: string;
  steg: StegType;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  status: LøsBehovOgGåTilNesteStegStatus;
  løsBehovOgGåTilNesteStegError: ApiException | undefined;
  knappTekst?: string;
  defaultOpen?: boolean;
  vilkårTilhørerNavKontor: boolean;
  vurdertAvAnsatt?: VurdertAvAnsatt;
  vurdertAutomatisk?: boolean;
  kvalitetssikretAv?: VurdertAvAnsatt;
  besluttetAv?: VurdertAvAnsatt;
  visningModus: VisningModus;
  visningActions: VisningActions;
  onDeleteMellomlagringClick: () => void;
  mellomlagretVurdering: MellomlagretVurdering | undefined;
  formReset: () => void;
}

export const VilkårskortMedFormOgMellomlagring = ({
  heading,
  steg,
  children,
  onSubmit,
  isLoading,
  status,
  løsBehovOgGåTilNesteStegError,
  vilkårTilhørerNavKontor,
  knappTekst = 'Bekreft',
  defaultOpen = true,
  vurdertAvAnsatt,
  vurdertAutomatisk = false,
  kvalitetssikretAv,
  besluttetAv,
  onDeleteMellomlagringClick,
  mellomlagretVurdering,
  visningModus,
  visningActions,
  formReset,
}: VilkårsKortMedFormOgMellomlagringProps) => {
  const classNameBasertPåEnhet = vilkårTilhørerNavKontor ? styles.vilkårsKortNAV : styles.vilkårsKortNAY;
  const { flyt } = useRequiredFlyt();
  const erAktivtSteg = flyt.aktivtSteg === steg || visningModus === 'AKTIV_MED_AVBRYT';

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
        <form onSubmit={onSubmit} id={steg} autoComplete="off">
          <VStack gap="space-16">
            {/* innhold i vilkårskortet */}
            {children}

            {/* Status / feil */}
            <LøsBehovOgGåTilNesteStegStatusAlert
              løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
              status={status}
            />

            <HStack justify="space-between" align="end">
              {/* Venstre kolonne: knapper + utkast */}
              <VStack gap="space-16">
                <HStack gap="space-16">
                  {/* Modus-styrte knapper */}
                  {visningModus === 'AKTIV_UTEN_AVBRYT' && (
                    <>
                      <Button loading={isLoading}>{knappTekst}</Button>
                    </>
                  )}

                  {visningModus === 'AKTIV_MED_AVBRYT' && (
                    <>
                      <Button loading={isLoading}>{knappTekst}</Button>
                      {visningActions && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            visningActions.avbrytEndringClick();
                            onDeleteMellomlagringClick && mellomlagretVurdering && onDeleteMellomlagringClick();
                            formReset && formReset();
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
                      variant={'secondary'}
                      data-color={'accent'}
                      onClick={visningActions.onEndreClick}
                      loading={isLoading}
                    >
                      Endre
                    </Button>
                  )}

                  {visningModus === 'LÅST_UTEN_ENDRE' && null}
                </HStack>

                {/* Utkast-info */}
                {!readOnly && mellomlagretVurdering && onDeleteMellomlagringClick && (
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

              {/* Høyre kolonne: vurdert av / kvalitetssikret av */}
              <VStack align="end">
                {vurdertAutomatisk && <Detail>Vurdert automatisk</Detail>}
                <VurdertAvAnsattDetail vurdertAv={vurdertAvAnsatt} variant={'VURDERING'} />
                <VurdertAvAnsattDetail vurdertAv={kvalitetssikretAv} variant={'KVALITETSSIKRER'} />
                <VurdertAvAnsattDetail vurdertAv={besluttetAv} variant={'BESLUTTER'} />
              </VStack>
            </HStack>
          </VStack>
        </form>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
