import { MellomlagretVurdering, StegType, VurderingerMeta } from 'lib/types/types';
import styles from './VilkårskortPeriodisert.module.css';
import vilkårskortStyles from 'components/vilkårskort/Vilkårskort.module.css';
import { Button, Detail, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { PlusIcon } from '@navikt/aksel-icons';
import { ErrorList } from 'lib/utils/formerrors';
import { FormErrorSummary } from 'components/formerrorsummary/FormErrorSummary';
import { Dispatch, ReactNode, SetStateAction, SubmitEventHandler } from 'react';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from 'lib/utils/api';
import { VisningActions, VisningModus } from 'lib/types/visningTypes';
import { VurdertAvAnsattDetail } from 'components/vurdertav/VurdertAvAnsattDetail';
import { useFlyt } from 'hooks/saksbehandling/FlytHook';
import { UtkastInfo } from 'components/vilkårskort/utkastinfo/UtkastInfo';

interface VilkårsKortPeriodisertProps {
  heading: string;
  steg: StegType;
  children: ReactNode;
  onSubmit: SubmitEventHandler;
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
  vurderingerMeta?: VurderingerMeta;
  onLeggTilVurdering?: () => void;
  errorList: ErrorList;
  bekreftOgFortsett?: () => void;
  visOverstyrTildelingModal?: boolean;
  setVisOverstyrTildelingModal?: Dispatch<SetStateAction<boolean>>;
  reservertAvNavn?: string;
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
  vurderingerMeta = {},
  onDeleteMellomlagringClick,
  mellomlagretVurdering,
  visningModus,
  visningActions,
  onLeggTilVurdering,
  formReset,
  errorList,
}: VilkårsKortPeriodisertProps) => {
  const { flyt } = useFlyt();
  const classNameBasertPåEnhet = vilkårTilhørerNavKontor ? styles.vilkårsKortNAV : styles.vilkårsKortNAY;
  const erAktivtSteg = visningModus === 'AKTIV_UTEN_AVBRYT' || visningModus === 'AKTIV_MED_AVBRYT';
  const readOnly = visningModus === 'LÅST_MED_ENDRE' || visningModus === 'LÅST_UTEN_ENDRE';
  const skalViseUtkastLayouver = !!mellomlagretVurdering && readOnly && flyt?.visning.visVentekort;

  return (
    <VStack
      padding={'space-12'}
      gap={'space-4'}
      role="region"
      aria-label={skalViseUtkastLayouver ? `${heading} – Utkast` : heading}
      className={`${skalViseUtkastLayouver ? vilkårskortStyles.utkast : ''} ${erAktivtSteg ? classNameBasertPåEnhet : styles.vilkårsKort}`}
    >
      {skalViseUtkastLayouver && (
        <div className={vilkårskortStyles.utkastOverlay} aria-hidden="true">
          Utkast
        </div>
      )}
      <HGrid columns={'1fr'} paddingBlock={'space-4'}>
        <Heading level={'3'} size={'small'} data-testid="vilkår-heading">
          {heading}
        </Heading>
      </HGrid>
      <VStack>
        <form onSubmit={onSubmit} id={steg} autoComplete="off">
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

                <UtkastInfo
                  mellomlagretVurdering={mellomlagretVurdering}
                  readOnly={readOnly}
                  onDeleteMellomlagringClick={onDeleteMellomlagringClick}
                />
              </VStack>

              <VStack align="baseline" paddingBlock={'space-8 space-0'}>
                {vurderingerMeta.vurdertAutomatisk && <Detail>Vurdert automatisk</Detail>}
                <VurdertAvAnsattDetail vurdertAv={vurderingerMeta.vurdertAv} variant={'VURDERING'} />
                <VurdertAvAnsattDetail vurdertAv={vurderingerMeta.kvalitetssikretAv} variant={'KVALITETSSIKRER'} />
                <VurdertAvAnsattDetail vurdertAv={vurderingerMeta.besluttetAv} variant={'BESLUTTER'} />
                <VurdertAvAnsattDetail vurdertAv={vurderingerMeta.trukketAv} variant={'TRUKKET'} />
              </VStack>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </VStack>
  );
};
