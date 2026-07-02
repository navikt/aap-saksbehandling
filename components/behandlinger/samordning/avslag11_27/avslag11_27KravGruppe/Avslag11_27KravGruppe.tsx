'use client';

import { BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { TasklistIcon } from '@navikt/aksel-icons';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { AccordionsSignal } from 'hooks/AccordionSignalHook';
import { Avslag11_27FormFields } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';
import { Avslag11_27Vurdering as Avslag11_27VurderingSkjema } from 'components/behandlinger/samordning/avslag11_27/avslag11_27vurdering/Avslag11_27Vurdering';
import { Avslag11_27Grunnlag, Avslag11_27Vurdering } from 'lib/types/types';
import { Avslag11_27TidligereVurdering } from 'components/behandlinger/samordning/avslag11_27/avslag11_27tidligerevurdering/Avslag11_27TidligereVurdering';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';
import styles from './Avslag11_27KravGruppe.module.css';

interface Props {
  form: UseFormReturn<Avslag11_27FormFields>;
  kravIndex: number;
  krav: Avslag11_27Grunnlag['krav'][0];
  vedtattVurdering?: Avslag11_27Vurdering | null;
  nåværendeVurdering?: Avslag11_27Vurdering | null;
  readonly: boolean;
  accordionsSignal: AccordionsSignal;
  erAktivUtenAvbryt: boolean;
  visLeggTilVurderingKnapp: boolean;
  brukersYtelseAlternativer: string[];
}

export const Avslag11_27KravGruppe = ({
  form,
  kravIndex,
  krav,
  vedtattVurdering,
  nåværendeVurdering,
  readonly,
  accordionsSignal,
  erAktivUtenAvbryt,
  visLeggTilVurderingKnapp,
  brukersYtelseAlternativer,
}: Props) => {
  const vurderingFormField = form.watch(`avslag11_27vurderinger.${kravIndex}.vurdering`);

  // Vis skjema direkte hvis: ikke revurdering ELLER nåværende vurdering finnes
  const [visNyVurdering, setVisNyVurdering] = useState(!visLeggTilVurderingKnapp || !!nåværendeVurdering);

  const handleSlettNyVurdering = () => {
    form.setValue(`avslag11_27vurderinger.${kravIndex}.vurdering`, {
      referanse: krav.referanse,
      behøverVurdering: true,
      erNyVurdering: true,
      begrunnelse: '',
      harAnnenFullYtelse: undefined,
      brukersYtelse: undefined,
      harSykepengegrunnlagOver2G: undefined,
      skalAvslås1127: undefined,
    });
    setVisNyVurdering(false);
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
        <HStack gap="space-16" align="center">
          <TasklistIcon fontSize="1.5rem" aria-hidden />
          <div>
            <BodyShort className={styles.detailgray} size="small">
              {krav.søknadsdato ? formaterDatoForFrontend(krav.søknadsdato) : '-'}
            </BodyShort>
            <Label size="medium">Vurder krav {krav.søknadsdokument}</Label>
          </div>
        </HStack>
      </Box>
      <Box padding="space-16">
        <VStack gap="space-8">
          {vedtattVurdering && (
            <TidligereVurderingExpandableCard
              fom={krav.søknadsdato ? new Date(krav.søknadsdato) : new Date()}
              vurderingStatus={getErOppfyltEllerIkkeStatus(!vedtattVurdering.skalAvslås1127)}
              vurderingerMeta={vedtattVurdering.vurderingerMeta ?? {}}
              tom={undefined}
              førsteNyePeriodeFraDato={undefined}
            >
              <Avslag11_27TidligereVurdering vurdering={vedtattVurdering} />
            </TidligereVurderingExpandableCard>
          )}

          {visNyVurdering && (
            <NyVurderingExpandableCard
              accordionsSignal={accordionsSignal}
              fraDato={new Date(krav.søknadsdato)}
              nestePeriodeFraDato={null}
              isLast={true}
              vurderingStatus={vurderingStatusForNyVurdering}
              vurdering={vurderingFormField}
              harTidligereVurderinger={!!vedtattVurdering}
              finnesFeil={false}
              onSlettVurdering={handleSlettNyVurdering}
              index={vedtattVurdering ? 1 : 0}
              readonly={readonly}
              initiellEkspandert={skalVæreInitiellEkspandert(vurderingFormField?.erNyVurdering, erAktivUtenAvbryt)}
            >
              <Avslag11_27VurderingSkjema
                form={form}
                kravIndex={kravIndex}
                readonly={readonly}
                brukersYtelseAlternativer={brukersYtelseAlternativer}
              />
            </NyVurderingExpandableCard>
          )}

          {visLeggTilVurderingKnapp && !visNyVurdering && !readonly && (
            <Button
              type="button"
              variant="secondary"
              size="small"
              className="fit-content"
              onClick={() => setVisNyVurdering(true)}
            >
              Legg til vurdering
            </Button>
          )}
        </VStack>
      </Box>
    </Box>
  );
};
