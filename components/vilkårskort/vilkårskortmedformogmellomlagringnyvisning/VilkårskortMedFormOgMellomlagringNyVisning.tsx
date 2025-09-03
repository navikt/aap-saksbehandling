'use client';

import { Button, Detail, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { MellomlagretVurdering, VurdertAvAnsatt } from 'lib/types/types';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { formaterDatoForFrontend, formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';

import styles from 'components/vilkårskort/Vilkårskort.module.css';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { isProd } from 'lib/utils/environment';
import { VilkårsKortMedFormProps } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';
import { VisningActions, VisningModus } from 'hooks/saksbehandling/visning/VisningHook';

export interface VilkårsKortMedFormOgMellomlagringProps extends VilkårsKortMedFormProps {
  onDeleteMellomlagringClick: () => void;
  onLagreMellomLagringClick: () => void;
  mellomlagretVurdering: MellomlagretVurdering | undefined;
  modus: VisningModus;
  actions: VisningActions;
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
  modus,
  actions,
}: VilkårsKortMedFormOgMellomlagringProps) => {
  const classNameBasertPåEnhet = vilkårTilhørerNavKontor ? styles.vilkårsKortNAV : styles.vilkårsKortNAY;
  const { flyt } = useRequiredFlyt();
  const erAktivtSteg = flyt.aktivtSteg === steg || modus === 'AKTIV_MED_VURDERING';

  const readOnly = modus === 'LÅST_MED_ENDRE' || modus === 'LÅST_UTEN_ENDRE';

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
            {/* Skjemainnhold */}
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
                  {modus === 'AKTIV_UTEN_VURDERING' && (
                    <>
                      <Button loading={isLoading}>{knappTekst}</Button>
                      {onLagreMellomLagringClick && (
                        <Button type="button" variant="tertiary" onClick={onLagreMellomLagringClick}>
                          Lagre utkast
                        </Button>
                      )}
                    </>
                  )}

                  {modus === 'AKTIV_MED_VURDERING' && (
                    <>
                      <Button loading={isLoading}>{knappTekst}</Button>
                      {actions && (
                        <Button type="button" variant="secondary" onClick={actions.avbrytEndringClick}>
                          Avbryt
                        </Button>
                      )}
                      {onLagreMellomLagringClick && (
                        <Button type="button" variant="tertiary" onClick={onLagreMellomLagringClick}>
                          Lagre utkast
                        </Button>
                      )}
                    </>
                  )}

                  {modus === 'LÅST_MED_ENDRE' && (
                    <Button type="button" variant={'secondary'} onClick={actions.onEndreClick}>
                      Endre
                    </Button>
                  )}

                  {modus === 'LÅST_UTEN_ENDRE' && null}
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
                {kvalitetssikretAv && !isProd() && (
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
