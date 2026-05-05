import { MellomlagretVurdering, StegType } from 'lib/types/types';
import styles from './VilkårskortPeriodisert.module.css';
import { Button, Detail, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { PlusIcon } from '@navikt/aksel-icons';
import { ErrorList } from 'lib/utils/formerrors';
import { FormErrorSummary } from 'components/formerrorsummary/FormErrorSummary';
import { Dispatch, FormEvent, ReactNode, SetStateAction } from 'react';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';
import { VisningActions, VisningModus } from 'lib/types/visningTypes';

interface VilkårsKortPeriodisertProps {
  heading: string;
  steg: StegType;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  status: LøsBehovOgGåTilNesteStegStatus;
  løsBehovOgGåTilNesteStegError: ApiException | undefined;
  knappTekst?: string;
  vilkårTilhørerNavKontor: boolean;
  visningModus: VisningModus;
  visningActions: VisningActions;
  onDeleteMellomlagringClick: (() => void) | undefined;
  mellomlagretVurdering: MellomlagretVurdering | undefined;
  formReset: () => void;
  vurdertAutomatisk?: boolean;
  onLeggTilVurdering?: () => void;
  errorList: ErrorList;
  bekreftOgFortsett?: () => void;
  visOverstyrTildelingModal?: boolean;
  setVisOverstyrTildelingModal?: Dispatch<SetStateAction<boolean>>;
  reservertAvNavn?: string;
  formOnBlur?: () => void;
}

export const VilkårskortPeriodisert = ({
  heading,
  steg,
  children,
  onSubmit,
  isLoading,
  status,
  løsBehovOgGåTilNesteStegError,
  vilkårTilhørerNavKontor,
  knappTekst = 'Bekreft',
  vurdertAutomatisk = false,
  onDeleteMellomlagringClick,
  mellomlagretVurdering,
  visningModus,
  visningActions,
  onLeggTilVurdering,
  formReset,
  errorList,
  formOnBlur,
}: VilkårsKortPeriodisertProps) => {
  const classNameBasertPåEnhet = vilkårTilhørerNavKontor ? styles.vilkårsKortNAV : styles.vilkårsKortNAY;
  const erAktivtSteg = visningModus === 'AKTIV_UTEN_AVBRYT' || visningModus === 'AKTIV_MED_AVBRYT';

  const readOnly = visningModus === 'LÅST_MED_ENDRE' || visningModus === 'LÅST_UTEN_ENDRE';

  return (
    <VStack
      padding={'space-12'} // TODO Fiks denne slik at padding over og under er 0 når kortet ikke er aktivt
      gap={'space-4'}
      aria-label={heading}
      className={`${erAktivtSteg ? classNameBasertPåEnhet : styles.vilkårsKort}`}
    >
      <HGrid columns={'1fr'} paddingBlock={'space-4'}>
        <Heading level={'3'} size={'small'} data-testid="vilkår-heading">
          {heading}
        </Heading>
      </HGrid>
      <VStack>
        <form onSubmit={onSubmit} id={steg} autoComplete="off" onBlur={formOnBlur}>
          <VStack gap="space-16">
            {/* innhold i vilkårskortet */}
            <VStack style={{ borderTop: '1px solid lightgray' }} paddingBlock={'space-16 space-0'}>
              {children}
            </VStack>

            {/* Status / feil */}
            <LøsBehovOgGåTilNesteStegStatusAlert
              løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
              status={status}
            />

            <FormErrorSummary errorList={errorList} />

            <HStack justify="space-between" align="end">
              {/* Venstre kolonne: knapper + utkast */}
              <VStack gap="space-16">
                <HStack gap="space-16">
                  {/* Modus-styrte knapper */}
                  {visningModus === 'AKTIV_UTEN_AVBRYT' && (
                    <>
                      <Button loading={isLoading}>{knappTekst}</Button>
                      {onLeggTilVurdering && (
                        <Button variant={'secondary'} icon={<PlusIcon />} onClick={onLeggTilVurdering} type="button">
                          Legg til ny vurdering
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
                            onDeleteMellomlagringClick && mellomlagretVurdering && onDeleteMellomlagringClick();
                          }}
                        >
                          Avbryt
                        </Button>
                      )}
                      {onLeggTilVurdering && (
                        <Button variant={'secondary'} icon={<PlusIcon />} onClick={onLeggTilVurdering} type="button">
                          Legg til ny vurdering
                        </Button>
                      )}
                    </>
                  )}

                  {visningModus === 'LÅST_MED_ENDRE' && (
                    <Button
                      type="button"
                      variant={'secondary'}
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

              <VStack align="baseline" paddingBlock={'space-8 space-0'}>
                {vurdertAutomatisk && <Detail>Vurdert automatisk</Detail>}
              </VStack>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </VStack>
  );
};
