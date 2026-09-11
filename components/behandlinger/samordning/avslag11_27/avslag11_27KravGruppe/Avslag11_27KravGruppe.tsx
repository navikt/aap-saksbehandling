'use client';

import { TasklistIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, HStack, Label, VStack } from '@navikt/ds-react';
import { AccordionsSignal } from 'hooks/AccordionSignalHook';
import { Avslag11_27Grunnlag, Avslag11_27Vurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';
import { UseFormReturn } from 'react-hook-form';
import { subDays } from 'date-fns';

import {
  Avslag11_27FormFields,
  mapVurderingTilKravVurderingFormField,
} from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';
import { Avslag11_27TidligereVurdering } from 'components/behandlinger/samordning/avslag11_27/avslag11_27tidligerevurdering/Avslag11_27TidligereVurdering';
import { Avslag11_27Vurdering as Avslag11_27VurderingSkjema } from 'components/behandlinger/samordning/avslag11_27/avslag11_27vurdering/Avslag11_27Vurdering';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';

import styles from './Avslag11_27KravGruppe.module.css';

interface Props {
  form: UseFormReturn<Avslag11_27FormFields>;
  kravIndex: number;
  krav: Avslag11_27Grunnlag['krav'][0];
  vedtattVurdering?: Avslag11_27Vurdering | null;
  readonly: boolean;
  accordionsSignal: AccordionsSignal;
  erAktivUtenAvbryt: boolean;
  brukersYtelseAlternativer: string[];
  nesteKravSøknadsdato?: string;
  visNyVurdering?: boolean;
  lukkTeller?: number;
  onSlettVurdering: () => void;
}

export const Avslag11_27KravGruppe = ({
  form,
  kravIndex,
  krav,
  vedtattVurdering,
  readonly,
  accordionsSignal,
  erAktivUtenAvbryt,
  brukersYtelseAlternativer,
  nesteKravSøknadsdato,
  visNyVurdering,
  lukkTeller,
  onSlettVurdering,
}: Props) => {
  const vurderingFormField = form.watch(`avslag11_27vurderinger.${kravIndex}.vurdering`);

  const handleSlettNyVurdering = () => {
    form.setValue(
      `avslag11_27vurderinger.${kravIndex}.vurdering`,
      mapVurderingTilKravVurderingFormField(krav.referanse, null)
    );
    onSlettVurdering();
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
        <HStack gap="space-16" align="center" justify="space-between">
          <HStack gap="space-16" align="center">
            <TasklistIcon fontSize="1.5rem" aria-hidden />
            <div>
              <BodyShort className={styles.detailgray} size="small">
                {krav.søknadsdato ? formaterDatoForFrontend(krav.søknadsdato) : '-'}
              </BodyShort>
              <Label size="medium">Vurder krav {krav.søknadsdokument}</Label>
            </div>
          </HStack>
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
            <NyVurderingExpandableCard
              key={`${krav.referanse}-${lukkTeller ?? 0}`}
              accordionsSignal={accordionsSignal}
              fraDato={new Date(krav.søknadsdato)}
              nestePeriodeFraDato={nesteKravSøknadsdato ? new Date(nesteKravSøknadsdato) : null}
              isLast={!nesteKravSøknadsdato}
              vurderingStatus={vurderingStatusForNyVurdering}
              vurdering={{ ...vurderingFormField, behøverVurdering: false }}
              harTidligereVurderinger={!!vedtattVurdering}
              finnesFeil={false}
              onSlettVurdering={handleSlettNyVurdering}
              index={vedtattVurdering ? 1 : 0}
              readonly={readonly}
              initiellEkspandert={
                lukkTeller ? false : skalVæreInitiellEkspandert(vurderingFormField?.erNyVurdering, erAktivUtenAvbryt)
              }
            >
              <Avslag11_27VurderingSkjema
                form={form}
                kravIndex={kravIndex}
                readonly={readonly}
                brukersYtelseAlternativer={brukersYtelseAlternativer}
              />
            </NyVurderingExpandableCard>
          )}
        </VStack>
      </Box>
    </Box>
  );
};
