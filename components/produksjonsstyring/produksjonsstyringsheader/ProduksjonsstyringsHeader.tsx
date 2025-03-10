'use client';

import { useContext } from 'react';
import { HStack, UNSAFE_Combobox } from '@navikt/ds-react';
// import { Enhet } from 'lib/types/types';
import styles from './ProduksjonsstyringsHeader.module.css';
import { Enhet } from 'lib/types/oppgaveTypes';
import { ValgteEnheterDispatchContext } from 'components/oppgave/valgteenheterprovider/ValgteEnheterProvider';

interface Props {
  enheter: Array<Enhet>;
}
export const ProduksjonsstyringsHeader = ({ enheter }: Props) => {
  const valgteEnheterDispatch = useContext(ValgteEnheterDispatchContext);
  return (
    <HStack className={styles.produksjonsstyringsHeader} justify={'end'} padding={'1'}>
      <UNSAFE_Combobox
        label={'Valgt enhet'}
        options={enheter.map((e) => ({ value: e.enhetNr, label: e.navn }))}
        size={'small'}
        onToggleSelected={(val: string) =>
          valgteEnheterDispatch && valgteEnheterDispatch({ type: 'SET_ENHETER', payload: [val] })
        }
      />
    </HStack>
  );
};
