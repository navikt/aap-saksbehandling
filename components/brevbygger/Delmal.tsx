import { useState } from 'react';
import { Box, Button, Heading, HStack, Loader, Switch, VStack } from '@navikt/ds-react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { DelmalReferanse, FritekstType, ValgRef } from 'components/brevbygger/brevmodellTypes';
import { BrevFormVerdier } from 'components/brevbygger/types';
import { Valg } from 'components/brevbygger/Valg';
import { DelmalFritekst } from 'components/brevbygger/Fritekst';

import styles from './Delmal.module.css';
import { StandardtekstBoks } from 'components/brevbygger/StandardtekstBoks';
import { ChevronDownIcon, ChevronUpIcon } from 'components/DsClient';

interface Props {
  delmalRef: DelmalReferanse;
  control: Control<BrevFormVerdier>;
  delmalInnhold: string | undefined;
  isLoading: boolean;
}

const ReadOnlyView = ({ children }: { children: React.ReactNode }) => {
  const [showAll, toggleShowAll] = useState<boolean>(false);
  return (
    <div className={styles.readonlyWrapper}>
      <div className={showAll ? '' : styles.readonlyFade} style={{ position: 'relative' }}>
        {children}
      </div>
      <VStack>
        <Button
          variant={'tertiary'}
          onClick={() => toggleShowAll(!showAll)}
          icon={showAll ? <ChevronUpIcon aria-label="Skjul" /> : <ChevronDownIcon aria-label="Vis" />}
        />
      </VStack>
    </div>
  );
};

const SanityDelmal = ({ isLoading, delmalInnhold }: { isLoading: boolean; delmalInnhold: string | undefined }) => {
  return (
    <div className={`${styles.delmal} ${isLoading ? styles.loading : ''}`}>
      {isLoading && (
        <div className={styles.loader}>
          <Loader transparent size={'3xlarge'} />
        </div>
      )}
      {delmalInnhold && <div dangerouslySetInnerHTML={{ __html: delmalInnhold }} />}
    </div>
  );
};

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

  if (!visDelmalKomponent) {
    return (
      <>
        <StandardtekstBoks />
        <ReadOnlyView>
          <SanityDelmal isLoading={isLoading} delmalInnhold={delmalInnhold} />
        </ReadOnlyView>
      </>
    );
  }

  // Må returnere like mange elementer som definert i grid-definisjonen i Brevbygger
  return (
    <>
      {!visDelmalKomponent && <StandardtekstBoks />}
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
      <SanityDelmal isLoading={isLoading} delmalInnhold={delmalInnhold} />
    </>
  );
};
