'use client';

import { BodyShort, Box, HStack, Label, VStack } from '@navikt/ds-react';
import { TasklistIcon } from '@navikt/aksel-icons';
import { UseFormReturn } from 'react-hook-form';
import { AccordionsSignal } from 'hooks/AccordionSignalHook';
import { Avslag11_27FormFields } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';
import { Avslag11_27Vurdering } from 'components/behandlinger/samordning/avslag11_27/avslag11_27vurdering/Avslag11_27Vurdering';
import { Avslag11_27Grunnlag } from 'lib/types/types';
import { Avslag11_27TidligereVurdering } from 'components/behandlinger/samordning/avslag11_27/avslag11_27tidligerevurdering/Avslag11_27TidligereVurdering';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';
import { formaterDatoForFrontend } from 'lib/utils/date';
import styles from './Avslag11_27KravGruppe.module.css';
import { getTrueFalseEllerUndefined } from 'lib/utils/form';

interface Props {
  form: UseFormReturn<Avslag11_27FormFields>;
  kravIndex: number;
  krav: Avslag11_27Grunnlag['krav'][0];
  tidligereVurdering?: Avslag11_27Grunnlag['vedtatteVurdering'][0] | null;
  readonly: boolean;
  accordionsSignal: AccordionsSignal;
  erAktivUtenAvbryt: boolean;
}

export const Avslag11_27KravGruppe = ({
  form,
  kravIndex,
  krav,
  tidligereVurdering,
  readonly,
  accordionsSignal,
  erAktivUtenAvbryt,
}: Props) => {
  const vurderingFormField = form.watch(`avslag11_27vurderinger.${kravIndex}.vurdering`);

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
          {tidligereVurdering && (
            <TidligereVurderingExpandableCard
              fom={krav.søknadsdato ? new Date(krav.søknadsdato) : new Date()} //FIXME Thao: Kan søknadsdato være null?
              vurderingStatus={getErOppfyltEllerIkkeStatus(!tidligereVurdering.skalAvslås1127)}
              vurderingerMeta={tidligereVurdering.vurderingerMeta}
              tom={undefined}
              førsteNyePeriodeFraDato={undefined}
            >
              <Avslag11_27TidligereVurdering vurdering={tidligereVurdering} />
            </TidligereVurderingExpandableCard>
          )}
          <NyVurderingExpandableCard
            accordionsSignal={accordionsSignal}
            fraDato={krav.søknadsdato ? new Date(krav.søknadsdato) : new Date()} //FIXME Thao: Kan søknadsdato være null?
            nestePeriodeFraDato={null}
            isLast={true}
            vurderingStatus={getErOppfyltEllerIkkeStatus(
              getTrueFalseEllerUndefined(vurderingFormField?.skalAvslås1127)
            )}
            vurdering={vurderingFormField}
            harTidligereVurderinger={!!tidligereVurdering}
            finnesFeil={false}
            onSlettVurdering={() => {}}
            index={0}
            readonly={readonly}
            initiellEkspandert={skalVæreInitiellEkspandert(vurderingFormField?.erNyVurdering, erAktivUtenAvbryt)}
          >
            <Avslag11_27Vurdering form={form} kravIndex={kravIndex} readonly={readonly} />
          </NyVurderingExpandableCard>
        </VStack>
      </Box>
    </Box>
  );
};
