import { ReactNode } from 'react';

import styles from './Kort.module.css';
interface Props {
  children: ReactNode;
}
export const Kort = ({ children }: Props) => <section className={styles.kort}>{children}</section>;
