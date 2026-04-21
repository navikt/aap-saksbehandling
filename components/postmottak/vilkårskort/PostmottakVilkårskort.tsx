'use client';

import { Button, ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';

import styles from './VilkårsKort.module.css';
import { usePostmottakRequiredFlyt } from 'hooks/postmottak/PostmottakFlytHook';
import { FormEvent, ReactNode } from 'react';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';
import { StegType as PostmottakStegType } from 'lib/types/postmottakTypes';
import { VisningActions, VisningModus } from 'lib/types/visningTypes';

interface PostmottakVilkårskortProps {
  heading: string;
  steg: PostmottakStegType;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  status: LøsBehovOgGåTilNesteStegStatus;
  løsBehovOgGåTilNesteStegError: ApiException | undefined;
  knappTekst: string;
  visningModus: VisningModus;
  visningActions: VisningActions;
  formReset: () => void;
}

export const PostmottakVilkårskort = ({
  heading,
  steg,
  children,
  onSubmit,
  isLoading,
  status,
  løsBehovOgGåTilNesteStegError,
  knappTekst,
  visningModus,
  visningActions,
  formReset,
}: PostmottakVilkårskortProps) => {
  const { flyt } = usePostmottakRequiredFlyt();
  const erAktivtSteg = flyt.aktivtSteg === steg || visningModus === 'AKTIV_MED_AVBRYT';

  return (
    <ExpansionCard
      aria-label={heading}
      className={erAktivtSteg ? styles.blå : styles.vilkårsKort}
      size="small"
      defaultOpen={true}
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
                            formReset && formReset();
                          }}
                        >
                          Avbryt
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
              </VStack>
            </HStack>
          </VStack>
        </form>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
