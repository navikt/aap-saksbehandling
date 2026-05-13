import { Box, Button, Heading, HStack, Switch, VStack } from '@navikt/ds-react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { DelmalReferanse, FritekstType, ValgRef } from 'components/brevbygger/brevmodellTypes';
import { BrevFormVerdier } from 'components/brevbygger/types';
import { Valg } from 'components/brevbygger/Valg';
import { DelmalFritekst } from 'components/brevbygger/Fritekst';
import { EyeIcon, EyeObfuscatedIcon } from '@navikt/aksel-icons';

import styles from './Delmal.module.css';

interface Props {
  delmalRef: DelmalReferanse;
  control: Control<BrevFormVerdier>;
  erMarkert: boolean;
  onToggleMarkering: () => void;
}

export const Delmal = ({ delmalRef, control, erMarkert, onToggleMarkering }: Props) => {
  const { delmal, obligatorisk } = delmalRef;

  const valgOgFritekst = delmal.teksteditor.filter(
    (node): node is ValgRef | FritekstType => node._type === 'valgRef' || node._type === 'fritekst'
  );
  const harValgEllerFritekst = valgOgFritekst.length > 0;

  if (obligatorisk && !harValgEllerFritekst) {
    return null;
  }

  const delmalErValgt = useWatch({
    control,
    name: `delmaler.${delmal._id}`,
  });

  // sjekker om denne delmalen er valgt eller er obligatorisk
  const erValgt = delmalErValgt || obligatorisk;

  return (
    <Box
      borderWidth="1"
      borderRadius="12"
      paddingInline="space-16"
      paddingBlock="space-8"
      borderColor="neutral-subtle"
      background="default"
      id={delmalRef._key}
      className={erMarkert ? `${styles.markertDelmal} ${styles.delmal}` : `${styles.delmal}`}
    >
      <HStack justify="space-between">
        <Heading level="2" size="small">
          {delmal.beskrivelse}
        </Heading>

        {!obligatorisk && (
          <Controller
            name={`delmaler.${delmal._id}`}
            control={control}
            render={({ field }) => (
              <Switch onChange={field.onChange} checked={field.value} hideLabel size="small" position="right">
                Inkluder i brev
              </Switch>
            )}
          />
        )}
      </HStack>
      {erValgt && (
        <VStack gap="space-16" marginBlock="space-8">
          {valgOgFritekst.map((node) => {
            if (node._type === 'fritekst') {
              return <DelmalFritekst key={node._key} node={node} control={control} />;
            }
            return <Valg key={node._key} valgRef={node} control={control} />;
          })}
        </VStack>
      )}
      <Button
        variant={'tertiary'}
        type={'button'}
        size={'small'}
        onClick={onToggleMarkering}
        icon={erMarkert ? <EyeObfuscatedIcon /> : <EyeIcon />}
      >
        {erMarkert ? 'Skjul markering' : 'Vis i brev'}
      </Button>
    </Box>
  );
};
