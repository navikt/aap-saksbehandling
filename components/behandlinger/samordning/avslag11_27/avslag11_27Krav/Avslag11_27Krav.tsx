'use client';

import { TasklistIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, VStack } from '@navikt/ds-react';
import { AccordionsSignal } from 'hooks/AccordionSignalHook';
import { Avslag11_27Grunnlag, Avslag11_27Vurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { subDays } from 'date-fns';

import { Avslag11_27FormFields } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';
import { Avslag11_27TidligereVurdering } from 'components/behandlinger/samordning/avslag11_27/avslag11_27tidligerevurdering/Avslag11_27TidligereVurdering';
import { Avslag11_27Vurdering as Avslag11_27VurderingSkjema } from 'components/behandlinger/samordning/avslag11_27/avslag11_27vurdering/Avslag11_27Vurdering';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';
import { skalVæreInitiellEkspandert } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';

import styles from 'components/behandlinger/samordning/avslag11_27/avslag11_27Krav/Avslag11_27Krav.module.css';
import { NyVurderingKortMedSlett } from 'components/periodisering/nyvurderingkortmedslett/NyVurderingKortMedSlett';

interface Props {
  form: UseFormReturn<Avslag11_27FormFields>;
  kravIndex: number;
  krav: Avslag11_27Grunnlag['krav'][0];
  vedtattVurdering?: Avslag11_27Vurdering | null;
  nåværendeVurdering?: Avslag11_27Vurdering | null;
  readonly: boolean;
  accordionsSignal: AccordionsSignal;
  erAktivUtenAvbryt: boolean;
  brukersYtelseAlternativer: string[];
  nesteKravSøknadsdato?: string;
  onSlettVurdering: (referanse: string) => void;
  onLeggTilVurdering: (referanse: string) => void;
}

const kravTypeLabels: Record<string, string> = {
  RELEVANT_KRAV: 'Nytt krav om AAP',
  TRUKKET_SØKNAD: 'Trukket søknad',
  KLAGE: 'Klage',
  TILLEGGSOPPLYSNING: 'Tilleggsopplysning',
};

function formaterKravType(type: string): string {
  return kravTypeLabels[type] ?? type;
}

export const Avslag11_27Krav = ({
  form,
  kravIndex,
  krav,
  vedtattVurdering,
  nåværendeVurdering,
  readonly,
  accordionsSignal,
  erAktivUtenAvbryt,
  brukersYtelseAlternativer,
  nesteKravSøknadsdato,
  onSlettVurdering,
  onLeggTilVurdering,
}: Props) => {
  const vurderingFormField = form.watch(`avslag11_27vurderinger.${kravIndex}.vurdering`);

  // Vis skjema direkte kun hvis det allerede finnes en nåværende vurdering å redigere
  const [visNyVurdering, setVisNyVurdering] = useState(!!nåværendeVurdering);

  const handleSlettNyVurdering = () => {
    form.setValue(`avslag11_27vurderinger.${kravIndex}.vurdering`, {
      referanse: krav.referanse,
      behøverVurdering: true,
      erNyVurdering: true,
      begrunnelse: '',
      harAnnenFullYtelse: undefined,
      brukersYtelse: undefined,
      brukersYtelseTom: undefined,
      harSykepengegrunnlagOver2G: undefined,
      harArbeidsgiverSykepengerUtbetaling: undefined,
      skalAvslås1127: undefined,
    });
    setVisNyVurdering(false);
    onSlettVurdering(krav.referanse);
  };

  const vurderingStatusForNyVurdering = (() => {
    if (vurderingFormField?.harAnnenFullYtelse === undefined) return undefined;
    if (vurderingFormField.harAnnenFullYtelse === JaEllerNei.Nei) return getErOppfyltEllerIkkeStatus(true);
    if (vurderingFormField.skalAvslås1127 === undefined) return undefined;
    return getErOppfyltEllerIkkeStatus(vurderingFormField.skalAvslås1127 === JaEllerNei.Nei);
  })();

  return (
    <Box
      background="default"
      padding="space-0"
      borderRadius="12"
      borderWidth="1"
      borderColor="neutral-subtle"
      className={styles.kravGruppe}
    >
      <Box background="neutral-soft" padding="space-12" className={styles.kravHeader}>
        <HStack gap="space-80" align="center" wrap>
          <HStack gap="space-16" align="center">
            <TasklistIcon fontSize="1.5rem" aria-hidden />
            <VStack gap="space-4">
              <BodyShort size="small" weight="semibold">
                Krav
              </BodyShort>
              <BodyShort size="small">{krav.søknadsdokument}</BodyShort>
            </VStack>
          </HStack>
          <VStack gap="space-4">
            <BodyShort size="small" weight="semibold">
              Type
            </BodyShort>
            <BodyShort size="small">{formaterKravType(krav.type)}</BodyShort>
          </VStack>
          <VStack gap="space-4">
            <BodyShort size="small" weight="semibold">
              Søknadsdato
            </BodyShort>
            <BodyShort size="small">{krav.søknadsdato ? formaterDatoForFrontend(krav.søknadsdato) : '-'}</BodyShort>
          </VStack>
          <VStack gap="space-4">
            <BodyShort size="small" weight="semibold">
              Mulig rett fra
            </BodyShort>
            <BodyShort size="small">
              {krav.muligRettighetFra ? formaterDatoForFrontend(krav.muligRettighetFra) : '-'}
            </BodyShort>
          </VStack>
        </HStack>
      </Box>
      <Box padding="space-16">
        <VStack gap="space-8">
          {vedtattVurdering && (
            <TidligereVurderingExpandableCard
              fom={new Date(krav.søknadsdato)}
              tom={nesteKravSøknadsdato ? subDays(new Date(nesteKravSøknadsdato), 1) : undefined}
              vurderingStatus={getErOppfyltEllerIkkeStatus(!vedtattVurdering.skalAvslås1127)}
              vurderingerMeta={vedtattVurdering.vurderingerMeta ?? {}}
              førsteNyePeriodeFraDato={undefined}
            >
              <Avslag11_27TidligereVurdering vurdering={vedtattVurdering} />
            </TidligereVurderingExpandableCard>
          )}

          {visNyVurdering && (
            <NyVurderingKortMedSlett
              accordionsSignal={accordionsSignal}
              fraDato={new Date(krav.søknadsdato)}
              nestePeriodeFraDato={nesteKravSøknadsdato ? new Date(nesteKravSøknadsdato) : null}
              isLast={!nesteKravSøknadsdato}
              vurderingStatus={vurderingStatusForNyVurdering}
              vurdering={{ ...vurderingFormField, behøverVurdering: false }}
              finnesFeil={false}
              onSlettVurdering={handleSlettNyVurdering}
              readonly={readonly}
              initiellEkspandert={skalVæreInitiellEkspandert(vurderingFormField?.erNyVurdering, erAktivUtenAvbryt)}
              visStrekVedManglendeTilDato={false}
            >
              <Avslag11_27VurderingSkjema
                form={form}
                kravIndex={kravIndex}
                readonly={readonly}
                brukersYtelseAlternativer={brukersYtelseAlternativer}
              />
            </NyVurderingKortMedSlett>
          )}

          {!visNyVurdering && !readonly && (
            <Button
              type="button"
              variant="secondary"
              size="small"
              className="fit-content"
              onClick={() => {
                setVisNyVurdering(true);
                onLeggTilVurdering(krav.referanse);
              }}
            >
              Legg til vurdering
            </Button>
          )}
        </VStack>
      </Box>
    </Box>
  );
};
