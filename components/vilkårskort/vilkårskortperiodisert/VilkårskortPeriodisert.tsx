import { MellomlagretVurdering, VurdertAvAnsatt } from 'lib/types/types';
import { VisningActions, VisningModus } from 'hooks/saksbehandling/visning/VisningHook';
import styles from './VilkårskortPeriodisert.module.css';
import { Button, Detail, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { formaterDatoForFrontend, formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { PlusIcon } from '@navikt/aksel-icons';
import { ErrorList } from 'lib/utils/formerrors';
import { FormErrorSummary } from 'components/formerrorsummary/FormErrorSummary';
import { VilkårsKortMedFormOgMellomlagringProps } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

export interface VilkårsKortPeriodisertProps extends VilkårsKortMedFormOgMellomlagringProps {
  onDeleteMellomlagringClick: () => void;
  onLagreMellomLagringClick: () => void;
  mellomlagretVurdering: MellomlagretVurdering | undefined;
  visningModus: VisningModus;
  visningActions: VisningActions;
  onLeggTilVurdering: () => void;
  errorList: ErrorList;
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
  vurdertAvAnsatt,
  vurdertAutomatisk = false,
  kvalitetssikretAv,
  onDeleteMellomlagringClick,
  onLagreMellomLagringClick,
  mellomlagretVurdering,
  visningModus,
  visningActions,
  onLeggTilVurdering,
  formReset,
  errorList,
}: VilkårsKortPeriodisertProps) => {
  const classNameBasertPåEnhet = vilkårTilhørerNavKontor ? styles.vilkårsKortNAV : styles.vilkårsKortNAY;
  const erAktivtSteg = visningModus === 'AKTIV_UTEN_AVBRYT' || visningModus === 'AKTIV_MED_AVBRYT';

  const readOnly = visningModus === 'LÅST_MED_ENDRE' || visningModus === 'LÅST_UTEN_ENDRE';

  return (
    <VStack
      padding={'3'}
      gap={'1'}
      aria-label={heading}
      className={`${erAktivtSteg ? classNameBasertPåEnhet : styles.vilkårsKort}`}
    >
      <HGrid columns={'1fr'} paddingBlock={'3'}>
        <Heading level={'3'} size={'small'} data-testid="vilkår-heading">
          {heading}
        </Heading>
      </HGrid>

      <VStack>
        <form onSubmit={onSubmit} id={steg} autoComplete="off">
          <VStack gap="4">
            {/* innhold i vilkårskortet */}
            <VStack style={{ borderTop: '1px solid lightgray' }} paddingBlock={'4 0'}>
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
              <VStack gap="4">
                <HStack gap="4">
                  {/* Modus-styrte knapper */}
                  {visningModus === 'AKTIV_UTEN_AVBRYT' && (
                    <>
                      <Button loading={isLoading}>{knappTekst}</Button>
                      {onLeggTilVurdering && (
                        <Button variant={'secondary'} icon={<PlusIcon />} onClick={onLeggTilVurdering} type="button">
                          Legg til ny vurdering
                        </Button>
                      )}
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
                      {onLeggTilVurdering && (
                        <Button variant={'secondary'} icon={<PlusIcon />} onClick={onLeggTilVurdering} type="button">
                          Legg til ny vurdering
                        </Button>
                      )}
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
              <VStack align="baseline" paddingBlock={'2 0'}>
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
      </VStack>
    </VStack>
  );
};

function utledVurdertAv(vurdertAvAnsatt: VurdertAvAnsatt): string {
  return vurdertAvAnsatt.ansattnavn ? vurdertAvAnsatt.ansattnavn : vurdertAvAnsatt.ident;
}
