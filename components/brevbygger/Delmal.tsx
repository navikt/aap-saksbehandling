import { Box, Heading, HStack, Loader, Switch, Tag, VStack } from '@navikt/ds-react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { DelmalReferanse, FritekstType, ValgRef } from 'components/brevbygger/brevmodellTypes';
import { BrevFormVerdier } from 'components/brevbygger/types';
import { Valg } from 'components/brevbygger/Valg';
import { DelmalFritekst } from 'components/brevbygger/Fritekst';

import styles from './Delmal.module.css';
import { StandardtekstBoks } from 'components/brevbygger/StandardtekstBoks';
import { ValgDto } from 'lib/types/types';

interface Props {
  delmalRef: DelmalReferanse;
  control: Control<BrevFormVerdier>;
  delmalInnhold: string | undefined;
  isLoading: boolean;
  automatiskValgteValg?: ValgDto[];
  forhåndsvalgt?: boolean;
}

export const Delmal = ({
  delmalRef,
  control,
  delmalInnhold,
  isLoading,
  automatiskValgteValg,
  forhåndsvalgt = false,
}: Props) => {
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

  // Må returnere like mange elementer som definert i grid-definisjonen i Brevbygger
  return (
    <>
      {!visDelmalKomponent && <StandardtekstBoks />}
      {visDelmalKomponent && (
        <Box borderWidth="1" borderRadius="12" borderColor="neutral-subtle" background="default" id={delmalRef._key}>
          <Box
            paddingBlock="space-8"
            paddingInline="space-16"
            borderRadius={erValgt ? '12 12 0 0' : '12'}
            background={forhåndsvalgt && !obligatorisk ? 'brand-beige-soft' : 'default'}
          >
            <HStack justify="space-between">
              <Heading level="2" size="small">
                {delmal.brevbyggerTittel ?? delmal.beskrivelse}
              </Heading>
              {forhåndsvalgt && !obligatorisk && (
                <Tag variant={'outline'} data-color="brand-beige" size="small">
                  Forhåndsvalgt
                </Tag>
              )}
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
          </Box>
          {erValgt && (
            <Box paddingBlock="space-8" paddingInline="space-16" borderRadius="0 0 12 12" background="default">
              <VStack gap="space-16" marginBlock="space-8">
                {valgOgFritekst.map((node) => {
                  if (node._type === 'fritekst') {
                    return <DelmalFritekst key={node._key} node={node} control={control} delmalId={delmal._id} />;
                  }
                  return (
                    <Valg
                      key={node._key}
                      valgRef={node}
                      control={control}
                      automatiskValgteValg={automatiskValgteValg}
                    />
                  );
                })}
              </VStack>
            </Box>
          )}
        </Box>
      )}
      <div className={`${styles.delmal} ${isLoading ? styles.loading : ''}`}>
        {isLoading && (
          <div className={styles.loader}>
            <Loader transparent size={'3xlarge'} />
          </div>
        )}
        {delmalInnhold && <div dangerouslySetInnerHTML={{ __html: delmalInnhold }} />}
      </div>
    </>
  );
};
