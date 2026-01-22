'use client';

import { Button, Detail, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { MellomlagretVurdering, StegType, VurdertAvAnsatt } from 'lib/types/types';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { formaterDatoForFrontend, formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';

import styles from 'components/vilkårskort/Vilkårskort.module.css';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { VisningActions, VisningModus } from 'hooks/saksbehandling/visning/VisningHook';
import { FormEvent, ReactNode } from 'react';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';
import { StegType as PostmottakStegType } from 'lib/types/postmottakTypes';

export interface VilkårsKortMedFormOgMellomlagringProps {
  heading: string;
  steg: StegType | PostmottakStegType;
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
  visningModus: VisningModus;
  visningActions: VisningActions;
  onDeleteMellomlagringClick: (() => void) | undefined;
  onLagreMellomLagringClick: (() => void) | undefined;
  mellomlagretVurdering: MellomlagretVurdering | undefined;
  extraActions?: ReactNode;
  formReset: (() => void) | undefined;
}

export const VilkårskortMedFormOgMellomlagringNyVisning = ({
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
  onDeleteMellomlagringClick,
  onLagreMellomLagringClick,
  mellomlagretVurdering,
  visningModus,
  visningActions,
  extraActions,
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
          <VStack gap="4">
            {/* innhold i vilkårskortet */}
            {children}

            {/* Status / feil */}
            <LøsBehovOgGåTilNesteStegStatusAlert
              løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
              status={status}
            />

            <HStack justify="space-between" align="end">
              {/* Venstre kolonne: knapper + utkast */}
              <VStack gap="4">
                <HStack gap="4">
                  {/* Modus-styrte knapper */}
                  {visningModus === 'AKTIV_UTEN_AVBRYT' && (
                    <>
                      <Button loading={isLoading}>{knappTekst}</Button>
                      {extraActions != null && extraActions}
                      {onLagreMellomLagringClick && (
                        <Button type="button" variant="tertiary" onClick={onLagreMellomLagringClick}>
                          Lagre utkast
                        </Button>
                      )}
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
                            formReset && formReset();
                          }}
                        >
                          Avbryt
                        </Button>
                      )}
                      {extraActions != null && extraActions}
                      {onLagreMellomLagringClick && (
                        <Button type="button" variant="tertiary" onClick={onLagreMellomLagringClick}>
                          Lagre utkast
                        </Button>
                      )}
                    </>
                  )}

                  {visningModus === 'LÅST_MED_ENDRE' && (
                    <Button type="button" variant={'secondary'} onClick={visningActions.onEndreClick}>
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
              <VStack align="baseline">
                {vurdertAutomatisk && <Detail>Vurdert automatisk</Detail>}
                {vurdertAvAnsatt && (
                  <Detail>
                    {`Vurdert av ${utledVurdertAv(vurdertAvAnsatt)}, ${formaterDatoForFrontend(vurdertAvAnsatt.dato)}`}
                  </Detail>
                )}
                {kvalitetssikretAv && (
                  <Detail>
                    {`Kvalitetssikret av ${utledVurdertAv(kvalitetssikretAv)}, ${formaterDatoForFrontend(
                      kvalitetssikretAv.dato
                    )}`}
                  </Detail>
                )}
              </VStack>
            </HStack>
          </VStack>
        </form>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};

function utledVurdertAv(vurdertAvAnsatt: VurdertAvAnsatt): string {
  return vurdertAvAnsatt.ansattnavn ? vurdertAvAnsatt.ansattnavn : vurdertAvAnsatt.ident;
}
