import { Box, Heading, HGrid, HStack, Loader, Skeleton, Switch, VStack } from '@navikt/ds-react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { DelmalReferanse, FritekstType, ValgRef } from 'components/brevbygger/brevmodellTypes';
import { BrevFormVerdier } from 'components/brevbygger/types';
import { Valg } from 'components/brevbygger/Valg';
import { DelmalFritekst } from 'components/brevbygger/Fritekst';

import styles from './Delmal.module.css';
import { StandardtekstBoks } from 'components/brevbygger/StandardtekstBoks';

interface Props {
  delmalRef: DelmalReferanse;
  control: Control<BrevFormVerdier>;
  delmalInnhold: any;
  isLoading: boolean;
}

export const Delmal = ({ delmalRef, control, delmalInnhold, isLoading }: Props) => {
  const { delmal, obligatorisk } = delmalRef;

  const valgOgFritekst = delmal.teksteditor.filter(
    (node): node is ValgRef | FritekstType => node._type === 'valgRef' || node._type === 'fritekst'
  );
  const harValgEllerFritekst = valgOgFritekst.length > 0;

  const delmalErValgt = useWatch({
    control,
    name: `delmaler.${delmal._id}`,
  });

  const visDelmalKomponent = !obligatorisk || harValgEllerFritekst;
  // sjekker om denne delmalen er valgt eller er obligatorisk
  const erValgt = delmalErValgt || obligatorisk;

  return (
    <>
      <HGrid>
        {visDelmalKomponent === false && <StandardtekstBoks />}
        {visDelmalKomponent && (
          <Box
            borderWidth="1"
            borderRadius="12"
            paddingInline="space-16"
            paddingBlock="space-8"
            borderColor="neutral-subtle"
            background="default"
            id={delmalRef._key}
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
          </Box>
        )}
      </HGrid>
      {
        <div className={`${styles.delmal} ${isLoading ? styles.loading : ''}`}>
          {isLoading && (
            <div className={styles.loader}>
              <Loader transparent size={'3xlarge'} />
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: delmalInnhold }} />
        </div>
      }
    </>
  );
};
