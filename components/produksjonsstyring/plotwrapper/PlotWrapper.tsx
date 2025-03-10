import { ReactNode } from 'react';
import styles from './PlotWrapper.module.css';
import { VStack } from '@navikt/ds-react';

interface Props {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const PlotWrapper = ({ children, size }: Props) => {
  const sizeClass = size ? styles[size] : styles.small;
  return <VStack className={`${styles.plotWrapper} ${sizeClass}`}>{children}</VStack>;
};
