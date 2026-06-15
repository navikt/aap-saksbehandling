'use client';

import { BodyShort, Box, HStack, Label, VStack } from '@navikt/ds-react';
import { TasklistIcon } from '@navikt/aksel-icons';
import { UseFormReturn } from 'react-hook-form';
import { AccordionsSignal } from 'hooks/AccordionSignalHook';
import { Avslag11_27FormFields } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';
import { Avslag11_27Vurdering } from 'components/behandlinger/samordning/avslag11_27/avslag11_27vurdering/Avslag11_27Vurdering';
import { Avslag11_27Grunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import styles from './Avslag11_27KravGruppe.module.css';

interface Props {
  form: UseFormReturn<Avslag11_27FormFields>;
  kravIndex: number;
  krav: Avslag11_27Grunnlag['krav'][0];
  readonly: boolean;
  accordionsSignal: AccordionsSignal;
  erAktivUtenAvbryt: boolean;
}

export const Avslag11_27KravGruppe = ({ form, kravIndex, krav, readonly, accordionsSignal, erAktivUtenAvbryt }: Props) => {
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
        <Avslag11_27Vurdering form={form} kravIndex={kravIndex} readonly={readonly} />
      </Box>
    </Box>
  );
};
