import { ReactNode } from 'react';
import styles from './PlotWrapper.module.css';
import { VStack } from '@navikt/ds-react';

interface Props {
  children: ReactNode;
}

export const PlotWrapper = ({ children }: Props) => {
  return <VStack className={styles.plotWrapper}>{children}</VStack>;
};
