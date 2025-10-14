'use client';

import { Button, Detail, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { MellomlagretVurdering, VurdertAvAnsatt } from 'lib/types/types';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { formaterDatoForFrontend, formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';

import styles from 'components/vilkårskort/Vilkårskort.module.css';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { VilkårsKortMedFormProps } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';

export interface VilkårsKortMedFormOgMellomlagringProps extends VilkårsKortMedFormProps {
  onDeleteMellomlagringClick: () => void;
  onLagreMellomLagringClick: () => void;
  mellomlagretVurdering: MellomlagretVurdering | undefined;
}

/** @deprecated Bruk vilkårskortMedFormOgMellomlagringNyVisning */
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
  visBekreftKnapp,
  vurdertAvAnsatt,
  vurdertAutomatisk = false,
  kvalitetssikretAv,
  onDeleteMellomlagringClick,
  onLagreMellomLagringClick,
  mellomlagretVurdering,
  readOnly,
}: VilkårsKortMedFormOgMellomlagringProps) => {
  const classNameBasertPåEnhet = vilkårTilhørerNavKontor ? styles.vilkårsKortNAV : styles.vilkårsKortNAY;
  const { flyt } = useRequiredFlyt();
  const erAktivtSteg = flyt.aktivtSteg === steg;

  return (
    <ExpansionCard
      aria-label={heading}
      className={erAktivtSteg ? classNameBasertPåEnhet : styles.vilkårsKort}
      size={'small'}
      defaultOpen={defaultOpen}
      id={steg}
    >
      <ExpansionCard.Header className={styles.header}>
        <div className={styles.title}>
          <ExpansionCard.Title size={'small'} data-testid="vilkår-heading">
            {heading}
          </ExpansionCard.Title>
        </div>
      </ExpansionCard.Header>
      <ExpansionCard.Content className={styles.content}>
        <form onSubmit={onSubmit} id={steg} autoComplete={'off'}>
          <VStack gap={'4'}>
            {children}
            <LøsBehovOgGåTilNesteStegStatusAlert
              løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
              status={status}
            />
            <HStack justify={'space-between'} align={'end'}>
              <VStack gap={'4'}>
                <HStack gap={'4'}>
                  {visBekreftKnapp && <Button loading={isLoading}>{knappTekst}</Button>}

                  {!readOnly && (
                    <Button type={'button'} size={'small'} variant={'tertiary'} onClick={onLagreMellomLagringClick}>
                      Lagre utkast
                    </Button>
                  )}
                </HStack>

                {!readOnly && mellomlagretVurdering && (
                  <HStack align={'baseline'}>
                    <Detail>{`Utkast lagret ${formaterDatoMedTidspunktForFrontend(mellomlagretVurdering.vurdertDato)} (${mellomlagretVurdering.vurdertAv})`}</Detail>
                    <Button
                      style={{ marginTop: '-5px', marginBottom: '-5px' }}
                      type={'button'}
                      size={'small'}
                      variant={'tertiary'}
                      onClick={onDeleteMellomlagringClick}
                    >
                      Slett utkast
                    </Button>
                  </HStack>
                )}
              </VStack>
              <VStack align={'baseline'}>
                {vurdertAutomatisk && <Detail>Vurdert automatisk</Detail>}
                {vurdertAvAnsatt && (
                  <Detail>
                    {`Vurdert av ${utledVurdertAv(vurdertAvAnsatt)}, ${formaterDatoForFrontend(vurdertAvAnsatt.dato)}`}
                  </Detail>
                )}
                {kvalitetssikretAv && (
                  <Detail>
                    {`Kvalitetssikret av ${utledVurdertAv(kvalitetssikretAv)}, ${formaterDatoForFrontend(kvalitetssikretAv.dato)}`}
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
